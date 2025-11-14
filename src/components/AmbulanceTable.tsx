"use client";

import { useState } from "react";
import FormModal from "./FormModal";
import {
	isDuplicateKeyError,
	showDuplicateAlert,
	generateNextUniqueId,
	extractExistingIds,
} from "@/src/lib/duplicateHandler";

interface Ambulance {
	assignment_id: number;
	ambulance_id: number | null;
	staff_id: number | null;
	assignment_date: string | null;
	shift_sched: string | null;
}

export default function AmbulanceTable({
	initialData,
	onUpdate,
}: {
	initialData: Ambulance[];
	onUpdate?: () => void;
}) {
	const [showModal, setShowModal] = useState(false);

	const formFields = [
		{
			name: "assignment_id",
			label: "Assignment ID",
			type: "number" as const,
			required: true,
			placeholder: "Enter assignment ID",
		},
		{
			name: "ambulance_id",
			label: "Ambulance ID",
			type: "number" as const,
			placeholder: "Enter ambulance ID",
		},
		{
			name: "staff_id",
			label: "Staff ID",
			type: "number" as const,
			placeholder: "Enter staff ID",
		},
		{
			name: "assignment_date",
			label: "Assignment Date",
			type: "date" as const,
		},
		{
			name: "shift_sched",
			label: "Shift Schedule",
			type: "text" as const,
			placeholder: "Enter shift schedule",
		},
	];

	const handleFormSubmit = async (formData: Record<string, string>) => {
		try {
			const initialAssignmentId = parseInt(formData.assignment_id);
			let assignmentId = initialAssignmentId;
			const payload = {
				assignment_id: assignmentId,
				ambulance_id: formData.ambulance_id
					? parseInt(formData.ambulance_id)
					: null,
				staff_id: formData.staff_id ? parseInt(formData.staff_id) : null,
				assignment_date: formData.assignment_date || null,
				shift_sched: formData.shift_sched || null,
			};

			let response = await fetch("/api/ambulance", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			// handle duplicate primary key error
			if (!response.ok) {
				const errorData = await response.json();
				if (isDuplicateKeyError(errorData.error)) {
					const existingIds = extractExistingIds(
						initialData as unknown as Record<string, unknown>[],
						"assignment_id"
					);
					const suggestedId = generateNextUniqueId(existingIds);

					const userConfirmed = showDuplicateAlert(
						"Assignment ID",
						assignmentId,
						suggestedId
					);

					if (userConfirmed) {
						// retry with the new ID
						assignmentId = suggestedId;
						payload.assignment_id = suggestedId;
						response = await fetch("/api/ambulance", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(payload),
						});
					} else {
						// user cancelled, don't proceed
						return;
					}
				}
			}

			if (response.ok) {
				setShowModal(false);
				onUpdate?.();
			} else {
				const errorData = await response.json();
				alert(`Error: ${errorData.error}`);
			}
		} catch (error) {
			console.error("Error creating ambulance:", error);
			alert("An error occurred while creating the ambulance assignment");
		}
	};

	return (
		<div className="max-w-[1500px] mx-auto px-6">
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
					<button
						onClick={() => setShowModal(true)}
						className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
					>
						+ Add Ambulance
					</button>
				</div>

				<FormModal
					isOpen={showModal}
					onClose={() => setShowModal(false)}
					onSubmit={handleFormSubmit}
					title="New Ambulance Assignment"
					fields={formFields}
					submitLabel="Add Ambulance"
				/>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead className="border-b border-gray-200">
							<tr className="text-gray-600">
								<th className="py-3 px-4 font-bold">Assignment ID</th>
								<th className="py-3 px-4 font-bold">Ambulance ID</th>
								<th className="py-3 px-4 font-bold">Staff ID</th>
								<th className="py-3 px-4 font-bold">Assignment Date</th>
								<th className="py-3 px-4 font-bold">Shift Schedule</th>
								<th className="py-3 px-4 font-bold">Date Created</th>
								<th className="py-3 px-4 font-bold">Date Updated</th>
								<th className="py-3 px-4 font-bold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{initialData.length === 0 ? (
								<tr>
									<td colSpan={8} className="py-12 text-center">
										<p className="text-gray-500 text-base">
											No ambulance assignments found. Click &quot;+ Add
											Ambulance&quot; to get started.
										</p>
									</td>
								</tr>
							) : (
								initialData.map((amb) => (
									<tr
										key={amb.assignment_id}
										className="border-b border-gray-100 hover:bg-gray-50"
									>
										<td className="py-4 px-4 font-medium text-gray-900">
											{amb.assignment_id}
										</td>
										<td className="py-4 px-4 text-gray-800">
											{amb.ambulance_id ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-800">
											{amb.staff_id ?? "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-800">
											{amb.assignment_date
												? new Date(amb.assignment_date).toLocaleDateString()
												: "N/A"}
										</td>
										<td className="py-4 px-4 text-gray-800">
											{amb.shift_sched ?? "N/A"}
										</td>
										<td className="py-4 px-4">
											<div className="flex items-center justify-left gap-2">
												<button
													className="p-2 hover:bg-blue-100 rounded transition"
													title="Edit"
												>
													<img
														src="/icons/edit.svg"
														alt="Edit"
														width="18"
														height="18"
													/>
												</button>
												<button
													className="p-2 hover:bg-red-100 rounded transition"
													title="Delete"
												>
													<img
														src="/icons/delete.svg"
														alt="Delete"
														width="20"
														height="20"
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
		</div>
	);
}
