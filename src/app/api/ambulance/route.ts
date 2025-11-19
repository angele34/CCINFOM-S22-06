import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/prisma";

const AmbulanceSchema = z.object({
	hospital_id: z.coerce.number().int().positive(),
	ambulance_type: z.enum(["type_1", "type_2"]),
	ambulance_status: z.enum(["available", "on_trip"]),
	plate_no: z
		.string()
		.length(7, { message: "Plate number must be exactly 7 characters" })
		.regex(/^[A-Z]{3}[0-9]{4}$/, {
			message: "Plate must be 3 letters followed by 4 numbers (e.g., ABC1234)",
		})
		.transform((val) => val.toUpperCase()),
});

const AmbulanceUpdateSchema = AmbulanceSchema.extend({
	ambulance_id: z.coerce.number().int().positive(),
});

const AmbulanceDeleteSchema = z.object({
	ambulance_id: z.coerce.number().int().positive(),
});

// READ
export async function GET() {
	// retrieves all columns from the table, excluding soft-deleted records
	try {
		const ambulances = await prisma.ambulance.findMany({
			where: { is_deleted: false },
			include: {
				hospital: {
					select: {
						city: true,
					},
				},
			},
		});
		return NextResponse.json(ambulances);
	} catch (error) {
		console.error("GET /ambulance error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// CREATE
export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validated = AmbulanceSchema.parse(body);

		// verify hospital exists
		const hospital = await prisma.hospital.findUnique({
			where: { hospital_id: validated.hospital_id },
		});
		if (!hospital) {
			return NextResponse.json(
				{ error: "Hospital not found" },
				{ status: 400 }
			);
		}

		// check for duplicate plate number
		const existingPlate = await prisma.ambulance.findFirst({
			where: {
				plate_no: validated.plate_no,
				is_deleted: false,
			},
		});
		if (existingPlate) {
			return NextResponse.json(
				{ error: `Plate number ${validated.plate_no} is already in use` },
				{ status: 400 }
			);
		}

		const newAmbulance = await prisma.ambulance.create({
			data: validated,
		});
		return NextResponse.json(newAmbulance);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
		console.error("CREATE /ambulance error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// UPDATE
export async function PUT(req: Request) {
	try {
		const body = await req.json();
		const validated = AmbulanceUpdateSchema.parse(body);
		const { ambulance_id, ...data } = validated;

		// check if ambulance exists
		const existingAmbulance = await prisma.ambulance.findUnique({
			where: { ambulance_id },
		});

		if (!existingAmbulance) {
			return NextResponse.json(
				{ error: "Ambulance not found" },
				{ status: 404 }
			);
		}

		// verify hospital exists if provided
		const hospitalId = (data as unknown as { hospital_id?: number })
			.hospital_id;
		if (hospitalId != null) {
			const hospital = await prisma.hospital.findUnique({
				where: { hospital_id: hospitalId },
			});
			if (!hospital) {
				return NextResponse.json(
					{ error: "Hospital not found" },
					{ status: 400 }
				);
			}

			// prevent changing hospital if ambulance has active assignments or dispatches
			if (hospitalId !== existingAmbulance.hospital_id) {
				const hasActiveAssignments = await prisma.preassign.findFirst({
					where: {
						ambulance_id: ambulance_id,
						assignment_status: "active",
					},
				});

				if (hasActiveAssignments) {
					return NextResponse.json(
						{
							error:
								"Cannot change hospital while ambulance has active staff assignments",
						},
						{ status: 400 }
					);
				}

				const hasActiveDispatches = await prisma.dispatch.findFirst({
					where: {
						ambulance_id: ambulance_id,
						dispatch_status: "dispatched",
					},
				});

				if (hasActiveDispatches) {
					return NextResponse.json(
						{
							error:
								"Cannot change hospital while ambulance has active dispatches",
						},
						{ status: 400 }
					);
				}
			}
		}

		// check for duplicate plate number (excluding current ambulance)
		const plateNo = (data as unknown as { plate_no?: string }).plate_no;
		if (plateNo) {
			const existingPlate = await prisma.ambulance.findFirst({
				where: {
					plate_no: plateNo,
					is_deleted: false,
					NOT: {
						ambulance_id: ambulance_id,
					},
				},
			});
			if (existingPlate) {
				return NextResponse.json(
					{ error: `Plate number ${plateNo} is already in use` },
					{ status: 400 }
				);
			}
		}

		const updatedAmbulance = await prisma.ambulance.update({
			where: { ambulance_id },
			data,
		});
		return NextResponse.json(updatedAmbulance);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
		console.error("UPDATE /ambulance error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// DELETE (soft delete lang)
export async function DELETE(req: Request) {
	try {
		const body = await req.json();
		const { ambulance_id } = AmbulanceDeleteSchema.parse(body);

		// check if ambulance exists
		const ambulance = await prisma.ambulance.findUnique({
			where: { ambulance_id },
		});

		if (!ambulance) {
			return NextResponse.json(
				{ error: "Ambulance not found" },
				{ status: 404 }
			);
		}

		// check if ambulance has active preassignments
		const activePreassignments = await prisma.preassign.findFirst({
			where: {
				ambulance_id: ambulance_id,
				assignment_status: "active",
			},
		});

		if (activePreassignments) {
			return NextResponse.json(
				{
					error:
						"Cannot delete ambulance with active staff assignments. Please cancel or complete assignments first.",
				},
				{ status: 400 }
			);
		}

		// check if ambulance has active dispatches
		const activeDispatches = await prisma.dispatch.findFirst({
			where: {
				ambulance_id: ambulance_id,
				dispatch_status: "dispatched",
			},
		});

		if (activeDispatches) {
			return NextResponse.json(
				{
					error:
						"Cannot delete ambulance with active dispatches. Please complete or cancel dispatches first.",
				},
				{ status: 400 }
			);
		}

		const deletedAmbulance = await prisma.ambulance.update({
			where: { ambulance_id },
			data: { is_deleted: true, updated_at: new Date() },
		});
		return NextResponse.json(deletedAmbulance);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
		console.error("DELETE /ambulance error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}
