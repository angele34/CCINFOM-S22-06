"use client";

import { useState } from "react";
import Image from "next/image";
import FormModal from "../ui/FormModal";

interface Location {
	ref_location_id: number;
	city: string;
	street: string;
	created_at: string;
	updated_at: string | null;
}

export default function LocationTable({
	initialData,
	onUpdate,
}: {
	initialData: Location[];
	onUpdate?: () => void;
}) {
	const [showModal, setShowModal] = useState(false);
	const [editingLocation, setEditingLocation] = useState<Location | null>(null);

	const formFields = [
		{
			name: "city",
			label: "City",
			type: "text" as const,
			required: true,
			placeholder: "Enter city name",
			maxLength: 20,
			customErrorMessages: {
				required: "City is required",
				tooLong: "City must not exceed 20 characters",
			},
		},
		{
			name: "street",
			label: "Street",
			type: "text" as const,
			required: true,
			placeholder: "Enter street address",
			maxLength: 20,
			customErrorMessages: {
				required: "Street is required",
				tooLong: "Street must not exceed 20 characters",
			},
		},
	];

	const handleFormSubmit = async (formData: Record<string, string>) => {
		try {
			const payload = {
				city: formData.city,
				street: formData.street,
			};

			const url = "/api/reference_loc";
			const method = editingLocation ? "PUT" : "POST";
			const body = editingLocation
				? { ...payload, ref_location_id: editingLocation.ref_location_id }
				: payload;

			const response = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (response.ok) {
				setShowModal(false);
				setEditingLocation(null);
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
			console.error("Error saving location:", error);
			alert("An error occurred while saving the location");
		}
	};

	const handleEdit = (location: Location) => {
		setEditingLocation(location);
		setShowModal(true);
	};

	const handleDelete = async (ref_location_id: number) => {
		if (!confirm("Are you sure you want to delete this location?")) {
			return;
		}

		try {
			const response = await fetch("/api/reference_loc", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ref_location_id }),
			});

			if (response.ok) {
				onUpdate?.();
			} else {
				const errorData = await response.json();
				alert(`Error: ${errorData.error || "Failed to delete location"}`);
			}
		} catch (error) {
			console.error("Error deleting location:", error);
			alert("An error occurred while deleting the location");
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setEditingLocation(null);
	};

	return (
		<div className="max-w-[1200px] mx-auto px-6 h-full">
			<div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-xl font-semibold text-ambulance-teal-750">
							Reference Location Record Management
						</h2>
						<p className="text-sm text-ambulance-teal-750 text-opacity-80">
							Viewing a reference location record along with the address
						</p>
					</div>
					<button
						onClick={() => setShowModal(true)}
						className="px-5 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
					>
						+ Add Location
					</button>
				</div>

				<FormModal
					isOpen={showModal}
					onClose={handleCloseModal}
					onSubmit={handleFormSubmit}
					title={
						editingLocation ? "Edit Location Record" : "New Location Record"
					}
					fields={formFields}
					submitLabel={editingLocation ? "Update Location" : "Add Location"}
					initialData={
						editingLocation
							? {
									city: editingLocation?.city || "",
									street: editingLocation?.street || "",
							  }
							: undefined
					}
				/>

				{/* Table */}
				<div className="overflow-auto flex-1">
					<table className="w-full text-left text-sm">
						<thead className="border-b border-gray-200 sticky top-0 bg-white z-10 shadow-sm">
							<tr className="text-ambulance-teal-750">
								<th className="py-2 px-3 text-center font-bold">
									Ref Location ID
								</th>
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
									<td colSpan={6} className="py-12 text-center">
										<p className="text-gray-500 text-base">
											No location records found. Click &quot;+ Add
											Location&quot; to get started.
										</p>
									</td>
								</tr>
							) : (
								initialData.map((loc) => (
									<tr
										key={loc.ref_location_id}
										className="border-b border-gray-100 hover:bg-gray-50"
									>
										<td className="py-4 px-4 font-medium text-center text-gray-900">
											{loc.ref_location_id}
										</td>
										<td className="py-4 px-4 text-gray-800">{loc.city}</td>
										<td className="py-4 px-4 text-gray-800">{loc.street}</td>
										<td className="py-4 px-4 text-gray-800">
											{new Date(loc.created_at).toLocaleString()}
										</td>
										<td className="py-4 px-4 text-gray-800">
											{loc.updated_at
												? new Date(loc.updated_at).toLocaleString()
												: "N/A"}
										</td>
										<td className="py-4 px-4">
											<div className="flex items-center justify-left gap-2">
												<button
													className="p-2 hover:bg-blue-100 rounded transition"
													title="Edit"
													onClick={() => handleEdit(loc)}
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
													onClick={() => handleDelete(loc.ref_location_id)}
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
