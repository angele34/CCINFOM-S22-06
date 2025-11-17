import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/prisma";

// zod validation
const PatientSchema = z.object({
	ref_location_id: z.coerce.number().int().positive(),
	name: z.string().min(1).max(50),
	age: z.coerce.number().int().min(0).nullable().optional(),
	medical_condition: z.enum([
		"cardiac",
		"trauma",
		"respiratory",
		"neurological",
		"other",
	]),
	priority_level: z.enum(["critical", "moderate", "routine"]),
	contact_person: z.string().max(50).nullable().optional(),
	contact_number: z
		.string()
		.regex(/^09[0-9]{9}$/, "Must be 11 digits starting with 09")
		.nullable()
		.optional(),
	transfer_status: z
		.enum(["waiting", "in_transfer", "transferred"])
		.nullable()
		.optional(),
});

const PatientUpdateSchema = PatientSchema.extend({
	patient_id: z.coerce.number().int().positive(),
});

const PatientDeleteSchema = z.object({
	patient_id: z.coerce.number().int().positive(),
});

// READ
export async function GET() {
	try {
		const patients = await prisma.patient.findMany({
			where: { is_deleted: false },
		});
		return NextResponse.json(patients);
	} catch (error) {
		console.error("GET /patient error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// CREATE
export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validated = PatientSchema.parse(body);

		const newPatient = await prisma.patient.create({
			data: validated,
		});
		return NextResponse.json(newPatient);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
		console.error("CREATE /patient error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// UPDATE
export async function PUT(req: Request) {
	try {
		const body = await req.json();
		const validated = PatientUpdateSchema.parse(body);
		const { patient_id, ...data } = validated;

		const updatedPatient = await prisma.patient.update({
			where: { patient_id },
			data,
		});
		return NextResponse.json(updatedPatient);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
		console.error("UPDATE /patient error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// DELETE (soft delete)
export async function DELETE(req: Request) {
	try {
		const body = await req.json();
		const { patient_id } = PatientDeleteSchema.parse(body);

		const deletedPatient = await prisma.patient.update({
			where: { patient_id },
			data: { is_deleted: true, updated_at: new Date() },
		});
		return NextResponse.json(deletedPatient);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
		console.error("DELETE /patient error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}
