import axios from "axios";
import { z } from "zod";

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}

export enum Designation {
  SENOR_MANAGER = "Senior Manager",
  GENERAL_MANAGER = "General Manager",
  EXECUTIVE_DIRECTOR = "Executive Director",
  QUALITY_CONTROLLER = "Quality Controller",
  POLYMAN = "Polyman",
  IRONER = "Ironer",
  JUNIOR_IRONER = "Junior Ironer",
  STORE_KEEPER = "Store Keeper",
  SAMPLE_MAN = "Sample Man",
  JR_QUALITY_INSPECTOR = "Junior Quality Inspector",
  MACHINE_OPERATOR = "Machine Operator",
  DRY_PROCESS_TECHNICIAN = "Dry Process Technician",
  JUNIOR_OPERATOR = "Junior Operator",
  PRODUCTION_REPORTER = "Production Reporter",
  HELPER = "Helper",
  INCHARGE = "Incharge",
  ECR_MANAGER = "ECR Manager",
  MANAGER = "Manager",
  QUALITY_INSPECTOR = "Quality Inspector",
}

export enum WorkStatus {
  ON_DUTY = "On Duty",
  OFF_DUTY = "Off Duty",
}

export const DoctorSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  designation: z.string(),
  org_id: z.string(),
  email: z.string(),
  escalate_email: z.string(),
  hse_head: z.boolean(),
  gender: z.string(),
  employee_id: z.string().optional(),
  chairperson: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  publishedAt: z.date(),
  birth_date: z.date().optional(),
  corporate_user: z.boolean(),
  weekly_report: z.boolean(),
});

export type Doctor = z.infer<typeof DoctorSchema>;

export const PatientSchema = z.object({
  id: z.string(),
  employee_name: z.string(),
  employee_id: z.string(),
  designation: z.nativeEnum(Designation),
  gender: z.nativeEnum(Gender),
  department: z.string(),
  age: z.number(),
  sub_department: z.string(),
  symptoms: z.string(),
  check_in: z.date(),
  check_out: z.date().optional(),
  check_in_date: z.date(),
  check_out_date: z.date().optional(),
  time_spent: z.number().optional(),
  body_temperature: z.number().optional(),
  weight: z.number().optional(),
  severity_level: z.number().optional(),
  treatment: z.string().optional(),
  disease: z.string().optional(),
  patient_status: z.string(),
  follow_up_date: z.date().optional(),
  blood_pressure: z.string(),
  division: z.string(),
  clinic_division: z.string(),
  follow_up_status: z.boolean(),
  medicine_status: z.string(),
  height: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  publishedAt: z.date(),
  random_blood_sugar: z.string(),
  hospital_name: z.string().optional(),
  hospital_location: z.string().optional(),
  doctor_prescription: z.string().optional(),
  admitted_date: z.date().optional(),
  discharged_date: z.date().optional(),
  sent_via_ambulance: z.string().optional(),
  refer_to_another_hospital: z.string().optional(),
  since_complaint: z.string().optional(),
  recommended_duration: z.string().optional(),
  lift_usage_required: z.string().optional(),
  work_status: z.nativeEnum(WorkStatus),
  status: z.string(),
  // consulting_doctor: DoctorSchema,
  consulting_doctor: z.string(),
  createdBy: z.string(),
});

export type Patient = z.infer<typeof PatientSchema>;

export async function getPatientsList() {
  const res = await axios.get("/api/patient");
  return res.data;
}

export const createPatient = async (patient: Patient) => {
  const formData = new FormData();

  // Append each property of the patient object to the form data
  Object.keys(patient).forEach((key) => {
    const value = patient[key as keyof typeof patient];
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, JSON.stringify(item));
      });
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  const res = await axios.post("/api/patient", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const updatePatient = async (patient: Patient) => {
  const formData = new FormData();

  // Append each property of the patient object to the form data
  Object.keys(patient).forEach((key) => {
    const value = patient[key as keyof typeof patient];
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, JSON.stringify(item));
      });
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  const res = await axios.put(`/api/patient/${patient.id}/update`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deletePatient = async (id: string) => {
  const res = await axios.delete(`/api/patient/${id}/delete`);
  return res.data;
};
