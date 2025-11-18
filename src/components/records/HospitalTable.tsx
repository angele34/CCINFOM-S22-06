"use client";

import { useState } from "react";
import Image from "next/image";
import FormModal from "../ui/FormModal";

interface Hospital {
	hospital_id: number;
	hospital_name: string;
	city: string;
	street: string;
	created_at: string;
	updated_at: string | null;
}

export default function HospitalTable({
	initialData,
	onUpdate,
}: {
	initialData: Hospital[];
	onUpdate?: () => void;
}) {
	const [showModal, setShowModal] = useState(false);
	const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);

	const formFields = [
		{
			name: "hospital_name",
			label: "Hospital Name",
			type: "text" as const,
			required: true,
			placeholder: "Enter hospital name",
			minLength: 1,
			maxLength: 50,
			customErrorMessages: {
				required: "Hospital name is required",
				minLength: "Hospital name is required",
				maxLength: "Hospital name must not exceed 50 characters",
			},
		},
		{
			name: "city",
			label: "City",
			type: "select" as const,
			required: true,
			options: [
				{ value: "Quezon_City", label: "Quezon City" },
				{ value: "Manila_City", label: "Manila City" },
				{ value: "Muntinlupa_City", label: "Muntinlupa City" },
			],
		},
		{
			name: "street",
			label: "Street",
			type: "text" as const,
			required: true,
			placeholder: "Enter street address",
			minLength: 1,
			maxLength: 20,
			customErrorMessages: {
				required: "Street is required",
				minLength: "Street is required",
				maxLength: "Street must not exceed 20 characters",
			},
		},
	];

	const handleFormSubmit = async (formData: Record<string, string>) => {
		try {
			const payload = {
				hospital_name: formData.hospital_name,
				city: formData.city,
				street: formData.street,
			};

			const url = "/api/hospital";
			const method = editingHospital ? "PUT" : "POST";
			const body = editingHospital
				? { ...payload, hospital_id: editingHospital.hospital_id }
				: payload;

			const response = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (response.ok) {
				setShowModal(false);
				setEditingHospital(null);
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
			console.error("Error saving hospital:", error);
			alert("An error occurred while saving the hospital record");
		}
	};

	const handleEdit = (hospital: Hospital) => {
		setEditingHospital(hospital);
		setShowModal(true);
	};

	const handleDelete = async (hospital_id: number) => {
		if (!confirm("Are you sure you want to delete this hospital?")) {
			return;
		}

		try {
			const response = await fetch("/api/hospital", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ hospital_id }),
			});

			if (response.ok) {
				onUpdate?.();
			} else {
				const errorData = await response.json();
				alert(`Error: ${errorData.error || "Failed to delete hospital"}`);
			}
		} catch (error) {
			console.error("Error deleting hospital:", error);
			alert("An error occurred while deleting the hospital record");
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setEditingHospital(null);
	};

	return (
		<div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col overflow-hidden">
			<div className="flex items-center justify-between mb-3">
				<div>
					<h2 className="text-xl font-semibold text-ambulance-teal-750">
						Hospital Record Management
					</h2>
					<p className="text-sm text-ambulance-teal-750 text-opacity-80">
						Manage and track all hospital facilities
					</p>
				</div>
				<button
					onClick={() => setShowModal(true)}
					className="px-5 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
				>
					+ Add Hospital
				</button>
			</div>

			<FormModal
				isOpen={showModal}
				onClose={handleCloseModal}
				onSubmit={handleFormSubmit}
				title={editingHospital ? "Edit Hospital Record" : "New Hospital Record"}
				fields={formFields}
				submitLabel={editingHospital ? "Update Hospital" : "Add Hospital"}
				initialData={
					editingHospital
						? {
								hospital_name: editingHospital.hospital_name || "",
								city: editingHospital.city || "",
								street: editingHospital.street || "",
						  }
						: undefined
				}
			/>

			{/* Table */}
			<div className="overflow-auto flex-1 border-b border-gray-200">
				<table className="w-full text-left text-sm">
					<thead className="border-b border-gray-200 sticky top-0 bg-white z-10 shadow">
						<tr className="text-ambulance-teal-750">
							<th className="py-2 px-3 font-bold text-center">Hospital ID</th>
							<th className="py-2 px-3 font-bold">Hospital Name</th>
							<th className="py-2 px-3 font-bold">City</th>
							<th className="py-2 px-3 font-bold">Street</th>
							<th className="py-2 px-3 font-bold">Date Created</th>
							<th className="py-2 px-3 font-bold">Date Updated</th>
							<th className="py-2 px-3 font-bold">Actions</th>
						</tr>
					</thead>
					<tbody>
						{initialData.length === 0 ? (
							<tr>
								<td colSpan={7} className="py-12 text-center">
									<p className="text-gray-500 text-base">
										No hospital records found. Click &quot;+ Add Hospital&quot;
										to get started.
									</p>
								</td>
							</tr>
						) : (
							initialData.map((hospital) => (
								<tr
									key={hospital.hospital_id}
									className="border-b border-gray-100 hover:bg-gray-50"
								>
									<td className="py-2 px-1 font-medium text-gray-900 text-center">
										{hospital.hospital_id}
									</td>
									<td className="py-2 px-3 text-gray-800">
										{hospital.hospital_name}
									</td>
									<td className="py-2 px-3 text-gray-800">
										{hospital.city.replace(/_/g, " ")}
									</td>
									<td className="py-2 px-3 text-gray-800">{hospital.street}</td>
									<td className="py-2 px-3 text-gray-800">
										{new Date(hospital.created_at).toLocaleString()}
									</td>
									<td className="py-2 px-3 text-gray-800">
										{hospital.updated_at
											? new Date(hospital.updated_at).toLocaleString()
											: "N/A"}
									</td>
									<td className="py-2 px-3">
										<div className="flex items-center justify-left gap-2">
											<button
												className="p-2 hover:bg-blue-100 rounded transition"
												title="Edit"
												onClick={() => handleEdit(hospital)}
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
												onClick={() => handleDelete(hospital.hospital_id)}
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
