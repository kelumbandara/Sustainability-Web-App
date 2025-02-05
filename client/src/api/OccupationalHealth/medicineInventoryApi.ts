import axios from "axios";
import { z } from "zod";

export const MedicalDisposalSchema = z.object({
  id: z.number(),
  disposal_date: z.string(),
  availability_quantity: z.number(),
  disposed_quantity: z.number(),
  contractor: z.string(),
  cost: z.string(),
  balance_quantity: z.number(),
});

export const MedicineInventorySchema = z.object({
  id: z.string(),
  medicine_name: z.string(),
  generic_name: z.string(),
  division: z.string(),
  dosage_strength: z.string().nullable(),
  expiry_date: z.date().nullable(),
  form: z.string().nullable(),
  manufacturer_name: z.string().nullable(),
  supplier_name: z.string().nullable(),
  supplier_contact_number: z.string().nullable(),
  supplier_email_id: z.string().email().nullable(),
  supplier_type: z.string().nullable(),
  location: z.string().nullable(),
  manufacturing_date: z.date().nullable(),
  delivery_date: z.date().nullable(),
  delivered_unit: z.string().nullable(),
  purchased_amount: z.string().nullable(),
  threshold_limit: z.string().nullable(),
  invoice_date: z.date().nullable(),
  invoice_reference: z.string().nullable(),
  batch_number: z.string().nullable(),
  unit_cost: z.string().nullable(),
  reorder_threshold: z.string().nullable(),
  usage_instructions: z.string().nullable(),
  delivered_quantity: z.string().nullable(),
  issued_quantity: z.string().nullable(),
  disposed_of_quantity: z.string().nullable(),
  balance_quantity: z.string().nullable(),
  approver_remarks: z.string(),
  reference_number: z.string(),
  request_date: z.string(),
  status: z.string(),
  requested_quantity: z.number(),
  medicine_uuid: z.string(),
  purchase_notification: z.boolean(),
  requested_by: z.string(),
  approved_by: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  medicine_type: z.string().nullable(),
  approver: z.string().nullable(),
  reporter: z.string().nullable(),
  medicine_disposals: z.array(MedicalDisposalSchema).nullable(),
  business_unit: z.string().nullable(),
});

export type MedicineInventory = z.infer<typeof MedicineInventorySchema>;

export async function getMedicineInventoriesList() {
  const res = await axios.get("/api/medicine-inventories");
  return res.data;
}

export const createMedicineInventory = async (
  medicineInventory: MedicineInventory
) => {
  const formData = new FormData();

  // Append each property of the maternity Register object to the form data
  Object.keys(medicineInventory).forEach((key) => {
    const value = medicineInventory[key as keyof typeof medicineInventory];
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, JSON.stringify(item));
      });
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  const res = await axios.post("/api/medicine-inventories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const updateMedicineInventory = async (
  medicineInventory: MedicineInventory
) => {
  const formData = new FormData();

  // Append each property of the maternity Register object to the form data
  Object.keys(medicineInventory).forEach((key) => {
    const value = medicineInventory[key as keyof typeof medicineInventory];
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, JSON.stringify(item));
      });
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  const res = await axios.put(
    `/api/medicine-inventories/${medicineInventory.id}/update`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const deleteMedicineInventory = async (id: string) => {
  const res = await axios.delete(`/api/medicine-inventories/${id}/delete`);
  return res.data;
};
