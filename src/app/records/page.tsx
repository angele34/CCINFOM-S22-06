"use client";
import { useState, useEffect } from "react";
import AmbulanceTable from "../../components/records/AmbulanceTable";
import PatientTable from "../../components/records/PatientTable";
import LocationTable from "../../components/records/LocationTable";
import StaffTable from "../../components/records/StaffTable";
import HospitalTable from "../../components/records/HospitalTable";
import AppLayout from "../../components/ui/AppLayout";
import Image from "next/image";

interface Ambulance {
	ambulance_id: number;
	ambulance_type: string;
	hospital_id: number;
	ambulance_status: string;
	plate_no: string;
	created_at: string;
	updated_at: string | null;
}

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

interface Location {
	ref_location_id: number;
	city: string;
	street: string;
	created_at: string;
	updated_at: string | null;
}

interface Staff {
	staff_id: number;
	name: string;
	staff_role: string;
	license_no: string;
	shift_schedule: string;
	staff_status: string;
	created_at: string;
	updated_at: string | null;
}

interface Hospital {
	hospital_id: number;
	hospital_name: string;
	city: string;
	street: string;
	created_at: string;
	updated_at: string | null;
}

export default function RecordsPage() {
	const [activeTab, setActiveTab] = useState("Ambulances");
	const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
	const [patients, setPatients] = useState<Patient[]>([]);
	const [locations, setLocations] = useState<Location[]>([]);
	const [staffs, setStaffs] = useState<Staff[]>([]);
	const [hospitals, setHospitals] = useState<Hospital[]>([]);

	// fetch ambulance data from backend
	useEffect(() => {
		const fetchAmbulances = async () => {
			try {
				const response = await fetch("/api/ambulance");
				if (response.ok) {
					const data = await response.json();
					setAmbulances(data);
				}
			} catch (error) {
				console.error("Error fetching ambulances:", error);
			}
		};
		fetchAmbulances();
	}, []);

	// fetch patient data from backend
	useEffect(() => {
		const fetchPatients = async () => {
			try {
				const response = await fetch("/api/patient");
				if (response.ok) {
					const data = await response.json();
					setPatients(data);
				}
			} catch (error) {
				console.error("Error fetching patients:", error);
			}
		};
		fetchPatients();
	}, []);

	// fetch location data from backend
	useEffect(() => {
		const fetchLocations = async () => {
			try {
				const response = await fetch("/api/reference_loc");
				if (response.ok) {
					const data = await response.json();
					setLocations(data);
				}
			} catch (error) {
				console.error("Error fetching locations:", error);
			}
		};
		fetchLocations();
	}, []);

	// fetch staff data from backend
	useEffect(() => {
		const fetchStaffs = async () => {
			try {
				const response = await fetch("/api/staff");
				if (response.ok) {
					const data = await response.json();
					setStaffs(data);
				}
			} catch (error) {
				console.error("Error fetching staffs:", error);
			}
		};
		fetchStaffs();
	}, []);

	// fetch hospital data from backend
	useEffect(() => {
		const fetchHospitals = async () => {
			try {
				const response = await fetch("/api/hospital");
				if (response.ok) {
					const data = await response.json();
					setHospitals(data);
				} else {
					console.error("Failed to fetch hospitals - Status:", response.status);
				}
			} catch (error) {
				console.error("Error fetching hospitals:", error);
			}
		};
		fetchHospitals();
	}, []);

	const handleAmbulanceUpdate = () => {
		fetch("/api/ambulance")
			.then((res) => res.json())
			.then((data) => setAmbulances(data))
			.catch((error) => console.error("Error fetching ambulances:", error));
	};

	const handlePatientUpdate = () => {
		fetch("/api/patient")
			.then((res) => res.json())
			.then((data) => setPatients(data))
			.catch((error) => console.error("Error fetching patients:", error));
	};

	const handleLocationUpdate = () => {
		fetch("/api/reference_loc")
			.then((res) => res.json())
			.then((data) => setLocations(data))
			.catch((error) => console.error("Error fetching locations:", error));
	};

	const handleStaffUpdate = () => {
		fetch("/api/staff")
			.then((res) => res.json())
			.then((data) => setStaffs(data))
			.catch((error) => console.error("Error fetching staffs:", error));
	};

	const handleHospitalUpdate = () => {
		fetch("/api/hospital")
			.then((res) => res.json())
			.then((data) => setHospitals(data))
			.catch((error) => console.error("Error fetching hospitals:", error));
	};

	const tabs = [
		{ name: "Ambulances", icon: "/icons/ambulance.svg" },
		{ name: "Patients", icon: "/icons/patients.svg" },
		{ name: "Locations", icon: "/icons/location.svg" },
		{ name: "Staffs", icon: "/icons/staff.svg" },
		{ name: "Hospitals", icon: "/icons/hospital.svg" },
	];

	return (
		<AppLayout>
			<div className="h-full flex flex-col p-6">
				{/* header */}
				<div className="mb-4">
					<h1 className="text-2xl font-bold text-ambulance-teal-750">
						Records Management
					</h1>
					<p className="text-gray-600">Manage all system records and data</p>
				</div>

				{/* buttons */}
				<div className="flex gap-2 flex-wrap mb-4">
					{tabs.map((item) => (
						<button
							key={item.name}
							onClick={() => setActiveTab(item.name)}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
								activeTab === item.name
									? "bg-teal-600 text-white shadow-sm"
									: "border border-gray-200 text-gray-600 hover:bg-gray-50"
							}`}
						>
							<Image
								src={item.icon}
								alt={item.name}
								width={18}
								height={18}
								className={
									activeTab === item.name ? "brightness-0 invert" : "opacity-60"
								}
							/>
							<span>{item.name}</span>
						</button>
					))}
				</div>

				{/* main content */}
				{activeTab === "Ambulances" && (
					<AmbulanceTable
						initialData={ambulances}
						onUpdate={handleAmbulanceUpdate}
					/>
				)}
				{activeTab === "Patients" && (
					<PatientTable initialData={patients} onUpdate={handlePatientUpdate} />
				)}
				{activeTab === "Locations" && (
					<LocationTable
						initialData={locations}
						onUpdate={handleLocationUpdate}
					/>
				)}
				{activeTab === "Staffs" && (
					<StaffTable initialData={staffs} onUpdate={handleStaffUpdate} />
				)}
				{activeTab === "Hospitals" && (
					<HospitalTable
						initialData={hospitals}
						onUpdate={handleHospitalUpdate}
					/>
				)}
			</div>
		</AppLayout>
	);
}
