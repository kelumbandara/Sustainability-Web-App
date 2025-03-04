import React from "react";
import { Controller } from "react-hook-form";
import { Autocomplete, Checkbox, TextField } from "@mui/material";

const AutoCheckBox = ({
  control,
  name,
  options,
  selectedValues,
  setSelectedValues,
  label,
  placeholder,
  limitTags,
  error,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: "This field is required" }} // Add validation here
      render={({ field }) => (
        <Autocomplete
          {...field}
          multiple
          limitTags={limitTags}
          id={`${name}`}
          options={options}
          disableCloseOnSelect
          getOptionLabel={(option) => option.factoryName}
          onChange={(event, newValue) => {
            const selectedFactoryNames = newValue.map(
              (item) => item.factoryName
            );
            field.onChange(selectedFactoryNames);
            setSelectedValues(selectedFactoryNames);
          }}
          value={options?.filter((option) =>
            selectedValues.includes(option.factoryName)
          )}
          renderOption={(props, option, { selected }) => {
            const { key, ...optionProps } = props;
            return (
              <li key={key} {...optionProps}>
                <Checkbox style={{ marginRight: 8 }} checked={selected} />
                {option.factoryName}
              </li>
            );
          }}
          sx={{ marginTop: "1rem" }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              size="small"
              error={error} // Pass error to TextField
              helperText={error ? "This field is required" : ""}
            />
          )}
        />
      )}
    />
  );
};

export default AutoCheckBox;
