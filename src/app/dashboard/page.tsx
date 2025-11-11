import AmbulanceTable from "../../components/AmbulanceTable";
import Link from "next/link";

export const metadata = {
	title: "Ambulance Records",
};

export default function DashboardPage() {
	// to do: connect backend
	const ambulances: any[] = [];

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{/* header */}
			<header className="bg-gradient-to-r from-[#2882FF] to-[#00BBA8] text-white py-4 px-6 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="text-2xl">🚑</div>
					<h1 className="text-lg font-semibold">
						Primecare General Hospital Management System
					</h1>
				</div>
				<Link
					href="/login"
					className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition"
				>
					↪ Logout
				</Link>
			</header>

			{/* tabs */}
			<div className="flex justify-center gap-4 my-6">
				<button className="px-8 py-3 bg-gradient-to-r from-[#00BBA8] to-[#2882FF] text-white rounded-full font-medium shadow-lg">
					📋 Records
				</button>
				<button className="px-8 py-3 bg-white text-gray-700 rounded-full font-medium shadow hover:shadow-lg transition">
					📄 Reports
				</button>
			</div>

			{/* Record Buttons */}
			<div className="flex justify-center gap-6 mb-8">
				{["Ambulances", "Patients", "Locations", "Staffs", "Hospitals"].map(
					(item) => (
						<Link
							key={item}
							href="#"
							className="px-6 py-3 bg-white rounded-full shadow hover:shadow-md transition text-gray-700 font-medium"
						>
							{item}
						</Link>
					)
				)}
			</div>

			{/* Scrollable data container */}
			<div className="flex-1 overflow-y-auto pb-6">
				<AmbulanceTable initialData={ambulances} />
			</div>

			{/* footer */}
			<footer className="bg-gradient-to-r from-[#2882FF] to-[#00BBA8] text-white text-center py-4">
				Primecare Hospital © 2025. All Rights Reserved
			</footer>
		</div>
	);
}
