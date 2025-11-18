import Image from "next/image";

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

export default function PreassignTable({
	data,
}: {
	data: PreassignTransaction[];
}) {
	return (
		<div className="max-w-[1600px] mx-auto px-6 h-full">
			<div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-xl font-semibold text-ambulance-teal-750">
							Pre-assign Staff to Ambulance
						</h2>
						<p className="text-sm text-ambulance-teal-750 text-opacity-80">
							Match available staff to ambulances based on shift and location
						</p>
					</div>
					<button className="px-5 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition">
						+ New Pre-assignment
					</button>
				</div>

				<div className="overflow-auto flex-1">
					<table className="w-full text-left text-sm">
						<thead className="border-b border-gray-200 sticky top-0 bg-white z-10 shadow-sm">
							<tr className="text-ambulance-teal-750">
								<th className="py-2 px-3 font-bold">ID</th>
								<th className="py-2 px-3 font-bold">Ambulance ID</th>
								<th className="py-2 px-3 font-bold">Staff IDs</th>
								<th className="py-2 px-3 font-bold">Ambulance Type</th>
								<th className="py-2 px-3 font-bold">Base Location</th>
								<th className="py-2 px-3 font-bold">Shift Schedule</th>
								<th className="py-2 px-3 font-bold">Status</th>
								<th className="py-2 px-3 font-bold">Date Created</th>
								<th className="py-2 px-3 font-bold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{data.length === 0 ? (
								<tr>
									<td colSpan={9} className="py-12 text-center">
										<p className="text-gray-500 text-base">
											No pre-assignment records found. Click &quot;+ New
											Pre-assignment&quot; to get started.
										</p>
									</td>
								</tr>
							) : (
								data.map((item) => (
									<tr
										key={item.preassign_id}
										className="border-b border-gray-100 hover:bg-gray-50"
									>
										<td className="py-3 px-3 font-medium text-gray-900">
											{item.preassign_id}
										</td>
										<td className="py-3 px-3 text-gray-800">
											{item.ambulance_id}
										</td>
										<td className="py-3 px-3 text-gray-800">
											{item.staff_ids}
										</td>
										<td className="py-3 px-3 text-gray-800">
											{item.ambulance_type}
										</td>
										<td className="py-3 px-3 text-gray-800">
											{item.base_location}
										</td>
										<td className="py-3 px-3 text-gray-800">
											{item.shift_schedule}
										</td>
										<td className="py-3 px-3">
											<span
												className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
													item.status === "active"
														? "bg-green-100 text-green-800"
														: "bg-gray-100 text-gray-800"
												}`}
											>
												{item.status}
											</span>
										</td>
										<td className="py-3 px-3 text-gray-800">
											{new Date(item.created_at).toLocaleString()}
										</td>
										<td className="py-3 px-3">
											<div className="flex items-center gap-2">
												<button
													className="p-2 hover:bg-blue-100 rounded transition"
													title="View"
												>
													<Image
														src="/icons/edit.svg"
														alt="View"
														width={18}
														height={18}
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
