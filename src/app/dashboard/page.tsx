"use client";
import { useState, useEffect } from "react";
import AppLayout from "../../components/ui/AppLayout";
import Image from "next/image";
import { Ambulance, Activity, TrendingUp } from "lucide-react";

interface Stats {
	totalAmbulances: number;
	totalPatients: number;
	totalStaff: number;
	totalHospitals: number;
	totalLocations: number;
}

export default function DashboardPage() {
	const [stats, setStats] = useState<Stats>({
		totalAmbulances: 0,
		totalPatients: 0,
		totalStaff: 0,
		totalHospitals: 0,
		totalLocations: 0,
	});

	// fetch all stats data
	useEffect(() => {
		const fetchStats = async () => {
			try {
				const [ambulances, patients, staff, hospitals, locations] =
					await Promise.all([
						fetch("/api/ambulance").then((res) => res.json()),
						fetch("/api/patient").then((res) => res.json()),
						fetch("/api/staff").then((res) => res.json()),
						fetch("/api/hospital").then((res) => res.json()),
						fetch("/api/reference_loc").then((res) => res.json()),
					]);

				setStats({
					totalAmbulances: ambulances.length,
					totalPatients: patients.length,
					totalStaff: staff.length,
					totalHospitals: hospitals.length,
					totalLocations: locations.length,
				});
			} catch (error) {
				console.error("Error fetching stats:", error);
			}
		};
		fetchStats();
	}, []);

	return (
		<AppLayout>
			<div className="p-6 space-y-6">
				{/* header */}
				<div>
					<h1 className="text-2xl font-bold text-ambulance-teal-750">
						Dashboard
					</h1>
					<p className="text-gray-600">
						Welcome to PrimeCare General Hospital Management System
					</p>
				</div>

				{/* cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{/* total records */}
					<div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-medium text-gray-600">
								Total Records
							</h3>
							<div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
						</div>
						<p className="text-2xl font-bold text-gray-900">
							{stats.totalAmbulances +
								stats.totalPatients +
								stats.totalStaff +
								stats.totalHospitals +
								stats.totalLocations}
						</p>
						<p className="text-xs text-gray-500 mt-1">All database entries</p>
					</div>

					{/* ambulances */}
					<div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-medium text-gray-600">Ambulances</h3>
							<div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
								<Image
									src="/icons/ambulance.svg"
									alt="Ambulance"
									width={20}
									height={20}
									className="opacity-70"
								/>
							</div>
						</div>
						<p className="text-2xl font-bold text-gray-900">
							{stats.totalAmbulances}
						</p>
						<p className="text-xs text-gray-500 mt-1">Active vehicles</p>
					</div>

					{/* patients  */}
					<div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-medium text-gray-600">Patients</h3>
							<div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
								<Image
									src="/icons/patients.svg"
									alt="Patients"
									width={20}
									height={20}
									className="opacity-70"
								/>
							</div>
						</div>
						<p className="text-2xl font-bold text-gray-900">
							{stats.totalPatients}
						</p>
						<p className="text-xs text-gray-500 mt-1">Registered patients</p>
					</div>

					{/* staffs */}
					<div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-medium text-gray-600">Staff</h3>
							<div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
								<Image
									src="/icons/staff.svg"
									alt="Staff"
									width={20}
									height={20}
									className="opacity-70"
								/>
							</div>
						</div>
						<p className="text-2xl font-bold text-gray-900">
							{stats.totalStaff}
						</p>
						<p className="text-xs text-gray-500 mt-1">Team members</p>
					</div>
				</div>

				{/* main content sa gitna */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* left side */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							Placeholder
						</h2>
					</div>

					{/* right side */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							lorem ipsum
						</h2>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
