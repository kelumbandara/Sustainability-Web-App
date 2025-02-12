import axios from "axios";
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

export const MaternityRegisterSchema = z.object({
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

export type MaternityRegister = z.infer<typeof MaternityRegisterSchema>;

export async function getMaternityRegistersList() {
  const res = await axios.get("/api/maternity-registers");
  return res.data;
}

export const createMaternityRegister = async (
  maternityRegister: MaternityRegister
) => {
  const formData = new FormData();

  // Append each property of the maternity Register object to the form data
  Object.keys(maternityRegister).forEach((key) => {
    const value = maternityRegister[key as keyof typeof maternityRegister];
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

  const res = await axios.post("/api/maternity-registers", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const updateMaternityRegister = async (
  maternityRegister: MaternityRegister
) => {
  const formData = new FormData();

  // Append each property of the maternity Register object to the form data
  Object.keys(maternityRegister).forEach((key) => {
    const value = maternityRegister[key as keyof typeof maternityRegister];
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
    `/api/maternity-registers/${maternityRegister.id}/update`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const deleteMaternityRegister = async (id: string) => {
  const res = await axios.delete(`/api/maternity-registers/${id}/delete`);
  return res.data;
};
