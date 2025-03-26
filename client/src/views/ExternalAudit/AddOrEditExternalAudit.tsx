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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Announcement, ExternalAudit } from "../../api/ExternalAudit/externalAuditApi"
import useIsMobile from "../../customHooks/useIsMobile";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import DatePickerComponent from "../../components/DatePickerComponent";
import CustomButton from "../../components/CustomButton";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDivision } from "../../api/divisionApi";
import { fetchAllDocumentType } from "../../api/documentType";
import UserAutoComplete from "../../components/UserAutoComplete";
import { fetchExternalAuditAssignee } from "../../api/userApi";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: ExternalAudit;
  onSubmit?: (data: ExternalAudit) => void;
};

export default function AddOrEditExternalAuditDialog({
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

  const { data: divisionData, isFetching: isDivisionDataFetching } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  const { data: auditType, isFetching: isAuditTypeDataFetching } =
    useQuery({
      queryKey: ["auditTypes"],
      queryFn: fetchAllDocumentType,//change this
    });

  const { data: auditCategory, isFetching: isAuditCategoryDataFetching } =
    useQuery({
      queryKey: ["auditCategory"],
      queryFn: fetchAllDocumentType,//change this
    });
  const { data: auditFirm, isFetching: isAuditFirmDataFetching } =
    useQuery({
      queryKey: ["auditCategory"],
      queryFn: fetchAllDocumentType,//change this
    });
  const { data: asigneeData, isFetching: isAssigneeDataFetching } = useQuery({
    queryKey: ["external-auditee-assignee"],
    queryFn: fetchExternalAuditAssignee,
  });

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

  const handleCreateExternalAudit = (data: ExternalAudit) => {
    const submitData: ExternalAudit = { ...data }; // Ensure data is processed if needed
    onSubmit(submitData);
    resetForm();
  };

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
          {defaultValues ? "Edit External Audit Details" : "Create a New External Audit"}
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
                options={
                  auditType?.length
                    ? auditType.map((audit) => audit.auditType)
                    : []
                }
                sx={{ flex: 1, margin: "0.5rem" }}
                defaultValue={defaultValues?.auditType}
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
                options={
                  auditCategory?.length
                    ? auditCategory.map((audit) => audit.auditCategory)
                    : []
                }
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
                options={
                  auditType?.length
                    ? auditType.map((audit) => audit.auditFirm)
                    : []
                }
                sx={{ flex: 1, margin: "0.5rem" }}
                defaultValue={defaultValues?.auditFirm}
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
                name={"auditDate"}
                render={({ field }) => {
                  return (
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value ? new Date(field.value) : undefined}
                      label="Audit Date"
                    />
                  );
                }}
              />
            </Box>
            <Box sx={{ margin: "0.5rem" }}>
              <Controller
                control={control}
                name={"approvalDate"}
                render={({ field }) => {
                  return (
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value ? new Date(field.value) : undefined}
                      label="Approval Date"
                    />
                  );
                }}
              />
            </Box>
            <Box>
              <UserAutoComplete
                name="approver"
                label="Approver"
                control={control}
                register={register}
                errors={errors}
                userData={asigneeData}
                defaultValue={defaultValues?.approver}
                required={true}
              />
            </Box>

            <Box>
              <UserAutoComplete
                name="representer"
                label="Management Representative"
                control={control}
                register={register}
                errors={errors}
                userData={asigneeData}
                defaultValue={defaultValues?.representer}
                required={true}
              />
            </Box>

            <Box sx={{ margin: "0.5rem" }}>
              <Typography
                variant="caption"
                sx={{ marginBottom: "0.1rem", color: grey[700] }}
              >
                Announcement:
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
                        value={Announcement.UN_ANNOUNCED}
                        key={Announcement.UN_ANNOUNCED}
                      >
                        <Typography variant="caption" component="div">
                          {Announcement.UN_ANNOUNCED}
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
            handleCreateExternalAudit(data);
          })}
        >
          {defaultValues ? "Update Changes" : "Create External Audit"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
