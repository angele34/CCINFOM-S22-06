"use client";

import { useState } from "react";

interface Ambulance {
	assignment_id: number;
	ambulance_id: number | null;
	staff_id: number | null;
	assignment_date: string | null;
	shift_sched: string | null;
}

export default function AmbulanceTable({
	initialData,
}: {
	initialData: Ambulance[];
}) {
	const [ambulances] = useState<Ambulance[]>(initialData);

	return (
		<div className="max-w-7xl mx-auto px-6">
			<div className="bg-white rounded-2xl shadow-lg p-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-xl font-semibold text-gray-800">
							Ambulance Record Management
						</h2>
						<p className="text-sm text-gray-500">
							Manage and track all ambulance assignments in the fleet
						</p>
					</div>
					<button className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
						+ Add Ambulance
					</button>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead className="border-b border-gray-200">
							<tr className="text-gray-600">
								<th className="py-3 px-4 font-medium">Ambulance ID</th>
								<th className="py-3 px-4 font-medium">Plate Number</th>
								<th className="py-3 px-4 font-medium">Ambulance Type</th>
								<th className="py-3 px-4 font-medium">Ambulance Status</th>
								<th className="py-3 px-4 font-medium">Hospital Location ID</th>
								<th className="py-3 px-4 font-medium">Actions</th>
							</tr>
						</thead>
						<tbody>
							{ambulances.length === 0 ? (
								<tr>
									<td colSpan={6} className="py-8 text-center text-gray-500">
										No ambulance assignments found. Click &quot;+ Add
										Ambulance&quot; to get started.
									</td>
								</tr>
							) : (
								ambulances.map((amb) => (
									<tr
										key={amb.assignment_id}
										className="border-b border-gray-100 hover:bg-gray-50"
									>
										<td className="py-4 px-4 font-medium text-gray-800">
											{amb.assignment_id}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{amb.ambulance_id ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{amb.staff_id ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{amb.assignment_date
												? new Date(amb.assignment_date).toLocaleDateString()
												: "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{amb.shift_sched ?? "N/A"}
										</td>
										<td className="py-4 px-4 flex gap-2">
											<button
												className="p-2 hover:bg-gray-100 rounded"
												title="Edit"
											>
												✏️
											</button>
											<button
												className="p-2 hover:bg-gray-100 rounded"
												title="Delete"
											>
												🗑️
											</button>
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
