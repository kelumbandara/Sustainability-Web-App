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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import {
  getAccidentsList,
  getIncidentsList,
} from "../../api/accidentAndIncidentApi";
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
  parseISO,
  differenceInDays,
} from "date-fns";
import { fetchDivision } from "../../api/divisionApi";
import CircularProgressWithLabelAI from "../../components/ProgressBarAIDash";

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

  const { data: divisionData, isFetching: isDivisionDataFetching } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  const filterByPeriod = (data: any[], period: string) => {
    const now = new Date();
    switch (period) {
      case HazardDashboardPeriods.THIS_WEEK:
        return data.filter((item) => {
          const itemDate = new Date(item.accidentDate || item.incidentDate);
          return isWithinInterval(itemDate, {
            start: startOfWeek(now),
            end: endOfWeek(now),
          });
        });
      case HazardDashboardPeriods.LAST_WEEK:
        return data.filter((item) => {
          const itemDate = new Date(item.accidentDate || item.incidentDate);
          return isWithinInterval(itemDate, {
            start: startOfWeek(subWeeks(now, 1)),
            end: endOfWeek(subWeeks(now, 1)),
          });
        });
      case HazardDashboardPeriods.THIS_MONTH:
        return data.filter((item) => {
          const itemDate = new Date(item.accidentDate || item.incidentDate);
          return isWithinInterval(itemDate, {
            start: startOfMonth(now),
            end: endOfMonth(now),
          });
        });
      case HazardDashboardPeriods.LAST_MONTH:
        return data.filter((item) => {
          const itemDate = new Date(item.accidentDate || item.incidentDate);
          return isWithinInterval(itemDate, {
            start: startOfMonth(subMonths(now, 1)),
            end: endOfMonth(subMonths(now, 1)),
          });
        });
      case HazardDashboardPeriods.THIS_YEAR:
        return data.filter((item) => {
          const itemDate = new Date(item.accidentDate || item.incidentDate);
          return isWithinInterval(itemDate, {
            start: startOfYear(now),
            end: endOfYear(now),
          });
        });
      case HazardDashboardPeriods.LAST_YEAR:
        return data.filter((item) => {
          const itemDate = new Date(item.accidentDate || item.incidentDate);
          return isWithinInterval(itemDate, {
            start: startOfYear(subYears(now, 1)),
            end: endOfYear(subYears(now, 1)),
          });
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
      filteredAccidents = filteredAccidents.filter(
        (accident) => accident.division === watchDivision
      );
      filteredIncidents = filteredIncidents.filter(
        (incident) => incident.division === watchDivision
      );
    }

    // Filter by category
    if (watchCategory) {
      filteredAccidents = filteredAccidents.filter(
        (accident) => accident.category === watchCategory
      );
      filteredIncidents = filteredIncidents.filter(
        (incident) => incident.category === watchCategory
      );
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
      (incident) => incident.status?.toLowerCase() === "open"
    ).length;
    const closeIncidentsCount = incidents.filter(
      (incident) => incident.status?.toLowerCase() === "close"
    ).length;

    return {
      openAccidentsCount,
      openIncidentsCount,
      closeIncidentsCount,
      closedAccidentsCount,
    };
  };

  const processHazardChartData = () => {
    if (!accidentData) return [];
    const filteredAccidents = watchPeriod
      ? filterByPeriod(accidentData, watchPeriod)
      : accidentData;

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
    const filteredIncidents = watchPeriod
      ? filterByPeriod(incidentData, watchPeriod)
      : incidentData;

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

    const filteredAccidents = applyFilters().accidents;

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

    const filteredIncidents = applyFilters().incidents;

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

  const countAccidentIndividualsByAge = () => {
    if (!accidentData) {
      return {
        smallestAge: 0,
        smallAge: 0,
        middledAge: 0,
        middleAge: 0,
        bigAge: 0,
        largeAge: 0,
        sixPlus: 0,
      };
    }

    const filteredAccidents = applyFilters().accidents;

    const ageGroups = {
      smallestAge: 0, // 16-19
      smallAge: 0, // 20-24
      middledAge: 0, // 25-34
      middleAge: 0, // 35-44
      bigAge: 0, // 45-54
      largeAge: 0, // 55-60
      sixPlus: 0, // 60+
    };

    filteredAccidents.forEach((accident) => {
      accident.effectedIndividuals?.forEach((individual) => {
        const age = individual.age;

        if (age >= 16 && age <= 19) {
          ageGroups.smallestAge++;
        } else if (age >= 20 && age <= 24) {
          ageGroups.smallAge++;
        } else if (age >= 25 && age <= 34) {
          ageGroups.middledAge++;
        } else if (age >= 35 && age <= 44) {
          ageGroups.middleAge++;
        } else if (age >= 45 && age <= 54) {
          ageGroups.bigAge++;
        } else if (age >= 55 && age <= 60) {
          ageGroups.largeAge++;
        } else if (age > 60) {
          ageGroups.sixPlus++;
        }
      });
    });

    return ageGroups;
  };

  const countIncidentIndividualsByAge = () => {
    if (!incidentData) {
      return {
        smallestAge: 0,
        smallAge: 0,
        middledAge: 0,
        middleAge: 0,
        bigAge: 0,
        largeAge: 0,
        sixPlus: 0,
      };
    }

    const filteredIncidents = applyFilters().incidents;

    const ageGroups = {
      smallestAge: 0, // 16-19
      smallAge: 0, // 20-24
      middledAge: 0, // 25-34
      middleAge: 0, // 35-44
      bigAge: 0, // 45-54
      largeAge: 0, // 55-60
      sixPlus: 0, // 60+
    };

    filteredIncidents.forEach((incident) => {
      incident.effectedIndividuals?.forEach((individual) => {
        const age = individual.age;

        if (age >= 16 && age <= 19) {
          ageGroups.smallestAge++;
        } else if (age >= 20 && age <= 24) {
          ageGroups.smallAge++;
        } else if (age >= 25 && age <= 34) {
          ageGroups.middledAge++;
        } else if (age >= 35 && age <= 44) {
          ageGroups.middleAge++;
        } else if (age >= 45 && age <= 54) {
          ageGroups.bigAge++;
        } else if (age >= 55 && age <= 60) {
          ageGroups.largeAge++;
        } else if (age > 60) {
          ageGroups.sixPlus++;
        }
      });
    });

    return ageGroups;
  };

  const ageDataIncident = countIncidentIndividualsByAge();
  const hazardRiskChartData4 = [
    { name: "16-19", value: ageDataIncident.smallestAge },
    { name: "20-24", value: ageDataIncident.smallAge },
    { name: "25-34", value: ageDataIncident.middledAge },
    { name: "35-44", value: ageDataIncident.middleAge },
    { name: "45-54", value: ageDataIncident.bigAge },
    { name: "55-60", value: ageDataIncident.largeAge },
    { name: "60+", value: ageDataIncident.sixPlus },
  ];

  const ageData = countAccidentIndividualsByAge();
  const hazardRiskChartData3 = [
    { name: "16-19", value: ageData.smallestAge },
    { name: "20-24", value: ageData.smallAge },
    { name: "25-34", value: ageData.middledAge },
    { name: "35-44", value: ageData.middleAge },
    { name: "45-54", value: ageData.bigAge },
    { name: "55-60", value: ageData.largeAge },
    { name: "60+", value: ageData.sixPlus },
  ];

  const today = new Date();
  const latestAccidentDate = (
    Array.isArray(accidentData) ? accidentData : []
  ).reduce((latest, accident) => {
    const accidentDate = parseISO(accident.accidentDate);
    return accidentDate > latest ? accidentDate : latest;
  }, new Date(0));

  const daysSinceLastAccident = Math.abs(
    differenceInDays(latestAccidentDate, today)
  );

  const latestIncidentDate = (
    Array.isArray(incidentData) ? incidentData : []
  ).reduce((latest, incident) => {
    const incidentDate = parseISO(incident.incidentDate);
    return incidentDate > latest ? incidentDate : latest;
  }, new Date(0));

  const daysSinceLastIncident = Math.abs(
    differenceInDays(latestIncidentDate, today)
  );
  const { male, female } = countAccidentIndividualsByGender();
  const { maleI, femaleI } = countIncidentIndividualsByGender();
  const { accidents, incidents } = applyFilters();
  const accidentLineChart = processHazardChartData();
  const incidentLineChart = processHazardChartDataIncident();
  const totalAccidents = accidents.length;
  const totalIncidents = incidents.length;
  const {
    openAccidentsCount,
    openIncidentsCount,
    closeIncidentsCount,
    closedAccidentsCount,
  } = filterByStatus();
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
                options={
                  divisionData?.length
                    ? divisionData.map((division) => division.divisionName)
                    : []
                }
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
          marginTop: "2rem",
        }}
      >
        <Typography>Accident Details</Typography>
      </Box>

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
            subDescription={
              openAccidentsCount > 0
                ? `${((openAccidentsCount / totalAccidents) * 100).toFixed(2)}%`
                : "No Pendings Records yet"
            }
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
            subDescription={`${(
              (closedAccidentsCount / totalAccidents) *
              100
            ).toFixed(2)}%`}
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
          marginTop: "1rem",
        }}
      />

      <Box
        sx={{
          marginTop: "2rem",
        }}
      >
        <Typography>Incidents Details</Typography>
      </Box>

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
            subDescription={`${(
              (openIncidentsCount / totalIncidents) *
              100
            ).toFixed(2)}%`}
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
            subDescription={`${(
              (openIncidentsCount / totalIncidents) *
              100
            ).toFixed(2)}%`}
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
              Total Accidents Count For Divisions
            </Typography>
          </Box>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={accidentLineChart}
              margin={{
                top: 50,
                right: 30,
                left: 40,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-65}
                textAnchor="end"
                fontSize={"small"}
              />
              <YAxis
                label={{
                  value: "Accident Count",
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
            padding: "1rem",
            height: "auto",
            marginTop: "1rem",
            borderRadius: "0.3rem",
            border: "1px solid var(--pallet-border-blue)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
            }}
          >
            Accident Male And Female
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={accidentsByGender}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 120 : isTablet ? 120 : 120}
                innerRadius={isMobile ? 100 : isTablet ? 100 : 100}
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
              {accidentsByGender.every((entry) => entry.value === 0)
                ? "No Available Data for This Filter"
                : watchPeriod
                ? watchPeriod
                : "All Time Accidents By Gender"}
            </Typography>

            <Typography variant="subtitle1">
              Total Accidents {totalAccidents}
            </Typography>
            <Stack direction="row" gap={10}>
              <Typography
                variant="subtitle2"
                sx={{ color: "var(--pallet-grey)" }}
              >
                Male{" "}
                {accidentsByGender.find((entry) => entry.name === "Male")
                  ?.value ?? "0"}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ color: "var(--pallet-grey)" }}
              >
                Female{" "}
                {accidentsByGender.find((entry) => entry.name === "Female")
                  ?.value ?? "0"}
              </Typography>
            </Stack>
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
              incident Count For Divisions
            </Typography>
          </Box>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={incidentLineChart}
              margin={{
                top: 50,
                right: 30,
                left: 40,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-65}
                textAnchor="end"
                fontSize={"small"}
              />
              <YAxis
                label={{
                  value: "Incident Counts",
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
            border: "1px solid var(--pallet-border-blue)",
            padding: "1rem",
            height: "auto",
            borderRadius: "0.3rem",
            marginTop: "1rem",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
            }}
          >
            Incident Male And Female
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={IncidentsByGender}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 120 : isTablet ? 120 : 120}
                innerRadius={isMobile ? 100 : isTablet ? 100 : 100}
                fill="#8884d8"
              >
                {IncidentsByGender.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["var(--pallet-blue)", "var(--pallet-pink)"][index % 2]
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
              {IncidentsByGender.every((entry) => entry.value === 0)
                ? "No Available Data for This Filter"
                : watchPeriod
                ? watchPeriod
                : "All Time Accidents By Gender"}
            </Typography>

            <Typography variant="subtitle1">
              Total Incidents {totalIncidents}
            </Typography>
            <Stack direction="row" gap={10}>
              <Typography
                variant="subtitle2"
                sx={{ color: "var(--pallet-grey)" }}
              >
                Male{" "}
                {IncidentsByGender.find((entry) => entry.name === "Male")
                  ?.value ?? "0"}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ color: "var(--pallet-grey)" }}
              >
                Female{" "}
                {IncidentsByGender.find((entry) => entry.name === "Female")
                  ?.value ?? "0"}
              </Typography>
            </Stack>
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
            <BarChart data={hazardRiskChartData3}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" textAnchor="center" fontSize={"small"} />
              <YAxis
                label={{
                  value: "Number of Individuals",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: "small",
                }}
              />
              <Tooltip />
              <Bar dataKey="value" fill="var(--pallet-blue)" barSize={40} />
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
          <Stack spacing={10} sx={{ justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                Days Since Last Accident
              </Typography>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgressWithLabelAI
                daysSince={daysSinceLastAccident}
                size={250}
                nameValue="Accident"
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography sx={{ color: "var(--pallet-grey)" }}>
                Last Accident Date{" "}
                {latestAccidentDate
                  ? latestAccidentDate.toISOString().split("T")[0]
                  : "N/A"}
              </Typography>
            </Box>
          </Stack>
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
            <BarChart data={hazardRiskChartData4}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{
                  value: "Number of Individuals",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: "small",
                }}
              />
              <Tooltip />
              <Bar dataKey="value" fill="var(--pallet-blue)" barSize={40} />
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
            marginTop: "1rem",
          }}
        >
          <Stack spacing={10} sx={{ justifyContent: "space-between" }}>
            <Box>
              <Box>
                <Typography variant="h6" sx={{ textAlign: "center" }}>
                  Days Since Last Incident
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgressWithLabelAI
                daysSince={daysSinceLastIncident}
                size={250}
                nameValue="Incident"
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography sx={{ color: "var(--pallet-grey)" }}>
                Last Incident Date{" "}
                {latestIncidentDate
                  ? latestIncidentDate.toISOString().split("T")[0]
                  : "N/A"}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
}

export default HazardAndRiskDashboard;
