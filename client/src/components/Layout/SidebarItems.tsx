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
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";
import PollOutlinedIcon from "@mui/icons-material/PollOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import DatasetLinkedOutlinedIcon from "@mui/icons-material/DatasetLinkedOutlined";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

export interface SidebarItem {
  title?: string;
  headline?: string;
  icon?: JSX.Element;
  open?: boolean;
  href?: string;
  disabled?: boolean;
  nestedItems?: {
    title: string;
    href: string;
    icon: JSX.Element;
    open?: boolean;
    disabled?: boolean;
    nestedItems?: {
      title: string;
      href: string;
      icon: JSX.Element;
      disabled?: boolean;
    }[];
  }[];
}

export const sidebarItems: Array<SidebarItem & { "data-cy"?: string }> = [
  {
    headline: "Main",
  },
  {
    title: "Insight",
    href: "/insights",
    icon: <HomeIcon fontSize="small" />,
    // Add the data-cy attribute here
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
      },
      {
        title: "Calendar",
        href: "/audit-inspection/calendar",
        icon: <CalendarMonthIcon fontSize="small" />,
      },
      {
        title: "Internal Audit",
        href: "/audit-inspection/internal-audit",
        icon: <QueryStatsIcon fontSize="small" />,
      },
      {
        title: "External Audit",
        href: "/audit-inspection/external-audit",
        icon: <TravelExploreIcon fontSize="small" />,
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
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
      {
        title: "Report an Activity",
        href: "/sustainability/report-activity",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
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
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
      {
        title: "History",
        href: "/environment/history",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
        nestedItems: [
          {
            title: "Consumption",
            href: "/environment/history/consumption",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
          {
            title: "Target Setting",
            href: "/environment/history/target-setting",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
        ],
      },
      {
        title: "Create",
        href: "/environment/create",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
        disabled: true,
        nestedItems: [
          {
            title: "Consumption",
            href: "/environment/create/consumption",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
          {
            title: "Target Setting",
            href: "/environment/create/target-setting",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
        ],
      },
      {
        title: "Assigned Tasks",
        href: "/environment/assigned-tasks",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
        disabled: true,
        nestedItems: [
          {
            title: "Consumption",
            href: "/environment/assigned-tasks/consumption",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
          {
            title: "Target Setting",
            href: "/environment/assigned-tasks/target-setting",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
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
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
      {
        title: "Request History",
        href: "/chemical-mng/request-history",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
      {
        title: "New Request",
        href: "/chemical-mng/new-request",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
      {
        title: "Purchase & Inventory",
        href: "/chemical-mng/purchase-inventory",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
      {
        title: "Transaction",
        href: "/chemical-mng/transaction",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
      {
        title: "Assigned Tasks",
        href: "/chemical-mng/assigned-tasks",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
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
    disabled: true,
    nestedItems: [
      {
        title: "Dashboard",
        href: "/hazard-risk/dashboard",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
      {
        title: "Report a Hazard/Risk",
        href: "/hazard-risk/report-hazard-risk",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
      {
        title: "History",
        href: "/hazard-risk/history",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
      {
        title: "Assigned Tasks",
        href: "/hazard-risk/assigned-tasks",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
    ],
  },
  {
    title: "Accident & Incident",
    href: "/accident-incident",
    icon: <ChangeHistoryIcon fontSize="small" />,
    disabled: true,
    nestedItems: [
      {
        title: "Dashboard",
        href: "/accident-incident/dashboard",
        icon: <DashboardIcon fontSize="small" />,
      },
      {
        title: "Report",
        href: "/accident-incident/report",
        icon: <CalendarMonthIcon fontSize="small" />,
        nestedItems: [
          {
            title: "Report Accident",
            href: "/accident-incident/report/report-accident",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
          {
            title: "Report Incident",
            href: "/accident-incident/report/report-incident",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
        ],
      },
      {
        title: "Register",
        href: "/accident-incident/register",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
        nestedItems: [
          {
            title: "Accident Register",
            href: "/accident-incident/register/accident-register",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
          {
            title: "Incident Register",
            href: "/accident-incident/register/incident-register",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
          {
            title: "Corrective Action",
            href: "/accident-incident/register/corrective-action",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
        ],
      },

      {
        title: "Assigned Tasks",
        href: "/accident-incident/assigned-tasks",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
        nestedItems: [
          {
            title: "Accident Assigned",
            href: "/accident-incident/assigned-tasks/accident-assigned",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
          {
            title: "Incident Assigned",
            href: "/accident-incident/assigned-tasks/incident-assigned",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
          {
            title: "Corrective Action",
            href: "/accident-incident/assigned-tasks/corrective-action",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
        ],
      },
    ],
  },
  {
    title: "Document",
    href: "/document",
    icon: <FolderIcon fontSize="small" />,
    disabled: true,
    nestedItems: [
      {
        title: "Register",
        href: "/document/register",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
      {
        title: "Create",
        href: "/document/create",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
    ],
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
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
        nestedItems: [
          {
            title: "Register",
            href: "/equipment-mng/equipment/register",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
          {
            title: "Create",
            href: "/equipment-mng/equipment/create",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
        ],
      },
      {
        title: "Client",
        href: "/equipment-mng/client",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
      {
        title: "GEO Tag",
        href: "/equipment-mng/geo-tag",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
      {
        title: "Inspection Template",
        href: "/equipment-mng/inspection-template",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
    ],
  },
  {
    title: "Occupational Health",
    href: "/occupational-health",
    icon: <FavoriteBorderIcon fontSize="small" />,
    disabled: true,
    nestedItems: [
      {
        title: "Dashboard",
        href: "/occupational-health/dashboard",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
      {
        title: "Clinical Suite",
        href: "/occupational-health/clinical-suite",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
        nestedItems: [
          {
            title: "Patient Register",
            href: "/occupational-health/clinical-suite/patient-register",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
          {
            title: "Consultation",
            href: "/occupational-health/clinical-suite/consultation",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
          {
            title: "Medicine Stock",
            href: "/occupational-health/clinical-suite/medicine-stock",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
          {
            title: "Pharmacy Queue",
            href: "/occupational-health/clinical-suite/pharmacy-queue",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
        ],
      },
      {
        title: "Medicine Inventory",
        href: "/medicines-inventory",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
        nestedItems: [
          {
            title: "Medicine Request",
            href: "/occupational-health/medicines-inventory/medicine-request",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
          {
            title: "Purchase & Inventory",
            href: "/occupational-health/medicines-inventory/purchase-inventory",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
          {
            title: "Transaction",
            href: "/occupational-health/medicines-inventory/transaction",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
          {
            title: "Assigned Tasks",
            href: "/occupational-health/medicines-inventory/assigned-tasks",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
          },
        ],
      },
      {
        title: "Medical Records",
        href: "/occupational-health/medical-records",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
        nestedItems: [
          {
            title: "Maternity Register",
            href: "/occupational-health/medical-records/maternity-register",
            icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
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
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
      {
        title: "Register",
        href: "/grievance/register",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
      {
        title: "Assigned Tasks",
        href: "/grievance/assigned-tasks",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
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
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
      {
        title: "Register",
        href: "/rag/register",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
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
        title: "Create",
        href: "/engagement/create",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
      {
        title: "History",
        href: "/engagement/history",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
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
        title: "Create",
        href: "/attrition/create",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
      {
        title: "History",
        href: "/attrition/history",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
      },
    ],
  },
  {
    title: "Satisfaction Survey",
    href: "/satisfaction-survey",
    icon: <PollOutlinedIcon fontSize="small" />,
    disabled: true,
  },
];
