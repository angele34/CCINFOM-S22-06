import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/prisma";

const AmbulanceSchema = z.object({
	hospital_id: z.coerce.number().int().positive(),
	ambulance_type: z.enum(["type_1", "type_2"]),
	ambulance_status: z.enum(["available", "on_trip"]),
	plate_no: z
		.string()
		.min(1)
		.max(7)
		.transform((val) => val.toUpperCase().slice(0, 7)),
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
