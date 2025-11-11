import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

// READ
export async function GET() {
    const staffs = await prisma.Staff.findMany();
    return NextResponse.json(staffs);
}

// CREATE
export async function POST(req: Request) {
    const body = await req.json();
    const newStaff = await prisma.Staff.create({
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
}

// UPDATE
export async function PUT(req: Request) {
    const body = await req.json();
    const updatedStaff = await prisma.Staff.update({
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
}

// DELETE
export async function DELETE(req: Request) {
    const body = await req.json();
    const deletedStaff = await prisma.Staff.delete({
        where: { staff_id: body.staff_id },
    })
    return NextResponse.json(deletedStaff);
}