import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import { Controller, useForm } from "react-hook-form";
import useIsMobile from "../../customHooks/useIsMobile";
import DateRangePicker from "../../components/DateRangePicker";
import CustomButton from "../../components/CustomButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardCard from "../../components/DashboardCard";
import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import React, { useMemo, useState } from "react";
import CircularProgressWithLabel from "../../components/CircularProgress";

import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";

import { yearData } from "../../api/sampleData/consumptionData";
import { useQuery } from "@tanstack/react-query";
import { fetchDivision } from "../../api/divisionApi";
import { dateFormatter } from "../../util/dateFormat.util";
import CustomPieChart from "../../components/CustomPieChart";
import { format } from "date-fns";

import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import {
  fetchChemicalClassification,
  fetchChemicalDashboardAllSummary,
  fetchChemicalHighestStock,
  fetchChemicalInventoryInsights,
  fetchChemicalMonthlyDelivery,
  fetchChemicalMonthlyLatestRecord,
  fetchChemicalStatusSummery,
  fetchChemicalStockAmount,
  fetchChemicalThreshold,
  fetchChemicalTransactionLatestRecord,
  fetchMsdsCount,
} from "../../api/ChemicalManagement/chemicalDashboardApi";
import UpcomingOutlinedIcon from "@mui/icons-material/UpcomingOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import RadialStrokeBarChart from "../../components/RadialStrokedBarChart";
import {
  categoryData,
  getAnonymousSummery,
  getCategoryDepartment,
  getCategoryOfGrievancesSummary,
  getCategoryTopic,
  getChannelSummery,
  getGrievancesMonthlyStatusSummary,
  getGrievancesStatusSummary,
  getSeverityScoreSummery,
  getStarsSummery,
  getTypeOfGrievancesSummary,
  GrievanceCategory,
} from "../../api/Grievance/grievanceApi";

const breadcrumbItems = [
  { title: "Home", href: "/home" },
  { title: "Grievance Management" },
];

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function a11yProps2(indexTwo: number) {
  return {
    id: `full-width-tab-${indexTwo}`,
    "aria-controls": `full-width-TabPanelTwo-${indexTwo}`,
  };
}

function a11yProps3(indexTwo: number) {
  return {
    id: `full-width-tab-${indexTwo}`,
    "aria-controls": `full-width-TabPanelTwo-${indexTwo}`,
  };
}

function GrievanceDashboard() {
  const { isMobile, isTablet } = useIsMobile();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const year = watch("year");

  const auditType = watch("auditType");
  const division = watch("division");
  const category = watch("category");

  const dateRangeFrom = watch("dateRangeFrom");
  const formattedDateFrom = dateFormatter(dateRangeFrom);

  const dateRangeTo = watch("dateRangeTo");
  const formattedDateTo = dateFormatter(dateRangeTo);

  const [activeTab, setActiveTab] = useState(0);
  const [activeTabTwo, setActiveTabTwo] = useState(0);
  const [activeTabThree, setActiveTabThree] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log("event", event);
    setActiveTab(newValue);
  };

  const handleChangeTabTwo = (
    eventTwo: React.SyntheticEvent,
    newValueTwo: number
  ) => {
    console.log("event", eventTwo);
    setActiveTabTwo(newValueTwo);
  };

  const handleChangeTabThree = (
    eventTwo: React.SyntheticEvent,
    newValueTwo: number
  ) => {
    console.log("event", eventTwo);
    setActiveTabThree(newValueTwo);
  };

  const { data: divisionData, isFetching: isDivisionDataFetching } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  //Dashboard API
  const {
    data: grievanceStatusSummary,
    refetch: refetchGrievanceStatusSummary,
    isFetching: isGrievanceStatusSummary,
  } = useQuery({
    queryKey: [
      "grievance-status-summary",
      formattedDateFrom,
      formattedDateTo,
      division,
      category,
    ],
    queryFn: () =>
      getGrievancesStatusSummary(
        formattedDateFrom,
        formattedDateTo,
        division,
        category
      ),
    enabled: false,
  });

  const {
    data: grievanceMonthlyStatusSummary,
    refetch: refetchGrievanceMonthlyStatusSummary,
    isFetching: isGrievanceMonthlyStatusSummary,
  } = useQuery({
    queryKey: [
      "grievance-status-monthly-summary",
      formattedDateFrom,
      formattedDateTo,
      division,
      category,
    ],
    queryFn: () =>
      getGrievancesMonthlyStatusSummary(
        formattedDateFrom,
        formattedDateTo,
        division,
        category
      ),
    enabled: false,
  });

  const {
    data: grievanceTypeSummary,
    refetch: refetchGrievanceTypeSummary,
    isFetching: isGrievanceTypeSummary,
  } = useQuery({
    queryKey: [
      "grievance-type",
      formattedDateFrom,
      formattedDateTo,
      division,
      category,
    ],
    queryFn: () =>
      getTypeOfGrievancesSummary(
        formattedDateFrom,
        formattedDateTo,
        division,
        category
      ),
    enabled: false,
  });

  const {
    data: grievanceCategorySummary,
    refetch: refetchGrievanceCategorySummary,
    isFetching: isGrievanceCategorySummary,
  } = useQuery({
    queryKey: [
      "grievance-category",
      formattedDateFrom,
      formattedDateTo,
      division,
      category,
    ],
    queryFn: () =>
      getCategoryOfGrievancesSummary(
        formattedDateFrom,
        formattedDateTo,
        division
      ),
    enabled: false,
  });

  const {
    data: grievanceDepartmentSummary,
    refetch: refetchGrievanceDepartmentSummary,
    isFetching: isGrievanceDepartmentSummary,
  } = useQuery({
    queryKey: [
      "grievance-department",
      formattedDateFrom,
      formattedDateTo,
      division,
      category,
    ],
    queryFn: () =>
      getCategoryDepartment(
        formattedDateFrom,
        formattedDateTo,
        division,
        category
      ),
    enabled: false,
  });

  const {
    data: grievanceTopicSummary,
    refetch: refetchGrievanceTopicSummary,
    isFetching: isGrievanceTopicSummary,
  } = useQuery({
    queryKey: [
      "grievance-topic",
      formattedDateFrom,
      formattedDateTo,
      division,
      category,
    ],
    queryFn: () =>
      getCategoryTopic(formattedDateFrom, formattedDateTo, division, category),
    enabled: false,
  });

  const {
    data: grievanceChannelSummary,
    refetch: refetchGrievanceChannelSummary,
    isFetching: isGrievanceChannelSummary,
  } = useQuery({
    queryKey: [
      "channel-summary",
      formattedDateFrom,
      formattedDateTo,
      division,
      category,
    ],
    queryFn: () =>
      getChannelSummery(formattedDateFrom, formattedDateTo, division, category),
    enabled: false,
  });

  const {
    data: grievanceStarsSummary,
    refetch: refetchGrievanceStarsSummary,
    isFetching: isGrievanceStarsSummary,
  } = useQuery({
    queryKey: [
      "stars-summary",
      formattedDateFrom,
      formattedDateTo,
      division,
      category,
    ],
    queryFn: () =>
      getStarsSummery(formattedDateFrom, formattedDateTo, division, category),
    enabled: false,
  });

  const {
    data: grievanceAnonymousSummary,
    refetch: refetchGrievanceAnonymousSummary,
    isFetching: isGrievanceAnonymousSummary,
  } = useQuery({
    queryKey: [
      "anonymous-summary",
      formattedDateFrom,
      formattedDateTo,
      division,
      category,
    ],
    queryFn: () =>
      getAnonymousSummery(
        formattedDateFrom,
        formattedDateTo,
        division,
        category
      ),
    enabled: false,
  });

  const {
    data: grievanceSeveritySummary,
    refetch: refetchGrievanceSeveritySummary,
    isFetching: isGrievanceSeveritySummary,
  } = useQuery({
    queryKey: [
      "severity-summary",
      formattedDateFrom,
      formattedDateTo,
      division,
      category,
    ],
    queryFn: () =>
      getSeverityScoreSummery(
        formattedDateFrom,
        formattedDateTo,
        division,
        category
      ),
    enabled: false,
  });

  const topicChartData = useMemo(() => {
    return (
      grievanceTopicSummary?.topics?.map((topic) => ({
        name: topic.topic,
        count: topic.count,
        percentage: topic.percentage,
      })) || []
    );
  }, [grievanceTopicSummary]);

  const pieAnonymousChartData = useMemo(() => {
    const summary = grievanceAnonymousSummary?.anonymousSummary;

    if (!summary) return [];

    return [
      {
        name: "Anonymous",
        value: summary.anonymous?.count ?? 0,
      },
      {
        name: "Non-Anonymous",
        value: summary.nonAnonymous?.count ?? 0,
      },
    ];
  }, [grievanceAnonymousSummary]);

  const starChartData = useMemo(() => {
    const summary = grievanceStarsSummary?.starsSummary;

    if (!summary) return [];

    return Object.entries(summary).map(([starLabel, values]) => {
      const val = values as { count: number; percentage: number };

      return {
        name: starLabel,
        count: val.count,
        percentage: val.percentage,
      };
    });
  }, [grievanceStarsSummary]);

  const departmentChartData = useMemo(() => {
    return (
      grievanceDepartmentSummary?.responsibleDepartment?.map((dept) => ({
        name: dept.responsibleDepartment,
        count: dept.count,
        percentage: dept.percentage,
      })) || []
    );
  }, [grievanceDepartmentSummary]);

  const pieChartDataChannel = useMemo(() => {
    if (
      !grievanceChannelSummary ||
      !Array.isArray(grievanceChannelSummary.channels)
    ) {
      return [];
    }

    return grievanceChannelSummary.channels.map((ch) => ({
      name: ch.channel,
      value: ch.count,
    }));
  }, [grievanceChannelSummary]);

  const pieChartDataCategory = useMemo(() => {
    if (
      !grievanceCategorySummary ||
      !Array.isArray(grievanceCategorySummary.categories)
    ) {
      return [];
    }

    return grievanceCategorySummary.categories.map((cat) => ({
      name: cat.category,
      value: cat.count,
    }));
  }, [grievanceCategorySummary]);

  const statusSummeryMemo = useMemo(() => {
    return grievanceStatusSummary || {};
  }, [grievanceStatusSummary]);

  const chartData = useMemo(() => {
    const types = [
      "grievance",
      "complaint",
      "appreciation",
      "suggestion",
      "question",
    ];

    const monthlyData = grievanceMonthlyStatusSummary?.monthlyTypeCount || [];

    return monthlyData.map((entry) => {
      const row = { name: entry.month };

      types.forEach((type) => {
        row[type] = entry.types?.[type] || 0;
      });

      return row;
    });
  }, [grievanceMonthlyStatusSummary]);

  const pieChartData = useMemo(() => {
    if (!grievanceTypeSummary || !grievanceTypeSummary.types) return [];

    const { type, count } = grievanceTypeSummary.types;

    if (!type || typeof count !== "number") return [];

    return [
      {
        name: type,
        value: count,
      },
    ];
  }, [grievanceTypeSummary]);

  const {
    data: chemicalStockAmountData,
    refetch: refetchChemicalStockAmount,
    isFetching: isChemicalStockAmountData,
  } = useQuery({
    queryKey: [
      "stock-amount",
      formattedDateFrom,
      formattedDateTo,
      division,
      auditType,
    ],
    queryFn: () =>
      fetchChemicalStockAmount(formattedDateFrom, formattedDateTo, division),
    enabled: false,
  });

  const {
    data: chemicalMonthlyDeliveryData,
    refetch: refetchChemicalMonthlyDelivery,
    isFetching: isChemicalMonthlyDeliveryData,
  } = useQuery({
    queryKey: [
      "monthly-delivery",
      formattedDateFrom,
      formattedDateTo,
      division,
      auditType,
    ],
    queryFn: () =>
      fetchChemicalMonthlyDelivery(
        formattedDateFrom,
        formattedDateTo,
        division
      ),
    enabled: false,
  });

  const {
    data: chemicalLatestDeliveryData,
    refetch: refetchChemicalMonthlyLatestRecord,
    isFetching: isChemicalLatestDeliveryData,
  } = useQuery({
    queryKey: [
      "latest-record",
      formattedDateFrom,
      formattedDateTo,
      division,
      auditType,
    ],
    queryFn: () =>
      fetchChemicalMonthlyLatestRecord(
        formattedDateFrom,
        formattedDateTo,
        division
      ),
    enabled: false,
  });

  const {
    data: chemicalLatestTransactionData,
    refetch: refetchChemicalTransactionLatestRecord,
    isFetching: isChemicalLatestTransactionData,
  } = useQuery({
    queryKey: [
      "latest-transaction-record",
      formattedDateFrom,
      formattedDateTo,
      division,
      auditType,
    ],
    queryFn: () =>
      fetchChemicalTransactionLatestRecord(
        formattedDateFrom,
        formattedDateTo,
        division
      ),
    enabled: false,
  });

  const {
    data: chemicalThresholdData,
    refetch: refetchChemicalThreshold,
    isFetching: isChemicalThresholdData,
  } = useQuery({
    queryKey: [
      "chemical-threshold",
      formattedDateFrom,
      formattedDateTo,
      division,
      auditType,
    ],
    queryFn: () =>
      fetchChemicalThreshold(formattedDateFrom, formattedDateTo, division),
    enabled: false,
  });

  const {
    data: chemicalHighestData,
    refetch: refetchChemicalHighestStock,
    isFetching: isChemicalHighestData,
  } = useQuery({
    queryKey: [
      "highest-chemical",
      formattedDateFrom,
      formattedDateTo,
      division,
      auditType,
    ],
    queryFn: () =>
      fetchChemicalHighestStock(formattedDateFrom, formattedDateTo, division),
    enabled: false,
  });

  const {
    data: chemicalStatusSummeryData,
    refetch: refetchChemicalStatusSummery,
    isFetching: isChemicalStatusSummeryData,
  } = useQuery({
    queryKey: [
      "chemical-status-summery",
      formattedDateFrom,
      formattedDateTo,
      division,
      auditType,
    ],
    queryFn: () =>
      fetchChemicalStatusSummery(formattedDateFrom, formattedDateTo, division),
    enabled: false,
  });

  const {
    data: chemicalInsightData,
    refetch: refetchChemicalInventoryInsights,
    isFetching: isChemicalInsightData,
  } = useQuery({
    queryKey: [
      "chemical-insight",
      formattedDateFrom,
      formattedDateTo,
      division,
      auditType,
    ],
    queryFn: () =>
      fetchChemicalInventoryInsights(
        formattedDateFrom,
        formattedDateTo,
        division
      ),
    enabled: false,
  });

  const {
    data: chemicalClassificationData,
    refetch: refetchChemicalClassification,
    isFetching: isChemicalClassificationData,
  } = useQuery({
    queryKey: [
      "chemical-classification",
      formattedDateFrom,
      formattedDateTo,
      division,
      auditType,
    ],
    queryFn: () =>
      fetchChemicalClassification(formattedDateFrom, formattedDateTo, division),
    enabled: false,
  });

  const {
    data: chemicalMsdsData,
    refetch: refetchMsdsCount,
    isFetching: isChemicalMsdsData,
  } = useQuery({
    queryKey: [
      "chemical-msds",
      formattedDateFrom,
      formattedDateTo,
      division,
      auditType,
    ],
    queryFn: () => fetchMsdsCount(formattedDateFrom, formattedDateTo, division),
    enabled: false,
  });

  //Dashboard useMemo
  const chemicalMsdsDataMemo = useMemo(() => {
    return chemicalMsdsData?.percentage || [];
  }, [chemicalMsdsData]);

  const chemicalClassificationHazardTypeSummaryMemo = useMemo(() => {
    return chemicalClassificationData?.hazardTypeSummary || [];
  }, [chemicalClassificationData]);

  const chemicalGhsClassificationHazardTypeSummaryMemo = useMemo(() => {
    return chemicalClassificationData?.ghsClassificationSummary || [];
  }, [chemicalClassificationData]);

  const chemicalZdhcClassificationHazardTypeSummaryMemo = useMemo(() => {
    return chemicalClassificationData?.zdhcLevelSummary || [];
  }, [chemicalClassificationData]);

  const chemicalInsightTopSuppliersDataMemo = useMemo(() => {
    return chemicalInsightData?.topSuppliers || [];
  }, [chemicalInsightData]);
  const chemicalInsightPositiveListDataMemo = useMemo(() => {
    return chemicalInsightData?.positiveList || [];
  }, [chemicalInsightData]);
  const chemicalInsightMsdsListDataMemo = useMemo(() => {
    return chemicalInsightData?.msdsExpiries || [];
  }, [chemicalInsightData]);
  const chemicalInsightChemicalExpiryListDataMemo = useMemo(() => {
    return chemicalInsightData?.chemicalExpiry || [];
  }, [chemicalInsightData]);
  const chemicalInsightCertificateExpiryListDataMemo = useMemo(() => {
    return chemicalInsightData?.certificateExpiry || [];
  }, [chemicalInsightData]);

  const chemicalStatusSummeryDataMemo = useMemo(() => {
    return (
      chemicalStatusSummeryData?.data?.map(
        (item: { status: string; count: number }) => ({
          name: item.status,
          value: item.count,
        })
      ) || []
    );
  }, [chemicalStatusSummeryData]);

  const chemicalHighestDataMemo = useMemo(() => {
    return chemicalHighestData || [];
  }, [chemicalHighestData]);

  const chemicalThresholdDataMemo = useMemo(() => {
    return chemicalThresholdData || [];
  }, [chemicalThresholdData]);
  console.log(chemicalThresholdDataMemo.length);

  const chemicalMonthlyDeliveryDataMemo = useMemo(() => {
    if (
      !chemicalMonthlyDeliveryData ||
      !Array.isArray(chemicalMonthlyDeliveryData.data)
    ) {
      return [];
    }

    const groupedByMonth: Record<string, Record<string, any>> = {};

    chemicalMonthlyDeliveryData.data.forEach((entry) => {
      const { month, chemical, quantity } = entry;

      if (!groupedByMonth[month]) {
        groupedByMonth[month] = { month };
      }

      groupedByMonth[month][chemical] = quantity;
    });

    return Object.values(groupedByMonth);
  }, [chemicalMonthlyDeliveryData]);

  const chemicalKeys = useMemo(() => {
    const set = new Set<string>();
    chemicalMonthlyDeliveryData?.data?.forEach((entry) =>
      set.add(entry.chemical)
    );
    return Array.from(set);
  }, [chemicalMonthlyDeliveryData]);

  const chemicalLatestTransactionDataMemo = useMemo(() => {
    return chemicalLatestTransactionData || [];
  }, [chemicalLatestTransactionData]);

  const chemicalLatestDeliveryDataMemo = useMemo(() => {
    return chemicalLatestDeliveryData || [];
  }, [chemicalLatestDeliveryData]);

  const chemicalStockAmountDataMemo = useMemo(() => {
    return chemicalStockAmountData || {};
  }, [chemicalStockAmountData]);

  //Dashboard All Summary API
  const {
    data: chemicalDashboardSummeryData,
    isFetching: isChemicalDashboardSummeryData,
  } = useQuery({
    queryKey: ["chemical-dashboard-data", new Date().getFullYear()],
    queryFn: () => fetchChemicalDashboardAllSummary(new Date().getFullYear()),
  });

  //Dashboard All Summary useMemo
  const msdsPercentageMemo = useMemo(() => {
    return chemicalDashboardSummeryData?.msdsSummary?.percentage || 0;
  }, [chemicalDashboardSummeryData]);

  console.log("summary", msdsPercentageMemo);

  const chemicalAllStatusSummeryDataMemo = useMemo(() => {
    return (
      chemicalDashboardSummeryData?.statusSummary?.map(
        (item: { status: string; count: number }) => ({
          name: item.status,
          value: item.count,
        })
      ) || []
    );
  }, [chemicalDashboardSummeryData]);
  console.log(chemicalAllStatusSummeryDataMemo);

  const chemicalAllZdhcClassificationHazardTypeSummaryMemo = useMemo(() => {
    return (
      chemicalDashboardSummeryData?.categoryClassificationSummary
        ?.zdhcLevelSummary || []
    );
  }, [chemicalDashboardSummeryData]);

  const chemicalAllClassificationHazardTypeSummaryMemo = useMemo(() => {
    return (
      chemicalDashboardSummeryData?.categoryClassificationSummary
        ?.hazardTypeSummary || []
    );
  }, [chemicalDashboardSummeryData]);

  const chemicalAllGhsClassificationHazardTypeSummaryMemo = useMemo(() => {
    return (
      chemicalDashboardSummeryData?.categoryClassificationSummary
        ?.ghsClassificationSummary || []
    );
  }, [chemicalDashboardSummeryData]);

  const chemicalDashboardSummeryTopSuppliersDataMemo = useMemo(() => {
    return (
      chemicalDashboardSummeryData?.chemicalInventoryInsights?.topSuppliers ||
      []
    );
  }, [chemicalDashboardSummeryData]);

  const chemicalDashboardSummeryPositiveListDataMemo = useMemo(() => {
    return (
      chemicalDashboardSummeryData?.chemicalInventoryInsights?.positiveList ||
      []
    );
  }, [chemicalDashboardSummeryData]);

  const chemicalDashboardSummeryMsdsExpiriesDataMemo = useMemo(() => {
    return (
      chemicalDashboardSummeryData?.chemicalInventoryInsights?.msdsExpiries ||
      []
    );
  }, [chemicalDashboardSummeryData]);

  const chemicalDashboardSummeryChemicalExpiryDataMemo = useMemo(() => {
    return (
      chemicalDashboardSummeryData?.chemicalInventoryInsights?.chemicalExpiry ||
      []
    );
  }, [chemicalDashboardSummeryData]);

  const chemicalDashboardSummeryCertificateExpiryDataMemo = useMemo(() => {
    return (
      chemicalDashboardSummeryData?.chemicalInventoryInsights
        ?.certificateExpiry || []
    );
  }, [chemicalDashboardSummeryData]);

  const chemicalDashboardSummeryDataMemo = useMemo(() => {
    return chemicalDashboardSummeryData || {};
  }, [chemicalDashboardSummeryData]);

  const chemicalAllMonthlyDeliveryDataMemo = useMemo(() => {
    if (
      !chemicalDashboardSummeryData ||
      !Array.isArray(chemicalDashboardSummeryData.monthlyDelivery)
    ) {
      return [];
    }

    const groupedByMonth: Record<string, Record<string, any>> = {};

    chemicalDashboardSummeryData.monthlyDelivery.forEach((entry) => {
      const { month, chemical, quantity } = entry;

      if (!groupedByMonth[month]) {
        groupedByMonth[month] = { month };
      }

      groupedByMonth[month][chemical] = quantity;
    });

    return Object.values(groupedByMonth);
  }, [chemicalDashboardSummeryData]);

  const chemicalAllKeys = useMemo(() => {
    const set = new Set<string>();
    chemicalDashboardSummeryData?.monthlyDelivery?.forEach((entry) =>
      set.add(entry.chemical)
    );
    return Array.from(set);
  }, [chemicalDashboardSummeryData]);

  const chemicalAllThresholdDataMemo = useMemo(() => {
    return chemicalDashboardSummeryData || [];
  }, [chemicalDashboardSummeryData]);

  const chemicalAllHighestDataMemo = useMemo(() => {
    return chemicalDashboardSummeryData || [];
  }, [chemicalDashboardSummeryData]);

  const chemicalAllLatestDeliveryDataMemo = useMemo(() => {
    return chemicalDashboardSummeryData?.latestRecords || [];
  }, [chemicalDashboardSummeryData]);

  const chemicalAllLatestTransactionDataMemo = useMemo(() => {
    return chemicalDashboardSummeryData?.latestTransactions || [];
  }, [chemicalDashboardSummeryData]);

  const handleFetch = () => {
    refetchGrievanceStatusSummary();
    refetchGrievanceMonthlyStatusSummary();
    refetchGrievanceTypeSummary();
    refetchGrievanceCategorySummary();
    refetchGrievanceDepartmentSummary();
    refetchGrievanceTopicSummary();
    refetchGrievanceChannelSummary();
    refetchGrievanceStarsSummary();
    refetchGrievanceAnonymousSummary();
    refetchGrievanceSeveritySummary();
  };

  return (
    <Stack>
      <Box
        sx={{
          padding: theme.spacing(2),
          boxShadow: 2,
          marginY: 2,
          borderRadius: 1,
          overflowX: "hidden",
        }}
      >
        <PageTitle title="Grievance Management Dashboard" />
        <Breadcrumb breadcrumbs={breadcrumbItems} />
      </Box>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            borderBottom: "1px solid var(--pallet-lighter-grey)",
          }}
        >
          <Typography variant="subtitle2">Dashboard Filters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: "0.5rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flex: 1,
                minWidth: "250px",
              }}
            >
              <Controller
                name="year"
                control={control}
                rules={{ required: true }}
                defaultValue={new Date().getFullYear().toString()}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    size="small"
                    options={
                      yearData?.length ? yearData.map((year) => year.year) : []
                    }
                    sx={{ flex: 1, margin: "0.5rem" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        error={!!errors.year}
                        helperText={errors.year && "Required"}
                        label="Year"
                        name="year"
                      />
                    )}
                  />
                )}
              />
            </Box>
            <DateRangePicker
              control={control}
              register={register}
              errors={errors}
              label="Enter a date Range"
              year={year}
            />

            <Box
              sx={{
                display: "flex",
                flex: 1,
                minWidth: "250px",
              }}
            >
              <Controller
                name="division"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    onChange={(e, value) => field.onChange(value)}
                    value={field.value || ""}
                    options={
                      divisionData?.map((division) => division.divisionName) ||
                      []
                    }
                    size="small"
                    sx={{ flex: 1, margin: "0.5rem" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        error={!!errors.division}
                        helperText={errors.division && "Required"}
                        label="Division"
                      />
                    )}
                  />
                )}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flex: 1,
                minWidth: "250px",
              }}
            >
              <Controller
                name="category"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    onChange={(e, value) => field.onChange(value)}
                    value={field.value || ""}
                    options={
                      categoryData?.map((category) => category.name) || []
                    }
                    size="small"
                    sx={{ flex: 1, margin: "0.5rem" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        error={!!errors.category}
                        helperText={errors.category && "Required"}
                        label="Category"
                      />
                    )}
                  />
                )}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "0.5rem",
              marginX: "0.5rem",
            }}
          >
            <Button
              onClick={() => {
                reset();
              }}
              sx={{ color: "var(--pallet-blue)", marginRight: "0.5rem" }}
            >
              Reset
            </Button>
            <CustomButton
              variant="contained"
              sx={{
                backgroundColor: "var(--pallet-blue)",
              }}
              size="medium"
              onClick={handleSubmit((data) => {
                handleFetch();
                console.log("data", data);
              })}
            >
              Add Filter
            </CustomButton>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginTop: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flex: 1,
            minWidth: "150px",
            margin: "0.5rem",
          }}
        >
          <DashboardCard
            title="Reported"
            titleIcon={<ScienceOutlinedIcon fontSize="large" />}
            value={statusSummeryMemo?.filteredRecords}
            subDescription="All Reported Grievance"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            minWidth: "150px",
            margin: "0.5rem",
          }}
        >
          <DashboardCard
            title="Open"
            titleIcon={<ScienceOutlinedIcon fontSize="large" />}
            value={statusSummeryMemo?.statusSummary?.draft?.count || 0}
            subDescription="All Open Grievance"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            minWidth: "150px",
            margin: "0.5rem",
          }}
        >
          <DashboardCard
            title="In Progress"
            titleIcon={<ScienceOutlinedIcon fontSize="large" />}
            value={statusSummeryMemo?.statusSummary?.inprogress?.count || 0}
            subDescription="All In Progress Grievance"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            margin: "0.5rem",
            minWidth: "150px",
          }}
        >
          <DashboardCard
            title="Completed"
            titleIcon={<PaidOutlinedIcon fontSize="large" />}
            value={statusSummeryMemo?.status_summary?.completed?.count || 0}
            subDescription="All Completed Grievance"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            margin: "0.5rem",
            minWidth: "150px",
          }}
        >
          <DashboardCard
            title="Feedback"
            titleIcon={<LocalShippingOutlinedIcon fontSize="large" />}
            value={statusSummeryMemo?.feedbackSummary?.count || 0}
            subDescription="Employee Feedback Count"
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "1rem",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "auto",
            marginTop: "1rem",
            flex: 2,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            padding: "1rem",
            borderRadius: "0.3rem",
            border: "1px solid var(--pallet-border-blue)",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
              }}
            >
              Summary
            </Typography>
          </Box>

          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" angle={25} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="grievance"
                stackId="a"
                fill="#8884d8"
                barSize={12}
              />
              <Bar
                dataKey="complaint"
                stackId="a"
                fill="#82ca9d"
                barSize={12}
              />
              <Bar
                dataKey="appreciation"
                stackId="a"
                fill="#ffc658"
                barSize={12}
              />
              <Bar
                dataKey="suggestion"
                stackId="a"
                fill="#ff8042"
                barSize={12}
              />
              <Bar dataKey="question" stackId="a" fill="#8dd1e1" barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flex: 1,
            flexDirection: "column",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            borderRadius: "0.3rem",
            border: "1px solid var(--pallet-border-blue)",
            padding: "1rem",
            height: "auto",
            marginTop: "1rem",
          }}
        >
          <ResponsiveContainer width="100%" height={500}>
            <>
              <CustomPieChart
                data={pieChartData}
                title="Grievance Type BreakDown"
                centerLabel="Status"
              />
            </>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "1rem",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "600px",
            overflowY: "auto",
            marginTop: "1rem",
            flex: 2,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            padding: "1rem",
            borderRadius: "0.3rem",
            border: "1px solid var(--pallet-border-blue)",
          }}
        >
          <Box position="static" mb={3}>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
              }}
            >
              Latest Inventory Transaction
            </Typography>
          </Box>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={departmentChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" barSize={15} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "auto",
            marginTop: "1rem",
            flex: 1,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            padding: "1rem",
            borderRadius: "0.3rem",
            border: "1px solid var(--pallet-border-blue)",
          }}
        >
          <ResponsiveContainer
            width="100%"
            height={500}
            style={{
              overflowY: "scroll",
              scrollbarWidth: "none",
            }}
          >
            <>
              <CustomPieChart
                data={pieChartDataCategory}
                title="Category BreakDown"
                centerLabel="Status"
              />
            </>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "1rem",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "auto",
            marginTop: "1rem",
            flex: 2,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            padding: "1rem",
            borderRadius: "0.3rem",
            border: "1px solid var(--pallet-border-blue)",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
              }}
            >
              Chemical Inventory Insights
            </Typography>
          </Box>

          <ResponsiveContainer
            width="100%"
            height={500}
            style={{
              overflowY: "scroll",
              scrollbarWidth: "none",
            }}
          >
            <BarChart data={starChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" barSize={20}>
                {starChartData.map((entry, index) => {
                  let fillColor = "#8884d8";
                  switch (entry.name) {
                    case "0 stars":
                      fillColor = "#ff4d4f";
                      break;
                    case "1 stars":
                      fillColor = "#fa8c16";
                      break;
                    case "2 stars":
                      fillColor = "#ffc107";
                      break;
                    case "3 stars":
                      fillColor = "#69c0ff";
                      break;
                    case "4 stars":
                      fillColor = "#9254de";
                      break;
                    case "5 stars":
                      fillColor = "#52c41a";
                      break;
                  }

                  return <Cell key={`cell-${index}`} fill={fillColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flex: 1,
            flexDirection: "column",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            borderRadius: "0.3rem",
            border: "1px solid var(--pallet-border-blue)",
            padding: "1rem",
            height: "auto",
            marginTop: "1rem",
          }}
        >
          <ResponsiveContainer width="100%" height={500}>
            <>
              <CustomPieChart
                data={pieChartDataChannel}
                title="Chemical Status Summary"
                centerLabel="Status"
              />
            </>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "1rem",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "auto",
            marginTop: "1rem",
            flex: 2,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            padding: "1rem",
            borderRadius: "0.3rem",
            border: "1px solid var(--pallet-border-blue)",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
              }}
            >
              Chemical Inventory Insights
            </Typography>
          </Box>

          <ResponsiveContainer
            width="100%"
            height={500}
            style={{
              overflowY: "scroll",
              scrollbarWidth: "none",
            }}
          >
            <BarChart data={topicChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" barSize={15}/>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flex: 1,
            flexDirection: "column",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            borderRadius: "0.3rem",
            border: "1px solid var(--pallet-border-blue)",
            padding: "1rem",
            height: "auto",
            marginTop: "1rem",
          }}
        >
          <ResponsiveContainer width="100%" height={500}>
            <>
              <CustomPieChart
                data={pieAnonymousChartData}
                title="Chemical Status Summary"
                centerLabel="Status"
              />
            </>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Stack>
  );
}

export default GrievanceDashboard;
