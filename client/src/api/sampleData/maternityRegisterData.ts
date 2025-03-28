import {
  LeaveStatus,
  MaternityRegister,
} from "../OccupationalHealth/maternityRegisterApi";

export const sampleMaternityBenefitTypes = [
  "Maternity Leave",
  "Financial Aid",
  "Medical Support",
  "Other",
];

export const sampleMaternityRegisterData: MaternityRegister[] = [
  {
    id: "1",
    employeeId: "04707",
    employeeName: "Mst. Sumaya Khatun",
    age: "27",
    contactNumber: "1747818405",
    designation: "Helper",
    department: "Sewing",
    supervisorOrManager: "Md Mahafuj Islam",
    dateOfJoin: new Date("2018-01-11"),
    averageWages: "87486",
    applicationId: "3",
    applicationDate: new Date("2024-07-01"),
    expectedDeliveryDate: new Date("2024-09-01"),
    leaveStartDate: new Date("2024-07-08"),
    leaveEndDate: new Date("2024-10-27"),
    actualDeliveryDate: new Date("2024-08-20"),
    leaveStatus: LeaveStatus.PENDING,
    noticeDateAfterDelivery: new Date("2024-10-28"),
    reJoinDate: new Date("2024-10-28"),
    supportProvider: "",
    created_at: "2024-11-20T10:54:35.470Z",
    updated_at: "2024-11-20T10:54:35.470Z",
    publishedAt: "2024-11-20T10:54:35.466Z",
    signature: "Sumaya",
    remarks: "",
    createdDate: new Date("2024-11-20"),
    status: "Completed",
    benefitsAndEntitlements: [],
    medicalDocuments: [],
    division: "Sewing",
  },
  {
    id: "2",
    employeeId: "04708",
    employeeName: "John Doe",
    age: "30",
    contactNumber: "1234567890",
    designation: "Technician",
    department: "Maintenance",
    supervisorOrManager: "Jane Smith",
    dateOfJoin: new Date("2017-05-15"),
    averageWages: "95000",
    applicationId: "4",
    applicationDate: new Date("2024-06-15"),
    expectedDeliveryDate: new Date("2024-08-15"),
    leaveStartDate: new Date("2024-06-20"),
    leaveEndDate: new Date("2024-09-20"),
    actualDeliveryDate: new Date("2024-08-10"),
    leaveStatus: LeaveStatus.APPROVED,
    noticeDateAfterDelivery: new Date("2024-09-21"),
    reJoinDate: new Date("2024-09-21"),
    supportProvider: "Financial Aid",
    created_at: "2024-11-21T11:00:00.000Z",
    updated_at: "2024-11-21T11:00:00.000Z",
    publishedAt: "2024-11-21T11:00:00.000Z",
    signature: "John",
    remarks: "N/A",
    createdDate: new Date("2024-11-21"),
    status: "In Progress",
    benefitsAndEntitlements: [],
    medicalDocuments: [],
    division: "Maintenance",
  },
];

