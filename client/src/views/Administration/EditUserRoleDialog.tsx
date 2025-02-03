import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Autocomplete,
  Box,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { useEffect } from "react";
import { sampleRoles } from "../../api/sampleData/usersSampleData";
import CustomButton from "../../components/CustomButton";
import useIsMobile from "../../customHooks/useIsMobile";
import { User } from "../../api/userApi";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: User;
  onSubmit?: (data: User) => void;
};

export default function EditUserRoleDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: DialogProps) {
  const { isTablet } = useIsMobile();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<User>({
    defaultValues: {
      role: defaultValues?.role,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    } else {
      reset();
    }
  }, [defaultValues, reset]);

  const resetForm = () => {
    reset();
  };

  const handleCreateDocument = (data: User) => {
    const submitData: Partial<User> = defaultValues;
    submitData.role = data.role;
    submitData.roleId = sampleRoles.find((role) => role.name === data.role)?.id;
    onSubmit(submitData as User);
    resetForm();
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        resetForm();
        handleClose();
      }}
      fullScreen={isTablet}
      maxWidth={isTablet ? "lg" : "lg"}
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
        <Typography variant="h6" component="div">
          {defaultValues.role ? "Edit User Role" : "Add User Role"}
        </Typography>
        <IconButton
          aria-label="open drawer"
          onClick={handleClose}
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
        <Box sx={{ flex: 1 }}>
          <Controller
            name="role"
            control={control}
            defaultValue={defaultValues?.role}
            rules={{ required: true }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                onChange={(event, newValue) => field.onChange(newValue)}
                size="small"
                options={sampleRoles?.map((option) => option.name)}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.role}
                    label="Role"
                    name="role"
                  />
                )}
              />
            )}
          />
        </Box>
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
          sx={{
            backgroundColor: "var(--pallet-blue)",
          }}
          size="medium"
          onClick={handleSubmit((data) => {
            handleCreateDocument(data);
          })}
        >
          {defaultValues ? "Update Changes" : "Save Medical Request"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
