import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchDivision } from "../../../api/divisionApi";
import { fetchInternalAuditAssignee } from "../../../api/userApi";
import CustomButton from "../../../components/CustomButton";
import DatePickerComponent from "../../../components/DatePickerComponent";
import RichTextComponent from "../../../components/RichTextComponent";
import UserAutoComplete from "../../../components/UserAutoComplete";
import useIsMobile from "../../../customHooks/useIsMobile";
import AutoCheckBox from "../../../components/AutoCheckbox";
import {
  createDraftScheduledInternalAudit,
  createScheduledInternalAudit,
  getContactPersonList,
  getFactoryList,
  getInternalAuditFormsList,
  getProcessTypeList,
  InternalAuditType,
  ScheduledInternalAudit,
  SupplierType,
} from "../../../api/AuditAndInspection/internalAudit";
import { fetchDepartmentData } from "../../../api/departmentApi";
import SwitchButton from "../../../components/SwitchButton";
import queryClient from "../../../state/queryClient";
import { useSnackbar } from "notistack";
import {
  AddNewFactoryButton,
  AddNewFactoryDialog,
} from "./AddNewFactoryDialog";
import {
  AddNewProcessTypeButton,
  AddNewProcessTypeDialog,
} from "./AddNewProcessTypeDialog";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
};

export default function AddScheduledInternalAudit({
  open,
  handleClose,
}: DialogProps) {
  const { isMobile, isTablet } = useIsMobile();
  const { enqueueSnackbar } = useSnackbar();
  const [openAddNewFactoryDialog, setOpenAddNewFactoryDialog] = useState(false);
  const [openAddNewProcessTypeDialog, setOpenAddNewProcessTypeDialog] =
    useState(false);

  const { data: internalAuditFormsData } = useQuery({
    queryKey: ["internal-audit-forms"],
    queryFn: getInternalAuditFormsList,
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<ScheduledInternalAudit>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const resetForm = () => {
    reset();
  };

  const { data: factoryData } = useQuery({
    queryKey: ["factories"],
    queryFn: getFactoryList,
  });

  const { data: processTypesData } = useQuery({
    queryKey: ["process-types"],
    queryFn: getProcessTypeList,
  });

  const { data: divisionData } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  const { data: departmentData } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartmentData,
  });

  const { data: contactPeopleData } = useQuery({
    queryKey: ["contact-people"],
    queryFn: getContactPersonList,
  });

  const { data: assigneeData } = useQuery({
    queryKey: ["internal-audit-assignee"],
    queryFn: fetchInternalAuditAssignee,
  });

  const handleSubmitInternalAudit = (
    data: ScheduledInternalAudit,
    isDraft: boolean
  ) => {
    const submitData: Partial<ScheduledInternalAudit> = {
      division: data.division,
      auditId: data.audit?.id,
      auditType: data.auditType,
      department: data.department,
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

    if (isDraft) {
      createDraftInternalScheduleAuditMutation(
        submitData as ScheduledInternalAudit
      );
    } else {
      createInternalScheduleAuditMutation(submitData as ScheduledInternalAudit);
    }
  };

  const {
    mutate: createInternalScheduleAuditMutation,
    isPending: isScheduledAuditPending,
  } = useMutation({
    mutationFn: createScheduledInternalAudit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-internal-audit"] });
      enqueueSnackbar("Internal Audit Scheduled Successfully!", {
        variant: "success",
      });
      resetForm();
      handleClose();
    },
    onError: () => {
      enqueueSnackbar(`Internal Audit Schedule Failed`, {
        variant: "error",
      });
    },
  });

  const {
    mutate: createDraftInternalScheduleAuditMutation,
    isPending: isDraftAuditCreating,
  } = useMutation({
    mutationFn: createDraftScheduledInternalAudit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["scheduled-internal-audit"],
      });
      enqueueSnackbar("Internal Audit Drafted Successfully!", {
        variant: "success",
      });
      resetForm();
      handleClose();
    },
    onError: () => {
      enqueueSnackbar(`Internal Audit Draft Failed`, {
        variant: "error",
      });
    },
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
          Schedule Internal Audit
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
          <Stack
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
                flexDirection: isMobile ? "column" : "row",
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
                  options={departmentData || []}
                  selectedValues={getValues("department")}
                  setSelectedValues={(value) => setValue("department", value)}
                  getOptionLabel={(option) => option.department}
                  getOptionValue={(option) => option.id}
                  placeholder="Choose Departments"
                  limitTags={10}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
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
                    flexDirection: isMobile ? "column" : "row",
                  }}
                >
                  <Autocomplete
                    {...register("supplierType", { required: true })}
                    size="small"
                    options={Object.values(SupplierType)}
                    sx={{ flex: 1, margin: "0.5rem" }}
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
                      helperText={errors.higgId ? "Required" : ""}
                      sx={{ width: "100%" }}
                      size="small"
                      {...register("higgId")}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                  }}
                >
                  <Box sx={{ flex: 1, margin: "0.5rem" }}>
                    <TextField
                      id="zdhcId"
                      label="ZDHC Id"
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
                              (category) => category.processType
                            )
                          : []),
                        "$ADD_NEW_PROCESS_TYPE",
                      ]}
                      renderOption={(props, option) => (
                        <>
                          {option === "$ADD_NEW_PROCESS_TYPE" ? (
                            <AddNewProcessTypeButton
                              {...props}
                              onMouseDown={() => {
                                setOpenAddNewProcessTypeDialog(true);
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
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!errors.processType}
                          helperText={errors.processType ? "Required" : ""}
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
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Autocomplete
                {...register("factoryName", { required: true })}
                size="small"
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
                  helperText={errors.factoryAddress ? "Required" : ""}
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
                  value={watch("factoryContactPerson") || null}
                  options={[
                    ...(contactPeopleData?.length ? contactPeopleData : []),
                  ]}
                  getOptionLabel={(option) => option.name || ""}
                  onChange={(_, data) => {
                    setValue("factoryContactPersonId", data?.id || null); // Handle null case
                    setValue("factoryContactPerson", data || null);
                    setValue("factoryContactPersonName", data?.name || "");
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
                flexDirection: isMobile ? "column" : "row",
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
                  helperText={errors.designation ? "Required" : ""}
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
                  helperText={errors.factoryEmail ? "Required" : ""}
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
                  helperText={errors.factoryContactNumber ? "Required" : ""}
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

            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            ></Box>
          </Stack>
          <Stack
            sx={{
              display: "flex",
              flex: { lg: 1, md: 1 },
              flexDirection: "column",
              backgroundColor: "#fff",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              padding: "0.5rem",
              borderRadius: "0.3rem",
              marginY: isTablet ? "0.5rem" : 0,
              marginLeft: isTablet ? 0 : "0.5rem",
              height: "fit-content",
            }}
          >
            <Box sx={{ margin: "0.5rem" }}>
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
            <Box sx={{ flex: 1 }}>
              <UserAutoComplete
                name="auditee"
                label="Auditee"
                control={control}
                register={register}
                errors={errors}
                userData={assigneeData}
                required={true}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <UserAutoComplete
                name="approver"
                label="Approver"
                control={control}
                register={register}
                errors={errors}
                userData={assigneeData}
                required={true}
              />
            </Box>
            <Box sx={{ margin: "0.5rem" }}>
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
          </Stack>
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
          variant="outlined"
          sx={{
            border: "1px solid var(--pallet-blue)",
          }}
          size="medium"
          disabled={isDraftAuditCreating}
          endIcon={isDraftAuditCreating ? <CircularProgress size={20} /> : null}
          onClick={handleSubmit((data) => {
            handleSubmitInternalAudit(data, true);
          })}
        >
          Save Draft
        </CustomButton>
        <CustomButton
          variant="contained"
          sx={{
            backgroundColor: "var(--pallet-blue)",
          }}
          size="medium"
          disabled={isScheduledAuditPending}
          endIcon={
            isScheduledAuditPending ? <CircularProgress size={20} /> : null
          }
          onClick={handleSubmit((data) => {
            handleSubmitInternalAudit(data, false);
          })}
        >
          Schedule Internal Audit
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
