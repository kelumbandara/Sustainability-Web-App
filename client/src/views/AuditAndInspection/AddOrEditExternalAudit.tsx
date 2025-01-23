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
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { 
  sampleAuditee,
  sampleApprover,
  sampleAuditType,
  sampleAuditCategory,
} from "../../api/sampleData/internalAuditData";
import { sampleDivisions } from "../../api/sampleData/documentData";
import { ExternalAudit,createExternalAudit } from "../../api/AuditAndInspection/externalAuditApi";
import useIsMobile from "../../customHooks/useIsMobile";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { Announcement,sampleAuditFirm } from "../../api/sampleData/externalAuditData";
import { grey } from "@mui/material/colors";
import DatePickerComponent from "../../components/DatePickerComponent";
import CustomButton from "../../components/CustomButton";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: ExternalAudit;
  onSubmit?: (data: ExternalAudit) => void;
};

export default function AddOrEditExternalAudit({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: DialogProps) {
  const { isMobile, isTablet } = useIsMobile();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ExternalAudit>({
    defaultValues: defaultValues,
  });

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
  };

  const handleCreateInternalAudit = (data: ExternalAudit) => {
    console.log("Submitted form data:", data);

    console.log("Processed submission data:", data);
    ExternalAuditMutation(data);
    onSubmit(data as ExternalAudit);
    resetForm();
  };
   
  const { mutate: ExternalAuditMutation } = useMutation({
    mutationFn: createExternalAudit,
    onSuccess: () => {
      enqueueSnackbar("External Audit Schedule created successfully!", { variant: "success" });
      navigate("/audit-inspection/external-audit");
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
          {defaultValues ? "Edit Audit Details" : "Create External Audit Schedule"}
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

              <Autocomplete
                {...register("auditCategory", { required: true })}
                size="small"
                options={sampleAuditCategory?.map((auditCategory) => auditCategory.name)}
                defaultValue={defaultValues?.auditCategory}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.auditCategory}
                    label="Audit Category"
                    name="auditCategory"
                  />
                )}
              />

              <TextField
                required
                id="customer"
                label="Customer"
                error={!!errors.customer}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("customer", { required: true })}
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
                id="auditStandard"
                label="Audit Standard"
                error={!!errors.auditStandard}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("auditStandard", { required: true })}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Autocomplete
                {...register("auditFirm", { required: true })}
                size="small"
                options={sampleAuditFirm?.map((auditFirm) => auditFirm.name)}
                defaultValue={defaultValues?.auditFirm}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.auditFirm}
                    label="Audit Firm"
                    name="auditFirm"
                  />
                )}
              />

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
            <Autocomplete
              {...register("approver", { required: true })}
              size="small"
              options={sampleApprover?.map((approver) => approver.name)}
              defaultValue={defaultValues?.auditType}
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

            <Autocomplete
              {...register("representative", { required: true })}
              size="small"
              options={sampleAuditee?.map((representative) => representative.name)}
              defaultValue={defaultValues?.representative}
              sx={{ flex: 1, margin: "0.5rem" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!!errors.representative}
                  label="Management Representative"
                  name="representative"
                />
              )}
            />

            <Box sx={{ margin: "0.5rem" }}>
              <Typography
                variant="caption"
                sx={{ marginBottom: "0.1rem", color: grey[700] }}
              >
                Injury Type
              </Typography>
              <Controller
                control={control}
                name={"announcement"}
                render={({ field }) => {
                  return (
                    <ToggleButtonGroup
                      size="small"
                      {...control}
                      aria-label="Small sizes"
                      color="primary"
                      value={field.value}
                      exclusive
                      orientation="vertical"
                      fullWidth
                      onChange={(e, value) => {
                        console.log("e", e);
                        field.onChange(value);
                      }}
                    >
                      <ToggleButton
                        value={Announcement.ANNOUNCED}
                        key={Announcement.ANNOUNCED}
                      >
                        <Typography variant="caption" component="div">
                          {Announcement.ANNOUNCED}
                        </Typography>
                      </ToggleButton>
                      <ToggleButton
                        value={Announcement.SEMI_ANNOUNCED}
                        key={Announcement.SEMI_ANNOUNCED}
                      >
                        <Typography variant="caption" component="div">
                          {Announcement.SEMI_ANNOUNCED}
                        </Typography>
                      </ToggleButton>
                      <ToggleButton
                        value={Announcement.UNANNOUNCED}
                        key={Announcement.UNANNOUNCED}
                      >
                        <Typography variant="caption" component="div">
                          {Announcement.UNANNOUNCED}
                        </Typography>
                      </ToggleButton>
                    </ToggleButtonGroup>
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
          {defaultValues ? "Update Changes" : "Create External Audit"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}