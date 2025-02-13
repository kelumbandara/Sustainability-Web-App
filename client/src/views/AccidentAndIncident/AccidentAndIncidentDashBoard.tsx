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
} from "../../api/hazardRiskApi";
import useIsMobile from "../../customHooks/useIsMobile";
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
} from "recharts";
import {
  hazardRiskChartData1,
  hazardRiskChartData2,
} from "../../api/sampleData/hazardRiskData";
import { useQuery } from "@tanstack/react-query";
import { getAccidentsList, getIncidentsList } from "../../api/accidentAndIncidentApi";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subWeeks,
  subMonths,
  subYears,
  isWithinInterval,
} from "date-fns";
import { fetchDivision } from "../../api/divisionApi";

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
  const watchDivision = watch("division");
  const watchCategory = watch("category");

  const { data: accidentData, isFetching: isAccidentDataFetching } = useQuery({
    queryKey: ["accidents"],
    queryFn: getAccidentsList,
  });

  const { data: incidentData, isFetching: isIncidentDataFetching } = useQuery({
    queryKey: ["incidents"],
    queryFn: getIncidentsList,
  });

  const { data: divisionData, isFetching: isCategoryDataFetching } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  const filterByPeriod = (data: any[], period: string) => {
    const now = new Date();
    switch (period) {
      case HazardDashboardPeriods.THIS_WEEK:
        return data.filter((item) => {
          const itemDate = new Date(item.accidentDate || item.incidentDate);
          return isWithinInterval(itemDate, { start: startOfWeek(now), end: endOfWeek(now) });
        });
      case HazardDashboardPeriods.LAST_WEEK:
        return data.filter((item) => {
          const itemDate = new Date(item.accidentDate || item.incidentDate);
          return isWithinInterval(itemDate, { start: startOfWeek(subWeeks(now, 1)), end: endOfWeek(subWeeks(now, 1)) });
        });
      case HazardDashboardPeriods.THIS_MONTH:
        return data.filter((item) => {
          const itemDate = new Date(item.accidentDate || item.incidentDate);
          return isWithinInterval(itemDate, { start: startOfMonth(now), end: endOfMonth(now) });
        });
      case HazardDashboardPeriods.LAST_MONTH:
        return data.filter((item) => {
          const itemDate = new Date(item.accidentDate || item.incidentDate);
          return isWithinInterval(itemDate, { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) });
        });
      case HazardDashboardPeriods.THIS_YEAR:
        return data.filter((item) => {
          const itemDate = new Date(item.accidentDate || item.incidentDate);
          return isWithinInterval(itemDate, { start: startOfYear(now), end: endOfYear(now) });
        });
      case HazardDashboardPeriods.LAST_YEAR:
        return data.filter((item) => {
          const itemDate = new Date(item.accidentDate || item.incidentDate);
          return isWithinInterval(itemDate, { start: startOfYear(subYears(now, 1)), end: endOfYear(subYears(now, 1)) });
        });
      case HazardDashboardPeriods.CUSTOM:
        return data.filter((item) => {
          return true;
        });
      default:
        return data;
    }
  };

  const applyFilters = () => {
    if (!accidentData || !incidentData) {
      return { accidents: [], incidents: [] };
    }

    let filteredAccidents = accidentData;
    let filteredIncidents = incidentData;

    // Filter by period
    if (watchPeriod) {
      filteredAccidents = filterByPeriod(filteredAccidents, watchPeriod);
      filteredIncidents = filterByPeriod(filteredIncidents, watchPeriod);
    }

    // Filter by division
    if (watchDivision) {
      filteredAccidents = filteredAccidents.filter((accident) => accident.division === watchDivision);
      filteredIncidents = filteredIncidents.filter((incident) => incident.division === watchDivision);
    }

    // Filter by category
    if (watchCategory) {
      filteredAccidents = filteredAccidents.filter((accident) => accident.category === watchCategory);
      filteredIncidents = filteredIncidents.filter((incident) => incident.category === watchCategory);
    }

    return {
      accidents: filteredAccidents,
      incidents: filteredIncidents,
    };
  };

  const filterByStatus = () => {
    const openAccidentsCount = accidents.filter(
      (accident) => accident.status?.toLowerCase() === "open"
    ).length;
    const closedAccidentsCount = accidents.filter(
      (accident) => accident.status?.toLowerCase() === "close"
    ).length;
  
    const openIncidentsCount = incidents.filter(
      (incident) => incident.status?.toLowerCase() === "draft"
    ).length;
    const closeIncidentsCount = incidents.filter(
      (incident) => incident.status?.toLowerCase() === "close"
    ).length;
  
    return {
      openAccidentsCount,
      openIncidentsCount,
      closeIncidentsCount,
      closedAccidentsCount
    };
  };

  const processHazardChartData = () => {
    if (!accidentData) return [];
      let filteredAccidents = watchPeriod ? filterByPeriod(accidentData, watchPeriod) : accidentData;
  
    const divisionCounts = filteredAccidents.reduce((acc, accident) => {
      const division = accident.division || "Unknown";
      acc[division] = (acc[division] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
      return Object.entries(divisionCounts).map(([division, count]) => ({
      name: division,
      pv: count,
    }));
  };

  const processHazardChartDataIncident = () => {
    if (!incidentData) return [];
      let filteredIncidents = watchPeriod ? filterByPeriod(incidentData, watchPeriod) : incidentData;
  
    const divisionCounts = filteredIncidents.reduce((acc, incident) => {
      const division = incident.division || "Unknown";
      acc[division] = (acc[division] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
      return Object.entries(divisionCounts).map(([division, count]) => ({
      name: division,
      pv: count,
    }));
  };

  const countAccidentIndividualsByGender = () => {
    if (!accidentData) return { male: 0, female: 0 };
  
    // Apply filters
    let filteredAccidents = applyFilters().accidents;
  
    // Extract affected individuals
    let maleCount = 0;
    let femaleCount = 0;
  
    filteredAccidents.forEach((accident) => {
      accident.effectedIndividuals?.forEach((individual) => {
        if (individual.gender?.toLowerCase() === "male") {
          maleCount++;
        } else if (individual.gender?.toLowerCase() === "female") {
          femaleCount++;
        }
      });
    });
  
    return { male: maleCount, female: femaleCount };
  };

  const countIncidentIndividualsByGender = () => {
    if (!incidentData) return { maleI: 0, femaleI: 0 };
  
    // Apply filters
    let filteredIncidents = applyFilters().incidents;
  
    // Extract affected individuals
    let maleCount = 0;
    let femaleCount = 0;
  
    filteredIncidents.forEach((incident) => {
      incident.effectedIndividuals?.forEach((individual) => {
        if (individual.gender?.toLowerCase() === "male") {
          maleCount++;
        } else if (individual.gender?.toLowerCase() === "female") {
          femaleCount++;
        }
      });
    });
  
    return { maleI: maleCount, femaleI: femaleCount };
  };
  

  const { male, female } = countAccidentIndividualsByGender();  
  const { maleI, femaleI } = countIncidentIndividualsByGender(); 
  const { accidents, incidents } = applyFilters();
  const accidentLineChart = processHazardChartData();
  const incidentLineChart = processHazardChartDataIncident();
  const totalAccidents = accidents.length;
  const totalIncidents = incidents.length;
  const { openAccidentsCount, openIncidentsCount, closeIncidentsCount, closedAccidentsCount } = filterByStatus();
  const totalAccidentsOpen = openAccidentsCount;
  const totalIncidentsOpen = openIncidentsCount;
  const totalAccidentClosed = closedAccidentsCount;
  const totalIncidentClosed = closeIncidentsCount;
  const accidentsByGender = [
    { name: "Male", value: male },
    { name: "Female", value: female },
  ];
  const IncidentsByGender = [
    { name: "Male", value: maleI },
    { name: "Female", value: femaleI },
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
                options={divisionData?.length ? divisionData.map((division) => division.divisionName) : []}
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
            minWidth: "250px",
            margin: "0.5rem",
          }}
        >
          <DashboardCard
            title="Total Accidents"
            titleIcon={<FunctionsIcon fontSize="small" />}
            value={totalAccidents}
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
            title="Pending Reports"
            titleIcon={<CheckCircleOutlineIcon fontSize="small" />}
            value={totalAccidentsOpen}
            subDescription={openAccidentsCount > 0 ? `${((openAccidentsCount / totalAccidents) * 100).toFixed(2)}%` : "No Pendings Records yet"}
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
            title="Completed Reports"
            titleIcon={<PendingIcon fontSize="small" />}
            value={totalAccidentClosed}
            subDescription={`${((closedAccidentsCount / totalAccidents) * 100).toFixed(2)}%`}
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
            title="Amount For Accidents"
            titleIcon={<CreditCardIcon fontSize="small" />}
            value={5}
            subDescription="5% From previous period"
          />
        </Box>
      </Box>

      <Divider
        sx={{
          marginTop:"1rem"
        }}
      />

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
            title="Total Incidents"
            titleIcon={<FunctionsIcon fontSize="small" />}
            value={totalIncidents}
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
            title="Pending Reports"
            titleIcon={<CheckCircleOutlineIcon fontSize="small" />}
            value={totalIncidentsOpen}
            subDescription={`${((openIncidentsCount / totalIncidents) * 100).toFixed(2)}%`}
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
            title="Completed Reports"
            titleIcon={<PendingIcon fontSize="small" />}
            value={totalIncidentClosed}
            subDescription={`${((openIncidentsCount / totalIncidents) * 100).toFixed(2)}%`}
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
            title="Amount For Incidents"
            titleIcon={<CreditCardIcon fontSize="small" />}
            value={5}
            subDescription="5% From previous period"
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: isTablet ? "column" : "row" }}>
        <Box
          sx={{
            width: "100%",
            height: 500,
            marginTop: "1rem",
            flex: 2,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            padding: "1rem",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={accidentLineChart}
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
                stroke="#8884d8"
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
            margin: "1rem",
            padding: "1rem",
          }}
        >
          <Typography variant="subtitle1">Status</Typography>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={accidentsByGender}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 60 : isTablet ? 80 : 100}
                innerRadius={isMobile ? 40 : isTablet ? 60 : 80}
                fill="#8884d8"
              >
                {accidentsByGender.map((entry, index) => (
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
              This Month
            </Typography>
            <Typography variant="subtitle1">10 Cases</Typography>
            <Typography
              variant="subtitle2"
              sx={{ color: "var(--pallet-grey)" }}
            >
              0 From Previous Period
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: isTablet ? "column" : "row" }}>
        <Box
          sx={{
            width: "100%",
            height: 500,
            marginTop: "1rem",
            flex: 2,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            padding: "1rem",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={incidentLineChart}
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
                stroke="#8884d8"
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
            margin: "1rem",
            padding: "1rem",
          }}
        >
          <Typography variant="subtitle1">Status</Typography>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={IncidentsByGender}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 60 : isTablet ? 80 : 100}
                innerRadius={isMobile ? 40 : isTablet ? 60 : 80}
                fill="#8884d8"
              >
                {IncidentsByGender.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["var(--pallet-blue)", "var(--pallet-pink)"][
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
              This Month
            </Typography>
            <Typography variant="subtitle1">10 Cases</Typography>
            <Typography
              variant="subtitle2"
              sx={{ color: "var(--pallet-grey)" }}
            >
              0 From Previous Period
            </Typography>
          </Box>
        </Box>
      </Box>

      
    </Stack>
  );
}

export default HazardAndRiskDashboard;
