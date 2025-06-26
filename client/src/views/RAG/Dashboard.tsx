import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import { useForm } from "react-hook-form";
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

import { useQuery } from "@tanstack/react-query";
import { dateFormatter } from "../../util/dateFormat.util";
import CustomPieChart from "../../components/CustomPieChart";

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

function RagDashboard() {
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

  const dateRangeFrom = watch("dateRangeFrom");
  const formattedDateFrom = dateFormatter(dateRangeFrom);

  const dateRangeTo = watch("dateRangeTo");
  const formattedDateTo = dateFormatter(dateRangeTo);

  const COLORS = [
    "#82ca9d",
    "#8884d8",
    "#ffc658",
    "#ff4d4f",
    "#00bcd4",
    "#a83279",
  ];

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

  const ragAgeAllGroupChartDataMemo = useMemo(() => {
    if (
      !ragAllData ||
      typeof ragAllData !== "object" ||
      !ragAllData.ageGroupSummary ||
      !ragAllData.ageGroupSummary.groups
    ) {
      return [];
    }

    const summary = ragAllData.ageGroupSummary.groups as Record<
      string,
      { count: number; percentage: number }
    >;

    return Object.entries(summary)
      .filter(([, data]) => data.count > 0)
      .map(([range, data]) => ({
        name: range,
        value: data.count,
      }));
  }, [ragAllData]);

  const ragStateAllBarChartData = useMemo(() => {
    if (
      !ragAllData ||
      typeof ragAllData !== "object" ||
      !("stateSummary" in ragAllData)
    ) {
      return [];
    }

    const rawData = ragAllData.stateSummary as Record<
      string,
      { count: number; percentage: number }
    >;

    return Object.entries(rawData).map(([state, data]) => ({
      state,
      count: data.count,
      percentage: data.percentage,
    }));
  }, [ragAllData]);

  const ragStatusAllCountDataMemo = useMemo(() => {
    if (
      !ragAllData ||
      typeof ragAllData !== "object" ||
      !("statusSummary" in ragAllData)
    ) {
      return [];
    }

    const rawData = ragAllData.statusSummary as Record<
      string,
      { count: number; percentage: number }
    >;

    return Object.entries(rawData).map(([status, data]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: data.count,
    }));
  }, [ragAllData]);

  const ragCategoryAllCountDataMemo = useMemo(() => {
    if (
      !ragAllData ||
      typeof ragAllData !== "object" ||
      !("categorySummary" in ragAllData)
    ) {
      return [];
    }

    const rawData = ragAllData.categorySummary as Record<
      string,
      { count: number; percentage: number }
    >;

    return Object.entries(rawData).map(([category, data]) => ({
      category,
      count: data.count,
      percentage: data.percentage,
    }));
  }, [ragAllData]);

  const ragAllCountDataMemo = useMemo(() => {
    if (
      !ragAllData ||
      typeof ragAllData !== "object" ||
      typeof ragAllData.ragSummary !== "object"
    ) {
      return {};
    }

    return ragAllData.ragSummary;
  }, [ragAllData]);

  const ragAllCountBarDataMemo = useMemo(() => {
    if (!ragAllData?.ragSummary || typeof ragAllData.ragSummary !== "object")
      return [];

    const { red, amber, green } = ragAllData.ragSummary;

    return [
      {
        name: "RAG Count",
        red: red?.count || 0,
        amber: amber?.count || 0,
        green: green?.count || 0,
      },
    ];
  }, [ragAllData]);

  const ragGenderAllCountDataMemo = useMemo(() => {
    if (
      !ragAllData?.genderSummary ||
      typeof ragAllData.genderSummary !== "object"
    ) {
      return [];
    }

    const allowedCategories = ["Male", "Female", "Other"];

    return Object.entries(ragAllData.genderSummary)
      .filter(([key]) => allowedCategories.includes(key))
      .map(([category, data]) => ({
        name: category,
        value: (data as { count: number }).count,
      }));
  }, [ragAllData]);

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
            value={
              ragCountDataMemo?.totalRag
                ? ragCountDataMemo?.totalRag
                : ragAllCountDataMemo?.totalRag
            }
            subDescription={
              ragCountDataMemo?.ragPercentage
                ? ragCountDataMemo?.ragPercentage
                : ragAllCountDataMemo?.ragPercentage + "%"
            }
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
            value={
              ragCountDataMemo.red?.count
                ? ragCountDataMemo.red?.count
                : ragAllCountDataMemo.red?.count
            }
            subDescription={
              ragCountDataMemo.red?.percentage
                ? ragCountDataMemo.red?.percentage
                : ragAllCountDataMemo.red?.percentage + "%"
            }
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
            value={
              ragCountDataMemo.amber?.count
                ? ragCountDataMemo.amber?.count
                : ragAllCountDataMemo.amber?.count
            }
            subDescription={
              ragCountDataMemo.amber?.percentage
                ? ragCountDataMemo.amber?.percentage
                : ragAllCountDataMemo.amber?.percentage + "%"
            }
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
            value={
              ragCountDataMemo.green?.count
                ? ragCountDataMemo.green?.count
                : ragAllCountDataMemo.green?.count
            }
            subDescription={
              ragCountDataMemo.green?.percentage
                ? ragCountDataMemo.green?.percentage
                : ragAllCountDataMemo.green?.percentage + "%"
            }
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
              data={
                dateRangeFrom && dateRangeTo
                  ? ragCountBarDataMemo
                  : ragAllCountBarDataMemo
              }
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
                data={
                  dateRangeFrom && dateRangeTo
                    ? ragGenderCountDataMemo
                    : ragGenderAllCountDataMemo
                }
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
              data={
                dateRangeFrom && dateRangeTo
                  ? ragCategoryCountDataMemo
                  : ragCategoryAllCountDataMemo
              }
              width={800}
              height={400}
              barCategoryGap={40}
              barGap={100}
            >
              <XAxis dataKey="category" />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" barSize={35}>
                {(dateRangeFrom && dateRangeTo
                  ? ragCategoryCountDataMemo
                  : ragCategoryAllCountDataMemo
                ).map((entry, index) => (
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
                data={
                  dateRangeFrom && dateRangeTo
                    ? ragStatusCountDataMemo
                    : ragStatusAllCountDataMemo
                }
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
            <BarChart
              width={600}
              height={400}
              data={
                dateRangeFrom && dateRangeTo
                  ? ragStateBarChartData
                  : ragStateAllBarChartData
              }
            >
              <XAxis dataKey="state" angle={290} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" barSize={10}>
                {(dateRangeFrom && dateRangeTo
                  ? ragStateBarChartData
                  : ragStateAllBarChartData
                ).map((entry, index) => (
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
                data={
                  dateRangeFrom && dateRangeTo
                    ? ragAgeGroupChartDataMemo
                    : ragAgeAllGroupChartDataMemo
                }
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
