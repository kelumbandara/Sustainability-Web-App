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
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
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
  },
  {
    headline: "Administration",
  },
  {
    title: "Organization Settings",
    icon: <SettingsOutlinedIcon fontSize="small" />,
    href: "/admin/organization-settings",
    accessKey: PermissionKeys.ADMIN_USERS_VIEW, // need to add permission key
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
    headline: "Components",
  },
  {
    title: "Input Fields",
    icon: <LayersIcon fontSize="small" />,
    href: "/audit-inspection",
    open: false,
    disabled: false,
    nestedItems: [
      {
        title: "Auto Complete",
        href: "/input-fields/autocomplete",
        icon: <DashboardIcon fontSize="small" />,
        accessKey: PermissionKeys.AUDIT_INSPECTION_DASHBOARD_VIEW,
      },
      {
        title: "Text Fields",
        href: "/input-fields/textfield",
        icon: <CalendarMonthIcon fontSize="small" />,
        accessKey: PermissionKeys.AUDIT_INSPECTION_CALENDAR_VIEW,
      },
      {
        title: "Date Pickers",
        href: "/input-fields/date-pickers",
        icon: <CalendarMonthIcon fontSize="small" />,
        accessKey: PermissionKeys.AUDIT_INSPECTION_CALENDAR_VIEW,
      },
      {
        title: "Other Inputs",
        href: "/input-fields/other-inputs",
        icon: <CalendarMonthIcon fontSize="small" />,
        accessKey: PermissionKeys.AUDIT_INSPECTION_CALENDAR_VIEW,
      },
      {
        title: "External Audit",
        href: "/audit-inspection/external-audit",
        icon: <TravelExploreIcon fontSize="small" />,
        accessKey: PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER_VIEW,
        nestedItems: [
          {
            title: "External Audit Register",
            href: "/audit-inspection/external-audit/register",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey:
              PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER_VIEW,
          },
          {
            title: "Assigned Audit",
            href: "/audit-inspection/external-audit/assigned-tasks",
            icon: <SubdirectoryArrowRightIcon fontSize="small" />,
            accessKey: PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_TASK_VIEW,
          },
          // {
          //   title: "External Audit Queue",
          //   href: "/audit-inspection/external-audit/audit-queue",
          //   icon: <SubdirectoryArrowRightIcon fontSize="small" />,
          //   accessKey:
          //     PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE_VIEW,
          // },
          // {
          //   title: "Corrective Action",
          //   href: "/audit-inspection/external-audit/corrective-action",
          //   icon: <SubdirectoryArrowRightIcon fontSize="small" />,
          //   accessKey:
          //     PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_CORRECTIVE_ACTION_VIEW,
          // },
        ],
      },
    ],
  },
  {
    title: "Sustainability",
    href: "/sustainability",
    icon: <SpaIcon fontSize="small" />,
    disabled: false,
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
    disabled: false,
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
        disabled: false,
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
    nestedItems: [
      {
        title: "Dashboard",
        href: "/chemical-mng/dashboard",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.CHEMICAL_MNG_DASHBOARD_VIEW,
      },
      {
        title: "Chemical Requests",
        href: "/chemical-mng/chemical-requests",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
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
    headline: "Main Layout Demo",
  },
  {
    title: "Demo Layout 01",
    href: "#",
    icon: <ErrorOutlineOutlinedIcon fontSize="small" />,
    disabled: false,
    nestedItems: [
      {
        title: "Nested Layout 01",
        href: "#",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.GRIEVANCE_DASHBOARD_VIEW,
      },
      {
        title: "Nested Layout 02",
        href: "#",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.GRIEVANCE_REGISTER_VIEW,
      },
      {
        title: "Nested Layout 03",
        href: "#",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.GRIEVANCE_ASSIGNED_TASKS_VIEW,
      },
    ],
  },
  {
    title: "Demo Layout 02",
    href: "#",
    icon: <SentimentSatisfiedAltOutlinedIcon fontSize="small" />,
    disabled: false,
    nestedItems: [
      {
        title: "Nested Layout 01",
        href: "#",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.RAG_DASHBOARD_VIEW,
      },
      {
        title: "Nested Layout 02",
        href: "#",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.RAG_REGISTER_VIEW,
      },
    ],
  },
  {
    title: "Demo Layout 03",
    href: "#",
    icon: <DatasetLinkedOutlinedIcon fontSize="small" />,
    disabled: false,
    nestedItems: [
      {
        title: "Nested Layout 01",
        href: "#",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.ENGAGEMENT_REGISTER_VIEW,
      },
    ],
  },
  {
    title: "Demo Layout 04",
    href: "#",
    icon: <PersonRemoveOutlinedIcon fontSize="small" />,
    disabled: false,
    nestedItems: [
      {
        title: "Nested Layout 01",
        href: "#",
        icon: <SubdirectoryArrowRightIcon fontSize="small" />,
        accessKey: PermissionKeys.ATTRITION_REGISTER_VIEW,
      },
    ],
  },
  {
    title: "Demo Layout 05",
    href: "#",
    icon: <PollOutlinedIcon fontSize="small" />,
    disabled: false,
    accessKey: PermissionKeys.SATISFACTION_SURVEY_VIEW,
  },
];
