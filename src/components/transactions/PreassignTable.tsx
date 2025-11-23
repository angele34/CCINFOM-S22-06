"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import FormModal from "@/src/components/ui/FormModal";

export interface PreassignTransaction {
	preassign_id: number;
	ambulance_id: number;
	staff_ids: string;
	ambulance_type: string;
	base_location: string;
	shift_schedule: string;
	status: string;
	created_at: string;
}

type Staff = {
	staff_id: number;
	name: string;
	staff_role: string;
	staff_status: string;
	shift_schedule: string;
	is_deleted: boolean;
	hospital_id: number;
};

type Ambulance = {
	ambulance_id: number;
	ambulance_type: string;
	ambulance_status: string;
	plate_no: string;
	is_deleted: boolean;
	hospital_id: number;
	hospital?: {
		hospital_name: string;
	};
};

type Hospital = {
	hospital_id: number;
	hospital_name: string;
	city: string;
	street: string;
	is_deleted: boolean;
};

export default function PreassignTable() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [availableStaff, setAvailableStaff] = useState<Staff[]>([]);
	const [allStaff, setAllStaff] = useState<Staff[]>([]);
	const [availableAmbulances, setAvailableAmbulances] = useState<Ambulance[]>(
		[]
	);
	const [hospitals, setHospitals] = useState<Hospital[]>([]);
	const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(
		null
	);
	const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<number | null>(
		null
	);
	const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
	const [selectedStaffRole, setSelectedStaffRole] = useState<string>("");
	const [preassigns, setPreassigns] = useState<
		Array<{
			preassign_id: number;
			staff_id: number;
			staff_role: string;
			ambulance_id: number;
			assignment_status: string;
			assigned_on: string;
			updated_on: string | null;
		}>
	>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchPreassigns();
		fetchAvailableResources();
		fetchHospitals();
	}, []);

	const fetchHospitals = async () => {
		try {
			const res = await fetch("/api/hospital");
			const data: Hospital[] = await res.json();
			const filteredHospitals = data.filter((h) => !h.is_deleted);
			setHospitals(filteredHospitals);
		} catch (error) {
			console.error("Error fetching hospitals:", error);
		}
	};

	const fetchPreassigns = async () => {
		try {
			const res = await fetch("/api/preassign");
			const data = await res.json();
			setPreassigns(data);
		} catch (error) {
			console.error("Error fetching preassigns:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchAvailableResources = async () => {
		try {
			const staffRes = await fetch("/api/staff");
			const staffData: Staff[] = await staffRes.json();
			const available = staffData.filter(
				(s) => s.staff_status === "available" && !s.is_deleted
			);
			setAllStaff(staffData);
			setAvailableStaff(available);

			const ambulanceRes = await fetch("/api/ambulance");
			const ambulanceData: Ambulance[] = await ambulanceRes.json();
			const availableAmb = ambulanceData.filter(
				(a) => a.ambulance_status === "available" && !a.is_deleted
			);
			setAvailableAmbulances(availableAmb);
		} catch (error) {
			console.error("Error fetching available resources:", error);
		}
	};

	const handleCreatePreassign = async (formData: Record<string, string>) => {
		try {
			// Validate that the staff is not already assigned to a DIFFERENT ambulance
			const staffAlreadyAssigned = preassigns.some(
				(p) =>
					p.staff_id === Number(formData.staff_id) &&
					p.assignment_status === "active" &&
					p.ambulance_id !== Number(formData.ambulance_id)
			);

			if (staffAlreadyAssigned) {
				alert(
					"This staff member is already assigned to another ambulance. Please select a different staff member."
				);
				return;
			}

			// Check if role is already filled - if yes, confirm replacement
			const existingRoleAssignment = preassigns.find(
				(p) =>
					p.ambulance_id === Number(formData.ambulance_id) &&
					p.staff_role === formData.staff_role &&
					p.assignment_status === "active"
			);

			if (existingRoleAssignment) {
				const existingStaff = allStaff.find(
					(s) => s.staff_id === existingRoleAssignment.staff_id
				);
				const confirmed = confirm(
					`This ambulance already has ${
						existingStaff?.name || "a staff member"
					} assigned as ${
						formData.staff_role
					}. Do you want to replace them with the newly selected staff member?`
				);
				if (!confirmed) {
					return;
				}
			}

			const res = await fetch("/api/preassign", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Failed to create pre-assignment");
			}

			await fetchAvailableResources();
			await fetchPreassigns();
			setIsModalOpen(false);
			// Reset form state
			setSelectedHospitalId(null);
			setSelectedAmbulanceId(null);
			setSelectedStaffId(null);
			setSelectedStaffRole("");
			alert("Pre-assignment created successfully!");
		} catch (error) {
			console.error("Error creating pre-assignment:", error);
			alert(
				error instanceof Error
					? error.message
					: "Failed to create pre-assignment"
			);
		}
	};

	// Filter ambulances to only show those that are available and match selected hospital
	const filteredAmbulances = selectedHospitalId
		? availableAmbulances.filter((a) => a.hospital_id === selectedHospitalId)
		: [];

	// Check if selected ambulance has all roles filled
	const selectedAmbulanceHasAllRoles = selectedAmbulanceId
		? preassigns.filter(
				(p) =>
					p.ambulance_id === selectedAmbulanceId &&
					p.assignment_status === "active"
		  ).length >= 3
		: false;

	// Filter staff based on selected ambulance's hospital and role
	const filteredStaff =
		selectedAmbulanceId && selectedStaffRole
			? availableStaff.filter((staff) => {
					const ambulance = filteredAmbulances.find(
						(a) => a.ambulance_id === selectedAmbulanceId
					);

					// Filter by hospital match and role match
					if (!ambulance || staff.hospital_id !== ambulance.hospital_id) {
						return false;
					}

					// Must match the selected role
					if (staff.staff_role !== selectedStaffRole) {
						return false;
					}

					// Filter out staff who already have active preassignments
					const hasActiveAssignment = preassigns.some(
						(p) =>
							p.staff_id === staff.staff_id && p.assignment_status === "active"
					);
					return !hasActiveAssignment;
			  })
			: [];

	const preassignFields: Array<{
		name: string;
		label: string;
		type: "select";
		required: boolean;
		options: { value: string | number; label: string }[];
		onChange?: (value: string) => void;
		readOnly?: boolean;
		emptyPlaceholder?: string;
	}> = [
		{
			name: "hospital_id",
			label: "Hospital Branch",
			type: "select",
			required: true,
			options: hospitals.map((h) => ({
				value: h.hospital_id,
				label: h.hospital_name,
			})),
			onChange: (value: string) => {
				setSelectedHospitalId(Number(value));
				setSelectedAmbulanceId(null);
				setSelectedStaffId(null);
				setSelectedStaffRole("");
			},
		},
		{
			name: "ambulance_id",
			label: "Ambulance",
			type: "select",
			required: true,
			options: filteredAmbulances.map((amb) => {
				// Format ambulance type: type_1 -> Type 1, type_2 -> Type 2
				const formattedType = amb.ambulance_type
					.replace(/_/g, " ")
					.replace(/\b\w/g, (char) => char.toUpperCase());
				return {
					value: amb.ambulance_id,
					label: `Ambulance #${amb.ambulance_id} - ${amb.plate_no} (${formattedType})`,
				};
			}),
			onChange: (value: string) => {
				setSelectedAmbulanceId(Number(value));
				setSelectedStaffId(null);
				setSelectedStaffRole("");
			},
			emptyPlaceholder: "Select a hospital first",
		},
		{
			name: "staff_role",
			label: "Role",
			type: "select",
			required: true,
			options: [
				{ value: "driver", label: "Driver" },
				{ value: "emt", label: "EMT" },
				{ value: "paramedic", label: "Paramedic" },
			],
			onChange: (value: string) => {
				setSelectedStaffRole(value);
				setSelectedStaffId(null);
			},
			emptyPlaceholder: "Select an ambulance first",
		},
		{
			name: "staff_id",
			label: "Staff Member",
			type: "select",
			required: true,
			options: filteredStaff.map((staff) => ({
				value: staff.staff_id,
				label: staff.name,
			})),
			onChange: (value: string) => {
				setSelectedStaffId(Number(value));
			},
			emptyPlaceholder: selectedAmbulanceHasAllRoles
				? "All roles filled - no available staff"
				: selectedStaffRole
				? `Select a ${selectedStaffRole} from the list`
				: "Select a role first",
		},
	];
	return (
		<div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col overflow-hidden">
			<div className="flex items-center justify-between mb-3">
				<div>
					<h2 className="text-xl font-semibold text-ambulance-teal-750">
						Pre-assign Staff to Ambulance
					</h2>
					<p className="text-sm text-ambulance-teal-750 text-opacity-80">
						Assign available staff to ambulances (same hospital only)
					</p>
				</div>
				<button
					onClick={() => setIsModalOpen(true)}
					className="px-5 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
				>
					+ New Pre-assignment
				</button>
			</div>

			<div className="overflow-auto flex-1 border-b border-gray-200">
				<table className="w-full text-left text-sm">
					<thead className="border-b border-gray-200 sticky top-0 bg-white z-10 shadow">
						<tr className="text-ambulance-teal-750">
							<th className="py-2 px-3 font-bold text-center">Preassign ID</th>
							<th className="py-2 px-3 font-bold text-center">Staff ID</th>
							<th className="py-2 px-3 font-bold text-center">Staff Role</th>
							<th className="py-2 px-3 font-bold text-center">Ambulance ID</th>
							<th className="py-2 px-3 font-bold">Assignment Status</th>
							<th className="py-2 px-3 font-bold">Assigned On</th>
							<th className="py-2 px-3 font-bold">Updated On</th>
							<th className="py-2 px-3 font-bold">Actions</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan={8} className="py-12 text-center">
									<p className="text-gray-500 text-base">Loading...</p>
								</td>
							</tr>
						) : preassigns.length === 0 ? (
							<tr>
								<td colSpan={8} className="py-12 text-center">
									<p className="text-gray-500 text-base">
										No pre-assignment records found. Click &quot;+ New
										Pre-assignment&quot; to get started.
									</p>
								</td>
							</tr>
						) : (
							preassigns.map((item) => (
								<tr
									key={item.preassign_id}
									className="border-b border-gray-100 hover:bg-gray-50"
								>
									<td className="py-3 px-3 text-center text-gray-900">
										{item.preassign_id}
									</td>
									<td className="py-3 px-3 text-center text-gray-800">
										{item.staff_id}
									</td>
									<td className="py-3 px-3 text-center text-gray-800">
										{item.staff_role}
									</td>
									<td className="py-3 px-3 text-center text-gray-800">
										{item.ambulance_id}
									</td>
									<td className="py-3 px-3">
										<span
											className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
												item.assignment_status === "active"
													? "bg-green-100 text-green-800"
													: item.assignment_status === "completed"
													? "bg-blue-100 text-blue-800"
													: "bg-gray-100 text-gray-800"
											}`}
										>
											{item.assignment_status.charAt(0).toUpperCase() +
												item.assignment_status.slice(1)}
										</span>
									</td>
									<td className="py-3 px-3 text-gray-800">
										{new Date(item.assigned_on).toLocaleString()}
									</td>
									<td className="py-3 px-3 text-gray-800">
										{item.updated_on
											? new Date(item.updated_on).toLocaleString()
											: "N/A"}
									</td>
									<td className="py-3 px-3">
										<div className="flex items-center gap-2">
											{item.assignment_status === "active" && (
												<>
													<button
														onClick={async () => {
															if (
																confirm(
																	"Mark this pre-assignment as completed? This will unassign the staff member."
																)
															) {
																try {
																	const res = await fetch("/api/preassign", {
																		method: "PUT",
																		headers: {
																			"Content-Type": "application/json",
																		},
																		body: JSON.stringify({
																			preassign_id: item.preassign_id,
																			assignment_status: "completed",
																		}),
																	});
																	if (res.ok) {
																		await fetchPreassigns();
																		await fetchAvailableResources();
																		alert("Pre-assignment completed");
																	}
																} catch (error) {
																	console.error(error);
																	alert("Failed to complete");
																}
															}
														}}
														className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
														title="Complete"
													>
														<Check className="w-4 h-4" />
													</button>
													<button
														onClick={async () => {
															if (confirm("Cancel this pre-assignment?")) {
																try {
																	const res = await fetch("/api/preassign", {
																		method: "DELETE",
																		headers: {
																			"Content-Type": "application/json",
																		},
																		body: JSON.stringify({
																			preassign_id: item.preassign_id,
																		}),
																	});
																	if (res.ok) {
																		await fetchPreassigns();
																		await fetchAvailableResources();
																		alert("Pre-assignment cancelled");
																	}
																} catch (error) {
																	console.error(error);
																	alert("Failed to cancel");
																}
															}
														}}
														className="p-1.5 text-normal rounded transition"
														title="Cancel"
													>
														<X className="w-4 h-4" />
													</button>
												</>
											)}
											{item.assignment_status === "completed" && (
												<span className="text-gray-500 text-xs">Completed</span>
											)}
											{item.assignment_status === "cancelled" && (
												<span className="text-gray-500 text-xs">Cancelled</span>
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
				key={`${selectedHospitalId}-${selectedAmbulanceId}-${selectedStaffRole}-${selectedStaffId}`}
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setSelectedHospitalId(null);
					setSelectedAmbulanceId(null);
					setSelectedStaffId(null);
					setSelectedStaffRole("");
				}}
				title="New Staff Pre-Assignment"
				fields={preassignFields}
				initialData={{
					hospital_id: selectedHospitalId?.toString() ?? "",
					ambulance_id: selectedAmbulanceId?.toString() ?? "",
					staff_role: selectedStaffRole,
					staff_id: selectedStaffId?.toString() ?? "",
				}}
				onSubmit={handleCreatePreassign}
			/>
		</div>
	);
}
