import useIsMobile from "../customHooks/useIsMobile";
import { Stack, Typography } from "@mui/material";
import { DatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { grey } from "@mui/material/colors";

function DatePickerComponent({
  value,
  onChange,
  defaultValue,
  label,
}: {
  value: Date | null;
  onChange: (value: Date) => void;
  defaultValue?: Date;
  label?: string;
}) {
  const { isMobile } = useIsMobile();
  return (
    <Stack>
      {label && (
        <Typography
          variant="body2"
          sx={{ marginBottom: "0.3rem", color: grey[700] }}
        >
          {label}
        </Typography>
      )}
      {isMobile ? (
        <MobileDatePicker
          value={value}
          onChange={onChange}
          defaultValue={defaultValue}
        />
      ) : (
        <DatePicker
          value={value}
          onChange={onChange}
          defaultValue={defaultValue}
        />
      )}
    </Stack>
  );
}

export default DatePickerComponent;
