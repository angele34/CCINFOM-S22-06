import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

// READ
export async function GET() {
    try {
        const hospitals = await prisma.hospital.findMany();
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
        const newHospital = await prisma.hospital.create({
            data: {
                hospital_id: body.hospital_id,
                hospital_location_id: body.hospital_location_id,
                hospital_name: body.hospital_name,
                hospital_type: body.hospital_type,
                city: body.city,
                street: body.street,
                hospital_capacity: body.hospital_capacity,
            },
        });
        return NextResponse.json(newHospital);
    } catch (error) {
        console.error("CREATE /hospital error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// UPDATE
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const updatedHospital = await prisma.hospital.update({
            where: { hospital_id: body.hospital_id },
            data: {
                hospital_location_id: body.hospital_location_id,
                hospital_name: body.hospital_name,
                hospital_type: body.hospital_type,
                city: body.city,
                street: body.street,
                hospital_capacity: body.hospital_capacity,
            },
        })
        return NextResponse.json(updatedHospital);
    } catch (error) {
        console.error("UPDATE /hospital error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// DELETE
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const deletedHospital = await prisma.hospital.delete({
            where: { hospital_id: body.hospital_id },
        })
        return NextResponse.json(deletedHospital);
    } catch (error) {
        console.error("DELETE /hospital error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}