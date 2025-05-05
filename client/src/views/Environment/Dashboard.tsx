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
import useIsMobile from "../../customHooks/useIsMobile";
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
} from "recharts";

import NaturePeopleIcon from "@mui/icons-material/NaturePeople";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ShowerOutlinedIcon from "@mui/icons-material/ShowerOutlined";
import BatteryChargingFullOutlinedIcon from "@mui/icons-material/BatteryChargingFullOutlined";
import { useMemo, useState } from "react";
import CircularProgressWithLabel from "../../components/CircularProgress";
import {
  fabricCutData,
  ghgDataset,
  lineData,
  pieChartEmissionBreakDownData,
  scopeColors,
} from "../../api/sampleData/environmentData";
import CustomPieChart from "../../components/CustomPieChart";

import SummarizeIcon from "@mui/icons-material/Summarize";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import Co2Icon from "@mui/icons-material/Co2";
import PieArcLabelChart from "../../components/PieChartComponent";
import PercentagePieChart from "../../components/PercentagePieChart";
import { useQuery } from "@tanstack/react-query";
import { fetchDivision } from "../../api/divisionApi";
import { monthData, yearData } from "../../api/sampleData/consumptionData";
import {
  fetchConsumptionAllDashboardData,
  fetchConsumptionCategoriesQuantity,
  fetchConsumptionCategoriesSum,
  fetchConsumptionCategoriesWasteWaterPercentage,
  fetchConsumptionEnergyRecodeDetails,
  fetchConsumptionRenewableEnergy,
  fetchConsumptionScope,
  fetchConsumptionSourceCounts,
  fetchConsumptionStatusSummery,
  fetchConsumptionWasteWaterDetails,
} from "../../api/Environment/environmentDashboardApi";

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
    reset,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const watchPeriod = watch("period");
  const month = watch("month");
  const year = watch("year");
  const division = watch("division");

  const [activeTab, setActiveTab] = useState(0);
  const [activeTabTwo, setActiveTabTwo] = useState(0);

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

  const { data: divisionData, isFetching: isDivisionDataFetching } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  const {
    data: categorySumData,
    isFetching: isCategorySumDataFetching,
    refetch: refetchCategorySumData,
  } = useQuery({
    queryKey: ["cs-cat-sum-data", year, month, division],
    queryFn: () => fetchConsumptionCategoriesSum(year, month, division),
    enabled: false,
  });

  const {
    data: waterWastePercentageData,
    isFetching: isWaterWastePercentageDataFetching,
    refetch: refetchWasteWaterPercentageData,
  } = useQuery({
    queryKey: ["cs-cat-waste-water", year, month, division],
    queryFn: () =>
      fetchConsumptionCategoriesWasteWaterPercentage(year, month, division),
    enabled: false,
  });

  const {
    data: monthlyQuantityData,
    isFetching: isMonthlyQuantityDataFetching,
    refetch: refetchMonthlyQuantityDataData,
  } = useQuery({
    queryKey: ["cs-cat-monthly-quantity", year, division],
    queryFn: () => fetchConsumptionCategoriesQuantity(year, division),
    enabled: false,
  });

  const {
    data: energyRenewablePercentageData,
    isFetching: isEnergyPercentageDataFetching,
    refetch: refetchConsumptionRenewableEnergy,
  } = useQuery({
    queryKey: ["cs-cat-renewable-energy", year, month, division],
    queryFn: () => fetchConsumptionRenewableEnergy(year, month, division),
    enabled: false,
  });

  const {
    data: consumptionScopeData,
    isFetching: isConsumptionScopeDataFetching,
    refetch: refetchFetchConsumptionScope,
  } = useQuery({
    queryKey: ["cs-cat-scope", year, division],
    queryFn: () => fetchConsumptionScope(year, division),
    enabled: false,
  });

  const {
    data: consumptionSourceCountsData,
    isFetching: isFetchConsumptionSourceCountsDataFetching,
    refetch: refetchFetchConsumptionSourceCounts,
  } = useQuery({
    queryKey: ["cs-cat-source", year, division],
    queryFn: () => fetchConsumptionSourceCounts(year, month, division),
    enabled: false,
  });

  const {
    data: wasteWaterDetailsData,
    isFetching: isFetchWasteWaterDetailsDataFetching,
    refetch: refetchFetchConsumptionWasteWaterDetails,
  } = useQuery({
    queryKey: ["cs-waste-water", year, division],
    queryFn: () => fetchConsumptionWasteWaterDetails(year, month, division),
    enabled: false,
  });

  const {
    data: energyCountData,
    isFetching: isFetchEnergyCountDataFetching,
    refetch: refetchFetchConsumptionEnergyRecodeDetails,
  } = useQuery({
    queryKey: ["cs-energy-count", year, division],
    queryFn: () => fetchConsumptionEnergyRecodeDetails(year, division),
    enabled: false,
  });

  const {
    data: statusSummeryData,
    isFetching: statusSummeryDataFetching,
    refetch: refetchFetchConsumptionStatusSummery,
  } = useQuery({
    queryKey: ["cs-status-summery", year, division],
    queryFn: () => fetchConsumptionStatusSummery(year, month, division),
    enabled: false,
  });

  const { data: consumptionAllData, isFetching: isConsumptionAllDataFetching } =
    useQuery({
      queryKey: ["cs-all-data", year],
      queryFn: () => fetchConsumptionAllDashboardData(year),
    });

  //All Data Memo
  const consumptionYearlyCategorySummaryDataMemo = useMemo(() => {
    return consumptionAllData?.yearlyCategorySummary ?? [];
  }, [consumptionAllData]);

  const statusSummeryAllDataMemo = useMemo(() => {
    const rawData = consumptionAllData?.statusSummary ?? {};
    return Object.entries(rawData).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: Number(value),
    }));
  }, [consumptionAllData]);

  const totalEnergyAllCountMemo = useMemo(() => {
    if (!consumptionAllData?.monthlyEnergyCounts) return [];
    const allEnergySources = new Set();
    consumptionAllData.monthlyEnergyCounts.forEach(({ energySourceCounts }) => {
      if (energySourceCounts) {
        Object.keys(energySourceCounts).forEach((source) => {
          allEnergySources.add(source);
        });
      }
    });
    return consumptionAllData.monthlyEnergyCounts.map(
      ({ month, energySourceCounts = {} }) => {
        const normalizedCounts = {};
        allEnergySources.forEach((source: any) => {
          normalizedCounts[source] = energySourceCounts[source] ?? 0;
        });

        return {
          name: month,
          ...normalizedCounts,
        };
      }
    );
  }, [consumptionAllData]);

  const energyAllSources = useMemo(() => {
    const allSources = new Set<string>();

    totalEnergyAllCountMemo.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== "name") {
          allSources.add(key);
        }
      });
    });

    return Array.from(allSources);
  }, [totalEnergyAllCountMemo]);

  const waterVsWasteAllPercentage = useMemo(() => {
    return consumptionAllData?.waterToWastePercentage ?? 0;
  }, [consumptionAllData]);

  const wasteWaterDetailsAllDataMemo = useMemo(() => {
    if (!consumptionAllData) return null;

    return {
      reusePercentage: consumptionAllData.reusePercentage ?? 0,
      recyclePercentage: consumptionAllData.recyclePercentage ?? 0,
    };
  }, [consumptionAllData]);

  const waterSumAllDataMemo = useMemo(() => {
    if (!consumptionAllData) return [];

    return [
      {
        name: "Total Water",
        value: consumptionAllData.totalWater,
      },
      {
        name: "Total Waste Water",
        value: consumptionAllData.totalWasteWater,
      },
    ];
  }, [consumptionAllData]);

  const consumptionSourceCountsAllDataMemo = useMemo(() => {
    if (!consumptionAllData?.categorySourceSummary) return [];

    const flatData = Object.entries(
      consumptionAllData.categorySourceSummary
    ).flatMap(([category, sources]) => {
      if (typeof sources !== "object" || sources === null) return [];

      return Object.entries(sources).map(([label, quantity]) => ({
        label,
        quantity: Number(quantity) || 0,
        category,
      }));
    });

    return flatData;
  }, [consumptionAllData]);

  const consumptionScopeAllDataMemo = useMemo(() => {
    return (consumptionAllData?.yearlyScopeSummary ?? []).map((entry) => {
      const flattenedScopes =
        entry.scopeQuantity && typeof entry.scopeQuantity === "object"
          ? Object.entries(entry.scopeQuantity).reduce(
              (acc, [scopeKey, value]) => {
                const formattedKey = scopeKey.toLowerCase().replace(/\s+/g, "");
                acc[formattedKey] = value;
                return acc;
              },
              {}
            )
          : {};

      return {
        month: entry.month,
        ...flattenedScopes,
      };
    });
  }, [consumptionAllData]);

  const consumptionCategorySumDataMemo = useMemo(() => {
    if (!consumptionAllData?.categorySum) return [];

    return Object.entries(consumptionAllData.categorySum)
      .map(([key, value]) => ({
        name: key,
        value: value as number,
      }))
      .filter((item) => item.value > 0);
  }, [consumptionAllData]);

  const renewableAllEnergyPercentageMemo = useMemo(() => {
    return consumptionAllData?.renewablePercentage ?? 0;
  }, [consumptionAllData]);
  const renewableEnergyAllMonthMemo = useMemo(() => {
    return consumptionAllData?.month ?? "All Months";
  }, [consumptionAllData]);
  const renewableEnergyAllTotalRenewMemo = useMemo(() => {
    return consumptionAllData?.totalRenewableEnergy ?? 0;
  }, [consumptionAllData]);
  const renewableEnergyAllTotalEnergyMemo = useMemo(() => {
    return consumptionAllData?.totalEnergy ?? 0;
  }, [consumptionAllData]);

  const renewableWaterAllMonthMemo = useMemo(() => {
    return consumptionAllData?.month ?? "All Months";
  }, [consumptionAllData]);

  const totalGhgEmission =
    consumptionCategorySumDataMemo.find((item) => item.name === "ghgEmission")
      ?.value || 0;
  const totalWasteWater =
    consumptionCategorySumDataMemo.find((item) => item.name === "wasteWater")
      ?.value || 0;
  const totalEnergy =
    consumptionCategorySumDataMemo.find((item) => item.name === "energy")
      ?.value || 0;
  const totalWater =
    consumptionCategorySumDataMemo.find((item) => item.name === "water")
      ?.value || 0;
  const totalAmount =
    consumptionCategorySumDataMemo.find((item) => item.name === "amount")
      ?.value || 0;
  const totalWaste =
    consumptionCategorySumDataMemo.find((item) => item.name === "waste")
      ?.value || 0;

  //Memo Data
  const renewableEnergyPercentageMemo = useMemo(() => {
    return energyRenewablePercentageData?.renewablePercentage ?? 0;
  }, [energyRenewablePercentageData]);
  const renewableEnergyMonthMemo = useMemo(() => {
    return energyRenewablePercentageData?.month ?? "";
  }, [energyRenewablePercentageData]);
  const renewableEnergyTotalRenewMemo = useMemo(() => {
    return energyRenewablePercentageData?.totalRenewableEnergy ?? 0;
  }, [energyRenewablePercentageData]);

  const renewableWaterMonthMemo = useMemo(() => {
    return waterWastePercentageData?.month ?? "";
  }, [waterWastePercentageData]);

  const statusSummeryDataMemo = useMemo(() => {
    const rawData = statusSummeryData?.statusSummary ?? {};
    return Object.entries(rawData).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: Number(value),
    }));
  }, [statusSummeryData]);

  const consumptionSourceCountsDataMemo = useMemo(() => {
    const rawData = consumptionSourceCountsData?.data ?? {};
    const flatData = [];

    for (const category in rawData) {
      const items = rawData[category];
      for (const label in items) {
        flatData.push({
          label,
          quantity: items[label],
          category,
        });
      }
    }

    return flatData;
  }, [consumptionSourceCountsData]);

  const renewableEnergyTotalEnergyMemo = useMemo(() => {
    return energyRenewablePercentageData?.totalEnergy ?? 0;
  }, [energyRenewablePercentageData]);

  const totalEnergyCountMemo = useMemo(() => {
    if (!energyCountData?.monthlyEnergySources) return [];
    const allEnergySources = new Set();
    energyCountData.monthlyEnergySources.forEach(({ energySourceCounts }) => {
      if (energySourceCounts) {
        Object.keys(energySourceCounts).forEach((source) => {
          allEnergySources.add(source);
        });
      }
    });
    return energyCountData.monthlyEnergySources.map(
      ({ month, energySourceCounts = {} }) => {
        const normalizedCounts = {};
        allEnergySources.forEach((source: any) => {
          normalizedCounts[source] = energySourceCounts[source] ?? 0;
        });

        return {
          name: month,
          ...normalizedCounts,
        };
      }
    );
  }, [energyCountData]);

  const energySources = useMemo(() => {
    const allSources = new Set<string>();

    totalEnergyCountMemo.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== "name") {
          allSources.add(key);
        }
      });
    });

    return Array.from(allSources);
  }, [totalEnergyCountMemo]);

  const wasteWaterDetailsDataMemo = useMemo(() => {
    if (!wasteWaterDetailsData) return null;

    return {
      reusePercentage: wasteWaterDetailsData.reusePercentage ?? 0,
      recyclePercentage: wasteWaterDetailsData.recyclePercentage ?? 0,
    };
  }, [wasteWaterDetailsData]);

  const consumptionScopeDataMemo = useMemo(() => {
    return (consumptionScopeData?.monthlyScope ?? []).map((entry) => {
      const flattenedScopes =
        entry.scopeQuantity && typeof entry.scopeQuantity === "object"
          ? Object.entries(entry.scopeQuantity).reduce(
              (acc, [scopeKey, value]) => {
                const formattedKey = scopeKey.toLowerCase().replace(/\s+/g, "");
                acc[formattedKey] = value;
                return acc;
              },
              {}
            )
          : {};

      return {
        month: entry.month,
        ...flattenedScopes,
      };
    });
  }, [consumptionScopeData]);

  const monthlyQuantityDataMemo = useMemo(() => {
    if (!monthlyQuantityData?.monthlyData) return [];

    return monthlyQuantityData.monthlyData.map((entry) => ({
      month: entry.month,
      wasteWater: entry.wasteWater,
      energy: entry.energy,
      water: entry.water,
      waste: entry.waste,
      ghgEmission: entry.ghgEmission,
      amount: entry.amount,
    }));
  }, [monthlyQuantityData]);

  const waterSumDataMemo = useMemo(() => {
    if (!waterWastePercentageData) return [];

    return [
      {
        name: "Total Water",
        value: waterWastePercentageData.totalWater,
      },
      {
        name: "Total Waste Water",
        value: waterWastePercentageData.totalWasteWater,
      },
    ];
  }, [waterWastePercentageData]);

  const categorySumDataMemo = useMemo(() => {
    if (!categorySumData?.categorySum) return [];

    return Object.entries(categorySumData.categorySum)
      .map(([key, value]) => ({
        name: key,
        value: value as number,
      }))
      .filter((item) => item.value > 0);
  }, [categorySumData]);

  const ghgEmission =
    categorySumDataMemo.find((item) => item.name === "ghgEmission")?.value || 0;
  const wasteWater =
    categorySumDataMemo.find((item) => item.name === "wasteWater")?.value || 0;
  const energy =
    categorySumDataMemo.find((item) => item.name === "energy")?.value || 0;
  const water =
    categorySumDataMemo.find((item) => item.name === "water")?.value || 0;
  const amount =
    categorySumDataMemo.find((item) => item.name === "amount")?.value || 0;
  const waste =
    categorySumDataMemo.find((item) => item.name === "waste")?.value || 0;

  const waterVsWastePercentage = useMemo(() => {
    return waterWastePercentageData?.waterToWastePercentage ?? 0;
  }, [waterWastePercentageData]);

  const ghgDatasetMemo = useMemo(() => {
    if (!ghgDataset?.length) return [];
    return ghgDataset;
  }, [ghgDataset]);

  const handleFetch = () => {
    refetchCategorySumData();
    refetchWasteWaterPercentageData();
    refetchMonthlyQuantityDataData();
    refetchConsumptionRenewableEnergy();
    refetchFetchConsumptionScope();
    refetchFetchConsumptionSourceCounts();
    refetchFetchConsumptionWasteWaterDetails();
    refetchFetchConsumptionEnergyRecodeDetails();
    refetchFetchConsumptionStatusSummery();
  };

  //Sample Data
  const fabricCutDataMemo = useMemo(() => {
    if (!fabricCutData?.length) return [];
    return fabricCutData;
  }, [fabricCutData]);

  const lineDataMemo = useMemo(() => {
    if (!lineData?.length) return [];
    return lineData;
  }, [lineData]);

  const pieChartEmissionBreakDownDataMemo = useMemo(() => {
    if (!pieChartEmissionBreakDownData?.length) return [];
    return pieChartEmissionBreakDownData;
  }, [pieChartEmissionBreakDownData]);

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
                {...register("division", { required: true })}
                size="small"
                options={divisionData?.map((division) => division.divisionName)}
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
              <Controller
                name="month"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    size="small"
                    options={
                      monthData?.length
                        ? monthData.map((month) => month.month)
                        : []
                    }
                    sx={{ flex: 1, margin: "0.5rem" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        error={!!errors.month}
                        helperText={errors.month && "Required"}
                        label="Month"
                        name="month"
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
                defaultValue={new Date().getFullYear()}
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
            title="Total GHG Emission"
            titleIcon={<NaturePeopleIcon fontSize="large" />}
            value={division && month ? ghgEmission : totalGhgEmission}
            subDescription="tCo2e"
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
            title="Water"
            titleIcon={<WaterDropOutlinedIcon fontSize="large" />}
            value={division && month ? water : totalWater}
            subDescription="5% From previous period"
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
            title="Waste"
            titleIcon={<DeleteOutlineOutlinedIcon fontSize="large" />}
            value={division && month ? waste : totalWaste}
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
            title="Waste Water"
            titleIcon={<ShowerOutlinedIcon fontSize="large" />}
            value={division && month ? wasteWater : totalWasteWater}
            subDescription="2% From previous period"
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
            title="Total Energy"
            titleIcon={<BatteryChargingFullOutlinedIcon fontSize="large" />}
            value={division && month ? energy : totalEnergy}
            subDescription="0% From previous period"
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
            titleIcon={<CreditCardIcon fontSize="large" />}
            value={division && month ? amount : totalAmount}
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
              Consumption
            </Typography>
          </Box>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              width={800}
              height={400}
              data={
                division && month
                  ? monthlyQuantityDataMemo
                  : consumptionYearlyCategorySummaryDataMemo
              }
            >
              <XAxis dataKey="month" />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="energy"
                name="Total Energy"
                stackId="a"
                fill="#4f46e5"
                barSize={10}
              />
              <Bar
                dataKey="wasteWater"
                name="Waste Water"
                stackId="a"
                fill="#10b981"
                barSize={10}
              />
              <Bar
                dataKey="waste"
                name="Waste"
                stackId="a"
                fill="#f59e0b"
                barSize={10}
              />
              <Bar
                dataKey="water"
                name="Water Usage"
                stackId="a"
                fill="#3b82f6"
                barSize={10}
              />
              <Bar
                dataKey="ghgEmission"
                name="GHG Emission"
                stackId="a"
                fill="#ef4444"
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
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
            }}
          >
            Waste
          </Typography>
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
                        <ScienceOutlinedIcon fontSize="small" />
                        <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                          Hazardous
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
                        <AcUnitOutlinedIcon fontSize="small" />
                        <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                          Non Hazardous
                        </Typography>
                      </Box>
                    }
                    {...a11yProps(2)}
                  />
                </Tabs>
              </AppBar>
              <TabPanel value={activeTab} index={0} dir={theme.direction}>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      direction: "row",
                      m: "1rem",
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap={4}
                      width={"100%"}
                    >
                      {fabricCutDataMemo.map((item, index) => (
                        <>
                          <Box
                            key={index}
                            display="flex"
                            justifyContent="space-between"
                          >
                            <Box flex={2}>
                              <Typography>{item.label}</Typography>
                              <Typography>{item.unit}</Typography>
                            </Box>
                            <Box>
                              <Box
                                flex={1}
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: "3rem",
                                  justifyContent: "space-between",
                                }}
                              >
                                <CircularProgressWithLabel
                                  size={60}
                                  value={item.progress}
                                />
                                <Box>
                                  <Typography>Quantity</Typography>
                                  <Typography>{item.quantity}</Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                          <Divider />
                        </>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </TabPanel>
              <TabPanel value={activeTab} index={1} dir={theme.direction}>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      direction: "row",
                      m: "1rem",
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap={4}
                      width={"100%"}
                    >
                      {fabricCutDataMemo.map((item, index) => (
                        <>
                          <Box
                            key={index}
                            display="flex"
                            justifyContent="space-between"
                          >
                            <Box flex={2}>
                              <Typography>{item.label}</Typography>
                              <Typography>{item.unit}</Typography>
                            </Box>
                            <Box>
                              <Box
                                flex={1}
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: "3rem",
                                  justifyContent: "space-between",
                                }}
                              >
                                <CircularProgressWithLabel
                                  size={60}
                                  value={item.progress}
                                />
                                <Box>
                                  <Typography>Quantity</Typography>
                                  <Typography>{item.quantity}</Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                          <Divider />
                        </>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </TabPanel>
              <TabPanel value={activeTab} index={2} dir={theme.direction}>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      direction: "row",
                      m: "1rem",
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap={4}
                      width={"100%"}
                    >
                      {fabricCutDataMemo.map((item, index) => (
                        <>
                          <Box
                            key={index}
                            display="flex"
                            justifyContent="space-between"
                          >
                            <Box flex={2}>
                              <Typography>{item.label}</Typography>
                              <Typography>{item.unit}</Typography>
                            </Box>
                            <Box>
                              <Box
                                flex={1}
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: "3rem",
                                  justifyContent: "space-between",
                                }}
                              >
                                <CircularProgressWithLabel
                                  size={60}
                                  value={item.progress}
                                />
                                <Box>
                                  <Typography>Quantity</Typography>
                                  <Typography>{item.quantity}</Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                          <Divider />
                        </>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </TabPanel>
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
              Energy Consumption Footprint
            </Typography>
          </Box>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              width={800}
              height={400}
              data={
                totalEnergyCountMemo?.length > 0
                  ? totalEnergyCountMemo
                  : totalEnergyAllCountMemo
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />

              {(energySources?.length > 0
                ? energySources
                : energyAllSources
              ).map((source, index) => (
                <Line
                  key={source}
                  type="monotone"
                  dataKey={source}
                  stroke={
                    index % 5 === 0
                      ? "#8B5CF6" // Vibrant Purple
                      : index % 5 === 1
                      ? "#0EA5E9" // Sky Blue
                      : index % 5 === 2
                      ? "#22C55E" // Emerald Green
                      : index % 5 === 3
                      ? "#F59E0B" // Amber
                      : "#EF4444"
                  } // Bright Red
                  dot={({ index }) =>
                    index % 2 === 0 ? <circle r={5} fill="red" /> : null
                  }
                  connectNulls={true}
                />
              ))}
            </LineChart>
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
            Renewable Energy Usage
          </Typography>
          <ResponsiveContainer width="100%" height={500}>
            <>
              <Box>
                <Box display={"flex"} justifyContent={"center"} mt={7}>
                  <Box>
                    <CircularProgressWithLabel
                      size={250}
                      value={
                        division && month
                          ? renewableEnergyPercentageMemo
                          : renewableAllEnergyPercentageMemo
                      }
                      textSize={25}
                      textLabel="Percentage"
                    />
                  </Box>
                </Box>
                <Box display={"flex"} flexDirection={"column"} gap={2} m={3}>
                  <Typography display={"flex"} justifyContent={"center"}>
                    Month:{" "}
                    {division && month
                      ? renewableEnergyMonthMemo
                      : renewableEnergyAllMonthMemo}
                  </Typography>
                  <Typography display={"flex"} justifyContent={"center"}>
                    Total Renewable Energy:{" "}
                    {division && month
                      ? renewableEnergyTotalRenewMemo
                      : renewableEnergyAllTotalRenewMemo}{" "}
                    kWh
                  </Typography>
                  <Typography display={"flex"} justifyContent={"center"}>
                    Total Renewable Energy:{" "}
                    {division && month
                      ? renewableEnergyTotalEnergyMemo
                      : renewableEnergyAllTotalEnergyMemo}{" "}
                    kWh
                  </Typography>
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
                        <OfflineBoltIcon fontSize="small" />
                        <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                          Energy
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
                        <WaterDropOutlinedIcon fontSize="small" />
                        <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                          Water
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
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                        <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                          Waste
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
                        <Co2Icon fontSize="large" />
                        <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                          Air Emission
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
                        <ShowerOutlinedIcon fontSize="small" />
                        <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                          Waste Water
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
                  {division && month
                    ? consumptionSourceCountsDataMemo.map((item, index) => (
                        <Box key={index}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              m: "1rem",
                            }}
                          >
                            <Box flex={2}>
                              <Typography>{item.label}</Typography>
                              <Typography variant="caption">
                                in {item.category} Category
                              </Typography>
                            </Box>
                            <Box
                              flex={1}
                              sx={{
                                display: "flex",
                                flexDirection: "row",
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
                      ))
                    : consumptionSourceCountsAllDataMemo.map((item, index) => (
                        <Box key={index}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              m: "1rem",
                            }}
                          >
                            <Box flex={2}>
                              <Typography>{item.label}</Typography>
                              <Typography variant="caption">
                                in {item.category} Category
                              </Typography>
                            </Box>
                            <Box
                              flex={1}
                              sx={{
                                display: "flex",
                                flexDirection: "row",
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
                  {division && month
                    ? consumptionSourceCountsDataMemo
                        .filter((item) => item.category === "Energy")
                        .map((item, index) => (
                          <Box key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                m: "1rem",
                              }}
                            >
                              <Box flex={2}>
                                <Typography>{item.label}</Typography>
                                <Typography variant="caption">
                                  in {item.category} Category
                                </Typography>
                              </Box>
                              <Box
                                flex={1}
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
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
                        ))
                    : consumptionSourceCountsAllDataMemo
                        .filter(
                          (item) => item.category.toLowerCase() === "energy"
                        )
                        .map((item, index) => (
                          <Box key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                m: "1rem",
                              }}
                            >
                              <Box flex={2}>
                                <Typography>{item.label}</Typography>
                                <Typography variant="caption">
                                  in {item.category} Category
                                </Typography>
                              </Box>
                              <Box
                                flex={1}
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
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
                  {division && month
                    ? consumptionSourceCountsDataMemo
                        .filter((item) => item.category === "Water")
                        .map((item, index) => (
                          <Box key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                m: "1rem",
                              }}
                            >
                              <Box flex={2}>
                                <Typography>{item.label}</Typography>
                                <Typography variant="caption">
                                  in {item.category} Category
                                </Typography>
                              </Box>
                              <Box
                                flex={1}
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
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
                        ))
                    : consumptionSourceCountsAllDataMemo
                        .filter(
                          (item) => item.category.toLowerCase() === "water"
                        )
                        .map((item, index) => (
                          <Box key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                m: "1rem",
                              }}
                            >
                              <Box flex={2}>
                                <Typography>{item.label}</Typography>
                                <Typography variant="caption">
                                  in {item.category} Category
                                </Typography>
                              </Box>
                              <Box
                                flex={1}
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
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
                  {division && month
                    ? consumptionSourceCountsDataMemo
                        .filter((item) => item.category === "Waste")
                        .map((item, index) => (
                          <Box key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                m: "1rem",
                              }}
                            >
                              <Box flex={2}>
                                <Typography>{item.label}</Typography>
                                <Typography variant="caption">
                                  in {item.category} Category
                                </Typography>
                              </Box>
                              <Box
                                flex={1}
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
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
                        ))
                    : consumptionSourceCountsAllDataMemo
                        .filter(
                          (item) => item.category.toLowerCase() === "waste"
                        )
                        .map((item, index) => (
                          <Box key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                m: "1rem",
                              }}
                            >
                              <Box flex={2}>
                                <Typography>{item.label}</Typography>
                                <Typography variant="caption">
                                  in {item.category} Category
                                </Typography>
                              </Box>
                              <Box
                                flex={1}
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
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
                  {division && month
                    ? consumptionSourceCountsDataMemo
                        .filter((item) => item.category === "GHG Emissions")
                        .map((item, index) => (
                          <Box key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                m: "1rem",
                              }}
                            >
                              <Box flex={2}>
                                <Typography>{item.label}</Typography>
                                <Typography variant="caption">
                                  in {item.category} Category
                                </Typography>
                              </Box>
                              <Box
                                flex={1}
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
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
                        ))
                    : consumptionSourceCountsAllDataMemo
                        .filter(
                          (item) =>
                            item.category.toLowerCase() === "ghg emissions"
                        )
                        .map((item, index) => (
                          <Box key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                m: "1rem",
                              }}
                            >
                              <Box flex={2}>
                                <Typography>{item.label}</Typography>
                                <Typography variant="caption">
                                  in {item.category} Category
                                </Typography>
                              </Box>
                              <Box
                                flex={1}
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
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
                  {division && month
                    ? consumptionSourceCountsDataMemo
                        .filter((item) => item.category === "Waste Water")
                        .map((item, index) => (
                          <Box key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                m: "1rem",
                              }}
                            >
                              <Box flex={2}>
                                <Typography>{item.label}</Typography>
                                <Typography variant="caption">
                                  in {item.category} Category
                                </Typography>
                              </Box>
                              <Box
                                flex={1}
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
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
                        ))
                    : consumptionSourceCountsAllDataMemo
                        .filter(
                          (item) =>
                            item.category.toLowerCase() === "waste water"
                        )
                        .map((item, index) => (
                          <Box key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                m: "1rem",
                              }}
                            >
                              <Box flex={2}>
                                <Typography>{item.label}</Typography>
                                <Typography variant="caption">
                                  in {item.category} Category
                                </Typography>
                              </Box>
                              <Box
                                flex={1}
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
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
              <Box display="flex" justifyContent="center">
                <CustomPieChart
                  data={
                    division && month
                      ? categorySumDataMemo
                      : consumptionCategorySumDataMemo
                  }
                  title="Total Category Data"
                />
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
            <BarChart
              width={800}
              height={400}
              data={
                division && month
                  ? consumptionScopeDataMemo
                  : consumptionScopeAllDataMemo
              }
            >
              <XAxis dataKey="month" />
              <YAxis fontSize={12} fontWeight={"bold"} />
              <Tooltip />
              <Legend />
              {Object.keys(ghgDatasetMemo[0])
                .filter((key) => key.startsWith("scope"))
                .map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    name={key.replace(/scope(\d)/i, "Scope $1")}
                    stackId="a"
                    fill={scopeColors[key] || "#8884d8"}
                    barSize={10}
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
          <ResponsiveContainer width="100%" height={500}>
            <>
              <Box display={"flex"} justifyContent={"center"}>
                <Box display={"flex"} justifyContent={"center"}>
                  <CustomPieChart
                    data={
                      division && month ? waterSumDataMemo : waterSumAllDataMemo
                    }
                    title="Waste Water Treatment"
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
                    data={
                      month && division ? statusSummeryDataMemo : statusSummeryAllDataMemo
                    }
                    width={400}
                    height={400}
                    title="Environment Status Summery"
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
                  {division && month ? (
                    <PercentagePieChart data={wasteWaterDetailsDataMemo} />
                  ) : (
                    <PercentagePieChart data={wasteWaterDetailsAllDataMemo} />
                  )}
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
              <Box>
                <Box display={"flex"} justifyContent={"center"} mt={7}>
                  <Box>
                    <CircularProgressWithLabel
                      size={250}
                      value={
                        division && month
                          ? waterVsWastePercentage
                          : waterVsWasteAllPercentage
                      }
                      textSize={25}
                      textLabel="Percentage"
                    />
                  </Box>
                </Box>
                <Box display={"flex"} flexDirection={"column"} gap={2} m={3}>
                  <Typography display={"flex"} justifyContent={"center"}>
                    Month:{" "}
                    {division && month
                      ? renewableWaterMonthMemo
                      : renewableWaterAllMonthMemo}
                  </Typography>
                </Box>
              </Box>
            </>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Stack>
  );
}

export default EnvironmentDashboard;
