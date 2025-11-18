import Image from "next/image";

export interface TransferTransaction {
	transfer_id: number;
	patient_id: number;
	patient_name: string;
	ambulance_id: number;
	from_location: string;
	to_hospital: string;
	transfer_status: string;
	completed_at: string | null;
	created_at: string;
}

export default function TransferTable({
	data,
}: {
	data: TransferTransaction[];
}) {
	return (
		<div className="max-w-[1600px] mx-auto px-6 h-full">
			<div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-xl font-semibold text-ambulance-teal-750">
							Patient Transfer Completion
						</h2>
						<p className="text-sm text-ambulance-teal-750 text-opacity-80">
							Track and complete patient transfers
						</p>
					</div>
					<button className="px-5 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition">
						+ Complete Transfer
					</button>
				</div>

				<div className="overflow-auto flex-1">
					<table className="w-full text-left text-sm">
						<thead className="border-b border-gray-200 sticky top-0 bg-white z-10 shadow-sm">
							<tr className="text-ambulance-teal-750">
								<th className="py-2 px-3 font-bold">Transfer ID</th>
								<th className="py-2 px-3 font-bold">Patient ID</th>
								<th className="py-2 px-3 font-bold">Patient Name</th>
								<th className="py-2 px-3 font-bold">Ambulance ID</th>
								<th className="py-2 px-3 font-bold">From Location</th>
								<th className="py-2 px-3 font-bold">To Hospital</th>
								<th className="py-2 px-3 font-bold">Transfer Status</th>
								<th className="py-2 px-3 font-bold">Completed At</th>
								<th className="py-2 px-3 font-bold">Date Created</th>
								<th className="py-2 px-3 font-bold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{data.length === 0 ? (
								<tr>
									<td colSpan={10} className="py-12 text-center">
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
										<td className="py-3 px-3 text-gray-800">
											{item.patient_id}
										</td>
										<td className="py-3 px-3 text-gray-800">
											{item.patient_name}
										</td>
										<td className="py-3 px-3 text-gray-800">
											{item.ambulance_id}
										</td>
										<td className="py-3 px-3 text-gray-800">
											{item.from_location}
										</td>
										<td className="py-3 px-3 text-gray-800">
											{item.to_hospital}
										</td>
										<td className="py-3 px-3">
											<span
												className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
													item.transfer_status === "in_transfer"
														? "bg-blue-100 text-blue-800"
														: item.transfer_status === "transferred"
														? "bg-green-100 text-green-800"
														: "bg-yellow-100 text-yellow-800"
												}`}
											>
												{item.transfer_status}
											</span>
										</td>
										<td className="py-3 px-3 text-gray-800">
											{item.completed_at
												? new Date(item.completed_at).toLocaleString()
												: "N/A"}
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
