import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/prisma";

const DispatchSchema = z.object({
	request_id: z.coerce.number().int().positive(),
	ambulance_id: z.coerce.number().int().positive(),
	dispatch_status: z
		.enum(["completed", "dispatched", "cancelled"])
		.optional()
		.default("dispatched"),
});

const DispatchUpdateSchema = z.object({
	dispatch_id: z.coerce.number().int().positive(),
	dispatch_status: z.enum(["completed", "dispatched", "cancelled"]).optional(),
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
						hospital: {
							select: {
								hospital_id: true,
								hospital_name: true,
								city: true,
							},
						},
					},
				},
				ambulance: {
					select: {
						plate_no: true,
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

		// Check for existing dispatch for this request
		const existingDispatch = await prisma.dispatch.findFirst({
			where: {
				request_id: validated.request_id,
				dispatch_status: { not: "cancelled" },
			},
		});

		if (existingDispatch) {
			return NextResponse.json(
				{
					error: "A dispatch already exists for this request",
				},
				{ status: 400 }
			);
		}

		// 2. Verify ambulance exists and is available
		const ambulance = await prisma.ambulance.findUnique({
			where: { ambulance_id: validated.ambulance_id },
			include: {
				hospital: {
					select: { city: true },
				},
			},
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

		// Verify ambulance is from the same city as destination hospital
		if (ambulance.hospital?.city !== request.hospital?.city) {
			return NextResponse.json(
				{
					error: `Ambulance must be from the same city as destination hospital. Ambulance is from ${ambulance.hospital?.city}, hospital is in ${request.hospital?.city}`,
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

		// 4. Create dispatch with dispatched status and update all statuses immediately
		const result = await prisma.$transaction(async (tx) => {
			const newDispatch = await tx.dispatch.create({
				data: {
					request_id: validated.request_id,
					ambulance_id: validated.ambulance_id,
					dispatch_status: "dispatched",
				},
			});

			// Accept the request
			await tx.request.update({
				where: { request_id: validated.request_id },
				data: { request_status: "accepted" },
			});

			// Update patient priority and transfer status
			await tx.patient.update({
				where: { patient_id: request.patient_id },
				data: {
					priority_level: request.priority_level,
					transfer_status: "in_transfer",
				},
			});

			// Preassignments remain "active" - they will be manually completed via PreassignTable

			// Update ambulance status to on_trip
			await tx.ambulance.update({
				where: { ambulance_id: validated.ambulance_id },
				data: { ambulance_status: "on_trip" },
			});

			// Update staff status to in_transfer
			const staffIds = activePreassigns.map((p) => p.staff_id);
			if (staffIds.length > 0) {
				await tx.staff.updateMany({
					where: { staff_id: { in: staffIds } },
					data: { staff_status: "in_transfer" },
				});
			}

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

		// Handle Prisma unique constraint error
		if (
			error instanceof Error &&
			error.message.includes("Unique constraint failed")
		) {
			if (error.message.includes("request_id")) {
				return NextResponse.json(
					{
						error:
							"A dispatch already exists for this request. Each request can only have one active dispatch.",
					},
					{ status: 400 }
				);
			}
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

		// Get the current dispatch status
		const currentDispatch = await prisma.dispatch.findUnique({
			where: { dispatch_id },
		});

		if (!currentDispatch) {
			return NextResponse.json(
				{ error: "Dispatch not found" },
				{ status: 404 }
			);
		}

		// Only allow cancellation if dispatch is dispatched
		if (
			data.dispatch_status === "cancelled" &&
			currentDispatch.dispatch_status !== "dispatched"
		) {
			return NextResponse.json(
				{ error: "Can only cancel dispatch when status is dispatched" },
				{ status: 400 }
			);
		}

		// If cancelling, rollback all status changes in a transaction
		if (data.dispatch_status === "cancelled") {
			const result = await prisma.$transaction(async (tx) => {
				// Update dispatch status
				const updatedDispatch = await tx.dispatch.update({
					where: { dispatch_id },
					data: { dispatch_status: "cancelled" },
					include: {
						request: true,
					},
				});

				// Rollback request status to pending
				await tx.request.update({
					where: { request_id: updatedDispatch.request_id },
					data: { request_status: "pending" },
				});

				// Rollback patient status to waiting
				await tx.patient.update({
					where: { patient_id: updatedDispatch.request.patient_id },
					data: { transfer_status: "waiting" },
				});

				// Rollback ambulance status to available
				await tx.ambulance.update({
					where: { ambulance_id: updatedDispatch.ambulance_id },
					data: { ambulance_status: "available" },
				});

				// Rollback staff status to available
				const activePreassigns = await tx.preassign.findMany({
					where: {
						ambulance_id: updatedDispatch.ambulance_id,
						assignment_status: "active",
					},
				});

				const staffIds = activePreassigns.map((p) => p.staff_id);
				if (staffIds.length > 0) {
					await tx.staff.updateMany({
						where: { staff_id: { in: staffIds } },
						data: { staff_status: "available" },
					});
				}

				return updatedDispatch;
			});

			return NextResponse.json(result);
		}

		// Normal update
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
