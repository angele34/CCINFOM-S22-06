import { preassign_staff_role, preassign_assignment_status } from "@prisma/client";

export const preassignments = [
    {
        preassign_id: 1,
        staff_id: 6,
        staff_role: preassign_staff_role.paramedic,
        ambulance_id: 7,
        assignment_status: preassign_assignment_status.active,
        assigned_on: new Date(),
        updated_on: new Date(),
    }, 
];