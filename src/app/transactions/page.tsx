"use client";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ModeToggle from "../../components/ModeToggle";
import Image from "next/image";

export default function TransactionsPage() {
    const [activeTab, setActiveTab] = useState("Pre-Assign");

    const tabs = [
        { name: "Pre-Assign", icon: "/icons/ambulance.svg" },
        { name: "Request", icon: "/icons/patients.svg" },
        { name: "Dispatch", icon: "/icons/location.svg" },
        { name: "Transfer", icon: "/icons/staff.svg" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            {/* tabs */}
            <ModeToggle activeMode={"Transactions"} />
            {/* database buttons */}
            <div className="flex justify-center gap-4 mb-8 px-6">
                {tabs.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => setActiveTab(item.name)}
                        className={`flex flex-col items-center justify-center gap-2 px-6 py-4 rounded-2xl transition font-semibold min-w-[120px] ${
                            activeTab === item.name
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
                                    activeTab === item.name ? "brightness-0 invert" : "opacity-70"
                                }`}
                            />
                        </div>
                        <span className="text-sm">{item.name}</span>
                    </button>
                ))}
            </div>

            {/* table container */}
            

            <Footer />
        </div>
    );
}
