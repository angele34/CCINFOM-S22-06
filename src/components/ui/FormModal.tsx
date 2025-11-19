"use client";

import { useState, useEffect } from "react";

interface FormField {
	name: string;
	label: string;
	type: "text" | "number" | "date" | "email" | "tel" | "select";
	required?: boolean;
	placeholder?: string;
	emptyPlaceholder?: string;
	options?: { value: string | number; label?: string }[];
	maxLength?: number;
	pattern?: string;
	transform?: "uppercase" | "lowercase" | "none";
	onChange?: (value: string) => void;
	readOnly?: boolean;
	customErrorMessages?: {
		required?: string;
		pattern?: string;
		tooLong?: string;
	};
}

interface FormModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (formData: Record<string, string>) => void;
	title: string;
	fields: FormField[];
	submitLabel?: string;
	initialData?: Record<string, string>;
}

export default function FormModal({
	isOpen,
	onClose,
	onSubmit,
	title,
	fields,
	submitLabel = "Submit",
	initialData,
}: FormModalProps) {
	const [formValues, setFormValues] = useState<Record<string, string>>({});

	useEffect(() => {
		if (isOpen && initialData) {
			setFormValues(initialData);
		} else if (!isOpen) {
			setFormValues({});
		}
	}, [initialData, isOpen]);

	if (!isOpen) return null;

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit(formValues);
	};

	const handleFieldChange = (fieldName: string, value: string) => {
		setFormValues((prev) => ({ ...prev, [fieldName]: value }));
	};

	return (
		<div
			className="fixed inset-0 flex items-center justify-center z-50 p-4"
			style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
		>
			<div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
				<div className="p-6">
					<h3 className="text-2xl font-bold text-gray-800 mb-6">{title}</h3>
					<form onSubmit={handleSubmit} className="space-y-5">
						{fields.map((field) => (
							<div key={field.name}>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									{field.label}
									{field.required && (
										<span className="text-red-500 ml-1">*</span>
									)}
								</label>

								{field.type === "select" ? (
									field.readOnly ? (
										<input
											type="text"
											name={field.name}
											value={
												formValues[field.name]
													? field.options?.find(
															(opt) =>
																String(opt.value) === formValues[field.name]
													  )?.label ??
													  field.options?.find(
															(opt) =>
																String(opt.value) === formValues[field.name]
													  )?.value ??
													  ""
													: ""
											}
											readOnly
											placeholder={field.emptyPlaceholder ?? "Auto-filled"}
											className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 cursor-not-allowed"
										/>
									) : (
										<div className="relative">
											<select
												name={field.name}
												required={field.required}
												value={formValues[field.name] ?? ""}
												onChange={(e) => {
													const target = e.target as HTMLInputElement;
													handleFieldChange(field.name, target.value); 
												}}
												className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white ${
													formValues[field.name]
														? "text-gray-900"
														: "text-gray-400"
												}`}
												style={{
													backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
													backgroundPosition: "right 0.5rem center",
													backgroundRepeat: "no-repeat",
													backgroundSize: "1.5em 1.5em",
													paddingRight: "2.5rem",
												}}
											>
												<option value="" className="text-gray-400">
													{field.emptyPlaceholder ?? "-- Select --"}
												</option>
												{field.options?.map((opt) => (
													<option
														key={opt.value}
														value={opt.value}
														className="text-gray-900"
													>
														{opt.label ?? opt.value}
													</option>
												))}
											</select>
										</div>
									)
								) : (
									<input
										type={field.type === "date" ? "text" : field.type}
										name={field.name}
										required={field.required}
										value={formValues[field.name] ?? ""}
										onChange={(e) => {
											handleFieldChange(field.name, e.target.value);
										}}
										inputMode={field.type === "number" ? "numeric" : undefined}
										title={
											field.type === "number"
												? "Please enter numbers only"
												: field.customErrorMessages?.pattern ?? undefined
										}
										pattern={
											field.pattern ??
											(field.type === "number" ? "[0-9]*" : undefined)
										}
										maxLength={field.maxLength}
										placeholder={
											field.type === "date" ? "YYYY-MM-DD" : field.placeholder
										}
										className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 placeholder-gray-400"
										onInput={(e) => {
											const input = e.target as HTMLInputElement;
											if (field.transform === "uppercase")
												input.value = input.value.toUpperCase();
											if (field.transform === "lowercase")
												input.value = input.value.toLowerCase();
											if (typeof field.maxLength === "number") {
												input.value = input.value.slice(0, field.maxLength);
											}
										}}
										onInvalid={(e) => {
											const target = e.target as HTMLInputElement;
											if (
												field.type === "number" &&
												target.value &&
												isNaN(Number(target.value))
											) {
												target.setCustomValidity(
													field.customErrorMessages?.pattern ??
														"Please enter numbers only"
												);
												return;
											}
											if (
												field.maxLength &&
												target.value &&
												target.value.length > field.maxLength
											) {
												target.setCustomValidity(
													field.customErrorMessages?.tooLong ??
														`Maximum length is ${field.maxLength}`
												);
												return;
											}
											if (field.pattern && target.value) {
												target.setCustomValidity(
													field.customErrorMessages?.pattern ?? "Invalid format"
												);
												return;
											}
											if (field.required && !target.value) {
												target.setCustomValidity(
													field.customErrorMessages?.required ??
														"This field is required"
												);
												return;
											}
										}}
								
									/>
								)}
							</div>
						))}

						<div className="flex gap-3 pt-4">
							<button
								type="button"
								onClick={onClose}
								className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
							>
								{submitLabel}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
