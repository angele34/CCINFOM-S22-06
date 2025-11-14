"use client";

import { useState } from "react";

interface Location {
	ref_location_id: number;
	reference_address: string | null;
	city: string | null;
	hospital_id: number | null;
	date_created: string | null;
	date_updated: string | null;
}

export default function LocationTable({
	initialData,
}: {
	initialData: Location[];
}) {
	const [locations] = useState<Location[]>(initialData);

	return (
		<div className="max-w-[1400px] mx-auto px-6">
			<div className="bg-white rounded-2xl shadow-lg p-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-xl font-semibold text-gray-800">
							Reference Location Record Management
						</h2>
						<p className="text-sm text-gray-500">
							Viewing a reference location record along with the address
						</p>
					</div>
					<button className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
						+ Add Location
					</button>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead className="border-b border-gray-200">
							<tr className="text-gray-600">
								<th className="py-3 px-4 font-bold">Ref Location ID</th>
								<th className="py-3 px-4 font-bold">Reference Address</th>
								<th className="py-3 px-4 font-bold">City</th>
								<th className="py-3 px-4 font-bold">Hospital ID</th>
								<th className="py-3 px-4 font-bold">Date Created</th>
								<th className="py-3 px-4 font-bold">Date Updated</th>
								<th className="py-3 px-4 font-bold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{locations.length === 0 ? (
								<tr>
									<td colSpan={7} className="py-8 text-center text-gray-500">
										No location records found. Click &quot;+ Add Location&quot;
										to get started.
									</td>
								</tr>
							) : (
								locations.map((loc) => (
									<tr
										key={loc.ref_location_id}
										className="border-b border-gray-100 hover:bg-gray-50"
									>
										<td className="py-4 px-4 font-medium text-gray-800">
											{loc.ref_location_id}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{loc.reference_address ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{loc.city ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{loc.hospital_id ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{loc.date_created
												? new Date(loc.date_created)
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
											{loc.date_updated
												? new Date(loc.date_updated)
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
