import React from "react";
import { Controller } from "react-hook-form";
import {
  Autocomplete,
  Checkbox,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";

const AutocompleteCheckbox = ({
  control,
  name,
  options = [],
  selectedValues = [],
  setSelectedValues,
  label,
  placeholder,
  limitTags,
  required = false,
  getOptionLabel = (option) => option.label,
  getOptionValue = (option) => option.value,
  style,
}: {
  control: any;
  name: string;
  options: { label: string; value: string }[];
  selectedValues?: string[];
  setSelectedValues?: (values: string[]) => void;
  label: string;
  placeholder?: string;
  limitTags?: number;
  required?: boolean;
  getOptionLabel?: (option: any) => string;
  getOptionValue?: (option: any) => string;
  style?: SxProps<Theme>;
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={required ? { required: "This field is required" } : {}}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          multiple
          limitTags={limitTags}
          id={name}
          options={options}
          sx={style}
          disableCloseOnSelect
          getOptionLabel={getOptionLabel}
          value={options.filter((option) =>
            (value || []).includes(getOptionValue(option))
          )}
          onChange={(event, newValue) => {
            const values = newValue.map(getOptionValue);
            onChange(values);
            setSelectedValues?.(values);
          }}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox style={{ marginRight: 8 }} checked={selected} />
              {getOptionLabel(option)}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              size="small"
              error={!!error}
              helperText={error?.message || ""}
            />
          )}
        />
      )}
    />
  );
};

export default AutocompleteCheckbox;
