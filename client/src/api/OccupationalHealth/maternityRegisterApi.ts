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

export const maternityRegisterSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  employeeName: z.string(),
  age: z.string(),
  contactNumber: z.string(),
  designation: z.string(),
  department: z.string(),
  supervisorOrManager: z.string(),
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
  reJoinDate: z.date(),
  supportProvider: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
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

export async function getMaternityRegisterList() {
  const res = await axios.get("/api/benefit-request");
  return res.data;
}

export const createBenefit = async (benefit: MaternityRegister) => {
  console.log(benefit);
  const formData = new FormData();

  Object.keys(benefit).forEach((key) => {
    const value = benefit[key as keyof MaternityRegister];

    if (key === "documents" && Array.isArray(value)) {
      value.forEach((file, index) => {
        formData.append(`documents[${index}]`, file);
      });
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, JSON.stringify(item));
      });
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  const res = await axios.post("/api/benefit-request", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const updateBenefit = async (benefit: MaternityRegister) => {
  if (!benefit.id) {
    throw new Error("Patient must have an ID for an update.");
  }

  const formData = new FormData();
  Object.keys(benefit).forEach((key) => {
    const value = benefit[key as keyof MaternityRegister];

    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  try {
    const response = await axios.post(
      `/api/benefit-request/${benefit.id}/update`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating hazard risk:", error);
    throw error;
  }
};

export const deleteBenefit = async (id: string) => {
  const res = await axios.delete(`/api/benefit-request/${id}/delete`);
  return res.data;
};
