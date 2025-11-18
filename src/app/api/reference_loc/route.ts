import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/prisma";

// zod validation
const ReferenceLocationSchema = z.object({
	hospital_id: z.coerce.number().int().positive(),
	city: z.enum(["Quezon_City", "Manila_City", "Muntinlupa_City"]),
	street: z.string().min(1).max(20),
});

const ReferenceLocationUpdateSchema = ReferenceLocationSchema.extend({
	ref_location_id: z.coerce.number().int().positive(),
});

const ReferenceLocationDeleteSchema = z.object({
	ref_location_id: z.coerce.number().int().positive(),
});

// READ
export async function GET() {
	try {
		const referenceLocs = await prisma.reference_location.findMany();
		return NextResponse.json(referenceLocs);
	} catch (error) {
		console.error("READ /reference_location error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// CREATE
export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validated = ReferenceLocationSchema.parse(body);

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

		const newReferenceLocs = await prisma.reference_location.create({
			data: validated,
		});
		return NextResponse.json(newReferenceLocs);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
		console.error("CREATE /reference_location error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// UPDATE
export async function PUT(req: Request) {
	try {
		const body = await req.json();
		const validated = ReferenceLocationUpdateSchema.parse(body);
		const { ref_location_id, ...data } = validated;

		// verify hospital exists if provided
		if (data.hospital_id != null) {
			const hospital = await prisma.hospital.findUnique({
				where: { hospital_id: data.hospital_id },
			});
			if (!hospital) {
				return NextResponse.json(
					{ error: "Hospital not found" },
					{ status: 400 }
				);
			}
		}

		const updatedReferenceLoc = await prisma.reference_location.update({
			where: { ref_location_id },
			data,
		});
		return NextResponse.json(updatedReferenceLoc);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
		console.error("UPDATE /reference_location error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// DELETE
export async function DELETE(req: Request) {
	try {
		const body = await req.json();
		const { ref_location_id } = ReferenceLocationDeleteSchema.parse(body);

		const deletedReferenceLoc = await prisma.reference_location.delete({
			where: { ref_location_id },
		});
		return NextResponse.json(deletedReferenceLoc);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
		console.error("DELETE /reference_location error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}
