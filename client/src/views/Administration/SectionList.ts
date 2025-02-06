import { z } from "zod";

export const PermissionSectionsMap: PermissionSection[] = [
  {
    mainSection: "Main",
    subSections: [
      {
        name: "Insight",
        key: "INSIGHT",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
    ],
  },
  {
    mainSection: "Administration",
    subSections: [
      {
        name: "Administration > Users",
        key: "ADMIN_USERS",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Administration > Access Management",
        key: "ADMIN_ACCESS_MNG",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
    ],
  },
  {
    mainSection: "Sustainability Apps",
    subSections: [
      {
        break: true,
        name: "Audit & Inspection",
      },
      {
        name: "Dashboard",
        key: "AUDIT_INSPECTION_DASHBOARD",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Calendar",
        key: "AUDIT_INSPECTION_CALENDAR",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Internal Audit > Register",
        key: "AUDIT_INSPECTION_INTERNAL_AUDIT_REGISTER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Internal Audit > Task",
        key: "AUDIT_INSPECTION_INTERNAL_AUDIT_TASK",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Internal Audit > Queue",
        key: "AUDIT_INSPECTION_INTERNAL_AUDIT_QUEUE",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Internal Audit > Corrective Action",
        key: "AUDIT_INSPECTION_INTERNAL_AUDIT_CORRECTIVE_ACTION",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "External Audit > Register",
        key: "AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "External Audit > Task",
        key: "AUDIT_INSPECTION_EXTERNAL_AUDIT_TASK",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "External Audit > Queue",
        key: "AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "External Audit > Corrective Action",
        key: "AUDIT_INSPECTION_EXTERNAL_AUDIT_CORRECTIVE_ACTION",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        break: true,
        name: "Sustainability",
      },
      {
        name: "SDG Reporting",
        key: "SUSTAINABILITY_SDG_REPORTING",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        break: true,
        name: "Environment",
      },
      {
        name: "Dashboard",
        key: "ENVIRONMENT_DASHBOARD",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "History > Consumption",
        key: "ENVIRONMENT_HISTORY_CONSUMPTION",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "History > Target Setting",
        key: "ENVIRONMENT_HISTORY_TARGET_SETTING",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Assigned Tasks > Consumption",
        key: "ENVIRONMENT_ASSIGNED_TASKS_CONSUMPTION",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Assigned Tasks > Target Setting",
        key: "ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        break: true,
        name: "Chemical MNG",
      },
      {
        name: "Dashboard",
        key: "CHEMICAL_MNG_DASHBOARD",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Request Register",
        key: "CHEMICAL_MNG_REQUEST_REGISTER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Purchase & Inventory",
        key: "CHEMICAL_MNG_PURCHASE_INVENTORY",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Transaction",
        key: "CHEMICAL_MNG_TRANSACTION",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Assigned Tasks",
        key: "CHEMICAL_MNG_ASSIGNED_TASKS",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
    ],
  },
  {
    mainSection: "Health & Safety Apps",
    subSections: [
      {
        name: "Hazard & Risk > Dashboard",
        key: "HAZARD_RISK_DASHBOARD",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Hazard & Risk > Register",
        key: "HAZARD_RISK_REGISTER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Hazard & Risk > Assigned Tasks",
        key: "HAZARD_RISK_ASSIGNED_TASKS",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        break: true,
        name: "Incident & Accident",
      },
      {
        name: "Dashboard",
        key: "INCIDENT_ACCIDENT_DASHBOARD",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Register > Accident",
        key: "INCIDENT_ACCIDENT_REGISTER_ACCIDENT",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Register > Incident",
        key: "INCIDENT_ACCIDENT_REGISTER_INCIDENT",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Assigned Tasks > Accident",
        key: "INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Assigned Tasks > Incident",
        key: "INCIDENT_ACCIDENT_ASSIGNED_TASKS_INCIDENT",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        break: true,
        name: "Document",
      },
      {
        name: "Register",
        key: "DOCUMENT_REGISTER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        break: true,
        name: "Occupational Health",
      },
      {
        name: "Dashboard",
        key: "OCCUPATIONAL_HEALTH_DASHBOARD",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Clinical Suite > Patient Register",
        key: "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PATIENT_REGISTER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Clinical Suite > Consultation",
        key: "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_CONSULTATION",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Clinical Suite > Medicine Stock",
        key: "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_MEDICINE_STOCK",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Clinical Suite > Pharmacy Queue",
        key: "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PHARMACY_QUEUE",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Medicine Inventory > Medicine Request",
        key: "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_MEDICINE_REQUEST",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Medicine Inventory > Purchase & Inventory",
        key: "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_PURCHASE_INVENTORY",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Medicine Inventory > Transaction",
        key: "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_TRANSACTION",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Medicine Inventory > Assigned Tasks",
        key: "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_ASSIGNED_TASKS",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
    ],
  },
  {
    mainSection: "Social Apps",
    subSections: [
      {
        name: "Grievance > Dashboard",
        key: "GRIEVANCE_DASHBOARD",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Grievance > Register",
        key: "GRIEVANCE_REGISTER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Grievance > Assigned Tasks",
        key: "GRIEVANCE_ASSIGNED_TASKS",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        break: true,
        name: "RAG",
      },
      {
        name: "Dashboard",
        key: "RAG_DASHBOARD",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Register",
        key: "RAG_REGISTER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Assigned Tasks",
        key: "RAG_ASSIGNED_TASKS",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        break: true,
        name: "Engagement",
      },
      {
        name: "Register",
        key: "ENGAGEMENT_REGISTER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        break: true,
        name: "Attrition",
      },
      {
        name: "Register",
        key: "ATTRITION_REGISTER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
    ],
  },
];

export interface PermissionSection {
  mainSection: string;
  subSections: SubSection[];
}

export interface SubSectionWithPermissions {
  name: string;
  key: string;
  permissionsExists: PermissionsExists;
}

export interface SubSectionBreak {
  break: boolean;
  name: string;
}

export type SubSection = SubSectionWithPermissions | SubSectionBreak;

export interface PermissionsExists {
  VIEW: boolean;
  CREATE: boolean;
  EDIT: boolean;
  DELETE: boolean;
}

export enum PermissionKeys {
  INSIGHT_VIEW = "INSIGHT_VIEW",
  ADMIN_USERS_VIEW = "ADMIN_USERS_VIEW",
  ADMIN_USERS_EDIT = "ADMIN_USERS_EDIT",
  ADMIN_USERS_DELETE = "ADMIN_USERS_DELETE",
  ADMIN_ACCESS_MNG_VIEW = "ADMIN_ACCESS_MNG_VIEW",
  ADMIN_ACCESS_MNG_CREATE = "ADMIN_ACCESS_MNG_CREATE",
  ADMIN_ACCESS_MNG_EDIT = "ADMIN_ACCESS_MNG_EDIT",
  ADMIN_ACCESS_MNG_DELETE = "ADMIN_ACCESS_MNG_DELETE",
  AUDIT_INSPECTION_DASHBOARD_VIEW = "AUDIT_INSPECTION_DASHBOARD_VIEW",
  AUDIT_INSPECTION_CALENDAR_VIEW = "AUDIT_INSPECTION_CALENDAR_VIEW",
  AUDIT_INSPECTION_CALENDAR_CREATE = "AUDIT_INSPECTION_CALENDAR_CREATE",
  AUDIT_INSPECTION_CALENDAR_EDIT = "AUDIT_INSPECTION_CALENDAR_EDIT",
  AUDIT_INSPECTION_CALENDAR_DELETE = "AUDIT_INSPECTION_CALENDAR_DELETE",
  AUDIT_INSPECTION_INTERNAL_AUDIT_REGISTER_VIEW = "AUDIT_INSPECTION_INTERNAL_AUDIT_REGISTER_VIEW",
  AUDIT_INSPECTION_INTERNAL_AUDIT_REGISTER_CREATE = "AUDIT_INSPECTION_INTERNAL_AUDIT_REGISTER_CREATE",
  AUDIT_INSPECTION_INTERNAL_AUDIT_REGISTER_EDIT = "AUDIT_INSPECTION_INTERNAL_AUDIT_REGISTER_EDIT",
  AUDIT_INSPECTION_INTERNAL_AUDIT_REGISTER_DELETE = "AUDIT_INSPECTION_INTERNAL_AUDIT_REGISTER_DELETE",
  AUDIT_INSPECTION_INTERNAL_AUDIT_TASK_VIEW = "AUDIT_INSPECTION_INTERNAL_AUDIT_TASK_VIEW",
  AUDIT_INSPECTION_INTERNAL_AUDIT_TASK_CREATE = "AUDIT_INSPECTION_INTERNAL_AUDIT_TASK_CREATE",
  AUDIT_INSPECTION_INTERNAL_AUDIT_TASK_EDIT = "AUDIT_INSPECTION_INTERNAL_AUDIT_TASK_EDIT",
  AUDIT_INSPECTION_INTERNAL_AUDIT_TASK_DELETE = "AUDIT_INSPECTION_INTERNAL_AUDIT_TASK_DELETE",
  AUDIT_INSPECTION_INTERNAL_AUDIT_QUEUE_VIEW = "AUDIT_INSPECTION_INTERNAL_AUDIT_QUEUE_VIEW",
  AUDIT_INSPECTION_INTERNAL_AUDIT_QUEUE_CREATE = "AUDIT_INSPECTION_INTERNAL_AUDIT_QUEUE_CREATE",
  AUDIT_INSPECTION_INTERNAL_AUDIT_QUEUE_EDIT = "AUDIT_INSPECTION_INTERNAL_AUDIT_QUEUE_EDIT",
  AUDIT_INSPECTION_INTERNAL_AUDIT_QUEUE_DELETE = "AUDIT_INSPECTION_INTERNAL_AUDIT_QUEUE_DELETE",
  AUDIT_INSPECTION_INTERNAL_AUDIT_CORRECTIVE_ACTION_VIEW = "AUDIT_INSPECTION_INTERNAL_AUDIT_CORRECTIVE_ACTION_VIEW",
  AUDIT_INSPECTION_INTERNAL_AUDIT_CORRECTIVE_ACTION_CREATE = "AUDIT_INSPECTION_INTERNAL_AUDIT_CORRECTIVE_ACTION_CREATE",
  AUDIT_INSPECTION_INTERNAL_AUDIT_CORRECTIVE_ACTION_EDIT = "AUDIT_INSPECTION_INTERNAL_AUDIT_CORRECTIVE_ACTION_EDIT",
  AUDIT_INSPECTION_INTERNAL_AUDIT_CORRECTIVE_ACTION_DELETE = "AUDIT_INSPECTION_INTERNAL_AUDIT_CORRECTIVE_ACTION_DELETE",
  AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER_VIEW = "AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER_VIEW",
  AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER_CREATE = "AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER_CREATE",
  AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER_EDIT = "AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER_EDIT",
  AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER_DELETE = "AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER_DELETE",
  AUDIT_INSPECTION_EXTERNAL_AUDIT_TASK_VIEW = "AUDIT_INSPECTION_EXTERNAL_AUDIT_TASK_VIEW",
  AUDIT_INSPECTION_EXTERNAL_AUDIT_TASK_CREATE = "AUDIT_INSPECTION_EXTERNAL_AUDIT_TASK_CREATE",
  AUDIT_INSPECTION_EXTERNAL_AUDIT_TASK_EDIT = "AUDIT_INSPECTION_EXTERNAL_AUDIT_TASK_EDIT",
  AUDIT_INSPECTION_EXTERNAL_AUDIT_TASK_DELETE = "AUDIT_INSPECTION_EXTERNAL_AUDIT_TASK_DELETE",
  AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE_VIEW = "AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE_VIEW",
  AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE_CREATE = "AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE_CREATE",
  AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE_EDIT = "AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE_EDIT",
  AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE_DELETE = "AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE_DELETE",
  AUDIT_INSPECTION_EXTERNAL_AUDIT_CORRECTIVE_ACTION_VIEW = "AUDIT_INSPECTION_EXTERNAL_AUDIT_CORRECTIVE_ACTION_VIEW",
  AUDIT_INSPECTION_EXTERNAL_AUDIT_CORRECTIVE_ACTION_CREATE = "AUDIT_INSPECTION_EXTERNAL_AUDIT_CORRECTIVE_ACTION_CREATE",
  AUDIT_INSPECTION_EXTERNAL_AUDIT_CORRECTIVE_ACTION_EDIT = "AUDIT_INSPECTION_EXTERNAL_AUDIT_CORRECTIVE_ACTION_EDIT",
  AUDIT_INSPECTION_EXTERNAL_AUDIT_CORRECTIVE_ACTION_DELETE = "AUDIT_INSPECTION_EXTERNAL_AUDIT_CORRECTIVE_ACTION_DELETE",
  SUSTAINABILITY_SDG_REPORTING_VIEW = "SUSTAINABILITY_SDG_REPORTING_VIEW",
  SUSTAINABILITY_SDG_REPORTING_CREATE = "SUSTAINABILITY_SDG_REPORTING_CREATE",
  SUSTAINABILITY_SDG_REPORTING_EDIT = "SUSTAINABILITY_SDG_REPORTING_EDIT",
  SUSTAINABILITY_SDG_REPORTING_DELETE = "SUSTAINABILITY_SDG_REPORTING_DELETE",
  ENVIRONMENT_DASHBOARD_VIEW = "ENVIRONMENT_DASHBOARD_VIEW",
  ENVIRONMENT_HISTORY_CONSUMPTION_VIEW = "ENVIRONMENT_HISTORY_CONSUMPTION_VIEW",
  ENVIRONMENT_HISTORY_CONSUMPTION_CREATE = "ENVIRONMENT_HISTORY_CONSUMPTION_CREATE",
  ENVIRONMENT_HISTORY_CONSUMPTION_EDIT = "ENVIRONMENT_HISTORY_CONSUMPTION_EDIT",
  ENVIRONMENT_HISTORY_CONSUMPTION_DELETE = "ENVIRONMENT_HISTORY_CONSUMPTION_DELETE",
  ENVIRONMENT_HISTORY_TARGET_SETTING_VIEW = "ENVIRONMENT_HISTORY_TARGET_SETTING_VIEW",
  ENVIRONMENT_HISTORY_TARGET_SETTING_CREATE = "ENVIRONMENT_HISTORY_TARGET_SETTING_CREATE",
  ENVIRONMENT_HISTORY_TARGET_SETTING_EDIT = "ENVIRONMENT_HISTORY_TARGET_SETTING_EDIT",
  ENVIRONMENT_HISTORY_TARGET_SETTING_DELETE = "ENVIRONMENT_HISTORY_TARGET_SETTING_DELETE",
  ENVIRONMENT_ASSIGNED_TASKS_CONSUMPTION_VIEW = "ENVIRONMENT_ASSIGNED_TASKS_CONSUMPTION_VIEW",
  ENVIRONMENT_ASSIGNED_TASKS_CONSUMPTION_CREATE = "ENVIRONMENT_ASSIGNED_TASKS_CONSUMPTION_CREATE",
  ENVIRONMENT_ASSIGNED_TASKS_CONSUMPTION_EDIT = "ENVIRONMENT_ASSIGNED_TASKS_CONSUMPTION_EDIT",
  ENVIRONMENT_ASSIGNED_TASKS_CONSUMPTION_DELETE = "ENVIRONMENT_ASSIGNED_TASKS_CONSUMPTION_DELETE",
  ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_VIEW = "ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_VIEW",
  ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_CREATE = "ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_CREATE",
  ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_EDIT = "ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_EDIT",
  ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_DELETE = "ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_DELETE",
  CHEMICAL_MNG_DASHBOARD_VIEW = "CHEMICAL_MNG_DASHBOARD_VIEW",
  CHEMICAL_MNG_REQUEST_REGISTER_VIEW = "CHEMICAL_MNG_REQUEST_REGISTER_VIEW",
  CHEMICAL_MNG_REQUEST_REGISTER_CREATE = "CHEMICAL_MNG_REQUEST_REGISTER_CREATE",
  CHEMICAL_MNG_REQUEST_REGISTER_EDIT = "CHEMICAL_MNG_REQUEST_REGISTER_EDIT",
  CHEMICAL_MNG_REQUEST_REGISTER_DELETE = "CHEMICAL_MNG_REQUEST_REGISTER_DELETE",
  CHEMICAL_MNG_PURCHASE_INVENTORY_VIEW = "CHEMICAL_MNG_PURCHASE_INVENTORY_VIEW",
  CHEMICAL_MNG_PURCHASE_INVENTORY_CREATE = "CHEMICAL_MNG_PURCHASE_INVENTORY_CREATE",
  CHEMICAL_MNG_PURCHASE_INVENTORY_EDIT = "CHEMICAL_MNG_PURCHASE_INVENTORY_EDIT",
  CHEMICAL_MNG_PURCHASE_INVENTORY_DELETE = "CHEMICAL_MNG_PURCHASE_INVENTORY_DELETE",
  CHEMICAL_MNG_TRANSACTION_VIEW = "CHEMICAL_MNG_TRANSACTION_VIEW",
  CHEMICAL_MNG_TRANSACTION_CREATE = "CHEMICAL_MNG_TRANSACTION_CREATE",
  CHEMICAL_MNG_TRANSACTION_EDIT = "CHEMICAL_MNG_TRANSACTION_EDIT",
  CHEMICAL_MNG_TRANSACTION_DELETE = "CHEMICAL_MNG_TRANSACTION_DELETE",
  CHEMICAL_MNG_ASSIGNED_TASKS_VIEW = "CHEMICAL_MNG_ASSIGNED_TASKS_VIEW",
  CHEMICAL_MNG_ASSIGNED_TASKS_CREATE = "CHEMICAL_MNG_ASSIGNED_TASKS_CREATE",
  CHEMICAL_MNG_ASSIGNED_TASKS_EDIT = "CHEMICAL_MNG_ASSIGNED_TASKS_EDIT",
  CHEMICAL_MNG_ASSIGNED_TASKS_DELETE = "CHEMICAL_MNG_ASSIGNED_TASKS_DELETE",
  HAZARD_RISK_DASHBOARD_VIEW = "HAZARD_RISK_DASHBOARD_VIEW",
  HAZARD_RISK_REGISTER_VIEW = "HAZARD_RISK_REGISTER_VIEW",
  HAZARD_RISK_REGISTER_CREATE = "HAZARD_RISK_REGISTER_CREATE",
  HAZARD_RISK_REGISTER_EDIT = "HAZARD_RISK_REGISTER_EDIT",
  HAZARD_RISK_REGISTER_DELETE = "HAZARD_RISK_REGISTER_DELETE",
  HAZARD_RISK_ASSIGNED_TASKS_VIEW = "HAZARD_RISK_ASSIGNED_TASKS_VIEW",
  HAZARD_RISK_ASSIGNED_TASKS_CREATE = "HAZARD_RISK_ASSIGNED_TASKS_CREATE",
  HAZARD_RISK_ASSIGNED_TASKS_EDIT = "HAZARD_RISK_ASSIGNED_TASKS_EDIT",
  HAZARD_RISK_ASSIGNED_TASKS_DELETE = "HAZARD_RISK_ASSIGNED_TASKS_DELETE",
  INCIDENT_ACCIDENT_DASHBOARD_VIEW = "INCIDENT_ACCIDENT_DASHBOARD_VIEW",
  INCIDENT_ACCIDENT_REGISTER_ACCIDENT_VIEW = "INCIDENT_ACCIDENT_REGISTER_ACCIDENT_VIEW",
  INCIDENT_ACCIDENT_REGISTER_ACCIDENT_CREATE = "INCIDENT_ACCIDENT_REGISTER_ACCIDENT_CREATE",
  INCIDENT_ACCIDENT_REGISTER_ACCIDENT_EDIT = "INCIDENT_ACCIDENT_REGISTER_ACCIDENT_EDIT",
  INCIDENT_ACCIDENT_REGISTER_ACCIDENT_DELETE = "INCIDENT_ACCIDENT_REGISTER_ACCIDENT_DELETE",
  INCIDENT_ACCIDENT_REGISTER_INCIDENT_VIEW = "INCIDENT_ACCIDENT_REGISTER_INCIDENT_VIEW",
  INCIDENT_ACCIDENT_REGISTER_INCIDENT_CREATE = "INCIDENT_ACCIDENT_REGISTER_INCIDENT_CREATE",
  INCIDENT_ACCIDENT_REGISTER_INCIDENT_EDIT = "INCIDENT_ACCIDENT_REGISTER_INCIDENT_EDIT",
  INCIDENT_ACCIDENT_REGISTER_INCIDENT_DELETE = "INCIDENT_ACCIDENT_REGISTER_INCIDENT_DELETE",
  INCIDENT_ACCIDENT_CORRECTIVE_ACTION_VIEW = "INCIDENT_ACCIDENT_CORRECTIVE_ACTION_VIEW",
  INCIDENT_ACCIDENT_CORRECTIVE_ACTION_CREATE = "INCIDENT_ACCIDENT_CORRECTIVE_ACTION_CREATE",
  INCIDENT_ACCIDENT_CORRECTIVE_ACTION_EDIT = "INCIDENT_ACCIDENT_CORRECTIVE_ACTION_EDIT",
  INCIDENT_ACCIDENT_CORRECTIVE_ACTION_DELETE = "INCIDENT_ACCIDENT_CORRECTIVE_ACTION_DELETE",
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT_VIEW = "INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT_VIEW",
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT_CREATE = "INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT_CREATE",
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT_EDIT = "INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT_EDIT",
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT_DELETE = "INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT_DELETE",
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_INCIDENT_VIEW = "INCIDENT_ACCIDENT_ASSIGNED_TASKS_INCIDENT_VIEW",
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_INCIDENT_CREATE = "INCIDENT_ACCIDENT_ASSIGNED_TASKS_INCIDENT_CREATE",
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_INCIDENT_EDIT = "INCIDENT_ACCIDENT_ASSIGNED_TASKS_INCIDENT_EDIT",
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_INCIDENT_DELETE = "INCIDENT_ACCIDENT_ASSIGNED_TASKS_INCIDENT_DELETE",
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_CORRECTIVE_ACTION_VIEW = "INCIDENT_ACCIDENT_ASSIGNED_TASKS_CORRECTIVE_ACTION_VIEW",
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_CORRECTIVE_ACTION_CREATE = "INCIDENT_ACCIDENT_ASSIGNED_TASKS_CORRECTIVE_ACTION_CREATE",
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_CORRECTIVE_ACTION_EDIT = "INCIDENT_ACCIDENT_ASSIGNED_TASKS_CORRECTIVE_ACTION_EDIT",
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_CORRECTIVE_ACTION_DELETE = "INCIDENT_ACCIDENT_ASSIGNED_TASKS_CORRECTIVE_ACTION_DELETE",
  DOCUMENT_REGISTER_VIEW = "DOCUMENT_REGISTER_VIEW",
  DOCUMENT_REGISTER_CREATE = "DOCUMENT_REGISTER_CREATE",
  DOCUMENT_REGISTER_EDIT = "DOCUMENT_REGISTER_EDIT",
  DOCUMENT_REGISTER_DELETE = "DOCUMENT_REGISTER_DELETE",
  OCCUPATIONAL_HEALTH_DASHBOARD_VIEW = "OCCUPATIONAL_HEALTH_DASHBOARD_VIEW",
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PATIENT_REGISTER_VIEW = "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PATIENT_REGISTER_VIEW",
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PATIENT_REGISTER_CREATE = "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PATIENT_REGISTER_CREATE",
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PATIENT_REGISTER_EDIT = "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PATIENT_REGISTER_EDIT",
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PATIENT_REGISTER_DELETE = "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PATIENT_REGISTER_DELETE",
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_CONSULTATION_VIEW = "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_CONSULTATION_VIEW",
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_CONSULTATION_CREATE = "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_CONSULTATION_CREATE",
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_CONSULTATION_EDIT = "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_CONSULTATION_EDIT",
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_CONSULTATION_DELETE = "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_CONSULTATION_DELETE",
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_MEDICINE_STOCK_VIEW = "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_MEDICINE_STOCK_VIEW",
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_MEDICINE_STOCK_CREATE = "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_MEDICINE_STOCK_CREATE",
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_MEDICINE_STOCK_EDIT = "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_MEDICINE_STOCK_EDIT",
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_MEDICINE_STOCK_DELETE = "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_MEDICINE_STOCK_DELETE",
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PHARMACY_QUEUE_VIEW = "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PHARMACY_QUEUE_VIEW",
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PHARMACY_QUEUE_CREATE = "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PHARMACY_QUEUE_CREATE",
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PHARMACY_QUEUE_EDIT = "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PHARMACY_QUEUE_EDIT",
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PHARMACY_QUEUE_DELETE = "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PHARMACY_QUEUE_DELETE",
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_MEDICINE_REQUEST_VIEW = "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_MEDICINE_REQUEST_VIEW",
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_MEDICINE_REQUEST_CREATE = "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_MEDICINE_REQUEST_CREATE",
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_MEDICINE_REQUEST_EDIT = "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_MEDICINE_REQUEST_EDIT",
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_MEDICINE_REQUEST_DELETE = "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_MEDICINE_REQUEST_DELETE",
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_PURCHASE_INVENTORY_VIEW = "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_PURCHASE_INVENTORY_VIEW",
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_PURCHASE_INVENTORY_CREATE = "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_PURCHASE_INVENTORY_CREATE",
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_PURCHASE_INVENTORY_EDIT = "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_PURCHASE_INVENTORY_EDIT",
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_PURCHASE_INVENTORY_DELETE = "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_PURCHASE_INVENTORY_DELETE",
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_TRANSACTION_VIEW = "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_TRANSACTION_VIEW",
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_TRANSACTION_CREATE = "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_TRANSACTION_CREATE",
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_TRANSACTION_EDIT = "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_TRANSACTION_EDIT",
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_TRANSACTION_DELETE = "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_TRANSACTION_DELETE",
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_ASSIGNED_TASKS_VIEW = "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_ASSIGNED_TASKS_VIEW",
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_ASSIGNED_TASKS_CREATE = "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_ASSIGNED_TASKS_CREATE",
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_ASSIGNED_TASKS_EDIT = "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_ASSIGNED_TASKS_EDIT",
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_ASSIGNED_TASKS_DELETE = "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_ASSIGNED_TASKS_DELETE",
  OCCUPATIONAL_HEALTH_MEDICAL_RECORDS_MATERNITY_REGISTER_VIEW = "OCCUPATIONAL_HEALTH_MEDICAL_RECORDS_MATERNITY_REGISTER_VIEW",
  OCCUPATIONAL_HEALTH_MEDICAL_RECORDS_MATERNITY_REGISTER_CREATE = "OCCUPATIONAL_HEALTH_MEDICAL_RECORDS_MATERNITY_REGISTER_CREATE",
  OCCUPATIONAL_HEALTH_MEDICAL_RECORDS_MATERNITY_REGISTER_EDIT = "OCCUPATIONAL_HEALTH_MEDICAL_RECORDS_MATERNITY_REGISTER_EDIT",
  OCCUPATIONAL_HEALTH_MEDICAL_RECORDS_MATERNITY_REGISTER_DELETE = "OCCUPATIONAL_HEALTH_MEDICAL_RECORDS_MATERNITY_REGISTER_DELETE",
  GRIEVANCE_DASHBOARD_VIEW = "GRIEVANCE_DASHBOARD_VIEW",
  GRIEVANCE_REGISTER_VIEW = "GRIEVANCE_REGISTER_VIEW",
  GRIEVANCE_REGISTER_CREATE = "GRIEVANCE_REGISTER_CREATE",
  GRIEVANCE_REGISTER_EDIT = "GRIEVANCE_REGISTER_EDIT",
  GRIEVANCE_REGISTER_DELETE = "GRIEVANCE_REGISTER_DELETE",
  GRIEVANCE_ASSIGNED_TASKS_VIEW = "GRIEVANCE_ASSIGNED_TASKS_VIEW",
  GRIEVANCE_ASSIGNED_TASKS_CREATE = "GRIEVANCE_ASSIGNED_TASKS_CREATE",
  GRIEVANCE_ASSIGNED_TASKS_EDIT = "GRIEVANCE_ASSIGNED_TASKS_EDIT",
  GRIEVANCE_ASSIGNED_TASKS_DELETE = "GRIEVANCE_ASSIGNED_TASKS_DELETE",
  RAG_DASHBOARD_VIEW = "RAG_DASHBOARD_VIEW",
  RAG_REGISTER_VIEW = "RAG_REGISTER_VIEW",
  RAG_REGISTER_CREATE = "RAG_REGISTER_CREATE",
  RAG_REGISTER_EDIT = "RAG_REGISTER_EDIT",
  RAG_REGISTER_DELETE = "RAG_REGISTER_DELETE",
  RAG_ASSIGNED_TASKS_VIEW = "RAG_ASSIGNED_TASKS_VIEW",
  RAG_ASSIGNED_TASKS_CREATE = "RAG_ASSIGNED_TASKS_CREATE",
  RAG_ASSIGNED_TASKS_EDIT = "RAG_ASSIGNED_TASKS_EDIT",
  RAG_ASSIGNED_TASKS_DELETE = "RAG_ASSIGNED_TASKS_DELETE",
  ENGAGEMENT_REGISTER_VIEW = "ENGAGEMENT_REGISTER_VIEW",
  ENGAGEMENT_REGISTER_CREATE = "ENGAGEMENT_REGISTER_CREATE",
  ENGAGEMENT_REGISTER_EDIT = "ENGAGEMENT_REGISTER_EDIT",
  ENGAGEMENT_REGISTER_DELETE = "ENGAGEMENT_REGISTER_DELETE",
  ATTRITION_REGISTER_VIEW = "ATTRITION_REGISTER_VIEW",
  ATTRITION_REGISTER_CREATE = "ATTRITION_REGISTER_CREATE",
  ATTRITION_REGISTER_EDIT = "ATTRITION_REGISTER_EDIT",
  ATTRITION_REGISTER_DELETE = "ATTRITION_REGISTER_DELETE",
  SATISFACTION_SURVEY_VIEW = "SATISFACTION_SURVEY_VIEW",
  SATISFACTION_SURVEY_CREATE = "SATISFACTION_SURVEY_CREATE",
  SATISFACTION_SURVEY_EDIT = "SATISFACTION_SURVEY_EDIT",
  SATISFACTION_SURVEY_DELETE = "SATISFACTION_SURVEY_DELETE",
}

// Create the Zod schema using the enum values
export const PermissionKeysObjectSchema = z.object(
  Object.values(PermissionKeys).reduce((acc, key) => {
    acc[key] = z.boolean();
    return acc;
  }, {} as Record<PermissionKeys, z.ZodBoolean>)
);

// Infer the TypeScript type from the Zod schema
export type PermissionKeysObject = z.infer<typeof PermissionKeysObjectSchema>;

export const defaultAdminPermissions = Object.values(PermissionKeys).reduce(
  (acc, key) => {
    acc[key] = true;
    return acc;
  },
  {} as Record<PermissionKeys, boolean>
);

export const defaultViewerPermissions: PermissionKeysObject = {
  INSIGHT_VIEW: true,
  ADMIN_USERS_VIEW: true,
  ADMIN_USERS_EDIT: true,
  ADMIN_USERS_DELETE: true,
  ADMIN_ACCESS_MNG_VIEW: true,
  ADMIN_ACCESS_MNG_CREATE: true,
  ADMIN_ACCESS_MNG_EDIT: true,
  ADMIN_ACCESS_MNG_DELETE: true,
  AUDIT_INSPECTION_DASHBOARD_VIEW: true,
  AUDIT_INSPECTION_CALENDAR_VIEW: true,
  AUDIT_INSPECTION_CALENDAR_CREATE: true,
  AUDIT_INSPECTION_CALENDAR_EDIT: true,
  AUDIT_INSPECTION_CALENDAR_DELETE: true,
  AUDIT_INSPECTION_INTERNAL_AUDIT_REGISTER_VIEW: true,
  AUDIT_INSPECTION_INTERNAL_AUDIT_REGISTER_CREATE: true,
  AUDIT_INSPECTION_INTERNAL_AUDIT_REGISTER_EDIT: true,
  AUDIT_INSPECTION_INTERNAL_AUDIT_REGISTER_DELETE: true,
  AUDIT_INSPECTION_INTERNAL_AUDIT_TASK_VIEW: true,
  AUDIT_INSPECTION_INTERNAL_AUDIT_TASK_CREATE: true,
  AUDIT_INSPECTION_INTERNAL_AUDIT_TASK_EDIT: true,
  AUDIT_INSPECTION_INTERNAL_AUDIT_TASK_DELETE: true,
  AUDIT_INSPECTION_INTERNAL_AUDIT_QUEUE_VIEW: true,
  AUDIT_INSPECTION_INTERNAL_AUDIT_QUEUE_CREATE: true,
  AUDIT_INSPECTION_INTERNAL_AUDIT_QUEUE_EDIT: true,
  AUDIT_INSPECTION_INTERNAL_AUDIT_QUEUE_DELETE: true,
  AUDIT_INSPECTION_INTERNAL_AUDIT_CORRECTIVE_ACTION_VIEW: true,
  AUDIT_INSPECTION_INTERNAL_AUDIT_CORRECTIVE_ACTION_CREATE: true,
  AUDIT_INSPECTION_INTERNAL_AUDIT_CORRECTIVE_ACTION_EDIT: true,
  AUDIT_INSPECTION_INTERNAL_AUDIT_CORRECTIVE_ACTION_DELETE: true,
  AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER_VIEW: true,
  AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER_CREATE: true,
  AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER_EDIT: true,
  AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER_DELETE: true,
  AUDIT_INSPECTION_EXTERNAL_AUDIT_TASK_VIEW: true,
  AUDIT_INSPECTION_EXTERNAL_AUDIT_TASK_CREATE: true,
  AUDIT_INSPECTION_EXTERNAL_AUDIT_TASK_EDIT: true,
  AUDIT_INSPECTION_EXTERNAL_AUDIT_TASK_DELETE: true,
  AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE_VIEW: true,
  AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE_CREATE: true,
  AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE_EDIT: true,
  AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE_DELETE: true,
  AUDIT_INSPECTION_EXTERNAL_AUDIT_CORRECTIVE_ACTION_VIEW: true,
  AUDIT_INSPECTION_EXTERNAL_AUDIT_CORRECTIVE_ACTION_CREATE: true,
  AUDIT_INSPECTION_EXTERNAL_AUDIT_CORRECTIVE_ACTION_EDIT: true,
  AUDIT_INSPECTION_EXTERNAL_AUDIT_CORRECTIVE_ACTION_DELETE: true,
  SUSTAINABILITY_SDG_REPORTING_VIEW: true,
  SUSTAINABILITY_SDG_REPORTING_CREATE: true,
  SUSTAINABILITY_SDG_REPORTING_EDIT: true,
  SUSTAINABILITY_SDG_REPORTING_DELETE: true,
  ENVIRONMENT_DASHBOARD_VIEW: true,
  ENVIRONMENT_HISTORY_CONSUMPTION_VIEW: true,
  ENVIRONMENT_HISTORY_CONSUMPTION_CREATE: true,
  ENVIRONMENT_HISTORY_CONSUMPTION_EDIT: true,
  ENVIRONMENT_HISTORY_CONSUMPTION_DELETE: true,
  ENVIRONMENT_HISTORY_TARGET_SETTING_VIEW: true,
  ENVIRONMENT_HISTORY_TARGET_SETTING_CREATE: true,
  ENVIRONMENT_HISTORY_TARGET_SETTING_EDIT: true,
  ENVIRONMENT_HISTORY_TARGET_SETTING_DELETE: true,
  ENVIRONMENT_ASSIGNED_TASKS_CONSUMPTION_VIEW: true,
  ENVIRONMENT_ASSIGNED_TASKS_CONSUMPTION_CREATE: true,
  ENVIRONMENT_ASSIGNED_TASKS_CONSUMPTION_EDIT: true,
  ENVIRONMENT_ASSIGNED_TASKS_CONSUMPTION_DELETE: true,
  ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_VIEW: true,
  ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_CREATE: true,
  ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_EDIT: true,
  ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_DELETE: true,
  CHEMICAL_MNG_DASHBOARD_VIEW: true,
  CHEMICAL_MNG_REQUEST_REGISTER_VIEW: true,
  CHEMICAL_MNG_REQUEST_REGISTER_CREATE: true,
  CHEMICAL_MNG_REQUEST_REGISTER_EDIT: true,
  CHEMICAL_MNG_REQUEST_REGISTER_DELETE: true,
  CHEMICAL_MNG_PURCHASE_INVENTORY_VIEW: true,
  CHEMICAL_MNG_PURCHASE_INVENTORY_CREATE: true,
  CHEMICAL_MNG_PURCHASE_INVENTORY_EDIT: true,
  CHEMICAL_MNG_PURCHASE_INVENTORY_DELETE: true,
  CHEMICAL_MNG_TRANSACTION_VIEW: true,
  CHEMICAL_MNG_TRANSACTION_CREATE: true,
  CHEMICAL_MNG_TRANSACTION_EDIT: true,
  CHEMICAL_MNG_TRANSACTION_DELETE: true,
  CHEMICAL_MNG_ASSIGNED_TASKS_VIEW: true,
  CHEMICAL_MNG_ASSIGNED_TASKS_CREATE: true,
  CHEMICAL_MNG_ASSIGNED_TASKS_EDIT: true,
  CHEMICAL_MNG_ASSIGNED_TASKS_DELETE: true,
  HAZARD_RISK_DASHBOARD_VIEW: true,
  HAZARD_RISK_REGISTER_VIEW: true,
  HAZARD_RISK_REGISTER_CREATE: false,
  HAZARD_RISK_REGISTER_EDIT: true,
  HAZARD_RISK_REGISTER_DELETE: true,
  HAZARD_RISK_ASSIGNED_TASKS_VIEW: true,
  HAZARD_RISK_ASSIGNED_TASKS_CREATE: true,
  HAZARD_RISK_ASSIGNED_TASKS_EDIT: true,
  HAZARD_RISK_ASSIGNED_TASKS_DELETE: true,
  INCIDENT_ACCIDENT_DASHBOARD_VIEW: true,
  INCIDENT_ACCIDENT_REGISTER_ACCIDENT_VIEW: true,
  INCIDENT_ACCIDENT_REGISTER_ACCIDENT_CREATE: true,
  INCIDENT_ACCIDENT_REGISTER_ACCIDENT_EDIT: true,
  INCIDENT_ACCIDENT_REGISTER_ACCIDENT_DELETE: true,
  INCIDENT_ACCIDENT_REGISTER_INCIDENT_VIEW: true,
  INCIDENT_ACCIDENT_REGISTER_INCIDENT_CREATE: true,
  INCIDENT_ACCIDENT_REGISTER_INCIDENT_EDIT: true,
  INCIDENT_ACCIDENT_REGISTER_INCIDENT_DELETE: true,
  INCIDENT_ACCIDENT_CORRECTIVE_ACTION_VIEW: true,
  INCIDENT_ACCIDENT_CORRECTIVE_ACTION_CREATE: true,
  INCIDENT_ACCIDENT_CORRECTIVE_ACTION_EDIT: true,
  INCIDENT_ACCIDENT_CORRECTIVE_ACTION_DELETE: true,
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT_VIEW: true,
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT_CREATE: true,
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT_EDIT: true,
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT_DELETE: true,
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_INCIDENT_VIEW: true,
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_INCIDENT_EDIT: true,
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_INCIDENT_CREATE: true,
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_INCIDENT_DELETE: true,
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_CORRECTIVE_ACTION_VIEW: true,
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_CORRECTIVE_ACTION_EDIT: true,
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_CORRECTIVE_ACTION_CREATE: true,
  INCIDENT_ACCIDENT_ASSIGNED_TASKS_CORRECTIVE_ACTION_DELETE: true,
  DOCUMENT_REGISTER_VIEW: true,
  DOCUMENT_REGISTER_CREATE: true,
  DOCUMENT_REGISTER_EDIT: true,
  DOCUMENT_REGISTER_DELETE: true,
  OCCUPATIONAL_HEALTH_DASHBOARD_VIEW: true,
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PATIENT_REGISTER_VIEW: true,
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PATIENT_REGISTER_CREATE: true,
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PATIENT_REGISTER_EDIT: true,
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PATIENT_REGISTER_DELETE: true,
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_CONSULTATION_VIEW: true,
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_CONSULTATION_CREATE: true,
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_CONSULTATION_EDIT: true,
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_CONSULTATION_DELETE: true,
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_MEDICINE_STOCK_VIEW: true,
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_MEDICINE_STOCK_CREATE: true,
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_MEDICINE_STOCK_EDIT: true,
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_MEDICINE_STOCK_DELETE: true,
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PHARMACY_QUEUE_VIEW: true,
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PHARMACY_QUEUE_CREATE: true,
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PHARMACY_QUEUE_EDIT: true,
  OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PHARMACY_QUEUE_DELETE: true,
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_MEDICINE_REQUEST_VIEW: true,
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_MEDICINE_REQUEST_CREATE: true,
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_MEDICINE_REQUEST_EDIT: true,
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_MEDICINE_REQUEST_DELETE: true,
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_PURCHASE_INVENTORY_VIEW: true,
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_PURCHASE_INVENTORY_CREATE: true,
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_PURCHASE_INVENTORY_EDIT: true,
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_PURCHASE_INVENTORY_DELETE: true,
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_TRANSACTION_VIEW: true,
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_TRANSACTION_CREATE: true,
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_TRANSACTION_EDIT: true,
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_TRANSACTION_DELETE: true,
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_ASSIGNED_TASKS_VIEW: true,
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_ASSIGNED_TASKS_CREATE: true,
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_ASSIGNED_TASKS_EDIT: true,
  OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_ASSIGNED_TASKS_DELETE: true,
  GRIEVANCE_DASHBOARD_VIEW: true,
  GRIEVANCE_REGISTER_VIEW: true,
  GRIEVANCE_REGISTER_CREATE: true,
  GRIEVANCE_REGISTER_EDIT: true,
  GRIEVANCE_REGISTER_DELETE: true,
  GRIEVANCE_ASSIGNED_TASKS_VIEW: true,
  GRIEVANCE_ASSIGNED_TASKS_CREATE: true,
  GRIEVANCE_ASSIGNED_TASKS_EDIT: true,
  GRIEVANCE_ASSIGNED_TASKS_DELETE: true,
  RAG_DASHBOARD_VIEW: true,
  RAG_REGISTER_VIEW: true,
  RAG_REGISTER_CREATE: true,
  RAG_REGISTER_EDIT: true,
  RAG_REGISTER_DELETE: true,
  RAG_ASSIGNED_TASKS_VIEW: true,
  RAG_ASSIGNED_TASKS_CREATE: true,
  RAG_ASSIGNED_TASKS_EDIT: true,
  RAG_ASSIGNED_TASKS_DELETE: true,
  ENGAGEMENT_REGISTER_VIEW: true,
  ENGAGEMENT_REGISTER_CREATE: true,
  ENGAGEMENT_REGISTER_EDIT: true,
  ENGAGEMENT_REGISTER_DELETE: true,
  ATTRITION_REGISTER_VIEW: true,
  ATTRITION_REGISTER_CREATE: true,
  ATTRITION_REGISTER_EDIT: true,
  ATTRITION_REGISTER_DELETE: true,
  SATISFACTION_SURVEY_VIEW: true,
  SATISFACTION_SURVEY_CREATE: true,
  SATISFACTION_SURVEY_EDIT: true,
  SATISFACTION_SURVEY_DELETE: true,
};
