import { MedicineRequest } from "../medicineRequestApi";

export const sampleMedicines = [
  { "id": "1", "medicineName": "Biogesic" },
  { "id": "2", "medicineName": "Neozep" },
  { "id": "3", "medicineName": "Solmux" },
  { "id": "4", "medicineName": "Alaxan" },
  { "id": "5", "medicineName": "Bioflu" },
  { "id": "6", "medicineName": "Dolfenal" },
  { "id": "7", "medicineName": "Decolgen" }
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
