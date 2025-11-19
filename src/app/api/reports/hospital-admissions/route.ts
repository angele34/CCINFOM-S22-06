import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");

		if (!startDate || !endDate) {
			return NextResponse.json(
				{ error: "Start date and end date are required" },
				{ status: 400 }
			);
		}

		const start = new Date(startDate);
		const end = new Date(endDate);
		end.setHours(23, 59, 59, 999);

		// Get all patient requests with hospital, patient, and dispatch info
		const requests = await prisma.request.findMany({
			where: {
				requested_on: {
					gte: start,
					lte: end,
				},
				request_status: {
					in: ["accepted"],
				},
			},
			include: {
				hospital: true,
				patient: true,
				dispatch: {
					include: {
						ambulance: true,
					},
				},
			},
			orderBy: {
				requested_on: "asc",
			},
		});

		// Get all ambulance IDs from dispatches
		const ambulanceIds = requests
			.filter((r) => r.dispatch && r.dispatch.ambulance_id)
			.map((r) => r.dispatch!.ambulance_id);

		// Fetch all preassignments for these ambulances in one query
		const preassignments = await prisma.preassign.findMany({
			where: {
				ambulance_id: {
					in: ambulanceIds,
				},
				assignment_status: "active",
			},
			include: {
				staff: true,
			},
		});

		// Create a map of ambulance_id to staff for quick lookup
		const ambulanceStaffMap = new Map<number, string>();
		preassignments.forEach((pa) => {
			if (!ambulanceStaffMap.has(pa.ambulance_id) && pa.staff) {
				ambulanceStaffMap.set(pa.ambulance_id, pa.staff.name);
			}
		});

		// Group requests by hospital
		const hospitalMap = new Map<
			number,
			{
				hospital_id: number;
				hospital_name: string;
				admissions: Array<{
					request_id: number;
					requested_on: string;
					patient_name: string;
					priority_level: string | null;
					ambulance_plate: string;
					staff_name: string;
				}>;
				total_admissions: number;
				routine: number;
				moderate: number;
				critical: number;
			}
		>();

		let totalRoutine = 0;
		let totalModerate = 0;
		let totalCritical = 0;

		requests.forEach((request) => {
			const hospitalId = request.hospital_id;
			const hospitalName = request.hospital.hospital_name;

			if (!hospitalMap.has(hospitalId)) {
				hospitalMap.set(hospitalId, {
					hospital_id: hospitalId,
					hospital_name: hospitalName,
					admissions: [],
					total_admissions: 0,
					routine: 0,
					moderate: 0,
					critical: 0,
				});
			}

			const hospital = hospitalMap.get(hospitalId)!;

			// Get ambulance plate
			let ambulancePlate = "N/A";
			if (request.dispatch && request.dispatch.ambulance) {
				ambulancePlate = request.dispatch.ambulance.plate_no;
			}

			// Get staff name from the map
			let staffName = "N/A";
			if (request.dispatch && request.dispatch.ambulance_id) {
				staffName =
					ambulanceStaffMap.get(request.dispatch.ambulance_id) || "N/A";
			}

			hospital.admissions.push({
				request_id: request.request_id,
				requested_on: request.requested_on.toISOString(),
				patient_name: request.patient.name,
				priority_level: request.priority_level,
				ambulance_plate: ambulancePlate,
				staff_name: staffName,
			});

			hospital.total_admissions++;

			// Count by priority
			const priority = request.priority_level?.toLowerCase();
			if (priority === "routine") {
				hospital.routine++;
				totalRoutine++;
			} else if (priority === "moderate") {
				hospital.moderate++;
				totalModerate++;
			} else if (priority === "critical") {
				hospital.critical++;
				totalCritical++;
			}
		});

		const hospital_admissions = Array.from(hospitalMap.values());

		// Calculate summary statistics
		const totalAdmissions = requests.length;
		const totalHospitals = hospital_admissions.length;
		const avgAdmissionsPerHospital =
			totalHospitals > 0
				? Number((totalAdmissions / totalHospitals).toFixed(1))
				: 0;

		const reportData = {
			start_date: start.toISOString(),
			end_date: end.toISOString(),
			summary: {
				total_admissions: totalAdmissions,
				total_hospitals: totalHospitals,
				avg_admissions_per_hospital: avgAdmissionsPerHospital,
			},
			priority_distribution: {
				routine: totalRoutine,
				moderate: totalModerate,
				critical: totalCritical,
			},
			hospital_admissions,
		};

		return NextResponse.json(reportData);
	} catch (error) {
		console.error("Error generating hospital admissions report:", error);
		return NextResponse.json(
			{ error: "Failed to generate report" },
			{ status: 500 }
		);
	}
}
