import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

// READ
export async function GET() {
    // retrieves all columns from the table
    const ambulances = await prisma.Ambulance.findMany();
    return NextResponse.json(ambulances);
}

// CREATE
export async function POST(req: Request) {
    const body = await req.json();
    const newAmbulance = await prisma.Ambulance.create({
        data: {
        assignment_id: body.assignment_id,
        ambulance_id: body.ambulance_id,
        staff_id: body.staff_id,
        assignment_date: new Date(body.assignment_date),
        shift_sched: body.shift_sched,
        },
    });
    return NextResponse.json(newAmbulance);
}


// UPDATE
export async function PUT(req: Request) {
    const body = await req.json();
    const updatedAmbulance = await prisma.Ambulance.update({
        where: { assignment_id: body.assignment_id },
        data: { 
            ambulance_id: body.ambulance_id,
            staff_id: body.staff_id,
            assignment_date: new Date(body.assignment_date),
            shift_sched: body.shift_sched,
        },
    });
    return NextResponse.json(updatedAmbulance);
}

// DELETE
export async function DELETE(req: Request) {
    const body = await req.json();
    const deletedAmbulance = await prisma.Ambulance.delete({
        where: { assignment_id: body.assignemnt_id },
    })
    return NextResponse.json(deletedAmbulance);
}