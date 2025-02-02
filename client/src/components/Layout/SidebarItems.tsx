import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import LayersIcon from "@mui/icons-material/Layers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import SpaIcon from "@mui/icons-material/Spa";
import ForestIcon from "@mui/icons-material/Forest";
import ScienceIcon from "@mui/icons-material/Science";
import EmergencyIcon from "@mui/icons-material/Emergency";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import FolderIcon from "@mui/icons-material/Folder";
import ConstructionIcon from "@mui/icons-material/Construction";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PollOutlinedIcon from "@mui/icons-material/PollOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import DatasetLinkedOutlinedIcon from "@mui/icons-material/DatasetLinkedOutlined";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import KeyIcon from "@mui/icons-material/Key";
import { PermissionKeys } from "../../views/Administration/SectionList";

export interface SidebarItem {
  title?: string;
  headline?: string;
  icon?: JSX.Element;
  open?: boolean;
  href?: string;
  disabled?: boolean;
  accessKey?: string;
  nestedItems?: {
    title: string;
    href: string;
    icon: JSX.Element;
    accessKey?: string;
    open?: boolean;
    disabled?: boolean;
    nestedItems?: {
      accessKey?: string;
      title: string;
      href: string;
      icon: JSX.Element;
      disabled?: boolean;
    }[];
  }[];
}

export const sidebarItems: Array<SidebarItem> = [
  {
    headline: "Main",
  },
  {
    title: "Insight",
    href: "/home",
    icon: <HomeIcon fontSize="small" />,
    accessKey: PermissionKeys.INSIGHT_VIEW,
    // Add the data-cy attribute here
  },
  {
    headline: "Administration",
  },
  {
    title: "Users",
    icon: <PeopleAltIcon fontSize="small" />,
    href: "/admin/users",
    accessKey: PermissionKeys.ADMIN_USERS_VIEW,
  },
  {
    title: "Access Management",
    icon: <KeyIcon fontSize="small" />,
    href: "/admin/access-management",
    accessKey: PermissionKeys.ADMIN_ACCESS_MNG_VIEW,
  },
  {
    headline: "Sustainability Apps",
  },
  {
    title: "Audit & Inspection",
    icon: <LayersIcon fontSize="small" />,
    href: "/audit-inspection",
    open: false,
    disabled: true,
    nestedItems: [
      {
        title: "Dashboard",
        href: "/audit-inspection/dashboard",
        icon: <DashboardIcon fontSize="small" />,
        accessKey: PermissionKeys.AUDIT_INSPECTION_DASHBOARD_VIEW,
      },
      {
        title: "Calendar",
        href: "/audit-inspection/calendar",
        icon: <CalendarMonthIcon fontSize="small" />,
        accessKey: PermissionKeys.AUDIT_INSPECTION_CALENDAR_VIEW,
      },
      {
        title: "Internal Audit",
        href: "/audit-inspection/internal-audit",
        icon: <QueryStatsIcon fontSize="small" />,
        accessKey: PermissionKeys.AUDIT_INSPECTION_INTERNAL_AUDIT_QUEUE_VIEW,
      },
      {
        title: "External Audit",
        href: "/audit-inspection/external-audit",
        icon: <TravelExploreIcon fontSize="small" />,
        accessKey: PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE_VIEW,
      },
    ],
  },
  {
    title: "Sustainability",
    href: "/sustainability",
    icon: <SpaIcon fontSize="small" />,
    disabled: true,
    nestedItems: [
      {
        title: "Register",
        href: "/sustainability/register",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.SUSTAINABILITY_SDG_REPORTING_VIEW,
      },
    ],
  },
  {
    title: "Environment",
    href: "/environment",
    icon: <ForestIcon fontSize="small" />,
    disabled: true,
    nestedItems: [
      {
        title: "Dashboard",
        href: "/environment/dashboard",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.ENVIRONMENT_DASHBOARD_VIEW,
      },
      {
        title: "History",
        href: "/environment/history",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        nestedItems: [
          {
            title: "Consumption",
            href: "/environment/history/consumption",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey: PermissionKeys.ENVIRONMENT_HISTORY_CONSUMPTION_VIEW,
          },
          {
            title: "Target Setting",
            href: "/environment/history/target-setting",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey: PermissionKeys.ENVIRONMENT_HISTORY_TARGET_SETTING_VIEW,
          },
        ],
      },
      {
        title: "Assigned Tasks",
        href: "/environment/assigned-tasks",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        disabled: true,
        nestedItems: [
          {
            title: "Consumption",
            href: "/environment/assigned-tasks/consumption",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey:
              PermissionKeys.ENVIRONMENT_ASSIGNED_TASKS_CONSUMPTION_VIEW,
          },
          {
            title: "Target Setting",
            href: "/environment/assigned-tasks/target-setting",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey:
              PermissionKeys.ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_VIEW,
          },
        ],
      },
    ],
  },
  {
    title: "Chemical MNG",
    href: "/chemical-mng",
    icon: <ScienceIcon fontSize="small" />,
    disabled: true,
    nestedItems: [
      {
        title: "Dashboard",
        href: "/chemical-mng/dashboard",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.CHEMICAL_MNG_DASHBOARD_VIEW,
      },
      {
        title: "Request History",
        href: "/chemical-mng/request-history",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.CHEMICAL_MNG_REQUEST_REGISTER_VIEW,
      },
      {
        title: "Purchase & Inventory",
        href: "/chemical-mng/purchase-inventory",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.CHEMICAL_MNG_PURCHASE_INVENTORY_VIEW,
      },
      {
        title: "Transaction",
        href: "/chemical-mng/transaction",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.CHEMICAL_MNG_TRANSACTION_VIEW,
      },
      {
        title: "Assigned Tasks",
        href: "/chemical-mng/assigned-tasks",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.CHEMICAL_MNG_ASSIGNED_TASKS_VIEW,
      },
    ],
  },
  {
    headline: "Health & Safety Apps",
  },
  {
    title: "Hazard & Risk",
    href: "/hazard-risk",
    icon: <EmergencyIcon fontSize="small" />,
    nestedItems: [
      {
        title: "Dashboard",
        href: "/hazard-risk/dashboard",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.HAZARD_RISK_DASHBOARD_VIEW,
      },
      {
        title: "History",
        href: "/hazard-risk/history",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.HAZARD_RISK_REGISTER_VIEW,
      },
      {
        title: "Assigned Tasks",
        href: "/hazard-risk/assigned-tasks",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.HAZARD_RISK_ASSIGNED_TASKS_VIEW,
      },
    ],
  },
  {
    title: "Accident & Incident",
    href: "/accident-incident",
    icon: <ChangeHistoryIcon fontSize="small" />,
    nestedItems: [
      {
        title: "Dashboard",
        href: "/accident-incident/dashboard",
        icon: <DashboardIcon fontSize="small" />,
        accessKey: PermissionKeys.INCIDENT_ACCIDENT_DASHBOARD_VIEW,
      },
      {
        title: "Register",
        href: "/accident-incident/register",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        nestedItems: [
          {
            title: "Accident Register",
            href: "/accident-incident/register/accident-register",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey: PermissionKeys.INCIDENT_ACCIDENT_REGISTER_ACCIDENT_VIEW,
          },
          {
            title: "Incident Register",
            href: "/accident-incident/register/incident-register",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey: PermissionKeys.INCIDENT_ACCIDENT_REGISTER_INCIDENT_VIEW,
          },
          {
            title: "Corrective Action",
            href: "/accident-incident/register/corrective-action",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey: PermissionKeys.INCIDENT_ACCIDENT_CORRECTIVE_ACTION_VIEW,
          },
        ],
      },

      {
        title: "Assigned Tasks",
        href: "/accident-incident/assigned-tasks",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        nestedItems: [
          {
            title: "Accident Assigned",
            href: "/accident-incident/assigned-tasks/accident-assigned",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey:
              PermissionKeys.INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT_VIEW,
          },
          {
            title: "Incident Assigned",
            href: "/accident-incident/assigned-tasks/incident-assigned",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey:
              PermissionKeys.INCIDENT_ACCIDENT_ASSIGNED_TASKS_INCIDENT_VIEW,
          },
          {
            title: "Corrective Action",
            href: "/accident-incident/assigned-tasks/corrective-action",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey:
              PermissionKeys.INCIDENT_ACCIDENT_ASSIGNED_TASKS_CORRECTIVE_ACTION_VIEW,
          },
        ],
      },
    ],
  },
  {
    title: "Document",
    href: "/document",
    icon: <FolderIcon fontSize="small" />,
    accessKey: PermissionKeys.DOCUMENT_REGISTER_EDIT,
  },
  {
    title: "Equipment MNG",
    href: "/equipment-mng",
    icon: <ConstructionIcon fontSize="small" />,
    disabled: true,
    nestedItems: [
      {
        title: "Equipment",
        href: "/equipment-mng/equipment",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        nestedItems: [
          {
            title: "Register",
            href: "/equipment-mng/equipment/register",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
          },
          {
            title: "Create",
            href: "/equipment-mng/equipment/create",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
          },
        ],
      },
      {
        title: "Client",
        href: "/equipment-mng/client",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
      },
      {
        title: "GEO Tag",
        href: "/equipment-mng/geo-tag",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
      },
      {
        title: "Inspection Template",
        href: "/equipment-mng/inspection-template",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
      },
    ],
  },
  {
    title: "Occupational Health",
    href: "/occupational-health",
    icon: <FavoriteBorderIcon fontSize="small" />,
    disabled: false,
    nestedItems: [
      {
        title: "Dashboard",
        href: "/occupational-health/dashboard",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.OCCUPATIONAL_HEALTH_DASHBOARD_VIEW,
      },
      {
        title: "Clinical Suite",
        href: "/occupational-health/clinical-suite",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        nestedItems: [
          {
            title: "Patient Register",
            href: "/occupational-health/clinical-suite/patient-register",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey:
              PermissionKeys.OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PATIENT_REGISTER_VIEW,
          },
          {
            title: "Consultation",
            href: "/occupational-health/clinical-suite/consultation",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey:
              PermissionKeys.OCCUPATIONAL_HEALTH_CLINICAL_SUITE_CONSULTATION_VIEW,
          },
          {
            title: "Medicine Stock",
            href: "/occupational-health/clinical-suite/medicine-stock",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey:
              PermissionKeys.OCCUPATIONAL_HEALTH_CLINICAL_SUITE_MEDICINE_STOCK_VIEW,
          },
          {
            title: "Pharmacy Queue",
            href: "/occupational-health/clinical-suite/pharmacy-queue",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey:
              PermissionKeys.OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PHARMACY_QUEUE_VIEW,
          },
        ],
      },
      {
        title: "Medicine Inventory",
        href: "/medicines-inventory",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        nestedItems: [
          {
            title: "Medicine Request",
            href: "/occupational-health/medicines-inventory/medicine-request",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey:
              PermissionKeys.OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_MEDICINE_REQUEST_VIEW,
          },
          {
            title: "Purchase & Inventory",
            href: "/occupational-health/medicines-inventory/purchase-inventory",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey:
              PermissionKeys.OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_PURCHASE_INVENTORY_VIEW,
          },
          {
            title: "Transaction",
            href: "/occupational-health/medicines-inventory/transaction",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey:
              PermissionKeys.OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_TRANSACTION_VIEW,
          },
          {
            title: "Assigned Tasks",
            href: "/occupational-health/medicines-inventory/assigned-tasks",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey:
              PermissionKeys.OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_ASSIGNED_TASKS_VIEW,
          },
        ],
      },
      {
        title: "Medical Records",
        href: "/occupational-health/medical-records",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        nestedItems: [
          {
            title: "Maternity Register",
            href: "/occupational-health/medical-records/maternity-register",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey:
              PermissionKeys.OCCUPATIONAL_HEALTH_MEDICAL_RECORDS_MATERNITY_REGISTER_VIEW,
          },
        ],
      },
    ],
  },
  {
    headline: "Social Apps",
  },
  {
    title: "Grievance",
    href: "/grievance",
    icon: <ErrorOutlineOutlinedIcon fontSize="small" />,
    disabled: true,
    nestedItems: [
      {
        title: "Dashboard",
        href: "/grievance/dashboard",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.GRIEVANCE_DASHBOARD_VIEW,
      },
      {
        title: "Register",
        href: "/grievance/register",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.GRIEVANCE_REGISTER_VIEW,
      },
      {
        title: "Assigned Tasks",
        href: "/grievance/assigned-tasks",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.GRIEVANCE_ASSIGNED_TASKS_VIEW,
      },
    ],
  },
  {
    title: "RAG",
    href: "/rag",
    icon: <SentimentSatisfiedAltOutlinedIcon fontSize="small" />,
    disabled: true,
    nestedItems: [
      {
        title: "Dashboard",
        href: "/rag/dashboard",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.RAG_DASHBOARD_VIEW,
      },
      {
        title: "Register",
        href: "/rag/register",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.RAG_REGISTER_VIEW,
      },
    ],
  },
  {
    title: "Engagement",
    href: "/engagement",
    icon: <DatasetLinkedOutlinedIcon fontSize="small" />,
    disabled: true,
    nestedItems: [
      {
        title: "History",
        href: "/engagement/history",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.ENGAGEMENT_REGISTER_VIEW,
      },
    ],
  },
  {
    title: "Attrition",
    href: "/attrition",
    icon: <PersonRemoveOutlinedIcon fontSize="small" />,
    disabled: true,
    nestedItems: [
      {
        title: "History",
        href: "/attrition/history",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.ATTRITION_REGISTER_VIEW,
      },
    ],
  },
  {
    title: "Satisfaction Survey",
    href: "/satisfaction-survey",
    icon: <PollOutlinedIcon fontSize="small" />,
    disabled: true,
    accessKey: PermissionKeys.SATISFACTION_SURVEY_VIEW,
  },
];
