import { number, z } from "zod";
import { Gender } from "../OccupationalHealth/patientApi";
import { StorageFileSchema } from "../../utils/StorageFiles.util";
import { userSchema } from "../userApi";

export enum GrievanceStatus {
  draft = "draft",
  open = "open",
  inprogress = "inprogress",
  completed = "completed",
}

export enum GrievancePersonType {
  visitor = "visitor",
  contractor = "contractor",
  employee = "employee",
}

export enum GrievanceType {
  complaint = "complaint",
  suggestion = "suggestion",
  question = "question",
  appreciation = "appreciation",
  grievance = "grievance",
}

export enum GrievanceChannel {
  committees = "committees",
  welfare_officer = "welfare officer",
  digital_grievance_box = "digital grievance box",
  hotline = "hotline",
  email = "email",
  grievance_box = "grievance box",
  open_door = "open door",
  helpdesk = "helpdesk",
}

export enum GrievanceCategory {
  others = "others",
  production = "production",
  hse = "hse",
  labor_relations = "labor relations",
  hr_management = "hr management",
}

export const GrievanceRespondentDetailsSchema = z.object({
  id: z.string(),
  respondentId: z.string(),
  grievanceId: z.string(),
  employeeId: z.string(),
  name: z.string(),
  designation: z.string(),
  department: z.string(),
});

export type GrievanceRespondentDetails = z.infer<
  typeof GrievanceRespondentDetailsSchema
>;

export const GrievanceCommitteeMemberDetailsSchema = z.object({
  id: z.string(),
  memberId: z.string(),
  grievanceId: z.string(),
  employeeId: z.string(),
  name: z.string(),
  designation: z.string(),
  department: z.string(),
});

export type GrievanceCommitteeMemberDetails = z.infer<
  typeof GrievanceCommitteeMemberDetailsSchema
>;

export const GrievanceNomineeDetailsSchema = z.object({
  id: z.string(),
  nomineeId: z.string(),
  grievanceId: z.string(),
  employeeId: z.string(),
  name: z.string(),
  designation: z.string(),
  department: z.string(),
});

export type GrievanceNomineeDetails = z.infer<
  typeof GrievanceNomineeDetailsSchema
>;

export const GrievanceLegalAdvisorDetailsSchema = z.object({
  id: z.string(),
  legalAdvisorId: z.string(),
  grievanceId: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
});

export type GrievanceLegalAdvisorDetails = z.infer<
  typeof GrievanceLegalAdvisorDetailsSchema
>;

export const GrievanceSchema = z.object({
  id: number(),
  status: z.nativeEnum(GrievanceStatus),
  referenceNumber: z.string(),
  personType: z.nativeEnum(GrievancePersonType),
  name: z.string(),
  gender: z.nativeEnum(Gender),
  supervisor: z.string().optional(),
  employeeId: z.string().optional(),
  employeeShift: z.string(),
  division: z.string().optional(),
  location: z.string().optional(),
  caseId: z.string(),
  type: z.nativeEnum(GrievanceType),
  submissionDate: z.date(),
  isAnonymous: z.boolean(),
  channel: z.nativeEnum(GrievanceChannel),
  category: z.nativeEnum(GrievanceCategory),
  topic: z.string(),
  submissions: z.string(),
  description: z.string(),
  dueDate: z.date().optional(),
  businessUnit: z.string().optional(),
  resolutionDate: z.date().optional(),
  remarks: z.string().optional(),
  helpDeskPerson: z.string().optional(),
  responsibleDepartment: z.string().optional(),
  humanRightsViolation: z.boolean().optional(),
  scale: z.string().optional(),
  frequencyRate: z.string().optional(),
  severityScore: z.string().optional(),
  committeeStatement: z.string().optional(),
  grievantStatement: z.string().optional(),
  tradeUnionRepresentative: z.string().optional(),
  isFollowUp: z.boolean().optional(),
  isAppeal: z.boolean().optional(),
  solutionProvided: z.boolean().optional(),
  isIssuesPreviouslyRaised: z.boolean().optional(),
  statementDocuments: z
    .array(z.union([z.instanceof(File), StorageFileSchema]))
    .optional(),
  createdByUserId: z.string(),
  updatedByUserId: z.string().optional(),
  openedByUserId: z.string().optional(),
  inprogressByUserId: z.string().optional(),
  approvedByUserId: z.string().optional(),
  feedback: z.string().optional(),
  stars: z.number().optional(),
  investigationCommitteeStatementDocuments: z
    .array(z.union([z.instanceof(File), StorageFileSchema]))
    .optional(),
  evidence: z
    .array(z.union([z.instanceof(File), StorageFileSchema]))
    .optional(),
  dateOfJoin: z.date().optional(),
  servicePeriod: z.string().optional(),
  tenureSplit: z.string().optional(),
  designation: z.string().optional(),
  department: z.string().optional(),
  assigneeId: z.number().optional(),
  assignee: userSchema.optional(),
  respondentDetails: z.array(GrievanceRespondentDetailsSchema).optional(),
  committeeMemberDetails: z
    .array(GrievanceCommitteeMemberDetailsSchema)
    .optional(),
  nomineeDetails: z.array(GrievanceNomineeDetailsSchema).optional(),
  legalAdvisorDetails: z.array(GrievanceLegalAdvisorDetailsSchema).optional(),
});

export type Grievance = z.infer<typeof GrievanceSchema>;
