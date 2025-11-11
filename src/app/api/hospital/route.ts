import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

// READ
export async function GET() {
    const hospitals = await prisma.Hospital.findMany();
    return NextResponse.json(hospitals);
}

// CREATE
export async function POST(req: Request) {
    const body = await req.json();
    const newHospital = await prisma.Hospital.create({
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
}

// UPDATE
export async function PUT(req: Request) {
    const body = await req.json();
    const updatedHospital = await prisma.Hospital.update({
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
}

// DELETE
export async function DELETE(req: Request) {
    const body = await req.json();
    const deletedHospital = await prisma.Hospital.delete({
        where: { hospital_id: body.hospital_id },
    })
    return NextResponse.json(deletedHospital);
}