import { z } from "zod";
import axios from "axios";

export const divisionSchema = z.object({
  id: z.string(),
  division: z.string(),
});

export type divisionSchema = z.infer<typeof divisionSchema>;

export async function fetchDepartmentData() {
  const res = await axios.get("/api/hshr-divisions");
  return res.data;
}