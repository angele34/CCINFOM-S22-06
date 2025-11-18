import { request_priority_level, request_request_status} from "@prisma/client";

export const requests = [
    {
        request_id: 1,
        patient_id: 4,
        ref_location_id: 4,
        priority_level: request_priority_level.critical,
        request_status: request_request_status.accepted,
        requested_on: new Date(),
        updated_on: new Date(),
    },
];