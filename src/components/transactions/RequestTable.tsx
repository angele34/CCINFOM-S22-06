"use client";

import { useEffect, useState } from "react";
import FormModal from "../ui/FormModal";

interface Request {
	request_id: number;
	patient_id: number;
	ref_location_id: number;
	hospital_id: number;
	priority_level: string;
	request_status: string;
	requested_on: string;
	updated_on: string | null;
}

interface Patient {
	patient_id: number;
	name: string;
	age: number | null;
	medical_condition: string;
	contact_person: string | null;
	contact_number: string | null;
	ref_location_id: number;
}

interface ReferenceLocation {
	ref_location_id: number;
	city: string;
	street: string;
}

interface Hospital {
	hospital_id: number;
	hospital_name: string;
	city: string;
}

export default function RequestTable() {
	const [data, setData] = useState<Request[]>([]);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);

	const [patients, setPatients] = useState<Patient[]>([]);
	const [locations, setLocations] = useState<ReferenceLocation[]>([]);
	const [hospitals, setHospitals] = useState<Hospital[]>([]);
	const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
		null
	);
	const [selectedRefLocationId, setSelectedRefLocationId] = useState<
		number | string
	>("");
	const [selectedHospitalId, setSelectedHospitalId] = useState<number | string>(
		""
	);

	const fetchRequests = () => {
		fetch("/api/request")
			.then((res) => res.json())
			.then((json) => {
				setData(Array.isArray(json) ? json : []);
			})
			.catch((err) => {
				console.error("Failed to fetch requests:", err);
				setData([]);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchRequests();

		Promise.all([
			fetch("/api/patient").then((r) => r.json()),
			fetch("/api/reference_loc").then((r) => r.json()),
			fetch("/api/hospital").then((r) => r.json()),
		]).then(([patientsData, locationsData, hospitalsData]) => {
			setPatients(Array.isArray(patientsData) ? patientsData : []);
			setLocations(Array.isArray(locationsData) ? locationsData : []);
			setHospitals(Array.isArray(hospitalsData) ? hospitalsData : []);
		});
	}, []);

	const handleCreateRequest = async (values: Record<string, string>) => {
		if (!values.patient_id || !values.ref_location_id || !values.hospital_id) {
			alert("Please fill all required fields");
			return;
		}

		// Check if there's already a pending request for this patient
		const existingRequest = data.find(
			(r) =>
				r.patient_id === Number(values.patient_id) &&
				r.request_status === "pending"
		);

		if (existingRequest) {
			alert(
				"This patient already has a pending request. Please wait for the current request to be completed or cancelled."
			);
			return;
		}

		try {
			const res = await fetch("/api/request", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					patient_id: Number(values.patient_id),
					ref_location_id: Number(values.ref_location_id),
					hospital_id: Number(values.hospital_id),
					priority_level: values.priority_level ?? "routine",
				}),
			});

			if (!res.ok) {
				const error = await res.json();
				alert(`Error: ${error.error || "Failed to create request"}`);
				return;
			}

			fetchRequests();
			setModalOpen(false);
			// Reset form state
			setSelectedPatientId(null);
			setSelectedRefLocationId("");
			setSelectedHospitalId("");
		} catch (error) {
			console.error(error);
			alert("Network error");
		}
	};

	const handleCancel = async (request_id: number) => {
		try {
			const res = await fetch("/api/request", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					request_id,
					request_status: "cancelled",
				}),
			});

			if (!res.ok) {
				const error = await res.json();
				alert(`Error: ${error.error || "Failed to cancel request"}`);
				return;
			}

			fetchRequests();
		} catch (error) {
			console.error(error);
			alert("Network error");
		}
	};

	const formatPriority = (priority: string) => {
		return priority.charAt(0).toUpperCase() + priority.slice(1);
	};

	const formatStatus = (status: string) => {
		return status.charAt(0).toUpperCase() + status.slice(1);
	};

	// Filter reference locations based on selected patient
	const filteredLocations = selectedPatientId
		? locations.filter((loc) => {
				const patient = patients.find(
					(p) => p.patient_id === selectedPatientId
				);
				return patient
					? loc.ref_location_id === patient.ref_location_id
					: false;
		  })
		: locations;

	const requestFields = [
		{
			name: "patient_id",
			label: "Patient",
			type: "select",
			required: true,
			options: patients.map((p) => ({
				value: p.patient_id,
				label: p.name,
			})),
			onChange: (value: string) => {
				const patientId = Number(value);
				setSelectedPatientId(patientId);

				// Find the patient and auto-select their reference location
				const patient = patients.find((p) => p.patient_id === patientId);
				if (patient) {
					setSelectedRefLocationId(patient.ref_location_id);

					// Find the location to get its city
					const location = locations.find(
						(loc) => loc.ref_location_id === patient.ref_location_id
					);

					if (location) {
						// Find nearest hospital in the same city
						const nearestHospital = hospitals.find(
							(h) => h.city === location.city
						);

						if (nearestHospital) {
							setSelectedHospitalId(nearestHospital.hospital_id);
						}
					}
				}
			},
		},
		{
			name: "ref_location_id",
			label: "Reference Location",
			type: "select",
			required: true,
			options: filteredLocations.map((loc) => ({
				value: loc.ref_location_id,
				label: `${loc.street}, ${loc.city.replace(/_/g, " ")}`,
			})),
			readOnly: true,
			emptyPlaceholder: "Select a patient first",
		},
		{
			name: "hospital_id",
			label: "Hospital",
			type: "select",
			required: true,
			options: hospitals.map((h) => ({
				value: h.hospital_id,
				label: h.hospital_name,
			})),
			readOnly: true,
			emptyPlaceholder: "Select a patient first",
		},
		{
			name: "priority_level",
			label: "Priority Level",
			type: "select",
			options: [
				{ value: "routine", label: "Routine" },
				{ value: "moderate", label: "Moderate" },
				{ value: "critical", label: "Critical" },
			],
		},
	];

	return (
		<div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col overflow-hidden">
			<div className="flex items-center justify-between mb-3">
				<div>
					<h2 className="text-xl font-semibold text-ambulance-teal-750">
						Patient Ambulance Requests
					</h2>
					<p className="text-sm text-ambulance-teal-750 text-opacity-80">
						Track patient requests for ambulance services
					</p>
				</div>
				<button
					onClick={() => setModalOpen(true)}
					className="px-5 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
				>
					+ New Request
				</button>
			</div>

			<div className="overflow-auto flex-1 border-b border-gray-200">
				<table className="w-full text-left text-sm">
					<thead className="border-b border-gray-200 sticky top-0 bg-white z-10 shadow">
						<tr className="text-ambulance-teal-750">
							<th className="py-2 px-3 font-bold">Request ID</th>
							<th className="py-2 px-3 font-bold">Patient ID</th>
							<th className="py-2 px-3 font-bold">Ref Location ID</th>
							<th className="py-2 px-3 font-bold">Hospital ID</th>
							<th className="py-2 px-3 font-bold">Priority Level</th>
							<th className="py-2 px-3 font-bold">Status</th>
							<th className="py-2 px-3 font-bold">Requested On</th>
							<th className="py-2 px-3 font-bold">Updated On</th>
							<th className="py-2 px-3 font-bold">Actions</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan={9} className="py-12 text-center">
									<p className="text-gray-500 text-base">Loading...</p>
								</td>
							</tr>
						) : data.length === 0 ? (
							<tr>
								<td colSpan={9} className="py-12 text-center">
									<p className="text-gray-500 text-base">
										No request records found. Click &quot;+ New Request&quot; to
										get started.
									</p>
								</td>
							</tr>
						) : (
							data.map((item) => (
								<tr
									key={item.request_id}
									className="border-b border-gray-100 hover:bg-gray-50"
								>
									<td className="py-3 px-3 font-medium text-gray-900">
										{item.request_id}
									</td>
									<td className="py-3 px-3 text-gray-800">{item.patient_id}</td>
									<td className="py-3 px-3 text-gray-800">
										{item.ref_location_id}
									</td>
									<td className="py-3 px-3 text-gray-800">
										{item.hospital_id}
									</td>
									<td className="py-3 px-3">
										<span
											className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
												item.priority_level === "critical"
													? "bg-red-100 text-red-800"
													: item.priority_level === "moderate"
													? "bg-yellow-100 text-yellow-800"
													: "bg-blue-100 text-blue-800"
											}`}
										>
											{formatPriority(item.priority_level)}
										</span>
									</td>
									<td className="py-3 px-3">
										<span
											className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
												item.request_status === "pending"
													? "bg-yellow-100 text-yellow-800"
													: item.request_status === "accepted"
													? "bg-green-100 text-green-800"
													: "bg-gray-100 text-gray-800"
											}`}
										>
											{formatStatus(item.request_status)}
										</span>
									</td>
									<td className="py-3 px-3 text-gray-800">
										{new Date(item.requested_on).toLocaleString()}
									</td>
									<td className="py-3 px-3 text-gray-800">
										{item.updated_on
											? new Date(item.updated_on).toLocaleString()
											: "N/A"}
									</td>
									<td className="py-3 px-3">
										<div className="flex items-center gap-2">
											{item.request_status === "pending" && (
												<button
													onClick={() => handleCancel(item.request_id)}
													className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
													title="Cancel"
												>
													Cancel
												</button>
											)}
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			<FormModal
				isOpen={modalOpen}
				onClose={() => {
					setModalOpen(false);
					setSelectedPatientId(null);
					setSelectedRefLocationId("");
					setSelectedHospitalId("");
				}}
				title="New Ambulance Request"
				fields={requestFields as any}
				initialData={{
					patient_id: selectedPatientId?.toString() ?? "",
					ref_location_id: String(selectedRefLocationId),
					hospital_id: String(selectedHospitalId),
				}}
				onSubmit={handleCreateRequest}
				submitLabel="Submit Request"
			/>
		</div>
	);
}
