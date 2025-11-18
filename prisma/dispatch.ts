import { dispatch_dispatch_status } from "@prisma/client";

export const dispatches = [
    {
        dispatch_id: 1,
        request_id: 1,
        ambulance_id: 7,
        dispatched_on: new Date(),
        dispatch_status: dispatch_dispatch_status.dispatched,
        created_on: new Date(),
    },
];