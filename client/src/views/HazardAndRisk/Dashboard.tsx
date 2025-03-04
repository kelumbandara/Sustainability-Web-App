import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Divider,
  Stack,
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
  getHazardRiskList,
} from "../../api/hazardRiskApi";
import useIsMobile from "../../customHooks/useIsMobile";
import {
  subWeeks,
  subMonths,
  subYears,
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfWeek,
  endOfMonth,
  endOfYear,
  isWithinInterval,
} from "date-fns";
import { sampleDivisions } from "../../api/sampleData/documentData";
import DateRangePicker from "../../components/DateRangePicker";
import CustomButton from "../../components/CustomButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardCard from "../../components/DashboardCard";
import FunctionsIcon from "@mui/icons-material/Functions";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingIcon from "@mui/icons-material/Pending";
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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import CircularProgressWithLabel from "../../components/CircularProgress";

const breadcrumbItems = [
  { title: "Home", href: "/home" },
  { title: "Hazard & Risk Management" },
];

function HazardAndRiskDashboard() {
  const { isMobile, isTablet } = useIsMobile();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const watchPeriod = watch("period");

  const { data: riskData = [], isFetching: isRiskDataFetching } = useQuery({
    queryKey: ["hazardRisks"],
    queryFn: getHazardRiskList,
  });

  const selectedPeriod = watch("period");
  const selectedDivision = watch("division");
  const selectedCategory = watch("category");

  const filteredRiskData = riskData?.filter((risk) => {
    const riskDate = new Date(risk.created_at);
    const today = new Date();

    let startDate: Date | null = null;
    let endDate: Date | null = null;

    switch (selectedPeriod) {
      case HazardDashboardPeriods.THIS_WEEK:
        startDate = startOfWeek(today);
        endDate = endOfWeek(today);
        break;
      case HazardDashboardPeriods.LAST_WEEK:
        startDate = startOfWeek(subWeeks(today, 1));
        endDate = endOfWeek(subWeeks(today, 1));
        break;
      case HazardDashboardPeriods.THIS_MONTH:
        startDate = startOfMonth(today);
        endDate = endOfMonth(today);
        break;
      case HazardDashboardPeriods.LAST_MONTH:
        startDate = startOfMonth(subMonths(today, 1));
        endDate = endOfMonth(subMonths(today, 1));
        break;
      case HazardDashboardPeriods.THIS_YEAR:
        startDate = startOfYear(today);
        endDate = endOfYear(today);
        break;
      case HazardDashboardPeriods.LAST_YEAR:
        startDate = startOfYear(subYears(today, 1));
        endDate = endOfYear(subYears(today, 1));
        break;
      case HazardDashboardPeriods.CUSTOM:
        {
          const dateRange = watch("dateRange");
          if (Array.isArray(dateRange) && dateRange.length === 2) {
            startDate = new Date(dateRange[0]);
            endDate = new Date(dateRange[1]);
          } else {
            startDate = null;
            endDate = null;
          }
        }
        break;
    }

    const matchesPeriod =
      startDate && endDate
        ? isWithinInterval(riskDate, { start: startDate, end: endDate })
        : true;
    const matchesDivision = selectedDivision
      ? risk.division === selectedDivision
      : true;
    const matchesCategory = selectedCategory
      ? risk.category === selectedCategory
      : true;

    return matchesPeriod && matchesDivision && matchesCategory;
  });

  const filteredRiskDataForBarChart = useMemo(() => {
    if (!selectedDivision) return [];

    return (
      riskData?.filter((risk) => {
        const riskDate = new Date(risk.created_at);
        const today = new Date();

        let startDate: Date | null = null;
        let endDate: Date | null = null;

        switch (selectedPeriod) {
          case HazardDashboardPeriods.THIS_WEEK:
            startDate = startOfWeek(today);
            endDate = endOfWeek(today);
            break;
          case HazardDashboardPeriods.LAST_WEEK:
            startDate = startOfWeek(subWeeks(today, 1));
            endDate = endOfWeek(subWeeks(today, 1));
            break;
          case HazardDashboardPeriods.THIS_MONTH:
            startDate = startOfMonth(today);
            endDate = endOfMonth(today);
            break;
          case HazardDashboardPeriods.LAST_MONTH:
            startDate = startOfMonth(subMonths(today, 1));
            endDate = endOfMonth(subMonths(today, 1));
            break;
          case HazardDashboardPeriods.THIS_YEAR:
            startDate = startOfYear(today);
            endDate = endOfYear(today);
            break;
          case HazardDashboardPeriods.LAST_YEAR:
            startDate = startOfYear(subYears(today, 1));
            endDate = endOfYear(subYears(today, 1));
            break;
          case HazardDashboardPeriods.CUSTOM: {
            const dateRange = watch("dateRange");
            if (Array.isArray(dateRange) && dateRange.length === 2) {
              startDate = new Date(dateRange[0]);
              endDate = new Date(dateRange[1]);
            }
            break;
          }
        }

        const matchesPeriod =
          startDate && endDate
            ? isWithinInterval(riskDate, { start: startDate, end: endDate })
            : true;
        const matchesDivision =
          risk.division.toLowerCase() === selectedDivision.toLowerCase();

        return matchesPeriod && matchesDivision;
      }) || []
    );
  }, [selectedPeriod, selectedDivision, riskData]);

  const filteredRiskDataForCase = useMemo(() => {
    if (!selectedDivision || !Array.isArray(riskData)) return [];

    return riskData.filter((risk) => {
      const riskDate = new Date(risk.created_at);
      const today = new Date();

      let startDate: Date | null = null;
      let endDate: Date | null = null;

      switch (selectedPeriod) {
        case HazardDashboardPeriods.THIS_WEEK:
          startDate = startOfWeek(today);
          endDate = endOfWeek(today);
          break;
        case HazardDashboardPeriods.LAST_WEEK:
          startDate = startOfWeek(subWeeks(today, 1));
          endDate = endOfWeek(subWeeks(today, 1));
          break;
        case HazardDashboardPeriods.THIS_MONTH:
          startDate = startOfMonth(today);
          endDate = endOfMonth(today);
          break;
        case HazardDashboardPeriods.LAST_MONTH:
          startDate = startOfMonth(subMonths(today, 1));
          endDate = endOfMonth(subMonths(today, 1));
          break;
        case HazardDashboardPeriods.THIS_YEAR:
          startDate = startOfYear(today);
          endDate = endOfYear(today);
          break;
        case HazardDashboardPeriods.LAST_YEAR:
          startDate = startOfYear(subYears(today, 1));
          endDate = endOfYear(subYears(today, 1));
          break;
        case HazardDashboardPeriods.CUSTOM: {
          const dateRange = watch("dateRange");
          if (
            Array.isArray(dateRange) &&
            dateRange.length === 2 &&
            dateRange[0] &&
            dateRange[1]
          ) {
            startDate = new Date(dateRange[0]);
            endDate = new Date(dateRange[1]);
          }
          break;
        }
      }

      const matchesPeriod =
        startDate && endDate
          ? isWithinInterval(riskDate, { start: startDate, end: endDate })
          : true;
      const matchesDivision =
        risk.division.trim().toLowerCase() ===
        selectedDivision.trim().toLowerCase();

      return matchesPeriod && matchesDivision;
    });
  }, [selectedPeriod, selectedDivision, riskData, watch]);

  const riskLevelDataWithCases = useMemo(() => {
    if (!filteredRiskDataForCase.length) return [];

    const riskCount = {
      High: { riskLevelCount: 0, pendingCount: 0, completedCount: 0 },
      Medium: { riskLevelCount: 0, pendingCount: 0, completedCount: 0 },
      Low: { riskLevelCount: 0, pendingCount: 0, completedCount: 0 },
    };

    filteredRiskDataForCase.forEach((risk) => {
      const riskLevel = risk.riskLevel;
      if (riskCount[riskLevel]) {
        riskCount[riskLevel].riskLevelCount += 1;

        // Normalize the status comparison to lowercase to ensure proper matching
        if (risk.status.toLowerCase() === "pending") {
          riskCount[riskLevel].pendingCount += 1;
        }
        if (risk.status.toLowerCase() === "completed") {
          riskCount[riskLevel].completedCount += 1;
        }
      }
    });

    return Object.keys(riskCount).map((level) => ({
      name: level,
      riskLevelCount: riskCount[level].riskLevelCount,
      pendingCount: riskCount[level].pendingCount,
      completedCount: riskCount[level].completedCount,
    }));
  }, [filteredRiskDataForCase]);

  const riskLevelData = useMemo(() => {
    if (!filteredRiskDataForBarChart.length) return [];

    const riskCount = { High: 0, Medium: 0, Low: 0 };

    filteredRiskDataForBarChart.forEach((risk) => {
      if (riskCount[risk.riskLevel] !== undefined) {
        riskCount[risk.riskLevel] += 1;
      }
    });

    return [
      { name: "High", riskLevelCount: riskCount.High },
      { name: "Medium", riskLevelCount: riskCount.Medium },
      { name: "Low", riskLevelCount: riskCount.Low },
    ];
  }, [filteredRiskDataForBarChart]);

  const barChartData = riskLevelData.length
    ? riskLevelData
    : [{ name: "No data available", riskLevelCount: 0 }];

  const totalRisks = filteredRiskData?.length || 0;
  const completedRisks =
    filteredRiskData?.filter((item) => item.status === "Completed").length || 0;
  const pendingRisks =
    filteredRiskData?.filter((item) => item.status === "Pending").length || 0;

  const hazardRiskChartData1 = useMemo(() => {
    if (!riskData) return [];

    const groupedData = riskData.reduce((acc, item) => {
      acc[item.division] = (acc[item.division] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(groupedData).map(([division, count]) => ({
      name: division,
      pv: count,
    }));
  }, [riskData]);

  const pieChartData = [
    { name: "Completed", value: completedRisks },
    { name: "Pending", value: pendingRisks },
  ];

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
        <PageTitle title="Hazard & Risk Management Dashboard" />
        <Breadcrumb breadcrumbs={breadcrumbItems} />
      </Box>

      <Accordion
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            borderBottom: "1px solid var(--pallet-border-blue)",
            borderRadius: "0.3rem",
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
                {...register("period", { required: false })}
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
                {...register("division", { required: false })}
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
                {...register("category", { required: false })}
                size="small"
                options={HazardOrRiskCategories?.map(
                  (category) => category.name
                )}
                sx={{ flex: 1, margin: "0.5rem" }}
                onChange={(e, value) => {
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
              onClick={() => reset()}
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
            minWidth: "250px",
            margin: "0.5rem",
          }}
        >
          <DashboardCard
            title="Total"
            titleIcon={<FunctionsIcon fontSize="small" />}
            value={totalRisks}
            subDescription="10% From previous period"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            margin: "0.5rem",
            minWidth: "250px",
          }}
        >
          <DashboardCard
            title="Completed"
            titleIcon={<CheckCircleOutlineIcon fontSize="small" />}
            value={completedRisks}
            subDescription={`${
              (completedRisks / totalRisks) * 100
            }% From previous period`}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            margin: "0.5rem",
            minWidth: "250px",
          }}
        >
          <DashboardCard
            title="Pending"
            titleIcon={<PendingIcon fontSize="small" />}
            value={pendingRisks}
            subDescription={`${
              (pendingRisks / totalRisks) * 100
            }% From previous period`}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            margin: "0.5rem",
            minWidth: "250px",
          }}
        >
          <DashboardCard
            title="Amount"
            titleIcon={<CreditCardIcon fontSize="small" />}
            value={5}
            subDescription="5% From previous period"
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: isTablet ? "column" : "row",
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
              Total Hazard Risks For Divisions
            </Typography>
          </Box>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={hazardRiskChartData1}
              margin={{
                top: 50,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-15}
                textAnchor="end"
                fontSize={"small"}
              />
              <YAxis
                label={{
                  value: "Division",
                  position: "top",
                  offset: 25,
                }}
                fontSize={"small"}
              />
              <Tooltip />
              <Line
                type="linear"
                dataKey="pv"
                stroke="var(--pallet-blue)"
                activeDot={{ r: 8 }}
              />
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
            Status
          </Typography>
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 60 : isTablet ? 80 : 100}
                innerRadius={isMobile ? 40 : isTablet ? 60 : 80}
                fill="#8884d8"
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["var(--pallet-blue)", "var(--pallet-light-grey)"][
                        index % 2
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: "var(--pallet-blue)" }}
            >
              {selectedPeriod ? selectedPeriod : "All Status"}
            </Typography>
            <Typography variant="subtitle1">{totalRisks} Cases</Typography>
            <Typography
              variant="subtitle2"
              sx={{ color: "var(--pallet-grey)" }}
            >
              0 From Previous Period
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: isTablet ? "column" : "row",
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
            borderRadius: "0.3rem",
            border: "1px solid var(--pallet-border-blue)",
            padding: "1rem",
          }}
        >
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={barChartData}
              margin={{
                top: 50,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" textAnchor="center" fontSize={"small"} />
              <YAxis
                label={{
                  value: "Count",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: "small",
                }}
                fontSize={"small"}
              />
              <Tooltip />
              <Bar
                dataKey="riskLevelCount"
                fill="var(--pallet-blue)"
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: "var(--pallet-blue)" }}
            >
              {selectedDivision
                ? selectedDivision
                : "Select a Division to watch Risk Levels"}
            </Typography>
            <Typography variant="subtitle1">
              Total Hazard Risks - {totalRisks}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ color: "var(--pallet-blue)" }}
            >
              {selectedPeriod
                ? `${totalRisks} From ${selectedPeriod}`
                : "Choose a Time period"}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flex: 1,
            flexDirection: "column",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            marginTop: "1rem",
            borderRadius: "0.3rem",
            border: "1.5px solid var(--pallet-border-blue)",
            padding: "1rem",
          }}
        >
          <Stack spacing="auto" direction="column" sx={{ height: "100%" }}>
            <Divider sx={{ backgroundColor: "var(--pallet-light-grey)" }} />
            <Stack direction="column">
              <Box
                sx={{
                  gap: 2,
                  marginX: "1rem",
                }}
              >
                <Typography variant="button">High Level Cases</Typography>
                <Typography variant="h6">
                  {riskLevelData.find((data) => data.name === "High")
                    ?.riskLevelCount || 0}
                </Typography>
                <Typography>0%</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexGrow: 1,
                  gap: 10,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <CircularProgressWithLabel
                    size={60}
                    value={(() => {
                      const highRiskData = riskLevelDataWithCases.find(
                        (data) => data.name === "High"
                      );
                      return highRiskData && highRiskData.riskLevelCount > 0
                        ? (highRiskData.pendingCount /
                            highRiskData.riskLevelCount) *
                            100
                        : 0;
                    })()}
                  />
                  <Typography variant="subtitle2">Reported Cases</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <CircularProgressWithLabel
                    size={60}
                    value={(() => {
                      const highRiskData = riskLevelDataWithCases.find(
                        (data) => data.name === "High"
                      );
                      return highRiskData && highRiskData.riskLevelCount > 0
                        ? (highRiskData.completedCount /
                            highRiskData.riskLevelCount) *
                            100
                        : 0;
                    })()}
                  />
                  <Typography variant="subtitle2">Closed Cases</Typography>
                </Box>
              </Box>
            </Stack>

            <Divider sx={{ backgroundColor: "var(--pallet-light-grey)" }} />
            <Stack direction="column">
              <Box
                sx={{
                  gap: 2,
                  marginX: "1rem",
                }}
              >
                <Typography variant="button">Medium Level Cases</Typography>
                <Typography variant="h6">
                  {riskLevelData.find((data) => data.name === "Medium")
                    ?.riskLevelCount || 0}
                </Typography>
                <Typography>0%</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexGrow: 1,
                  gap: 10,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <CircularProgressWithLabel
                    size={60}
                    value={(() => {
                      const highRiskData = riskLevelDataWithCases.find(
                        (data) => data.name === "Medium"
                      );
                      return highRiskData && highRiskData.riskLevelCount > 0
                        ? (highRiskData.pendingCount /
                            highRiskData.riskLevelCount) *
                            100
                        : 0;
                    })()}
                  />
                  <Typography variant="subtitle2">Reported Cases</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <CircularProgressWithLabel
                    size={60}
                    value={(() => {
                      const highRiskData = riskLevelDataWithCases.find(
                        (data) => data.name === "Medium"
                      );
                      return highRiskData && highRiskData.riskLevelCount > 0
                        ? (highRiskData.completedCount /
                            highRiskData.riskLevelCount) *
                            100
                        : 0;
                    })()}
                  />
                  <Typography variant="subtitle2">Closed Cases</Typography>
                </Box>
              </Box>
            </Stack>

            <Divider sx={{ backgroundColor: "var(--pallet-light-grey)" }} />
            <Stack direction="column">
              <Box
                sx={{
                  gap: 2,
                  marginX: "1rem",
                }}
              >
                <Typography variant="button">Low Level Cases</Typography>
                <Typography variant="h6">
                  {riskLevelData.find((data) => data.name === "Low")
                    ?.riskLevelCount || 0}
                </Typography>
                <Typography>0%</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexGrow: 1,
                  gap: 10,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <CircularProgressWithLabel
                    size={60}
                    value={(() => {
                      const highRiskData = riskLevelDataWithCases.find(
                        (data) => data.name === "Low"
                      );
                      return highRiskData && highRiskData.riskLevelCount > 0
                        ? (highRiskData.pendingCount /
                            highRiskData.riskLevelCount) *
                            100
                        : 0;
                    })()}
                  />
                  <Typography variant="subtitle2">Reported Cases</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <CircularProgressWithLabel
                    size={60}
                    value={(() => {
                      const highRiskData = riskLevelDataWithCases.find(
                        (data) => data.name === "Low"
                      );
                      return highRiskData && highRiskData.riskLevelCount > 0
                        ? (highRiskData.completedCount /
                            highRiskData.riskLevelCount) *
                            100
                        : 0;
                    })()}
                  />
                  <Typography variant="subtitle2">Closed Cases </Typography>
                </Box>
              </Box>
            </Stack>
            <Divider sx={{ backgroundColor: "var(--pallet-light-grey)" }} />
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
}

export default HazardAndRiskDashboard;
