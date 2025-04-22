import axios from "axios";
import { z } from "zod";
import { userSchema } from "../userApi";

export const ConsumptionSchema = z.object({
  consumptionsId: z.string(),
  category: z.string(),
  source: z.string(),
  unit: z.string(),
  quentity: z.number(),
  amount: z.number(),
  ghgInTonnes: z.string(),
  methodeOfTracking: z.string(),
  usageType: z.string(),
  doYouHaveREC: z.number(),
  scope: z.string(),
  description: z.string(),
});

export type Consumption = z.infer<typeof ConsumptionSchema>;

export const EnvironmentSchema = z.object({
  id: z.string(),
  concumptionsId: z.string(),
  referenceNumber: z.string(),
  division: z.string(),
  totalWorkForce: z.number(),
  numberOfDaysWorked: z.number(),
  impactConsumption: z.array(ConsumptionSchema),
  areaInSquereMeter: z.number(),
  reviewerId: z.string(),
  reviewer: userSchema,
  approverId: z.string(),
  approver: userSchema,
  status: z.string(),
  area: z.number(),
  year: z.string(),
  month: z.string(),
  totalProuctProducedPcs: z.number(),
  totalProuctProducedkg: z.number(),
  createdBy: z.string(),
  created_at: z.date(),
  createdByUserName: z.string(),
});

export type Environment = z.infer<typeof EnvironmentSchema>;

export async function createConsumption(envirement: Environment) {
  const formData = new FormData();

  Object.keys(envirement).forEach((key) => {
    const value = envirement[key];

    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (
          key === "impactConsumption" &&
          typeof item === "object" &&
          item !== null
        ) {
          Object.keys(item).forEach((nestedKey) => {
            const nestedValue = item[nestedKey];
            if (nestedValue !== null && nestedValue !== undefined) {
              formData.append(
                `${key}[${index}][${nestedKey}]`,
                nestedValue.toString()
              );
            }
          });
        } else {
          // For any other array
          formData.append(`${key}[${index}]`, JSON.stringify(item));
        }
      });
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (typeof value === "object") {
      // Optional: handle nested non-array objects if needed
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value.toString());
    }
  });

  const res = await axios.post(`/api/envirement-recode`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

export async function getConsumptionList() {
  const res = await axios.get("/api/envirement-recode");
  return res.data;
}

export async function getConsumptionAssignedList() {
  const res = await axios.get("/api/envirement-recode-assign-task");
  return res.data;
}

export async function updateConsumption(envirement: Environment) {
  const formData = new FormData();

  Object.keys(envirement).forEach((key) => {
    const value = envirement[key];

    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (
          key === "impactConsumption" &&
          typeof item === "object" &&
          item !== null
        ) {
          Object.keys(item).forEach((nestedKey) => {
            const nestedValue = item[nestedKey];
            if (nestedValue !== null && nestedValue !== undefined) {
              formData.append(
                `${key}[${index}][${nestedKey}]`,
                nestedValue.toString()
              );
            }
          });
        } else {
          // For any other array
          formData.append(`${key}[${index}]`, JSON.stringify(item));
        }
      });
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (typeof value === "object") {
      // Optional: handle nested non-array objects if needed
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value.toString());
    }
  });

  const res = await axios.post(
    `/api/envirement-recode/${envirement.id}/update`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
}

export async function deleteConsumption(id: String) {
  const res = await axios.delete(`/api/envirement-recode/${id}/delete`);
  return res.data;
}

export async function fetchConsumptionCategories() {
  const res = await axios.get(`/api/consumption-categories`);
  return res.data;
}

export async function fetchConsumptionSource() {
  const res = await axios.get(`/api/consumption-sources`);
  return res.data;
}

export async function fetchConsumptionUnits() {
  const res = await axios.get(`/api/consumption-units`);
  return res.data;
}

export async function fetchConsumptionAssignee() {
  const res = await axios.get(`/api/envirement-recode-assignee`);
  return res.data;
}
