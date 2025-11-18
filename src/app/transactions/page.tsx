"use client";
import { useState } from "react";
import AppLayout from "../../components/ui/AppLayout";
import Image from "next/image";
import PreassignTable from "../../components/transactions/PreassignTable";
import RequestTable from "../../components/transactions/RequestTable";
import DispatchTable from "../../components/transactions/DispatchTable";
import TransferTable from "../../components/transactions/TransferTable";

type TransactionTab = "preassign" | "request" | "dispatch" | "transfer";

export default function TransactionsPage() {
	const [activeTab, setActiveTab] = useState<TransactionTab>("preassign");

	// tables fetch their own data; no mock props needed

	const tabs: { key: TransactionTab; name: string; icon: string }[] = [
		{ key: "preassign", name: "Pre-assign", icon: "/icons/ambulance.svg" },
		{ key: "request", name: "Request", icon: "/icons/patients.svg" },
		{ key: "dispatch", name: "Dispatch", icon: "/icons/location.svg" },
		{ key: "transfer", name: "Transfer", icon: "/icons/staff.svg" },
	];

	return (
		<AppLayout>
			<div className="h-full flex flex-col p-6">
				{/* header */}
				<div className="mb-4">
					<h1 className="text-2xl font-bold text-ambulance-teal-750">
						Transactions
					</h1>
					<p className="text-gray-600">
						Manage all patient transfer transactions
					</p>
				</div>

				{/* buttons */}
				<div className="flex gap-2 flex-wrap mb-4">
					{tabs.map((item) => (
						<button
							key={item.key}
							onClick={() => setActiveTab(item.key)}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
								activeTab === item.key
									? "bg-teal-600 text-white shadow-sm"
									: "border border-gray-200 text-gray-600 hover:bg-gray-50"
							}`}
						>
							<Image
								src={item.icon}
								alt={item.name}
								width={18}
								height={18}
								className={
									activeTab === item.key ? "brightness-0 invert" : "opacity-60"
								}
							/>
							<span>{item.name}</span>
						</button>
					))}
				</div>

				{/* main content */}
				{activeTab === "preassign" && <PreassignTable />}
				{activeTab === "request" && <RequestTable />}
				{activeTab === "dispatch" && <DispatchTable />}
				{activeTab === "transfer" && <TransferTable />}
			</div>
		</AppLayout>
	);
}
