"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export interface DispatchTransaction {
	dispatch_id: number;
	patient_id: number;
	patient_name: string;
	ambulance_id: number;
	hospital_id: number;
	hospital_name: string;
	priority_level: string;
	status: string;
	created_at: string;
}

export default function DispatchTable() {
	const [data, setData] = useState<DispatchTransaction[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		fetch("/api/dispatch")
			.then((res) => res.json())
			.then((json) => {
				if (!mounted) return;
				setData(Array.isArray(json) ? json : []);
			})
			.catch((err) => {
				console.error("Failed to fetch dispatches:", err);
				setData([]);
			})
			.finally(() => mounted && setLoading(false));
		return () => {
			mounted = false;
		};
	}, []);

	return (
		<div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col overflow-hidden">
			<div className="flex items-center justify-between mb-3">
				<div>
					<h2 className="text-xl font-semibold text-ambulance-teal-750">
						Dispatch Ambulance
					</h2>
					<p className="text-sm text-ambulance-teal-750 text-opacity-80">
						Assign ambulances to patient requests based on priority
					</p>
				</div>
				<button className="px-5 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition">
					+ New Dispatch
				</button>
			</div>

			<div className="overflow-auto flex-1 border-b border-gray-200">
				<table className="w-full text-left text-sm">
					<thead className="border-b border-gray-200 sticky top-0 bg-white z-10 shadow">
						<tr className="text-ambulance-teal-750">
							<th className="py-2 px-3 font-bold">Dispatch ID</th>
							<th className="py-2 px-3 font-bold">Patient ID</th>
							<th className="py-2 px-3 font-bold">Patient Name</th>
							<th className="py-2 px-3 font-bold">Ambulance ID</th>
							<th className="py-2 px-3 font-bold">Hospital ID</th>
							<th className="py-2 px-3 font-bold">Hospital Name</th>
							<th className="py-2 px-3 font-bold">Priority Level</th>
							<th className="py-2 px-3 font-bold">Status</th>
							<th className="py-2 px-3 font-bold">Date Created</th>
							<th className="py-2 px-3 font-bold">Actions</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan={10} className="py-12 text-center">
									<p className="text-gray-500 text-base">Loading...</p>
								</td>
							</tr>
						) : data.length === 0 ? (
							<tr>
								<td colSpan={10} className="py-12 text-center">
									<p className="text-gray-500 text-base">
										No dispatch records found. Click &quot;+ New Dispatch&quot;
										to get started.
									</p>
								</td>
							</tr>
						) : (
							data.map((item) => (
								<tr
									key={item.dispatch_id}
									className="border-b border-gray-100 hover:bg-gray-50"
								>
									<td className="py-3 px-3 font-medium text-gray-900">
										{item.dispatch_id}
									</td>
									<td className="py-3 px-3 text-gray-800">{item.patient_id}</td>
									<td className="py-3 px-3 text-gray-800">
										{item.patient_name}
									</td>
									<td className="py-3 px-3 text-gray-800">
										{item.ambulance_id}
									</td>
									<td className="py-3 px-3 text-gray-800">
										{item.hospital_id}
									</td>
									<td className="py-3 px-3 text-gray-800">
										{item.hospital_name}
									</td>
									<td className="py-3 px-3">
										<span
											className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
												item.priority_level === "critical"
													? "bg-red-100 text-red-800"
													: item.priority_level === "moderate"
													? "bg-yellow-100 text-yellow-800"
													: "bg-blue-100 text-blue-800"
											}`}
										>
											{item.priority_level}
										</span>
									</td>
									<td className="py-3 px-3">
										<span
											className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
												item.status === "dispatched"
													? "bg-green-100 text-green-800"
													: "bg-gray-100 text-gray-800"
											}`}
										>
											{item.status}
										</span>
									</td>
									<td className="py-3 px-3 text-gray-800">
										{new Date(item.created_at).toLocaleString()}
									</td>
									<td className="py-3 px-3">
										<div className="flex items-center gap-2">
											<button
												className="p-2 hover:bg-blue-100 rounded transition"
												title="View"
											>
												<Image
													src="/icons/edit.svg"
													alt="View"
													width={18}
													height={18}
												/>
											</button>
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
