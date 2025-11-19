import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const startDateParam = searchParams.get("startDate");
		const endDateParam = searchParams.get("endDate");

		if (!startDateParam || !endDateParam) {
			return NextResponse.json(
				{ error: "Start date and end date are required" },
				{ status: 400 }
			);
		}

		// Parse dates
		const startDate = new Date(startDateParam);
		const endDate = new Date(endDateParam);

		// Validate dates
		if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
			return NextResponse.json(
				{ error: "Invalid date format" },
				{ status: 400 }
			);
		}

		if (startDate > endDate) {
			return NextResponse.json(
				{ error: "Start date must be before end date" },
				{ status: 400 }
			);
		}

		// Set end date to end of day
		endDate.setHours(23, 59, 59, 999);

		// Fetch all transfers within the date range
		const transfers = await prisma.transfer.findMany({
			where: {
				transferred_on: {
					gte: startDate,
					lte: endDate,
				},
			},
			include: {
				staff: {
					include: {
						hospital: true,
					},
				},
			},
			orderBy: {
				transferred_on: "asc",
			},
		});

		// Fetch all preassignments within the date range
		const preassignments = await prisma.preassign.findMany({
			where: {
				assigned_on: {
					gte: startDate,
					lte: endDate,
				},
			},
			include: {
				staff: {
					include: {
						hospital: true,
					},
				},
			},
		});

		// Group transfers by staff
		type TransferDetail = {
			transfer_id: number;
			transferred_on: Date;
			priority_level: string | null;
		};

		const staffPerformanceMap = new Map<
			number,
			{
				staff_id: number;
				staff_name: string;
				staff_role: string;
				hospital_name: string;
				shift_schedule: string;
				transfers: TransferDetail[];
				total_transfers: number;
				preassignments: number;
				routine: number;
				moderate: number;
				critical: number;
			}
		>();

		// Process transfers
		transfers.forEach((transfer) => {
			const staffId = transfer.staff_id;

			if (!staffPerformanceMap.has(staffId)) {
				staffPerformanceMap.set(staffId, {
					staff_id: staffId,
					staff_name: transfer.staff.name,
					staff_role: transfer.staff.staff_role,
					hospital_name: transfer.staff.hospital.hospital_name,
					shift_schedule: transfer.staff.shift_schedule,
					transfers: [],
					total_transfers: 0,
					preassignments: 0,
					routine: 0,
					moderate: 0,
					critical: 0,
				});
			}

			const staffData = staffPerformanceMap.get(staffId)!;
			staffData.transfers.push({
				transfer_id: transfer.transfer_id,
				transferred_on: transfer.transferred_on,
				priority_level: transfer.priority_level,
			});
			staffData.total_transfers++;

			if (transfer.priority_level === "routine") {
				staffData.routine++;
			} else if (transfer.priority_level === "moderate") {
				staffData.moderate++;
			} else if (transfer.priority_level === "critical") {
				staffData.critical++;
			}
		});

		// Process preassignments
		preassignments.forEach((preassign) => {
			const staffId = preassign.staff_id;

			if (!staffPerformanceMap.has(staffId)) {
				staffPerformanceMap.set(staffId, {
					staff_id: staffId,
					staff_name: preassign.staff.name,
					staff_role: preassign.staff.staff_role,
					hospital_name: preassign.staff.hospital.hospital_name,
					shift_schedule: preassign.staff.shift_schedule,
					transfers: [],
					total_transfers: 0,
					preassignments: 0,
					routine: 0,
					moderate: 0,
					critical: 0,
				});
			}

			const staffData = staffPerformanceMap.get(staffId)!;
			staffData.preassignments++;
		});

		// Convert map to array
		const staffPerformance = Array.from(staffPerformanceMap.values());

		// Calculate summary statistics
		const totalTransfers = transfers.length;
		const totalStaff = staffPerformance.length;
		const totalPreassignments = preassignments.length;

		// Calculate average transfers per shift
		const morningStaff = staffPerformance.filter(
			(s) => s.shift_schedule === "morning"
		);
		const nightStaff = staffPerformance.filter(
			(s) => s.shift_schedule === "night"
		);

		const morningTransfers = morningStaff.reduce(
			(sum, s) => sum + s.total_transfers,
			0
		);
		const nightTransfers = nightStaff.reduce(
			(sum, s) => sum + s.total_transfers,
			0
		);

		const avgMorningShift =
			morningStaff.length > 0 ? morningTransfers / morningStaff.length : 0;
		const avgNightShift =
			nightStaff.length > 0 ? nightTransfers / nightStaff.length : 0;

		// Shift distribution
		const shiftDistribution = {
			morning: morningTransfers,
			night: nightTransfers,
		};

		// Role distribution
		const roleDistribution = {
			driver: transfers.filter((t) => t.staff.staff_role === "driver").length,
			emt: transfers.filter((t) => t.staff.staff_role === "emt").length,
			paramedic: transfers.filter((t) => t.staff.staff_role === "paramedic")
				.length,
		};

		return NextResponse.json({
			start_date: startDate,
			end_date: endDate,
			summary: {
				total_transfers: totalTransfers,
				total_staff: totalStaff,
				total_preassignments: totalPreassignments,
				avg_morning_shift: parseFloat(avgMorningShift.toFixed(2)),
				avg_night_shift: parseFloat(avgNightShift.toFixed(2)),
			},
			shift_distribution: shiftDistribution,
			role_distribution: roleDistribution,
			staff_performance: staffPerformance,
		});
	} catch (error) {
		console.error("Error fetching staff performance report:", error);
		return NextResponse.json(
			{ error: "Failed to fetch staff performance report" },
			{ status: 500 }
		);
	}
}
