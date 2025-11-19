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
import { Ambulance, FileText, TrendingUp } from "lucide-react";

interface TransferDetail {
	transfer_id: number;
	transferred_on: Date;
	priority_level: string | null;
	patient_name: string;
	hospital_name: string;
}

interface AmbulanceUtilization {
	ambulance_id: number;
	plate_number: string;
	ambulance_type: string;
	transfers: TransferDetail[];
	total_transfers: number;
	total_dispatches: number;
	routine: number;
	moderate: number;
	critical: number;
}

interface ReportData {
	start_date: string;
	end_date: string;
	summary: {
		total_transfers: number;
		total_ambulances: number;
		total_dispatches: number;
		avg_transfers_per_ambulance: number;
	};
	priority_distribution: {
		routine: number;
		moderate: number;
		critical: number;
	};
	type_distribution: {
		type1: number;
		type2: number;
	};
	ambulance_utilization: AmbulanceUtilization[];
}

interface AmbulanceUtilizationReportProps {
	startDate: string;
	endDate: string;
	onExportPDF?: () => void;
}

export function AmbulanceUtilizationReport({
	startDate,
	endDate,
	onExportPDF,
}: AmbulanceUtilizationReportProps) {
	const [data, setData] = useState<ReportData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchReport = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(
				`/api/reports/ambulance-utilization?startDate=${startDate}&endDate=${endDate}`
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

	if (loading) {
		return (
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading report...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<p className="text-red-600 mb-2">Error loading report</p>
					<p className="text-gray-600">{error}</p>
				</div>
			</div>
		);
	}

	if (!data) {
		return null;
	}

	// Prepare chart data for transfers by ambulance
	const chartData = data.ambulance_utilization
		.filter((amb) => amb.plate_number && amb.plate_number.trim() !== "")
		.sort((a, b) => b.total_transfers - a.total_transfers)
		.map((amb) => ({
			ambulance: `Ambulance #${amb.ambulance_id}`,
			routine: amb.routine,
			moderate: amb.moderate,
			critical: amb.critical,
			total: amb.total_transfers,
		}));

	const priorityPieData = [
		{
			name: "Routine",
			value: data.priority_distribution.routine,
			color: "#00a894",
		},
		{
			name: "Moderate",
			value: data.priority_distribution.moderate,
			color: "#00897b",
		},
		{
			name: "Critical",
			value: data.priority_distribution.critical,
			color: "#0a574f",
		},
	];

	const typePieData = [
		{
			name: "Type 1",
			value: data.type_distribution.type1,
			color: "#00897b",
		},
		{
			name: "Type 2",
			value: data.type_distribution.type2,
			color: "#066961",
		},
	];

	return (
		<div className="space-y-4">
			{/* Header Card */}
			<div className="bg-teal-50 border-2 border-teal-600 rounded-xl p-4 flex items-start justify-between gap-4">
				<div className="flex-1">
					<h2 className="text-xl font-bold text-teal-900">
						Ambulance Utilization Report
					</h2>
					<p className="text-xs text-teal-700 mt-0.5 italic">
						Total number of transfers per ambulance for a given period
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
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 print:hidden">
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
							<TrendingUp className="w-6 h-6 text-white" />
						</div>
					</div>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs text-gray-600">Active Ambulances</p>
							<h2 className="text-2xl font-bold text-ambulance-teal-750 mt-0.5">
								{data.summary.total_ambulances}
							</h2>
						</div>
						<div
							className="p-2 rounded-lg"
							style={{ backgroundColor: "#066961" }}
						>
							<Ambulance className="w-5 h-5 text-white" />
						</div>
					</div>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs text-gray-600">Total Dispatches</p>
							<h2 className="text-2xl font-bold text-ambulance-teal-750 mt-0.5">
								{data.summary.total_dispatches}
							</h2>
						</div>
						<div
							className="p-3 rounded-lg"
							style={{ backgroundColor: "#066961" }}
						>
							<FileText className="w-6 h-6 text-white" />
						</div>
					</div>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs text-gray-600">Avg per Ambulance</p>
							<h2 className="text-2xl font-bold text-ambulance-teal-750 mt-0.5">
								{data.summary.avg_transfers_per_ambulance}
							</h2>
						</div>
						<div
							className="p-3 rounded-lg"
							style={{ backgroundColor: "#066961" }}
						>
							<TrendingUp className="w-6 h-6 text-white" />
						</div>
					</div>
				</div>
			</div>

			{/* Bar Chart - Standalone */}
			{chartData.length > 0 && (
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 print:hidden">
					<h3 className="text-lg font-bold text-ambulance-teal-750 mb-2">
						Transfers by Ambulance with Priority Levels
					</h3>
					<ResponsiveContainer width="100%" height={380}>
						<BarChart
							data={chartData}
							margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
						>
							<CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
							<XAxis
								dataKey="ambulance"
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
								fill="#2ca37f"
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

			{/* Detailed Ambulance Utilization Records */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
				<h3 className="text-lg font-bold text-ambulance-teal-750 mb-1">
					Detailed Ambulance Utilization Records
				</h3>
				<p className="text-xs text-gray-600 mb-3">
					Complete list of all ambulances with transfer details
				</p>
				<div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
					<table className="w-full text-sm">
						<thead className="sticky top-0 bg-teal-700 z-10 shadow-md">
							<tr>
								<th className="px-3 py-2 text-left font-semibold text-white text-sm">
									Ambulance Number
								</th>
								<th className="px-3 py-2 text-left font-semibold text-white text-sm">
									Plate Number
								</th>
								<th className="px-3 py-2 text-center font-semibold text-white text-sm">
									Type
								</th>
								<th className="px-3 py-2 text-center font-semibold text-white text-sm">
									Dispatches
								</th>
								<th className="px-3 py-2 text-center font-semibold text-white text-sm border-l-2 border-white">
									Routine
								</th>
								<th className="px-3 py-2 text-center font-semibold text-white text-sm">
									Moderate
								</th>
								<th className="px-3 py-2 text-center font-semibold text-white text-sm">
									Critical
								</th>
								<th className="px-3 py-2 text-center font-semibold text-white text-sm">
									Total
								</th>
							</tr>
						</thead>
						<tbody>
							{data.ambulance_utilization.length === 0 ? (
								<tr>
									<td
										colSpan={7}
										className="px-3 py-8 text-center text-gray-500 text-sm"
									>
										No detailed ambulance utilization records available
									</td>
								</tr>
							) : (
								data.ambulance_utilization
									.sort((a, b) => a.ambulance_id - b.ambulance_id)
									.map((ambulance) => (
										<tr
											key={ambulance.ambulance_id}
											className="border-b border-gray-100 hover:bg-gray-50"
										>
											<td className="px-3 py-2 text-ambulance-teal-750 text-sm font-medium">
												Ambulance #{ambulance.ambulance_id}
											</td>
											<td className="px-3 py-2 text-ambulance-teal-750 text-sm font-medium">
												{ambulance.plate_number}
											</td>
											<td className="px-3 py-2 text-center">
												<span
													className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
													style={{ backgroundColor: "#00897b" }}
												>
													{ambulance.ambulance_type === "type_1"
														? "Type 1"
														: "Type 2"}
												</span>
											</td>
											<td className="px-3 py-2 text-center text-gray-700 text-sm">
												{ambulance.total_dispatches}
											</td>
											<td className="px-3 py-2 text-center text-gray-700 text-sm border-l-2 border-gray-200">
												{ambulance.routine}
											</td>
											<td className="px-3 py-2 text-center text-gray-700 text-sm">
												{ambulance.moderate}
											</td>
											<td className="px-3 py-2 text-center text-gray-700 text-sm">
												{ambulance.critical}
											</td>
											<td className="px-3 py-2 text-center">
												<span
													className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
													style={{ backgroundColor: "#00897b" }}
												>
													{ambulance.total_transfers}
												</span>
											</td>
										</tr>
									))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Distribution Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 print:hidden">
				{/* Priority Distribution */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
					<h3 className="text-lg font-bold text-ambulance-teal-750 mb-3">
						Transfers by Priority Level
					</h3>
					<ResponsiveContainer width="100%" height={280}>
						<PieChart>
							<Pie
								data={priorityPieData}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={({ name, value }) => `${name}:  ${value}`}
								outerRadius={90}
								fill="#8884d8"
								dataKey="value"
							>
								{priorityPieData.map((entry, index) => (
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

				{/* Ambulance Type Distribution */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
					<h3 className="text-lg font-bold text-ambulance-teal-750 mb-3">
						Transfers by Ambulance Type
					</h3>
					<ResponsiveContainer width="100%" height={280}>
						<PieChart>
							<Pie
								data={typePieData}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={({ name, value }) => `${name}:  ${value}`}
								outerRadius={90}
								fill="#8884d8"
								dataKey="value"
							>
								{typePieData.map((entry, index) => (
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
			</div>
		</div>
	);
}
