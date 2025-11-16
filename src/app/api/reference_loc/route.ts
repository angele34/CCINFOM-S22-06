import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

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
        const newReferenceLocs = await prisma.reference_location.create({
            data: {
                city: body.city,
                street: body.street,
            },
        });
        return NextResponse.json(newReferenceLocs);
    } catch (error) {
        console.error("CREATE /reference_location error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// UPDATE
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const updatedReferenceLoc = await prisma.reference_location.update({
            where: { ref_location_id: body.ref_location_id },
            data: {
                city: body.city,
                street: body.street,
            },
        })
        return NextResponse.json(updatedReferenceLoc);
    } catch (error) {
        console.error("UPDATE /reference_location error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// DELETE
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const deletedReferenceLoc = await prisma.reference_location.delete({
            where: { ref_location_id: body.ref_location_id  },
        })
        return NextResponse.json(deletedReferenceLoc);
    } catch (error) {
        console.error("DELETE /reference_location error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}