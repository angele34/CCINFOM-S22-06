import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

// READ
export async function GET() {
    const patients = await prisma.Patient.findMany();
    return NextResponse.json(patients);
}

// CREATE
export async function POST(req: Request) {
    const body = await req.json();
    const newPatient = await prisma.Patient.create({
        data: {
            patient_id: body.patient_id,
            ref_location_id: body.ref_location_id,
            name: body.name,
            age: body.age,
            medical_condition: body.medical_condition,
            priority_level: body.priority_level,
            contact_person: body.contact_person,
            transfer_status: body.transfer_status,
        },
    });
    return NextResponse.json(newPatient);
}

// UPDATE
export async function PUT(req: Request) {
    const body = await req.json();
    const updatedHospital = await prisma.Hospital.update({
        where: { patient_id: body.patient_id },
        data: {
            ref_location_id: body.ref_location_id,
            name: body.name,
            age: body.age,
            medical_condition: body.medical_condition,
            priority_level: body.priority_level,
            contact_person: body.contact_person,
            transfer_status: body.transfer_status,
        },
    })
    return NextResponse.json(updatedHospital);
}

// DELETE
export async function DELETE(req: Request) {
    const body = await req.json();
    const deletedPatient = await prisma.Patient.delete({
        where: { patient_id: body.patient_id },
    })
    return NextResponse.json(deletedPatient);
}