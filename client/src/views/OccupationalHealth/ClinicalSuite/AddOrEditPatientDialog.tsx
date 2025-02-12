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
import { v4 as uuidv4 } from "uuid";
import {
  Designation,
  Gender,
  Patient,
  WorkStatus,
} from "../../../api/OccupationalHealth/patientApi";
import useIsMobile from "../../../customHooks/useIsMobile";
import {
  sampleDepartments,
  sampleDivisions,
} from "../../../api/sampleData/documentData";
import CustomButton from "../../../components/CustomButton";
import DatePickerComponent from "../../../components/DatePickerComponent";
import RichTextComponent from "../../../components/RichTextComponent";
import TimePickerComponent from "../../../components/TimePickerComponent";
import { sampleDoctorData } from "../../../api/sampleData/patientData";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: Patient;
  onSubmit?: (data: Patient) => void;
};

export default function AddOrEditPatientDialog({
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
  } = useForm<Patient>({
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

  const handleCreateDocument = (data: Patient) => {
    const submitData: Partial<Patient> = data;
    submitData.id = defaultValues?.id ?? uuidv4();
    onSubmit(submitData as Patient);
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
          {defaultValues ? "Edit Patient" : "Add a New Patient"}
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
              flex: 1,
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
                id="employeeName"
                label="Employee Name"
                error={!!errors.employeeName}
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
              <Autocomplete
                {...register("gender", { required: true })}
                size="small"
                options={Object.values(Gender)}
                defaultValue={defaultValues?.gender}
                sx={{ flex: 1, margin: "0.5rem" }}
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
              <TextField
                required
                id="age"
                label="Age"
                error={!!errors.age}
                type="number"
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("age", { required: true })}
              />
            </Box>
            <Autocomplete
              {...register("designation", { required: true })}
              size="small"
              options={Object.values(Designation)}
              defaultValue={defaultValues?.designation}
              sx={{ flex: 1, margin: "0.5rem" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!!errors.designation}
                  label="Designation"
                  name="designation"
                />
              )}
            />

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
                options={sampleDepartments?.map(
                  (department) => department.name
                )}
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
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <TextField
                id="subDepartment"
                label="Sub Department"
                error={!!errors.subDepartment}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("subDepartment")}
              />
              <Autocomplete
                {...register("workStatus", { required: true })}
                size="small"
                options={Object.values(WorkStatus)}
                defaultValue={defaultValues?.workStatus}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.workStatus}
                    label="Work Status"
                    name="workStatus"
                  />
                )}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                margin: "0.5rem",
              }}
            >
              <Controller
                control={control}
                name={"symptoms"}
                render={({ field }) => {
                  return (
                    <RichTextComponent
                      onChange={(e) => field.onChange(e)}
                      placeholder={field.value ?? "Symptoms"}
                    />
                  );
                }}
              />
            </Box>
          </Stack>
          <Stack
            sx={{
              display: "flex",
              flex: 1,
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
                {...register("checkInDate", { required: true })}
                name={"checkInDate"}
                render={({ field }) => {
                  return (
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value ? new Date(field.value) : undefined}
                      label="Check In Date"
                      error={errors?.checkInDate ? "Required" : ""}
                    />
                  );
                }}
              />
              <Controller
                control={control}
                {...register("checkInTime", { required: true })}
                name={"checkInTime"}
                render={({ field }) => {
                  return (
                    <TimePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value ? new Date(field.value) : undefined}
                      label="Check In Time"
                      error={errors?.checkInTime ? "Required" : ""}
                    />
                  );
                }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{
                marginLeft: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              Preliminary Checkup Data
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                margin: "0.5rem",
              }}
            >
              <TextField
                required
                id="bodyTemperature"
                label="Body Temperature (°C)"
                error={!!errors.bodyTemperature}
                type="number"
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("bodyTemperature", { required: true })}
              />
              <TextField
                required
                id="weight"
                label="Weight (Kg)"
                error={!!errors.weight}
                type="number"
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("weight", { required: true })}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                margin: "0.5rem",
              }}
            >
              <TextField
                required
                id="height"
                label="Height (cm)"
                error={!!errors.height}
                type="number"
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("height", { required: true })}
              />
              <TextField
                required
                id="bloodPressure"
                label="Blood Pressure (mmHg)"
                error={!!errors.bloodPressure}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("bloodPressure", { required: true })}
              />
            </Box>
            <Box sx={{ margin: "0.5rem" }}>
              <TextField
                required
                id="randomBloodSugar"
                label="Random Blood Sugar (mg/dL)"
                error={!!errors.randomBloodSugar}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("randomBloodSugar", { required: true })}
              />
            </Box>
            <Box sx={{ margin: "0.5rem" }}>
              <Autocomplete
                {...register("consultingDoctor", { required: true })}
                size="small"
                options={sampleDoctorData.map(
                  (doctor) => doctor.first_name + " " + doctor.last_name
                )}
                defaultValue={defaultValues?.consultingDoctor}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.consultingDoctor}
                    label="Consulting Doctor"
                    name="consultingDoctor"
                  />
                )}
              />
              {/* <Autocomplete
                {...register("consulting_doctor", { required: true })}
                size="small"
                options={sampleDoctorData}
                getOptionLabel={(option) =>
                  `${option.first_name} ${option.last_name}`
                }
                renderOption={(props, option) => (
                  <li
                    {...props}
                    onSelect={() => setValue("consulting_doctor", option)}
                  >
                    {`${option.first_name} ${option.last_name}`}
                  </li>
                )}
                defaultValue={defaultValues?.consulting_doctor}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.consulting_doctor}
                    label="Consulting Doctor"
                    name="consulting_doctor"
                  />
                )}
              /> */}
            </Box>
            <Box sx={{ margin: "0.5rem" }}>
              <Autocomplete
                {...register("clinicDivision", { required: true })}
                size="small"
                options={sampleDivisions?.map((division) => division.name)}
                defaultValue={defaultValues?.clinicDivision}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.clinicDivision}
                    label="Clinic Division"
                    name="clinicDivision"
                  />
                )}
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
            handleCreateDocument(data);
          })}
        >
          {defaultValues ? "Update Changes" : "Save Patient"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
