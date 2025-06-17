import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Alert,
  AppBar,
  Autocomplete,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import useIsMobile from "../../customHooks/useIsMobile";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import DatePickerComponent from "../../components/DatePickerComponent";
import CustomButton from "../../components/CustomButton";
import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import WarningIcon from "@mui/icons-material/Warning";
import theme from "../../theme";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RichTextComponent from "../../components/RichTextComponent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useQuery } from "@tanstack/react-query";
import { fetchDivision } from "../../api/divisionApi";
import { fetchDepartmentData } from "../../api/departmentApi";
// import {
//   CountryData,
//   DesignationData,
//   EmployeeTypeData,
//   EmploymentTypeData,
//   FunctionData,
//   RAG,
//   SourceOfHiring,
//   StateData,
// } from "../../api/RAG/ragApi";
import {
  AddNewCountryDialog,
  AddNewDesignationDialog,
  AddNewStateDialog,
} from "./CreateAttritionDialogs";
import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Attrition } from "../../api/Attrition/attritionApi";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: Attrition;
  onSubmit?: (data: Attrition) => void;
  isLoading?: boolean;
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

export default function AddOrEditRAGDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
  isLoading,
}: DialogProps) {
  const { isMobile, isTablet } = useIsMobile();
  const [activeTab, setActiveTab] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    trigger,
  } = useForm<Attrition>({
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const resetForm = () => {
    reset();
  };

  const { data: divisionData } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  const { data: departmentData } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartmentData,
  });

  const handleSubmitAccidentRecord = (data: Attrition) => {
    const submitData: Partial<Attrition> = data;
    console.log(submitData);
    onSubmit(submitData as Attrition);
  };

  const isPersonalDetailsValid = useMemo(() => {
    return (
      !errors.division &&
      !errors.employeeType &&
      !errors.employeeId &&
      !errors.employeeName &&
      !errors.gender &&
      !errors.dateOfBirth &&
      !errors.age
    );
  }, [
    errors.division,
    errors.employeeType,
    errors.employeeId,
    errors.employeeName,
    errors.gender,
    errors.dateOfBirth,
    errors.age,
  ]);
  const triggerPersonalDetailsSection = () => {
    trigger([
      "division",
      "employeeType",
      "employeeId",
      "employeeName",
      "gender",
      "dateOfBirth",
      "age",
    ]);
  };

  const isEmploymentDetailsValid = useMemo(() => {
    return (
      !errors.dateOfJoin &&
      !errors.servicePeriod &&
      !errors.tenureSplit &&
      !errors.designation &&
      !errors.department &&
      !errors.reportingManager &&
      !errors.sourceOfHiring &&
      !errors.employmentType
    );
  }, [
    errors.dateOfJoin,
    errors.servicePeriod,
    errors.tenureSplit,
    errors.designation,
    errors.department,
    errors.reportingManager,
    errors.sourceOfHiring,
    errors.employmentType,
  ]);

  const triggerEmploymentDetailsSection = () => {
    trigger([
      "dateOfJoin",
      "servicePeriod",
      "tenureSplit",
      "designation",
      "department",
      "reportingManager",
      "sourceOfHiring",
      "employmentType",
    ]);
  };

  const isLocationDetailsValid = useMemo(() => {
    return !errors.countryName && !errors.state && !errors.origin;
  }, [errors.countryName, errors.state, errors.origin]);

  const triggerLocationDetailsSection = () => {
    trigger(["countryName", "state", "origin"]);
  };

  const isRAGDetailsValid = useMemo(() => {
    return !errors.category && !errors.remark && !errors.discussionSummary;
  }, [errors.category, errors.remark, errors.discussionSummary]);
  const triggerRAGDetailsSection = () => {
    trigger(["countryName", "state", "origin"]);
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 1) {
      triggerPersonalDetailsSection();
    } else if (newValue === 2) {
      triggerPersonalDetailsSection();
      triggerEmploymentDetailsSection();
    } else if (newValue === 3) {
      triggerPersonalDetailsSection();
      triggerEmploymentDetailsSection();
      triggerLocationDetailsSection();
    } else {
      triggerPersonalDetailsSection();
      triggerEmploymentDetailsSection();
      triggerLocationDetailsSection();
      triggerRAGDetailsSection();
    }
    setActiveTab(newValue);
  };

  const [openAddNewDesignationDialog, setOpenAddNewDesignationDialog] =
    useState(false);
  const [openAddNewFunctionDialog, setOpenAddNewFunctionDialog] =
    useState(false);
  const [openAddNewCountryDialog, setOpenAddNewCountryDialog] = useState(false);
  const [openAddNewStateDialog, setOpenAddNewStateDialog] = useState(false);
  const AddNewDesignationButton = (props) => (
    <li
      {...props}
      variant="contained"
      style={{
        backgroundColor: "var(--pallet-lighter-blue)",
        color: "var(--pallet-blue)",
        textTransform: "none",
        margin: "0.5rem",
        borderRadius: "0.3rem",
        display: "flex",
        flexDirection: "row",
      }}
      size="small"
      onMouseDown={() => {
        setOpenAddNewDesignationDialog(true);
      }}
    >
      <AddIcon />
      <Typography variant="body2" component="div">
        Add New Designation
      </Typography>
    </li>
  );
  const AddNewFunctionButton = (props) => (
    <li
      {...props}
      variant="contained"
      style={{
        backgroundColor: "var(--pallet-lighter-blue)",
        color: "var(--pallet-blue)",
        textTransform: "none",
        margin: "0.5rem",
        borderRadius: "0.3rem",
        display: "flex",
        flexDirection: "row",
      }}
      size="small"
      onMouseDown={() => {
        setOpenAddNewFunctionDialog(true);
      }}
    >
      <AddIcon />
      <Typography variant="body2" component="div">
        Add New Function
      </Typography>
    </li>
  );
  const AddNewCountryButton = (props) => (
    <li
      {...props}
      variant="contained"
      style={{
        backgroundColor: "var(--pallet-lighter-blue)",
        color: "var(--pallet-blue)",
        textTransform: "none",
        margin: "0.5rem",
        borderRadius: "0.3rem",
        display: "flex",
        flexDirection: "row",
      }}
      size="small"
      onMouseDown={() => {
        setOpenAddNewCountryDialog(true);
      }}
    >
      <AddIcon />
      <Typography variant="body2" component="div">
        Add New Country
      </Typography>
    </li>
  );
  const AddNewStateButton = (props) => (
    <li
      {...props}
      variant="contained"
      style={{
        backgroundColor: "var(--pallet-lighter-blue)",
        color: "var(--pallet-blue)",
        textTransform: "none",
        margin: "0.5rem",
        borderRadius: "0.3rem",
        display: "flex",
        flexDirection: "row",
      }}
      size="small"
      onMouseDown={() => {
        setOpenAddNewStateDialog(true);
      }}
    >
      <AddIcon />
      <Typography variant="body2" component="div">
        Add New State
      </Typography>
    </li>
  );

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
        <AddNewDesignationDialog
          open={openAddNewDesignationDialog}
          setOpen={setOpenAddNewDesignationDialog}
        />
        {/* <AddNewFunctionDialog
          open={openAddNewFunctionDialog}
          setOpen={setOpenAddNewFunctionDialog}
        /> */}
        <AddNewCountryDialog
          open={openAddNewCountryDialog}
          setOpen={setOpenAddNewCountryDialog}
        />
        <AddNewStateDialog
          open={openAddNewStateDialog}
          setOpen={setOpenAddNewStateDialog}
        />
        <DialogTitle
          sx={{
            paddingY: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" component="div">
            {defaultValues ? "Edit RAG Record " : "Report a RAG Record"}
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
          {Object.keys(errors).length > 0 && (
            <Alert
              severity="error"
              style={{ marginLeft: "1rem", marginRight: "1rem" }}
            >
              Please make sure to fill all the required fields with valid data
            </Alert>
          )}

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
                onChange={handleTabChange}
                indicatorColor="secondary"
                TabIndicatorProps={{
                  style: {
                    backgroundColor:
                      isPersonalDetailsValid &&
                      isEmploymentDetailsValid &&
                      isLocationDetailsValid &&
                      isRAGDetailsValid
                        ? "var(--pallet-blue)"
                        : "var(--pallet-red)",
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
                        color: isPersonalDetailsValid
                          ? "var(--pallet-blue)"
                          : "var(--pallet-red)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <TextSnippetIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Personal Details
                      </Typography>
                      {!isPersonalDetailsValid && (
                        <Typography
                          variant="subtitle1"
                          sx={{ ml: "0.3rem", color: "var(--pallet-red)" }}
                        >
                          *
                        </Typography>
                      )}
                    </Box>
                  }
                  {...a11yProps(0)}
                />
                <Tab
                  label={
                    <Box
                      sx={{
                        color: isEmploymentDetailsValid
                          ? "var(--pallet-blue)"
                          : "var(--pallet-red)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <AccessibilityNewOutlinedIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Employment Details
                      </Typography>{" "}
                      {!isEmploymentDetailsValid && (
                        <Typography
                          variant="subtitle1"
                          sx={{ ml: "0.3rem", color: "var(--pallet-red)" }}
                        >
                          *
                        </Typography>
                      )}
                    </Box>
                  }
                  {...a11yProps(1)}
                />
                <Tab
                  label={
                    <Box
                      sx={{
                        color: isLocationDetailsValid
                          ? "var(--pallet-blue)"
                          : "var(--pallet-red)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <LocationOnOutlinedIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Location Details
                      </Typography>{" "}
                      {!isLocationDetailsValid && (
                        <Typography
                          variant="subtitle1"
                          sx={{ ml: "0.3rem", color: "var(--pallet-red)" }}
                        >
                          *
                        </Typography>
                      )}
                    </Box>
                  }
                  {...a11yProps(2)}
                />
                <Tab
                  label={
                    <Box
                      sx={{
                        color: isRAGDetailsValid
                          ? "var(--pallet-blue)"
                          : "var(--pallet-red)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <WarningIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        RAG Details
                      </Typography>{" "}
                      {!isRAGDetailsValid && (
                        <Typography
                          variant="subtitle1"
                          sx={{ ml: "0.3rem", color: "var(--pallet-red)" }}
                        >
                          *
                        </Typography>
                      )}
                    </Box>
                  }
                  {...a11yProps(3)}
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
                    <Controller
                      name="division"
                      control={control}
                      defaultValue={defaultValues?.division ?? ""}
                      {...register("division", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={
                            divisionData?.length
                              ? divisionData.map(
                                  (division) => division.divisionName
                                )
                              : []
                          }
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
                      id="employeeId"
                      label="Employee Id"
                      error={!!errors.employeeId}
                      helperText={errors.employeeId && "Required"}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("employeeId", { required: true })}
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
                      id="employeeName"
                      label="Employee Name"
                      error={!!errors.employeeName}
                      helperText={errors.employeeName && "Required"}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("employeeName", { required: true })}
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
                      id="gender"
                      label="Gender"
                      error={!!errors.gender}
                      size="small"
                      sx={{
                        flex: 1,
                        margin: "0.5rem",
                        marginTop: isTablet ? "0.5rem" : "1.8rem",
                      }}
                      {...register("gender", { required: true })}
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
                        handleTabChange(null, 1);
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
                              label="Date of Join"
                              error={errors?.dateOfJoin ? "Required" : ""}
                            />
                          </Box>
                        );
                      }}
                    />
                    <TextField
                      required
                      id="servicePeriod"
                      label="Service Period"
                      error={!!errors.servicePeriod}
                      size="small"
                      sx={{
                        flex: 1,
                        margin: "0.5rem",
                        marginTop: isTablet ? "0.5rem" : "1.8rem",
                      }}
                      {...register("servicePeriod", { required: true })}
                    />
                    <TextField
                      required
                      id="tenureSplit"
                      label="Tenure Split"
                      error={!!errors.tenureSplit}
                      size="small"
                      sx={{
                        flex: 1,
                        margin: "0.5rem",
                        marginTop: isTablet ? "0.5rem" : "1.8rem",
                      }}
                      {...register("tenureSplit", { required: true })}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <Controller
                      name="designation"
                      control={control}
                      rules={{ required: "required" }}
                      defaultValue={defaultValues?.designation ?? ""}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(_, value) => field.onChange(value)}
                          value={field.value || ""}
                          size="small"
                          noOptionsText={
                            <Typography
                              variant="body2"
                              color="inherit"
                              gutterBottom
                            >
                              No matching Items
                            </Typography>
                          }
                          options={[
                            ...(DesignationData?.length
                              ? DesignationData.map(
                                  (designation) => designation.designationName
                                )
                              : []),
                            "$ADD_NEW_ITEM",
                          ]}
                          renderOption={(props, option) =>
                            option === "$ADD_NEW_ITEM" ? (
                              <AddNewDesignationButton {...props} />
                            ) : (
                              <li {...props} key={option}>
                                {option}
                              </li>
                            )
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={!!errors.designation}
                              label="Designation"
                            />
                          )}
                        />
                      )}
                    />

                    <Controller
                      name="department"
                      control={control}
                      defaultValue={defaultValues?.department ?? ""}
                      {...register("department", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={
                            departmentData?.length
                              ? departmentData.map(
                                  (department) => department.department
                                )
                              : []
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.department}
                              helperText={errors.department && "Required"}
                              label="Department"
                              name="department"
                            />
                          )}
                        />
                      )}
                    />
                    <Controller
                      name="function"
                      control={control}
                      defaultValue={defaultValues?.function ?? ""}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(_, value) => field.onChange(value)}
                          value={field.value || ""}
                          size="small"
                          noOptionsText={
                            <Typography
                              variant="body2"
                              color="inherit"
                              gutterBottom
                            >
                              No matching Items
                            </Typography>
                          }
                          options={[
                            ...(FunctionData?.length
                              ? FunctionData.map((fun) => fun.functionName)
                              : []),
                            "$ADD_NEW_ITEM",
                          ]}
                          renderOption={(props, option) =>
                            option === "$ADD_NEW_ITEM" ? (
                              <AddNewFunctionButton {...props} />
                            ) : (
                              <li {...props} key={option}>
                                {option}
                              </li>
                            )
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={!!errors.function}
                              label="Function"
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
                    }}
                  >
                    <TextField
                      required
                      id="reportingManager"
                      label="Reporting Manager"
                      error={!!errors.reportingManager}
                      helperText={errors.reportingManager && "Required"}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("reportingManager", { required: true })}
                    />
                    <Controller
                      name="sourceOfHiring"
                      control={control}
                      defaultValue={defaultValues?.sourceOfHiring ?? ""}
                      {...register("sourceOfHiring", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={
                            SourceOfHiring?.length
                              ? SourceOfHiring.map(
                                  (source) => source.sourceName
                                )
                              : []
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.sourceOfHiring}
                              helperText={errors.sourceOfHiring && "Required"}
                              label="Source Of Hiring"
                              name="sourceOfHiring"
                            />
                          )}
                        />
                      )}
                    />
                    <Controller
                      name="employmentType"
                      control={control}
                      defaultValue={defaultValues?.employmentType ?? ""}
                      {...register("employmentType", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={
                            EmploymentTypeData?.length
                              ? EmploymentTypeData.map(
                                  (employee) => employee.employmentType
                                )
                              : []
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.employmentType}
                              helperText={errors.employmentType && "Required"}
                              label="Employment Type"
                              name="employmentType"
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
                    gap={isMobile ? 2 : 0}
                  >
                    <CustomButton
                      variant="contained"
                      sx={{
                        backgroundColor: "var(--pallet-blue)",
                        width: isMobile ? "100%" : "full",
                      }}
                      size="medium"
                      onClick={() => {
                        handleTabChange(null, 0);
                      }}
                      endIcon={<ArrowBackIcon />}
                    >
                      Previous
                    </CustomButton>
                    <CustomButton
                      variant="contained"
                      sx={{
                        backgroundColor: "var(--pallet-blue)",
                        marginLeft: isMobile ? "" : "0.5rem",
                        width: isMobile ? "100%" : "full",
                      }}
                      size="medium"
                      onClick={() => {
                        handleTabChange(null, 2);
                      }}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Next
                    </CustomButton>
                  </Box>
                </Stack>
              </TabPanel>
              <TabPanel value={activeTab} index={2} dir={theme.direction}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                  }}
                >
                  <TextField
                    required
                    id="origin"
                    label="Origin"
                    error={!!errors.origin}
                    helperText={errors.origin && "Required"}
                    size="small"
                    sx={{ flex: 1, margin: "0.5rem" }}
                    {...register("origin", { required: true })}
                  />
                  <Controller
                    name="countryName"
                    control={control}
                    rules={{ required: "required" }}
                    defaultValue={defaultValues?.countryName ?? ""}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        onChange={(_, value) => field.onChange(value)}
                        value={field.value || ""}
                        size="small"
                        noOptionsText={
                          <Typography
                            variant="body2"
                            color="inherit"
                            gutterBottom
                          >
                            No matching Items
                          </Typography>
                        }
                        options={[
                          ...(CountryData?.length
                            ? CountryData.map((country) => country.countryName)
                            : []),
                          "$ADD_NEW_COUNTRY",
                        ]}
                        renderOption={(props, option) =>
                          option === "$ADD_NEW_COUNTRY" ? (
                            <AddNewCountryButton {...props} />
                          ) : (
                            <li {...props} key={option}>
                              {option}
                            </li>
                          )
                        }
                        sx={{ flex: 1, margin: "0.5rem" }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={!!errors.countryName}
                            label="Country"
                          />
                        )}
                      />
                    )}
                  />

                  <Controller
                    name="state"
                    control={control}
                    rules={{ required: "required" }}
                    defaultValue={defaultValues?.state ?? ""}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        onChange={(_, value) => field.onChange(value)}
                        value={field.value || ""}
                        size="small"
                        noOptionsText={
                          <Typography
                            variant="body2"
                            color="inherit"
                            gutterBottom
                          >
                            No matching Items
                          </Typography>
                        }
                        options={[
                          ...(StateData?.length
                            ? StateData.map((state) => state.stateName)
                            : []),
                          "$ADD_NEW_ITEM",
                        ]}
                        renderOption={(props, option) =>
                          option === "$ADD_NEW_ITEM" ? (
                            <AddNewStateButton {...props} />
                          ) : (
                            <li {...props} key={option}>
                              {option}
                            </li>
                          )
                        }
                        sx={{ flex: 1, margin: "0.5rem" }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={!!errors.state}
                            label="State"
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
                  gap={isMobile ? 2 : 0}
                >
                  <CustomButton
                    variant="contained"
                    sx={{
                      backgroundColor: "var(--pallet-blue)",
                      width: isMobile ? "100%" : "full",
                    }}
                    size="medium"
                    onClick={() => {
                      handleTabChange(null, 1);
                    }}
                    endIcon={<ArrowBackIcon />}
                  >
                    Previous
                  </CustomButton>
                  <CustomButton
                    variant="contained"
                    sx={{
                      backgroundColor: "var(--pallet-blue)",
                      marginLeft: isMobile ? "" : "0.5rem",
                      width: isMobile ? "100%" : "full",
                    }}
                    size="medium"
                    onClick={() => {
                      handleTabChange(null, 3);
                    }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Next
                  </CustomButton>
                </Box>
              </TabPanel>
              <TabPanel value={activeTab} index={3} dir={theme.direction}>
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "column",
                  }}
                >
                  <Controller
                    name="category"
                    control={control}
                    defaultValue={defaultValues?.category ?? ""}
                    {...register("category", { required: true })}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        onChange={(event, newValue) => field.onChange(newValue)}
                        size="small"
                        options={
                          EmploymentTypeData?.length
                            ? EmploymentTypeData.map(
                                (employee) => employee.employmentType
                              )
                            : []
                        }
                        sx={{ flex: 1, margin: "0.5rem" }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            error={!!errors.category}
                            helperText={errors.category && "Required"}
                            label="Category"
                            name="category"
                          />
                        )}
                      />
                    )}
                  />
                  <Box
                    sx={{
                      margin: "0.5rem",
                    }}
                  >
                    <Controller
                      control={control}
                      name={"discussionSummary"}
                      render={({ field }) => {
                        return (
                          <RichTextComponent
                            onChange={(e) => field.onChange(e)}
                            placeholder={field.value ?? "Description"}
                          />
                        );
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      margin: "0.5rem",
                    }}
                  >
                    <Controller
                      control={control}
                      name={"remark"}
                      render={({ field }) => {
                        return (
                          <RichTextComponent
                            onChange={(e) => field.onChange(e)}
                            placeholder={field.value ?? "Description"}
                          />
                        );
                      }}
                    />
                  </Box>
                </Stack>
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
                      handleTabChange(null, 2);
                    }}
                    endIcon={<ArrowBackIcon />}
                  >
                    Previous
                  </CustomButton>
                </Box>
              </TabPanel>
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
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={24} /> : null}
            onClick={handleSubmit((data) => {
              handleSubmitAccidentRecord(data);
            })}
          >
            {defaultValues ? "Update Changes" : "Submit Report"}
          </CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
