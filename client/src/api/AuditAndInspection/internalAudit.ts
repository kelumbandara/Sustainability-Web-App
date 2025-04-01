import { z } from "zod";
import { userSchema } from "../userApi";
import axios from "axios";

export enum InternalAuditType {
  SUPPLY_CHAIN = "Supply Chain",
  COMPANY = "Company",
}

export enum SupplierType {
  TIER_1 = "Tier-1",
  TIER_2 = "Tier-2",
  TIER_3 = "Tier-3",
}

export enum ScheduledInternalAuditStatus {
  DRAFT = "Draft",
  SCHEDULED = "Scheduled",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}

export enum QuestionColorCodes {
  GREEN = "green",
  YELLOW = "yellow",
  RED = "red",
  BLUE = "blue",
  ORANGE = "orange",
  PURPLE = "purple",
  BLACK = "black",
}

export enum InternalAuditRating {
  EXCELLENT = "Excellent",
  GOOD = "Good",
  SATISFACTORY = "Satisfactory",
  UNSATISFACTORY = "Unsatisfactory",
}

export enum InternalAuditQuestionAnswersStatus {
  YES = "Yes",
  PARTIAL_YES = "Partial Yes",
  PARTIAL_NO = "Partial No",
  NO = "No",
  NA = "N/A",
}

export enum InternalAuditQuestionAnswerRating {
  COMPILED = "Compiled",
  MODERATE = "Moderate",
  HIGH = "High",
  CRITICAL = "Critical",
}

export const InternalAuditQuestionSchema = z.object({
  id: z.string().optional(),
  question: z.string(),
  colorCode: z.string(),
  allocatedScore: z.number(),
});

export type InternalAuditQuestion = z.infer<typeof InternalAuditQuestionSchema>;

export const InternalAuditQuestionGroupSchema = z.object({
  id: z.string().optional(),
  auditId: z.string().optional(),
  name: z.string(),
  questions: z.array(InternalAuditQuestionSchema),
});

export type InternalAuditQuestionGroup = z.infer<
  typeof InternalAuditQuestionGroupSchema
>;

export const InternalAuditSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  questionGroups: z.array(InternalAuditQuestionGroupSchema),
  totalNumberOfQuestions: z.number(),
  achievableScore: z.number(),
  createdAt: z.date(),
  createdBy: userSchema,
});

export type InternalAudit = z.infer<typeof InternalAuditSchema>;

export const FactorySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  factoryAddress: z.string(),
  contactNumber: z.string(),
  designation: z.string(),
  factoryContactPerson: userSchema,
  factoryContactPersonId: z.string(),
});

export type Factory = z.infer<typeof FactorySchema>;

export const auditeeSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
});

export type Auditee = z.infer<typeof auditeeSchema>;

export const InternalAuditAnswerToQuestionsSchema = z.object({
  id: z.string().optional(),
  questionId: z.string().optional(),
  score: z.number(),
  status: z.nativeEnum(InternalAuditQuestionAnswersStatus).optional(),
  rating: z.nativeEnum(InternalAuditQuestionAnswerRating).optional(),
});

export const ScheduledInternalAuditQuestionGroupAnswersSchema = z.object({
  id: z.string().optional(),
  auditId: z.string().optional(),
  questionGroupId: z.string().optional(),
  answers: z.array(InternalAuditAnswerToQuestionsSchema).optional(),
});

export type ScheduledInternalAuditQuestionAnswers = z.infer<
  typeof ScheduledInternalAuditQuestionGroupAnswersSchema
>;

export const ScheduledInternalAuditSchema = z.object({
  id: z.string().optional(),
  auditDate: z.date(),
  division: z.string(),
  department: z.array(z.string()),
  audit: InternalAuditSchema,
  auditId: z.string(),
  auditType: z.nativeEnum(InternalAuditType),
  answeredQuestionCount: z.number().optional(),
  earnedScore: z.number().optional(),
  earnedScorePercentage: z.number().optional(),
  auditAnswers: z
    .array(ScheduledInternalAuditQuestionGroupAnswersSchema)
    .optional(),
  rating: z.nativeEnum(InternalAuditRating).optional(),
  isAuditScheduledForSupplier: z.boolean(),
  factoryName: z.string(),
  factory: FactorySchema,
  factoryId: z.string(),
  factoryEmail: z.string(),
  factoryContactNumber: z.string(),
  supplierType: z.nativeEnum(SupplierType).optional(),
  factoryLicenseNo: z.string().optional(),
  higgId: z.string().optional(),
  zdhcId: z.string().optional(),
  processType: z.string().optional(),
  description: z.string().optional(),
  auditee: auditeeSchema.optional(),
  auditeeId: z.string().optional(),
  approver: userSchema,
  approverId: z.string(),
  dateForApproval: z.date(),
  status: z.nativeEnum(ScheduledInternalAuditStatus).optional(),
  createdAt: z.date(),
  createdBy: userSchema,
  auditStatus: z.string().optional(),
});

export type ScheduledInternalAudit = z.infer<
  typeof ScheduledInternalAuditSchema
>;

export const createInternalAudit = async (
  internalAuditRequest: Partial<ScheduledInternalAudit>
) => {
  const formData = new FormData();

  Object.keys(internalAuditRequest).forEach((key) => {
    const value = internalAuditRequest[key as keyof ScheduledInternalAudit];

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, JSON.stringify(item));
      });
    } else if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  const res = await axios.post("/api/internal-audit", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export async function getInternalAuditList() {
  const res = await axios.get("/api/internal-audit");
  return res.data;
}

export const updateInternalAudit = async (
  internalAuditRequest: Partial<ScheduledInternalAudit>
) => {
  const formData = new FormData();

  Object.keys(internalAuditRequest).forEach((key) => {
    const value = internalAuditRequest[key as keyof ScheduledInternalAudit];

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, JSON.stringify(item));
      });
    } else if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  const res = await axios.post("/api/internal-audit", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deleteInternalAudit = async (id: string) => {
  const res = await axios.delete(`/api/internal-audit/${id}/delete`);
  return res.data;
};
