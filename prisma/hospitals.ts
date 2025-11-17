import { hospital_city } from "@prisma/client";

export const hospitals = [
  {
    hospital_id: 1,
    hospital_name: 'PrimeCare General Hospital QC',
    city: hospital_city.Quezon_City,
    street: '12 Kalayaan Ave',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    hospital_id: 2,
    hospital_name: 'PrimeCare General Hospital Manila',
    city: hospital_city.Manila_City,
    street: '72 España Blvd',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    hospital_id: 3,
    hospital_name: 'PrimeCare General Hospital Muntinlupa',
    city: hospital_city.Muntinlupa_City,
    street: '43 Alabang Rd',
    created_at: new Date(),
    updated_at: new Date(),
  },
];
