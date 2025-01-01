import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import companyLogo from "../../assets/company-logo.jpg";
import groupLogo from "../../assets/group-logo.png";
import { useForm } from "react-hook-form";
import CustomButton from "../../components/CustomButton";
import LoginIcon from "@mui/icons-material/Login";
import ForgotPasswordDialog from "./ForgotPasswordDialog";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../api/userApi";

function LoginForm() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up(990));
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showPassword, setShowPassword] = useState(false);
  const [openForgotPasswordDialog, setOpenForgotPasswordDialog] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      localStorage.setItem("token", data?.access_token);
      enqueueSnackbar("Welcome Back!", { variant: "success" });
      navigate("/home");
    },
    onError: () => {
      enqueueSnackbar(`Login Failed`, {
        variant: "error",
      });
    },
  });

  const onLoginSubmit = (data: { email: string; password: string }) => {
    loginMutation(data);
  };

  return (
    <Stack
      spacing={2}
      sx={{
        height: isMdUp ? "100vh" : "auto",
        justifyContent: "center",
        margin: "2.5rem",
        marginBottom: isMdUp ? "2.5rem" : "22vh",
      }}
    >
      <Box>
        <img src={companyLogo} alt="logo" height={"65em"} />
        <img
          src={groupLogo}
          alt="logo"
          style={{ marginLeft: "1rem" }}
          height={"45em"}
        />
      </Box>
      <Box>
        <Typography variant={"body2"}>
          Please sign-in to your account using your credentials
          <br /> Don't have an account?{" "}
          <span
            style={{ color: "var(--pallet-blue)", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Sign Up Here
          </span>
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onLoginSubmit)}>
        <TextField
          required
          id="email"
          label="Email Address"
          placeholder="sample@company.com"
          error={!!errors.email}
          fullWidth
          type="email"
          size="small"
          sx={{ marginTop: "0.5rem" }}
          {...register("email", { required: true })}
        />

        <TextField
          required
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          size="small"
          fullWidth
          sx={{ marginTop: "1rem" }}
          error={!!errors.password}
          {...register("password", { required: true })}
        />

        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                size="small"
              />
            }
            label="Show Password"
            sx={{
              "& .MuiTypography-body1": {
                fontSize: "0.85rem",
              },
              marginTop: "0.5rem",
            }}
          />
        </Box>

        <Box
          sx={{
            marginTop: "1.6rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <CustomButton
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "var(--pallet-blue)",
            }}
            size="medium"
            disabled={isPending}
            startIcon={
              isPending ? (
                <CircularProgress color="inherit" size={"1rem"} />
              ) : (
                <LoginIcon />
              )
            }
          >
            Log In
          </CustomButton>
          <CustomButton
            variant="text"
            sx={{
              color: "var(--pallet-orange)",
            }}
            size="medium"
            onClick={() => setOpenForgotPasswordDialog(true)}
          >
            Forgot Password
          </CustomButton>
        </Box>
      </form>
      <ForgotPasswordDialog
        open={openForgotPasswordDialog}
        handleClose={() => setOpenForgotPasswordDialog(false)}
      />
    </Stack>
  );
}

export default LoginForm;
