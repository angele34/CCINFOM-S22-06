"use client";
import React from "react";
import Image from "next/image";
import Aurora from "../../components/Aurora";
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
				router.push("/dashboard");
			} else {
				alert(json.message || "Login failed");
			}
		} catch (err) {
			console.error(err);
			alert("Network error");
		}
	};

	return (
		<div className="relative min-h-screen overflow-hidden">
			<div className="absolute inset-0 -z-20">
				<Aurora
					colorStops={["#32a88d", "#009387", "#32a87d"]}
					blend={0.5}
					amplitude={1.0}
					speed={0.5}
				/>
			</div>

			<div className="min-h-screen flex items-center justify-center">
				<div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
					{/* LEFT SIDE */}
					<div className="w-full md:w-1/2 bg-linear-to-br from-cyan-600 via-teal-600 to-teal-700 p-12 flex flex-col justify-center">
						<div className="text-white">
							<div className="text-lg font text-teal-100 uppercase mb-2">
								WELCOME BACK
							</div>
							<h3 className="text-3xl font-bold mb-2">
								Sign in to your account
							</h3>

							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label className="block text-sm mb-1">Username</label>
									<input
										name="username"
										type="text"
										placeholder="Enter Username"
										className="w-full bg-white/10 border-0 rounded-lg px-4 py-3 placeholder-white/70"
										required
									/>
								</div>

								<div>
									<label className="block text-sm mb-1">Password</label>
									<input
										name="password"
										type="password"
										placeholder="••••••••••"
										className="w-full bg-white/10 border-0 rounded-lg px-4 py-3 placeholder-white/70"
										required
									/>
								</div>

								<div className="flex items-center justify-between text-sm mt-1">
									<label className="flex items-center gap-2 text-sm">
										<input
											type="checkbox"
											className="w-4 h-4 rounded border-white/40"
										/>
										<span>Remember me</span>
									</label>
									<a
										href="#"
										className="text-white/80 hover:text-white transition"
									>
										Forgot your password?
									</a>
								</div>

								<button
									type="submit"
									className="w-full bg-gradient-to-r from-cyan-500 via-teal-500 to-teal-600 text-white shadow-lg rounded-lg py-3 mt-3 hover:opacity-90 transition"
								>
									Log In
								</button>

								<div className="text-center text-white/80 text-sm">
									New User?{" "}
									<a href="#" className="text-white underline">
										Sign up
									</a>
								</div>
							</form>
						</div>
					</div>

					{/* RIGHT SIDE */}
					<div className="w-full md:w-1/2 bg-white p-12 flex flex-col justify-center items-center relative overflow-hidden">
						<div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600"></div>
						<div className="absolute top-20 right-20 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500"></div>
						<div className="absolute bottom-20 left-8 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-teal-700"></div>
						<div className="absolute top-32 left-16 w-6 h-6 rounded-full bg-teal-600"></div>
						<div className="absolute bottom-25 right-12 w-10 h-10 rounded-full bg-cyan-800"></div>
						<div className="absolute top-1/4 right-0 w-32 h-32 border-8 border-teal-500 rounded-full translate-x-1/2"></div>
						<div className="absolute bottom-1/4 left-0 w-40 h-40 border-8 border-cyan-400 rounded-full -translate-x-1/2"></div>

						<div className="relative z-10 text-center">
							<div className="relative inline-block">
								<Image
									src="/logos/login_logo2.svg"
									alt="PrimeCare Login"
									width={360}
									height={50}
									priority
								/>
								<p className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-gray-700 italic text-sm rounded whitespace-nowrap bg-white/80 px-3">
									Precision in care. Speed when it matters
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
