import { z } from "zod";
import axios from "axios";

export const attritionSchema = z.object({
  id: z.string(),
  referenceNumber: z.string(),
  employeeName: z.string(),
  employeeId: z.string(),
  gender: z.string(),
  countryName: z.string(),
  state: z.string(),
  resignedDate: z.date(),
  relievedDate: z.date(),
  division: z.string(), 
  designation: z.string(),
  department: z.string(),
  perDaySalary: z.number(),
  dateOfJoin: z.date(),
  employmentClassification: z.string(),
  employmentType: z.string(),
  isHostelAccess: z.boolean(),
  isWorkHistory: z.boolean(),
  resignationType: z.string(),
  resignationReason: z.string(),
  servicePeriod: z.string(),
  tenureSplit: z.string(),
  isNormalResignation: z.boolean(),
  remark: z.string(),
  status: z.string(),
  createdByUser: z.number(),
  updatedBy: z.number(),
  completeBy: z.number(),
});

export type Attrition = z.infer<typeof attritionSchema>;

export async function fetchDivision() {
  const res = await axios.get("/api/hr-divisions");
  return res.data;
}
