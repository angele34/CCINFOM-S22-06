"use client";
import { Menu, X } from "lucide-react";

interface TopBarProps {
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
}

export default function TopBar({ sidebarOpen, setSidebarOpen }: TopBarProps) {
	return (
		<header className="bg-gradient-to-r from-teal-800 via-teal-800 to-teal-700 px-6 py-4 flex items-center justify-between text-white">
			<div className="flex items-center gap-4">
				<button
					onClick={() => setSidebarOpen(!sidebarOpen)}
					className="text-white hover:text-gray-200"
				>
					{sidebarOpen ? (
						<X className="w-5 h-5" />
					) : (
						<Menu className="w-5 h-5" />
					)}
				</button>
				<div>
					<h1 className="text-2xl font-bold text-white">
						PrimeCare General Hospital Management System
					</h1>
				</div>
			</div>
		</header>
	);
}
