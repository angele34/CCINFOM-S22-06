import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/prisma";

const TransferSchema = z.object({
    patient_id: z.coerce.number().int().positive(),
    ambulance_id: z.coerce.number().int().positive(),
    license_no: z.coerce.number().int().positive(),
    transfer_status: z.enum(["in_transfer", "transferred"]),
    priority_level: z.enum(["critical", "moderate", "routine"]),
});


const TransferUpdateSchema = TransferSchema.extend({
    transfer_id: z.coerce.number().int().positive(),
});

const TransferDeleteSchema = z.object({
    transfer_id: z.coerce.number().int().positive(),
});

// READ
export async function GET() {
    // retrieves all columns from the table
    try {
        const transfers = await prisma.transfer.findMany();
        return NextResponse.json(transfers);
    } catch (error) {
        console.error("GET /transfer error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// CREATE
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validated = TransferSchema.parse(body);

        const newTransfer = await prisma.transfer.create({
            data: validated,
        });
        return NextResponse.json(newTransfer);
    } catch (error) {
        if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
        console.error("CREATE /transfer error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}


// UPDATE
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const validated = TransferUpdateSchema.parse(body);
		const { transfer_id, ...data } = validated;

        const updatedTransfer = await prisma.transfer.update({
            where: { transfer_id },
            data,
        });
        return NextResponse.json(updatedTransfer);
    } catch (error) {
        if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
        console.error("UPDATE /transfer error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// DELETE
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { transfer_id } = TransferDeleteSchema.parse(body);

        const deletedTransfer = await prisma.transfer.delete({
            where: { transfer_id },
        })
        return NextResponse.json(deletedTransfer);
    } catch (error) {
        if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}
        console.error("DELETE /transfer error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}