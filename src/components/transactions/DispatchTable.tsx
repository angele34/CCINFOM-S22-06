"use client";

import { useEffect, useState, useMemo } from "react";
import FormModal from "../ui/FormModal";

interface Dispatch {
	dispatch_id: number;
	request_id: number;
	ambulance_id: number;
	dispatch_status: string;
	created_on: string;
	dispatched_on: string | null;
	request?: {
		patient_id: number;
	};
}

interface Request {
	request_id: number;
	patient_id: number;
	request_status: string;
	hospital_id: number;
	patient?: {
		name: string;
	};
	hospital?: {
		city: string;
	};
}

interface Ambulance {
	ambulance_id: number;
	plate_no: string;
	ambulance_status: string;
	hospital_id: number;
	hospital?: {
		city: string;
	};
}

export default function DispatchTable() {
	const [data, setData] = useState<Dispatch[]>([]);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [requests, setRequests] = useState<Request[]>([]);
	const [allAmbulances, setAllAmbulances] = useState<Ambulance[]>([]);
	const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
		null
	);

	// Filter ambulances based on selected request's hospital city
	const ambulances = useMemo(() => {
		if (!selectedRequestId) {
			return allAmbulances;
		}

		const selectedRequest = requests.find(
			(r) => r.request_id === selectedRequestId
		);

		if (!selectedRequest || !selectedRequest.hospital?.city) {
			return allAmbulances;
		}

		// Filter ambulances from the same city as the request's destination hospital
		return allAmbulances.filter(
			(a) => a.hospital?.city === selectedRequest.hospital?.city
		);
	}, [selectedRequestId, allAmbulances, requests]);

	const fetchDispatches = () => {
		fetch("/api/dispatch")
			.then((res) => res.json())
			.then((json) => {
				const dispatches = Array.isArray(json) ? json : [];
				// sort by status
				const sorted = dispatches.sort((a, b) => {
					// prio is dispatched status comes first
					if (
						a.dispatch_status === "dispatched" &&
						b.dispatch_status !== "dispatched"
					)
						return -1;
					if (
						a.dispatch_status !== "dispatched" &&
						b.dispatch_status === "dispatched"
					)
						return 1;
					// second prio is sort by ID descending (newest first)
					return b.dispatch_id - a.dispatch_id;
				});
				setData(sorted);
			})
			.catch((err) => {
				console.error("Failed to fetch dispatches:", err);
				setData([]);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchDispatches();

		// Fetch pending requests, available ambulances, and preassigns
		Promise.all([
			fetch("/api/request").then((r) => r.json()),
			fetch("/api/ambulance").then((r) => r.json()),
			fetch("/api/preassign").then((r) => r.json()),
		]).then(([requestsData, ambulancesData, preassignsData]) => {
			const pendingRequests = Array.isArray(requestsData)
				? requestsData.filter((r) => r.request_status === "pending")
				: [];
			setRequests(pendingRequests);

			// Filter for available ambulances with active staff assignments
			const activePreassigns = Array.isArray(preassignsData)
				? preassignsData.filter((p) => p.assignment_status === "active")
				: [];
			const ambulancesWithStaff = new Set(
				activePreassigns.map((p) => p.ambulance_id)
			);

			const availableAmbulancesWithStaff = Array.isArray(ambulancesData)
				? ambulancesData.filter(
						(a) =>
							a.ambulance_status === "available" &&
							ambulancesWithStaff.has(a.ambulance_id)
				  )
				: [];
			setAllAmbulances(availableAmbulancesWithStaff);
		});
	}, []);

	const handleCreateDispatch = async (values: Record<string, string>) => {
		if (!values.request_id || !values.ambulance_id) {
			alert("Please fill all required fields");
			return;
		}

		// Get the patient_id from the selected request
		const selectedRequest = requests.find(
			(r) => r.request_id === Number(values.request_id)
		);

		if (!selectedRequest) {
			alert("Selected request not found");
			return;
		}

		// Check if there's already an ongoing dispatch for this patient
		const existingDispatch = data.find(
			(d) =>
				d.request?.patient_id === selectedRequest.patient_id &&
				d.dispatch_status === "dispatched"
		);

		if (existingDispatch) {
			alert(
				"This patient already has an ongoing dispatch. Please wait for the current dispatch to be completed or cancelled."
			);
			return;
		}

		try {
			const res = await fetch("/api/dispatch", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					request_id: Number(values.request_id),
					ambulance_id: Number(values.ambulance_id),
				}),
			});

			if (!res.ok) {
				const error = await res.json();
				alert(`Error: ${error.error || "Failed to create dispatch"}`);
				return;
			}

			fetchDispatches();
			setModalOpen(false);
			setSelectedRequestId(null);
		} catch (error) {
			console.error(error);
			alert("Network error");
		}
	};

	const formatStatus = (status: string) => {
		return status.charAt(0).toUpperCase() + status.slice(1);
	};

	const dispatchFields = [
		{
			name: "request_id",
			label: "Request",
			type: "select" as const,
			required: true,
			options: requests.map((r) => ({
				value: r.request_id,
				label: `Request #${r.request_id} - ${r.patient?.name || "Unknown"}`,
			})),
			onChange: (value: string) => {
				setSelectedRequestId(Number(value));
			},
		},
		{
			name: "ambulance_id",
			label: "Ambulance",
			type: "select" as const,
			required: true,
			options: ambulances.map((a) => ({
				value: a.ambulance_id,
				label: `Ambulance #${a.ambulance_id} - ${a.plate_no}`,
			})),
		},
	];

	return (
		<div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col overflow-hidden">
			<div className="flex items-center justify-between mb-3">
				<div>
					<h2 className="text-xl font-semibold text-ambulance-teal-750">
						Dispatch Ambulance
					</h2>
					<p className="text-sm text-ambulance-teal-750 text-opacity-80">
						Assign ambulances to accepted requests
					</p>
				</div>
				<button
					onClick={() => setModalOpen(true)}
					className="px-5 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
				>
					+ New Dispatch
				</button>
			</div>

			<div className="overflow-auto flex-1 border-b border-gray-200">
				<table className="w-full text-left text-sm">
					<thead className="border-b border-gray-200 sticky top-0 bg-white z-10 shadow">
						<tr className="text-ambulance-teal-750">
							<th className="py-2 px-3 font-bold">Dispatch ID</th>
							<th className="py-2 px-3 font-bold">Request ID</th>
							<th className="py-2 px-3 font-bold">Ambulance ID</th>
							<th className="py-2 px-3 font-bold">Dispatch Status</th>
							<th className="py-2 px-3 font-bold">Created On</th>
							<th className="py-2 px-3 font-bold">Dispatched On</th>
							<th className="py-2 px-3 font-bold">Actions</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan={7} className="py-12 text-center">
									<p className="text-gray-500 text-base">Loading...</p>
								</td>
							</tr>
						) : data.length === 0 ? (
							<tr>
								<td colSpan={7} className="py-12 text-center">
									<p className="text-gray-500 text-base">
										No dispatch records found. Click &quot;+ New Dispatch&quot;
										to get started.
									</p>
								</td>
							</tr>
						) : (
							data.map((item) => (
								<tr
									key={item.dispatch_id}
									className="border-b border-gray-100 hover:bg-gray-50"
								>
									<td className="py-3 px-3 font-medium text-gray-900">
										{item.dispatch_id}
									</td>
									<td className="py-3 px-3 text-gray-800">{item.request_id}</td>
									<td className="py-3 px-3 text-gray-800">
										{item.ambulance_id}
									</td>
									<td className="py-3 px-3">
										<span
											className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
												item.dispatch_status === "dispatched"
													? "bg-yellow-100 text-yellow-800"
													: item.dispatch_status === "completed"
													? "bg-green-100 text-green-800"
													: "bg-gray-100 text-gray-800"
											}`}
										>
											{formatStatus(item.dispatch_status)}
										</span>
									</td>
									<td className="py-3 px-3 text-gray-800">
										{new Date(item.created_on).toLocaleString()}
									</td>
									<td className="py-3 px-3 text-gray-800">
										{item.dispatched_on
											? new Date(item.dispatched_on).toLocaleString()
											: "Not dispatched yet"}
									</td>
									<td className="py-3 px-3">
										<div className="flex items-center gap-2">
											{item.dispatch_status === "dispatched" && (
												<button
													onClick={async () => {
														if (confirm("Cancel this dispatch?")) {
															try {
																const res = await fetch("/api/dispatch", {
																	method: "PUT",
																	headers: {
																		"Content-Type": "application/json",
																	},
																	body: JSON.stringify({
																		dispatch_id: item.dispatch_id,
																		dispatch_status: "cancelled",
																	}),
																});
																if (res.ok) {
																	fetchDispatches();
																	alert("Dispatch cancelled");
																} else {
																	const error = await res.json();
																	alert(
																		`Error: ${
																			error.error || "Failed to cancel"
																		}`
																	);
																}
															} catch (error) {
																console.error(error);
																alert("Network error");
															}
														}
													}}
													className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
													title="Cancel Dispatch"
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
					setSelectedRequestId(null);
				}}
				title="New Dispatch"
				fields={dispatchFields}
				onSubmit={handleCreateDispatch}
				submitLabel="Create Dispatch"
				initialData={
					selectedRequestId
						? { request_id: selectedRequestId.toString() }
						: undefined
				}
			/>
		</div>
	);
}
