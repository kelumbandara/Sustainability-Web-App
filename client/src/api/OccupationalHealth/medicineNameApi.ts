import { z } from "zod";
import axios from "axios";

export const medicineSchema = z.object({
  id: z.string(),
  medicineName: z.string(),
  genericName: z.string(),
  dosageStrength: z.string(),
  form: z.string(),
  medicineType: z.string(),
});

export type Medicine = z.infer<typeof medicineSchema>;

export async function fetchMedicineList() {
  const res = await axios.get("/api/medicine-name");
  return res.data;
}

export async function createMedicineName(medicine: Medicine) {
  const res = await axios.post("/api/medicine-name", medicine);
  return res.data;
}