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
import { useForm } from "react-hook-form";
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
import CustomPieChart from "../../components/CustomPieChart";

import SummarizeIcon from "@mui/icons-material/Summarize";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import Co2Icon from "@mui/icons-material/Co2";
import PieArcLabelChart from "../../components/PieChartComponent";
import PercentagePieChart from "../../components/PercentagePieChart";

import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import RotateRightOutlinedIcon from "@mui/icons-material/RotateRightOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import RadialBarGraph from "../../components/RadialBarChart";

import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import EmergencyOutlinedIcon from "@mui/icons-material/EmergencyOutlined";
import ForestOutlinedIcon from "@mui/icons-material/ForestOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";

const breadcrumbItems = [
  { title: "Home", href: "/home" },
  { title: "Environment Management" },
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
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const watchPeriod = watch("period");
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
        <PageTitle title="Environment Management Dashboard" />
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
              <Autocomplete
                {...register("period", { required: true })}
                size="small"
                options={Object.values(HazardDashboardPeriods)}
                sx={{ flex: 1, margin: "0.5rem" }}
                onChange={(e, value) => {
                  setValue("period", value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.period}
                    label="Period"
                    name="period"
                  />
                )}
              />
            </Box>
            {watchPeriod === HazardDashboardPeriods.CUSTOM && (
              <Box
                sx={{
                  display: "flex",
                  flex: 2,
                  minWidth: "250px",
                  borderRadius: "0.3rem",
                }}
              >
                <DateRangePicker
                  control={control}
                  register={register}
                  errors={errors}
                  label="Enter a date Range"
                />
              </Box>
            )}
            <Box
              sx={{
                display: "flex",
                flex: 1,
                minWidth: "250px",
              }}
            >
              <Autocomplete
                {...register("division", { required: true })}
                size="small"
                options={sampleDivisions?.map((division) => division.name)}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.division}
                    label="Division"
                    name="division"
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
              <Autocomplete
                {...register("category", { required: true })}
                size="small"
                options={HazardOrRiskCategories?.map(
                  (category) => category.name
                )}
                sx={{ flex: 1, margin: "0.5rem" }}
                onChange={(e, value) => {
                  console.log("e", e);
                  setValue("category", value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.category}
                    label="Category"
                    name="category"
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
                console.log("reset");
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
                // handleCreateDocument(data);
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
            value={25}
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
            value={10}
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
            value={10}
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
            value={3}
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
            value={5254.0}
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
              Internal Audit Status
            </Typography>
          </Box>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart height={400} data={datasetMemo}>
              <XAxis dataKey="month" />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="numberOfAuditScheduled"
                name="Number Of Audit Scheduled"
                stackId="a"
                fill="#4f46e5"
                barSize={10}
              />
              <Bar
                dataKey="numberOfAuditCompleted"
                name="Number Of Audit Completed"
                stackId="a"
                fill="#10b981"
                barSize={10}
              />
              <Bar
                dataKey="numberOfAuditPending"
                name="Number Of Audit Pending"
                stackId="a"
                fill="#f59e0b"
                barSize={10}
              />
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
              Internal Audit Score
            </Typography>
          </Box>
          <ResponsiveContainer width={"100%"} height={500}>
            <BarChart width={800} height={400} data={ExternalTransformedAuditScores}>
              <XAxis dataKey="month" />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="Safety"
                name="Safety Audit"
                stackId="a"
                fill="#4f46e5"
                barSize={10}
              />
              <Bar
                dataKey="Quality"
                name="Quality Audit"
                stackId="a"
                fill="#10b981"
                barSize={10}
              />
              <Bar
                dataKey="Environmental"
                name="Environmental Audit"
                stackId="a"
                fill="#f59e0b"
                barSize={10}
              />
            </BarChart>
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
              External Audit Status
            </Typography>
          </Box>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart height={400} data={ExternalDataset}>
              <XAxis dataKey="month" />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="numberOfAuditScheduled"
                name="Number Of Audit Scheduled"
                stackId="a"
                fill="#4f46e5"
                barSize={10}
              />
              <Bar
                dataKey="numberOfAuditCompleted"
                name="Number Of Audit Completed"
                stackId="a"
                fill="#10b981"
                barSize={10}
              />
              <Bar
                dataKey="numberOfAuditPending"
                name="Number Of Audit Pending"
                stackId="a"
                fill="#f59e0b"
                barSize={10}
              />
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
              External Audit Score
            </Typography>
          </Box>
          <ResponsiveContainer width={"100%"} height={500}>
            <BarChart width={800} height={400} data={transformedAuditScores}>
              <XAxis dataKey="month" />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="Safety"
                name="Safety Audit"
                stackId="a"
                fill="#4f46e5"
                barSize={10}
              />
              <Bar
                dataKey="Quality"
                name="Quality Audit"
                stackId="a"
                fill="#10b981"
                barSize={10}
              />
              <Bar
                dataKey="Environmental"
                name="Environmental Audit"
                stackId="a"
                fill="#f59e0b"
                barSize={10}
              />
            </BarChart>
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
            Audit Team Productivity
          </Typography>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={auditTeamProductivity}
                dataKey="completedAudits"
                nameKey="team"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {auditTeamProductivity.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
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
      {/* <Box
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
                  value={activeTabTwo}
                  onChange={handleChangeTabTwo}
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
                    {...a11yProps2(0)}
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
                    {...a11yProps2(1)}
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
                    {...a11yProps2(2)}
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
                    {...a11yProps2(3)}
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
                    {...a11yProps2(4)}
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
                    {...a11yProps2(5)}
                  />
                </Tabs>
              </AppBar>
              <TabPanelTwo
                value={activeTabTwo}
                indexTwo={0}
                dir={theme.direction}
              >
                <>
                  {wasteWaterDataMemo.map((item, index) => (
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
                            <Typography>Quantity</Typography>
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
              </TabPanelTwo>
              <TabPanelTwo
                value={activeTabTwo}
                indexTwo={1}
                dir={theme.direction}
              >
                <>
                  {energyConsumptionDataMemo.map((item, index) => (
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
                            <Typography>Quantity</Typography>
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
              </TabPanelTwo>
              <TabPanelTwo
                value={activeTabTwo}
                indexTwo={2}
                dir={theme.direction}
              >
                <>
                  {waterUsageDataMemo.map((item, index) => (
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
                            <Typography>Quantity</Typography>
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
              </TabPanelTwo>
              <TabPanelTwo
                value={activeTabTwo}
                indexTwo={3}
                dir={theme.direction}
              >
                <>
                  {waterWasteDataMemo.map((item, index) => (
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
                            <Typography>Quantity</Typography>
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
              </TabPanelTwo>
              <TabPanelTwo
                value={activeTabTwo}
                indexTwo={4}
                dir={theme.direction}
              >
                <>
                  {airEmissionDataMemo.map((item, index) => (
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
                            <Typography>Quantity</Typography>
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
              </TabPanelTwo>
              <TabPanelTwo
                value={activeTabTwo}
                indexTwo={5}
                dir={theme.direction}
              >
                <>
                  {wasteWaterDataMemo.map((item, index) => (
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
                            <Typography>Quantity</Typography>
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
              </TabPanelTwo>
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
                  <CustomPieChart
                    data={pieChartDataWaterTreatmentMemo}
                    title="Waste Water Treatment"
                  />
                </Box>
              </Box>
            </>
          </ResponsiveContainer>
        </Box>
      </Box> */}
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
