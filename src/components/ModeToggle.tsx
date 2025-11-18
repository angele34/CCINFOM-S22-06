import Link from "next/link";
import Image from "next/image";

const buttons = [
	{ name: "Records", href: "/dashboard", icon: "/icons/records.svg" },
	{
		name: "Transactions",
		href: "/transactions",
		icon: "/icons/transactions.svg",
	},
	{ name: "Reports", href: "/reports", icon: "/icons/reports.svg" },
];

export default function ModeToggle({
	activeMode,
}: {
	activeMode: "Records" | "Transactions" | "Reports";
}) {
	return (
		<div className="flex justify-center gap-4 my-6">
			{buttons.map((btn) => {
				const isActive = activeMode === btn.name;
				return (
					<Link
						key={btn.name}
						href={btn.href}
						className={`flex items-center gap-2 px-10 py-3 rounded-full font-medium transition min-w-40 justify-center ${
							isActive
								? "bg-linear-to-r from-teal-500 to-teal-600 text-white shadow-lg"
								: "bg-white text-gray-700 shadow-md hover:shadow-lg"
						}`}
					>
						<Image
							src={btn.icon}
							alt={btn.name}
							width={20}
							height={20}
							className={`w-5 h-5 ${
								isActive ? "brightness-0 invert" : "opacity-70"
							}`}
						/>
						<span>{btn.name}</span>
					</Link>
				);
			})}
		</div>
	);
}
