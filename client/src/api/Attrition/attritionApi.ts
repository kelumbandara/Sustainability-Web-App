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
  stateName: z.string(),
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
  createdByUser: z.number(),
  updatedBy: z.number(),
  completeBy: z.number(),
  created_at: z.date(),
});

export type Attrition = z.infer<typeof attritionSchema>;

export async function fetchDivision() {
  const res = await axios.get("/api/hr-divisions");
  return res.data;
}

export const attritionData = [
  {
    id: "1",
    referenceNumber: "RAG-01",
    employeeName: "Akila Manujith",
    employeeId: "FAE-02",
    gender: "Male",
    countryName: "Sri Lanka",
    state: "Kandy",
    dateOfJoin: new Date("12-31-2024"),
    resignedDate: new Date("12-31-2024"),
    relievedDate: new Date("12-31-2024"),
    division: "Vintage Denim Pvt (Ltd.)",
    designation: "Team Manager",
    department: "Kandy",
    perDaySalary: 25000.0,
    employmentClassification: "Manager",
    employmentType: "Full-Time",
    isHostelAccess: true,
    isWorkHistory: false,
    resignationType: "Retirement",
    resignationReason: "Over Date",
    servicePeriod: "35 Years",
    tenureSplit: "4-5 Years",
    isNormalResignation: true,
    remark: "OK",
    status: "Announced",
    createdByUser: 2,
    updatedBy: 4,
    completeBy: 5,
    attritionDesignation: "Member",
  },
  {
    id: "2",
    referenceNumber: "RAG-02",
    employeeName: "Nimasha Perera",
    employeeId: "FAE-05",
    gender: "Female",
    countryName: "Sri Lanka",
    state: "Colombo",
    dateOfJoin: new Date("12-31-2024"),

    resignedDate: new Date("12-31-2024"),
    relievedDate: new Date("12-31-2024"),
    division: "Vintage Apparel Co.",
    designation: "HR Executive",
    department: "Human Resources",
    perDaySalary: 18000.0,
    employmentClassification: "Executive",
    employmentType: "Full-Time",
    isHostelAccess: false,
    isWorkHistory: true,
    resignationType: "Voluntary",
    resignationReason: "Personal Reasons",
    servicePeriod: "5 Years",
    tenureSplit: "2-3 Years",
    isNormalResignation: true,
    remark: "Exit interview completed",
    status: "Processing",
    createdByUser: 3,
    updatedBy: 3,
    completeBy: 7,
  },
  {
    id: "3",
    referenceNumber: "RAG-03",
    employeeName: "Sahan Fernando",
    employeeId: "FAE-12",
    gender: "Male",
    countryName: "Sri Lanka",
    state: "Galle",
    dateOfJoin: new Date("2023-12-31"),

    resignedDate: new Date("2024-01-10"),
    relievedDate: new Date("2024-01-31"),
    division: "Denim Designers Ltd.",
    designation: "Software Engineer",
    department: "IT",
    perDaySalary: 22000.0,
    employmentClassification: "Technical",
    employmentType: "Contract",
    isHostelAccess: false,
    isWorkHistory: true,
    resignationType: "Termination",
    resignationReason: "Performance Issues",
    servicePeriod: "1.5 Years",
    tenureSplit: "<2 Years",
    isNormalResignation: false,
    remark: "No further action required",
    status: "Completed",
    createdByUser: 1,
    updatedBy: 2,
    completeBy: 2,
  },
  {
    id: "4",
    referenceNumber: "RAG-04",
    employeeName: "Tharindu Jayasuriya",
    employeeId: "FAE-09",
    gender: "Male",
    countryName: "Sri Lanka",
    state: "Kurunegala",
    dateOfJoin: new Date("2023-12-31"),

    resignedDate: new Date("2023-11-20"),
    relievedDate: new Date("2023-11-30"),
    division: "Vintage Denim Pvt (Ltd.)",
    designation: "Line Supervisor",
    department: "Production",
    perDaySalary: 15000.0,
    employmentClassification: "Supervisor",
    employmentType: "Full-Time",
    isHostelAccess: true,
    isWorkHistory: true,
    resignationType: "Voluntary",
    resignationReason: "Family Relocation",
    servicePeriod: "10 Years",
    tenureSplit: "6-10 Years",
    isNormalResignation: true,
    remark: "Cleared",
    status: "Approved",
    createdByUser: 4,
    updatedBy: 4,
    completeBy: 4,
  },
];
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
export const EmployeeTypeData = [
  {
    id: "1",
    employeeType: "Existing Employee",
  },
  {
    id: "2",
    employeeType: "New Employee",
  },
];

export const DesignationData = [
  {
    id: "1",
    designationName: "CEO",
  },
  {
    id: "2",
    designationName: "Manager",
  },
];

export const FunctionData = [
  {
    id: "1",
    functionName: "Fun 1",
  },
  {
    id: "2",
    functionName: "Fun 2",
  },
];

export const SourceOfHiring = [
  {
    id: "1",
    sourceName: "src 1",
  },
  {
    id: "2",
    sourceName: "src 2",
  },
];

export const EmploymentTypeData = [
  {
    id: "1",
    employmentType: "Worker",
  },
  {
    id: "2",
    employmentType: "Staff",
  },
];

export const CountryData = [
  {
    id: "1",
    countryName: "Sri Lanka",
  },
  {
    id: "2",
    countryName: "India",
  },
];

export const StateData = [
  {
    id: "1",
    stateName: "Kandy",
  },
  {
    id: "2",
    stateName: "Colombo",
  },
];

export const createState = async (data: {
  countryId: number;
  stateName: String;
}) => {
  console.log(data);
  const res = await axios.post(`/api/rag-state-names`, data);
  console.log(data);
  return res.data;
};

export const createDesignation = async (designation: string) => {
  const res = await axios.post("/api/designation", designation);
  console.log(designation);
  return res.data;
};

export const createAttritionReport = async (data: Attrition) => {
  const res = await axios.post("/api/attrition-record", data);
  console.log(data);
  return res.data;
};
export const fetchAttritionRecord = async () => {
  const res = await axios.get("/api/attrition-record");
  return res.data;
};

export const fetchRagRecord = async () => {
  const res = await axios.get("/api/rag-record");
  return res.data;
};
export const fetchRagDesignationNames = async () => {
  const res = await axios.get("/api/rag-designation-names");
  return res.data;
};

export const fetchRagFunction = async () => {
  const res = await axios.get("/api/rag-functions");
  return res.data;
};

export const fetchRagSource = async () => {
  const res = await axios.get("/api/rag-source-of-hirng");
  return res.data;
};

export const fetchRagEmployee = async () => {
  const res = await axios.get("/api/rag-employee-types");
  return res.data;
};

export const fetchRagCountryNames = async () => {
  const res = await axios.get(`/api/rag-country-names`);
  return res.data;
};

export const fetchRagStateNames = async (id: number) => {
  const res = await axios.get(`/api/rag-state-names/${id}`);
  return res.data;
};

export const fetchRagCategory = async () => {
  const res = await axios.get("/api/rag-category-names");
  return res.data;
};

export const fetchRagEmployment = async () => {
  const res = await axios.get("/api/rag-employment-types");
  return res.data;
};
