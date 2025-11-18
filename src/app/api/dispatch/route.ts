import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/prisma";

const DispatchSchema = z.object({
	request_id: z.coerce.number().int().positive(),
	ambulance_id: z.coerce.number().int().positive(),
	dispatch_status: z.enum(["dispatched", "cancelled"]),
});

const DispatchUpdateSchema = z.object({
	dispatch_id: z.coerce.number().int().positive(),
	dispatch_status: z.enum(["dispatched", "cancelled"]).optional(),
	dispatched_on: z.coerce.date().optional(),
});

const DispatchDeleteSchema = z.object({
	dispatch_id: z.coerce.number().int().positive(),
});

// READ
export async function GET() {
	// retrieves all columns from the table
	try {
		const dispatches = await prisma.dispatch.findMany({
			include: {
				request: {
					include: {
						patient: {
							select: {
								name: true,
							},
						},
					},
				},
			},
		});
		return NextResponse.json(dispatches);
	} catch (error) {
		console.error("GET /dispatch error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// CREATE
export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validated = DispatchSchema.parse(body);

		// 1. Verify request exists and is pending
		const request = await prisma.request.findUnique({
			where: { request_id: validated.request_id },
			include: {
				patient: true,
				reference_location: true,
				hospital: true,
			},
		});

		if (!request) {
			return NextResponse.json({ error: "Request not found" }, { status: 404 });
		}

		if (request.request_status !== "pending") {
			return NextResponse.json(
				{ error: "Request must be pending to create dispatch" },
				{ status: 400 }
			);
		}

		// 2. Verify ambulance exists and is available
		const ambulance = await prisma.ambulance.findUnique({
			where: { ambulance_id: validated.ambulance_id },
		});

		if (!ambulance) {
			return NextResponse.json(
				{ error: "Ambulance not found" },
				{ status: 404 }
			);
		}

		if (ambulance.ambulance_status !== "available") {
			return NextResponse.json(
				{
					error: `Ambulance is not available (current status: ${ambulance.ambulance_status})`,
				},
				{ status: 400 }
			);
		}

		// 3. Verify ambulance has active preassigns (must have staff assigned)
		const activePreassigns = await prisma.preassign.findMany({
			where: {
				ambulance_id: validated.ambulance_id,
				assignment_status: "active",
			},
		});

		// Debug: Check all preassigns for this ambulance
		const allPreassigns = await prisma.preassign.findMany({
			where: {
				ambulance_id: validated.ambulance_id,
			},
		});

		console.log(
			`Ambulance ${validated.ambulance_id} preassigns:`,
			allPreassigns
		);

		if (activePreassigns.length === 0) {
			return NextResponse.json(
				{
					error: `Ambulance must have active staff assignments before dispatch. Found ${allPreassigns.length} total preassign(s) but none are active.`,
					debug: allPreassigns.map((p) => ({
						staff_id: p.staff_id,
						status: p.assignment_status,
					})),
				},
				{ status: 400 }
			);
		}

		// 4. Create dispatch, accept request, update patient priority, mark preassigns as completed, and update ambulance/patient/staff status in a transaction
		const result = await prisma.$transaction(async (tx) => {
			const newDispatch = await tx.dispatch.create({
				data: validated,
			});

			// Accept the request and update patient priority
			await tx.request.update({
				where: { request_id: validated.request_id },
				data: { request_status: "accepted" },
			});

			// Update patient priority to match request priority
			await tx.patient.update({
				where: { patient_id: request.patient_id },
				data: {
					priority_level: request.priority_level,
					transfer_status: "in_transfer",
				},
			});

			// Mark all active preassigns for this ambulance as completed
			await tx.preassign.updateMany({
				where: {
					ambulance_id: validated.ambulance_id,
					assignment_status: "active",
				},
				data: {
					assignment_status: "completed",
					updated_on: new Date(),
				},
			});

			// Update ambulance status to on_trip
			await tx.ambulance.update({
				where: { ambulance_id: validated.ambulance_id },
				data: { ambulance_status: "on_trip" },
			});

			// Update staff status to in_transfer
			const staffIds = activePreassigns.map((p) => p.staff_id);
			await tx.staff.updateMany({
				where: { staff_id: { in: staffIds } },
				data: { staff_status: "in_transfer" },
			});

			return newDispatch;
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
		console.error("CREATE /dispatch error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// UPDATE
export async function PUT(req: Request) {
	try {
		const body = await req.json();
		const validated = DispatchUpdateSchema.parse(body);
		const { dispatch_id, ...data } = validated;

		// If marking as dispatched, also mark preassigns as completed
		if (data.dispatch_status === "dispatched") {
			// Get the dispatch to find ambulance_id
			const dispatch = await prisma.dispatch.findUnique({
				where: { dispatch_id },
			});

			if (!dispatch) {
				return NextResponse.json(
					{ error: "Dispatch not found" },
					{ status: 404 }
				);
			}

			const result = await prisma.$transaction(async (tx) => {
				// Update dispatch
				const updatedDispatch = await tx.dispatch.update({
					where: { dispatch_id },
					data,
				});

				// Mark all active preassigns for this ambulance as completed
				await tx.preassign.updateMany({
					where: {
						ambulance_id: dispatch.ambulance_id,
						assignment_status: "active",
					},
					data: {
						assignment_status: "completed",
						updated_on: new Date(),
					},
				});

				return updatedDispatch;
			});

			return NextResponse.json(result);
		}

		// Normal update without preassign changes
		const updatedDispatch = await prisma.dispatch.update({
			where: { dispatch_id },
			data,
		});
		return NextResponse.json(updatedDispatch);
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
		console.error("UPDATE /dispatch error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// DELETE
export async function DELETE(req: Request) {
	try {
		const body = await req.json();
		const { dispatch_id } = DispatchDeleteSchema.parse(body);

		const deletedDispatch = await prisma.dispatch.delete({
			where: { dispatch_id },
		});
		return NextResponse.json(deletedDispatch);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
		console.error("DELETE /dispatch error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}
