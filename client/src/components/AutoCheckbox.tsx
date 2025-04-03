import React from "react";
import { Controller, Control } from "react-hook-form";
import { Autocomplete, Checkbox, TextField } from "@mui/material";

interface OptionType {
  divisionName: string; // Add this
  label?: string; // Optional if not needed
  value?: string | number; // Optional if not needed
}

interface AutocompleteCheckboxProps {
  control: Control<any>;
  name: string;
  options: OptionType[];
  selectedValues?: (string | number)[];
  setSelectedValues?: (values: (string | number)[]) => void;
  label: string;
  placeholder?: string;
  limitTags?: number;
  required?: boolean;
  getOptionLabel?: (option: OptionType) => string;
  getOptionValue?: (option: OptionType) => string | number;
}

const AutocompleteCheckbox: React.FC<AutocompleteCheckboxProps> = ({
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
      rules={required ? { required: "This field is required" } : {}}
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
