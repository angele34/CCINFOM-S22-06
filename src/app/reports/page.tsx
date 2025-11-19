"use client";

import { useState } from "react";
import AppLayout from "../../components/ui/AppLayout";
import {
	PatientTransferReport,
	StaffPerformanceReport,
	AmbulanceUtilizationReport,
	HospitalAdmissionsReport,
} from "../../components/reports";
import { Users, UserCog, Ambulance, Building2, FileText } from "lucide-react";

type ReportType =
	| "patient-transfer"
	| "staff-performance"
	| "ambulance-utilization"
	| "hospital-admissions";

export default function ReportsPage() {
	const [activeReport, setActiveReport] = useState<ReportType | null>(
		"patient-transfer"
	);
	// Default to first day of current month to today
	const today = new Date();
	const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
	const [startDate, setStartDate] = useState<string>(
		firstDayOfMonth.toISOString().split("T")[0]
	);
	const [endDate, setEndDate] = useState<string>(
		today.toISOString().split("T")[0]
	);
	const [reportGenerated, setReportGenerated] = useState(false);

	const reports = [
		{
			id: "patient-transfer" as ReportType,
			label: "Patient Transfer Summary",
			icon: Users,
			description:
				"Number of transfers per patient with priority levels for a given date",
			disabled: false,
		},
		{
			id: "staff-performance" as ReportType,
			label: "Staff Performance",
			icon: UserCog,
			description:
				"Number of transfers handled and average per shift for a given date",
			disabled: false,
		},
		{
			id: "ambulance-utilization" as ReportType,
			label: "Ambulance Utilization",
			icon: Ambulance,
			description: "Total number of transfers per ambulance for a given date",
			disabled: false,
		},
		{
			id: "hospital-admissions" as ReportType,
			label: "Hospital Admissions",
			icon: Building2,
			description:
				"Total patients received per hospital branch for a given date",
			disabled: false,
		},
	];

	const handleGenerateReport = () => {
		if (!activeReport) {
			alert("Please select a report type");
			return;
		}
		if (!startDate || !endDate) {
			alert("Please select both start and end dates");
			return;
		}
		if (new Date(startDate) > new Date(endDate)) {
			alert("Start date must be before or equal to end date");
			return;
		}
		setReportGenerated(true);
	};

	const handleExportPDF = () => {
		// Add print-specific styling to fit content to printable area
		const style = document.createElement("style");
		style.id = "print-fit-style";
		style.textContent = `
			@media print {
				@page {
					size: auto;
					margin: 10mm;
				}
				body {
					width: 100%;
					max-width: 100%;
					overflow: visible;
				}
				* {
					max-width: 100% !important;
				}
			}
		`;
		document.head.appendChild(style);

		// Trigger print dialog
		window.print();

		// Remove the temporary style after printing
		setTimeout(() => {
			const tempStyle = document.getElementById("print-fit-style");
			if (tempStyle) {
				tempStyle.remove();
			}
		}, 1000);
	};

	const renderReport = () => {
		if (!reportGenerated || !activeReport) {
			return (
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center min-h-[400px]">
					<FileText className="w-16 h-16 text-gray-400 mb-4" />
					<h3 className="text-xl font-semibold text-gray-800 mb-2">
						No Report Generated
					</h3>
					<p className="text-gray-600 text-center max-w-md">
						Select a report type, choose a date range, and click &quot;Generate
						Report&quot; to view analytics.
					</p>
				</div>
			);
		}

		switch (activeReport) {
			case "patient-transfer":
				return (
					<PatientTransferReport
						startDate={startDate}
						endDate={endDate}
						onExportPDF={handleExportPDF}
					/>
				);
			case "staff-performance":
				return (
					<StaffPerformanceReport
						startDate={startDate}
						endDate={endDate}
						onExportPDF={handleExportPDF}
					/>
				);
			case "ambulance-utilization":
				return (
					<AmbulanceUtilizationReport
						startDate={startDate}
						endDate={endDate}
						onExportPDF={handleExportPDF}
					/>
				);
			case "hospital-admissions":
				return (
					<HospitalAdmissionsReport
						startDate={startDate}
						endDate={endDate}
						onExportPDF={handleExportPDF}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<AppLayout>
			<div className="p-6 space-y-6">
				{/* Header */}
				<div>
					<h1 className="text-2xl font-bold text-ambulance-teal-750">
						Reports
					</h1>
					<p className="text-gray-600">
						Generate and view system reports with analytics
					</p>
				</div>

				{/* Report Type Selection */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 print:hidden">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Select Report Type
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{reports.map((report) => (
							<button
								key={report.id}
								onClick={() => !report.disabled && setActiveReport(report.id)}
								disabled={report.disabled}
								className={`p-4 border-2 rounded-lg text-left transition-all ${
									report.disabled
										? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
										: activeReport === report.id
										? "border-teal-600 bg-teal-50"
										: "border-gray-200 hover:border-teal-600"
								}`}
							>
								<report.icon
									className={`w-8 h-8 mb-3 ${
										report.disabled
											? "text-gray-300"
											: activeReport === report.id
											? "text-teal-600"
											: "text-gray-400"
									}`}
								/>
								<h4 className="font-semibold text-gray-900 mb-1">
									{report.label}
								</h4>
								<p className="text-xs text-gray-600">{report.description}</p>
								{report.disabled && (
									<span className="inline-block mt-2 text-xs text-gray-500 italic">
										Coming soon
									</span>
								)}
							</button>
						))}
					</div>
				</div>

				{/* Date Range Filter */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Date Range Filter
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
						<div>
							<label className="block text-sm font-medium text-gray-900 mb-2">
								Start Date
							</label>
							<input
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								className="w-full px-4 py-2.5 text-base text-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								End Date
							</label>
							<input
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								className="w-full px-4 py-2.5 text-base text-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
							/>
						</div>
						<div>
							<button
								onClick={handleGenerateReport}
								disabled={!activeReport}
								className="w-full px-6 py-2.5 border border-teal-600 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							>
								<FileText className="w-4 h-4" />
								Generate Report
							</button>
						</div>
					</div>
				</div>

				{/* Report Content */}
				<div>{renderReport()}</div>
			</div>
		</AppLayout>
	);
}
