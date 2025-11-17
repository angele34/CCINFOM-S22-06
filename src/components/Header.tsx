import Link from "next/link";

export default function Header() {
	return (
		<header className="bg-gradient-to-l from-teal-500 to-teal-600 text-white shadow-lg py-4 px-6 flex items-center justify-between">
			<div className="flex items-center gap-3">
				<div className="text-2xl">🚑</div>
				<h1 className="text-lg font-semibold">
					Primecare General Hospital Management System
				</h1>
			</div>
			<Link
				href="/login"
				className="px-4 py-2 bg-white text-teal-700 rounded-lg font-medium hover:bg-gray-100 transition"
			>
				↪ Logout
			</Link>
		</header>
	);
}
