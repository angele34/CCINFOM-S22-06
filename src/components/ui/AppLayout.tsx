"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface AppLayoutProps {
	children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	return (
		<div className="flex h-screen bg-gray-50">
			{/* side bar*/}
			<Sidebar sidebarOpen={sidebarOpen} />

			{/* main content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* header */}
				<TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

				{/* contents ng page */}
				<main className="flex-1 overflow-y-auto">{children}</main>

				{/* footer */}
				<footer className="bg-teal-700 text-white text-center py-3 px-6">
					<p className="text-sm">
						Primecare Hospital © 2025. All Rights Reserved
					</p>
				</footer>
			</div>
		</div>
	);
}
