import Link from "next/link";
import Image from "next/image";

export default function ModeToggle({
	activeMode,
}: {
	activeMode: "Records" | "Reports";
}) {
	return (
		<div className="flex justify-center gap-4 my-6">
			<Link
				href="/dashboard"
				className={`flex items-center gap-2 px-10 py-3 rounded-full font-medium transition min-w-[160px] justify-center ${
					activeMode === "Records"
						? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
						: "bg-white text-gray-700 shadow-md hover:shadow-lg"
				}`}
			>
				<Image
					src="/icons/records.svg"
					alt="Records"
					width={20}
					height={20}
					className={`w-5 h-5 ${
						activeMode === "Records" ? "brightness-0 invert" : "opacity-70"
					}`}
				/>
				<span>Records</span>
			</Link>

			<Link
				href="/reports"
				className={`flex items-center gap-2 px-10 py-3 rounded-full font-medium transition min-w-[160px] justify-center ${
					activeMode === "Reports"
						? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
						: "bg-white text-gray-700 shadow-md hover:shadow-lg"
				}`}
			>
				<Image
					src="/icons/reports.svg"
					alt="Reports"
					width={20}
					height={20}
					className={`w-5 h-5 ${
						activeMode === "Reports" ? "brightness-0 invert" : "opacity-70"
					}`}
				/>
				<span>Reports</span>
			</Link>
		</div>
	);
}
