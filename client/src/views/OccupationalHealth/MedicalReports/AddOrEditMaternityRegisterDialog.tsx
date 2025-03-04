import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Autocomplete,
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import {
  BenefitAndEntitlements,
  LeaveStatus,
  MaternityRegister,
  MedicalDocument,
} from "../../../api/OccupationalHealth/maternityRegisterApi";
import useIsMobile from "../../../customHooks/useIsMobile";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import theme from "../../../theme";
import DatePickerComponent from "../../../components/DatePickerComponent";
import CustomButton from "../../../components/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { sampleDivisions } from "../../../api/sampleData/documentData";
import AddOrEditBenefitEntitlementDialog from "./AddOrEditBenefitEntitlementDialog";
import AddOrEditDocumentDialog from "./AddOrEditDocumentDialog";
import { fetchDivision } from "../../../api/divisionApi";
import { useQuery } from "@tanstack/react-query";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: MaternityRegister;
  onSubmit?: (data: MaternityRegister) => void;
};

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

export default function AddOrEditMaternityRegisterDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: DialogProps) {
  const { isMobile, isTablet } = useIsMobile();
  const [files, setFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [
    openAddOrEditBenefitsEntitlementsDialog,
    setOpenAddOrEditBenefitsEntitlementsDialog,
  ] = useState(false);
  const [selectedBenefitEntitlement, setSelectedBenefitEntitlement] =
    useState<BenefitAndEntitlements>(null);
  const [
    openAddOrEditMedicalDocumentDialog,
    setOpenAddOrEditMedicalDocumentDialog,
  ] = useState(false);
  const [selectedMedicalDocument, setSelectedMedicalDocument] =
    useState<MedicalDocument>(null);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log("event", event);
    setActiveTab(newValue);
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<MaternityRegister>({});

  const watchBenefitAndEntitlements = watch("benefitsAndEntitlements");
  const watchMedicalDocuments = watch("medicalDocuments");

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    } else {
      reset();
    }
  }, [defaultValues, reset]);

  const resetForm = () => {
    reset();
    setFiles([]);
  };

  const handleCreateMedicineInventory = (data: MaternityRegister) => {
    const submitData: Partial<MaternityRegister> = data;
    submitData.id = defaultValues?.id ?? uuidv4();
    onSubmit(submitData as MaternityRegister);
    resetForm();
  };

  const { data: divisionData, isFetching: isDivisionDataFetching } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          resetForm();
          handleClose();
        }}
        fullScreen={true}
        PaperProps={{
          style: {
            backgroundColor: grey[50],
          },
          component: "form",
        }}
      >
        <DialogTitle
          sx={{
            paddingY: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" component="div">
            {defaultValues
              ? "Edit Benefit Request"
              : "Create New Benefit Request"}
          </Typography>
          <IconButton
            aria-label="open drawer"
            onClick={handleClose}
            edge="start"
            sx={{
              color: "#024271",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Stack
            sx={{
              display: "flex",
              flexDirection: isTablet ? "column" : "row",
              padding: "1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
                flex: { lg: 3, md: 1 },
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                padding: "0.5rem",
                borderRadius: "0.3rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  flexDirection: "column",
                  marginX: "0.5rem",
                  marginY: "1rem",
                }}
              >
                <Typography variant="body2" component="div">
                  <b>Date</b>
                </Typography>
                <Typography variant="body2" component="div">
                  {new Date().toDateString()}
                </Typography>
              </Box>
              <Tabs
                value={activeTab}
                onChange={handleChange}
                indicatorColor="secondary"
                TabIndicatorProps={{
                  style: {
                    backgroundColor: "var(--pallet-blue)",
                    height: "3px",
                  },
                }}
                sx={{
                  backgroundColor: "var(--pallet-lighter-grey)",
                  color: "var(--pallet-blue)",
                  width: "100%",
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
                      <AccountBoxIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Employee Information
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
                      <DescriptionIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Maternity Leave Application
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
                      <ReceiptLongIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Benefit and Entitlements
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(2)}
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
                      <AssignmentReturnIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Return to Work Plan
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(3)}
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
                      <MedicalServicesIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Medical Documentation
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(4)}
                />
              </Tabs>
              <TabPanel value={activeTab} index={0} dir={theme.direction}>
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#fff",
                    flex: { lg: 3, md: 1 },
                    borderRadius: "0.3rem",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <TextField
                      required
                      id="employeeId"
                      label="Employee ID"
                      error={!!errors.employeeId}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("employeeId", { required: true })}
                    />
                    <TextField
                      required
                      id="name"
                      label="Name"
                      error={!!errors.employeeName}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("employeeName", { required: true })}
                    />
                    <TextField
                      required
                      id="age"
                      label="Age"
                      error={!!errors.age}
                      size="small"
                      type="number"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("age")}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <TextField
                      required
                      id="contactNumber"
                      label="Contact Number"
                      error={!!errors.contactNumber}
                      size="small"
                      type="number"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("contactNumber")}
                    />
                    <TextField
                      required
                      id="designation"
                      label="Designation"
                      error={!!errors.designation}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("designation", { required: true })}
                    />
                    <TextField
                      required
                      id="department"
                      label="Department"
                      error={!!errors.department}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("department", { required: true })}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <TextField
                      required
                      id="supervisorManager"
                      label="Supervisor/Manager"
                      error={!!errors.supervisorOrManager}
                      size="small"
                      sx={{
                        flex: 1,
                        margin: "0.5rem",
                        marginTop: isTablet ? "0.5rem" : "1.8rem",
                      }}
                      {...register("supervisorOrManager")}
                    />
                    <Controller
                      control={control}
                      {...register("dateOfJoin", { required: true })}
                      name={"dateOfJoin"}
                      render={({ field }) => {
                        return (
                          <Box sx={{ flex: 1, margin: "0.5rem" }}>
                            <DatePickerComponent
                              onChange={(e) => field.onChange(e)}
                              value={
                                field.value ? new Date(field.value) : undefined
                              }
                              label="Manufacturing Date"
                              error={errors?.dateOfJoin ? "Required" : ""}
                            />
                          </Box>
                        );
                      }}
                    />
                    <TextField
                      required
                      id="averageWages"
                      label="Average Wages"
                      error={!!errors.averageWages}
                      size="small"
                      type="number"
                      sx={{
                        flex: 1,
                        margin: "0.5rem",
                        marginTop: isTablet ? "0.5rem" : "1.8rem",
                      }}
                      {...register("averageWages")}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      margin: "0.5rem",
                      justifyContent: "flex-end",
                    }}
                  >
                    <CustomButton
                      variant="contained"
                      sx={{
                        backgroundColor: "var(--pallet-blue)",
                      }}
                      size="medium"
                      onClick={() => {
                        setActiveTab(1);
                      }}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Next
                    </CustomButton>
                  </Box>
                </Stack>
              </TabPanel>
              <TabPanel value={activeTab} index={1} dir={theme.direction}>
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#fff",
                    flex: { lg: 3, md: 1 },
                    borderRadius: "0.3rem",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <TextField
                      required
                      id="applicationId"
                      label="Application ID"
                      error={!!errors.applicationId}
                      size="small"
                      sx={{
                        flex: 1,
                        margin: "0.5rem",
                        marginTop: isTablet ? "0.5rem" : "1.8rem",
                      }}
                      {...register("applicationId", {
                        required: true,
                      })}
                    />
                    <Controller
                      control={control}
                      {...register("applicationDate", { required: true })}
                      name={"applicationDate"}
                      render={({ field }) => {
                        return (
                          <Box sx={{ flex: 1, margin: "0.5rem" }}>
                            <DatePickerComponent
                              onChange={(e) => field.onChange(e)}
                              value={field.value ? new Date(field.value) : null}
                              label="Application Date"
                              error={errors?.applicationDate ? "Required" : ""}
                            />
                          </Box>
                        );
                      }}
                    />
                    <Controller
                      control={control}
                      {...register("expectedDeliveryDate")}
                      name={"expectedDeliveryDate"}
                      render={({ field }) => {
                        return (
                          <Box sx={{ flex: 1, margin: "0.5rem" }}>
                            <DatePickerComponent
                              onChange={(e) => field.onChange(e)}
                              value={field.value ? new Date(field.value) : null}
                              label="Expected Delivery Date"
                            />
                          </Box>
                        );
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <Controller
                      control={control}
                      {...register("leaveStartDate", { required: true })}
                      name={"leaveStartDate"}
                      render={({ field }) => {
                        return (
                          <Box sx={{ flex: 1, margin: "0.5rem" }}>
                            <DatePickerComponent
                              onChange={(e) => field.onChange(e)}
                              value={field.value ? new Date(field.value) : null}
                              label="Leave Start Date"
                              error={errors?.leaveStartDate ? "Required" : ""}
                            />
                          </Box>
                        );
                      }}
                    />
                    <Controller
                      control={control}
                      {...register("leaveEndDate", { required: true })}
                      name={"leaveEndDate"}
                      render={({ field }) => {
                        return (
                          <Box sx={{ flex: 1, margin: "0.5rem" }}>
                            <DatePickerComponent
                              onChange={(e) => field.onChange(e)}
                              value={field.value ? new Date(field.value) : null}
                              label="Leave End Date"
                              error={errors?.leaveEndDate ? "Required" : ""}
                            />
                          </Box>
                        );
                      }}
                    />
                    <Controller
                      control={control}
                      {...register("actualDeliveryDate", {
                        required: true,
                      })}
                      name={"actualDeliveryDate"}
                      render={({ field }) => {
                        return (
                          <Box sx={{ flex: 1, margin: "0.5rem" }}>
                            <DatePickerComponent
                              onChange={(e) => field.onChange(e)}
                              value={field.value ? new Date(field.value) : null}
                              label="Application Date"
                              error={
                                errors?.actualDeliveryDate ? "Required" : ""
                              }
                            />
                          </Box>
                        );
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <Controller
                      name="leaveStatus"
                      control={control}
                      defaultValue={defaultValues?.leaveStatus}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={Object.values(LeaveStatus)}
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.leaveStatus}
                              label="Leave Type"
                              name="leaveStatus"
                            />
                          )}
                        />
                      )}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      margin: "0.5rem",
                      justifyContent: "flex-end",
                    }}
                  >
                    <CustomButton
                      variant="contained"
                      sx={{
                        backgroundColor: "var(--pallet-blue)",
                      }}
                      size="medium"
                      onClick={() => {
                        setActiveTab(0);
                      }}
                      endIcon={<ArrowBackIcon />}
                    >
                      Previous
                    </CustomButton>
                    <CustomButton
                      variant="contained"
                      sx={{
                        backgroundColor: "var(--pallet-blue)",
                        marginLeft: "0.5rem",
                      }}
                      size="medium"
                      onClick={() => {
                        setActiveTab(2);
                      }}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Next
                    </CustomButton>
                  </Box>
                </Stack>
              </TabPanel>
              <TabPanel value={activeTab} index={2} dir={theme.direction}>
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#fff",
                    flex: { lg: 3, md: 1 },
                    borderRadius: "0.3rem",
                  }}
                >
                  <TableContainer
                    component={Paper}
                    elevation={2}
                    sx={{
                      overflowX: "auto",
                      maxWidth: isMobile ? "88vw" : "100%",
                    }}
                  >
                    <Box
                      sx={{
                        padding: theme.spacing(2),
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "var(--pallet-blue)" }}
                        startIcon={<AddIcon />}
                        onClick={() => {
                          setSelectedBenefitEntitlement(null);
                          setOpenAddOrEditBenefitsEntitlementsDialog(true);
                        }}
                      >
                        Add Benefit and Entitlements
                      </Button>
                    </Box>
                    <Table aria-label="simple table">
                      <TableHead
                        sx={{
                          backgroundColor: "var(--pallet-lighter-grey)",
                        }}
                      >
                        <TableRow>
                          <TableCell align="center">Benefit Type</TableCell>
                          <TableCell align="center">Amount/Value</TableCell>
                          <TableCell align="center">Total Days Paid</TableCell>
                          <TableCell align="center">Beneficiary Name</TableCell>
                          <TableCell align="center"></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {watchBenefitAndEntitlements?.length > 0 ? (
                          watchBenefitAndEntitlements?.map((row) => (
                            <TableRow
                              // key={`${row.id}`}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                console.log("row");
                              }}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                align="center"
                              >
                                {row.benefitType}
                              </TableCell>
                              <TableCell align="center">
                                {row.amountValue}
                              </TableCell>
                              <TableCell align="center">
                                {row.totalDaysPaid}
                              </TableCell>
                              <TableCell align="center">
                                {row.beneficiaryName}
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  onClick={() => {
                                    setSelectedBenefitEntitlement(row);
                                    setOpenAddOrEditBenefitsEntitlementsDialog(
                                      true
                                    );
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() => {
                                    setValue(
                                      "benefitsAndEntitlements",
                                      (
                                        watchBenefitAndEntitlements ?? []
                                      ).filter((item) => item.id !== row.id)
                                    );
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={11} align="center">
                              <Typography variant="body2">
                                No Records found
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      margin: "0.5rem",
                      justifyContent: "flex-end",
                      marginTop: "1.2rem",
                    }}
                  >
                    <CustomButton
                      variant="contained"
                      sx={{
                        backgroundColor: "var(--pallet-blue)",
                      }}
                      size="medium"
                      onClick={() => {
                        setActiveTab(1);
                      }}
                      endIcon={<ArrowBackIcon />}
                    >
                      Previous
                    </CustomButton>
                    <CustomButton
                      variant="contained"
                      sx={{
                        backgroundColor: "var(--pallet-blue)",
                        marginLeft: "0.5rem",
                      }}
                      size="medium"
                      onClick={() => {
                        setActiveTab(3);
                      }}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Next
                    </CustomButton>
                  </Box>
                </Stack>
              </TabPanel>
              <TabPanel value={activeTab} index={3} dir={theme.direction}>
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#fff",
                    flex: { lg: 3, md: 1 },
                    borderRadius: "0.3rem",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Controller
                      control={control}
                      {...register("dateOfJoin", { required: true })}
                      name={"dateOfJoin"}
                      render={({ field }) => {
                        return (
                          <Box sx={{ flex: 1, margin: "0.5rem" }}>
                            <DatePickerComponent
                              onChange={(e) => field.onChange(e)}
                              value={field.value ? new Date(field.value) : null}
                              label="Manufacturing Date"
                              error={errors?.dateOfJoin ? "Required" : ""}
                            />
                          </Box>
                        );
                      }}
                    />
                    <Controller
                      control={control}
                      {...register("noticeDateAfterDelivery", {
                        required: true,
                      })}
                      name={"noticeDateAfterDelivery"}
                      render={({ field }) => {
                        return (
                          <Box sx={{ flex: 1, margin: "0.5rem" }}>
                            <DatePickerComponent
                              onChange={(e) => field.onChange(e)}
                              value={field.value ? new Date(field.value) : null}
                              label="Notice Date After Delivery"
                              error={
                                errors?.noticeDateAfterDelivery
                                  ? "Required"
                                  : ""
                              }
                            />
                          </Box>
                        );
                      }}
                    />
                    <Controller
                      control={control}
                      {...register("reJoinDate", {
                        required: true,
                      })}
                      name={"reJoinDate"}
                      render={({ field }) => {
                        return (
                          <Box sx={{ flex: 1, margin: "0.5rem" }}>
                            <DatePickerComponent
                              onChange={(e) => field.onChange(e)}
                              value={field.value ? new Date(field.value) : null}
                              label="Rejoining Date"
                              error={errors?.reJoinDate ? "Required" : ""}
                            />
                          </Box>
                        );
                      }}
                    />
                    <TextField
                      required
                      id="supportProvider"
                      label="Support Provided"
                      error={!!errors.supportProvider}
                      size="small"
                      sx={{
                        flex: 1,
                        margin: "0.5rem",
                        marginTop: isTablet ? "0.5rem" : "1.8rem",
                      }}
                      {...register("supportProvider")}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      margin: "0.5rem",
                      justifyContent: "flex-end",
                    }}
                  >
                    <CustomButton
                      variant="contained"
                      sx={{
                        backgroundColor: "var(--pallet-blue)",
                      }}
                      size="medium"
                      onClick={() => {
                        setActiveTab(2);
                      }}
                      endIcon={<ArrowBackIcon />}
                    >
                      Previous
                    </CustomButton>{" "}
                    <CustomButton
                      variant="contained"
                      sx={{
                        backgroundColor: "var(--pallet-blue)",
                        marginLeft: "0.5rem",
                      }}
                      size="medium"
                      onClick={() => {
                        setActiveTab(4);
                      }}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Next
                    </CustomButton>
                  </Box>
                </Stack>
              </TabPanel>
              <TabPanel value={activeTab} index={4} dir={theme.direction}>
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#fff",
                    flex: { lg: 3, md: 1 },
                    borderRadius: "0.3rem",
                  }}
                >
                  <TableContainer
                    component={Paper}
                    elevation={2}
                    sx={{
                      overflowX: "auto",
                      maxWidth: isMobile ? "88vw" : "100%",
                    }}
                  >
                    <Box
                      sx={{
                        padding: theme.spacing(2),
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "var(--pallet-blue)" }}
                        startIcon={<AddIcon />}
                        onClick={() => {
                          setSelectedMedicalDocument(null);
                          setOpenAddOrEditMedicalDocumentDialog(true);
                        }}
                      >
                        Add Medical Documentation
                      </Button>
                    </Box>
                    <Table aria-label="simple table">
                      <TableHead
                        sx={{
                          backgroundColor: "var(--pallet-lighter-grey)",
                        }}
                      >
                        <TableRow>
                          <TableCell align="center">Document Type</TableCell>
                          <TableCell align="center">Update Date</TableCell>
                          <TableCell align="center">Document</TableCell>
                          <TableCell align="center"></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {watchMedicalDocuments?.length > 0 ? (
                          watchMedicalDocuments?.map((row) => (
                            <TableRow
                              // key={`${row.id}`}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                console.log("row");
                              }}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                align="center"
                              >
                                {row.documentType}
                              </TableCell>
                              <TableCell align="center">
                                {row.uploadDate?.toDateString()}
                              </TableCell>
                              <TableCell align="center">
                                {row.document}
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  onClick={() => {
                                    setSelectedMedicalDocument(row);
                                    setOpenAddOrEditMedicalDocumentDialog(true);
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() => {
                                    setValue(
                                      "medicalDocuments",
                                      (watchMedicalDocuments ?? []).filter(
                                        (item) => item.id !== row.id
                                      )
                                    );
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={11} align="center">
                              <Typography variant="body2">
                                No Records found
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      margin: "0.5rem",
                      justifyContent: "flex-end",
                      marginTop: "1.2rem",
                    }}
                  >
                    <CustomButton
                      variant="contained"
                      sx={{
                        backgroundColor: "var(--pallet-blue)",
                      }}
                      size="medium"
                      onClick={() => {
                        setActiveTab(3);
                      }}
                      endIcon={<ArrowBackIcon />}
                    >
                      Previous
                    </CustomButton>
                  </Box>
                </Stack>
              </TabPanel>
            </Box>
            <Box
              sx={{
                display: "flex",
                flex: { lg: 1, md: 1 },
                flexDirection: "column",
                backgroundColor: "#fff",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                padding: "1rem",
                borderRadius: "0.3rem",
                marginY: isTablet ? "0.5rem" : 0,
                marginLeft: isTablet ? 0 : "0.5rem",
                height: "fit-content",
              }}
            >
              <Box sx={{ margin: "0.5rem" }}>
                <Controller
                  name="division"
                  control={control}
                  defaultValue={defaultValues?.division ?? null}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      size="small"
                      options={
                        divisionData?.length ? divisionData.map((division) => division.divisionName) : []}

                      sx={{ flex: 1, margin: "0.5rem" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          error={!!errors.division}
                          helperText={errors.division && "Required"}
                          label="Division"
                          name="division"
                        />
                      )}
                    />
                  )}
                />
                <TextField
                  required
                  id="remarks"
                  label="Remarks"
                  error={!!errors.remarks}
                  size="small"
                  sx={{ flex: 1, margin: "0.5rem" }}
                  {...register("remarks")}
                  multiline
                  rows={4}
                />
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ padding: "1rem" }}>
          <Button
            onClick={() => {
              resetForm();
              handleClose();
            }}
            sx={{ color: "var(--pallet-blue)" }}
          >
            Cancel
          </Button>
          <CustomButton
            variant="contained"
            sx={{
              backgroundColor: "var(--pallet-blue)",
            }}
            size="medium"
            onClick={handleSubmit((data) => {
              handleCreateMedicineInventory(data);
            })}
          >
            {defaultValues ? "Update Changes" : "Submit Item"}
          </CustomButton>
        </DialogActions>
      </Dialog>

      {openAddOrEditBenefitsEntitlementsDialog && (
        <AddOrEditBenefitEntitlementDialog
          open={openAddOrEditBenefitsEntitlementsDialog}
          handleClose={() => setOpenAddOrEditBenefitsEntitlementsDialog(false)}
          onSubmit={(data) => {
            if (selectedBenefitEntitlement) {
              setValue("benefitsAndEntitlements", [
                ...(watchBenefitAndEntitlements ?? []).map((item) => {
                  if (item.id === selectedBenefitEntitlement.id) {
                    return data;
                  }
                  return item;
                }),
              ]);
            } else {
              setValue("benefitsAndEntitlements", [
                ...(watchBenefitAndEntitlements ?? []),
                { ...data, id: uuidv4() },
              ]);
            }
            setOpenAddOrEditBenefitsEntitlementsDialog(false);
            setSelectedBenefitEntitlement(null);
          }}
          defaultValues={selectedBenefitEntitlement}
        />
      )}
      {openAddOrEditMedicalDocumentDialog && (
        <AddOrEditDocumentDialog
          open={openAddOrEditMedicalDocumentDialog}
          handleClose={() => setOpenAddOrEditMedicalDocumentDialog(false)}
          onSubmit={(data) => {
            if (selectedMedicalDocument) {
              setValue("medicalDocuments", [
                ...(watchMedicalDocuments ?? []).map((item) => {
                  if (item.id === selectedMedicalDocument.id) {
                    return {
                      ...data,
                      id: selectedMedicalDocument.id,
                      uploadDate: new Date(),
                    };
                  }
                  return item;
                }),
              ]);
            } else {
              setValue("medicalDocuments", [
                ...(watchMedicalDocuments ?? []),
                { ...data, id: uuidv4(), uploadDate: new Date() },
              ]);
            }
            setOpenAddOrEditMedicalDocumentDialog(false);
            setSelectedMedicalDocument(null);
          }}
          defaultValues={selectedMedicalDocument}
        />
      )}
    </>
  );
}
