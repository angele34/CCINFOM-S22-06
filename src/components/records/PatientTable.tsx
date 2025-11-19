"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import FormModal from "../ui/FormModal";

interface Patient {
	patient_id: number;
	ref_location_id: number;
	name: string;
	age: number | null;
	medical_condition: string;
	priority_level: string;
	contact_person: string | null;
	contact_number: string | null;
	transfer_status: string | null;
	created_at: string;
	updated_at: string | null;
}

interface ReferenceLocation {
	ref_location_id: number;
	city: string;
	street: string;
}

export default function PatientTable({
	initialData,
	onUpdate,
}: {
	initialData: Patient[];
	onUpdate?: () => void;
}) {
	const [showModal, setShowModal] = useState(false);
	const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
	const [locations, setLocations] = useState<ReferenceLocation[]>([]);

	useEffect(() => {
		const fetchLocations = async () => {
			try {
				const response = await fetch("/api/reference_loc");
				if (response.ok) {
					const data = await response.json();
					setLocations(data);
				} else {
					console.error("Failed to fetch reference locations");
				}
			} catch (error) {
				console.error("Error fetching reference locations:", error);
			}
		};

		fetchLocations();
	}, []);

	const formFields = [
		{
			name: "ref_location_id",
			label: "Reference Location",
			type: "select" as const,
			required: true,
			options: locations.map((loc) => ({
				value: loc.ref_location_id.toString(),
				label: `${loc.city} - ${loc.street} (ID: ${loc.ref_location_id})`,
			})),
		},
		{
			name: "name",
			label: "Patient Name",
			type: "text" as const,
			required: true,
			placeholder: "Enter patient name",
			minLength: 1,
			maxLength: 50,
			customErrorMessages: {
				required: "Patient name is required",
				minLength: "Patient name is required",
				maxLength: "Patient name must not exceed 50 characters",
			},
		},
		{
			name: "age",
			label: "Age",
			type: "number" as const,
			required: false,
			placeholder: "Enter age",
			min: 0,
			max: 120,
			customErrorMessages: {
				min: "Age must be 0 or greater",
				max: "Age must be 120 or less",
			},
		},
		{
			name: "medical_condition",
			label: "Medical Condition",
			type: "select" as const,
			required: true,
			options: [
				{ value: "cardiac", label: "Cardiac" },
				{ value: "trauma", label: "Trauma" },
				{ value: "respiratory", label: "Respiratory" },
				{ value: "neurological", label: "Neurological" },
				{ value: "other", label: "Other" },
			],
		},
		{
			name: "priority_level",
			label: "Priority Level",
			type: "select" as const,
			required: true,
			options: [
				{ value: "critical", label: "Critical" },
				{ value: "moderate", label: "Moderate" },
				{ value: "routine", label: "Routine" },
			],
		},
		{
			name: "contact_person",
			label: "Contact Person",
			type: "text" as const,
			required: false,
			placeholder: "Enter contact person name",
			maxLength: 50,
		},
		{
			name: "contact_number",
			label: "Contact Number",
			type: "text" as const,
			required: false,
			placeholder: "09XXXXXXXXX (11 digits)",
			minLength: 11,
			maxLength: 11,
			pattern: "^09[0-9]{9}$",
			customErrorMessages: {
				pattern: "Must be 11 digits starting with 09 (e.g., 09123456789)",
				minLength: "Contact number must be exactly 11 digits",
				maxLength: "Contact number must be exactly 11 digits",
			},
		},
		{
			name: "transfer_status",
			label: "Transfer Status",
			type: "select" as const,
			required: false,
			options: [
				{ value: "waiting", label: "Waiting" },
				{ value: "in_transfer", label: "In Transfer" },
				{ value: "transferred", label: "Transferred" },
			],
		},
	];

	const handleFormSubmit = async (formData: Record<string, string>) => {
		try {
			const payload = {
				ref_location_id: parseInt(formData.ref_location_id, 10),
				name: formData.name,
				age: formData.age ? parseInt(formData.age, 10) : null,
				medical_condition: formData.medical_condition,
				priority_level: formData.priority_level,
				contact_person: formData.contact_person || null,
				contact_number: formData.contact_number || null,
				transfer_status: formData.transfer_status || null,
			};

			const url = "/api/patient";
			const method = editingPatient ? "PUT" : "POST";
			const body = editingPatient
				? { ...payload, patient_id: editingPatient.patient_id }
				: payload;

			const response = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (response.ok) {
				setShowModal(false);
				setEditingPatient(null);
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
			console.error("Error saving patient:", error);
			alert("An error occurred while saving the patient");
		}
	};

	const handleEdit = (patient: Patient) => {
		setEditingPatient(patient);
		setShowModal(true);
	};

	const handleDelete = async (patient_id: number) => {
		if (!confirm("Are you sure you want to delete this patient?")) {
			return;
		}

		try {
			const response = await fetch("/api/patient", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ patient_id }),
			});

			if (response.ok) {
				onUpdate?.();
			} else {
				const errorData = await response.json();
				alert(`Error: ${errorData.error || "Failed to delete patient"}`);
			}
		} catch (error) {
			console.error("Error deleting patient:", error);
			alert("An error occurred while deleting the patient");
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setEditingPatient(null);
	};

	return (
		<div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col overflow-hidden">
			<div className="flex items-center justify-between mb-3">
				<div>
					<h2 className="text-xl font-semibold text-ambulance-teal-750">
						Patient Record Management
					</h2>
					<p className="text-sm text-ambulance-teal-750 text-opacity-80">
						Manage and track all patient records
					</p>
				</div>
				<button
					onClick={() => setShowModal(true)}
					className="px-5 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
				>
					+ Add Patient
				</button>
			</div>

			<FormModal
				isOpen={showModal}
				onClose={handleCloseModal}
				onSubmit={handleFormSubmit}
				title={editingPatient ? "Edit Patient Record" : "New Patient Record"}
				fields={formFields}
				submitLabel={editingPatient ? "Update Patient" : "Add Patient"}
				initialData={
					editingPatient
						? {
								ref_location_id: editingPatient.ref_location_id.toString(),
								name: editingPatient.name || "",
								age: editingPatient.age?.toString() || "",
								medical_condition: editingPatient.medical_condition || "",
								priority_level: editingPatient.priority_level || "",
								contact_person: editingPatient.contact_person || "",
								contact_number: editingPatient.contact_number || "",
								transfer_status: editingPatient.transfer_status || "",
						  }
						: undefined
				}
			/>

			{/* Table */}
			<div className="overflow-auto flex-1 border-b border-gray-200">
				<table className="w-full text-left text-sm">
					<thead className="border-b border-gray-200 sticky top-0 bg-white z-10 shadow">
						<tr className="text-ambulance-teal-750 text-left ">
							<th className="py-2 px-1 font-bold text-center">Patient ID</th>
							<th className="py-2 px-1 font-bold text-center">
								Ref Location ID
							</th>
							<th className="py-2 px-3 font-bold">Name</th>
							<th className="py-2 px-3 font-bold">Age</th>
							<th className="py-2 px-3 font-bold">Medical Condition</th>
							<th className="py-2 px-3 font-bold">Priority Level</th>
							<th className="py-2 px-3 font-bold">Contact Person</th>
							<th className="py-2 px-3 font-bold">Contact Number</th>
							<th className="py-2 px-3 font-bold">Transfer Status</th>
							<th className="py-2 px-3 font-bold">Date Created</th>
							<th className="py-2 px-3 font-bold">Date Updated</th>
							<th className="py-2 px-3 font-bold">Actions</th>
						</tr>
					</thead>
					<tbody>
						{initialData.length === 0 ? (
							<tr>
								<td colSpan={12} className="py-12 text-center">
									<p className="text-gray-500 text-base">
										No patient records found. Click &quot;+ Add Patient&quot; to
										get started.
									</p>
								</td>
							</tr>
						) : (
							initialData.map((patient) => (
								<tr
									key={patient.patient_id}
									className="border-b border-gray-100 hover:bg-gray-50"
								>
									<td className="py-2 px-1 font-medium text-gray-900 text-center">
										{patient.patient_id}
									</td>
									<td className="py-2 px-1 text-gray-800 text-center">
										{patient.ref_location_id}
									</td>
									<td className="py-2 px-3 text-gray-800">{patient.name}</td>
									<td className="py-2 px-3 text-gray-800">
										{patient.age ?? "N/A"}
									</td>
									<td className="py-2 px-3 text-gray-800">
										{patient.medical_condition}
									</td>
									<td className="py-2 px-3">
										{patient.priority_level ? (
											patient.priority_level === "critical" ? (
												<span className="inline-block px-3 py-1 rounded-full text-white bg-priority-level-critical text-xs font-medium">
													Critical
												</span>
											) :
											patient.priority_level === "moderate" ? (
												<span className="inline-block px-3 py-1 rounded-full text-white bg-priority-level-moderate text-xs font-medium">
													Moderate
												</span>
											) : patient.priority_level === "routine" ? (
												<span className="inline-block px-3 py-1 rounded-full text-white bg-priority-level-routine text-xs font-medium">
													Routine
												</span>
											) : (
												<span className="text-gray-600">
													{patient.priority_level}
												</span>
											)
										) : (
											<span className="text-gray-600">N/A</span>
										)}
									</td>
									<td className="py-2 px-3 text-gray-800">
										{patient.contact_person ?? "N/A"}
									</td>
									<td className="py-2 px-3 text-gray-800">
										{patient.contact_number ?? "N/A"}
									</td>
									<td className="py-2 px-3 text-gray-800">
										{patient.transfer_status ?? "N/A"}
									</td>
									<td className="py-2 px-3 text-gray-800">
										{new Date(patient.created_at).toLocaleString()}
									</td>
									<td className="py-2 px-3 text-gray-800">
										{patient.updated_at
											? new Date(patient.updated_at).toLocaleString()
											: "N/A"}
									</td>
									<td className="py-2 px-3">
										<div className="flex items-center justify-left gap-2">
											<button
												className="p-2 hover:bg-blue-100 rounded transition"
												title="Edit"
												onClick={() => handleEdit(patient)}
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
												onClick={() => handleDelete(patient.patient_id)}
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
