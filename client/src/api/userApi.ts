import axios from "axios";
import { z } from "zod";

export enum UserRoles {
  ADMIN = "1",
  USER = "2",
}

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  mobile: z.string(),
  emailVerifiedAt: z.string().nullable(),
  role: z.nativeEnum(UserRoles),
  profileImage: z.string().nullable(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
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
}: {
  email: string;
  password: string;
  name: string;
  mobileNumber: string;
  confirmPassword: string;
}) {
  const res = await axios.post("/api/register", {
    email,
    password,
    name,
    mobile,
    password_confirmation,
  });
  return res.data;
}

export async function validateUser() {
  const res = await axios.get("/api/user");
  return res.data;
}
