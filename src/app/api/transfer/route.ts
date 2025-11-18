import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/prisma";

const TransferSchema = z.object({
	dispatch_id: z.coerce.number().int().positive(),
	staff_id: z.coerce.number().int().positive(),
	hospital_id: z.coerce.number().int().positive(),
});

const TransferUpdateSchema = z.object({
	transfer_id: z.coerce.number().int().positive(),
	transfer_status: z.enum(["transferred"]).optional(),
});

const TransferDeleteSchema = z.object({
	transfer_id: z.coerce.number().int().positive(),
});

// READ
export async function GET() {
	// retrieves all columns from the table
	try {
		const transfers = await prisma.transfer.findMany();
		return NextResponse.json(transfers);
	} catch (error) {
		console.error("GET /transfer error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// CREATE - Complete Patient Transfer Transaction
export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validated = TransferSchema.parse(body);
		const { dispatch_id, staff_id, hospital_id } = validated;

		// 1. Read the patient dispatch record to confirm dispatch_status = "dispatched"
		const dispatch = await prisma.dispatch.findUnique({
			where: { dispatch_id },
			include: {
				request: {
					include: {
						patient: true,
						reference_location: true,
					},
				},
				ambulance: true,
			},
		});

		if (!dispatch) {
			return NextResponse.json(
				{ error: "Dispatch not found" },
				{ status: 404 }
			);
		}

		if (dispatch.dispatch_status !== "dispatched") {
			return NextResponse.json(
				{
					error: `Dispatch must be in 'dispatched' status, currently: ${dispatch.dispatch_status}`,
				},
				{ status: 400 }
			);
		}

		// 2. Read the patient record to verify that the patient exists
		const patient = dispatch.request.patient;
		if (!patient) {
			return NextResponse.json(
				{ error: "Patient not found in dispatch request" },
				{ status: 404 }
			);
		}

		// 3. Read the ambulance record to confirm that the ambulance assigned to the dispatch matches
		const ambulance = dispatch.ambulance;
		if (!ambulance) {
			return NextResponse.json(
				{ error: "Ambulance not found in dispatch" },
				{ status: 404 }
			);
		}

		// 4. Read the staff record to verify that the staff exists
		const staff = await prisma.staff.findUnique({
			where: { staff_id },
		});

		if (!staff) {
			return NextResponse.json({ error: "Staff not found" }, { status: 404 });
		}

		// Verify staff is assigned to this ambulance via preassign
		const preassignment = await prisma.preassign.findFirst({
			where: {
				staff_id,
				ambulance_id: ambulance.ambulance_id,
				assignment_status: { in: ["active", "completed"] },
			},
		});

		if (!preassignment) {
			return NextResponse.json(
				{ error: "Staff is not assigned to this ambulance" },
				{ status: 400 }
			);
		}

		// 5. Read the hospital record to ensure that the receiving hospital_id exists
		const hospital = await prisma.hospital.findUnique({
			where: { hospital_id },
		});

		if (!hospital) {
			return NextResponse.json(
				{ error: "Hospital not found" },
				{ status: 404 }
			);
		}

		// Verify the hospital matches the request's destination hospital
		if (dispatch.request.hospital_id !== hospital_id) {
			return NextResponse.json(
				{
					error: `Hospital ID mismatch: request destination is hospital ${dispatch.request.hospital_id}, provided ${hospital_id}`,
				},
				{ status: 400 }
			);
		}

		// 6. Record the patient transfer completion and update transfer_status in a transaction
		const result = await prisma.$transaction(async (tx) => {
			// Create transfer record
			const newTransfer = await tx.transfer.create({
				data: {
					patient_id: patient.patient_id,
					ambulance_id: ambulance.ambulance_id,
					staff_id,
					hospital_id,
					priority_level: dispatch.request.priority_level,
					transfer_status: "transferred",
					transferred_on: new Date(),
				},
			});

			// Update patient transfer_status
			await tx.patient.update({
				where: { patient_id: patient.patient_id },
				data: { transfer_status: "transferred" },
			});

			// Update ambulance status back to available
			await tx.ambulance.update({
				where: { ambulance_id: ambulance.ambulance_id },
				data: { ambulance_status: "available" },
			});

			// Update staff status back to available
			await tx.staff.update({
				where: { staff_id },
				data: { staff_status: "available" },
			});

			// Mark all staff assigned to this ambulance as available
			const ambulanceStaff = await tx.preassign.findMany({
				where: {
					ambulance_id: ambulance.ambulance_id,
					assignment_status: "completed",
				},
			});

			for (const preassign of ambulanceStaff) {
				await tx.staff.update({
					where: { staff_id: preassign.staff_id },
					data: { staff_status: "available" },
				});
			}

			// Mark the request as cancelled (transfer completed)
			await tx.request.update({
				where: { request_id: dispatch.request_id },
				data: { request_status: "cancelled" },
			});

			return newTransfer;
		});

		return NextResponse.json(result);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const fieldErrors = error.issues
				.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
				.join(", ");
			return NextResponse.json(
				{ error: `Validation failed: ${fieldErrors}`, details: error.issues },
				{ status: 400 }
			);
		}
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		console.error("CREATE /transfer error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// UPDATE
export async function PUT(req: Request) {
	try {
		const body = await req.json();
		const validated = TransferUpdateSchema.parse(body);
		const { transfer_id, ...data } = validated;

		const updatedTransfer = await prisma.transfer.update({
			where: { transfer_id },
			data,
		});
		return NextResponse.json(updatedTransfer);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errors = error.issues.map(
				(issue) => `${issue.path.join(".")}: ${issue.message}`
			);
			return NextResponse.json(
				{ error: "Validation failed", details: errors },
				{ status: 400 }
			);
		}
		console.error("UPDATE /transfer error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// DELETE
export async function DELETE(req: Request) {
	try {
		const body = await req.json();
		const { transfer_id } = TransferDeleteSchema.parse(body);

		const deletedTransfer = await prisma.transfer.delete({
			where: { transfer_id },
		});
		return NextResponse.json(deletedTransfer);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errors = error.issues.map(
				(issue) => `${issue.path.join(".")}: ${issue.message}`
			);
			return NextResponse.json(
				{ error: "Validation failed", details: errors },
				{ status: 400 }
			);
		}
		console.error("DELETE /transfer error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}
