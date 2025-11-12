"use client";

import { useState } from "react";

interface Patient {
    patient_id: number;
    ref_location_id: number;
    name: string | null;
    age: number | null;
    medical_condition: string | null;
    priority_level: string | null;
    contact_person: string | null;
    contact_number: number;
    transfer_status: string;
}

export default function PatientTable({
    initialData,
}: {
    initialData: Patient[];
}) {
    const [patients] = useState<Patient[]>(initialData);

    return (
        <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Patient Record Management
                        </h2>
                        <p className="text-sm text-gray-500">
                            Manage and track all patient assignments
                        </p>
                    </div>
                    <button className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                        + Add Patient
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-200">
                            <tr className="text-gray-600">
                                <th className="py-3 px-4 font-medium">Patient ID</th>
                                <th className="py-3 px-4 font-medium">Reference Location ID</th>
                                <th className="py-3 px-4 font-medium">Name</th>
                                <th className="py-3 px-4 font-medium">Age</th>
                                <th className="py-3 px-4 font-medium">Medical Condition</th>
                                <th className="py-3 px-4 font-medium">Priority Level</th>
                                <th className="py-3 px-4 font-medium">Contact Person</th>
                                <th className="py-3 px-4 font-medium">Contact Number</th>
                                <th className="py-3 px-4 font-medium">Transfer Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.length === 0 ? (
                                <tr>
                                    <td colSpan={16} className="py-8 text-center text-gray-500">
                                        No patient assignmenets found. Click &quot;+ Add
                                        Patient&quot; to get started.
                                    </td>
                                </tr>
                            ) : (
                                patients.map((patient) => (
                                    <tr
                                        key={patient.patient_id}
                                        className="border-b border-gray-100 hover:bg-gray-50"
                                    >
                                        <td className="py-4 px-4 font-medium text-gray-800">
                                            {patient.ref_location_id}
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">
                                            {patient.name ?? "N/A"}
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">
                                            {patient.age ?? "N/A"}
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">
                                            {patient.medical_condition ?? "N/A"}
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">
                                            {patient.priority_level ?? "N/A"}
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">
                                            {patient.contact_person ?? "N/A"}
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">
                                            {patient.contact_number ?? "N/A"}
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">
                                            {patient.transfer_status ?? "N/A"}
                                        </td>
                                        <td className="py-4 px-4 flex gap-2">
                                            <button
                                                className="p-2 hover:bg-gray-100 rounded"
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="p-2 hover:bg-gray-100 rounded"
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
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
