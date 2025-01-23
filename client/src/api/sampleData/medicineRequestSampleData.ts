import { MedicineRequest } from "../medicineRequestApi";

export const sampleMedicines = [
  "Biogesic",
  "Neozep",
  "Solmux",
  "Alaxan",
  "Bioflu",
  "Dolfenal",
  "Decolgen",
];

export const medicineRequestSampleData: MedicineRequest[] = [
  {
    id: "1",
    approver: "Dr. John Doe",
    approver_remarks: "Approved",
    created_at: "2021-10-01",
    division: "Pharmacy",
    generic_name: "Paracetamol",
    medicine_name: "Biogesic",
    medicine_id: "1",
    published_at: "2021-10-01",
    reference_number: "123456",
    request_date: "2021-10-01",
    requested_quantity: "10",
    status: "Approved",
    updatedAt: "2021-10-01",
  },
  {
    id: "2",
    approver: "Dr. John Doe",
    approver_remarks: "Approved",
    created_at: "2021-10-01",
    division: "Pharmacy",
    generic_name: "Paracetamol",
    medicine_name: "Biogesic",
    medicine_id: "1",
    published_at: "2021-10-01",
    reference_number: "123456",
    request_date: "2021-10-01",
    requested_quantity: "10",
    status: "Approved",
    updatedAt: "2021-10-01",
  },
];
