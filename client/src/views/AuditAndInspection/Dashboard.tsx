import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Autocomplete,
  Box,
  Button,
  Divider,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import { Controller, useForm } from "react-hook-form";
import {
  HazardDashboardPeriods,
  HazardOrRiskCategories,
} from "../../api/hazardRiskApi";
import useIsMobile from "../../customHooks/useIsMobile";
import { sampleDivisions } from "../../api/sampleData/documentData";
import DateRangePicker from "../../components/DateRangePicker";
import CustomButton from "../../components/CustomButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardCard from "../../components/DashboardCard";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import NaturePeopleIcon from "@mui/icons-material/NaturePeople";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ShowerOutlinedIcon from "@mui/icons-material/ShowerOutlined";
import BatteryChargingFullOutlinedIcon from "@mui/icons-material/BatteryChargingFullOutlined";
import { useMemo, useState } from "react";
import CircularProgressWithLabel from "../../components/CircularProgress";
import {
  airEmissionData,
  auditTeamProductivity,
  dataset,
  energyConsumptionData,
  environmentalAudit,
  ExternalDataset,
  ExternalTransformedAuditScores,
  fabricCutData,
  ghgDataset,
  healthSafetyAudit,
  lineData,
  managementSystemAudit,
  myData,
  pieChartData,
  pieChartDataWaterTreatment,
  pieChartEmissionBreakDownData,
  pieChartRecycledWaterDownData,
  scopeColors,
  securityAudit,
  socialAudit,
  transformedAuditScores,
  wasteWaterData,
  waterUsageData,
  waterWasteData,
} from "../../api/sampleData/sampleAuditDashboardData";

import SummarizeIcon from "@mui/icons-material/Summarize";

import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import RotateRightOutlinedIcon from "@mui/icons-material/RotateRightOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";

import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import EmergencyOutlinedIcon from "@mui/icons-material/EmergencyOutlined";
import ForestOutlinedIcon from "@mui/icons-material/ForestOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import { yearData } from "../../api/sampleData/consumptionData";
import { auditTypeData } from "../../api/sampleData/auditData";
import { useQuery } from "@tanstack/react-query";
import { fetchDivision } from "../../api/divisionApi";
import {
  fetchAuditAnnouncementStats,
  fetchAuditAssignedCompletion,
  fetchAuditAssignedGradeStats,
  fetchAuditScoreCount,
  fetchAuditStatusCount,
  fetchAuditStatusCountByMonth,
} from "../../api/AuditAndInspection/auditDashboardApi";
import { dateFormatter, getColorForType } from "../../util/dateFormat.util";
import CustomPieChart from "../../components/CustomPieChart";

const breadcrumbItems = [
  { title: "Home", href: "/home" },
  { title: "Audit Management" },
];

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

interface TabPanelPropsTwo {
  children?: React.ReactNode;
  dir?: string;
  indexTwo: number;
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

function TabPanelTwo(props: TabPanelPropsTwo) {
  const { children, value, indexTwo, ...other } = props;

  return (
    <div
      role="TabPanelTwo"
      hidden={value !== indexTwo}
      id={`full-width-TabPanelTwo-${indexTwo}`}
      aria-labelledby={`full-width-tab-${indexTwo}`}
      {...other}
    >
      {value === indexTwo && <Box sx={{ p: 3 }}>{children}</Box>}
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

function EnvironmentDashboard() {
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

  const auditType = watch("auditType");
  const division = watch("division");

  const dateRangeFrom = watch("dateRangeFrom");
  const formattedDateFrom = dateFormatter(dateRangeFrom);

  const dateRangeTo = watch("dateRangeTo");
  const formattedDateTo = dateFormatter(dateRangeTo);

  const [activeTab, setActiveTab] = useState(0);
  const [activeTabTwo, setActiveTabTwo] = useState(0);
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

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

  const pieChartDataMemo = useMemo(() => {
    if (!pieChartData?.length) return [];
    return pieChartData;
  }, [pieChartData]);

  const datasetMemo = useMemo(() => {
    if (!dataset?.length) return [];
    return dataset;
  }, [dataset]);

  const energyConsumptionDataMemo = useMemo(() => {
    if (!energyConsumptionData?.length) return [];
    return energyConsumptionData;
  }, [energyConsumptionData]);

  const fabricCutDataMemo = useMemo(() => {
    if (!fabricCutData?.length) return [];
    return fabricCutData;
  }, [fabricCutData]);

  const ghgDatasetMemo = useMemo(() => {
    if (!ghgDataset?.length) return [];
    return ghgDataset;
  }, [ghgDataset]);

  const lineDataMemo = useMemo(() => {
    if (!lineData?.length) return [];
    return lineData;
  }, [lineData]);

  const pieChartDataWaterTreatmentMemo = useMemo(() => {
    if (!pieChartDataWaterTreatment?.length) return [];
    return pieChartDataWaterTreatment;
  }, [pieChartDataWaterTreatment]);

  const pieChartEmissionBreakDownDataMemo = useMemo(() => {
    if (!pieChartEmissionBreakDownData?.length) return [];
    return pieChartEmissionBreakDownData;
  }, [pieChartEmissionBreakDownData]);

  const pieChartRecycledWaterDownDataMemo = useMemo(() => {
    if (!pieChartRecycledWaterDownData?.length) return [];
    return pieChartRecycledWaterDownData;
  }, [pieChartRecycledWaterDownData]);

  const waterWasteDataMemo = useMemo(() => {
    if (!waterWasteData?.length) return [];
    return waterWasteData;
  }, [waterWasteData]);

  const wasteWaterDataMemo = useMemo(() => {
    if (!wasteWaterData?.length) return [];
    return wasteWaterData;
  }, [wasteWaterData]);

  const waterUsageDataMemo = useMemo(() => {
    if (!waterUsageData?.length) return [];
    return waterUsageData;
  }, [waterUsageData]);

  const airEmissionDataMemo = useMemo(() => {
    if (!airEmissionData?.length) return [];
    return airEmissionData;
  }, [airEmissionData]);

  const { data: divisionData, isFetching: isDivisionDataFetching } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  const { data: statusCountData, refetch: refetchStatusCountData } = useQuery({
    queryKey: [
      "audit-status-cards",
      formattedDateFrom,
      formattedDateTo,
      division,
      auditType,
    ],
    queryFn: () =>
      fetchAuditStatusCount(
        formattedDateFrom,
        formattedDateTo,
        division,
        auditType
      ),
    enabled: false,
  });

  const {
    data: statusCountByMonthData,
    refetch: refetchStatusCountByMonthData,
  } = useQuery({
    queryKey: [
      "audit-status",
      formattedDateFrom,
      formattedDateTo,
      division,
      auditType,
    ],
    queryFn: () =>
      fetchAuditStatusCountByMonth(
        formattedDateFrom,
        formattedDateTo,
        division,
        auditType
      ),
    enabled: false,
  });

  const { data: scoreCountData, refetch: refetchScoreCountData } = useQuery({
    queryKey: [
      "audit-team-productivity",
      formattedDateFrom,
      formattedDateTo,
      division,
      auditType,
    ],
    queryFn: () =>
      fetchAuditScoreCount(
        formattedDateFrom,
        formattedDateTo,
        division,
        auditType
      ),
    enabled: false,
  });

  const {
    data: assignedCompletionData,
    refetch: refetchAssignedCompletionData,
  } = useQuery({
    queryKey: [
      "audit-score",
      formattedDateFrom,
      formattedDateTo,
      division,
      auditType,
    ],
    queryFn: () =>
      fetchAuditAssignedCompletion(
        formattedDateFrom,
        formattedDateTo,
        division,
        auditType
      ),
    enabled: false,
  });

  const { data: gradeStatsData, refetch: refetchAuditAssignedGradeStats } =
    useQuery({
      queryKey: [
        "audit-grade-stats",
        formattedDateFrom,
        formattedDateTo,
        division,
        auditType,
      ],
      queryFn: () =>
        fetchAuditAssignedGradeStats(
          formattedDateFrom,
          formattedDateTo,
          division,
          auditType
        ),
      enabled: false,
    });

  const {
    data: announcementStatsData,
    refetch: refetchAuditAnnouncementStats,
  } = useQuery({
    queryKey: [
      "audit-announcement-stats",
      formattedDateFrom,
      formattedDateTo,
      division,
      auditType,
    ],
    queryFn: () =>
      fetchAuditAnnouncementStats(
        formattedDateFrom,
        formattedDateTo,
        division,
        auditType
      ),
    enabled: false,
  });

  const announcementStatsDataMemo = useMemo(() => {
    return (announcementStatsData?.data ?? []).map((item: any) => ({
      name: item.announcement,
      value: item.count,
    }));
  }, [announcementStatsData]);

  const gradeStatsDataMemo = useMemo(() => {
    return (gradeStatsData?.data ?? []).map((item: any) => ({
      name: item.grade,
      value: item.count,
    }));
  }, [gradeStatsData]);

  const completionDataMemo = useMemo(() => {
    return assignedCompletionData?.data ?? [];
  }, [assignedCompletionData]);

  const statusCountByMonthMemo = useMemo(() => {
    if (!statusCountByMonthData?.data) return [];

    const allStatuses = new Set();

    // First pass: collect all unique statuses
    Object.values(statusCountByMonthData.data).forEach((statusObj) => {
      if (typeof statusObj === "object" && !Array.isArray(statusObj)) {
        Object.keys(statusObj).forEach((status) => allStatuses.add(status));
      }
    });

    // Second pass: build formatted data for chart
    return Object.entries(statusCountByMonthData.data).map(
      ([month, statuses]) => {
        const entry = { month };
        allStatuses.forEach((status) => {
          entry[status as any] = statuses?.[status as any] || 0;
        });
        return entry;
      }
    );
  }, [statusCountByMonthData]);

  const allStatuses = useMemo(() => {
    const statusSet = new Set();
    if (statusCountByMonthData?.data) {
      Object.values(statusCountByMonthData.data).forEach((statusObj) => {
        if (typeof statusObj === "object" && !Array.isArray(statusObj)) {
          Object.keys(statusObj).forEach((status) => statusSet.add(status));
        }
      });
    }
    return Array.from(statusSet);
  }, [statusCountByMonthData]);

  const statusCountMemo = useMemo(() => {
    return statusCountData?.data ?? {};
  }, [statusCountData]);

  const { stackedData, detailedData, auditTypes } = useMemo(() => {
    const rawData = scoreCountData?.data ?? {};
    const stacked: any[] = [];
    const detailed: any[] = [];
    const auditTypeSet = new Set<string>();

    for (const [month, audits] of Object.entries(rawData)) {
      const monthGroup: Record<string, any> = { month };

      if (Array.isArray(audits)) {
        for (const audit of audits) {
          const { auditType, auditScore } = audit;
          const normalizedType = auditType?.replace(/\s+/g, "_");
          auditTypeSet.add(normalizedType);

          monthGroup[normalizedType] =
            (monthGroup[normalizedType] ?? 0) + auditScore;

          detailed.push({ month, ...audit });
        }
      }

      stacked.push(monthGroup);
    }

    return {
      stackedData: stacked,
      detailedData: detailed,
      auditTypes: Array.from(auditTypeSet),
    };
  }, [scoreCountData]);

  const handleFetch = () => {
    refetchStatusCountData();
    refetchScoreCountData();
    refetchStatusCountByMonthData();
    refetchAssignedCompletionData();
    refetchAuditAssignedGradeStats();
    refetchAuditAnnouncementStats();
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
        <PageTitle title="Audit Management Dashboard" />
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
            <DateRangePicker
              control={control}
              register={register}
              errors={errors}
              label="Enter a date Range"
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
            <Box
              sx={{
                display: "flex",
                flex: 1,
                minWidth: "250px",
              }}
            >
              <Controller
                name="auditType"
                control={control}
                defaultValue={null}
                rules={{ required: true }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    size="small"
                    options={
                      auditTypeData?.length
                        ? auditTypeData.map((type) => type.type)
                        : []
                    }
                    sx={{ flex: 1, margin: "0.5rem" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        error={!!errors.auditType}
                        helperText={errors.auditType && "Required"}
                        label="Audit Type"
                        name="auditType"
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
            title="Schedule"
            titleIcon={<EditCalendarIcon fontSize="large" />}
            value={
              (statusCountMemo?.status?.draft ?? 0) +
                (statusCountMemo?.status?.approved ?? 0) ||
              (statusCountMemo?.status?.completed ?? 0) +
                (statusCountMemo?.status?.scheduled ?? 0)
            }
            subDescription="0% from previous period"
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
            title="Approved"
            titleIcon={<CheckBoxOutlinedIcon fontSize="large" />}
            value={statusCountMemo?.status?.approved ?? 0}
            subDescription="3% From previous period"
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
            title="In-Progress"
            titleIcon={<RotateRightOutlinedIcon fontSize="large" />}
            value={
              (statusCountMemo?.status?.draft ?? 0) ||
              (statusCountMemo?.status?.scheduled ?? 0)
            }
            subDescription="8% From previous period"
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
            titleIcon={<VerifiedOutlinedIcon fontSize="large" />}
            value={statusCountMemo?.status?.completed ?? 0}
            subDescription="1.5% From previous period"
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
            title="Amount"
            titleIcon={<PaidOutlinedIcon fontSize="large" />}
            value={statusCountMemo?.auditFeeTotal ?? 0}
            subDescription="5% From previous period"
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
            flex: 1,
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
              {auditType} Status
            </Typography>
          </Box>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart height={400} width={600} data={statusCountByMonthMemo}>
              <XAxis dataKey="month" />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              {(allStatuses as string[]).map((status, index) => (
                <Bar
                  key={String(status)}
                  barSize={10}
                  dataKey={String(status)}
                  stackId="a" // ✅ This makes the bars stack
                  fill={
                    ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"][
                      index % 5
                    ]
                  }
                />
              ))}
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
          <Box>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
              }}
            >
              {auditType} Status
            </Typography>
          </Box>
          {stackedData.length > 0 ? (
            <ResponsiveContainer width={"100%"} height={500}>
              <BarChart data={stackedData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {auditTypes.map((type) => (
                  <Bar
                    key={type}
                    dataKey={type}
                    name={type?.replace(/_/g, " ")}
                    stackId="a"
                    barSize={10}
                    fill={getColorForType(type)}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography textAlign={"center"}>
              Please Select a filters to display data
            </Typography>
          )}
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
            flex: 1,
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
              Audit Completion And Timeliness Metrics
            </Typography>
          </Box>
          <ResponsiveContainer width="100%" height={500}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="30%"
              outerRadius="70%"
              barSize={12}
              data={myData}
            >
              <RadialBar
                label={{ position: "insideStart", fill: "#000000" }}
                background
                maxBarSize={40}
                dataKey="uv"
              />
              <Legend
                iconSize={10}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </Box>

        <Box
          sx={{
            display: "flex",
            // justifyContent: "center",
            alignContent: "center",
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
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
            }}
          >
            Audit Team Productivity
          </Typography>
          <Stack flexDirection="column" spacing={2} marginTop={6} p={5}>
            {completionDataMemo?.map((completionMemo: any) => (
              <>
                <Stack
                  key={completionMemo?.userId}
                  flexDirection="row"
                  spacing={2}
                  flex={3}
                  alignItems="center"
                >
                  <Box flex={3}>{completionMemo?.userName}</Box>

                  <Typography flex={3}>
                    {completionMemo?.total} Count
                  </Typography>

                  <Box display="flex" alignItems="center">
                    <CircularProgressWithLabel
                      size={50}
                      value={completionMemo?.percentage}
                    />
                  </Box>
                </Stack>
                <Divider />
              </>
            ))}
          </Stack>
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
              Category And Source
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
            <>
              <AppBar
                position="sticky"
                sx={{
                  display: "flex",
                  mt: "1rem",
                  maxWidth: isMobile ? 400 : "auto",
                }}
              >
                <Tabs
                  value={activeTab}
                  onChange={handleChange}
                  indicatorColor="secondary"
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: "var(--pallet-blue)",
                      height: "3px",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  }}
                  sx={{
                    backgroundColor: "var(--pallet-lighter-grey)",
                    color: "var(--pallet-blue)",
                    display: "flex",
                  }}
                  textColor="inherit"
                  variant="scrollable"
                  scrollButtons={true}
                >
                  <Tab
                    label={
                      <Box
                        sx={{
                          color: "var(--pallet-blue)",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <SummarizeIcon fontSize="small" />
                        <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                          Overview
                        </Typography>
                      </Box>
                    }
                    {...a11yProps(0)}
                  />
                  <Tab
                    label={
                      <Box
                        sx={{
                          color: "var(--pallet-blue)",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <ConnectWithoutContactIcon fontSize="small" />
                        <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                          Social
                        </Typography>
                      </Box>
                    }
                    {...a11yProps(1)}
                  />
                  <Tab
                    label={
                      <Box
                        sx={{
                          color: "var(--pallet-blue)",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <EmergencyOutlinedIcon fontSize="small" />
                        <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                          Health And Safety
                        </Typography>
                      </Box>
                    }
                    {...a11yProps(2)}
                  />
                  <Tab
                    label={
                      <Box
                        sx={{
                          color: "var(--pallet-blue)",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <ForestOutlinedIcon fontSize="small" />
                        <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                          Environmental
                        </Typography>
                      </Box>
                    }
                    {...a11yProps(3)}
                  />
                  <Tab
                    label={
                      <Box
                        sx={{
                          color: "var(--pallet-blue)",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <SecurityOutlinedIcon fontSize="small" />
                        <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                          Security
                        </Typography>
                      </Box>
                    }
                    {...a11yProps(4)}
                  />
                  <Tab
                    label={
                      <Box
                        sx={{
                          color: "var(--pallet-blue)",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <ManageAccountsOutlinedIcon fontSize="small" />
                        <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                          Management System
                        </Typography>
                      </Box>
                    }
                    {...a11yProps(5)}
                  />
                </Tabs>
              </AppBar>
              <TabPanel value={activeTab} index={0} dir={theme.direction}>
                <>
                  {socialAudit.map((item, index) => (
                    <Box key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          direction: "row",
                          justifyContent: "space-between",
                          m: "1rem",
                        }}
                      >
                        <Box flex={2}>
                          <Typography>{item.label}</Typography>
                          <Typography variant="caption">
                            {item.description}
                          </Typography>
                        </Box>
                        <Box
                          flex={1}
                          sx={{
                            display: "flex",
                            direction: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography>Score</Typography>
                            <Typography variant="caption">
                              {item.quantity}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Divider />
                    </Box>
                  ))}
                </>
              </TabPanel>
              <TabPanel value={activeTab} index={1} dir={theme.direction}>
                <>
                  {socialAudit.map((item, index) => (
                    <Box key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          direction: "row",
                          justifyContent: "space-between",
                          m: "1rem",
                        }}
                      >
                        <Box flex={2}>
                          <Typography>{item.label}</Typography>
                          <Typography variant="caption">
                            {item.description}
                          </Typography>
                        </Box>
                        <Box
                          flex={1}
                          sx={{
                            display: "flex",
                            direction: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography>Score</Typography>
                            <Typography variant="caption">
                              {item.quantity}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Divider />
                    </Box>
                  ))}
                </>
              </TabPanel>
              <TabPanel value={activeTab} index={2} dir={theme.direction}>
                <>
                  {healthSafetyAudit.map((item, index) => (
                    <Box key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          direction: "row",
                          justifyContent: "space-between",
                          m: "1rem",
                        }}
                      >
                        <Box flex={2}>
                          <Typography>{item.label}</Typography>
                          <Typography variant="caption">
                            {item.description}
                          </Typography>
                        </Box>
                        <Box
                          flex={1}
                          sx={{
                            display: "flex",
                            direction: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography>Score</Typography>
                            <Typography variant="caption">
                              {item.quantity}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Divider />
                    </Box>
                  ))}
                </>
              </TabPanel>
              <TabPanel value={activeTab} index={3} dir={theme.direction}>
                <>
                  {environmentalAudit.map((item, index) => (
                    <Box key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          direction: "row",
                          justifyContent: "space-between",
                          m: "1rem",
                        }}
                      >
                        <Box flex={2}>
                          <Typography>{item.label}</Typography>
                          <Typography variant="caption">
                            {item.description}
                          </Typography>
                        </Box>
                        <Box
                          flex={1}
                          sx={{
                            display: "flex",
                            direction: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography>Score</Typography>
                            <Typography variant="caption">
                              {item.quantity}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Divider />
                    </Box>
                  ))}
                </>
              </TabPanel>
              <TabPanel value={activeTab} index={4} dir={theme.direction}>
                <>
                  {securityAudit.map((item, index) => (
                    <Box key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          direction: "row",
                          justifyContent: "space-between",
                          m: "1rem",
                        }}
                      >
                        <Box flex={2}>
                          <Typography>{item.label}</Typography>
                          <Typography variant="caption">
                            {item.description}
                          </Typography>
                        </Box>
                        <Box
                          flex={1}
                          sx={{
                            display: "flex",
                            direction: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography>Score</Typography>
                            <Typography variant="caption">
                              {item.quantity}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Divider />
                    </Box>
                  ))}
                </>
              </TabPanel>
              <TabPanel value={activeTab} index={5} dir={theme.direction}>
                <>
                  {managementSystemAudit.map((item, index) => (
                    <Box key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          direction: "row",
                          justifyContent: "space-between",
                          m: "1rem",
                        }}
                      >
                        <Box flex={2}>
                          <Typography>{item.label}</Typography>
                          <Typography variant="caption">
                            {item.description}
                          </Typography>
                        </Box>
                        <Box
                          flex={1}
                          sx={{
                            display: "flex",
                            direction: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography>Score</Typography>
                            <Typography variant="caption">
                              {item.quantity}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Divider />
                    </Box>
                  ))}
                </>
              </TabPanel>
            </>
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
          <Box>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
              }}
            >
              Category And Source
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
            <></>
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
              GHG Emission
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
            <></>
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
              <Box display={"flex"} justifyContent={"center"}>
                <Box display={"flex"} justifyContent={"center"}>
                  <CustomPieChart
                    data={gradeStatsDataMemo}
                    title={`External Grade Stats`}
                  />
                </Box>
              </Box>
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
              GHG Emission
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
            <></>
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
              <Box display={"flex"} justifyContent={"center"}>
                <Box display={"flex"} justifyContent={"center"}>
                  <CustomPieChart
                    data={announcementStatsDataMemo}
                    title={`External Announcement Stats`}
                  />
                </Box>
              </Box>
            </>
          </ResponsiveContainer>
        </Box>
      </Box>
      {/* <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "1rem",
        }}
      >
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
              <Box display={"flex"} justifyContent={"center"}>
                <Box display={"flex"} justifyContent={"center"}>
                  <PieArcLabelChart
                    data={pieChartEmissionBreakDownDataMemo}
                    width={400}
                    height={400}
                    title="Emission Breakdown"
                  />
                </Box>
              </Box>
            </>
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
              <Box display={"flex"} justifyContent={"center"}>
                <Box display={"flex"} justifyContent={"center"}>
                  <PercentagePieChart
                    data={pieChartRecycledWaterDownDataMemo}
                    title={"Waste Water Reused Or Recycled"}
                    width={350}
                    height={350}
                  />
                </Box>
              </Box>
            </>
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
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
            }}
          >
            Total Water Vs Waste Water
          </Typography>
          <ResponsiveContainer width="100%" height={500}>
            <>
              <Box
                width="100%"
                height="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <CircularProgressWithLabel
                  size={300}
                  value={135}
                  textSize={25}
                  textLabel="Waste Water"
                />
              </Box>
            </>
          </ResponsiveContainer>
        </Box>
      </Box> */}
    </Stack>
  );
}

export default EnvironmentDashboard;
