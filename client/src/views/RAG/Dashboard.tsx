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
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import MoodOutlinedIcon from "@mui/icons-material/MoodOutlined";
import SentimentVerySatisfiedOutlinedIcon from "@mui/icons-material/SentimentVerySatisfiedOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import {
  fetchAllRagRecord,
  fetchRagAgeGroupRecord,
  fetchRagCategoryRecord,
  fetchRagGenderTotalRecord,
  fetchRagStateCountRecord,
  fetchRagStatusTotalRecord,
  fetchRagTotalRecord,
} from "../../api/RAG/ragApi";

const breadcrumbItems = [
  { title: "Home", href: "/home" },
  { title: "RAG Management" },
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

function RagDashboard() {
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

  const COLORS = [
    "#82ca9d",
    "#8884d8",
    "#ffc658",
    "#ff4d4f",
    "#00bcd4",
    "#a83279",
  ]; // Add more if needed

  const {
    data: ragTotalCount,
    refetch: refetchRagTotalCount,
    isFetching: isRagTotalCount,
  } = useQuery({
    queryKey: ["rag-total", formattedDateFrom, formattedDateTo],
    queryFn: () => fetchRagTotalRecord(formattedDateFrom, formattedDateTo),
    enabled: false,
  });

  const {
    data: ragCategoryTotalCount,
    refetch: refetchRagCategoryTotalCount,
    isFetching: isRagCategoryTotalCount,
  } = useQuery({
    queryKey: ["rag-category", formattedDateFrom, formattedDateTo],
    queryFn: () => fetchRagCategoryRecord(formattedDateFrom, formattedDateTo),
    enabled: false,
  });

  const {
    data: ragGenderTotalCount,
    refetch: refetchRagGenderTotalCount,
    isFetching: isRagGenderTotalCount,
  } = useQuery({
    queryKey: ["rag-gender", formattedDateFrom, formattedDateTo],
    queryFn: () =>
      fetchRagGenderTotalRecord(formattedDateFrom, formattedDateTo),
    enabled: false,
  });

  const {
    data: ragStatusTotalCount,
    refetch: refetchRagStatusTotalCount,
    isFetching: isRagStatusTotalCount,
  } = useQuery({
    queryKey: ["rag-status", formattedDateFrom, formattedDateTo],
    queryFn: () =>
      fetchRagStatusTotalRecord(formattedDateFrom, formattedDateTo),
    enabled: false,
  });

  const {
    data: ragStateCount,
    refetch: refetchRagStateCount,
    isFetching: isRagStateCount,
  } = useQuery({
    queryKey: ["rag-states", formattedDateFrom, formattedDateTo],
    queryFn: () => fetchRagStateCountRecord(formattedDateFrom, formattedDateTo),
    enabled: false,
  });

  const {
    data: ragAgeGroupCount,
    refetch: refetchRagAgeGroupCount,
    isFetching: isRagAgeGroupCount,
  } = useQuery({
    queryKey: ["rag-age-group", formattedDateFrom, formattedDateTo],
    queryFn: () => fetchRagAgeGroupRecord(formattedDateFrom, formattedDateTo),
    enabled: false,
  });

  const { data: ragAllData, isFetching: isRagAllData } = useQuery({
    queryKey: ["all-rag-data"],
    queryFn: fetchAllRagRecord,
  });

  const ragAgeGroupChartDataMemo = useMemo(() => {
    if (
      !ragAgeGroupCount ||
      typeof ragAgeGroupCount !== "object" ||
      !ragAgeGroupCount.ageGroupSummary
    ) {
      return [];
    }

    const summary = ragAgeGroupCount.ageGroupSummary as Record<
      string,
      { count: number; percentage: number }
    >;

    return Object.entries(summary)
      .filter(([, data]) => data.count > 0)
      .map(([range, data]) => ({
        name: range,
        value: data.count,
      }));
  }, [ragAgeGroupCount]);

  const ragStateBarChartData = useMemo(() => {
    if (
      !ragStateCount ||
      !Array.isArray(ragStateCount) ||
      ragStateCount.length === 0
    ) {
      return [];
    }

    const rawData = ragStateCount[0] as Record<
      string,
      { count: number; percentage: number }
    >;

    return Object.entries(rawData).map(([state, data]) => ({
      state,
      count: data.count,
      percentage: data.percentage,
    }));
  }, [ragStateCount]);

  const ragStatusCountDataMemo = useMemo(() => {
    if (
      !ragStatusTotalCount ||
      !Array.isArray(ragStatusTotalCount) ||
      ragStatusTotalCount.length === 0
    ) {
      return [];
    }

    const rawData = ragStatusTotalCount[0] as Record<
      string,
      { count: number; percentage: number }
    >;

    return Object.entries(rawData).map(([status, data]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1), // Capitalize
      value: data.count,
    }));
  }, [ragStatusTotalCount]);

  const ragGenderCountDataMemo = useMemo(() => {
    if (
      !ragGenderTotalCount ||
      !Array.isArray(ragGenderTotalCount) ||
      ragGenderTotalCount.length === 0
    ) {
      return [];
    }

    const rawData = ragGenderTotalCount[0] as Record<
      string,
      { count: number; percentage: number }
    >;
    const allowedCategories = ["Male", "Female", "Other"];

    return Object.entries(rawData)
      .filter(([key]) => allowedCategories.includes(key))
      .map(([category, data]) => ({
        name: category,
        value: data.count,
      }));
  }, [ragGenderTotalCount]);

  const ragCategoryCountDataMemo = useMemo(() => {
    if (
      !ragCategoryTotalCount ||
      !Array.isArray(ragCategoryTotalCount) ||
      ragCategoryTotalCount.length === 0
    ) {
      return [];
    }

    const rawData = ragCategoryTotalCount[0] as Record<
      string,
      { count: number; percentage: number }
    >;

    return Object.entries(rawData).map(([category, data]) => ({
      category,
      count: data.count,
      percentage: data.percentage,
    }));
  }, [ragCategoryTotalCount]);

  const ragCountDataMemo = useMemo(() => {
    return ragTotalCount || {};
  }, [ragTotalCount]);

  const ragCountBarDataMemo = useMemo(() => {
    if (!ragTotalCount || typeof ragTotalCount !== "object") return [];

    return [
      {
        name: "RAG Count",
        red: ragTotalCount.red?.count || 0,
        amber: ragTotalCount.amber?.count || 0,
        green: ragTotalCount.green?.count || 0,
      },
    ];
  }, [ragTotalCount]);

  const handleFetch = () => {
    refetchRagTotalCount();
    refetchRagCategoryTotalCount();
    refetchRagGenderTotalCount();
    refetchRagStatusTotalCount();
    refetchRagStateCount();
    refetchRagAgeGroupCount();
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
        <PageTitle title="RAG System" />
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
              justifyContent: "flex-end",
              flexWrap: "wrap",
              marginTop: "0.5rem",
            }}
          >
            <DateRangePicker
              control={control}
              register={register}
              errors={errors}
              label="Enter a date Range"
              year={year}
            />
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
            title="Total"
            titleIcon={<HourglassEmptyOutlinedIcon fontSize="large" />}
            value={ragCountDataMemo?.totalRag}
            subDescription={ragCountDataMemo?.ragPercentage + "%"}
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
            title="Red"
            titleIcon={
              <SentimentSatisfiedAltOutlinedIcon
                fontSize="large"
                sx={{ color: "red" }}
              />
            }
            value={ragCountDataMemo.red?.count}
            subDescription={ragCountDataMemo.red?.percentage + "%"}
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
            title="Amber"
            titleIcon={
              <MoodOutlinedIcon fontSize="large" sx={{ color: "#ff8f00" }} />
            }
            value={ragCountDataMemo.amber?.count}
            subDescription={ragCountDataMemo.amber?.percentage + "%"}
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
            title="Green"
            titleIcon={
              <SentimentVerySatisfiedOutlinedIcon
                fontSize="large"
                sx={{ color: "green" }}
              />
            }
            value={ragCountDataMemo.green?.count}
            subDescription={ragCountDataMemo.green?.percentage + "%"}
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
              RAG Comparison
            </Typography>
          </Box>

          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={ragCountBarDataMemo}
              width={800}
              height={400}
              barCategoryGap={40}
              barGap={100}
            >
              <XAxis dataKey="month" />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="red" name="Red" fill="red" barSize={20} />
              <Bar dataKey="amber" name="Amber" fill="#faad14" barSize={20} />
              <Bar dataKey="green" name="Green" fill="green" barSize={20} />
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
                data={ragGenderCountDataMemo}
                title="Gender Total"
                centerLabel="Gender"
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
              Category
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
            <BarChart
              data={ragCategoryCountDataMemo}
              width={800}
              height={400}
              barCategoryGap={40}
              barGap={100}
            >
              <XAxis dataKey="category" />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" barSize={35}>
                {ragCategoryCountDataMemo.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
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
                data={ragStatusCountDataMemo}
                title="Status Total"
                centerLabel="Gender"
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
              RAG Count By State
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
            <BarChart width={600} height={400} data={ragStateBarChartData}>
              <XAxis dataKey="state" angle={290} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" barSize={10}>
                {ragStateBarChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
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
                data={ragAgeGroupChartDataMemo}
                title="Age Group Distribution"
                centerLabel="Age Group"
              />
            </>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Stack>
  );
}

export default RagDashboard;
