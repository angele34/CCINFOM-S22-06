"use client";

import { useEffect, useState } from "react";
import FormModal from "../ui/FormModal";

interface Dispatch {
	dispatch_id: number;
	request_id: number;
	ambulance_id: number;
	dispatch_status: string;
	created_on: string;
	dispatched_on: string | null;
}

interface Request {
	request_id: number;
	patient_id: number;
	request_status: string;
}

interface Ambulance {
	ambulance_id: number;
	plate_no: string;
	ambulance_status: string;
}

export default function DispatchTable() {
	const [data, setData] = useState<Dispatch[]>([]);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [requests, setRequests] = useState<Request[]>([]);
	const [ambulances, setAmbulances] = useState<Ambulance[]>([]);

	const fetchDispatches = () => {
		fetch("/api/dispatch")
			.then((res) => res.json())
			.then((json) => {
				setData(Array.isArray(json) ? json : []);
			})
			.catch((err) => {
				console.error("Failed to fetch dispatches:", err);
				setData([]);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchDispatches();

		// Fetch accepted requests and available ambulances
		Promise.all([
			fetch("/api/request").then((r) => r.json()),
			fetch("/api/ambulance").then((r) => r.json()),
		]).then(([requestsData, ambulancesData]) => {
			const acceptedRequests = Array.isArray(requestsData)
				? requestsData.filter((r) => r.request_status === "accepted")
				: [];
			setRequests(acceptedRequests);
			setAmbulances(Array.isArray(ambulancesData) ? ambulancesData : []);
		});
	}, []);

	const handleCreateDispatch = async (values: Record<string, string>) => {
		if (!values.request_id || !values.ambulance_id) {
			alert("Please fill all required fields");
			return;
		}

		try {
			const res = await fetch("/api/dispatch", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					request_id: Number(values.request_id),
					ambulance_id: Number(values.ambulance_id),
					dispatch_status: "dispatched",
				}),
			});

			if (!res.ok) {
				const error = await res.json();
				alert(`Error: ${error.error || "Failed to create dispatch"}`);
				return;
			}

			fetchDispatches();
			setModalOpen(false);
		} catch (error) {
			console.error(error);
			alert("Network error");
		}
	};

	const handleUpdateStatus = async (
		dispatch_id: number,
		status: "dispatched" | "cancelled"
	) => {
		try {
			const updateData: { dispatch_status: string; dispatched_on?: Date } = {
				dispatch_status: status,
			};

			// Set dispatched_on timestamp when status is dispatched
			if (status === "dispatched") {
				updateData.dispatched_on = new Date();
			}

			const res = await fetch("/api/dispatch", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					dispatch_id,
					...updateData,
				}),
			});

			if (!res.ok) {
				const error = await res.json();
				alert(`Error: ${error.error || "Failed to update dispatch"}`);
				return;
			}

			fetchDispatches();
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
			type: "select",
			required: true,
			options: requests.map((r) => ({
				value: r.request_id,
				label: `Request #${r.request_id} - Patient #${r.patient_id}`,
			})),
		},
		{
			name: "ambulance_id",
			label: "Ambulance",
			type: "select",
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
											{item.dispatch_status !== "dispatched" && (
												<button
													onClick={() =>
														handleUpdateStatus(item.dispatch_id, "dispatched")
													}
													className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
													title="Mark as Dispatched"
												>
													Dispatch
												</button>
											)}
											{item.dispatch_status !== "cancelled" && (
												<button
													onClick={() =>
														handleUpdateStatus(item.dispatch_id, "cancelled")
													}
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
				onClose={() => setModalOpen(false)}
				title="New Dispatch"
				fields={dispatchFields as any}
				onSubmit={handleCreateDispatch}
				submitLabel="Create Dispatch"
			/>
		</div>
	);
}
