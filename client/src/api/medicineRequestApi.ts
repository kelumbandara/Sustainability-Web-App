import { z } from "zod";

export const MedicineRequestSchema = z.object({
  id: z.string(),
  approver: z.string(),
  approver_remarks: z.string(),
  created_at: z.string(),
  division: z.string(),
  generic_name: z.string(),
  medicine_name: z.string(),
  medicine_id: z.string(),
  published_at: z.string(),
  reference_number: z.string(),
  request_date: z.string(),
  requested_quantity: z.string(),
  status: z.string(),
  updatedAt: z.string().optional(),
});

export type MedicineRequest = z.infer<typeof MedicineRequestSchema>;
