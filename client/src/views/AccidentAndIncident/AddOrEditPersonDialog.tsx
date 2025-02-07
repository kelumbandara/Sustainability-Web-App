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
import useIsMobile from "../../customHooks/useIsMobile";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import DatePickerComponent from "../../components/DatePickerComponent";
import CustomButton from "../../components/CustomButton";
import { useEffect } from "react";
import { AccidentEffectedIndividual } from "../../api/accidentAndIncidentApi";
import { genderOptions, personTypes, industryExperience } from "../../constants/accidentConstants";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: AccidentEffectedIndividual;
  onSubmit: (data: AccidentEffectedIndividual) => void;
};

export default function AddOrEditPersonDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: DialogProps) {
  const { isMobile } = useIsMobile();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AccidentEffectedIndividual>({
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    } else {
      reset();
    }
  }, [defaultValues, reset]);

  const watchPersonType = watch("personType");

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
      fullScreen={isMobile}
      maxWidth={"sm"}
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
          {defaultValues ? "Edit Person" : "Add Person"}
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
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <Autocomplete
              {...register("personType", { required: true })}
              size="small"
              options={personTypes}
              sx={{ flex: 1, margin: "0.5rem" }}
              defaultValue={defaultValues?.personType}
              onChange={(e, value) => {
                console.log("e", e);
                setValue("personType", value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!!errors.personType}
                  label="Person Type"
                  name="personType"
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
              id="employeeId"
              label="Employee Id"
              error={!!errors.employeeId}
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("employeeId")}
              disabled={watchPersonType !== "Employee"}
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
              id="name"
              label="Name"
              error={!!errors.name}
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("name", { required: true })}
            />
            <Autocomplete
              {...register("gender", { required: true })}
              size="small"
              options={genderOptions}
              sx={{ flex: 1, margin: "0.5rem" }}
              defaultValue={defaultValues?.gender}
              onChange={(e, value) => {
                console.log("e", e);
                setValue("gender", value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!!errors.gender}
                  label="Gender"
                  name="gender"
                />
              )}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              marginBottom: "0.5rem",
            }}
          >
            <TextField
              required
              id="age"
              label="Age"
              error={!!errors.age}
              size="small"
              sx={{ flex: 1, marginX: "0.5rem", marginTop: "1.3rem" }}
              {...register("age", { required: true })}
            />
            <Controller
              control={control}
              {...register("dateOfJoin", { required: true })}
              name={"dateOfJoin"}
              render={({ field }) => {
                return (
                  <DatePickerComponent
                    onChange={(e) => field.onChange(e)}
                    value={field.value}
                    label="Date of Join"
                    error={errors?.dateOfJoin ? "Required" : ""}
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
          >
            <TextField
              required
              id="employmentDuration"
              label="Employment Duration"
              error={!!errors.employmentDuration}
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("employmentDuration", { required: true })}
            />
            <Autocomplete
              {...register("industryExperience", { required: true })}
              size="small"
              options={industryExperience}
              sx={{ flex: 1, margin: "0.5rem" }}
              defaultValue={defaultValues?.industryExperience}
              onChange={(e, value) => {
                console.log("e", e);
                setValue("industryExperience", value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!!errors.industryExperience}
                  label="Industry Experience"
                  name="industryExperience"
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
              id="designation"
              label="Designation"
              error={!!errors.designation}
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("designation", { required: true })}
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
          {defaultValues ? "Update Changes" : "Add Person"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
