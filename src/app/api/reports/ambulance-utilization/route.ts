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
				ambulance: true,
				patient: true,
				hospital: true,
				staff: true,
			},
			orderBy: {
				transferred_on: "asc",
			},
		});

		// Fetch all dispatches within the date range
		const dispatches = await prisma.dispatch.findMany({
			where: {
				dispatched_on: {
					gte: startDate,
					lte: endDate,
				},
			},
			include: {
				ambulance: true,
			},
		});

		// Group transfers and dispatches by ambulance
		type TransferDetail = {
			transfer_id: number;
			transferred_on: Date;
			priority_level: string | null;
			patient_name: string;
			hospital_name: string;
		};

		type DispatchDetail = {
			dispatch_id: number;
			dispatched_on: Date;
		};

		const ambulanceUtilizationMap = new Map<
			number,
			{
				ambulance_id: number;
				plate_number: string;
				ambulance_type: string;
				transfers: TransferDetail[];
				dispatches: DispatchDetail[];
				total_transfers: number;
				total_dispatches: number;
				routine: number;
				moderate: number;
				critical: number;
			}
		>();

		// Process transfers
		transfers.forEach((transfer) => {
			const ambulanceId = transfer.ambulance_id;

			if (!ambulanceUtilizationMap.has(ambulanceId)) {
				const utilizationData = {
					ambulance_id: ambulanceId,
					plate_number: transfer.ambulance.plate_no,
					ambulance_type: transfer.ambulance.ambulance_type,
					transfers: [] as TransferDetail[],
					dispatches: [] as DispatchDetail[],
					total_transfers: 0,
					total_dispatches: 0,
					routine: 0,
					moderate: 0,
					critical: 0,
				};
				ambulanceUtilizationMap.set(ambulanceId, utilizationData);
			}

			const ambulanceData = ambulanceUtilizationMap.get(ambulanceId)!;
			ambulanceData.transfers.push({
				transfer_id: transfer.transfer_id,
				transferred_on: transfer.transferred_on,
				priority_level: transfer.priority_level,
				patient_name: transfer.patient.name,
				hospital_name: transfer.hospital.hospital_name,
			});
			ambulanceData.total_transfers++;

			if (transfer.priority_level === "routine") {
				ambulanceData.routine++;
			} else if (transfer.priority_level === "moderate") {
				ambulanceData.moderate++;
			} else if (transfer.priority_level === "critical") {
				ambulanceData.critical++;
			}
		});

		// Process dispatches
		dispatches.forEach((dispatch) => {
			const ambulanceId = dispatch.ambulance_id;

			if (!ambulanceUtilizationMap.has(ambulanceId)) {
				const utilizationData = {
					ambulance_id: ambulanceId,
					plate_number: dispatch.ambulance.plate_no,
					ambulance_type: dispatch.ambulance.ambulance_type,
					transfers: [] as TransferDetail[],
					dispatches: [] as DispatchDetail[],
					total_transfers: 0,
					total_dispatches: 0,
					routine: 0,
					moderate: 0,
					critical: 0,
				};
				ambulanceUtilizationMap.set(ambulanceId, utilizationData);
			}

			const ambulanceData = ambulanceUtilizationMap.get(ambulanceId)!;
			ambulanceData.dispatches.push({
				dispatch_id: dispatch.dispatch_id,
				dispatched_on: dispatch.dispatched_on,
			});
			ambulanceData.total_dispatches++;
		});

		// Convert map to array
		const ambulanceUtilization = Array.from(ambulanceUtilizationMap.values());

		// Calculate summary statistics
		const totalTransfers = transfers.length;
		const totalAmbulances = ambulanceUtilization.length;
		const totalDispatches = dispatches.length;
		const avgTransfersPerAmbulance =
			totalAmbulances > 0 ? totalTransfers / totalAmbulances : 0;

		// Priority distribution
		const priorityDistribution = {
			routine: transfers.filter((t) => t.priority_level === "routine").length,
			moderate: transfers.filter((t) => t.priority_level === "moderate").length,
			critical: transfers.filter((t) => t.priority_level === "critical").length,
		};

		// Ambulance type distribution
		const typeDistribution = {
			type1: transfers.filter((t) => t.ambulance.ambulance_type === "type_1")
				.length,
			type2: transfers.filter((t) => t.ambulance.ambulance_type === "type_2")
				.length,
		};

		return NextResponse.json({
			start_date: startDate,
			end_date: endDate,
			summary: {
				total_transfers: totalTransfers,
				total_ambulances: totalAmbulances,
				total_dispatches: totalDispatches,
				avg_transfers_per_ambulance: parseFloat(
					avgTransfersPerAmbulance.toFixed(2)
				),
			},
			priority_distribution: priorityDistribution,
			type_distribution: typeDistribution,
			ambulance_utilization: ambulanceUtilization,
		});
	} catch (error) {
		console.error("Error fetching ambulance utilization report:", error);
		return NextResponse.json(
			{ error: "Failed to fetch ambulance utilization report" },
			{ status: 500 }
		);
	}
}
