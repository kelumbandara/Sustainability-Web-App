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
  getOptionLabel = (option) => option.label,
  getOptionValue = (option) => option.value,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: "This field is required" }}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          multiple
          limitTags={limitTags}
          id={name}
          options={options}
          disableCloseOnSelect
          getOptionLabel={getOptionLabel}
          onChange={(event, newValue) => {
            const values = newValue.map(getOptionValue);
            field.onChange(values);
            setSelectedValues?.(values);
          }}
          value={options.filter((option) =>
            selectedValues.includes(getOptionValue(option))
          )}
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