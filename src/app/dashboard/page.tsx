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
import Link from "next/link";

export default function DashboardPage() {
	const [activeTab, setActiveTab] = useState("Ambulances");
	const [ambulances, setAmbulances] = useState<any[]>([]);
	const [patients, setPatients] = useState<any[]>([]);

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

	const handleAmbulanceUpdate = () => {
		// refetch ambulance table after each crud
		fetch("/api/ambulance")
			.then((res) => res.json())
			.then((data) => setAmbulances(data))
			.catch((error) => console.error("Error fetching ambulances:", error));
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
					<PatientTable initialData={patients as any} />
				)}
				{activeTab === "Locations" && <LocationTable initialData={[]} />}
				{activeTab === "Staffs" && <StaffTable initialData={[]} />}
				{activeTab === "Hospitals" && <HospitalTable initialData={[]} />}
			</div>
			<Footer />
		</div>
	);
}
