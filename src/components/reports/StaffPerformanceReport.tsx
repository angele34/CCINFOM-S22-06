"use client";

import React, { useEffect, useState } from "react";
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
import { Users, FileText, TrendingUp } from "lucide-react";

type StaffPerformanceData = {
	start_date: string;
	end_date: string;
	summary: {
		total_transfers: number;
		total_staff: number;
		total_preassignments: number;
		avg_morning_shift: number;
		avg_night_shift: number;
	};
	shift_distribution: {
		morning: number;
		night: number;
	};
	role_distribution: {
		driver: number;
		emt: number;
		paramedic: number;
	};
	staff_performance: Array<{
		staff_id: number;
		staff_name: string;
		staff_role: string;
		hospital_name: string;
		shift_schedule: string;
		total_transfers: number;
		preassignments: number;
		routine: number;
		moderate: number;
		critical: number;
		transfers: Array<{
			transfer_id: number;
			transferred_on: Date;
			priority_level: string | null;
		}>;
	}>;
};

type StaffPerformanceReportProps = {
	startDate: string;
	endDate: string;
	onExportPDF?: () => void;
};

export function StaffPerformanceReport({
	startDate,
	endDate,
	onExportPDF,
}: StaffPerformanceReportProps) {
	const [data, setData] = useState<StaffPerformanceData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchReport = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(
				`/api/reports/staff-performance?startDate=${startDate}&endDate=${endDate}`
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

	// Prepare chart data for transfers by staff
	const chartData = data.staff_performance
		.filter((staff) => staff.staff_name && staff.staff_name.trim() !== "")
		.sort((a, b) => b.total_transfers - a.total_transfers)
		.map((staff) => ({
			staff: staff.staff_name,
			routine: staff.routine,
			moderate: staff.moderate,
			critical: staff.critical,
			total: staff.total_transfers,
		}));

	const shiftData = [
		{
			name: "Morning Shift",
			value: data.shift_distribution.morning,
			color: "#00897b",
		},
		{
			name: "Night Shift",
			value: data.shift_distribution.night,
			color: "#066961",
		},
	];

	const roleData = [
		{
			name: "Driver",
			value: data.role_distribution.driver,
			color: "#00897b",
		},
		{
			name: "EMT",
			value: data.role_distribution.emt,
			color: "#066961",
		},
		{
			name: "Paramedic",
			value: data.role_distribution.paramedic,
			color: "#0a574f",
		},
	];

	return (
		<div className="space-y-4">
			{/* Header Card */}
			<div className="bg-teal-50 border-2 border-teal-600 rounded-xl p-4 flex items-start justify-between gap-4">
				<div className="flex-1">
					<h2 className="text-xl font-bold text-teal-900">
						Staff Performance Report
					</h2>
					<p className="text-xs text-teal-700 mt-0.5 italic">
						Number of patient transfers handled and average transfers per shift
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
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 print:hidden">
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
							<p className="text-xs text-gray-600">Active Staff</p>
							<h2 className="text-2xl font-bold text-ambulance-teal-750 mt-0.5">
								{data.summary.total_staff}
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
							<p className="text-xs text-gray-600">Avg Transfer per Staff</p>
							<h2 className="text-2xl font-bold text-ambulance-teal-750 mt-0.5">
								{data.summary.total_staff > 0
									? (
											data.summary.total_transfers / data.summary.total_staff
									  ).toFixed(2)
									: 0}
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

			{/* Charts and Top Performers Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 print:hidden">
				{/* Left Column: Bar Chart and Pie Charts */}
				<div className="lg:col-span-2 space-y-4">
					{/* Bar Chart */}
					{chartData.length > 0 && (
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
							<h3 className="text-lg font-bold text-ambulance-teal-750 mb-2">
								Transfers by Staff with Priority Levels
							</h3>
							<ResponsiveContainer width="100%" height={320}>
								<BarChart
									data={chartData}
									margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
								>
									<CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
									<XAxis
										dataKey="staff"
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

					{/* Pie Charts Side by Side */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Shift Distribution */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
							<h3 className="text-lg font-bold text-ambulance-teal-750 mb-3">
								Transfers by Shift
							</h3>
							<ResponsiveContainer width="100%" height={280}>
								<PieChart>
									<Pie
										data={shiftData}
										cx="50%"
										cy="50%"
										labelLine={false}
										label={({ name, value }) => `${name}:  ${value}`}
										outerRadius={80}
										fill="#8884d8"
										dataKey="value"
									>
										{shiftData.map((entry, index) => (
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
						</div>{" "}
						{/* Role Distribution */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
							<h3 className="text-lg font-bold text-ambulance-teal-750 mb-3">
								Transfers by Role
							</h3>
							<ResponsiveContainer width="100%" height={240}>
								<PieChart>
									<Pie
										data={roleData}
										cx="50%"
										cy="50%"
										labelLine={false}
										label={({ name, value }) => `${name}:  ${value}`}
										outerRadius={80}
										fill="#8884d8"
										dataKey="value"
									>
										{roleData.map((entry, index) => (
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
									<Legend verticalAlign="bottom" height={36} />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>{" "}
				{/* Right Column: Top Performers */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 h-full flex flex-col">
						<h3 className="text-lg font-bold text-ambulance-teal-750 mb-3">
							Top Performers by Transfer Count
						</h3>
						<div className="space-y-2 overflow-y-auto">
							{data.staff_performance
								.sort((a, b) => b.total_transfers - a.total_transfers)
								.slice(0, 10)
								.map((staff, index) => (
									<div
										key={staff.staff_id}
										className="flex items-center justify-between p-[9px] bg-gray-50 border border-gray-200 rounded-lg"
									>
										<div className="flex items-center gap-2">
											<div
												className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-sm"
												style={{ backgroundColor: "#066961" }}
											>
												{index + 1}
											</div>
											<div>
												<p className="font-semibold text-ambulance-teal-750 text-sm">
													{staff.staff_name}
												</p>
												<p className="text-[13px] text-gray-600">
													{staff.staff_role === "emt"
														? "EMT"
														: staff.staff_role.charAt(0).toUpperCase() +
														  staff.staff_role.slice(1)}{" "}
													•{" "}
													{staff.shift_schedule.charAt(0).toUpperCase() +
														staff.shift_schedule.slice(1)}{" "}
													Shift
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-base font-bold text-ambulance-teal-750">
												{staff.total_transfers}
											</p>
											<p className="text-[12px] text-gray-600">transfers</p>
										</div>
									</div>
								))}
						</div>
					</div>
				</div>
			</div>

			{/* Detailed Transfer Records */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
				<h3 className="text-lg font-bold text-ambulance-teal-750 mb-1">
					Detailed Staff Performance Records
				</h3>
				<p className="text-xs text-gray-600 mb-3">
					Complete list of all staff with transfer details
				</p>
				<div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
					<table className="w-full text-sm">
						<thead className="sticky top-0 bg-teal-700 z-10 shadow-md">
							<tr>
								<th className="px-3 py-2 text-left font-semibold text-white text-sm">
									Staff Number
								</th>
								<th className="px-3 py-2 text-left font-semibold text-white text-sm">
									Staff Name
								</th>
								<th className="px-3 py-2 text-left font-semibold text-white text-sm">
									Role
								</th>
								<th className="px-3 py-2 text-left font-semibold text-white text-sm">
									Hospital
								</th>
								<th className="px-3 py-2 text-left font-semibold text-white text-sm">
									Shift
								</th>
								<th className="px-3 py-2 text-center font-semibold text-white text-sm">
									Preassignments
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
									Total Transfers
								</th>
							</tr>
						</thead>
						<tbody>
							{data.staff_performance.length === 0 ? (
								<tr>
									<td
										colSpan={10}
										className="px-3 py-8 text-center text-gray-500 text-sm"
									>
										No detailed staff performance records available
									</td>
								</tr>
							) : (
								data.staff_performance
									.sort((a, b) => a.staff_id - b.staff_id)
									.map((staff) => (
										<tr
											key={staff.staff_id}
											className="border-b border-gray-100 hover:bg-gray-50"
										>
											<td className="px-3 py-2 text-ambulance-teal-750 text-sm font-medium">
												Staff #{staff.staff_id}
											</td>
											<td className="px-3 py-2 text-ambulance-teal-750 text-sm font-medium">
												{staff.staff_name}
											</td>
											<td className="px-3 py-2 text-ambulance-teal-750 text-sm">
												{staff.staff_role === "emt"
													? "EMT"
													: staff.staff_role.charAt(0).toUpperCase() +
													  staff.staff_role.slice(1)}
											</td>
											<td className="px-3 py-2 text-ambulance-teal-750 text-sm">
												{staff.hospital_name}
											</td>
											<td className="px-3 py-2 text-ambulance-teal-750 text-sm capitalize">
												{staff.shift_schedule}
											</td>
											<td className="px-3 py-2 text-center text-gray-700 text-sm">
												{staff.preassignments}
											</td>
											<td className="px-3 py-2 text-center text-gray-700 text-sm border-l-2 border-gray-200">
												{staff.routine}
											</td>
											<td className="px-3 py-2 text-center text-gray-700 text-sm">
												{staff.moderate}
											</td>
											<td className="px-3 py-2 text-center text-gray-700 text-sm">
												{staff.critical}
											</td>
											<td className="px-3 py-2 text-center">
												<span
													className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
													style={{ backgroundColor: "#00897b" }}
												>
													{staff.total_transfers}
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
	);
}
