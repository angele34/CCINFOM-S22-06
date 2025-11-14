// pang detect ng primary key duplicate errors

// checks if an error is a duplicate primary key error
export function isDuplicateKeyError(error: unknown): boolean {
	const errorString = String(error);
	return (
		errorString.includes("Unique constraint failed") &&
		errorString.includes("PRIMARY")
	);
}

// shows a popup notification about duplicate ID and prompts user action
export function showDuplicateAlert(
	fieldName: string,
	currentId: number,
	newId: number
): boolean {
	const message = `The ${fieldName} "${currentId}" already exists in the database.\n\nWould you like to use the suggested ID "${newId}" instead?\n\nClick OK to proceed with ID "${newId}", or Cancel to try a different ID.`;

	return window.confirm(message);
}

// generates the next unique id by finding the max existing id tapos mag iincrement
export function generateNextUniqueId(existingIds: number[]): number {
	if (existingIds.length === 0) return 1;
	const maxId = Math.max(...existingIds);
	return maxId + 1;
}

// extract id from the existing data
export function extractExistingIds(
	data: Record<string, unknown>[],
	idFieldName: string
): number[] {
	return data
		.map((item) => {
			const id = item[idFieldName];
			return typeof id === "number" ? id : 0;
		})
		.filter((id) => id !== 0)
		.sort((a, b) => a - b);
}
