"use client";

import { useEffect, useState } from "react";
import FormModal from "../ui/FormModal";

export interface TransferTransaction {
	transfer_id: number;
	patient_id: number;
	ambulance_id: number;
	staff_id: number;
	hospital_id: number;
	priority_level: string;
	transfer_status: string;
	transferred_on: string;
	updated_on: string | null;
}

interface Dispatch {
	dispatch_id: number;
	request_id: number;
	ambulance_id: number;
	dispatch_status: string;
	ambulance: {
		plate_no: string;
	};
	request: {
		patient_id: number;
		patient: {
			name: string;
		};
	};
}

interface Staff {
	staff_id: number;
	name: string;
	staff_status: string;
}

interface Hospital {
	hospital_id: number;
	hospital_name: string;
}

export default function TransferTable() {
	const [data, setData] = useState<TransferTransaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [dispatches, setDispatches] = useState<Dispatch[]>([]);
	const [staffList, setStaffList] = useState<Staff[]>([]);
	const [hospitals, setHospitals] = useState<Hospital[]>([]);

	const fetchTransfers = () => {
		fetch("/api/transfer")
			.then((res) => res.json())
			.then((json) => {
				setData(Array.isArray(json) ? json : []);
			})
			.catch((err) => {
				console.error("Failed to fetch transfers:", err);
				setData([]);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchTransfers();

		// Fetch active dispatches and hospitals
		Promise.all([
			fetch("/api/dispatch").then((r) => r.json()),
			fetch("/api/hospital").then((r) => r.json()),
		]).then(([dispatchData, hospitalData]) => {
			const activeDispatches = Array.isArray(dispatchData)
				? dispatchData.filter(
						(d) =>
							d.dispatch_status !== "cancelled" &&
							d.dispatch_status === "dispatched"
				  )
				: [];
			setDispatches(activeDispatches);
			setHospitals(Array.isArray(hospitalData) ? hospitalData : []);
		});
	}, []);

	const handleDispatchChange = async (dispatchId: string) => {
		const dispatch = dispatches.find(
			(d) => d.dispatch_id === Number(dispatchId)
		);
		if (dispatch) {
			try {
				const res = await fetch(
					`/api/ambulance_staff?ambulance_id=${dispatch.ambulance_id}`
				);
				if (res.ok) {
					const staffData = await res.json();
					setStaffList(Array.isArray(staffData) ? staffData : []);
				}
			} catch (error) {
				console.error("Error fetching staff for ambulance:", error);
				setStaffList([]);
			}
		}
	};

	const handleCompleteTransfer = async (values: Record<string, string>) => {
		if (!values.dispatch_id || !values.staff_id || !values.hospital_id) {
			alert("Please fill all required fields");
			return;
		}

		try {
			const res = await fetch("/api/transfer", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					dispatch_id: Number(values.dispatch_id),
					staff_id: Number(values.staff_id),
					hospital_id: Number(values.hospital_id),
				}),
			});

			if (!res.ok) {
				const error = await res.json();
				alert(`Error: ${error.error || "Failed to complete transfer"}`);
				return;
			}

			fetchTransfers();
			setModalOpen(false);
			alert("Transfer completed successfully!");
		} catch (error) {
			console.error(error);
			alert("Network error");
		}
	};

	return (
		<div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col overflow-hidden">
			<div className="flex items-center justify-between mb-3">
				<div>
					<h2 className="text-xl font-semibold text-ambulance-teal-750">
						Patient Transfer Completion
					</h2>
					<p className="text-sm text-ambulance-teal-750 text-opacity-80">
						Track and complete patient transfers
					</p>
				</div>
				<button
					onClick={() => setModalOpen(true)}
					className="px-5 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
				>
					+ Complete Transfer
				</button>
			</div>

			<FormModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				onSubmit={handleCompleteTransfer}
				title="Complete Patient Transfer"
				submitLabel="Complete Transfer"
				fields={[
					{
						name: "dispatch_id",
						label: "Dispatch",
						type: "select",
						required: true,
						options: dispatches.map((d) => ({
							value: d.dispatch_id,
							label: `Dispatch #${d.dispatch_id} - ${
								d.request?.patient?.name || "Unknown"
							}`,
						})),
						onChange: handleDispatchChange,
					},
					{
						name: "staff_id",
						label: "Staff Member",
						type: "select",
						required: true,
						options: staffList.map((s) => ({
							value: s.staff_id,
							label: s.name,
						})),
					},
					{
						name: "hospital_id",
						label: "Destination Hospital",
						type: "select",
						required: true,
						options: hospitals.map((h) => ({
							value: h.hospital_id,
							label: h.hospital_name,
						})),
					},
				]}
			/>

			<div className="overflow-auto flex-1 border-b border-gray-200">
				<table className="w-full text-left text-sm">
					<thead className="border-b border-gray-200 sticky top-0 bg-white z-10 shadow">
						<tr className="text-ambulance-teal-750">
							<th className="py-2 px-3 font-bold">Transfer ID</th>
							<th className="py-2 px-3 font-bold">Patient ID</th>
							<th className="py-2 px-3 font-bold">Ambulance ID</th>
							<th className="py-2 px-3 font-bold">Staff ID</th>
							<th className="py-2 px-3 font-bold">Hospital ID</th>
							<th className="py-2 px-3 font-bold">Priority Level</th>
							<th className="py-2 px-3 font-bold">Transfer Status</th>
							<th className="py-2 px-3 font-bold">Transferred On</th>
							<th className="py-2 px-3 font-bold">Updated On</th>
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
										No transfer records found. Click &quot;+ Complete
										Transfer&quot; to get started.
									</p>
								</td>
							</tr>
						) : (
							data.map((item) => (
								<tr
									key={item.transfer_id}
									className="border-b border-gray-100 hover:bg-gray-50"
								>
									<td className="py-3 px-3 font-medium text-gray-900">
										{item.transfer_id}
									</td>
									<td className="py-3 px-3 text-gray-800">{item.patient_id}</td>
									<td className="py-3 px-3 text-gray-800">
										{item.ambulance_id}
									</td>
									<td className="py-3 px-3 text-gray-800">{item.staff_id}</td>
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
													: "bg-green-100 text-green-800"
											}`}
										>
											{item.priority_level}
										</span>
									</td>
									<td className="py-3 px-3">
										<span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
											{item.transfer_status}
										</span>
									</td>
									<td className="py-3 px-3 text-gray-800">
										{new Date(item.transferred_on).toLocaleString()}
									</td>
									<td className="py-3 px-3 text-gray-800">
										{item.updated_on
											? new Date(item.updated_on).toLocaleString()
											: "N/A"}
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
