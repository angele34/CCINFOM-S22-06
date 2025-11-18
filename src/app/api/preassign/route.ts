import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";

// zod schema
const PreassignSchema = z.object({
	staff_id: z.coerce.number().int().positive(),
	staff_role: z.enum(["driver", "emt", "paramedic"]),
	ambulance_id: z.coerce.number().int().positive(),
	assignment_status: z.enum(["active", "completed", "cancelled"]).optional(),
});

const PreassignUpdateSchema = z.object({
	preassign_id: z.coerce.number().int().positive(),
	staff_id: z.coerce.number().int().positive().optional(),
	staff_role: z.enum(["driver", "emt", "paramedic"]).optional(),
	ambulance_id: z.coerce.number().int().positive().optional(),
	assignment_status: z.enum(["active", "completed", "cancelled"]).optional(),
});

const PreassignDeleteSchema = z.object({
	preassign_id: z.coerce.number().int().positive(),
});

// READ
export async function GET() {
	try {
		const preassigns = await prisma.preassign.findMany({
			orderBy: {
				assigned_on: "asc",
			},
		});
		return NextResponse.json(preassigns);
	} catch (error) {
		console.error("GET /preassign error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// CREATE
export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validated = PreassignSchema.parse(body);

		const result = await prisma.$transaction(
			async (tx: Prisma.TransactionClient) => {
				// read and verify ambulance is available
				const ambulance = await tx.ambulance.findUnique({
					where: { ambulance_id: validated.ambulance_id },
					include: {
						hospital: {
							select: {
								hospital_name: true,
								city: true,
								street: true,
							},
						},
					},
				});

				if (!ambulance) {
					throw new Error("Ambulance not found");
				}

				if (ambulance.ambulance_status !== "available") {
					throw new Error(
						`Ambulance is not available (current status: ${ambulance.ambulance_status})`
					);
				}

				// read and verify staff is available and role matches
				const staff = await tx.staff.findUnique({
					where: { staff_id: validated.staff_id },
				});

				if (!staff) {
					throw new Error("Staff not found");
				}

				if (staff.is_deleted) {
					throw new Error("Staff is deleted");
				}

				if (staff.staff_status !== "available") {
					throw new Error(
						`Staff is not available (current status: ${staff.staff_status})`
					);
				}

				if (staff.staff_role !== validated.staff_role) {
					throw new Error(
						`Staff role mismatch: expected ${validated.staff_role}, got ${staff.staff_role}`
					);
				}

				// verify hospital_id match between ambulance and staff
				if (ambulance.hospital_id !== staff.hospital_id) {
					throw new Error(
						`Hospital mismatch: Ambulance is at hospital ${ambulance.hospital_id}, but staff is at hospital ${staff.hospital_id}`
					);
				}

				// check for existing active pre-assignment for this ambulance + role
				const existingRoleAssignment = await tx.preassign.findFirst({
					where: {
						ambulance_id: validated.ambulance_id,
						staff_role: validated.staff_role,
						assignment_status: "active",
					},
				});

				if (existingRoleAssignment) {
					throw new Error(
						`This ambulance already has an active ${validated.staff_role} assigned`
					);
				}

				// check if staff is already assigned to another ambulance
				const existingStaffAssignment = await tx.preassign.findFirst({
					where: {
						staff_id: validated.staff_id,
						assignment_status: "active",
					},
				});

				if (existingStaffAssignment) {
					throw new Error(
						"This staff member is already assigned to another ambulance"
					);
				}

				// create the pre-assignment
				const newPreassign = await tx.preassign.create({
					data: {
						staff_id: validated.staff_id,
						staff_role: validated.staff_role,
						ambulance_id: validated.ambulance_id,
						assignment_status: validated.assignment_status || "active",
					},
					include: {
						staff: true,
						ambulance: {
							include: {
								hospital: true,
							},
						},
					},
				});

				return {
					preassign: newPreassign,
					ambulance_base_location: `${ambulance.hospital.city.replace(
						/_/g,
						" "
					)}, ${ambulance.hospital.street}`,
				};
			}
		);

		return NextResponse.json(result);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const fieldErrors = error.issues
				.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
				.join(", ");
			return NextResponse.json(
				{
					error: `Validation failed: ${fieldErrors}`,
					details: error.issues,
				},
				{ status: 400 }
			);
		}
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		console.error("CREATE /preassign error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// UPDATE
export async function PUT(req: Request) {
	try {
		const body = await req.json();
		const validated = PreassignUpdateSchema.parse(body);
		const { preassign_id, ...data } = validated;

		const updatedPreassign = await prisma.preassign.update({
			where: { preassign_id },
			data,
			include: {
				staff: true,
				ambulance: {
					include: {
						hospital: true,
					},
				},
			},
		});

		return NextResponse.json(updatedPreassign);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const fieldErrors = error.issues
				.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
				.join(", ");
			return NextResponse.json(
				{
					error: `Validation failed: ${fieldErrors}`,
					details: error.issues,
				},
				{ status: 400 }
			);
		}
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		console.error("UPDATE /preassign error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// DELETE
export async function DELETE(req: Request) {
	try {
		const body = await req.json();
		const { preassign_id } = PreassignDeleteSchema.parse(body);

		const deletedPreassign = await prisma.preassign.update({
			where: { preassign_id },
			data: { assignment_status: "cancelled" },
		});

		return NextResponse.json(deletedPreassign);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const fieldErrors = error.issues
				.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
				.join(", ");
			return NextResponse.json(
				{
					error: `Validation failed: ${fieldErrors}`,
					details: error.issues,
				},
				{ status: 400 }
			);
		}
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		console.error("UPDATE /preassign error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}
