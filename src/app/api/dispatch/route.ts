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
		const dispatches = await prisma.dispatch.findMany();
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

		// Verify request exists and has been accepted
		const request = await prisma.request.findUnique({
			where: { request_id: validated.request_id },
		});

		if (!request) {
			return NextResponse.json({ error: "Request not found" }, { status: 404 });
		}

		if (request.request_status !== "accepted") {
			return NextResponse.json(
				{ error: "Request must be accepted before dispatch" },
				{ status: 400 }
			);
		}

		// Create dispatch and mark preassigns as completed in a transaction
		const result = await prisma.$transaction(async (tx) => {
			const newDispatch = await tx.dispatch.create({
				data: validated,
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

			return newDispatch;
		});

		return NextResponse.json(result);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
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
			const result = await prisma.$transaction(async (tx) => {
				// Get the dispatch to find ambulance_id
				const dispatch = await tx.dispatch.findUnique({
					where: { dispatch_id },
				});

				if (!dispatch) {
					throw new Error("Dispatch not found");
				}

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
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
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
