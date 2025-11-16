import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

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
        const newTransfer = await prisma.transfer.create({
            data: {
                patient_id: body.patient_id,
                ambulance_id: body.ambulance_id,
                hospital_id: body.hospital_id,
                transfer_date: body.transfer_date,
                transfer_status: body.transfer_status,
                priority_level: body.priority_level,           
            },
        });
        return NextResponse.json(newTransfer);
    } catch (error) {
        console.error("CREATE /transfer error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}


// UPDATE
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const updatedTransfer = await prisma.transfer.update({
            where: { transfer_id: body.transfer_id },
            data: { 
                patient_id: body.patient_id,
                ambulance_id: body.ambulance_id,
                hospital_id: body.hospital_id,
                transfer_date: new Date(body.transfer_date),
                transfer_status: body.transfer_status,
                priority_level: body.priority_level,  
            },
        });
        return NextResponse.json(updatedTransfer);
    } catch (error) {
        console.error("UPDATE /transfer error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// DELETE
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const deletedTransfer = await prisma.transfer.delete({
            where: { transfer_id: body.transfer_id },
        })
        return NextResponse.json(deletedTransfer);
    } catch (error) {
        console.error("DELETE /transfer error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}