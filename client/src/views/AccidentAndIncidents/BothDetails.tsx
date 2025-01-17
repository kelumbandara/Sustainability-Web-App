import React, { useState } from "react";
import { blue } from "@mui/material/colors";
import { Box, ButtonGroup, Button, Typography, Stack, Autocomplete,TextField,Popper as MuiPopper, } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import DatePickerComponent from "../../components/DatePickerComponent";
import TimePickerComponent from "../../components/TimePickerComponent";
import { styled } from "@mui/system";

import { sampleAsignee } from "../../api/sampleData/documentData";

const Popper = styled(MuiPopper)(({ theme }) => ({
  zIndex: 1300,
}));

export default function AddBothDetails({ defaultValues }) {
  const [clicked, setClicked] = useState(null);
  const [severityClicked, setSeverityClicked] = useState(null);  // Added state for Severity buttons
  const [openButtonState, setOpenButtonState] = useState({
    text: "Open",
    disabled: false,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      dueDate: null,
      dueTime: null,
    },
  });

  const buttonOnChange = (type) => {
    setClicked(type);
    console.log(`${type} button clicked`);
    setOpenButtonState({
      text: type === "First Aid" ? "Completed" : "Open",
      disabled: type === "First Aid",
    });
  };

  const severityButtonOnChange = (type) => {
    setSeverityClicked(type);  // Update severity clicked state
    console.log(`${type} severity button clicked`);
  };

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  const renderButton = (label, isSeverity = false) => (
    <Button
      sx={{
        backgroundColor: (isSeverity ? severityClicked : clicked) === label ? blue[700] : "transparent",
        color: (isSeverity ? severityClicked : clicked) === label ? "white" : "initial",
        '&:hover': {
          backgroundColor: (isSeverity ? severityClicked : clicked) === label ? blue[700] : "transparent",
        }
      }}
      onClick={() => (isSeverity ? severityButtonOnChange(label) : buttonOnChange(label))}
    >
      {label}
    </Button>
  );

  return (
    <Stack gap={3}>
      <Box>
        <Button disabled={openButtonState.disabled}>
          {openButtonState.text}
        </Button>
      </Box>

      <Controller
        control={control}
        name="dueDate"
        rules={{ required: "Due date is required" }}
        render={({ field }) => (
          <DatePickerComponent
            label="Due Date"
            value={field.value}
            onChange={field.onChange}
            error={errors?.dueDate ? "Required" : ""}
          />
        )}
      />

      <Controller
        control={control}
        name="dueTime"
        rules={{ required: "Due time is required" }}
        render={({ field }) => (
          <TimePickerComponent
            label="Due Time"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Box sx={{ width: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Typography>Injury Type:</Typography>
        <ButtonGroup orientation="vertical">
          {["First Aid", "Reportable Accident", "Non-Reportable Accident"].map((label) => renderButton(label))}
        </ButtonGroup>
      </Box>

      <Box>
        <Typography>SEVERITY:</Typography>
        <ButtonGroup orientation="horizontal">
          {["High", "Low"].map((label) => renderButton(label, true))}
        </ButtonGroup>
      </Box>

      <Autocomplete
        options={sampleAsignee?.map((division) => division.name)}
        defaultValue={defaultValues?.division}
        fullWidth
        size="small"
        PopperComponent={Popper}
        renderInput={(params) => (
          <TextField
            {...params}
            required
            error={!!errors?.division}
            // helperText={errors?.division?.message}
            label="Division"
          />
        )}
      />
    </Stack>
  );
}
