import axios from "axios";
import { z } from "zod";
import { PermissionKeysObjectSchema } from "../views/Administration/SectionList";

export const userRoleSchema = z.object({
  id: z.string(),
  userType: z.string(),
  description: z.string().optional(),
  permissionObject: PermissionKeysObjectSchema,
  created_at: z.string(),
});

export type UserRole = z.infer<typeof userRoleSchema>;

export const userTypeSchema = z.object({
  id: z.string(),
  userType: z.string(),
  description: z.string().optional(),
  permissionObject: PermissionKeysObjectSchema,
  created_at: z.string(),
});

export const userLevelSchema = z.object({
  id: z.string(),
  levelId: z.string(),
  levelName: z.string().optional(),
  created_at: z.string(),
});

export type UserLevel = z.infer<typeof userLevelSchema>;

export type UserType = z.infer<typeof userTypeSchema>;

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  mobile: z.string(),
  emailVerifiedAt: z.string().nullable(),
  role: z.string(),
  roleId: z.string(),
  availability: z.boolean(),
  responsibleSection: z.array(z.string()),
  userType: userTypeSchema,
  userLevel: userLevelSchema,
  profileImage: z.string().nullable(),
  status: z.string(),
  isCompanyEmployee: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  department: z.string(),
  assignedFactory: z.array(z.string()),
  employeeNumber: z.string(),
  jobPosition: z.string(),
  // assigneeLevel: z.string(),
  permissionObject: PermissionKeysObjectSchema,
});

export type User = z.infer<typeof userSchema>;

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const res = await axios.post("/api/login", {
    email,
    password,
  });
  return res.data;
}

export async function registerUser({
  name,
  email,
  mobileNumber: mobile,
  password,
  confirmPassword: password_confirmation,
  isCompanyEmployee,
  department,
  jobPosition,
  assignedFactory,
  employeeNumber,
}: {
  email: string;
  password: string;
  name: string;
  mobileNumber: string;
  confirmPassword: string;
  isCompanyEmployee: boolean;
  jobPosition: string;
  department: string;
  assignedFactory: string[];
  employeeNumber: string;
}) {
  const res = await axios.post("/api/register", {
    email,
    password,
    name,
    mobile,
    password_confirmation,
    isCompanyEmployee,
    jobPosition,
    department,
    assignedFactory,
    employeeNumber,
  });
  return res.data;
}

export async function validateUser() {
  const res = await axios.get("/api/user");
  return res.data;
}

export async function fetchAllUsers() {
  const res = await axios.get("/api/users");
  return res.data;
}

export async function forgotPassword({ email }: { email: string }) {
  const res = await axios.post("/api/forgot-password", {
    email,
  });
  return res.data;
}

export async function otpVerification({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  const res = await axios.post("/api/reset-password", {
    email,
    otp,
  });
  return res.data;
}

export async function resetPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const res = await axios.post("/api/change-password", {
    email,
    password,
  });
  return res.data;
}

export async function fetchAllAssigneeLevel() {
  const res = await axios.get("/api/assignee-level");
  return res.data;
}

export async function updateUserType({
  id,
  userTypeId,
  assigneeLevel,
  department,
  availability,
  jobPosition,
  assignedFactory,
  responsibleSection,
}: {
  id: string;
  userTypeId: string;
  assigneeLevel: string;
  department: string;
  availability: boolean;
  jobPosition: string;
  assignedFactory: string[];
  responsibleSection: string[];
}) {

  const parsedAssignedFactory = Array.isArray(assignedFactory) ? assignedFactory : JSON.parse(assignedFactory || "[]");
  const parsedResponsibleSection = Array.isArray(responsibleSection) ? responsibleSection : JSON.parse(responsibleSection || "[]");

  const res = await axios.post(`/api/users/${id}/update`, {
    userType: userTypeId.toString(),
    assigneeLevel: assigneeLevel.toString(),
    department,
    availability,
    jobPosition,
    assignedFactory: parsedAssignedFactory,
    responsibleSection: parsedResponsibleSection,
  });

  return res.data;
}


//assignee by the responsible section
export async function fetchHazardRiskAssignee() {
  const res = await axios.get("/api/hazard-risks-assignee");
  return res.data;
}

export async function fetchAccidentAssignee() {
  const res = await axios.get("/api/accidents-assignee");
  return res.data;
}

export async function fetchIncidentAssignee() {
  const res = await axios.get("/api/incidents-assignee");
  return res.data;
}

export async function fetchMedicineRequestAssignee() {
  const res = await axios.get("/api/medicine-request-assignee");
  return res.data;
}
