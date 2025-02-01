import axios from "axios";
import { z } from "zod";

export enum UserRoles {
  ADMIN = "1",
  USER = "2",
}

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  isCompanyEmployee: z.boolean(),
  employeeNumber: z.string().nullable(),
  mobile: z.string(),
  otp: z.string().nullable(),
  otp_expires_at: z.string().nullable(),
  emailVerifiedAt: z.number(), // Changed from boolean to number (0 or 1)
  userType: z.string(),
  department: z.string().nullable(),
  jobPosition: z.string().nullable(),
  responsibleSection: z.string().nullable(),
  assigneeLevel: z.number(),
  profileImage: z.string().nullable(),
  availability: z.number(), // Changed from boolean to number (0 or 1)
  assignedFactory: z.union([z.array(z.string()), z.string()]), // Handles both array and single string
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
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

export async function forgotPassword({
  email,
}: {
  email: string;
}) {
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

export async function getAllUsers() {
  const res = await axios.get("/api/all-users");
  return res.data;
}

