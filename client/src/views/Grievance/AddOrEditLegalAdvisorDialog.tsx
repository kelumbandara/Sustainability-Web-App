import {
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
import { generateRandomNumberId } from "../../util/numbers.util";
import { GrievanceLegalAdvisorDetails } from "../../api/Grievance/grievanceApi";

const AddOrEditLegalAdvisorDialog = ({
  open,
  onClose,
  onSubmit,
  defaultValues: defaultLegalAdvisor,
  grievanceId,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: GrievanceLegalAdvisorDetails) => void;
  defaultValues?: GrievanceLegalAdvisorDetails;
  grievanceId?: number | null;
}) => {
  const { isMobile } = useIsMobile();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GrievanceLegalAdvisorDetails>({
    defaultValues: defaultLegalAdvisor,
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
          {defaultLegalAdvisor ? "Edit Legal Advisor" : "Add Legal Advisor"}
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
              {...register("name", { required: true })}
              required
              id="name"
              label="Name"
              error={!!errors.name}
              size="small"
              sx={{ margin: "0.5rem" }}
              defaultValue={defaultLegalAdvisor?.name || ""}
            />
            <TextField
              required
              id="email"
              label="Email"
              error={!!errors.email}
              size="small"
              type="email"
              sx={{ margin: "0.5rem" }}
              {...register("email", {
                required: {
                  value: true,
                  message: "Email is required",
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
              })}
              helperText={errors.email ? errors.email.message : ""}
              defaultValue={defaultLegalAdvisor?.email || ""}
            />
            <TextField
              required
              id="phone"
              label="Phone"
              error={!!errors.phone}
              size="small"
              type="tel"
              sx={{ margin: "0.5rem" }}
              {...register("phone", { required: true })}
              defaultValue={defaultLegalAdvisor?.phone || ""}
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
            data.legalAdvisorId =
              defaultLegalAdvisor?.legalAdvisorId || generateRandomNumberId();
            data.grievanceId = grievanceId || null;
            onSubmit(data);
            reset();
          })}
        >
          Add Legal Advisor
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrEditLegalAdvisorDialog;
