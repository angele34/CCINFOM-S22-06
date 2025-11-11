"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("submit");

		const form = e.currentTarget;
		const data = new FormData(form);
		const body = {
			username: String(data.get("username") ?? ""),
			password: String(data.get("password") ?? ""),
		};

		try {
			const res = await fetch("/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			const json = await res.json();
			if (json.success) {
				router.push("/dashboard"); // redirect to dashboard
			} else {
				alert(json.message || "Login failed");
			}
		} catch (err) {
			console.error(err);
			alert("Network error");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#2882FF] to-[#00BBA8] p-6">
			<div className="w-full max-w-5xl bg-white/0 md:bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
				{/* left side */}
				<div className="md:flex-1 bg-gradient-to-br from-[#0865F5] to-[#00BBA8] p-12 flex items-center justify-center text-white">
					<div className="max-w-xs text-center md:text-left">
						<h2 className="text-2xl font-semibold mb-4">
							placeholder for primecare{" "}
						</h2>
					</div>
				</div>

				{/* right side */}
				<div className="md:w-[420px] w-full bg-white p-8 md:p-10 flex flex-col justify-center">
					<div className="mb-6">
						<div className="text-s uppercase text-[#333333] mb-1">
							Welcome back
						</div>
						<h3 className="text-2xl text-black font-semibold">
							Log In to your Account
						</h3>
					</div>

					<form className="space-y-4" action="#" onSubmit={handleSubmit}>
						<label className="block text-sm text-black">
							<span className="text-xs text-[#333333]">Username</span>
							<input
								name="username"
								className="mt-1 block w-full rounded-lg border border-[#333333] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2882FF]"
								placeholder="JuanDelaCruz"
								required
							/>
						</label>

						<label className="block text-sm text-[#333333]">
							<span className="text-xs text-[#333333]">Password</span>
							<input
								name="password"
								type="password"
								className="mt-1 block w-full rounded-lg border border-[#333333] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2882FF]"
								placeholder="••••••••••"
								required
							/>
						</label>

						<div className="flex items-center justify-between text-sm text-[#333333]">
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									className="w-4 h-4 rounded border-[#333333]"
								/>
								<span>Remember me</span>
							</label>
							<a className="text-blue-600 hover:underline" href="#">
								Forgot Password?
							</a>
						</div>

						<button
							type="submit"
							className="w-full mt-2 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#1E74FF] to-[#0a9f9a] hover:opacity-95 transition"
						>
							CONTINUE
						</button>

						<div className="text-center text-sm text-gray-500">
							New User?{" "}
							<a className="text-blue-600 hover:underline" href="#">
								Sign up
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
