import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/prisma";

const RequestSchema = z.object({
	patient_id: z.coerce.number().int().positive(),
	ref_location_id: z.coerce.number().int().positive(),
	hospital_id: z.coerce.number().int().positive(),
	priority_level: z.enum(["critical", "moderate", "routine"]),
});

const RequestUpdateSchema = z.object({
	request_id: z.coerce.number().int().positive(),
	request_status: z.enum(["pending", "accepted", "cancelled"]).optional(),
});

const RequestDeleteSchema = z.object({
	request_id: z.coerce.number().int().positive(),
});

// READ
export async function GET() {
	try {
		const requests = await prisma.request.findMany({
			include: {
				patient: {
					select: {
						name: true,
					},
				},
				hospital: {
					select: {
						city: true,
					},
				},
			},
			orderBy: { requested_on: "asc" },
		});
		return NextResponse.json(requests);
	} catch (error) {
		console.error("GET /request error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// CREATE
export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validated = RequestSchema.parse(body);

		// 1. read the patient record to verify patient exists
		const patient = await prisma.patient.findUnique({
			where: { patient_id: validated.patient_id },
		});

		if (!patient) {
			return NextResponse.json({ error: "Patient not found" }, { status: 404 });
		}

		// 2. read the reference location record to verify it exists
		const refLocation = await prisma.reference_location.findUnique({
			where: { ref_location_id: validated.ref_location_id },
		});

		if (!refLocation) {
			return NextResponse.json(
				{ error: "Reference location not found" },
				{ status: 404 }
			);
		}

		// 3. read the hospital record to verify it exists
		const hospital = await prisma.hospital.findUnique({
			where: { hospital_id: validated.hospital_id },
		});

		if (!hospital) {
			return NextResponse.json(
				{ error: "Hospital not found" },
				{ status: 404 }
			);
		}

		// 4. verify hospital_id matches the reference location's hospital_id
		if (refLocation.hospital_id !== validated.hospital_id) {
			return NextResponse.json(
				{
					error: `Hospital mismatch: reference location belongs to hospital ${refLocation.hospital_id}, but request is for hospital ${validated.hospital_id}`,
				},
				{ status: 400 }
			);
		}

		// 5. record the request with default status "pending"
		const newRequest = await prisma.request.create({
			data: {
				...validated,
				request_status: "pending",
			},
		});
		return NextResponse.json(newRequest);
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
		console.error("CREATE /request error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// UPDATE
export async function PUT(req: Request) {
	try {
		const body = await req.json();
		const validated = RequestUpdateSchema.parse(body);
		const { request_id, ...data } = validated;

		// if nag accept mag uupdate yung changes
		if (data.request_status === "accepted") {
			// fetch existing request
			const existing = await prisma.request.findUnique({
				where: { request_id },
			});
			if (!existing) {
				return NextResponse.json(
					{ error: "Request not found" },
					{ status: 404 }
				);
			}

			// perform both updates in a transaction
			const [updatedRequest] = await prisma.$transaction([
				prisma.request.update({ where: { request_id }, data }),
				prisma.patient.update({
					where: { patient_id: existing.patient_id },
					data: { priority_level: existing.priority_level },
				}),
			]);

			return NextResponse.json(updatedRequest);
		}

		const updatedRequest = await prisma.request.update({
			where: { request_id },
			data,
		});
		return NextResponse.json(updatedRequest);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
		console.error("UPDATE /request error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}

// DELETE
export async function DELETE(req: Request) {
	try {
		const body = await req.json();
		const { request_id } = RequestDeleteSchema.parse(body);

		const deletedRequest = await prisma.request.delete({
			where: { request_id },
		});
		return NextResponse.json(deletedRequest);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
		console.error("DELETE /request error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}
