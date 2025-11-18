import { transfer_transfer_status, transfer_priority_level } from "@prisma/client";


transfer_id	patient_id	ambulance_id	staff_id	hospital_id	priority_level	transfer_status
1	4	7	6	2	Critical	Transferred

const transfers = [
    {
        transfer_id: 1,
        patient_id: 4,
        ambulance_id: 7,
        staff_id: 6,
        hospital_id: 2,
        priority_level: transfer_priority_level.critical,
        transfer_status: transfer_transfer_status.transferred,
    },
];