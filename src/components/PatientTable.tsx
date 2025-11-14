"use client";

import { useState } from "react";

interface Patient {
	patient_id: number;
	ref_location_id: number;
	name: string | null;
	age: number | null;
	medical_condition: string | null;
	priority_level: string | null;
	contact_person: string | null;
	contact_number: number;
	transfer_status: string;
	date_created: string | null;
	date_updated: string | null;
}

export default function PatientTable({
	initialData,
}: {
	initialData: Patient[];
}) {
	const [patients] = useState<Patient[]>(initialData);

	return (
		<div className="max-w-[1750px] mx-auto px-6">
			<div className="bg-white rounded-2xl shadow-lg p-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-xl font-semibold text-gray-800">
							Patient Record Management
						</h2>
						<p className="text-sm text-gray-500">
							Manage and track all patient assignments
						</p>
					</div>
					<button className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
						+ Add Patient
					</button>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead className="border-b border-gray-200">
							<tr className="text-gray-600">
								<th className="py-3 px-4 font-bold">Patient ID</th>
								<th className="py-3 px-4 font-bold">Ref Location ID</th>
								<th className="py-3 px-4 font-bold">Name</th>
								<th className="py-3 px-4 font-bold">Age</th>
								<th className="py-3 px-4 font-bold">Medical Condition</th>
								<th className="py-3 px-4 font-bold">Priority Level</th>
								<th className="py-3 px-4 font-bold">Contact Person</th>
								<th className="py-3 px-4 font-bold">Contact Number</th>
								<th className="py-3 px-4 font-bold">Transfer Status</th>
								<th className="py-3 px-4 font-bold">Date Created</th>
								<th className="py-3 px-4 font-bold">Date Updated</th>
								<th className="py-3 px-4 font-bold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{patients.length === 0 ? (
								<tr>
									<td colSpan={12} className="py-8 text-center text-gray-500">
										No patient assignmenets found. Click &quot;+ Add
										Patient&quot; to get started.
									</td>
								</tr>
							) : (
								patients.map((patient) => (
									<tr
										key={patient.patient_id}
										className="border-b border-gray-100 hover:bg-gray-50"
									>
										<td className="py-4 px-4 font-medium text-gray-800">
											{patient.patient_id}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{patient.ref_location_id}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{patient.name ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{patient.age ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{patient.medical_condition ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{patient.priority_level ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{patient.contact_person ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{patient.contact_number ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{patient.transfer_status ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{patient.date_created
												? new Date(patient.date_created).toLocaleString(
														"en-US",
														{
															year: "numeric",
															month: "2-digit",
															day: "2-digit",
															hour: "2-digit",
															minute: "2-digit",
														}
												  )
												: "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-600">
											{patient.date_updated
												? new Date(patient.date_updated).toLocaleString(
														"en-US",
														{
															year: "numeric",
															month: "2-digit",
															day: "2-digit",
															hour: "2-digit",
															minute: "2-digit",
														}
												  )
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
