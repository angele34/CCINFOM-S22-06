"use client";

import { useEffect, useState } from "react";
import {
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { Users, FileText } from "lucide-react";

interface TransferDetail {
	transfer_id: number;
	transferred_on: string;
	priority_level: string | null;
	hospital_name: string;
	ambulance_plate: string;
	staff_name: string;
}

interface PatientTransfer {
	patient_id: number;
	patient_name: string;
	transfers: TransferDetail[];
	total_transfers: number;
	routine: number;
	moderate: number;
	critical: number;
}

interface ReportData {
	start_date: string;
	end_date: string;
	summary: {
		total_transfers: number;
		total_patients: number;
		avg_transfers_per_patient: number;
	};
	priority_distribution: {
		routine: number;
		moderate: number;
		critical: number;
	};
	patient_transfers: PatientTransfer[];
}

interface PatientTransferReportProps {
	startDate: string;
	endDate: string;
	onExportPDF?: () => void;
}

export default function PatientTransferReport({
	startDate,
	endDate,
	onExportPDF,
}: PatientTransferReportProps) {
	const [data, setData] = useState<ReportData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchReport = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(
				`/api/reports/patient-transfer?startDate=${startDate}&endDate=${endDate}`
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

	// Prepare chart data - filter out empty names and show all patients
	const chartData = data.patient_transfers
		.filter((pt) => pt.patient_name && pt.patient_name.trim() !== "")
		.sort((a, b) => b.total_transfers - a.total_transfers)
		.map((pt) => ({
			patient: pt.patient_name,
			routine: pt.routine,
			moderate: pt.moderate,
			critical: pt.critical,
			total: pt.total_transfers,
		}));

	const pieData = [
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
	];

	return (
		<div className="space-y-4">
			{/* Header Card */}
			<div className="bg-teal-50 border-2 border-teal-600 rounded-xl p-4 flex items-start justify-between gap-4">
				<div className="flex-1">
					<h2 className="text-xl font-bold text-teal-900">
						Patient Transfer Summary Report
					</h2>
					<p className="text-xs text-teal-700 mt-0.5 italic">
						Number of transfers per patient, including priority levels
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
							<p className="text-xs text-gray-600">Total Transfers</p>
							<h2 className="text-2xl font-bold text-ambulance-teal-750 mt-0.5">
								{data.summary.total_transfers}
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
							<p className="text-xs text-gray-600">Active Patients</p>
							<h2 className="text-2xl font-bold text-ambulance-teal-750 mt-0.5">
								{data.summary.total_patients}
							</h2>
						</div>
						<div
							className="p-2 rounded-lg"
							style={{ backgroundColor: "#066961" }}
						>
							<FileText className="w-5 h-5 text-white" />
						</div>
					</div>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs text-gray-600">Avg Transfers per Patient</p>
							<h2 className="text-2xl font-bold text-ambulance-teal-750 mt-0.5">
								{data.summary.avg_transfers_per_patient}
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
			</div>

			{/* Bar Chart and Patient Transfer Data - Side by Side */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{/* Bar Chart */}
				{chartData.length > 0 && (
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
						<h3 className="text-lg font-bold text-ambulance-teal-750 mb-2">
							Transfers by Patient with Priority Levels
						</h3>
						<ResponsiveContainer width="100%" height={380}>
							<BarChart
								data={chartData}
								margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
							>
								<CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
								<XAxis
									dataKey="patient"
									tick={{ fill: "#003533", fontSize: 11 }}
									angle={-15}
									textAnchor="end"
									height={50}
								/>
								<YAxis tick={{ fill: "#003533", fontSize: 11 }} />
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

				{/* Patient Transfer Data Table */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
					<h3 className="text-lg font-bold text-ambulance-teal-750 mb-3">
						Patient Transfer Data
					</h3>
					<div className="border rounded-lg overflow-hidden">
						<table className="w-full text-sm">
							<thead className="bg-teal-700 shadow-md">
								<tr>
									<th className="px-3 py-2 text-left font-semibold text-white text-sm">
										Patient Name
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
										Total Transfers
									</th>
								</tr>
							</thead>
							<tbody>
								{data.patient_transfers.length === 0 ? (
									<tr>
										<td
											colSpan={5}
											className="px-3 py-8 text-center text-gray-500 text-sm"
										>
											No transfer data available for this period
										</td>
									</tr>
								) : (
									data.patient_transfers.map((patient) => (
										<tr
											key={patient.patient_id}
											className="border-b border-gray-100 hover:bg-gray-50"
										>
											<td className="px-3 py-2 text-ambulance-teal-750 text-sm">
												{patient.patient_name}
											</td>
											<td className="px-3 py-2 text-center text-gray-700 text-sm">
												{patient.routine}
											</td>
											<td className="px-3 py-2 text-center text-gray-700 text-sm">
												{patient.moderate}
											</td>
											<td className="px-3 py-2 text-center text-gray-700 text-sm">
												{patient.critical}
											</td>
											<td className="px-3 py-2 text-center">
												<span
													className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
													style={{ backgroundColor: "#00897b" }}
												>
													{patient.total_transfers}
												</span>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Detailed Transfer Records */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
				<h3 className="text-lg font-bold text-ambulance-teal-750 mb-1">
					Detailed Transfer Records
				</h3>
				<p className="text-xs text-gray-600 mb-3">
					Complete list of all transfers with priority levels
				</p>
				<div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
					<table className="w-full text-sm">
						<thead className="sticky top-0 bg-teal-700 z-10 shadow-md">
							<tr>
								<th className="px-3 py-2 text-left font-semibold text-white text-sm">
									Transfer ID
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
									Hospital
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
							{data.patient_transfers
								.flatMap((patient) =>
									patient.transfers.map((transfer) => ({
										patient_name: patient.patient_name,
										...transfer,
									}))
								)
								.sort((a, b) => a.transfer_id - b.transfer_id)
								.map((transfer) => (
									<tr
										key={transfer.transfer_id}
										className="border-b border-gray-100 hover:bg-gray-50"
									>
										<td className="px-3 py-2 font-medium text-ambulance-teal-750 text-sm">
											#{transfer.transfer_id.toString().padStart(4, "0")}
										</td>
										<td className="px-3 py-2 text-ambulance-teal-750 text-sm">
											{transfer.patient_name}
										</td>
										<td className="px-3 py-2 text-ambulance-teal-750 text-sm">
											{formatDate(transfer.transferred_on)}
										</td>
										<td className="px-3 py-2">
											<span
												className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadgeClass(
													transfer.priority_level
												)}`}
												style={getPriorityBadgeStyle(transfer.priority_level)}
											>
												{transfer.priority_level
													? transfer.priority_level.charAt(0).toUpperCase() +
													  transfer.priority_level.slice(1)
													: "N/A"}
											</span>
										</td>
										<td className="px-3 py-2 text-ambulance-teal-750 text-sm">
											{transfer.hospital_name}
										</td>
										<td className="px-3 py-2 text-ambulance-teal-750 text-sm">
											{transfer.ambulance_plate}
										</td>
										<td className="px-3 py-2 text-ambulance-teal-750 text-sm">
											{transfer.staff_name}
										</td>
									</tr>
								))}
							{data.patient_transfers.length === 0 && (
								<tr>
									<td
										colSpan={7}
										className="px-3 py-8 text-center text-gray-500 text-sm"
									>
										No detailed transfer records available
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Priority Distribution and Top Patients */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{/* Pie Chart */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
					<h3 className="text-lg font-bold text-ambulance-teal-750 mb-3">
						Priority Level Distribution
					</h3>
					<ResponsiveContainer width="100%" height={280}>
						<PieChart>
							<Pie
								data={pieData}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={({ name, value }) => `${name}:  ${value}`}
								outerRadius={90}
								fill="#8884d8"
								dataKey="value"
							>
								{pieData.map((entry, index) => (
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
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				</div>

				{/* Top Patients */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
					<h3 className="text-lg font-bold text-ambulance-teal-750 mb-3">
						Top Patients by Transfer Count
					</h3>
					<div className="space-y-2">
						{data.patient_transfers
							.sort((a, b) => b.total_transfers - a.total_transfers)
							.slice(0, 5)
							.map((patient, index) => (
								<div
									key={patient.patient_id}
									className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
								>
									<div className="flex items-center gap-2">
										<div
											className="flex items-center justify-center w-7 h-7 rounded-full font-semibold text-sm"
											style={{ backgroundColor: "#066961", color: "#ffffff" }}
										>
											{index + 1}
										</div>
										<span className="text-ambulance-teal-750 text-sm">
											{patient.patient_name}
										</span>
									</div>
									<span
										className="font-medium text-sm"
										style={{ color: "#066961" }}
									>
										{patient.total_transfers} transfers
									</span>
								</div>
							))}
						{data.patient_transfers.length === 0 && (
							<p className="text-center text-gray-500 py-6 text-sm">
								No patient data available
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
