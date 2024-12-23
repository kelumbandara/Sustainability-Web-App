import useIsMobile from "../customHooks/useIsMobile";
import { Stack, Typography } from "@mui/material";
import { DatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { grey } from "@mui/material/colors";

function DatePickerComponent({
  value,
  onChange,
  defaultValue,
  label,
  error,
}: {
  value: Date | null;
  onChange: (value: Date) => void;
  defaultValue?: Date;
  label?: string;
  error?: string;
}) {
  const { isMobile } = useIsMobile();
  console.log("err", error);
  return (
    <Stack>
      {label && (
        <Typography
          variant="body2"
          sx={{ marginBottom: "0.1rem", color: grey[700] }}
        >
          {label}
        </Typography>
      )}
      {isMobile ? (
        <MobileDatePicker
          value={value}
          onChange={onChange}
          defaultValue={defaultValue}
          sx={{ border: error ? "1px solid var(--pallet-red)" : "" }}
        />
      ) : (
        <DatePicker
          value={value}
          onChange={onChange}
          defaultValue={defaultValue}
          sx={{ border: error ? "1px solid var(--pallet-red)" : "" }}
        />
      )}
      {error && (
        <Typography variant="caption" sx={{ color: "var(--pallet-red)" }}>
          {error}
        </Typography>
      )}
    </Stack>
  );
}

export default DatePickerComponent;
