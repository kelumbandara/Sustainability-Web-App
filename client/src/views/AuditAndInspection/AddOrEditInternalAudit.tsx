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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { 
  InternalAudit,
  InternalAuditStatus,
  createAudit,
} from "../../api/AuditAndInspection/internalAuditApi";

import { 
  sampleAuditee,
  sampleApprover,
  sampleAuditTitle,
  sampleAuditType,
  sampleFactoryName,
  sampleProcessType,
  sampleSupplierType,
} from "../../api/sampleData/internalAuditData";
import useIsMobile from "../../customHooks/useIsMobile";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { sampleDivisions,sampleDepartments } from "../../api/sampleData/documentData";
import RichTextComponent from "../../components/RichTextComponent";
import { grey } from "@mui/material/colors";
import DatePickerComponent from "../../components/DatePickerComponent";
import SwitchButton from "../../components/SwitchButton";
import CustomButton from "../../components/CustomButton";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";


type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: InternalAudit;
  onSubmit?: (data: InternalAudit) => void;
};

export default function AddOrEditInternalAuditDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: DialogProps) {
  const { isMobile, isTablet } = useIsMobile();
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<InternalAudit>({
    defaultValues: defaultValues,
  });

  const isNotSupplier = watch("isNotSupplier");
  console.log("form values", defaultValues);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
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

  const handleCreateInternalAudit = (data: InternalAudit) => {
    console.log("Submitted form data:", data);
    const { isNotSupplier, supplierType, factoryLiNo, higgId, zdhcId, processType, ...rest } = data;
    const submitData: Partial<InternalAudit> = {
      ...rest,
      id: defaultValues?.id ?? uuidv4(),
    };
    if (isNotSupplier) {
      submitData.isNotSupplier = true;
      submitData.supplierType = supplierType;
      submitData.factoryLiNo = factoryLiNo;
      submitData.higgId = higgId;
      submitData.zdhcId = zdhcId;
      submitData.processType = processType;
    } else {
      submitData.isNotSupplier = false;
    }
    console.log("Processed submission data:", submitData);
    internalAuditMutation(submitData);
    onSubmit(submitData as InternalAudit);
    resetForm();
  };
   
  const { mutate: internalAuditMutation } = useMutation({
    mutationFn: createAudit,
    onSuccess: () => {
      enqueueSnackbar("Internal Audit created successfully!", { variant: "success" });
      navigate("/audit-inspection/internal-audit");
    },
    onError: () => {
      enqueueSnackbar("Create Internal Audit Failed", { variant: "error" });
    },
  });

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
      <DialogTitle
        sx={{
          paddingY: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" component="div">
          {defaultValues ? "Edit Document Details" : "Create a New Audit Schedule"}
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
                alignItems: "flex-end",
                flexDirection: "column",
                margin: "0.5rem",
              }}
            >
              <Typography variant="body2" component="div">
                <b>Date</b>
              </Typography>
              <Typography variant="body2" component="div">
                {new Date().toDateString()}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Autocomplete
                {...register("division", { required: true })}
                size="small"
                options={sampleDivisions?.map((division) => division.name)}
                defaultValue={defaultValues?.division}
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
              <Autocomplete
                {...register("department", { required: true })}
                size="small"
                options={sampleDepartments?.map((department) => department.name)}
                defaultValue={defaultValues?.department}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.department}
                    label="Department"
                    name="department"
                  />
                )}
              />
              <Autocomplete
                {...register("auditTitle", { required: true })}
                size="small"
                options={sampleAuditTitle?.map((auditTitle) => auditTitle.name)}
                defaultValue={defaultValues?.auditTitle}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.auditTitle}
                    label="Audit Title"
                    name="auditTitle"
                  />
                )}
              /> 
              <Autocomplete
                {...register("auditType", { required: true })}
                size="small"
                options={sampleAuditType?.map((auditType) => auditType.name)}
                defaultValue={defaultValues?.auditType}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.auditType}
                    label="Audit Type"
                    name="auditType"
                  />
                )}
              />              
            </Box>

            <Box sx={{ margin: "0.5rem" }}>
              <Controller
                control={control}
                name={"isNotSupplier"}
                render={({ field }) => {
                  return (
                    <SwitchButton
                      label="Is the audit scheduled for a supplier"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  );
                }}
              />
            </Box>
            
            {isNotSupplier ? (
              <Stack
                sx={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                  gridTemplateRows: isMobile ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                }}
              >
        
                <Autocomplete
                  {...register("supplierType", { required: true })}
                  size="small"
                  options={sampleSupplierType?.map((supplierType) => supplierType.name)}
                  defaultValue={defaultValues?.supplierType}
                  sx={{ flex: 1, margin: "0.5rem" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={!!errors.supplierType}
                      label="Supplier Type"
                      name="supplierType"
                    />
                  )}
                />
                <TextField
                  required
                  id="factoryLiNo"
                  label="Factory Licence Number"
                  error={!!errors.factoryAddress}
                  size="small"
                  sx={{ flex: 1, margin: "0.5rem" }}
                  {...register("factoryLiNo", { required: true })}
                />
                <TextField
                  required
                  id="higgId"
                  label="HIGG ID"
                  error={!!errors.factoryAddress}
                  size="small"
                  sx={{ flex: 1, margin: "0.5rem" }}
                  {...register("higgId", { required: true })}
                />
                <TextField
                  required
                  id="zdhcId"
                  label="ZDHC ID"
                  error={!!errors.factoryAddress}
                  size="small"
                  sx={{ flex: 1, margin: "0.5rem" }}
                  {...register("zdhcId", { required: true })}
                />
                <Autocomplete
                  {...register("processType", { required: true })}
                  size="small"
                  options={sampleProcessType?.map((processType) => processType.name)}
                  defaultValue={defaultValues?.processType}
                  sx={{ flex: 1, margin: "0.5rem" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={!!errors.processType}
                      label="Process Type"
                      name="processType"
                    />
                  )}
                />
              </Stack>
            ) : null}

            <Stack
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gridTemplateRows: isMobile ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
              }}
            >
              <Autocomplete
                {...register("factoryName", { required: true })}
                size="small"
                options={sampleFactoryName?.map((factoryName) => factoryName.name)}
                defaultValue={defaultValues?.factoryName}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.factoryName}
                    label="Factory Name"
                    name="factoryName"
                  />
                )}
              />
              <TextField
                required
                id="factoryAddress"
                label="Factory Address"
                error={!!errors.factoryAddress}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("factoryAddress", { required: true })}
              />
              <TextField
                required
                id="factoryContact"
                type="tel"
                label="Factory Contact"
                error={!!errors.factoryContact}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("factoryContact", {
                  required: "Factory Contact is required",
                  validate: (value: string) => {
                    if (isNaN(Number(value))) {
                      return "Mobile number must be a number";
                    } else if (value.length < 10) {
                      return "Mobile number must be at least 10 digits";
                    }
                    return true;
                  },
                })}
              />
              <TextField
                id="designation"
                label="Designation"
                error={!!errors.designation}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("designation")}
              />
              <TextField
                required
                id="email"
                type="email"
                label="E-mail"
                error={!!errors.email}
                helperText={errors.email?.message} // Display validation error messages
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("email", {
                  required: "Email is required", // Custom error message for required field
                  validate: (value: string) =>
                    /^\S+@\S+\.\S+$/.test(value) || "Enter a valid email address", // Regex for email validation
                })}
              />
              <TextField
                id="contactNumber"
                label="Contact Number"
                error={!!errors.contactNumber}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("contactNumber", {
                  required: "Contact number is required",
                  validate: (value: string) => {
                    if (isNaN(Number(value))) {
                      return "Mobile number must be a number";
                    } else if (value.length < 10) {
                      return "Mobile number must be at least 10 digits";
                    }
                    return true;
                  },
                })}
              />
            </Stack>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
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
                      placeholder="description"
                    />
                  );
                }}
              />
            </Box>
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
                {...register("auditDate", { required: true })}
                name={"auditDate"}
                render={({ field }) => {
                  return (
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value}
                      label="Audit Date"
                      error={errors?.auditDate ? "Required" : ""}
                    />
                  );
                }}
              />
            </Box>
            <Autocomplete
              {...register("auditee", { required: true })}
              size="small"
              options={sampleAuditee?.map((auditee) => auditee.name)}
              defaultValue={defaultValues?.auditee}
              sx={{ flex: 1, margin: "0.5rem" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!!errors.auditee}
                  label="Auditee"
                  name="auditee"
                />
              )}
            />
            <Autocomplete
              {...register("approver", { required: true })}
              size="small"
              options={sampleApprover?.map((approver) => approver.name)}
              defaultValue={defaultValues?.approver}
              sx={{ flex: 1, margin: "0.5rem" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!!errors.approver}
                  label="Approver"
                  name="approver"
                />
              )}
            />
            <Box sx={{ margin: "0.5rem" }}>
              <Controller
                control={control}
                {...register("dateApproval", { required: true })}
                name={"dateApproval"}
                render={({ field }) => {
                  return (
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value}
                      label="Date For Approval"
                      error={errors?.dateApproval ? "Required" : ""}
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
          variant="contained"
          sx={{
            backgroundColor: "var(--pallet-blue)",
          }}
          size="medium"
          onClick={handleSubmit((data) => {
            handleCreateInternalAudit(data);
          })}
        >
          {defaultValues ? "Update Changes" : "Create Audit Schedule"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
