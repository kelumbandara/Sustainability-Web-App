import { z } from "zod";

export const benefitAndEntitlementsSchema = z.object({
  id: z.string(),
  benefitType: z.string(),
  amountValue: z.string(),
  totalDaysPaid: z.string(),
  amountOfFirstInstallment: z.number().optional(),
  dateOfFirstInstallment: z.date().optional(),
  amountOfSecondInstallment: z.number().optional(),
  dateOfSecondInstallment: z.date().optional(),
  ifBenefitReceivedSomeoneElse: z.string(),
  beneficiaryName: z.string(),
  beneficiaryAddress: z.string(),
  beneficiaryTotalAmount: z.number(),
  beneficiaryDate: z.date(),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
});

export type BenefitAndEntitlements = z.infer<
  typeof benefitAndEntitlementsSchema
>;

export const medicalDocumentSchema = z.object({
  id: z.string(),
  documentType: z.string(),
  document: z.string(),
  uploadDate: z.date(),
  updatedAt: z.string().optional(),
});

export enum LeaveStatus {
  APPROVED = "Approved",
  PENDING = "Pending",
  REJECTED = "Rejected",
}

export type MedicalDocument = z.infer<typeof medicalDocumentSchema>;

export const maternityRegisterSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  name: z.string(),
  age: z.string(),
  contactNumber: z.string(),
  designation: z.string(),
  department: z.string(),
  supervisorManager: z.string(),
  dateOfJoin: z.date(),
  averageWages: z.string(),
  applicationId: z.string(),
  applicationDate: z.date(),
  expectedDeliveryDate: z.date(),
  leaveStartDate: z.date(),
  leaveEndDate: z.date(),
  actualDeliveryDate: z.date(),
  leaveStatus: z.nativeEnum(LeaveStatus),
  noticeDateAfterDelivery: z.date(),
  rejoiningDate: z.date(),
  supportProvided: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  signature: z.string(),
  remarks: z.string().optional(),
  createdDate: z.date(),
  status: z.string(),
  benefitsAndEntitlements: z.array(benefitAndEntitlementsSchema),
  medicalDocuments: z.array(medicalDocumentSchema),
  division: z.string().optional(),
});

export type MaternityRegister = z.infer<typeof maternityRegisterSchema>;
