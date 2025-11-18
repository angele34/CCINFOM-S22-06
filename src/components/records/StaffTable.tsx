"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import FormModal from "../ui/FormModal";

interface Staff {
	staff_id: number;
	name: string;
	staff_role: string;
	license_no: string;
	shift_schedule: string;
	staff_status: string;
	created_at: string;
	updated_at: string | null;
	hospital_id: number;
}

export default function StaffTable({
	initialData,
	onUpdate,
}: {
	initialData: Staff[];
	onUpdate?: () => void;
}) {
	const [showModal, setShowModal] = useState(false);
	const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
	const [hospitals, setHospitals] = useState<
		{ hospital_id: number; hospital_name: string }[]
	>([]);

	const formFields = [
		{
			name: "hospital_id",
			label: "Hospital",
			type: "select" as const,
			required: true,
			options: hospitals.map((h) => ({
				value: h.hospital_id.toString(),
				label: `${h.hospital_name} (ID: ${h.hospital_id})`,
			})),
		},
		{
			name: "name",
			label: "Staff Name",
			type: "text" as const,
			required: true,
			placeholder: "Enter staff name",
			minLength: 1,
			maxLength: 50,
			customErrorMessages: {
				required: "Staff name is required",
				minLength: "Staff name is required",
				maxLength: "Staff name must not exceed 50 characters",
			},
		},
		{
			name: "staff_role",
			label: "Staff Role",
			type: "select" as const,
			required: true,
			options: [
				{ value: "driver", label: "Driver" },
				{ value: "emt", label: "EMT" },
				{ value: "paramedic", label: "Paramedic" },
			],
		},
		{
			name: "license_no",
			label: "License Number",
			type: "text" as const,
			required: true,
			placeholder: "LIC-NNN-NNN (e.g., LIC-123-456)",
			minLength: 11,
			maxLength: 11,
			pattern: "^LIC-\\d{3}-\\d{3}$",
			customErrorMessages: {
				required: "License number is required",
				pattern: "License must be in format LIC-NNN-NNN (e.g., LIC-123-456)",
				minLength: "License must be exactly 11 characters",
				maxLength: "License must be exactly 11 characters",
			},
		},
		{
			name: "shift_schedule",
			label: "Shift Schedule",
			type: "select" as const,
			required: true,
			options: [
				{ value: "morning", label: "Morning" },
				{ value: "night", label: "Night" },
			],
		},
		{
			name: "staff_status",
			label: "Staff Status",
			type: "select" as const,
			required: true,
			options: [
				{ value: "available", label: "Available" },
				{ value: "in_transfer", label: "In Transfer" },
				{ value: "off_duty", label: "Off Duty" },
			],
		},
	];

	useEffect(() => {
		const fetchHospitals = async () => {
			try {
				const res = await fetch("/api/hospital");
				if (res.ok) {
					const data = await res.json();
					setHospitals(data || []);
				}
			} catch (err) {
				console.error("Failed to fetch hospitals", err);
			}
		};

		fetchHospitals();
	}, []);

	const handleFormSubmit = async (formData: Record<string, string>) => {
		try {
			const payload = {
				hospital_id: parseInt(formData.hospital_id, 10),
				name: formData.name,
				staff_role: formData.staff_role,
				license_no: formData.license_no,
				shift_schedule: formData.shift_schedule,
				staff_status: formData.staff_status,
			};
			const url = "/api/staff";
			const method = editingStaff ? "PUT" : "POST";
			const body = editingStaff
				? { ...payload, staff_id: editingStaff.staff_id }
				: payload;

			const response = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (response.ok) {
				setShowModal(false);
				setEditingStaff(null);
				onUpdate?.();
			} else {
				const errorData = await response.json();

				if (errorData.details && Array.isArray(errorData.details)) {
					const errorMessages = errorData.details
						.map(
							(err: { path: string[]; message: string }) =>
								`${err.path.join(".")}: ${err.message}`
						)
						.join("\n");
					alert(`Validation errors:\n${errorMessages}`);
				} else {
					alert(`Error: ${errorData.error || "Unknown error"}`);
				}
			}
		} catch (error) {
			console.error("Error saving staff:", error);
			alert("An error occurred while saving the staff record");
		}
	};

	const handleEdit = (staff: Staff) => {
		setEditingStaff(staff);
		setShowModal(true);
	};

	const handleDelete = async (staff_id: number) => {
		if (!confirm("Are you sure you want to delete this staff member?")) {
			return;
		}

		try {
			const response = await fetch("/api/staff", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ staff_id }),
			});

			if (response.ok) {
				onUpdate?.();
			} else {
				const errorData = await response.json();
				alert(`Error: ${errorData.error || "Failed to delete staff"}`);
			}
		} catch (error) {
			console.error("Error deleting staff:", error);
			alert("An error occurred while deleting the staff record");
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setEditingStaff(null);
	};

	return (
		<div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col overflow-hidden">
			<div className="flex items-center justify-between mb-3">
				<div>
					<h2 className="text-xl font-semibold text-ambulance-teal-750">
						Staff Record Management
					</h2>
					<p className="text-sm text-ambulance-teal-750 text-opacity-80">
						Manage and track all staff members
					</p>
				</div>
				<button
					onClick={() => setShowModal(true)}
					className="px-5 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
				>
					+ Add Staff
				</button>
			</div>

			<FormModal
				isOpen={showModal}
				onClose={handleCloseModal}
				onSubmit={handleFormSubmit}
				title={editingStaff ? "Edit Staff Record" : "New Staff Record"}
				fields={formFields}
				submitLabel={editingStaff ? "Update Staff" : "Add Staff"}
				initialData={
					editingStaff
						? {
								hospital_id: editingStaff?.hospital_id?.toString() || "",
								name: editingStaff.name || "",
								staff_role: editingStaff.staff_role || "",
								license_no: editingStaff.license_no || "",
								shift_schedule: editingStaff.shift_schedule || "",
								staff_status: editingStaff.staff_status || "",
						  }
						: undefined
				}
			/>

			{/* Table */}
			<div className="overflow-auto flex-1 border-b border-gray-200">
				<table className="w-full text-left text-sm">
					<thead className="border-b border-gray-200 sticky top-0 bg-white z-10 shadow">
						<tr className="text-ambulance-teal-750">
							<th className="py-2 px-1 font-bold text-center">Staff ID</th>
							<th className="py-2 px-3 font-bold text-center">Hospital ID</th>
							<th className="py-2 px-3 font-bold">Name</th>
							<th className="py-2 px-3 font-bold">Role</th>
							<th className="py-2 px-3 font-bold">License No</th>
							<th className="py-2 px-3 font-bold">Shift</th>
							<th className="py-2 px-3 font-bold">Status</th>
							<th className="py-2 px-3 font-bold">Date Created</th>
							<th className="py-2 px-3 font-bold">Date Updated</th>
							<th className="py-2 px-3 font-bold">Actions</th>
						</tr>
					</thead>
					<tbody>
						{initialData.length === 0 ? (
							<tr>
								<td colSpan={10} className="py-12 text-center">
									<p className="text-gray-500 text-base">
										No staff records found. Click &quot;+ Add Staff&quot; to get
										started.
									</p>
								</td>
							</tr>
						) : (
							initialData.map((member) => (
								<tr
									key={member.staff_id}
									className="border-b border-gray-100 hover:bg-gray-50"
								>
									<td className="py-2 px-1 font-medium text-gray-900 text-center">
										{member.staff_id}
									</td>
									<td className="py-2 px-3 text-gray-800 text-center">
										{member.hospital_id ?? "N/A"}
									</td>
									<td className="py-2 px-3 text-gray-800">{member.name}</td>
									<td className="py-2 px-3 text-gray-800">
										{member.staff_role}
									</td>
									<td className="py-2 px-3 text-gray-800">
										{member.license_no}
									</td>
									<td className="py-2 px-3 text-gray-800">
										{member.shift_schedule}
									</td>
									<td className="py-2 px-3 text-gray-800">
										{member.staff_status}
									</td>
									<td className="py-2 px-3 text-gray-800">
										{new Date(member.created_at).toLocaleString()}
									</td>
									<td className="py-2 px-3 text-gray-800">
										{member.updated_at
											? new Date(member.updated_at).toLocaleString()
											: "N/A"}
									</td>
									<td className="py-2 px-3">
										<div className="flex items-center justify-left gap-2">
											<button
												className="p-2 hover:bg-blue-100 rounded transition"
												title="Edit"
												onClick={() => handleEdit(member)}
											>
												<Image
													src="/icons/edit.svg"
													alt="Edit"
													width={18}
													height={18}
												/>
											</button>
											<button
												className="p-2 hover:bg-red-100 rounded transition"
												title="Delete"
												onClick={() => handleDelete(member.staff_id)}
											>
												<Image
													src="/icons/delete.svg"
													alt="Delete"
													width={20}
													height={20}
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
