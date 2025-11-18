import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/prisma";

const DispatchSchema = z.object({
    request_id: z.coerce.number().int().positive(),
    ambulance_id: z.coerce.number().int().positive(),
    dispatch_status: z.enum(["dispatched", "cancelled"]),
});


const DispatchUpdateSchema = DispatchSchema.extend({
    dispatch_id: z.coerce.number().int().positive(),
});

const DispatchDeleteSchema = z.object({
    dispatch_id: z.coerce.number().int().positive(),
});

// READ
export async function GET() {
    // retrieves all columns from the table
    try {
        const dispatches = await prisma.dispatch.findMany();
        return NextResponse.json(dispatches);
    } catch (error) {
        console.error("GET /dispatch error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// CREATE
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validated = DispatchSchema.parse(body);

        const newDispatch = await prisma.request.create({
            data: validated,
        });
        return NextResponse.json(newDispatch);
    } catch (error) {
        if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
        console.error("CREATE /dispatch error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}


// UPDATE
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const validated = DispatchUpdateSchema.parse(body);
		const { dispatch_id, ...data } = validated;

        const updatedDispatch = await prisma.transfer.update({
            where: { dispatch_id },
            data,
        });
        return NextResponse.json(updatedDispatch);
    } catch (error) {
        if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
        console.error("UPDATE /dispatch error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// DELETE
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { dispatch_id } = DispatchDeleteSchema.parse(body);

        const deletedDispatch = await prisma.dispatch.delete({
            where: { dispatch_id },
        })
        return NextResponse.json(deletedDispatch);
    } catch (error) {
        if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
        console.error("DELETE /dispatch error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}