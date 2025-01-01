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
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUser } from "../../api/userApi";

function RegistrationForm() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up(990));
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
      mobileNumber: null,
      name: "",
      confirmPassword: "",
    },
  });

  const userPassword = watch("password");

  const { mutate: registrationMutation, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      localStorage.setItem("token", data?.access_token);
      enqueueSnackbar("Account Created Successfully!", { variant: "success" });
      navigate("/home");
    },
    onError: (error: any) => {
      console.log(error);
      enqueueSnackbar(error?.data?.message ?? `Registration Failed`, {
        variant: "error",
      });
    },
  });

  const onRegistrationSubmit = (data: {
    email: string;
    password: string;
    mobileNumber: string;
    name: string;
    confirmPassword: string;
  }) => {
    registrationMutation(data);
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
          Create an account to access the platform
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onRegistrationSubmit)}>
        <TextField
          required
          id="name"
          label="Name"
          error={!!errors.name}
          fullWidth
          size="small"
          sx={{ marginTop: "1rem" }}
          helperText={
            errors.name && (
              <Typography
                sx={{
                  mt: "0",
                  ml: -1,
                }}
                variant="caption"
              >
                Name is required
              </Typography>
            )
          }
          {...register("name", { required: true })}
        />

        <TextField
          required
          id="email"
          label="Email Address"
          placeholder="sample@company.com"
          error={!!errors.email}
          fullWidth
          type="email"
          size="small"
          sx={{ marginTop: "1rem" }}
          helperText={
            errors.email && (
              <Typography
                sx={{
                  mt: "0",
                  ml: -1,
                }}
                variant="caption"
              >
                Email is required
              </Typography>
            )
          }
          {...register("email", { required: true })}
        />

        <TextField
          required
          id="mobileNumber"
          label="Mobile Number"
          type="tel"
          error={!!errors.mobileNumber}
          fullWidth
          size="small"
          sx={{ marginTop: "1rem" }}
          helperText={
            errors.mobileNumber && (
              <Typography
                sx={{
                  mt: "0",
                  ml: -1,
                }}
                variant="caption"
              >
                {`${
                  errors.mobileNumber.message || "Mobile number is required"
                }`}
              </Typography>
            )
          }
          {...register("mobileNumber", {
            required: true,
            validate: (value) => {
              if (isNaN(value)) {
                return "Mobile number must be a number";
              } else if (value.length < 10) {
                return "Mobile number must be at least 10 digits";
              }
              return true;
            },
          })}
        />

        <TextField
          required
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          size="small"
          fullWidth
          sx={{ marginTop: "2rem" }}
          error={!!errors.password}
          helperText={
            errors.password && (
              <Typography
                sx={{
                  mt: "0",
                  ml: -1,
                }}
                variant="caption"
              >
                Password is required
              </Typography>
            )
          }
          {...register("password", { required: true })}
        />

        <TextField
          required
          id="confirmPassword"
          label="Confirm Password"
          type={"password"}
          size="small"
          fullWidth
          helperText={
            errors.confirmPassword && (
              <Typography
                sx={{
                  mt: "0",
                  ml: -1,
                }}
                variant="caption"
              >
                Passwords do not match
              </Typography>
            )
          }
          sx={{ marginTop: "1rem" }}
          error={!!errors.confirmPassword}
          {...register("confirmPassword", {
            required: true,
            validate: (value) => value === userPassword,
          })}
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
            Create Account
          </CustomButton>
          <CustomButton
            variant="text"
            sx={{
              color: "var(--pallet-orange)",
            }}
            size="medium"
            onClick={() => navigate("/")}
          >
            Login to an existing account
          </CustomButton>
        </Box>
      </form>
    </Stack>
  );
}

export default RegistrationForm;
