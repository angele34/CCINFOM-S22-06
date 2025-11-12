import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

// READ
export async function GET() {
    try {
        const staffs = await prisma.staff.findMany();
        return NextResponse.json(staffs);
    } catch (error) {
        console.error("READ /staff error", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// CREATE
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newStaff = await prisma.staff.create({
            data: {
                staff_id: body.staff_id,
                name: body.name,
                staff_role: body.staff_role,
                license_no: body.license_no,
                shift_schedule: body.shift_schedule,
                staff_status: body.staff_status,
            },
        });
        return NextResponse.json(newStaff);
    } catch (error) {
        console.error("CREATE /staff error", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// UPDATE
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const updatedStaff = await prisma.staff.update({
            where: { staff_id: body.staff_id },
            data: {
                name: body.name,
                staff_role: body.staff_role,
                license_no: body.license_no,
                shift_schedule: body.shift_schedule,
                staff_status: body.staff_status,
            },
        })
        return NextResponse.json(updatedStaff);
    } catch (error) {
        console.error("UPDATE /staff error", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// DELETE
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const deletedStaff = await prisma.staff.delete({
            where: { staff_id: body.staff_id },
        })
        return NextResponse.json(deletedStaff);
    } catch (error) {
        console.error("DELETE /staff error", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
} 