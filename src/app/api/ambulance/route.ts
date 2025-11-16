import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

// READ
export async function GET() {
    // retrieves all columns from the table
    try {
        const ambulances = await prisma.ambulance.findMany();
        return NextResponse.json(ambulances);
    } catch (error) {
        console.error("GET /ambulance error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// CREATE
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newAmbulance = await prisma.ambulance.create({
            data: {
                ambulance_type: body.ambulance_type,
                hospital_id: body.hospital_id,
                ambulance_status: body.ambulance_status,
                plate_no: body.plate_no,            
            },
        });
        return NextResponse.json(newAmbulance);
    } catch (error) {
        console.error("CREATE /ambulance error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}


// UPDATE
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const updatedAmbulance = await prisma.ambulance.update({
            where: { ambulance_id: body.ambulance_id },
            data: { 
                ambulance_type: body.ambulance_type,
                hospital_id: body.hospital_id,
                ambulance_status: body.ambulance_status,
                plate_no: body.plate_no,  
            },
        });
        return NextResponse.json(updatedAmbulance);
    } catch (error) {
        console.error("UPDATE /ambulance error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// DELETE
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const deletedAmbulance = await prisma.ambulance.delete({
            where: { ambulance_id: body.ambulance_id},
        })
        return NextResponse.json(deletedAmbulance);
    } catch (error) {
        console.error("DELETE /ambulance error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}