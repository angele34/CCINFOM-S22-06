import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

// GET staff assigned to a specific ambulance (for transfers)
export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const ambulanceId = searchParams.get("ambulance_id");

		if (!ambulanceId) {
			return NextResponse.json(
				{ error: "ambulance_id parameter is required" },
				{ status: 400 }
			);
		}

		// get staff assigned to this ambulance via preassigns (active or completed)
		const preassigns = await prisma.preassign.findMany({
			where: {
				ambulance_id: parseInt(ambulanceId),
				assignment_status: { in: ["active", "completed"] },
			},
			include: {
				staff: true,
			},
			distinct: ["staff_id"],
		});

		const staff = preassigns.map((p) => p.staff);
		return NextResponse.json(staff);
	} catch (error) {
		console.error("GET /ambulance_staff error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}
