import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useForm } from "react-hook-form";
import CustomButton from "../../components/CustomButton";
import useIsMobile from "../../customHooks/useIsMobile";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from "@tanstack/react-query";
import { fetchDepartmentData } from "../../api/departmentApi";
import { generateRandomNumberId } from "../../util/numbers.util";
import { GrievanceNomineeDetails } from "../../api/Grievance/grievanceApi";

const AddOrEditNomineeDialog = ({
  open,
  onClose,
  onSubmit,
  defaultValues: defaultNominee,
  grievanceId,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: GrievanceNomineeDetails) => void;
  defaultValues?: GrievanceNomineeDetails;
  grievanceId?: number | null;
}) => {
  const { isMobile } = useIsMobile();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GrievanceNomineeDetails>({
    defaultValues: defaultNominee,
  });

  const { data: departmentData } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartmentData,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      fullWidth
      maxWidth={"sm"}
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
          {defaultNominee ? "Edit Nominee" : "Add Nominee"}
        </Typography>
        <IconButton
          aria-label="open drawer"
          onClick={onClose}
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
            flexDirection: "column",
            padding: "1rem",
            flex: { lg: 3, md: 1 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TextField
              required
              id="employeeId"
              label="Employee ID"
              error={!!errors.employeeId}
              size="small"
              sx={{ margin: "0.5rem" }}
              {...register("employeeId", { required: true })}
              defaultValue={defaultNominee?.employeeId || ""}
            />
            <TextField
              {...register("name", { required: true })}
              required
              id="name"
              label="Name"
              error={!!errors.name}
              size="small"
              sx={{ margin: "0.5rem" }}
              defaultValue={defaultNominee?.name || ""}
            />
            <TextField
              required
              id="designation"
              label="Designation"
              error={!!errors.designation}
              size="small"
              sx={{ margin: "0.5rem" }}
              {...register("designation", { required: true })}
              defaultValue={defaultNominee?.designation || ""}
            />
            <Autocomplete
              {...register("department", { required: true })}
              size="small"
              options={
                departmentData?.length
                  ? departmentData.map((department) => department.department)
                  : []
              }
              defaultValue={defaultNominee?.department || ""}
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
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: "1rem" }}>
        <Button onClick={onClose} sx={{ color: "var(--pallet-blue)" }}>
          Cancel
        </Button>
        <CustomButton
          variant="contained"
          sx={{
            backgroundColor: "var(--pallet-blue)",
          }}
          size="medium"
          onClick={handleSubmit((data) => {
            data.nomineeId =
              defaultNominee?.nomineeId || generateRandomNumberId();
            data.grievanceId = grievanceId || null;
            onSubmit(data);
            reset();
          })}
        >
          Add Nominee
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrEditNomineeDialog;
