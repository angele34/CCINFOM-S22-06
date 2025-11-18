"use client";
import { useState } from "react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import ModeToggle from "../../components/ui/ModeToggle";
import Image from "next/image";
import PreassignTable, {
	type PreassignTransaction,
} from "../../components/transactions/PreassignTable";
import RequestTable, {
	type RequestTransaction,
} from "../../components/transactions/RequestTable";
import DispatchTable, {
	type DispatchTransaction,
} from "../../components/transactions/DispatchTable";
import TransferTable, {
	type TransferTransaction,
} from "../../components/transactions/TransferTable";

type TransactionTab = "preassign" | "request" | "dispatch" | "transfer";

export default function TransactionsPage() {
	const [activeTab, setActiveTab] = useState<TransactionTab>("preassign");

	// mock data
	const preassignData: PreassignTransaction[] = [];
	const requestData: RequestTransaction[] = [];
	const dispatchData: DispatchTransaction[] = [];
	const transferData: TransferTransaction[] = [];

	const tabs: { key: TransactionTab; name: string; icon: string }[] = [
		{ key: "preassign", name: "Pre-assign", icon: "/icons/ambulance.svg" },
		{ key: "request", name: "Request", icon: "/icons/patients.svg" },
		{ key: "dispatch", name: "Dispatch", icon: "/icons/location.svg" },
		{ key: "transfer", name: "Transfer", icon: "/icons/staff.svg" },
	];

	return (
		<div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
			<Header />
			<ModeToggle activeMode={"Transactions"} />

			{/* Tab buttons */}
			<div className="flex justify-center gap-4 mb-6 px-6">
				{tabs.map((item) => (
					<button
						key={item.key}
						onClick={() => setActiveTab(item.key)}
						className={`flex flex-col items-center justify-center gap-2 px-6 py-4 rounded-2xl transition font-semibold min-w-[120px] ${
							activeTab === item.key
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
									activeTab === item.key ? "brightness-0 invert" : "opacity-70"
								}`}
							/>
						</div>
						<span className="text-sm">{item.name}</span>
					</button>
				))}
			</div>

			{/* Table container */}
			<div className="flex-1 overflow-hidden pb-6">
				{activeTab === "preassign" && <PreassignTable data={preassignData} />}
				{activeTab === "request" && <RequestTable data={requestData} />}
				{activeTab === "dispatch" && <DispatchTable data={dispatchData} />}
				{activeTab === "transfer" && <TransferTable data={transferData} />}
			</div>

			<Footer />
		</div>
	);
}
