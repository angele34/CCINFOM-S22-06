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

		// Perform all validations before transaction
		// 1. Read and verify ambulance is available
		const ambulance = await prisma.ambulance.findUnique({
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

		// 2. Read and verify staff is available and role matches
		const staff = await prisma.staff.findUnique({
			where: { staff_id: validated.staff_id },
		});

		if (!staff) {
			return NextResponse.json({ error: "Staff not found" }, { status: 404 });
		}

		if (staff.is_deleted) {
			return NextResponse.json(
				{ error: "Staff is deleted and cannot be assigned" },
				{ status: 400 }
			);
		}

		if (staff.staff_status !== "available") {
			return NextResponse.json(
				{
					error: `Staff is not available (current status: ${staff.staff_status})`,
				},
				{ status: 400 }
			);
		}

		if (staff.staff_role !== validated.staff_role) {
			return NextResponse.json(
				{
					error: `Staff role mismatch: expected ${validated.staff_role}, got ${staff.staff_role}`,
				},
				{ status: 400 }
			);
		}

		// 3. Verify hospital_id match between ambulance and staff
		if (ambulance.hospital_id !== staff.hospital_id) {
			return NextResponse.json(
				{
					error: `Hospital mismatch: Ambulance is at hospital ${ambulance.hospital_id}, but staff is at hospital ${staff.hospital_id}`,
				},
				{ status: 400 }
			);
		}

		// 4. Check for existing active pre-assignment for this ambulance + role
		const existingRoleAssignment = await prisma.preassign.findFirst({
			where: {
				ambulance_id: validated.ambulance_id,
				staff_role: validated.staff_role,
				assignment_status: "active",
			},
		});

		let newPreassign;
		if (existingRoleAssignment) {
			// Update the existing active assignment with the new staff member
			// This allows replacing staff with the same role
			newPreassign = await prisma.preassign.update({
				where: { preassign_id: existingRoleAssignment.preassign_id },
				data: {
					staff_id: validated.staff_id,
					assignment_status: validated.assignment_status || "active",
					assigned_on: new Date(),
					updated_on: new Date(),
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
		} else {
			// 5. Check if staff is already assigned to another ambulance (only active assignments)
			const existingStaffAssignment = await prisma.preassign.findFirst({
				where: {
					staff_id: validated.staff_id,
					assignment_status: "active",
				},
			});

			if (existingStaffAssignment) {
				return NextResponse.json(
					{
						error: "This staff member is already assigned to another ambulance",
					},
					{ status: 400 }
				);
			}

			// 6. Check if there's a completed/cancelled preassign for this ambulance+role
			// If yes, update it instead of creating new one (to avoid unique constraint violation)
			const existingPreassign = await prisma.preassign.findFirst({
				where: {
					ambulance_id: validated.ambulance_id,
					staff_role: validated.staff_role,
					assignment_status: { in: ["completed", "cancelled"] },
				},
			});

			if (existingPreassign) {
				// Update the existing preassign instead of creating new one
				newPreassign = await prisma.preassign.update({
					where: { preassign_id: existingPreassign.preassign_id },
					data: {
						staff_id: validated.staff_id,
						assignment_status: validated.assignment_status || "active",
						assigned_on: new Date(),
						updated_on: new Date(),
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
			} else {
				// Create new preassign
				newPreassign = await prisma.preassign.create({
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
			}
		}

		const result = {
			preassign: newPreassign,
			ambulance_base_location: `${ambulance.hospital.city.replace(
				/_/g,
				" "
			)}, ${ambulance.hospital.street}`,
		};

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
