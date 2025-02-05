import axios from "axios";
import { z } from "zod";

export const MedicineRequestSchema = z.object({
  id: z.string(),
  approver: z.string(),
  approver_remarks: z.string(),
  created_at: z.date(),
  division: z.string(),
  generic_name: z.string(),
  medicine_name: z.string(),
  medicine_id: z.string(),
  published_at: z.date(),
  reference_number: z.string(),
  request_date: z.date(),
  requested_quantity: z.string(),
  status: z.string(),
  updatedAt: z.string().optional(),
});

export type MedicineRequest = z.infer<typeof MedicineRequestSchema>;

export async function getMedicineRequestsList() {
  const res = await axios.get("/api/medicine-requests");
  return res.data;
}

export const createMedicineRequest = async (
  medicineRequest: MedicineRequest
) => {
  const formData = new FormData();

  // Append each property of the maternity Register object to the form data
  Object.keys(medicineRequest).forEach((key) => {
    const value = medicineRequest[key as keyof typeof medicineRequest];
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

  const res = await axios.post("/api/medicine-requests", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const updateMedicineRequest = async (
  medicineRequest: MedicineRequest
) => {
  const formData = new FormData();

  // Append each property of the maternity Register object to the form data
  Object.keys(medicineRequest).forEach((key) => {
    const value = medicineRequest[key as keyof typeof medicineRequest];
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
    `/api/medicine-requests/${medicineRequest.id}/update`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const deleteMedicineRequest = async (id: string) => {
  const res = await axios.delete(`/api/medicine-requests/${id}/delete`);
  return res.data;
};
