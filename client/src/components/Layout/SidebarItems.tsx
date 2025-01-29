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

export interface SidebarItem {
  title?: string;
  headline?: string;
  icon?: JSX.Element;
  open?: boolean;
  href?: string;
  disabled?: boolean;
  section?: number;
  nestedItems?: {
    title: string;
    href: string;
    icon: JSX.Element;
    open?: boolean;
    disabled?: boolean;
    section?: number;
    nestedItems?: {
      title: string;
      href: string;
      icon: JSX.Element;
      disabled?: boolean;
      section?: number;
    }[];
  }[];
}

export const sidebarItems: Array<SidebarItem & { "data-cy"?: string }> = [
  {
    headline: "Main",
    section: 3022,
  },
  {
    title: "Insight",
    href: "/home",
    icon: <HomeIcon fontSize="small" />,
    // Add the data-cy attribute here
    section: 3022,
  },
  {
    headline: "Sustainability Apps",
    section: 3022,
  },
  {
    title: "Audit & Inspection",
    icon: <LayersIcon fontSize="small" />,
    href: "/audit-inspection",
    open: false,
    disabled: false,
    section: 3022,
    nestedItems: [
      {
        title: "Dashboard",
        href: "/audit-inspection/dashboard",
        icon: <DashboardIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "Calendar",
        href: "/audit-inspection/calendar",
        icon: <CalendarMonthIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "Internal Audit",
        href: "/audit-inspection/internal-audit",
        icon: <QueryStatsIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "External Audit",
        href: "/audit-inspection/external-audit",
        icon: <TravelExploreIcon fontSize="small" />,
        section: 3022,
      },
    ],
  },
  {
    title: "Sustainability",
    href: "/sustainability",
    icon: <SpaIcon fontSize="small" />,
    disabled: false,
    section: 3022,
    nestedItems: [
      {
        title: "Register",
        href: "/sustainability/register",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "Report an Activity",
        href: "/sustainability/report-activity",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
    ],
  },
  {
    title: "Environment",
    href: "/environment",
    icon: <ForestIcon fontSize="small" />,
    disabled: false,
    section: 3022,
    nestedItems: [
      {
        title: "Dashboard",
        href: "/environment/dashboard",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "History",
        href: "/environment/history",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
        nestedItems: [
          {
            title: "Consumption",
            href: "/environment/history/consumption",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
          {
            title: "Target Setting",
            href: "/environment/history/target-setting",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
        ],
      },
      {
        title: "Create",
        href: "/environment/create",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        disabled: true,
        section: 3022,
        nestedItems: [
          {
            title: "Consumption",
            href: "/environment/create/consumption",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
          {
            title: "Target Setting",
            href: "/environment/create/target-setting",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
        ],
      },
      {
        title: "Assigned Tasks",
        href: "/environment/assigned-tasks",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        disabled: true,
        section: 3022,
        nestedItems: [
          {
            title: "Consumption",
            href: "/environment/assigned-tasks/consumption",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
          {
            title: "Target Setting",
            href: "/environment/assigned-tasks/target-setting",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
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
    section: 3022,
    nestedItems: [
      {
        title: "Dashboard",
        href: "/chemical-mng/dashboard",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "Request History",
        href: "/chemical-mng/request-history",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "New Request",
        href: "/chemical-mng/new-request",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "Purchase & Inventory",
        href: "/chemical-mng/purchase-inventory",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "Transaction",
        href: "/chemical-mng/transaction",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "Assigned Tasks",
        href: "/chemical-mng/assigned-tasks",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
    ],
  },
  {
    headline: "Health & Safety Apps",
    section: 3022,
  },
  {
    title: "Hazard & Risk",
    href: "/hazard-risk",
    icon: <EmergencyIcon fontSize="small" />,
    section: 3022,
    nestedItems: [
      {
        title: "Dashboard",
        href: "/hazard-risk/dashboard",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "History",
        href: "/hazard-risk/history",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "Assigned Tasks",
        href: "/hazard-risk/assigned-tasks",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
    ],
  },
  {
    title: "Accident & Incident",
    href: "/accident-incident",
    icon: <ChangeHistoryIcon fontSize="small" />,
    section: 3022,
    nestedItems: [
      {
        title: "Dashboard",
        href: "/accident-incident/dashboard",
        icon: <DashboardIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "Register",
        href: "/accident-incident/register",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
        nestedItems: [
          {
            title: "Accident Register",
            href: "/accident-incident/register/accident-register",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
          {
            title: "Incident Register",
            href: "/accident-incident/register/incident-register",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
          {
            title: "Corrective Action",
            href: "/accident-incident/register/corrective-action",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
        ],
      },

      {
        title: "Assigned Tasks",
        href: "/accident-incident/assigned-tasks",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
        nestedItems: [
          {
            title: "Accident Assigned",
            href: "/accident-incident/assigned-tasks/accident-assigned",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
          {
            title: "Incident Assigned",
            href: "/accident-incident/assigned-tasks/incident-assigned",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
          {
            title: "Corrective Action",
            href: "/accident-incident/assigned-tasks/corrective-action",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
        ],
      },
    ],
  },
  {
    title: "Document",
    href: "/document",
    icon: <FolderIcon fontSize="small" />,
  },
  {
    title: "Equipment MNG",
    href: "/equipment-mng",
    icon: <ConstructionIcon fontSize="small" />,
    disabled: true,
    section: 3022,
    nestedItems: [
      {
        title: "Equipment",
        href: "/equipment-mng/equipment",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
        nestedItems: [
          {
            title: "Register",
            href: "/equipment-mng/equipment/register",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
          {
            title: "Create",
            href: "/equipment-mng/equipment/create",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
        ],
      },
      {
        title: "Client",
        href: "/equipment-mng/client",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "GEO Tag",
        href: "/equipment-mng/geo-tag",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "Inspection Template",
        href: "/equipment-mng/inspection-template",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
    ],
  },
  {
    title: "Occupational Health",
    href: "/occupational-health",
    icon: <FavoriteBorderIcon fontSize="small" />,
    disabled: false,
    section: 3022,
    nestedItems: [
      {
        title: "Dashboard",
        href: "/occupational-health/dashboard",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "Clinical Suite",
        href: "/occupational-health/clinical-suite",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
        nestedItems: [
          {
            title: "Patient Register",
            href: "/occupational-health/clinical-suite/patient-register",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
          {
            title: "Consultation",
            href: "/occupational-health/clinical-suite/consultation",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
          {
            title: "Medicine Stock",
            href: "/occupational-health/clinical-suite/medicine-stock",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
          {
            title: "Pharmacy Queue",
            href: "/occupational-health/clinical-suite/pharmacy-queue",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
        ],
      },
      {
        title: "Medicine Inventory",
        href: "/medicines-inventory",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
        nestedItems: [
          {
            title: "Medicine Request",
            href: "/occupational-health/medicines-inventory/medicine-request",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
          {
            title: "Purchase & Inventory",
            href: "/occupational-health/medicines-inventory/purchase-inventory",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
          {
            title: "Transaction",
            href: "/occupational-health/medicines-inventory/transaction",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
          {
            title: "Assigned Tasks",
            href: "/occupational-health/medicines-inventory/assigned-tasks",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
        ],
      },
      {
        title: "Medical Records",
        href: "/occupational-health/medical-records",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
        nestedItems: [
          {
            title: "Maternity Register",
            href: "/occupational-health/medical-records/maternity-register",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            section: 3022,
          },
        ],
      },
    ],
  },
  {
    headline: "Social Apps",
    section: 3022,
  },
  {
    title: "Grievance",
    href: "/grievance",
    icon: <ErrorOutlineOutlinedIcon fontSize="small" />,
    disabled: true,
    section: 3022,
    nestedItems: [
      {
        title: "Dashboard",
        href: "/grievance/dashboard",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "Register",
        href: "/grievance/register",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "Assigned Tasks",
        href: "/grievance/assigned-tasks",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
    ],
  },
  {
    title: "RAG",
    href: "/rag",
    icon: <SentimentSatisfiedAltOutlinedIcon fontSize="small" />,
    disabled: true,
    section: 3022,
    nestedItems: [
      {
        title: "Dashboard",
        href: "/rag/dashboard",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "Register",
        href: "/rag/register",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
    ],
  },
  {
    title: "Engagement",
    href: "/engagement",
    icon: <DatasetLinkedOutlinedIcon fontSize="small" />,
    disabled: true,
    section: 3022,
    nestedItems: [
      {
        title: "Create",
        href: "/engagement/create",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "History",
        href: "/engagement/history",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
    ],
  },
  {
    title: "Attrition",
    href: "/attrition",
    icon: <PersonRemoveOutlinedIcon fontSize="small" />,
    disabled: true,
    section: 3022,
    nestedItems: [
      {
        title: "Create",
        href: "/attrition/create",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
      {
        title: "History",
        href: "/attrition/history",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        section: 3022,
      },
    ],
  },
  {
    title: "Satisfaction Survey",
    href: "/satisfaction-survey",
    icon: <PollOutlinedIcon fontSize="small" />,
    disabled: true,
    section: 3022,
  },
];
