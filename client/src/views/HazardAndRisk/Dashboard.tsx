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
            minWidth: "250px",
            margin: "0.5rem",
          }}
        >
          <DashboardCard
            title="Total"
            titleIcon={<FunctionsIcon fontSize="small" />}
            value={10}
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
            value={5}
            subDescription="5% From previous period"
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
            value={8}
            subDescription="8% From previous period"
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
                data={hazardRiskChartData2}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 60 : isTablet ? 80 : 100}
                innerRadius={isMobile ? 40 : isTablet ? 60 : 80}
                fill="#8884d8"
              >
                {hazardRiskChartData2.map((entry, index) => (
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
    </Stack>
  );
}

export default HazardAndRiskDashboard;
