import { z } from "zod";

export enum Severity {
  MINOR = "Minor",
  MAJOR = "Major",
}

export enum IncidentSeverity {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  VERY_HIGH = "Very High",
  EXTREME = "Extreme",
}

export enum IncidentTypeOfNearMiss {
  NEAR_MISS = "Near Miss",
  OTHER = "Other",
  SAFETY_CONCERN = "Safety Concern",
  SAFETY_IDEA_SUGGESTION = "Safety Idea/Suggestion",
}

export enum IncidentTypeOfConcern {
  AREA = "Area",
  OTHER = "Other",
  SAFETY_POLICY_VIOLATION = "Safety Policy Violation",
  UNSAFE_ACT = "Unsafe Act",
  UNSAFE_CONDITION = "Unsafe Condition",
  UNSAFE_CONDITION_OF_EQUIPMENT = "Unsafe Condition of Equipment",
  UNSAFE_USE_OF_EQUIPMENT = "Unsafe Use of Equipment",
}

export enum IncidentFactors {
  ENVIRONMENTAL = "Environmental",
  EQUIPMENT_TOOLS = "Equipment and Tools",
  EXTERNAL = "External",
  HUMAN = "Human",
  ORGANIZATIONAL = "Organizational",
  PROCEDURAL_ISSUES = "Procedural Issues",
}

export enum InjuryType {
  FIRST_AID = "First Aid",
  REPORTABLE_ACCIDENT = "Reportable Accident",
  NON_REPORTABLE_ACCIDENT = "Non-Reportable Accident",
}

export const AccidentWitnessSchema = z.object({
  employeeId: z.string(),
  name: z.string(),
  company: z.string(),
  division: z.string(),
  department: z.string(),
  evidenceName: z.string().optional(),
});

export type AccidentWitness = z.infer<typeof AccidentWitnessSchema>;

export const AccidentEffectedIndividualSchema = z.object({
  id: z.string(),
  personType: z.string(),
  employeeId: z.string(),
  name: z.string(),
  gender: z.string(),
  age: z.string(),
  dateOfJoin: z.date(),
  industryExperience: z.string(),
  designation: z.string(),
  employmentDuration: z.string(),
});

export type AccidentEffectedIndividual = z.infer<
  typeof AccidentEffectedIndividualSchema
>;

export const AccidentSchema = z.object({
  id: z.string(),
  referenceNumber: z.string(),
  accidentDate: z.date(),
  accidentTime: z.date(),
  severity: z.nativeEnum(Severity),
  division: z.string(),
  department: z.string(),
  location: z.string(),
  supervisorName: z.string(),
  reportedDate: z.string(),
  orgId: z.string(),
  evidenceType: z.string().optional(),
  evidenceName: z.string().optional(),
  evidenceId: z.string().nullable(),
  status: z.string(),
  assigneeNotification: z.boolean(),
  resolution: z.string(),
  investigation: z.string().nullable(),
  category: z.string(),
  subCategory: z.string(),
  accidentType: z.string(),
  affectedBodyParts: z.string().optional(),
  injuryType: z.nativeEnum(InjuryType),
  injuryCause: z.string(),
  consultedHospital: z.string(),
  consultedDoctor: z.string(),
  timeOfWork: z.string(),
  returnForWork: z.string().nullable(),
  completedNotification: z.boolean(),
  injury: z.string(),
  groupNotification: z.boolean(),
  workPerformed: z.string(),
  description: z.string(),
  actionTaken: z.string(),
  atmosphereCondition: z.string().nullable(),
  lightningCondition: z.string().nullable(),
  workSurfaceCondition: z.string().nullable(),
  housekeepingCondition: z.string().nullable(),
  damage: z.string().nullable(),
  disease: z.string().nullable(),
  environmental: z.string().nullable(),
  training: z.string().nullable(),
  lesson: z.string().nullable(),
  govReported_date: z.string().nullable(),
  esiReported_date: z.string().nullable(),
  amount: z.string(),
  consequenceCategory: z.string(),
  returnForWorkHour: z.string().nullable(),
  returnForWorkMin: z.string().nullable(),
  returnDate: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  affectedPrimaryRegion: z.string(),
  affectedSecondaryRegion: z.string(),
  affectedTertiaryRegion: z.string(),
  rootCause: z.string().nullable(),
  assignee: z.string(),
  witnesses: z.array(AccidentWitnessSchema),
  effectedIndividuals: z.array(AccidentEffectedIndividualSchema),
  reporter: z.string(),
});

export type Accident = z.infer<typeof AccidentSchema>;

export const IncidentSchema = z.object({
  id: z.string(),
  referenceNumber: z.string(),
  incidentDate: z.date(),
  incidentTime: z.date(),
  severity: z.nativeEnum(IncidentSeverity),
  division: z.string(),
  location: z.string(),
  supervisorName: z.string(),
  reportedDate: z.string(),
  orgId: z.string(),
  evidenceType: z.string().optional(),
  evidenceName: z.string().optional(),
  evidenceId: z.string().nullable(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  assignee: z.string(),
  witnesses: z.array(AccidentWitnessSchema),
  effectedIndividuals: z.array(AccidentEffectedIndividualSchema),
  reporter: z.string(),
  circumstances: z.string(),
  incidentDetails: z.string().optional(),
  typeOfNearMiss: z.nativeEnum(IncidentTypeOfNearMiss),
  typeOfConcern: z.nativeEnum(IncidentTypeOfConcern),
  factors: z.nativeEnum(IncidentFactors),
  causes: z.string().optional(),
});

export type Incident = z.infer<typeof IncidentSchema>;
