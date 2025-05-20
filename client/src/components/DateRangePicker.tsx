import { Box, Typography } from "@mui/material";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import DatePickerComponent from "./DatePickerComponent";
import { useState } from "react";

function DateRangePicker({
  label,
  control,
  register,
  errors,
}: {
  label: string;
  control: Control<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}) {
  const [startDate, setStartDate] = useState<Date | null>(null);

  return (
    <Box
      sx={{
        margin: "0.5rem",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Controller
        control={control}
        {...register("dateRangeFrom")}
        name={"dateRangeFrom"}
        render={({ field }) => {
          return (
            <DatePickerComponent
              onChange={(e) => {
                field.onChange(e);
                setStartDate(e);
              }}
              value={field.value}
              error={errors?.dateRangeFrom ? "Required" : ""}
            />
          );
        }}
      />
      <Typography variant="caption" sx={{ marginX: "0.5rem" }}>
        {" "}
        to{" "}
      </Typography>
      <Controller
        control={control}
        {...register("dateRangeTo")}
        name={"dateRangeTo"}
        render={({ field }) => {
          return (
            <DatePickerComponent
              onChange={(e) => field.onChange(e)}
              value={field.value}
              error={errors?.dateRangeTo ? "Required" : ""}
              minDate={startDate} // This will disable dates before the start date
            />
          );
        }}
      />
    </Box>
  );
}

export default DateRangePicker;