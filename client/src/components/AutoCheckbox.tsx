import React from "react";
import { Controller } from "react-hook-form";
import { Autocomplete, Checkbox, TextField } from "@mui/material";

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
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={required ? { required: "Required" } : {}}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          multiple
          limitTags={limitTags}
          id={name}
          options={options}
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
