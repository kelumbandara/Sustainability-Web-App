import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  TextField,
  Stack,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import CustomButton from "../../components/CustomButton";
import useIsMobile from "../../customHooks/useIsMobile";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  onSubmit: (data: {
    oldPassword: string;
    newPassword: string;
  }) => void;
  isSubmitting?: boolean;
};

type PasswordReset = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function PasswordResetDialog({
  open,
  handleClose,
  onSubmit,
  isSubmitting = false,
}: DialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { isTablet } = useIsMobile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PasswordReset>();

  const resetForm = () => {
    reset();
  };

  const newPassword = watch("newPassword");

  return (
    <Dialog
      open={open}
      onClose={() => {
        resetForm();
        handleClose();
      }}
      fullScreen={isTablet}
      PaperProps={{
        style: {
          backgroundColor: grey[50],
          minWidth: "500px",
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
        <Typography variant="h6">Password Reset</Typography>
        <IconButton
          onClick={() => {
            resetForm();
            handleClose();
          }}
          sx={{ color: "#024271" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack direction="column" gap={2} mt={2}>
          <TextField
            {...register("oldPassword", { required: "Old password is required" })}
            label="Old Password"
            type="password"
            fullWidth
            size="small"
            error={!!errors.oldPassword}
            helperText={errors.oldPassword?.message}
          />
          <TextField
            {...register("newPassword", { required: "New password is required" })}
            label="New Password"
            type="password"
            fullWidth
            size="small"
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />
          <TextField
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
            label="Confirm Password"
            type="password"
            fullWidth
            size="small"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: "1rem" }}>
        <Button
          onClick={() => {
            resetForm();
            handleClose();
          }}
          sx={{ color: "var(--pallet-blue)" }}
        >
          Cancel
        </Button>
        <CustomButton
          variant="contained"
          sx={{ backgroundColor: "var(--pallet-blue)" }}
          disabled={isSubmitting}
          onClick={handleSubmit((data) => {
            onSubmit({
              oldPassword: data.oldPassword,
              newPassword: data.newPassword,
            });
          })}
        >
          Reset Password
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
