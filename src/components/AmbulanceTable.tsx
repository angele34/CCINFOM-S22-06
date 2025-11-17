"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import FormModal from "./FormModal";

interface Ambulance {
	ambulance_id: number;
	ambulance_type: string;
	hospital_id: number;
	ambulance_status: string;
	plate_no: string;
	created_at: string;
	updated_at: string | null;
}

interface Hospital {
	hospital_id: number;
	hospital_name: string;
}

export default function AmbulanceTable({
	initialData,
	onUpdate,
}: {
	initialData: Ambulance[];
	onUpdate?: () => void;
}) {
	const [showModal, setShowModal] = useState(false);
	const [editingAmbulance, setEditingAmbulance] = useState<Ambulance | null>(
		null
	);
	const [hospitals, setHospitals] = useState<Hospital[]>([]);

	useEffect(() => {
		const fetchHospitals = async () => {
			try {
				const response = await fetch("/api/hospital");
				if (response.ok) {
					const data = await response.json();
					setHospitals(data);
				} else {
					console.error("Failed to fetch hospitals");
				}
			} catch (error) {
				console.error("Error fetching hospitals:", error);
			}
		};

		fetchHospitals();
	}, []);

	const formFields = [
		{
			name: "hospital_id",
			label: "Hospital ID",
			type: "select" as const,
			required: true,
			options: hospitals.map((h) => ({
				value: h.hospital_id.toString(),
				label: `${h.hospital_name} (ID: ${h.hospital_id})`,
			})),
		},
		{
			name: "ambulance_type",
			label: "Ambulance Type",
			type: "select" as const,
			required: true,
			options: [
				{ value: "type_1", label: "Type 1" },
				{ value: "type_2", label: "Type 2" },
			],
		},
		{
			name: "ambulance_status",
			label: "Ambulance Status",
			type: "select" as const,
			required: true,
			options: [
				{ value: "on_trip", label: "On Trip" },
				{ value: "available", label: "Available" },
			],
		},
		{
			name: "plate_no",
			label: "Plate Number",
			type: "text" as const,
			required: true,
			placeholder: "ABC1234 (3 letters + 4 numbers)",
			maxLength: 7,
			transform: "uppercase" as const,
			pattern: "^[A-Z]{3}[0-9]{4}$",
			customErrorMessages: {
				required: "Plate number is required",
				pattern:
					"Plate must be 3 letters followed by 4 numbers (e.g., ABC1234)",
				tooLong: "Plate must be exactly 7 characters",
			},
		},
	];

	const handleFormSubmit = async (formData: Record<string, string>) => {
		try {
			const payload = {
				hospital_id: parseInt(formData.hospital_id, 10),
				ambulance_type: formData.ambulance_type,
				ambulance_status: formData.ambulance_status,
				plate_no: formData.plate_no.toUpperCase().slice(0, 7),
			};

			const url = "/api/ambulance";
			const method = editingAmbulance ? "PUT" : "POST";
			const body = editingAmbulance
				? { ...payload, ambulance_id: editingAmbulance.ambulance_id }
				: payload;

			const response = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (response.ok) {
				setShowModal(false);
				setEditingAmbulance(null);
				onUpdate?.();
			} else {
				const errorData = await response.json();

				// handle structured Zod validation errors
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
			console.error("Error saving ambulance:", error);
			alert("An error occurred while saving the ambulance");
		}
	};

	const handleEdit = (ambulance: Ambulance) => {
		setEditingAmbulance(ambulance);
		setShowModal(true);
	};

	const handleDelete = async (ambulance_id: number) => {
		if (!confirm("Are you sure you want to delete this ambulance?")) {
			return;
		}

		try {
			const response = await fetch("/api/ambulance", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ambulance_id }),
			});

			if (response.ok) {
				onUpdate?.();
			} else {
				const errorData = await response.json();
				alert(`Error: ${errorData.error || "Failed to delete ambulance"}`);
			}
		} catch (error) {
			console.error("Error deleting ambulance:", error);
			alert("An error occurred while deleting the ambulance");
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setEditingAmbulance(null);
	};

	return (
		<div className="max-w-[1200px] mx-auto px-6">
			<div className="bg-white rounded-2xl shadow-lg p-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-xl font-semibold text-ambulance-teal-750">
							Ambulance Record Management
						</h2>
						<p className="text-sm text-ambulance-teal-750 text-opacity-80">
							Manage and track all ambulance vehicles in the fleet
						</p>
					</div>
					<button
						onClick={() => setShowModal(true)}
						className="px-5 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
					>
						+ Add Ambulance
					</button>
				</div>

				<FormModal
					isOpen={showModal}
					onClose={handleCloseModal}
					onSubmit={handleFormSubmit}
					title={
						editingAmbulance ? "Edit Ambulance Record" : "New Ambulance Record"
					}
					fields={formFields}
					submitLabel={editingAmbulance ? "Update Ambulance" : "Add Ambulance"}
					initialData={
						editingAmbulance
							? {
									hospital_id: editingAmbulance.hospital_id.toString(),
									ambulance_type: editingAmbulance.ambulance_type || "",
									ambulance_status: editingAmbulance.ambulance_status || "",
									plate_no: editingAmbulance.plate_no || "",
							  }
							: undefined
					}
				/>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead className="border-b border-gray-200">
							<tr className="text-ambulance-teal-750">
								<th className="py-2 px-1 font-bold text-center">
									Ambulance ID
								</th>
								<th className="py-2 px-1 font-bold text-center">Hospital ID</th>
								<th className="py-3 px-4 font-bold">Type</th>
								<th className="py-3 px-4 font-bold">Status</th>
								<th className="py-2 px-3 font-bold">Plate Number</th>
								<th className="py-2 px-3 font-bold">Date Created</th>
								<th className="py-2 px-3 font-bold">Date Updated</th>
								<th className="py-2 px-3 font-bold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{initialData.length === 0 ? (
								<tr>
									<td colSpan={8} className="py-12 text-center">
										<p className="text-gray-500 text-base">
											No ambulance records found. Click &quot;+ Add
											Ambulance&quot; to get started.
										</p>
									</td>
								</tr>
							) : (
								initialData.map((amb) => (
									<tr
										key={amb.ambulance_id}
										className="border-b border-gray-100 hover:bg-gray-50"
									>
										<td className="py-2 px-1 font-medium text-gray-900 text-center">
											{amb.ambulance_id}
										</td>
										<td className="py-2 px-1 text-gray-800 text-center">
											{amb.hospital_id}
										</td>
										<td className="py-2 px-3">
											{amb.ambulance_type ? (
												amb.ambulance_type === "type_1" ? (
													<span className="inline-block px-3 py-1 rounded-full text-white bg-ambulance-type-1 text-xs font-medium">
														Type 1
													</span>
												) : amb.ambulance_type === "type_2" ? (
													<span className="inline-block px-3 py-1 rounded-full text-white bg-ambulance-type-2 text-xs font-medium">
														Type 2
													</span>
												) : (
													<span className="text-gray-600">
														{amb.ambulance_type}
													</span>
												)
											) : (
												<span className="text-gray-600">N/A</span>
											)}
										</td>
										<td className="py-2 px-3">
											{amb.ambulance_status ? (
												amb.ambulance_status === "available" ? (
													<span className="inline-block px-3 py-1 rounded-full text-white bg-ambulance-status-available text-xs font-medium">
														Available
													</span>
												) : amb.ambulance_status === "on_trip" ? (
													<span className="inline-block px-3 py-1 rounded-full text-ambulance-ontrip bg-ambulance-status-on-trip text-xs font-medium">
														On Trip
													</span>
												) : (
													<span className="text-gray-600">
														{amb.ambulance_status}
													</span>
												)
											) : (
												<span className="text-gray-600">N/A</span>
											)}
										</td>
										<td className="py-2 px-3 text-gray-800">
											{amb.plate_no ?? "N/A"}
										</td>
										<td className="py-2 px-3 text-gray-800">
											{new Date(amb.created_at).toLocaleString()}
										</td>
										<td className="py-2 px-3 text-gray-800">
											{amb.updated_at
												? new Date(amb.updated_at).toLocaleString()
												: "N/A"}
										</td>
										<td className="py-2 px-3">
											<div className="flex items-center justify-left gap-2">
												<button
													className="p-2 hover:bg-blue-100 rounded transition"
													title="Edit"
													onClick={() => handleEdit(amb)}
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
													onClick={() => handleDelete(amb.ambulance_id)}
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
		</div>
	);
}
