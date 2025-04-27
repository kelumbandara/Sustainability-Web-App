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
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchDivision } from "../../../api/divisionApi";
import { fetchMedicineRequestAssignee } from "../../../api/userApi";
import CustomButton from "../../../components/CustomButton";
import DatePickerComponent from "../../../components/DatePickerComponent";
import RichTextComponent from "../../../components/RichTextComponent";
import UserAutoComplete from "../../../components/UserAutoComplete";
import AutoCheckBox from "../../../components/AutoCheckbox";
import {
  InternalAuditType,
  ScheduledInternalAudit,
  ScheduledInternalAuditStatus,
  SupplierType,
  getInternalAuditFormsList,
  getFactoryList,
  getProcessTypeList,
  getContactPersonList,
  updateDraftScheduledInternalAudit,
  updateScheduledInternalAudit,
  InternalAuditAnswerToQuestions,
  updateOngoingInternalAudit,
  completeInternalAudit,
} from "../../../api/AuditAndInspection/internalAudit";
import { fetchDepartmentData } from "../../../api/departmentApi";
import SwitchButton from "../../../components/SwitchButton";
import ArticleIcon from "@mui/icons-material/Article";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import theme from "../../../theme";
import { RenderInternalAuditStatusChip } from "./InternalAuditTable";

import useIsMobile from "../../../customHooks/useIsMobile";
import {
  AddNewFactoryButton,
  AddNewFactoryDialog,
} from "./AddNewFactoryDialog";
import {
  AddNewProcessTypeButton,
  AddNewProcessTypeDialog,
} from "./AddNewProcessTypeDialog";
import queryClient from "../../../state/queryClient";
import { useSnackbar } from "notistack";
import { AuditQuestionsSectionAccordion } from "./AuditQuestionsSectionAccordion";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: ScheduledInternalAudit;
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

export default function EditScheduledInternalAudit({
  open,
  handleClose,
  defaultValues,
}: DialogProps) {
  const { isTablet } = useIsMobile();
  const { enqueueSnackbar } = useSnackbar();
  const [openAddNewFactoryDialog, setOpenAddNewFactoryDialog] = useState(false);
  const [openAddNewProcessTypeDialog, setOpenAddNewProcessTypeDialog] =
    useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const { data: internalAuditFormsData } = useQuery({
    queryKey: ["internal-audit-forms"],
    queryFn: getInternalAuditFormsList,
  });

  const { data: processTypesData } = useQuery({
    queryKey: ["process-types"],
    queryFn: getProcessTypeList,
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      ...defaultValues,
      department: defaultValues?.department?.map(
        (department) => department.department
      ),
    },
  });

  const answers = watch("answers");
  console.log("answers", answers);

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

  const { data: assigneeData } = useQuery({
    queryKey: ["medicine-assignee"],
    queryFn: fetchMedicineRequestAssignee,
  });

  const { data: factoryData } = useQuery({
    queryKey: ["factories"],
    queryFn: getFactoryList,
  });

  const handleUpdateInternalAudit = (
    data: ScheduledInternalAudit,
    updateTo: "DRAFT" | "SCHEDULED" | "ONGOING" | "COMPLETED"
  ) => {
    const modifiedDepartmentData = data.department?.map((department) => {
      const departmentObj = departmentData?.find(
        (dept) => dept.department === department
      );
      return departmentObj?.id;
    });

    const submitData: Partial<ScheduledInternalAudit> = {
      id: defaultValues.id,
      division: data.division,
      auditId: data.audit?.id,
      auditType: data.auditType,
      department: modifiedDepartmentData,
      isAuditScheduledForSupplier: data.isAuditScheduledForSupplier ?? false,
      supplierType: data.supplierType,
      factoryLicenseNo: data.factoryLicenseNo,
      higgId: data.higgId,
      zdhcId: data.zdhcId,
      processType: data.processType,
      factoryName: data.factoryName,
      factoryAddress: data.factoryAddress,
      factoryEmail: data.factoryEmail,
      factoryContactPersonId: data.factoryContactPersonId,
      factoryContactNumber: data.factoryContactNumber,
      designation: data.designation,
      description: data.description,
      auditeeId: data.auditee?.id,
      approverId: data.approver?.id,
      auditDate: data.auditDate,
      dateForApproval: data.dateForApproval,
    };

    if (updateTo === "DRAFT") {
      updateDraftInternalScheduleAuditMutation(
        submitData as ScheduledInternalAudit
      );
    } else if (updateTo === "SCHEDULED") {
      updateInternalScheduleAuditMutation(submitData as ScheduledInternalAudit);
    } else if (updateTo === "ONGOING") {
      submitData.answers = answers;
      updateOngoingInternalScheduleAuditMutation(
        submitData as ScheduledInternalAudit
      );
    } else if (updateTo === "COMPLETED") {
      submitData.answers = answers;
      completeInternalScheduleAuditMutation(
        submitData as ScheduledInternalAudit
      );
    }
  };

  const {
    mutate: updateDraftInternalScheduleAuditMutation,
    isPending: isDraftAuditUpdating,
  } = useMutation({
    mutationFn: updateDraftScheduledInternalAudit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["scheduled-internal-audit"],
      });
      enqueueSnackbar("Internal Audit Draft Updated Successfully!", {
        variant: "success",
      });
      resetForm();
      handleClose();
    },
    onError: () => {
      enqueueSnackbar(`Internal Audit Draft Update Failed`, {
        variant: "error",
      });
    },
  });

  const {
    mutate: updateInternalScheduleAuditMutation,
    isPending: isInternalAuditUpdating,
  } = useMutation({
    mutationFn: updateScheduledInternalAudit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["scheduled-internal-audit"],
      });
      enqueueSnackbar("Internal Audit Draft Updated Successfully!", {
        variant: "success",
      });
      resetForm();
      handleClose();
    },
    onError: () => {
      enqueueSnackbar(`Internal Audit Draft Update Failed`, {
        variant: "error",
      });
    },
  });

  const {
    mutate: updateOngoingInternalScheduleAuditMutation,
    isPending: isOngoingInternalAuditUpdating,
  } = useMutation({
    mutationFn: updateOngoingInternalAudit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["scheduled-internal-audit"],
      });
      enqueueSnackbar("Ongoing Internal Audit Updated Successfully!", {
        variant: "success",
      });
      resetForm();
      handleClose();
    },
    onError: () => {
      enqueueSnackbar(`Ongoing Internal Audit Update Failed`, {
        variant: "error",
      });
    },
  });

  const {
    mutate: completeInternalScheduleAuditMutation,
    isPending: isCompleteInternalAuditUpdating,
  } = useMutation({
    mutationFn: completeInternalAudit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["scheduled-internal-audit"],
      });
      enqueueSnackbar("Audit Completed Successfully!", {
        variant: "success",
      });
      resetForm();
      handleClose();
    },
    onError: () => {
      enqueueSnackbar(`Internal Audit Complete Failed`, {
        variant: "error",
      });
    },
  });

  const { data: contactPeopleData } = useQuery({
    queryKey: ["contact-people"],
    queryFn: getContactPersonList,
  });

  const isAuditScheduledForSupplier = watch("isAuditScheduledForSupplier");

  return (
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
      <AddNewFactoryDialog
        open={openAddNewFactoryDialog}
        setOpen={setOpenAddNewFactoryDialog}
      />
      <AddNewProcessTypeDialog
        open={openAddNewProcessTypeDialog}
        setOpen={setOpenAddNewProcessTypeDialog}
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
          Edit Internal Audit
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
            flexDirection: "column",
            backgroundColor: "#fff",
            flex: { lg: 3, md: 1 },
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            padding: "0.5rem",
            borderRadius: "0.3rem",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isTablet ? "column" : "row",
              alignItems: "center",
              marginY: "0.54rem",
            }}
          >
            <Box
              sx={{
                paddingY: "0.3rem",
                paddingX: "0.5rem",
                minWidth: "8rem",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{ paddingBottom: 0, color: "var(--pallet-grey)" }}
              >
                Status
              </Typography>
              <Box>{RenderInternalAuditStatusChip(defaultValues.status)}</Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                margin: "0.5rem",
                flex: 1,
              }}
            >
              <Typography variant="body2" component="div">
                <b>Date</b>
              </Typography>
              <Typography variant="body2" component="div">
                {new Date().toDateString()}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Box sx={{ margin: "0.5rem", flex: 1 }}>
              <Controller
                control={control}
                {...register("auditDate")}
                name={"auditDate"}
                render={({ field }) => {
                  return (
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value ? new Date(field.value) : null}
                      label="Audit Date"
                    />
                  );
                }}
              />
            </Box>
            <Box sx={{ margin: "0.5rem", flex: 1 }}>
              <Controller
                control={control}
                {...register("dateForApproval", { required: true })}
                name={"dateForApproval"}
                render={({ field }) => {
                  return (
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value ? new Date(field.value) : null}
                      label="Date for Approval"
                      error={errors?.dateForApproval ? "Required" : ""}
                    />
                  );
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <UserAutoComplete
                name="auditee"
                label="Auditee"
                control={control as any}
                register={register}
                errors={errors}
                userData={assigneeData}
                required={true}
                defaultValue={defaultValues.auditee}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <UserAutoComplete
                name="approver"
                label="Approver"
                control={control as any}
                register={register}
                errors={errors}
                userData={assigneeData}
                required={true}
                defaultValue={defaultValues.approver}
              />
            </Box>
          </Box>
          <AppBar position="static" sx={{ marginY: "1rem" }}>
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
                    <ArticleIcon fontSize="small" />
                    <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                      General Details
                    </Typography>
                  </Box>
                }
                {...a11yProps(0)}
              />
              {defaultValues.status !== ScheduledInternalAuditStatus.DRAFT && (
                <Tab
                  label={
                    <Box
                      sx={{
                        color: "var(--pallet-blue)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ContentPasteSearchIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        {defaultValues.audit?.name}
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(1)}
                />
              )}
              {defaultValues.status ===
                ScheduledInternalAuditStatus.COMPLETED && (
                <Tab
                  label={
                    <Box
                      sx={{
                        color: "var(--pallet-blue)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Diversity3Icon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Action Plan
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(1)}
                />
              )}
            </Tabs>
          </AppBar>
          <TabPanel value={activeTab} index={0} dir={theme.direction}>
            <Box
              sx={{
                display: "flex",
                flexDirection: isTablet ? "column" : "row",
              }}
            >
              <Autocomplete
                {...register("division", { required: true })}
                size="small"
                options={
                  divisionData?.length
                    ? divisionData.map((division) => division.divisionName)
                    : []
                }
                defaultValue={defaultValues?.division}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.division}
                    helperText={errors.division ? "Required" : ""}
                    label="Division"
                    name="division"
                  />
                )}
              />
              <Box sx={{ flex: 1, margin: "0.5rem" }}>
                <AutoCheckBox
                  control={control}
                  required={true}
                  name="department"
                  label="Departments"
                  options={departmentData}
                  selectedValues={watch("department")}
                  setSelectedValues={(value) => setValue("department", value)}
                  getOptionLabel={(option) => option.department}
                  getOptionValue={(option) => option.department}
                  placeholder="Choose Departments"
                  limitTags={2}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isTablet ? "column" : "row",
              }}
            >
              <Controller
                name={"audit"}
                control={control}
                {...register("audit", { required: true })}
                render={({ field }) => (
                  <Autocomplete
                    size="small"
                    options={
                      internalAuditFormsData &&
                      Array.isArray(internalAuditFormsData)
                        ? internalAuditFormsData
                        : []
                    }
                    sx={{ flex: 1, margin: "0.5rem" }}
                    getOptionLabel={(option) => option?.name || ""}
                    defaultValue={defaultValues.audit}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        error={!!errors["audit"]}
                        helperText={errors["audit"] ? "Required" : ""}
                        label={"Audit Title"}
                        name={"audit"}
                      />
                    )}
                    onChange={(_, data) => field.onChange(data)}
                  />
                )}
              />
              <Autocomplete
                {...register("auditType", { required: true })}
                size="small"
                options={Object.values(InternalAuditType)}
                sx={{ flex: 1, margin: "0.5rem" }}
                defaultValue={defaultValues.auditType}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.auditType}
                    helperText={errors.auditType ? "Required" : ""}
                    label="Audit Type"
                    name="auditType"
                  />
                )}
              />
            </Box>
            <Box
              sx={{
                marginLeft: "0.5rem",
              }}
            >
              <Controller
                control={control}
                name={"isAuditScheduledForSupplier"}
                render={({ field }) => {
                  return (
                    <SwitchButton
                      label="Is the audit scheduled for a supplier?"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  );
                }}
              />
            </Box>
            {isAuditScheduledForSupplier && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isTablet ? "column" : "row",
                  }}
                >
                  <Autocomplete
                    {...register("supplierType", { required: true })}
                    size="small"
                    options={Object.values(SupplierType)}
                    sx={{ flex: 1, margin: "0.5rem" }}
                    defaultValue={defaultValues.supplierType}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        error={!!errors.supplierType}
                        helperText={errors.supplierType ? "Required" : ""}
                        label="Supplier Type"
                        name="supplierType"
                      />
                    )}
                  />
                  <Box sx={{ flex: 1, margin: "0.5rem" }}>
                    <TextField
                      id="factoryLicenseNo"
                      required
                      label="Factory License No"
                      sx={{ width: "100%" }}
                      error={!!errors.factoryLicenseNo}
                      size="small"
                      {...register("factoryLicenseNo", { required: true })}
                    />
                  </Box>
                  <Box sx={{ flex: 1, margin: "0.5rem" }}>
                    <TextField
                      id="higgId"
                      label="Higg Id"
                      error={!!errors.higgId}
                      sx={{ width: "100%" }}
                      size="small"
                      {...register("higgId")}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isTablet ? "column" : "row",
                  }}
                >
                  <Box sx={{ flex: 1, margin: "0.5rem" }}>
                    <TextField
                      id="zdhcId"
                      label="Factory License No"
                      error={!!errors.zdhcId}
                      size="small"
                      sx={{ width: "100%" }}
                      {...register("zdhcId")}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Autocomplete
                      {...register("processType", { required: true })}
                      size="small"
                      defaultValue={defaultValues.processType}
                      noOptionsText={
                        <>
                          <Typography
                            variant="body2"
                            color="inherit"
                            gutterBottom
                          >
                            No matching Items
                          </Typography>
                        </>
                      }
                      options={[
                        ...(processTypesData?.length
                          ? processTypesData.map(
                              (process) => process?.processType
                            )
                          : []),
                        "$ADD_NEW_PROCESS_TYPE",
                      ]}
                      renderOption={(props, option) => (
                        <>
                          {option === "$ADD_NEW_PROCESS_TYPE" ? (
                            <AddNewProcessTypeButton
                              {...props}
                              onMouseDown={() =>
                                setOpenAddNewProcessTypeDialog(true)
                              }
                            />
                          ) : (
                            <li {...props} key={option}>
                              {option}
                            </li>
                          )}
                        </>
                      )}
                      sx={{ flex: 1, margin: "0.5rem" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!errors.processType}
                          label="Process Type"
                          name="processType"
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                      )}
                    />
                  </Box>
                </Box>
                <Divider sx={{ margin: "1rem" }} />
              </>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: isTablet ? "column" : "row",
              }}
            >
              <Autocomplete
                {...register("factoryName", { required: true })}
                size="small"
                defaultValue={defaultValues.factoryName}
                noOptionsText={
                  <>
                    <Typography variant="body2" color="inherit" gutterBottom>
                      No matching Items
                    </Typography>
                  </>
                }
                options={[
                  ...(factoryData?.length
                    ? factoryData.map((category) => category.factoryName)
                    : []),
                  "$ADD_NEW_FACTORY",
                ]}
                renderOption={(props, option) => (
                  <>
                    {option === "$ADD_NEW_FACTORY" ? (
                      <AddNewFactoryButton
                        {...props}
                        onMouseDown={() => {
                          setOpenAddNewFactoryDialog(true);
                        }}
                      />
                    ) : (
                      <li {...props} key={option}>
                        {option}
                      </li>
                    )}
                  </>
                )}
                sx={{ flex: 1, margin: "0.5rem" }}
                onChange={async (_, data) => {
                  const selectedFactory = factoryData?.find(
                    (factory) => factory.factoryName === data
                  );
                  await setValue("factory", selectedFactory);
                  await setValue("factoryName", selectedFactory?.factoryName);
                  await setValue("factoryId", selectedFactory?.id);

                  await setValue(
                    "factoryAddress",
                    selectedFactory?.factoryAddress
                  );
                  await setValue(
                    "factoryContactPerson",
                    selectedFactory?.factoryContactPerson
                  );
                  console.log(selectedFactory?.factoryContactPerson);
                  await setValue(
                    "factoryContactPersonName",
                    selectedFactory?.factoryContactPersonName
                  );
                  await setValue(
                    "factoryContactPersonId",
                    selectedFactory?.factoryContactPersonId
                  );
                  await setValue("designation", selectedFactory?.designation);
                  await setValue("factoryEmail", selectedFactory?.factoryEmail);
                  await setValue(
                    "factoryContactNumber",
                    selectedFactory?.factoryContactNumber
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!!errors.factoryName}
                    label="Factory Name"
                    name="factoryName"
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                )}
              />
              <Box sx={{ flex: 1, margin: "0.5rem" }}>
                <TextField
                  id="factoryAddress"
                  label="Factory Address"
                  required
                  sx={{ width: "100%" }}
                  error={!!errors.factoryAddress}
                  size="small"
                  {...register("factoryAddress", { required: true })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>
              <Box sx={{ flex: 1, margin: "0.5rem" }}>
                <Autocomplete
                  {...register("factoryContactPerson", { required: true })}
                  size="small"
                  noOptionsText={
                    <>
                      <Typography variant="body2" color="inherit" gutterBottom>
                        No matching Items
                      </Typography>
                    </>
                  }
                  value={watch("factoryContactPerson")}
                  options={[
                    ...(contactPeopleData?.length ? contactPeopleData : []),
                  ]}
                  getOptionLabel={(option) => option.name || ""}
                  onChange={(_, data) => {
                    setValue("factoryContactPersonId", data.id);
                    setValue("factoryContactPerson", data);
                    setValue("factoryContactPersonName", data.name);
                  }}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id || option.name}>
                      {option.name}
                    </li>
                  )}
                  sx={{ flex: 1 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.factoryContactPerson}
                      helperText={errors.factoryContactPerson ? "Required" : ""}
                      label="Factory Contact Person"
                      name="factoryContactPerson"
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  )}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: isTablet ? "column" : "row",
              }}
            >
              <Box sx={{ flex: 1, margin: "0.5rem" }}>
                <TextField
                  id="designation"
                  label="Designation"
                  type="email"
                  required
                  sx={{ width: "100%" }}
                  error={!!errors.designation}
                  size="small"
                  {...register("designation", { required: true })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>

              <Box sx={{ flex: 1, margin: "0.5rem" }}>
                <TextField
                  id="factoryEmail"
                  label="Factory Email"
                  type="email"
                  required
                  sx={{ width: "100%" }}
                  error={!!errors.factoryEmail}
                  size="small"
                  {...register("factoryEmail", { required: true })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>
              <Box sx={{ flex: 1, margin: "0.5rem" }}>
                <TextField
                  id="factoryContactNumber"
                  label="Contact Number"
                  required
                  error={!!errors.factoryContactNumber}
                  sx={{ width: "100%" }}
                  size="small"
                  {...register("factoryContactNumber", { required: true })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                margin: "0.5rem",
              }}
            >
              <Controller
                control={control}
                name={"description"}
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
          </TabPanel>
          <TabPanel value={activeTab} index={1} dir={theme.direction}>
            <Stack>
              {!defaultValues?.audit?.questionGroups?.length && (
                <Box sx={{ padding: "1rem" }}>
                  <Alert variant="standard" severity="info">
                    No Question Groups Added
                  </Alert>
                </Box>
              )}
              {defaultValues?.audit?.questionGroups?.map((group) => (
                <AuditQuestionsSectionAccordion
                  key={group.queGroupId}
                  questionGroup={group}
                  auditAnswers={answers ?? []}
                  auditStatus={defaultValues.status}
                  submitAnAnswer={(answer) => {
                    let updatedAnswers: InternalAuditAnswerToQuestions[] =
                      Array.isArray(answers) ? answers : [];
                    const isAnswerExist = answers?.find(
                      (ans) => ans.questionId === answer.questionId
                    );
                    if (!isAnswerExist) {
                      updatedAnswers = [
                        ...(answers || []),
                        {
                          ...answer,
                          questionRecoId: Number(defaultValues.audit.id),
                          internalAuditId: defaultValues.id,
                        },
                      ];
                    } else {
                      updatedAnswers = answers?.map((ans) => {
                        if (ans.questionId === answer.questionId) {
                          return {
                            ...answer,
                            questionRecoId: Number(defaultValues.audit.id),
                            internalAuditId: defaultValues.id,
                          };
                        }
                        return ans;
                      });
                    }
                    setValue("answers", updatedAnswers);
                  }}
                />
              ))}
            </Stack>
          </TabPanel>
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
        {defaultValues.status === ScheduledInternalAuditStatus.DRAFT ? (
          <>
            <CustomButton
              variant="outlined"
              sx={{
                border: "1px solid var(--pallet-blue)",
              }}
              size="medium"
              disabled={isDraftAuditUpdating}
              endIcon={
                isDraftAuditUpdating ? <CircularProgress size={20} /> : ""
              }
              onClick={handleSubmit((data) => {
                handleUpdateInternalAudit(
                  data as Partial<ScheduledInternalAudit>,
                  "DRAFT"
                );
              })}
            >
              Update Draft
            </CustomButton>

            <CustomButton
              variant="contained"
              sx={{
                backgroundColor: "var(--pallet-blue)",
              }}
              size="medium"
              disabled={isInternalAuditUpdating}
              endIcon={
                isInternalAuditUpdating ? <CircularProgress size={20} /> : ""
              }
              onClick={handleSubmit((data) => {
                handleUpdateInternalAudit(
                  data as Partial<ScheduledInternalAudit>,
                  "SCHEDULED"
                );
              })}
            >
              Schedule Internal Audit
            </CustomButton>
          </>
        ) : (
          <>
            <CustomButton
              variant="outlined"
              sx={{
                border: "1px solid var(--pallet-blue)",
              }}
              size="medium"
              disabled={isOngoingInternalAuditUpdating}
              endIcon={
                isOngoingInternalAuditUpdating ? (
                  <CircularProgress size={20} />
                ) : (
                  ""
                )
              }
              onClick={handleSubmit((data) => {
                if (data?.answers?.length > 0) {
                  handleUpdateInternalAudit(
                    data as Partial<ScheduledInternalAudit>,
                    "ONGOING"
                  );
                } else {
                  handleUpdateInternalAudit(
                    data as Partial<ScheduledInternalAudit>,
                    "SCHEDULED"
                  );
                }
              })}
            >
              Update Internal Audit
            </CustomButton>
            <CustomButton
              variant="contained"
              sx={{
                backgroundColor: "var(--pallet-blue)",
              }}
              size="medium"
              disabled={isCompleteInternalAuditUpdating}
              endIcon={
                isCompleteInternalAuditUpdating ? (
                  <CircularProgress size={20} />
                ) : (
                  ""
                )
              }
              onClick={handleSubmit((data) => {
                handleUpdateInternalAudit(
                  data as Partial<ScheduledInternalAudit>,
                  "COMPLETED"
                );
              })}
            >
              Complete Internal Audit
            </CustomButton>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
