"use client";

import { useState } from "react";

interface Hospital {
	hospital_id: number;
	hospital_name: string | null;
	hospital_type: string | null;
	hospital_address: string | null;
	city: string | null;
	hospital_capacity: number | null;
	date_created: string | null;
	date_updated: string | null;
}

export default function HospitalTable({
	initialData,
}: {
	initialData: Hospital[];
}) {
	const [hospitals] = useState<Hospital[]>(initialData);

	return (
		<div className="max-w-[1500px] mx-auto px-6">
			<div className="bg-white rounded-2xl shadow-lg p-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-xl font-semibold text-gray-800">
							Hospital Record Management
						</h2>
						<p className="text-sm text-gray-500">
							Manage and track all hospital facilities
						</p>
					</div>
					<button className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
						+ Add Hospital
					</button>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead className="border-b border-gray-200">
							<tr className="text-gray-600">
								<th className="py-3 px-4 font-bold">Hospital ID</th>
								<th className="py-3 px-4 font-bold">Hospital Name</th>
								<th className="py-3 px-4 font-bold">Hospital Type</th>
								<th className="py-3 px-4 font-bold">Hospital Address</th>
								<th className="py-3 px-4 font-bold">City</th>
								<th className="py-3 px-4 font-bold">Hospital Capacity</th>
								<th className="py-3 px-4 font-bold">Date Created</th>
								<th className="py-3 px-4 font-bold">Date Updated</th>
								<th className="py-3 px-4 font-bold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{hospitals.length === 0 ? (
								<tr>
									<td colSpan={9} className="py-8 text-center text-gray-500">
										No hospital records found. Click &quot;+ Add Hospital&quot;
										to get started.
									</td>
								</tr>
							) : (
								hospitals.map((hospital) => (
									<tr
										key={hospital.hospital_id}
										className="border-b border-gray-100 hover:bg-gray-50"
									>
										<td className="py-4 px-4 font-medium text-gray-800">
											{hospital.hospital_id}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{hospital.hospital_name ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{hospital.hospital_type ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{hospital.hospital_address ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{hospital.city ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{hospital.hospital_capacity ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{hospital.date_created
												? new Date(hospital.date_created)
														.toLocaleString("en-US", {
															month: "2-digit",
															day: "2-digit",
															year: "numeric",
															hour: "2-digit",
															minute: "2-digit",
															hour12: true,
														})
														.replace(",", " -")
												: "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{hospital.date_updated
												? new Date(hospital.date_updated)
														.toLocaleString("en-US", {
															month: "2-digit",
															day: "2-digit",
															year: "numeric",
															hour: "2-digit",
															minute: "2-digit",
															hour12: true,
														})
														.replace(",", " -")
												: "N/A"}
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
