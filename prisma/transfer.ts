import {
	transfer_transfer_status,
	transfer_priority_level,
} from "@prisma/client";

export const transfers = [
	{
		transfer_id: 1,
		patient_id: 4,
		ambulance_id: 7,
		staff_id: 6,
		hospital_id: 2,
		transferred_on: new Date(),
		priority_level: transfer_priority_level.critical,
		transfer_status: transfer_transfer_status.transferred,
		updated_on: new Date(),
	},
];
