import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

// READ
export async function GET() {
    try {
        const patients = await prisma.patient.findMany();
        return NextResponse.json(patients);
    } catch (error) {
        console.error("GET /patient error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// CREATE
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newPatient = await prisma.patient.create({
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
    } catch (error) {
        console.error("CREATE /patient error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// UPDATE
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const updatedPatient = await prisma.patient.update({
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
        return NextResponse.json(updatedPatient);
    } catch (error) {
        console.error("UPDATE /patient error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// DELETE
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const deletedPatient = await prisma.patient.delete({
            where: { patient_id: body.patient_id },
        })
        return NextResponse.json(deletedPatient);
    } catch (error) {
        console.error("DELETE /patient error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}