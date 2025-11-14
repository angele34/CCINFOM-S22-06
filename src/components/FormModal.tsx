"use client";

interface FormField {
	name: string;
	label: string;
	type: "text" | "number" | "date" | "email" | "tel";
	required?: boolean;
	placeholder?: string;
}

interface FormModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (formData: Record<string, string>) => void;
	title: string;
	fields: FormField[];
	submitLabel?: string;
}

export default function FormModal({
	isOpen,
	onClose,
	onSubmit,
	title,
	fields,
	submitLabel = "Submit",
}: FormModalProps) {
	if (!isOpen) return null;

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const formData: Record<string, string> = {};

		fields.forEach((field) => {
			const input = form.elements.namedItem(field.name) as HTMLInputElement;
			formData[field.name] = input.value;
		});

		onSubmit(formData);
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
								<input
									type={field.type === "date" ? "text" : field.type}
									name={field.name}
									required={field.required}
									inputMode={field.type === "number" ? "numeric" : undefined}
									title={
										field.type === "number"
											? "Please enter numbers only"
											: undefined
									}
									pattern={field.type === "number" ? "[0-9]*" : undefined}
									placeholder={
										field.type === "date" ? "YYYY-MM-DD" : field.placeholder
									}
									className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 placeholder-gray-400 invalid:border-red-500 invalid:ring-red-500"
									onInvalid={(e) => {
										if (
											field.type === "number" &&
											(e.target as HTMLInputElement).value &&
											isNaN(Number((e.target as HTMLInputElement).value))
										) {
											(e.target as HTMLInputElement).setCustomValidity(
												"Please enter numbers only"
											);
										}
									}}
									onChange={(e) => {
										(e.target as HTMLInputElement).setCustomValidity("");
									}}
								/>
							</div>
						))}
						<div className="flex gap-3 pt-4">
							<button
								type="button"
								onClick={onClose}
								className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
							>
								Discard
							</button>
							<button
								type="submit"
								className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
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
