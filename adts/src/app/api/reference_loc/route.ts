import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

// READ
export async function GET() {
    const referenceLocs = await prisma.Reference_Location.findMany();
    return NextResponse.json(referenceLocs);
}

// CREATE
export async function POST(req: Request) {
    const body = await req.json();
    const newReferenceLocs = await prisma.Patient.create({
        data: {
            ref_location_id: body.ref_location_id,
            city: body.city,
            street: body.street,
        },
    });
    return NextResponse.json(newReferenceLocs);
}

// UPDATE
export async function PUT(req: Request) {
    const body = await req.json();
    const updatedReferenceLoc = await prisma.Reference_Location.update({
        where: { ref_location_id: body.ref_location_id },
        data: {
            city: body.city,
            street: body.street,
        },
    })
    return NextResponse.json(updatedReferenceLoc);
}

// DELETE
export async function DELETE(req: Request) {
    const body = await req.json();
    const deletedReferenceLoc = await prisma.Reference_Location.delete({
        where: { ref_location_id: body.ref_location_id  },
    })
    return NextResponse.json(deletedReferenceLoc);
}