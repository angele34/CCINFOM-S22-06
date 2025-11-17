"use client";
import { useState, useEffect } from "react";
import AmbulanceTable from "../../components/AmbulanceTable";
import PatientTable from "../../components/PatientTable";
import LocationTable from "../../components/LocationTable";
import StaffTable from "../../components/StaffTable";
import HospitalTable from "../../components/HospitalTable";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ModeToggle from "../../components/ModeToggle";
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

export default function DashboardPage() {
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
				}
			} catch (error) {
				console.error("Error fetching hospitals:", error);
			}
		};
		fetchHospitals();
	}, []);

	const handleAmbulanceUpdate = () => {
		// refetch ambulance table after each crud
		fetch("/api/ambulance")
			.then((res) => res.json())
			.then((data) => setAmbulances(data))
			.catch((error) => console.error("Error fetching ambulances:", error));
	};

	const handlePatientUpdate = () => {
		// refetch patient table after each crud
		fetch("/api/patient")
			.then((res) => res.json())
			.then((data) => setPatients(data))
			.catch((error) => console.error("Error fetching patients:", error));
	};

	const handleLocationUpdate = () => {
		// refetch location table after each crud
		fetch("/api/reference_loc")
			.then((res) => res.json())
			.then((data) => setLocations(data))
			.catch((error) => console.error("Error fetching locations:", error));
	};

	const handleStaffUpdate = () => {
		// refetch staff table after each crud
		fetch("/api/staff")
			.then((res) => res.json())
			.then((data) => setStaffs(data))
			.catch((error) => console.error("Error fetching staffs:", error));
	};

	const handleHospitalUpdate = () => {
		// refetch hospital table after each crud
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
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Header />
			{/* tabs */}
			<ModeToggle activeMode={"Records"} />
			{/* database buttons */}
			<div className="flex justify-center gap-4 mb-8 px-6">
				{tabs.map((item) => (
					<button
						key={item.name}
						onClick={() => setActiveTab(item.name)}
						className={`flex flex-col items-center justify-center gap-2 px-6 py-4 rounded-2xl transition font-semibold min-w-[120px] ${
							activeTab === item.name
								? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
								: "bg-white text-gray-700 shadow-md hover:shadow-lg"
						}`}
					>
						<div className="w-10 h-10 flex items-center justify-center">
							<Image
								src={item.icon}
								alt={item.name}
								width={32}
								height={32}
								className={`w-8 h-8 ${
									activeTab === item.name ? "brightness-0 invert" : "opacity-70"
								}`}
							/>
						</div>
						<span className="text-sm">{item.name}</span>
					</button>
				))}
			</div>
			{/* table container */}
			<div className="flex-1 overflow-y-auto pb-6">
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
			<Footer />
		</div>
	);
}
