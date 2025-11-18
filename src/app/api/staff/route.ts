import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/prisma";

// zod validation schemas
const StaffSchema = z.object({
	hospital_id: z.coerce.number().int().positive(),
	name: z.string().min(1).max(50),
	staff_role: z.enum(["driver", "emt", "paramedic"]),
	license_no: z
		.string()
		.length(11)
		.regex(
			/^LIC-\d{3}-\d{3}$/,
			"License must be in format LIC-NNN-NNN (e.g., LIC-123-456)"
		),
	shift_schedule: z.enum(["morning", "night"]),
	staff_status: z.enum(["available", "in_transfer", "off_duty"]),
});

const StaffUpdateSchema = StaffSchema.extend({
	staff_id: z.coerce.number().int().positive(),
});

const StaffDeleteSchema = z.object({
	staff_id: z.coerce.number().int().positive(),
});

// READ
export async function GET() {
	try {
		const staffs = await prisma.staff.findMany({
			where: { is_deleted: false },
		});
		return NextResponse.json(staffs);
	} catch (error) {
		console.error("READ /staff error", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// CREATE
export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validated = StaffSchema.parse(body);

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

		const newStaff = await prisma.staff.create({
			data: validated,
		});
		return NextResponse.json(newStaff);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
		console.error("CREATE /staff error", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// UPDATE
export async function PUT(req: Request) {
	try {
		const body = await req.json();
		const validated = StaffUpdateSchema.parse(body);
		const { staff_id, ...data } = validated;

		// verify hospital exists if provided
		if ((data as any).hospital_id != null) {
			const hospital = await prisma.hospital.findUnique({
				where: { hospital_id: (data as any).hospital_id },
			});
			if (!hospital) {
				return NextResponse.json(
					{ error: "Hospital not found" },
					{ status: 400 }
				);
			}
		}

		const updatedStaff = await prisma.staff.update({
			where: { staff_id },
			data,
		});
		return NextResponse.json(updatedStaff);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
		console.error("UPDATE /staff error", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// DELETE (soft delete)
export async function DELETE(req: Request) {
	try {
		const body = await req.json();
		const { staff_id } = StaffDeleteSchema.parse(body);

		const deletedStaff = await prisma.staff.update({
			where: { staff_id },
			data: { is_deleted: true, updated_at: new Date() },
		});
		return NextResponse.json(deletedStaff);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
		console.error("DELETE /staff error", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}
