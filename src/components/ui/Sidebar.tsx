"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	Database,
	ArrowRightLeft,
	FileBarChart,
	LogOut,
	Ambulance,
	LayoutDashboard,
} from "lucide-react";

interface SidebarProps {
	className?: string;
	sidebarOpen: boolean;
}

export default function Sidebar({ className = "", sidebarOpen }: SidebarProps) {
	const pathname = usePathname();
	const router = useRouter();

	const handleLogout = () => {
		router.push("/login");
	};

	const navItems = [
		{
			id: "dashboard",
			label: "Dashboard",
			href: "/dashboard",
			icon: LayoutDashboard,
		},
		{ id: "records", label: "Records", href: "/records", icon: Database },
		{
			id: "transactions",
			label: "Transactions",
			href: "/transactions",
			icon: ArrowRightLeft,
		},
		{ id: "reports", label: "Reports", href: "/reports", icon: FileBarChart },
	];

	const isActive = (href: string) => pathname === href;

	return (
		<aside
			className={`${
				sidebarOpen ? "w-64 shadow-xl border-r border-white/5 z-20" : "w-0"
			} bg-gradient-to-b from-teal-700 to-teal-900 text-white transition-all duration-300 overflow-hidden flex flex-col ${className}`}
		>
			{/* Logo Section */}
			<div className="p-5 border-b border-white/10">
				<div className="flex items-center justify-center">
					<img
						src="/logos/side_logo.svg"
						alt="PrimeCare General Hospital"
						className="w-full h-auto max-w-[800px]"
					/>
				</div>
			</div>

			{/* Navigation Items */}
			<nav className="flex-1 p-4">
				<div className="space-y-2">
					{navItems.map((item) => (
						<Link
							key={item.id}
							href={item.href}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
								isActive(item.href)
									? "bg-teal-500 text-white shadow-lg"
									: "text-teal-100 hover:bg-white/10"
							}`}
						>
							<item.icon className="w-5 h-5" />
							<span>{item.label}</span>
						</Link>
					))}
				</div>
			</nav>

			{/* Bottom Actions */}
			<div className="p-4 border-t border-white/10">
				<button
					onClick={handleLogout}
					className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-teal-100 hover:bg-white/10 hover:text-white transition-all"
				>
					<LogOut className="w-5 h-5" />
					<span>Logout</span>
				</button>
			</div>
		</aside>
	);
}
