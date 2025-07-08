import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Stack,
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
import { useMemo } from "react";

import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";

import { yearData } from "../../api/sampleData/consumptionData";
import { useQuery } from "@tanstack/react-query";
import { fetchDivision } from "../../api/divisionApi";
import { dateFormatter } from "../../util/dateFormat.util";
import CustomPieChart from "../../components/CustomPieChart";

import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

import {
  categoryData,
  getAllGrievanceSummery,
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
} from "../../api/Grievance/grievanceDashboardApi";

const breadcrumbItems = [
  { title: "Home", href: "/home" },
  { title: "Grievance Management" },
];

function GrievanceDashboard() {
  const { isMobile, isTablet } = useIsMobile();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const year = watch("year");

  const division = watch("division");
  const category = watch("category");

  const dateRangeFrom = watch("dateRangeFrom");
  const formattedDateFrom = dateFormatter(dateRangeFrom);

  const dateRangeTo = watch("dateRangeTo");
  const formattedDateTo = dateFormatter(dateRangeTo);

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

  const { data: grievanceAllSummery, isFetching: isGrievanceAllSummery } =
    useQuery({
      queryKey: ["grievance-all-summary", new Date().getFullYear()],
      queryFn: () => getAllGrievanceSummery(new Date().getFullYear()),
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

  const topicChartAllData = useMemo(() => {
    if (!grievanceAllSummery?.topicSummary) return [];

    return Object.entries(grievanceAllSummery.topicSummary).map(
      ([topic, value]) => {
        const { count, percentage } = value as {
          count: number;
          percentage: number;
        };
        return {
          name: topic,
          count,
          percentage,
        };
      }
    );
  }, [grievanceAllSummery]);

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

  const pieAnonymousChartAllData = useMemo(() => {
    const summary = grievanceAllSummery?.anonymousSummary;

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
  }, [grievanceAllSummery]);

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

  const starAllChartData = useMemo(() => {
    const stars = grievanceAllSummery?.starsSummary;
    if (!stars) return [];

    return Object.entries(stars).map(([label, value]) => {
      const { count, percentage } = value as {
        count: number;
        percentage: number;
      };
      return {
        name: label,
        count,
        percentage,
      };
    });
  }, [grievanceAllSummery]);

  const departmentChartData = useMemo(() => {
    return (
      grievanceDepartmentSummary?.responsibleDepartment?.map((dept) => ({
        name: dept.responsibleDepartment,
        count: dept.count,
        percentage: dept.percentage,
      })) || []
    );
  }, [grievanceDepartmentSummary]);

  const departmentAllChartData = useMemo(() => {
    if (!grievanceAllSummery?.departmentSummary) return [];

    return Object.entries(grievanceAllSummery.departmentSummary).map(
      ([name, value]) => {
        const { count, percentage } = value as {
          count: number;
          percentage: number;
        };
        return { name, count, percentage };
      }
    );
  }, [grievanceAllSummery]);

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

  const pieChartAllDataChannel = useMemo(() => {
    if (!grievanceAllSummery?.channelSummary) return [];

    return Object.entries(grievanceAllSummery.channelSummary).map(
      ([channel, value]) => {
        const { count } = value as { count: number };
        return {
          name: channel,
          value: count,
        };
      }
    );
  }, [grievanceAllSummery]);

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

  const pieChartAllDataCategory = useMemo(() => {
    if (!grievanceAllSummery?.categorySummary) return [];

    return Object.entries(grievanceAllSummery.categorySummary).map(
      ([category, value]) => {
        const { count } = value as { count: number };
        return {
          name: category,
          value: count,
        };
      }
    );
  }, [grievanceAllSummery]);

  const statusSummeryMemo = useMemo(() => {
    return grievanceStatusSummary || {};
  }, [grievanceStatusSummary]);

  const statusAllSummeryMemo = useMemo(() => {
    return grievanceAllSummery || {};
  }, [grievanceAllSummery]);

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

  const chartAllData = useMemo(() => {
    const types = [
      "grievance",
      "complaint",
      "appreciation",
      "suggestion",
      "question",
    ];

    const monthlyData = grievanceAllSummery?.monthlyTypeCount || [];

    return monthlyData.map((entry) => {
      const row = { name: entry.month };

      types.forEach((type) => {
        row[type] = entry.types?.[type] || 0;
      });

      return row;
    });
  }, [grievanceAllSummery]);

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

  const pieChartAllData = useMemo(() => {
    if (!grievanceAllSummery || !grievanceAllSummery.typeSummary) return [];

    return Object.entries(grievanceAllSummery.typeSummary).map(
      ([key, value]: [string, { count: number }]) => ({
        name: key,
        value: value.count,
      })
    );
  }, [grievanceAllSummery]);

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
            value={
              statusSummeryMemo?.filteredRecords
                ? statusSummeryMemo?.filteredRecords
                : statusAllSummeryMemo?.statusSummary?.filteredRecords
            }
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
            value={
              statusSummeryMemo?.statusSummary?.draft?.count ||
              statusAllSummeryMemo?.statusSummary?.statusCounts?.draft?.count
            }
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
            value={
              statusSummeryMemo?.statusSummary?.inprogress?.count ||
              statusAllSummeryMemo?.statusSummary?.statusCounts?.inprogress
                ?.count
            }
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
            value={
              statusSummeryMemo?.statusSummary?.completed?.count ||
              statusAllSummeryMemo?.statusSummary?.statusCounts?.completed
                ?.count
            }
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
            value={
              statusSummeryMemo?.feedbackSummary?.count ||
              statusAllSummeryMemo?.statusSummary?.feedbackSummary?.count
            }
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
            <BarChart data={chartData.length > 0 ? chartData : chartAllData}>
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
                data={pieChartData.length > 0 ? pieChartData : pieChartAllData}
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
              Department BreakDown
            </Typography>
          </Box>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={
                departmentChartData.length > 0
                  ? departmentChartData
                  : departmentAllChartData
              }
            >
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
                data={
                  pieChartDataCategory.length > 0
                    ? pieChartDataCategory
                    : pieChartAllDataCategory
                }
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
              Star Rating Deviation
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
              data={starChartData.length > 0 ? starChartData : starAllChartData}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" barSize={20}>
                {(starChartData.length > 0
                  ? starChartData
                  : starAllChartData
                ).map((entry, index) => {
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
                data={
                  pieChartDataChannel.length > 0
                    ? pieChartDataChannel
                    : pieChartAllDataChannel
                }
                title="Channel Summary"
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
              Topic Insights
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
              data={
                topicChartData.length > 0 ? topicChartData : topicChartAllData
              }
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" barSize={15} />
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
                data={
                  pieAnonymousChartData.length > 0
                    ? pieAnonymousChartData
                    : pieAnonymousChartAllData
                }
                title="Anonymous Vs Non-Anonymous"
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
