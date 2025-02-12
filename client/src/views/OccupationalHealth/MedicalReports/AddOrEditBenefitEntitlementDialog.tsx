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
              {...register("benefitType", { required: true })}
              size="small"
              options={sampleMaternityBenefitTypes}
              sx={{ flex: 1, margin: "0.5rem" }}
              defaultValue={defaultValues?.benefitType}
              onChange={(e, value) => {
                console.log("e", e);
                setValue("benefitType", value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!!errors.benefitType}
                  label="Benefit Type"
                  name="benefitType"
                />
              )}
            />
            <TextField
              id="amountValue"
              label="Employee Id"
              error={!!errors.amountValue}
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("amountValue", { required: true })}
            />
            <TextField
              id="totalDaysPaid"
              label="Total Days Paid"
              error={!!errors.totalDaysPaid}
              type="number"
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("totalDaysPaid", { required: true })}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: isTablet ? "column" : "row",
            }}
          >
            <TextField
              id="amountOfFirstInstallment"
              label="Amount of First Installment"
              error={!!errors.amountOfFirstInstallment}
              type="number"
              size="small"
              sx={{
                flex: 1,
                margin: "0.5rem",
                marginTop: isTablet ? "0.5rem" : "1.4rem",
              }}
              {...register("amountOfFirstInstallment", { required: true })}
            />
            <Controller
              control={control}
              {...register("dateOfFirstInstallment", { required: true })}
              name={"dateOfFirstInstallment"}
              render={({ field }) => {
                return (
                  <Box sx={{ flex: 1, marginX: "0.5rem" }}>
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value}
                      label="Date of First Installment"
                      error={
                        errors?.dateOfFirstInstallment ? "Required" : ""
                      }
                    />
                  </Box>
                );
              }}
            />
            <TextField
              id="amountOfSecondInstallment"
              label="Amount of Second Installment"
              error={!!errors.amountOfSecondInstallment}
              type="number"
              size="small"
              sx={{
                flex: 1,
                margin: "0.5rem",
                marginTop: isTablet ? "0.5rem" : "1.4rem",
              }}
              {...register("amountOfSecondInstallment")}
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
              {...register("dateOfSecondInstallment")}
              name={"dateOfSecondInstallment"}
              render={({ field }) => {
                return (
                  <Box sx={{ flex: 1, marginX: "0.5rem" }}>
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value}
                      label="Date of Second Installment"
                    />
                  </Box>
                );
              }}
            />
            <Autocomplete
              {...register("ifBenefitReceivedSomeoneElse", {
                required: true,
              })}
              size="small"
              options={["Yes", "No"]}
              sx={{
                flex: 1,
                margin: "0.5rem",
                marginTop: isTablet ? "0.5rem" : "1.4rem",
              }}
              defaultValue={defaultValues?.ifBenefitReceivedSomeoneElse}
              onChange={(e, value) => {
                console.log("e", e);
                setValue("ifBenefitReceivedSomeoneElse", value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!!errors.ifBenefitReceivedSomeoneElse}
                  label="If Benefit Received Someone Else"
                  name="ifBenefitReceivedSomeoneElse"
                />
              )}
            />
            <TextField
              required
              id="beneficiaryName"
              label="Beneficiary Name"
              error={!!errors.beneficiaryName}
              size="small"
              sx={{
                flex: 1,
                margin: "0.5rem",
                marginTop: isTablet ? "0.5rem" : "1.4rem",
              }}
              {...register("beneficiaryName", { required: true })}
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
              id="beneficiaryAddress"
              label="Beneficiary Address"
              error={!!errors.beneficiaryAddress}
              size="small"
              sx={{ flex: 1, marginX: "0.5rem", marginTop: "1.3rem" }}
              {...register("beneficiaryAddress", { required: true })}
            />
            <TextField
              required
              id="beneficiaryTotalAmount"
              label="Beneficiary Total Amount"
              error={!!errors.beneficiaryTotalAmount}
              type="number"
              size="small"
              sx={{ flex: 1, marginX: "0.5rem", marginTop: "1.3rem" }}
              {...register("beneficiaryTotalAmount", { required: true })}
            />
            <Controller
              control={control}
              {...register("beneficiaryDate", { required: true })}
              name={"beneficiaryDate"}
              render={({ field }) => {
                return (
                  <Box sx={{ flex: 1, marginX: "0.5rem" }}>
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value}
                      label="Beneficiary Date"
                      error={errors?.beneficiaryDate ? "Required" : ""}
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
