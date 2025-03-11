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
import CustomButton from "../../components/CustomButton";
import useIsMobile from "../../customHooks/useIsMobile";
import { updateUserType, User, UserRole } from "../../api/userApi";
import { getAccessRolesList } from "../../api/accessManagementApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import { useSnackbar } from "notistack";

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
  const { data: roles, isFetching: isFetchingRoles } = useQuery<UserRole[]>({
    queryKey: ["access-roles"],
    queryFn: getAccessRolesList,
  });
  const { enqueueSnackbar } = useSnackbar();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<User>({
    defaultValues: {
      userType: defaultValues?.userType,
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

  const { mutate: updateUserRoleMutation } = useMutation({
    mutationFn: updateUserType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      resetForm();
      handleClose();
      enqueueSnackbar("User Role Updated Successfully!", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar(`User Role Update Failed`, {
        variant: "error",
      });
    },
  });

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
            name="userType"
            control={control}
            defaultValue={defaultValues?.userType}
            rules={{ required: true }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                onChange={(_, data) => field.onChange(data)}
                getOptionLabel={(option) => option?.userType || ""}
                size="small"
                options={roles || []}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.userType}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.userType}
                    label="Role"
                    name="userType"
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
            console.log(data);
            updateUserRoleMutation({
              id: defaultValues?.id,
              userTypeId: data.userType?.id,
            });
          })}
        >
          {defaultValues ? "Update Changes" : "Assign Role"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
