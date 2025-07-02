import { number, z } from "zod";
import { Gender } from "../OccupationalHealth/patientApi";
import { StorageFileSchema } from "../../utils/StorageFiles.util";
import { userSchema } from "../userApi";
import axios from "axios";

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

export enum GrievanceEmployeeShift {
  general_shift = "general shift",
  shift1 = "shift 1",
  shift2 = "shift 2",
  shift3 = "shift 3",
}

export enum HumanRightViolation {
  ExtrajudicialKilling = "Extrajudicial Killing",
  UnlawfulDetention = "Unlawful Detention or Arrest",
  Torture = "Torture or Inhumane Treatment",
  EnforcedDisappearance = "Enforced Disappearance",
  Censorship = "Censorship",
  Intimidation = "Intimidation of Journalists",
  Discrimination = "Discrimination",
  GenderBasedViolence = "Gender-Based Violence",
  ChildLabor = "Child Labor",
  ForcedLabor = "Forced Labor",
  UnsafeWorkingConditions = "Unsafe Working Conditions",
  DeniedEducation = "Denied Education",
  DeniedHealth = "Denied Health",
  ForcedEviction = "Forced Eviction",
  Surveillance = "Unlawful Surveillance",
  DataPrivacy = "Data Privacy Violation",
}

export enum Scale {
  Minor = "Minor",
  Moderate = "Moderate",
  Severe = "Severe",
  Critical = "Critical",
}

export enum Frequency {
  OneTime = "One-time Incident",
  Occasionally = "Occasionally",
  Frequently = "Frequently",
  Ongoing = "Ongoing/Daily",
  Unknown = "Unknown",
}

export enum SeverityLevel {
  Minimal = "Minimal",
  Minor = "Minor",
  Moderate = "Moderate",
  Severe = "Severe",
  Critical = "Critical",
}

export const GrievanceRespondentDetailsSchema = z.object({
  id: z.number(),
  respondentId: z.number(),
  grievanceId: z.number(),
  employeeId: z.string(),
  name: z.string(),
  designation: z.string(),
  department: z.string(),
});

export type GrievanceRespondentDetails = z.infer<
  typeof GrievanceRespondentDetailsSchema
>;

export const GrievanceCommitteeMemberDetailsSchema = z.object({
  id: z.number(),
  memberId: z.number(),
  grievanceId: z.number(),
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
  nomineeId: z.number(),
  grievanceId: z.number(),
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
  legalAdvisorId: z.number(),
  grievanceId: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
});

export type GrievanceLegalAdvisorDetails = z.infer<
  typeof GrievanceLegalAdvisorDetailsSchema
>;

const booleanOrNumber = z.union([z.boolean(), z.number().min(0).max(1)]);

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
  location: z.string().optional(),
  caseId: z.number(),
  type: z.nativeEnum(GrievanceType),
  submissionDate: z.date(),
  isAnonymous: booleanOrNumber.optional(),
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
  humanRightsViolation: z.nativeEnum(HumanRightViolation).optional(),
  scale: z.nativeEnum(Scale).optional(),
  frequencyRate: z.nativeEnum(Frequency).optional(),
  severityScore: z.nativeEnum(SeverityLevel).optional(),
  committeeStatement: z.string().optional(),
  grievantStatement: z.string().optional(),
  tradeUnionRepresentative: z.string().optional(),
  isFollowUp: booleanOrNumber.optional(),
  isAppeal: booleanOrNumber.optional(),
  solutionProvided: z.string().optional(),
  isIssuesPreviouslyRaised: booleanOrNumber.optional(),
  statementDocuments: z
    .array(z.union([z.instanceof(File), StorageFileSchema]))
    .optional(),
  createdByUserId: z.number(),
  updatedByUserId: z.number().optional(),
  openedByUserId: z.number().optional(),
  inprogressByUserId: z.number().optional(),
  approvedByUserId: z.number().optional(),
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
  respondents: z.array(GrievanceRespondentDetailsSchema).optional(),
  committeeMembers: z.array(GrievanceCommitteeMemberDetailsSchema).optional(),
  nominees: z.array(GrievanceNomineeDetailsSchema).optional(),
  legalAdvisors: z.array(GrievanceLegalAdvisorDetailsSchema).optional(),
  solutionRemark: z.string().optional(),
  removeEvidence: z.array(z.string()).optional(),
  removeStatementsDocuments: z.array(z.string()).optional(),
  removeInvestigationCommitteeStatementDocuments: z.array(z.string()),
});

export type Grievance = z.infer<typeof GrievanceSchema>;

export async function fetchGrievanceTopic() {
  const res = await axios.get(`/api/grievance-topics`);
  return res.data;
}

export async function fetchGrievanceSubmissions() {
  const res = await axios.get(`/api/grievance-submissions`);
  return res.data;
}

export async function createNewTopic(data: string) {
  const res = await axios.post("/api/grievance-topics", { topicName: data });
  return res.data;
}

export async function createNewSubmission(data: string) {
  const res = await axios.post("/api/grievance-submissions", {
    submissionName: data,
  });
  return res.data;
}

export async function getGrievancesList() {
  const res = await axios.get(`/api/grievance-record`);
  return res.data;
}

export async function getGrievancesAssignedTaskList() {
  const res = await axios.get(`/api/grievance-record-assign-task`);
  return res.data;
}

export const createGrievance = async (grievance: Grievance) => {
  const formData = new FormData();

  Object.keys(grievance).forEach((key) => {
    const value = grievance[key];

    if (
      (key === "statementDocuments" ||
        key === "investigationCommitteeStatementDocuments" ||
        key === "evidence") &&
      Array.isArray(value)
    ) {
      value.forEach((file: File, index: number) => {
        formData.append(`${key}[${index}]`, file);
      });
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (
          (key === "respondents" ||
            key === "committeeMembers" ||
            key === "nominees" ||
            key === "legalAdvisors") &&
          typeof item === "object"
        ) {
          Object.keys(item).forEach((nestedKey) => {
            formData.append(
              `${key}[${index}][${nestedKey}]`,
              item[nestedKey]?.toString()
            );
          });
        } else {
          formData.append(`${key}[${index}]`, item.toString());
        }
      });
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  let endpointName = "grievance-record-que-sug-app";
  if (
    grievance.type === GrievanceType.complaint ||
    grievance.type === GrievanceType.grievance
  ) {
    endpointName = "grievance-record-com-gri";
  }

  try {
    const res = await axios.post(`/api/${endpointName}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating grievance record:", error);
    throw error;
  }
};

export const updateGrievance = async (grievance: Grievance) => {
  const formData = new FormData();

  Object.keys(grievance).forEach((key) => {
    const value = grievance[key];

    if (
      (key === "statementDocuments" ||
        key === "investigationCommitteeStatementDocuments" ||
        key === "evidence") &&
      Array.isArray(value)
    ) {
      value.forEach((file: File, index: number) => {
        formData.append(`${key}[${index}]`, file);
      });
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (
          (key === "respondents" ||
            key === "committeeMembers" ||
            key === "nominees" ||
            key === "legalAdvisors") &&
          typeof item === "object"
        ) {
          Object.keys(item).forEach((nestedKey) => {
            formData.append(
              `${key}[${index}][${nestedKey}]`,
              item[nestedKey]?.toString()
            );
          });
        } else {
          formData.append(`${key}[${index}]`, item.toString());
        }
      });
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  let endpointName = "grievance-record-que-sug-app";
  if (
    grievance.type === GrievanceType.complaint ||
    grievance.type === GrievanceType.grievance
  ) {
    endpointName = "grievance-record-com-gri";
  }

  try {
    const res = await axios.post(
      `/api/${endpointName}/${grievance.id}/update`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating grievance record:", error);
    throw error;
  }
};

export async function openGrievance(id: number) {
  const res = await axios.post(`/api/grievance-record/${id}/update-status`, {
    status: GrievanceStatus.open,
  });
  return res.data;
}

export async function completeGrievance(id: number) {
  const res = await axios.post(`/api/grievance-record/${id}/update-status`, {
    status: GrievanceStatus.completed,
  });
  return res.data;
}

export async function feedbackGrievance({
  id,
  feedback,
  stars,
}: {
  id: number;
  feedback: string;
  stars: number;
}) {
  const res = await axios.post(`/api/grievance-record/${id}/feedback`, {
    feedback,
    stars,
  });
  return res.data;
}

export const deleteGrievance = async (id: number) => {
  const res = await axios.delete(`/api/grievance-record/${id}/delete`);
  return res.data;
};

//dashboard API s
export const categoryData = [
  {
    id: "1",
    name: "others",
  },
  {
    id: "2",
    name: "production",
  },
  {
    id: "3",
    name: "hse",
  },
  {
    id: "4",
    name: "labor relations",
  },
  {
    id: "5",
    name: "hr management",
  },
];

export async function getGrievancesStatusSummary(
  startDate: string,
  endDate: string,
  businessUnit: string,
  category: string
) {
  const res = await axios.get(
    `/api/grievance-dashboard/${startDate}/${endDate}/${businessUnit}/${category}/status-summary`
  );
  return res.data;
}

export async function getGrievancesMonthlyStatusSummary(
  startDate: string,
  endDate: string,
  businessUnit: string,
  category: string
) {
  const res = await axios.get(
    `/api/grievance-dashboard/${startDate}/${endDate}/${businessUnit}/${category}/monthly-status-summary`
  );
  return res.data;
}

export async function getTypeOfGrievancesSummary(
  startDate: string,
  endDate: string,
  businessUnit: string,
  category: string
) {
  const res = await axios.get(
    `/api/grievance-dashboard/${startDate}/${endDate}/${businessUnit}/${category}/type-of-grievance`
  );
  return res.data;
}

export async function getCategoryOfGrievancesSummary(
  startDate: string,
  endDate: string,
  businessUnit: string,
) {
  const res = await axios.get(
    `/api/grievance-dashboard/${startDate}/${endDate}/${businessUnit}/category-summary`
  );
  return res.data;
}
