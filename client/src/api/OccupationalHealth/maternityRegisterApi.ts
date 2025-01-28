import { z } from "zod";

export const BenefitAndEntitlementsSchema = z.object({
  id: z.string(),
  benefit_type: z.string(),
  amount_value: z.string(),
  total_days_paid: z.string(),
  amount_of_first_installment: z.number().optional(),
  date_of_first_installment: z.date().optional(),
  amount_of_second_installment: z.number().optional(),
  date_of_second_installment: z.date().optional(),
  if_benefit_received_someone_else: z.string(),
  beneficiary_name: z.string(),
  beneficiary_address: z.string(),
  beneficiary_total_amount: z.number(),
  beneficiary_date: z.date(),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
});

export type BenefitAndEntitlements = z.infer<
  typeof BenefitAndEntitlementsSchema
>;

export const MedicalDocumentSchema = z.object({
  id: z.string(),
  document_type: z.string(),
  document: z.string(),
  upload_date: z.date(),
  updatedAt: z.string().optional(),
});

export enum LeaveStatus {
  APPROVED = "Approved",
  PENDING = "Pending",
  REJECTED = "Rejected",
}

export type MedicalDocument = z.infer<typeof MedicalDocumentSchema>;

export const MaternityRegisterSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  name: z.string(),
  age: z.string(),
  contact_number: z.string(),
  designation: z.string(),
  department: z.string(),
  supervisor_manager: z.string(),
  date_of_join: z.date(),
  average_wages: z.string(),
  application_id: z.string(),
  application_date: z.date(),
  expected_delivery_date: z.date(),
  leave_start_date: z.date(),
  leave_end_date: z.date(),
  actual_delivery_date: z.date(),
  leave_status: z.nativeEnum(LeaveStatus),
  notice_date_after_delivery: z.date(),
  rejoining_date: z.date(),
  support_provided: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  signature: z.string(),
  remarks: z.string().optional(),
  created_date: z.date(),
  status: z.string(),
  benefits_and_entitlements: z.array(BenefitAndEntitlementsSchema),
  medical_documents: z.array(MedicalDocumentSchema),
  division: z.string().optional(),
});

export type MaternityRegister = z.infer<typeof MaternityRegisterSchema>;
