import { z } from "zod";
import axios from "axios";

export const CountrySchema = z.object({
  id: z.number(),
  countryName: z.string(),
});

export type Country = z.infer<typeof CountrySchema>;

export const attritionSchema = z.object({
  id: z.string(),
  referenceNumber: z.string(),
  employeeName: z.string(),
  employeeId: z.string(),
  gender: z.string(),
  countryName: CountrySchema,
  country: z.number(),
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
  attritionDesignation: z.string(),
  servicePeriod: z.string(),
  tenureSplit: z.string(),
  isNormalResignation: z.boolean(),
  remark: z.string(),
  status: z.string(),
  // createdByUser: z.number(),
  updatedBy: z.number(),
  completeBy: z.number(),
  created_at: z.date(),
});

export type Attrition = z.infer<typeof attritionSchema>;

export async function fetchDivision() {
  const res = await axios.get("/api/hr-divisions");
  return res.data;
}

export const createAttritionReport = async (data: Attrition) => {
  const res = await axios.post("/api/attrition-record", data);
  console.log(data);
  return res.data;
};

export const updateAttritionRecord = async (data: Attrition) => {
  const res = await axios.post(`/api/attrition-record/${data.id}/update`, data);
  console.log(data);
  return res.data;
};

export const deleteAttritionRecord = async (id: String) => {
  const res = await axios.delete(`/api/attrition-record/${id}/delete`);
  console.log(id);
  return res.data;
};

export const fetchAttritionRecord = async () => {
  const res = await axios.get("/api/attrition-record");
  return res.data;
};

export const fetchAttritionDesignationNames = async () => {
  const res = await axios.get("/api/attrition-designation-names");
  return res.data;
};

export const fetchAttritionResignation = async () => {
  const res = await axios.get("/api/attrition-resignation-types");
  return res.data;
};

export const CreateAttritionResignation = async (
  resignationTypeName: string
) => {
  const res = await axios.post("/api/attrition-resignation-types", {
    resignationTypeName,
  });
  return res.data;
};

export const createAttritionDesignation = async (designationName: string) => {
  const res = await axios.post("/api/attrition-designation-names", {
    designationName,
  });
  return res.data;
};

export const fetchAttritionEmployment = async () => {
  const res = await axios.get("/api/attrition-employment-classifications");
  return res.data;
};

export const fetchCountryNames = async () => {
  const res = await axios.get(
    `https://sl.perahara.lk/CountryAndState/public/api/country`
  );
  return res.data;
};

export const fetchStateNames = async (id: number) => {
  const res = await axios.get(
    `https://sl.perahara.lk/CountryAndState/public/api/state/${id}`
  );
  return res.data;
};

export const genderData = [
  {
    id: "1",
    gender: "Male",
  },
  {
    id: "2",
    gender: "Female",
  },
  {
    id: "3",
    gender: "Other",
  },
];

export const tenureSplitData = [
  {
    id: "1",
    tenureSplit: "Above 5 Years",
  },
  {
    id: "2",
    tenureSplit: "4-5 Years",
  },
  {
    id: "3",
    tenureSplit: "3-4 Years",
  },
  {
    id: "4",
    tenureSplit: "2-3 Years",
  },
  {
    id: "5",
    tenureSplit: "1-2 Years",
  },
  {
    id: "6",
    tenureSplit: "7-12 Months",
  },
];
