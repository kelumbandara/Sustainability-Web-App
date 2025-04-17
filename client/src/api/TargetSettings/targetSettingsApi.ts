import { z } from "zod";
import axios from "axios";
import { StorageFileSchema } from "../../utils/StorageFiles.util";
import { userSchema } from "../userApi";

export const targetSettingsSchema = z.object({
  id: z.string(),
  division: z.string(),
  category: z.string(),
  department: z.string(),
  source: z.string(),
  baseLineConsumption: z.string(),
  ghcEmmision: z.string(),
  problems: z.string(),
  document: z.array(z.union([z.instanceof(File), StorageFileSchema]))
    .optional(),
  action: z.string(),
  possibilityCategory: z.string(),
  opportunity: z.string(),
  implementationCost: z.string(),
  expectedSavings: z.string(),
  targetGhcRedution: z.string(),
  costSaving: z.string(),
  implementationTimeline: z.date(),
  paybackPeriod: z.string(),
  projectLifespan: z.string(),
  responsible: userSchema.optional(),
  approver: userSchema.optional(),
  responsibleId: z.string(),
  approverId: z.string(),
  status: z.string(),
  removeDoc: z.array(z.string()).optional(),

});

export type TargetSettings = z.infer<typeof targetSettingsSchema>;

export const createTargetSettings = async (targetSettings: TargetSettings) => {
  const token = `Bearer ${localStorage.getItem("token") || ""}`;
  const formData = new FormData();

  formData.append("token", token);
  console.log("submit", token);

  Object.keys(targetSettings).forEach((key) => {
    const value = targetSettings[key as keyof TargetSettings];

    if (key === "document" && Array.isArray(value)) {
      value.forEach((file, index) => {
        formData.append(`document[${index}]`, file as File);
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

  const res = await axios.post("/api/aaa", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const updateTargetSettings = async (targetSettings: TargetSettings) => {
  if (!targetSettings.id) {
    throw new Error("Target Settings must have an ID for an update.");
  }

  const formData = new FormData();
  Object.keys(targetSettings).forEach((key) => {
    const value = targetSettings[key as keyof TargetSettings];

    if (key === "document" && Array.isArray(value)) {
      value.forEach((file, index) => {
        formData.append(`document[${index}]`, file as File);
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

  try {
    const response = await axios.post(
      `/api/aaa/${targetSettings.id}/update`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating hazard risk:", error);
    throw error;
  }
};

export const deleteTargetSettings = async (id: string) => {
  const res = await axios.delete(`/api/aaa/${id}/delete`);
  return res.data;
};

export async function getTargetSettings() {
  const res = await axios.get("api/aaa");
  return res.data;
}

export async function getAssignedTargetSettings() {
  const res = await axios.get("api/aaa");
  return res.data;
}