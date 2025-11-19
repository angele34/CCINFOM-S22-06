"use client";

import { useEffect, useState } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import { Building2, FileText, Users } from "lucide-react";

interface AdmissionDetail {
	request_id: number;
	requested_on: string;
	patient_name: string;
	priority_level: string | null;
	ambulance_plate: string;
	staff_name: string;
}

interface HospitalAdmission {
	hospital_id: number;
	hospital_name: string;
	admissions: AdmissionDetail[];
	total_admissions: number;
	routine: number;
	moderate: number;
	critical: number;
}

interface ReportData {
	start_date: string;
	end_date: string;
	summary: {
		total_admissions: number;
		total_hospitals: number;
		avg_admissions_per_hospital: number;
	};
	priority_distribution: {
		routine: number;
		moderate: number;
		critical: number;
	};
	hospital_admissions: HospitalAdmission[];
}

interface HospitalAdmissionsReportProps {
	startDate: string;
	endDate: string;
	onExportPDF?: () => void;
}

export default function HospitalAdmissionsReport({
	startDate,
	endDate,
	onExportPDF,
}: HospitalAdmissionsReportProps) {
	const [data, setData] = useState<ReportData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchReport = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(
				`/api/reports/hospital-admissions?startDate=${startDate}&endDate=${endDate}`
			);
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Failed to fetch report");
			}
			const reportData = await res.json();
			setData(reportData);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			console.error("Error fetching report:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchReport();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [startDate, endDate]);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	const getPriorityBadgeClass = (priority: string | null) => {
		if (!priority) return "bg-gray-100 text-gray-800";
		switch (priority.toLowerCase()) {
			case "critical":
				return "text-white";
			case "moderate":
				return "text-white";
			case "routine":
				return "text-white";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getPriorityBadgeStyle = (priority: string | null) => {
		if (!priority) return {};
		switch (priority.toLowerCase()) {
			case "critical":
				return { backgroundColor: "#0a574f" };
			case "moderate":
				return { backgroundColor: "#00897b" };
			case "routine":
				return { backgroundColor: "#00a894" };
			default:
				return {};
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<p className="text-gray-500 text-lg">Loading report...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<p className="text-red-600 text-lg font-medium mb-2">Error</p>
					<p className="text-gray-600">{error}</p>
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<p className="text-gray-500 text-lg">No data available</p>
			</div>
		);
	}

	// Prepare chart data
	const getBranchName = (hospitalName: string) => {
		if (hospitalName.includes("QC")) return "Quezon City Branch";
		if (hospitalName.includes("Manila")) return "Manila Branch";
		if (hospitalName.includes("Muntinlupa")) return "Muntinlupa Branch";
		return hospitalName;
	};

	const chartData = data.hospital_admissions
		.filter((hosp) => hosp.hospital_name && hosp.hospital_name.trim() !== "")
		.sort((a, b) => b.total_admissions - a.total_admissions)
		.map((hosp) => ({
			hospital: getBranchName(hosp.hospital_name),
			routine: hosp.routine,
			moderate: hosp.moderate,
			critical: hosp.critical,
			total: hosp.total_admissions,
		}));

	return (
		<div className="space-y-4">
			{/* Header Card */}
			<div className="bg-teal-50 border-2 border-teal-600 rounded-xl p-4 flex items-start justify-between gap-4">
				<div className="flex-1">
					<h2 className="text-xl font-bold text-teal-900">
						Hospital Admissions Report
					</h2>
					<p className="text-xs text-teal-700 mt-0.5 italic">
						Total number of patients received per hospital branch
					</p>
					<p className="text-xs text-teal-900 mt-2 font-medium">
						Period:{" "}
						{new Date(data.start_date).toLocaleDateString("en-US", {
							month: "long",
							day: "numeric",
							year: "numeric",
						})}{" "}
						to{" "}
						{new Date(data.end_date).toLocaleDateString("en-US", {
							month: "long",
							day: "numeric",
							year: "numeric",
						})}
					</p>
					<p className="text-xs text-teal-600 mt-0.5">
						Generated on {new Date().toLocaleString()}
					</p>
				</div>
				{onExportPDF && (
					<button
						onClick={onExportPDF}
						className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition flex items-center gap-2"
					>
						<FileText className="w-4 h-4" />
						Export PDF
					</button>
				)}
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs text-gray-600">Total Admissions</p>
							<h2 className="text-2xl font-bold text-ambulance-teal-750 mt-0.5">
								{data.summary.total_admissions}
							</h2>
						</div>
						<div
							className="p-3 rounded-lg"
							style={{ backgroundColor: "#066961" }}
						>
							<Users className="w-6 h-6 text-white" />
						</div>
					</div>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs text-gray-600">Active Hospitals</p>
							<h2 className="text-2xl font-bold text-ambulance-teal-750 mt-0.5">
								{data.summary.total_hospitals}
							</h2>
						</div>
						<div
							className="p-2 rounded-lg"
							style={{ backgroundColor: "#066961" }}
						>
							<Building2 className="w-5 h-5 text-white" />
						</div>
					</div>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs text-gray-600">
								Avg Admissions per Hospital
							</p>
							<h2 className="text-2xl font-bold text-ambulance-teal-750 mt-0.5">
								{data.summary.avg_admissions_per_hospital}
							</h2>
						</div>
						<div
							className="p-3 rounded-lg"
							style={{ backgroundColor: "#066961" }}
						>
							<Building2 className="w-6 h-6 text-white" />
						</div>
					</div>
				</div>
			</div>

			{/* Bar Chart and Hospital Data - Side by Side */}
			<div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
				{/* Bar Chart */}
				{chartData.length > 0 && (
					<div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
						<h3 className="text-lg font-bold text-ambulance-teal-750 mb-2">
							Admissions by Hospital with Priority Levels
						</h3>
						<ResponsiveContainer width="100%" height={600}>
							<BarChart
								data={chartData}
								margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
							>
								<CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
								<XAxis
									dataKey="hospital"
									tick={{ fill: "#003533", fontSize: 13 }}
									angle={-15}
									textAnchor="end"
									height={50}
								/>
								<YAxis tick={{ fill: "#003533", fontSize: 13 }} />
								<Tooltip
									contentStyle={{
										backgroundColor: "#fff",
										border: "1px solid #14b8a6",
										borderRadius: "8px",
										color: "#003533",
									}}
									labelStyle={{ color: "#003533", fontWeight: "bold" }}
									itemStyle={{ color: "#003533" }}
								/>
								<Legend
									wrapperStyle={{ color: "#003533" }}
									verticalAlign="top"
									height={36}
									iconSize={10}
								/>
								<Bar
									dataKey="routine"
									stackId="a"
									fill="#00a894"
									stroke="none"
									name="Routine"
									radius={[0, 0, 0, 0]}
								/>
								<Bar
									dataKey="moderate"
									stackId="a"
									fill="#00897b"
									stroke="none"
									name="Moderate"
									radius={[0, 0, 0, 0]}
								/>
								<Bar
									dataKey="critical"
									stackId="a"
									fill="#0a574f"
									stroke="none"
									name="Critical"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				)}

				{/* Hospital Data Column - Stacked */}
				<div className="lg:col-span-2 space-y-4">
					{/* Hospital Admissions Data Table */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
						<h3 className="text-lg font-bold text-ambulance-teal-750 mb-3">
							Hospital Admissions Data
						</h3>
						<div className="border rounded-lg overflow-hidden">
							<table className="w-full text-sm">
								<thead className="bg-teal-700 shadow-md">
									<tr>
										<th className="px-3 py-2 text-left font-semibold text-white text-sm">
											Hospital Name
										</th>
										<th className="px-3 py-2 text-center font-semibold text-white text-sm">
											Routine
										</th>
										<th className="px-3 py-2 text-center font-semibold text-white text-sm">
											Moderate
										</th>
										<th className="px-3 py-2 text-center font-semibold text-white text-sm">
											Critical
										</th>
										<th className="px-3 py-2 text-center font-semibold text-white text-sm">
											Total Admissions
										</th>
									</tr>
								</thead>
								<tbody>
									{data.hospital_admissions.length === 0 ? (
										<tr>
											<td
												colSpan={5}
												className="px-3 py-8 text-center text-gray-500 text-sm"
											>
												No admission data available for this period
											</td>
										</tr>
									) : (
										data.hospital_admissions
											.sort((a, b) => a.hospital_id - b.hospital_id)
											.map((hospital) => (
												<tr
													key={hospital.hospital_id}
													className="border-b border-gray-100 hover:bg-gray-50"
												>
													<td className="px-3 py-2 text-ambulance-teal-750 text-sm">
														{hospital.hospital_name}
													</td>
													<td className="px-3 py-2 text-center text-gray-700 text-sm">
														{hospital.routine}
													</td>
													<td className="px-3 py-2 text-center text-gray-700 text-sm">
														{hospital.moderate}
													</td>
													<td className="px-3 py-2 text-center text-gray-700 text-sm">
														{hospital.critical}
													</td>
													<td className="px-3 py-2 text-center">
														<span
															className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
															style={{ backgroundColor: "#00897b" }}
														>
															{hospital.total_admissions}
														</span>
													</td>
												</tr>
											))
									)}
								</tbody>
							</table>
						</div>
					</div>

					{/* Priority Distribution Pie Chart */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
						<h3 className="text-lg font-bold text-ambulance-teal-750 mb-3">
							Priority Level Distribution
						</h3>
						<ResponsiveContainer width="100%" height={350}>
							<PieChart>
								<Pie
									data={[
										{
											name: "Routine",
											value: data.priority_distribution.routine,
											color: "#00897b",
										},
										{
											name: "Moderate",
											value: data.priority_distribution.moderate,
											color: "#066961",
										},
										{
											name: "Critical",
											value: data.priority_distribution.critical,
											color: "#0a574f",
										},
									]}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, value }) => `${name}:  ${value}`}
									outerRadius={90}
									fill="#8884d8"
									dataKey="value"
								>
									{[
										{
											name: "Routine",
											value: data.priority_distribution.routine,
											color: "#00897b",
										},
										{
											name: "Moderate",
											value: data.priority_distribution.moderate,
											color: "#066961",
										},
										{
											name: "Critical",
											value: data.priority_distribution.critical,
											color: "#0a574f",
										},
									].map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={entry.color}
											stroke="none"
										/>
									))}
								</Pie>
								<Tooltip
									contentStyle={{
										backgroundColor: "#fff",
										border: "1px solid #00a894",
										borderRadius: "8px",
									}}
								/>
								<Legend verticalAlign="bottom" height={0} />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>

			{/* Detailed Admission Records */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
				<h3 className="text-lg font-bold text-ambulance-teal-750 mb-1">
					Detailed Admission Records
				</h3>
				<p className="text-xs text-gray-600 mb-3">
					Complete list of all patient admissions with priority levels
				</p>
				<div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
					<table className="w-full text-sm">
						<thead className="sticky top-0 bg-teal-700 z-10 shadow-md">
							<tr>
								<th className="px-3 py-2 text-left font-semibold text-white text-sm">
									Request ID
								</th>
								<th className="px-3 py-2 text-left font-semibold text-white text-sm">
									Hospital Name
								</th>
								<th className="px-3 py-2 text-left font-semibold text-white text-sm">
									Patient Name
								</th>
								<th className="px-3 py-2 text-left font-semibold text-white text-sm">
									Date & Time
								</th>
								<th className="px-3 py-2 text-left font-semibold text-white text-sm">
									Priority Level
								</th>
								<th className="px-3 py-2 text-left font-semibold text-white text-sm">
									Ambulance
								</th>
								<th className="px-3 py-2 text-left font-semibold text-white text-sm">
									Staff
								</th>
							</tr>
						</thead>
						<tbody>
							{data.hospital_admissions
								.flatMap((hospital) =>
									hospital.admissions.map((admission) => ({
										hospital_name: hospital.hospital_name,
										...admission,
									}))
								)
								.sort((a, b) => a.request_id - b.request_id)
								.map((admission) => (
									<tr
										key={admission.request_id}
										className="border-b border-gray-100 hover:bg-gray-50"
									>
										<td className="px-3 py-2 font-medium text-ambulance-teal-750 text-sm">
											#{admission.request_id.toString().padStart(4, "0")}
										</td>
										<td className="px-3 py-2 text-ambulance-teal-750 text-sm">
											{admission.hospital_name}
										</td>
										<td className="px-3 py-2 text-ambulance-teal-750 text-sm">
											{admission.patient_name}
										</td>
										<td className="px-3 py-2 text-ambulance-teal-750 text-sm">
											{formatDate(admission.requested_on)}
										</td>
										<td className="px-3 py-2">
											<span
												className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadgeClass(
													admission.priority_level
												)}`}
												style={getPriorityBadgeStyle(admission.priority_level)}
											>
												{admission.priority_level
													? admission.priority_level.charAt(0).toUpperCase() +
													  admission.priority_level.slice(1)
													: "N/A"}
											</span>
										</td>
										<td className="px-3 py-2 text-ambulance-teal-750 text-sm">
											{admission.ambulance_plate}
										</td>
										<td className="px-3 py-2 text-ambulance-teal-750 text-sm">
											{admission.staff_name}
										</td>
									</tr>
								))}
							{data.hospital_admissions.length === 0 && (
								<tr>
									<td
										colSpan={7}
										className="px-3 py-8 text-center text-gray-500 text-sm"
									>
										No detailed admission records available
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
