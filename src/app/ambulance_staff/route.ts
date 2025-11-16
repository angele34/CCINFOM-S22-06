import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

// READ
export async function GET() {
  try {
    const relations = await prisma.ambulance_staff.findMany();
    return NextResponse.json(relations);
  } catch (error) {
    console.error("GET /ambulance_staff error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// CREATE
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.ambulance_id || !body.staff_id) {
      return NextResponse.json(
        { error: "ambulance_id and staff_id are required" },
        { status: 400 }
      );
    }

    const newRelation = await prisma.ambulance_staff.create({
      data: {
        ambulance_id: body.ambulance_id,
        staff_id: body.staff_id,
      },
    });

    return NextResponse.json(newRelation);
  } catch (error) {
    console.error("CREATE /ambulance_staff error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    if (!body.ambulance_id || !body.staff_id) {
      return NextResponse.json(
        { error: "ambulance_id and staff_id are required" },
        { status: 400 }
      );
    }

    const deletedRelation = await prisma.ambulance_staff.delete({
      where: {
        ambulance_id_staff_id: {
          ambulance_id: body.ambulance_id,
          staff_id: body.staff_id,
        },
      },
    });
    return NextResponse.json(deletedRelation);
  } catch (error) {
    console.error("DELETE /ambulance_staff error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
