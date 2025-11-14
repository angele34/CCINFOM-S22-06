"use client";

import { useState } from "react";

interface Staff {
	staff_id: number;
	name: string | null;
	staff_role: string | null;
	license_no: string | null;
	shift_schedule: string | null;
	staff_status: string | null;
	date_created: string | null;
	date_updated: string | null;
}

export default function StaffTable({ initialData }: { initialData: Staff[] }) {
	const [staff] = useState<Staff[]>(initialData);

	return (
		<div className="max-w-[1500px] mx-auto px-6">
			<div className="bg-white rounded-2xl shadow-lg p-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-xl font-semibold text-gray-800">
							Staff Record Management
						</h2>
						<p className="text-sm text-gray-500">
							Manage and track all staff members
						</p>
					</div>
					<button className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
						+ Add Staff
					</button>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead className="border-b border-gray-200">
							<tr className="text-gray-600">
								<th className="py-3 px-4 font-bold">Staff ID</th>
								<th className="py-3 px-4 font-bold">Name</th>
								<th className="py-3 px-4 font-bold">Staff Role</th>
								<th className="py-3 px-4 font-bold">License No</th>
								<th className="py-3 px-4 font-bold">Shift Schedule</th>
								<th className="py-3 px-4 font-bold">Staff Status</th>
								<th className="py-3 px-4 font-bold">Date Created</th>
								<th className="py-3 px-4 font-bold">Date Updated</th>
								<th className="py-3 px-4 font-bold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{staff.length === 0 ? (
								<tr>
									<td colSpan={9} className="py-8 text-center text-gray-500">
										No staff records found. Click &quot;+ Add Staff&quot; to get
										started.
									</td>
								</tr>
							) : (
								staff.map((member) => (
									<tr
										key={member.staff_id}
										className="border-b border-gray-100 hover:bg-gray-50"
									>
										<td className="py-4 px-4 font-medium text-gray-800">
											{member.staff_id}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{member.name ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{member.staff_role ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{member.license_no ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{member.shift_schedule ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{member.staff_status ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{member.date_created
												? new Date(member.date_created)
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
											{member.date_updated
												? new Date(member.date_updated)
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
