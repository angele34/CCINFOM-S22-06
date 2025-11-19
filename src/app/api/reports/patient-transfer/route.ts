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
				patient: true,
				hospital: true,
				ambulance: true,
				staff: true,
			},
			orderBy: {
				transferred_on: "asc",
			},
		});

		// Group transfers by patient
		type TransferDetail = {
			transfer_id: number;
			transferred_on: Date;
			priority_level: string | null;
			hospital_name: string;
			ambulance_plate: string;
			staff_name: string;
		};

		const patientTransferMap = new Map<
			number,
			{
				patient_id: number;
				patient_name: string;
				transfers: TransferDetail[];
				total_transfers: number;
				routine: number;
				moderate: number;
				critical: number;
			}
		>();

		transfers.forEach((transfer) => {
			const patientId = transfer.patient_id;

			if (!patientTransferMap.has(patientId)) {
				patientTransferMap.set(patientId, {
					patient_id: patientId,
					patient_name: transfer.patient.name,
					transfers: [],
					total_transfers: 0,
					routine: 0,
					moderate: 0,
					critical: 0,
				});
			}

			const patientData = patientTransferMap.get(patientId)!;
			patientData.transfers.push({
				transfer_id: transfer.transfer_id,
				transferred_on: transfer.transferred_on,
				priority_level: transfer.priority_level,
				hospital_name: transfer.hospital.hospital_name,
				ambulance_plate: transfer.ambulance.plate_no,
				staff_name: transfer.staff.name,
			});
			patientData.total_transfers++;

			if (transfer.priority_level === "routine") {
				patientData.routine++;
			} else if (transfer.priority_level === "moderate") {
				patientData.moderate++;
			} else if (transfer.priority_level === "critical") {
				patientData.critical++;
			}
		});

		// Convert map to array
		const patientTransfers = Array.from(patientTransferMap.values());

		// Calculate summary statistics
		const totalTransfers = transfers.length;
		const totalPatients = patientTransfers.length;
		const avgTransfersPerPatient =
			totalPatients > 0 ? totalTransfers / totalPatients : 0;

		// Priority distribution
		const priorityDistribution = {
			routine: transfers.filter((t) => t.priority_level === "routine").length,
			moderate: transfers.filter((t) => t.priority_level === "moderate").length,
			critical: transfers.filter((t) => t.priority_level === "critical").length,
		};

		return NextResponse.json({
			start_date: startDate,
			end_date: endDate,
			summary: {
				total_transfers: totalTransfers,
				total_patients: totalPatients,
				avg_transfers_per_patient: parseFloat(
					avgTransfersPerPatient.toFixed(2)
				),
			},
			priority_distribution: priorityDistribution,
			patient_transfers: patientTransfers,
		});
	} catch (error) {
		console.error("Error fetching patient transfer report:", error);
		return NextResponse.json(
			{ error: "Failed to fetch patient transfer report" },
			{ status: 500 }
		);
	}
}
