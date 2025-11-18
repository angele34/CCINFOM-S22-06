import "./globals.css";
import type { Metadata } from "next";
import { Zen_Kaku_Gothic_Antique } from "next/font/google";

const zen = Zen_Kaku_Gothic_Antique({
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "700"],
});

export const metadata: Metadata = {
	title: {
		default: "PrimeCare",
		template: "%s | PrimeCare",
	},
	description: "PrimeCare General Hospital Ambulance Management System",
	icons: {
		icon: "/logos/tab_logo.svg",
		shortcut: "/logos/tab_logo.svg",
		apple: "/logos/tab_logo.svg",
	},
};
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={zen.className}>
			<body>{children}</body>
		</html>
	);
}
