
import { ambulances } from './ambulances';
import { hospitals } from './hospitals';
import { patients } from './patients';
import { reference_locations } from './reference_locations';
import { staffs } from './staffs';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    // Delete in dependency order: children first to avoid FK constraint errors
    await prisma.transfer.deleteMany({});
    await prisma.dispatch.deleteMany({});
    await prisma.request.deleteMany({});
    await prisma.preassign.deleteMany({});
    await prisma.patient.deleteMany({});
    await prisma.ambulance.deleteMany({});
    await prisma.staff.deleteMany({});
    await prisma.hospital.deleteMany({});
    await prisma.reference_location.deleteMany({});

    for (const ref of reference_locations) {
        await prisma.reference_location.create({ data: ref });
    }

    for (const hospital of hospitals) {
        await prisma.hospital.create({ data: hospital });
    }

    for (const patient of patients) {
        await prisma.patient.create({ data: patient });
    }

    for (const ambulance of ambulances) {
        await prisma.ambulance.create({ data: ambulance });
    }

    for (const staff of staffs) {
        await prisma.staff.create({ data: staff });
    }
}



main().catch(e => {
    console.log(e);
    process.exit(1);
}).finally(() => {
    prisma.$disconnect();
})