"use client";
import AppLayout from "../../components/ui/AppLayout";

export default function ReportsPage() {
	return (
		<AppLayout>
			<div className="p-6 space-y-6">
				{/* header  */}
				<div>
					<h1 className="text-2xl font-bold text-ambulance-teal-750">
						Reports
					</h1>
					<p className="text-gray-600">
						Generate and view system reports with analytics
					</p>
				</div>
				{/* content */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center min-h-[400px]">
					<h2 className="text-2xl font-bold text-gray-800 mb-2">lorem ipsum</h2>
					<p className="text-gray-600 text-center max-w-md">blablablablabla</p>
				</div>
			</div>
		</AppLayout>
	);
}
