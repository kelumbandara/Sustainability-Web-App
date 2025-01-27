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
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { useEffect } from "react";
import { BenefitAndEntitlements } from "../../../api/OccupationalHealth/maternityRegisterApi";
import { sampleMaternityBenefitTypes } from "../../../api/sampleData/maternityRegisterData";
import DatePickerComponent from "../../../components/DatePickerComponent";
import CustomButton from "../../../components/CustomButton";
import RichTextComponent from "../../../components/RichTextComponent";
import useIsMobile from "../../../customHooks/useIsMobile";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: BenefitAndEntitlements;
  onSubmit: (data: BenefitAndEntitlements) => void;
};

export default function AddOrEditBenefitEntitlementDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: DialogProps) {
  const { isTablet } = useIsMobile();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BenefitAndEntitlements>({
    defaultValues,
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

  return (
    <Dialog
      open={open}
      onClose={() => {
        resetForm();
        handleClose();
      }}
      fullWidth
      fullScreen={isTablet}
      maxWidth={"lg"}
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
          {defaultValues ? "Edit Item" : "Add Benefit and Entitlements"}
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
            flex: { lg: 3, md: 1 },
            padding: "0.5rem",
            borderRadius: "0.3rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isTablet ? "column" : "row",
            }}
          >
            <Autocomplete
              {...register("benefit_type", { required: true })}
              size="small"
              options={sampleMaternityBenefitTypes}
              sx={{ flex: 1, margin: "0.5rem" }}
              defaultValue={defaultValues?.benefit_type}
              onChange={(e, value) => {
                console.log("e", e);
                setValue("benefit_type", value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!!errors.benefit_type}
                  label="Benefit Type"
                  name="benefit_type"
                />
              )}
            />
            <TextField
              id="amount_value"
              label="Employee Id"
              error={!!errors.amount_value}
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("amount_value", { required: true })}
            />
            <TextField
              id="total_days_paid"
              label="Total Days Paid"
              error={!!errors.total_days_paid}
              type="number"
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("total_days_paid", { required: true })}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: isTablet ? "column" : "row",
            }}
          >
            <TextField
              id="amount_of_first_installment"
              label="Amount of First Installment"
              error={!!errors.amount_of_first_installment}
              type="number"
              size="small"
              sx={{
                flex: 1,
                margin: "0.5rem",
                marginTop: isTablet ? "0.5rem" : "1.4rem",
              }}
              {...register("amount_of_first_installment", { required: true })}
            />
            <Controller
              control={control}
              {...register("date_of_first_installment", { required: true })}
              name={"date_of_first_installment"}
              render={({ field }) => {
                return (
                  <Box sx={{ flex: 1, marginX: "0.5rem" }}>
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value}
                      label="Date of First Installment"
                      error={
                        errors?.date_of_first_installment ? "Required" : ""
                      }
                    />
                  </Box>
                );
              }}
            />
            <TextField
              id="amount_of_second_installment"
              label="Amount of Second Installment"
              error={!!errors.amount_of_second_installment}
              type="number"
              size="small"
              sx={{
                flex: 1,
                margin: "0.5rem",
                marginTop: isTablet ? "0.5rem" : "1.4rem",
              }}
              {...register("amount_of_second_installment")}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: isTablet ? "column" : "row",
            }}
          >
            <Controller
              control={control}
              {...register("date_of_second_installment")}
              name={"date_of_second_installment"}
              render={({ field }) => {
                return (
                  <Box sx={{ flex: 1, marginX: "0.5rem" }}>
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value}
                      label="Date of First Installment"
                    />
                  </Box>
                );
              }}
            />
            <Autocomplete
              {...register("if_benefit_received_someone_else", {
                required: true,
              })}
              size="small"
              options={["Yes", "No"]}
              sx={{
                flex: 1,
                margin: "0.5rem",
                marginTop: isTablet ? "0.5rem" : "1.4rem",
              }}
              defaultValue={defaultValues?.if_benefit_received_someone_else}
              onChange={(e, value) => {
                console.log("e", e);
                setValue("if_benefit_received_someone_else", value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!!errors.if_benefit_received_someone_else}
                  label="If Benefit Received Someone Else"
                  name="if_benefit_received_someone_else"
                />
              )}
            />
            <TextField
              required
              id="beneficiary_name"
              label="Beneficiary Name"
              error={!!errors.beneficiary_name}
              size="small"
              sx={{
                flex: 1,
                margin: "0.5rem",
                marginTop: isTablet ? "0.5rem" : "1.4rem",
              }}
              {...register("beneficiary_name", { required: true })}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: isTablet ? "column" : "row",
              marginBottom: "0.5rem",
            }}
          >
            <TextField
              required
              id="beneficiary_address"
              label="Beneficiary Address"
              error={!!errors.beneficiary_address}
              size="small"
              sx={{ flex: 1, marginX: "0.5rem", marginTop: "1.3rem" }}
              {...register("beneficiary_address", { required: true })}
            />
            <TextField
              required
              id="beneficiary_total_amount"
              label="Beneficiary Total Amount"
              error={!!errors.beneficiary_total_amount}
              type="number"
              size="small"
              sx={{ flex: 1, marginX: "0.5rem", marginTop: "1.3rem" }}
              {...register("beneficiary_total_amount", { required: true })}
            />
            <Controller
              control={control}
              {...register("beneficiary_date", { required: true })}
              name={"beneficiary_date"}
              render={({ field }) => {
                return (
                  <Box sx={{ flex: 1, marginX: "0.5rem" }}>
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value}
                      label="Beneficiary Date"
                      error={errors?.beneficiary_date ? "Required" : ""}
                    />
                  </Box>
                );
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: isTablet ? "column" : "row",
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
            onSubmit(data);
            resetForm();
            handleClose();
          })}
        >
          {defaultValues ? "Update Changes" : "Submit"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
