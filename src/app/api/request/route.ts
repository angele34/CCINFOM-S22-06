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

        const newRequest = await prisma.request.create({
            data: validated,
        });
        return NextResponse.json(newRequest);
    } catch (error) {
        if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
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