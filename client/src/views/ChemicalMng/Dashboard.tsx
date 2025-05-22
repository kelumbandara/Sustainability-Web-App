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
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

import NaturePeopleIcon from "@mui/icons-material/NaturePeople";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ShowerOutlinedIcon from "@mui/icons-material/ShowerOutlined";
import BatteryChargingFullOutlinedIcon from "@mui/icons-material/BatteryChargingFullOutlined";
import React, { useMemo, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { fetchDivision } from "../../api/divisionApi";
import { dateFormatter, getColorForType } from "../../util/dateFormat.util";
import CustomPieChart from "../../components/CustomPieChart";
import { count } from "console";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { format, parseISO } from "date-fns";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import {
  fetchChemicalMonthlyDelivery,
  fetchChemicalMonthlyLatestRecord,
  fetchChemicalStockAmount,
} from "../../api/ChemicalManagement/chemicalDashboardApi";

const breadcrumbItems = [
  { title: "Home", href: "/home" },
  { title: "Chemical Management" },
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

  const year = watch("year");

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

  const chemicalLatestDeliveryDataMemo = useMemo(() => {
    return chemicalLatestDeliveryData || [];
  }, [chemicalLatestDeliveryData]);

  const chemicalStockAmountDataMemo = useMemo(() => {
    return chemicalStockAmountData || {};
  }, [chemicalStockAmountData]);

  const handleFetch = () => {
    refetchChemicalStockAmount();
    refetchChemicalMonthlyDelivery();
    refetchChemicalMonthlyLatestRecord();
  };

  const CustomCountLabel = ({ x, y, value }: any) => {
    return (
      <text x={x} y={y - 10} fill="#444" fontSize={12} textAnchor="middle">
        {value}
      </text>
    );
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
        <PageTitle title="Chemical Management Dashboard" />
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
            title="In Stock"
            titleIcon={<ScienceOutlinedIcon fontSize="large" />}
            value={chemicalStockAmountDataMemo?.inStockCount || 0}
            subDescription="Chemicals in Stock"
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
            title="Delivered"
            titleIcon={<LocalShippingOutlinedIcon fontSize="large" />}
            value={chemicalStockAmountDataMemo?.deliveredTotal || 0}
            subDescription="Delivered Chemical Quantity"
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
            value={chemicalStockAmountDataMemo?.purchaseAmount || 0}
            subDescription="Amount Of the Stocked Chemicals"
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
          {false ? (
            <Box
              width={"100%"}
              height="400px"
              display="flex"
              alignItems={"center"}
              justifyContent={"center"}
            >
              <CircularProgress sx={{ color: "var(--pallet-light-blue)" }} />
            </Box>
          ) : 1 > 0 ? (
            <ResponsiveContainer width={"100%"} height={500}>
              <BarChart data={null}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography textAlign={"center"}>
              Please Select filters to display data
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
              {auditType} Status
            </Typography>
          </Box>

          <ResponsiveContainer width="100%" height={500}>
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
          <Box>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
              }}
            >
              Latest Inventory
            </Typography>
          </Box>
          
        </Box>
      </Box>
    </Stack>
  );
}

export default EnvironmentDashboard;


<Table>
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell align="left"></TableCell>
                <TableCell align="left">Reference Number</TableCell>
                <TableCell align="left">Delivered Date</TableCell>
                <TableCell align="left">Commercial Name</TableCell>
                <TableCell align="left">ZDHC level</TableCell>
                <TableCell align="left">Delivered</TableCell>
                <TableCell align="left">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chemicalLatestDeliveryDataMemo?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left"></TableCell>
                  <TableCell align="left">{item.referenceNumber}</TableCell>
                  <TableCell align="left">
                    {new Date(item.deliveryDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="left">{item.commercialName}</TableCell>
                  <TableCell align="left">{item.zdhcLevel}</TableCell>
                  <TableCell align="left">{item.deliveryQuantity}</TableCell>
                  <TableCell align="left">{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>