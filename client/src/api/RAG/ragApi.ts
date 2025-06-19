import { z } from "zod";
import axios from "axios";

export const CountrySchema = z.object({
  id: z.number(),
  countryName: z.string(),
});

export type Country = z.infer<typeof CountrySchema>;

export const RAGSchema = z.object({
  id: z.string(),
  referenceNumber: z.string(),
  employeeType: z.string(),
  employeeId: z.string(),
  division: z.string(),
  employeeName: z.string(),
  dateOfJoin: z.date(),
  designation: z.string(),
  department: z.string(),
  gender: z.string(),
  age: z.number(),
  dateOfBirth: z.date(),
  servicePeriod: z.string(),
  tenureSplit: z.string(),
  sourceOfHiring: z.string(),
  function: z.string(),
  reportingManager: z.string(),
  employmentType: z.string(),
  country: z.number(),
  countryName: CountrySchema,
  state: z.string(),
  origin: z.string(),
  category: z.string(),
  stateName: z.string(),
  discussionSummary: z.string(),
  remark: z.string(),
  status: z.string(),
  createdByUser: z.number(),
  updatedBy: z.number(),
  rejectedBy: z.number(),
  inprogressBy: z.number(),
  approvedBy: z.number(),
  created_at: z.date(),
});

export type RAG = z.infer<typeof RAGSchema>;

export const RAGData = [
  {
    id: "1",
    referenceNumber: "RAG-01",
    employeeName: "Akila Manujith",
    employeeType: "New Employee",
    employeeId: "FAE-02",
    age: 10,
    gender: "Male",
    countryName: { id: 1, countryName: "India" },
    state: "Kandy",
    dateOfJoin: new Date("2023-12-31"),
    resignedDate: new Date("2023-12-31"),
    relievedDate: new Date("2023-12-31"),
    division: "Vintage Denim Pvt (Ltd.)",
    designation: "Team Manager",
    department: "Kandy",
    perDaySalary: "25000.00",
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
  },
  {
    id: "2",
    referenceNumber: "RAG-02",
    employeeName: "Nimasha Perera",
    employeeId: "FAE-05",
    gender: "Female",
    countryName: { id: 1, countryName: "Sri Lanka" },
    state: "Colombo",
    dateOfJoin: new Date("2023-12-31"),
    resignedDate: new Date("2024-03-15"),
    relievedDate: new Date("2024-04-01"),
    division: "Vintage Apparel Co.",
    designation: "HR Executive",
    department: "Human Resources",
    perDaySalary: "18000.00",
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
    perDaySalary: "22000.00",
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
    perDaySalary: "15000.00",
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
export const createRagRecord = async (data: RAG) => {
  const res = await axios.post("/api/rag-record", data);
  console.log(data);
  return res.data;
};

export const updateRagRecord = async (data: RAG) => {
  const res = await axios.post(`/api/rag-record/${data.id}/update`, data);
  console.log(data);
  return res.data;
};

export const deleteRagRecord = async (id: String) => {
  const res = await axios.delete(`/api/rag-record/${id}/delete`,);
  console.log(id);
  return res.data;
};

export const createDesignation = async (data: { designationName: string }) => {
  const res = await axios.post("/api/rag-designation-names", data);
  console.log(data);
  return res.data;
};

export const createFunction = async (data: { functionName: string }) => {
  const res = await axios.post("/api/rag-functions", data);
  console.log(data);
  return res.data;
};

export const createCountryName = async (data: { countryName: string }) => {
  const res = await axios.post("/api/rag-country-names", data);
  console.log(data);
  return res.data;
};

export const createState = async (data: {
  countryId: number;
  stateName: String;
}) => {
  console.log(data);
  const res = await axios.post(`/api/rag-state-names`, data);
  console.log(data);
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
