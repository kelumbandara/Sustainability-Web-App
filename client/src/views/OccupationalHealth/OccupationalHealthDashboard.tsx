import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { getPatientList } from "../../api/OccupationalHealth/patientApi";
import { getMaternityRegistersList } from "../../api/OccupationalHealth/maternityRegisterApi";
import { getMedicineList } from "../../api/medicineRequestApi";
import { getMedicineInventoriesList } from "../../api/OccupationalHealth/medicineInventoryApi";
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useForm } from "react-hook-form";
import {
  HazardDashboardPeriods,
  HazardOrRiskCategories,
} from "../../api/hazardRiskApi";
import CustomButton from "../../components/CustomButton";
import DashboardCard from "../../components/DashboardCard";
import DateRangePicker from "../../components/DateRangePicker";
import { fetchDivision } from "../../api/divisionApi";
import FunctionsIcon from "@mui/icons-material/Functions";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingIcon from "@mui/icons-material/Pending";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import TireRepairIcon from "@mui/icons-material/TireRepair";
import GasMeterIcon from "@mui/icons-material/GasMeter";
import ScaleIcon from "@mui/icons-material/Scale";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import useIsMobile from "../../customHooks/useIsMobile";
import { sampleMedicineSuppliers } from "../../api/sampleData/medicineInventorySampleData";
import DiscountIcon from "@mui/icons-material/Discount";
import PeopleIcon from "@mui/icons-material/People";

const breadcrumbItems = [
  { title: "Home", href: "/home" },
  { title: "Occupational Health Dashboard" },
];

function OccupationalHealthDashboard() {
  const { isMobile, isTablet } = useIsMobile();

  const { data: patientData, isFetching: isPatientDataFetching } = useQuery({
    queryKey: ["patients"],
    queryFn: getPatientList,
  });

  const { data: maternityRegisterList } = useQuery({
    queryKey: ["maternity-register"],
    queryFn: getMaternityRegistersList,
  });

  const { data: medicineData, isFetching: isMedicineDataFetching } = useQuery({
    queryKey: ["medicines"],
    queryFn: getMedicineList,
  });

  const { data: medicineInventory } = useQuery({
    queryKey: ["medicine-inventory"],
    queryFn: getMedicineInventoriesList,
  });

  const { data: divisionData, isFetching: isDivisionDataFetching } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

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

  //patient data
  const averagePatientBloodPressureMmHg = useMemo(() => {
    if (!patientData?.length) return "--";

    const totalBloodPressure = patientData.reduce((acc, patient) => {
      return acc + Number(patient.bloodPressure);
    }, 0);

    return (totalBloodPressure / patientData.length).toFixed(2);
  }, [patientData]);

  const averagePatientBloodSugarMgDl = useMemo(() => {
    if (!patientData?.length) return "--";

    const totalBloodSugar = patientData.reduce((acc, patient) => {
      return acc + Number(patient.randomBloodSugar);
    }, 0);

    return (totalBloodSugar / patientData.length).toFixed(2);
  }, [patientData]);

  const averagePatientBmi = useMemo(() => {
    if (!patientData?.length) return "--";

    const totalBmi = patientData.reduce((acc, patient) => {
      return acc + Number(patient.weight) / (Number(patient.height) / 100);
    }, 0);

    return (totalBmi / patientData.length).toFixed(2);
  }, [patientData]);

  const patientsByGender = useMemo(() => {
    if (!patientData?.length) return [];

    const genderCounts = patientData.reduce(
      (acc, patient) => {
        if (patient.gender === "Male") acc.male += 1;
        else if (patient.gender === "Female") acc.female += 1;
        else acc.other += 1;
        return acc;
      },
      { male: 0, female: 0, other: 0 }
    );

    return [
      { name: "Male", value: genderCounts.male },
      { name: "Female", value: genderCounts.female },
      { name: "Other", value: genderCounts.other },
    ];
  }, [patientData]);

  const patientsByWorkStatus = useMemo(() => {
    if (!patientData?.length) return [];

    const workStatusCounts = patientData.reduce(
      (acc, patient) => {
        if (patient.workStatus === "OnDuty") acc.active += 1;
        else acc.other += 1;
        return acc;
      },
      { active: 0, other: 0 }
    );

    return [
      { name: "On Duty", value: workStatusCounts.active },
      { name: "Off Duty", value: workStatusCounts.other },
    ];
  }, [patientData]);

  //inventory data
  const totalPurchaseAmountForInventory = useMemo(() => {
    if (!medicineInventory?.length) return "--";

    return medicineInventory.reduce((acc, inventory) => {
      return acc + Number(inventory.purchaseAmount);
    }, 0);
  }, [medicineInventory]);

  const inventoriesBySupplier = useMemo(() => {
    if (!medicineInventory?.length) return [];

    const supplierCounts = medicineInventory.reduce((acc, inventory) => {
      const supplierName = inventory.supplierName || "Other";
      if (!acc[supplierName]) {
        acc[supplierName] = 0;
      }
      acc[supplierName] += 1;
      return acc;
    }, {});

    return Object.keys(supplierCounts).map((supplierName) => ({
      name: supplierName,
      value: supplierCounts[supplierName],
    }));
  }, [medicineInventory]);

  const inventoriesByType = useMemo(() => {
    if (!medicineInventory?.length) return [];

    const medicineTypeCounts = medicineInventory.reduce((acc, inventory) => {
      const medicineName = inventory.medicineType || "Other";
      if (!acc[medicineName]) {
        acc[medicineName] = 0;
      }
      acc[medicineName] += 1;
      return acc;
    }, {});

    return Object.keys(medicineTypeCounts).map((supplierName) => ({
      name: supplierName,
      value: medicineTypeCounts[supplierName],
    }));
  }, [medicineInventory]);

  const inventoriesByForm = useMemo(() => {
    if (!medicineInventory?.length) return [];

    const medicineFormCounts = medicineInventory.reduce((acc, inventory) => {
      const medicineForm = inventory.form || "Other";
      if (!acc[medicineForm]) {
        acc[medicineForm] = 0;
      }
      acc[medicineForm] += 1;
      return acc;
    }, {});

    return Object.keys(medicineFormCounts).map((supplierName) => ({
      name: supplierName,
      value: medicineFormCounts[supplierName],
    }));
  }, [medicineInventory]);

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
        <Typography variant="h6">Patient Details</Typography>
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
            title="Total Patients"
            titleIcon={<FunctionsIcon fontSize="small" />}
            value={patientData?.length || "--"}
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
            title="Average Blood Pressure"
            titleIcon={<TireRepairIcon fontSize="small" />}
            value={
              averagePatientBloodPressureMmHg
                ? `${averagePatientBloodPressureMmHg} mmHg`
                : "--"
            }
            subDescription={
              "A normal average blood pressure is around 120/80 mmHg"
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
            title="Average Blood Sugar"
            titleIcon={<GasMeterIcon fontSize="small" />}
            value={
              averagePatientBloodSugarMgDl
                ? `${averagePatientBloodSugarMgDl} mg/dl`
                : "--"
            }
            subDescription={`A normal fasting blood sugar level is between 70 and 100 mg/dL`}
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
            title="Average BMI"
            titleIcon={<ScaleIcon fontSize="small" />}
            value={averagePatientBmi || "--"}
            subDescription="BMI of 18.5 to 24.9 is considered a healthy weight for most adults"
          />
        </Box>
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
            width: "100%",
            height: "auto",
            marginX: "0.5rem",
            flex: 2,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            padding: "1rem",
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
            Patients By Gender
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={patientsByGender}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 120 : isTablet ? 120 : 120}
                innerRadius={isMobile ? 100 : isTablet ? 100 : 100}
                fill="#8884d8"
                legendType="circle"
              >
                {patientsByGender.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      [
                        "var(--pallet-blue)",
                        "var(--pallet-orange)",
                        "var(--pallet-light-grey),",
                      ][index % 3]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "auto",
            marginX: "0.5rem",
            flex: 2,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            padding: "1rem",
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
            Patients Work Status
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={patientsByWorkStatus}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 120 : isTablet ? 120 : 120}
                innerRadius={isMobile ? 100 : isTablet ? 100 : 100}
                fill="#8884d8"
              >
                {patientsByWorkStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["var(--pallet-blue)", "var(--pallet-orange)"][index % 2]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Box
        sx={{
          marginTop: "2rem",
        }}
      >
        <Typography variant="h6">Purchase & Inventory Details</Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1rem",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
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
              title="Total Medicine Inventory Count"
              titleIcon={<FunctionsIcon fontSize="small" />}
              value={medicineInventory?.length || "--"}
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
              title="Total Purchase Amount on Inventory"
              titleIcon={<DiscountIcon fontSize="small" />}
              value={totalPurchaseAmountForInventory}
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
              title="Number of Suppliers"
              titleIcon={<PeopleIcon fontSize="small" />}
              value={sampleMedicineSuppliers.length}
            />
          </Box>
        </Box>

        <Box>
          <Box
            sx={{
              width: "100%",
              height: "auto",
              margin: "0.5rem",
              flex: 2,
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              padding: "1rem",
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
              Medicines By Supplier
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart width={150} height={40} data={inventoriesBySupplier}>
                <Bar dataKey="value" fill="#8884d8" />
                <XAxis dataKey="name" />
                <YAxis dataKey="value" allowDecimals={false} />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
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
            width: "100%",
            height: "auto",
            marginX: "0.5rem",
            flex: 2,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            padding: "1rem",
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
            Inventories by type
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={inventoriesByType}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 120 : isTablet ? 120 : 120}
                innerRadius={isMobile ? 100 : isTablet ? 100 : 100}
                fill="#8884d8"
                legendType="circle"
              />
              <Tooltip />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "auto",
            marginX: "0.5rem",
            flex: 2,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            padding: "1rem",
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
            Inventories By Form
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={inventoriesByForm}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 120 : isTablet ? 120 : 120}
                innerRadius={isMobile ? 100 : isTablet ? 100 : 100}
                fill="#8884d8"
              />
              <Tooltip />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Stack>
  );
}

export default OccupationalHealthDashboard;
