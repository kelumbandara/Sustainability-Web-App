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

import NaturePeopleIcon from "@mui/icons-material/NaturePeople";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ShowerOutlinedIcon from "@mui/icons-material/ShowerOutlined";
import BatteryChargingFullOutlinedIcon from "@mui/icons-material/BatteryChargingFullOutlined";
import { useState } from "react";
import CircularProgressWithLabel from "../../components/CircularProgress";

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

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

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
  const [activeTab, setActiveTab] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log("event", event);
    setActiveTab(newValue);
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
        <PageTitle title="Envionment Management Dashboard" />
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
            title="Total GHC Emission"
            titleIcon={<NaturePeopleIcon fontSize="large" />}
            value={1493}
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
            value={442750}
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
            value={11247}
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
            value={48791}
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
            value={492558}
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
          <ResponsiveContainer width="100%" height={500}>
            <>
              <Typography variant="subtitle1">Waste</Typography>
              <AppBar
                position="static"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: "1rem",
                  backgroundColor: "var(--pallet-lighter-grey)",
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
                        {/* <TextSnippetIcon fontSize="small" /> */}
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
                        {/* <FireExtinguisherIcon fontSize="small" /> */}
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
                        {/* <FireExtinguisherIcon fontSize="small" /> */}
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
                <Stack>
                  <Box
                    sx={{
                      display: "flex",
                      direction: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                    width={350}>
                      <Typography>Fabric Cut Piece</Typography>
                      <Typography>In KG</Typography>
                    </Box>
                    <Box>
                      <CircularProgressWithLabel size={60} value={10} />
                    </Box>
                    <Box>
                      <Typography>Quantity</Typography>
                      <Typography>63892 KG</Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <Box>hello</Box>
                </Stack>
              </TabPanel>
              <TabPanel value={activeTab} index={1} dir={theme.direction}>
                hi2
              </TabPanel>
              <TabPanel value={activeTab} index={2} dir={theme.direction}>
                hi3
              </TabPanel>
            </>
          </ResponsiveContainer>
        </Box>
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
          <Typography variant="subtitle1">Status</Typography>
          <ResponsiveContainer width="100%" height={500}>
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
