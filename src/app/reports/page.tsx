"use client";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import ModeToggle from "../../components/ui/ModeToggle";

export default function ReportsPage() {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Header />
			{/* tabs */}
			<ModeToggle activeMode={"Reports"} />
			{/* Main content area */}
			<div className="flex-1 flex items-center justify-center px-6 pb-6">
				<div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8 min-h-[400px] flex flex-col items-center justify-center">
					<div className="text-center">
						<div className="text-6xl text-gray-800 mb-4">placeholder</div>
						<h2 className="text-2xl font-semibold text-gray-800 mb-2">
							placeholder
						</h2>
						<p className="text-gray-500">placeholder</p>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
