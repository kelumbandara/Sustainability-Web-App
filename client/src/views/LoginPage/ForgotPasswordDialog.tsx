import * as React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword, otpVerification } from "../../api/userApi";
import { useSnackbar } from "notistack";
import theme from "../../theme";

function ForgotPasswordDialog({ open, handleClose }: { open: boolean; handleClose: () => void }) {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { enqueueSnackbar } = useSnackbar();
  const [emailDisabled, setEmailDisabled] = React.useState(false);
  const [showOTPField, setShowOTPField] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const { mutate: forgotPasswordMutation, isPending: isForgotPasswordPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      enqueueSnackbar("OTP sent to your email", { variant: "success" });
      setEmailDisabled(true);
      setShowOTPField(true);
    },
    onError: () => {
      enqueueSnackbar("OTP sending failed", { variant: "error" });
    },
  });

  const { mutate: otpVerificationMutation, isPending: isOtpVerificationPending } = useMutation({
    mutationFn: otpVerification,
    onSuccess: () => {
      enqueueSnackbar("OTP Verified Successfully", { variant: "success" });
      setEmailDisabled(true);
      setShowOTPField(false);
      handleClose();
    },
    onError: () => {
      enqueueSnackbar("OTP Expired or Invalid", { variant: "error" });
    },
  });

  const onSubmit = (data: { email: string; otp?: string }) => {
    if (!showOTPField) {
      forgotPasswordMutation({ email: data.email });
    } else {
      otpVerificationMutation({ email: data.email, otp: data.otp });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={isMobile}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Don't Worry</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#525252" }}>
            We are here to help you recover your password. Enter the email
            associated with your account, and we'll send an email with instructions
            to reset your password.
          </Typography>

          {/* Email Input */}
          <TextField
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
            autoFocus
            required
            margin="dense"
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            size="small"
            sx={{ marginTop: "1rem" }}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={emailDisabled}
            onBlur={() => trigger("email")}
          />
          {showOTPField && (
            <TextField
              {...register("otp", {
                required: "OTP is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Enter a valid 6-digit OTP",
                },
              })}
              autoFocus
              required
              margin="dense"
              id="otp"
              name="otp"
              label="Enter OTP"
              type="text"
              fullWidth
              variant="outlined"
              size="small"
              sx={{ marginTop: "1rem" }}
              error={!!errors.otp}
              helperText={errors.otp?.message}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ marginBottom: "0.5rem", marginRight: "0.5rem" }}>
          <Button
            onClick={() => {
              setEmailDisabled(false);
              setShowOTPField(false);
              reset();
              handleClose();
            }}
            disabled={isForgotPasswordPending || isOtpVerificationPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isForgotPasswordPending || isOtpVerificationPending || isSubmitting}
          >
            {isForgotPasswordPending || isSubmitting
              ? "Submitting..."
              : showOTPField
                ? "Verify OTP"
                : "Submit"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ForgotPasswordDialog;
