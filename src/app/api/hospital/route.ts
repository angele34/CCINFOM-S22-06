import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/prisma";

// zod validation schemas
const HospitalSchema = z.object({
	hospital_name: z.string().min(1).max(50),
	city: z.enum(["Quezon_City", "Manila_City", "Muntinlupa_City"]),
	street: z.string().min(1).max(20),
});

const HospitalUpdateSchema = HospitalSchema.extend({
	hospital_id: z.coerce.number().int().positive(),
});

const HospitalDeleteSchema = z.object({
	hospital_id: z.coerce.number().int().positive(),
});

// READ
export async function GET() {
	try {
		const hospitals = await prisma.hospital.findMany({
			where: { is_deleted: false },
		});
		return NextResponse.json(hospitals);
	} catch (error) {
		console.error("GET /hospital error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// CREATE
export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validated = HospitalSchema.parse(body);

		const newHospital = await prisma.hospital.create({
			data: validated,
		});
		return NextResponse.json(newHospital);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
		console.error("CREATE /hospital error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// UPDATE
export async function PUT(req: Request) {
	try {
		const body = await req.json();
		const validated = HospitalUpdateSchema.parse(body);
		const { hospital_id, ...data } = validated;

		const updatedHospital = await prisma.hospital.update({
			where: { hospital_id },
			data,
		});
		return NextResponse.json(updatedHospital);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
		console.error("UPDATE /hospital error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// DELETE (soft delete)
export async function DELETE(req: Request) {
	try {
		const body = await req.json();
		const { hospital_id } = HospitalDeleteSchema.parse(body);

		const deletedHospital = await prisma.hospital.update({
			where: { hospital_id },
			data: { is_deleted: true, updated_at: new Date() },
		});
		return NextResponse.json(deletedHospital);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
		console.error("DELETE /hospital error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}
