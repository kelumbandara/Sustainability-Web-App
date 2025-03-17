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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import useIsMobile from "../../customHooks/useIsMobile";
import { updateUserType, User, UserLevel, UserRole } from "../../api/userApi";
import { getAccessRolesList } from "../../api/accessManagementApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import { useSnackbar } from "notistack";
import { fetchDepartmentData } from "../../api/departmentApi";
import { fetchJobPositionData } from "../../api/jobPositionApi";
import AutoCheckBox from "../../components/AutoCheckbox";
import { fetchFactoryData } from "../../api/factoryApi";
import { fetchResponsibleSectionData } from "../../api/responsibleSetionApi";
import AutocompleteCheckbox from "../../components/AutoCheckbox";

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
  const { data: levels, isFetching: isFetchingLevels } = useQuery<UserLevel[]>({
    queryKey: ["access-levels"],
    queryFn: getAccessRolesList,
  });
  const { data: departmentData, isFetching: isDepartmentDataFetching } =
    useQuery({
      queryKey: ["departments"],
      queryFn: fetchDepartmentData,
    });
  const { data: jobPositions, isFetched: isJobPositionsFetched } = useQuery({
    queryKey: ["jobPositions"],
    queryFn: fetchJobPositionData,
  });
  const { data: factories, isFetched: isFactoryFetched } = useQuery({
    queryKey: ["factories"],
    queryFn: fetchFactoryData,
  });
  const { data: sections, isFetched: isSectionsFetched } = useQuery({
    queryKey: ["sections"],
    queryFn: fetchResponsibleSectionData,
  });
  const { enqueueSnackbar } = useSnackbar();


  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<User>({
    defaultValues: {
      userType: defaultValues?.userType,
      userLevel: defaultValues?.userLevel,
      assignedFactory: defaultValues?.assignedFactory || [],

      ...defaultValues
    },
  });

  const [selectedFactories, setSelectedFactories] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);

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
        <Stack
          direction="column"
          gap={1}
        >
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

          <Box sx={{ flex: 1 }}>
            <Controller
              name="userLevel"
              control={control}
              defaultValue={defaultValues?.userLevel}
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  onChange={(_, data) => field.onChange(data)}
                  getOptionLabel={(option) => option?.userLevelName || ""}
                  size="small"
                  options={levels || []}
                  sx={{ flex: 1, margin: "0.5rem" }}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.userLevelName}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={!!errors.userLevel}
                      label="User Level"
                      name="userLevel"
                    />
                  )}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Controller
              name="department"
              control={control}
              defaultValue={defaultValues?.department ?? ""}
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  onChange={(event, newValue) =>
                    field.onChange(newValue)
                  }
                  size="small"
                  options={
                    departmentData?.length
                      ? departmentData.map(
                        (department) => department.department
                      )
                      : []
                  }
                  sx={{ flex: 1, margin: "0.5rem" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={!!errors.department}
                      helperText={errors.department && "Required"}
                      label="Department"
                      name="department"
                    />
                  )}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Controller
              name="jobPosition"
              control={control}
              defaultValue={defaultValues?.jobPosition ?? ""}
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  onChange={(event, newValue) =>
                    field.onChange(newValue)
                  }
                  size="small"
                  options={
                    jobPositions?.length
                      ? jobPositions.map(
                        (jobPositions) => jobPositions.jobPosition
                      )
                      : []
                  }
                  sx={{ flex: 1, margin: "0.5rem" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={!!errors.jobPosition}
                      helperText={errors.jobPosition && "Required"}
                      label="Job Position"
                      name="jobPosition"
                    />
                  )}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Controller
              name="availability"
              control={control}
              defaultValue={defaultValues?.availability ?? false}
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={["Yes", "No"]}
                  getOptionLabel={(option) => option}
                  value={field.value ? "Yes" : "No"}
                  onChange={(_, newValue) => field.onChange(newValue === "Yes")}
                  size="small"
                  sx={{ flex: 1, margin: "0.5rem" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={!!errors.availability}
                      helperText={errors.availability && "Required"}
                      label="Employee Availability"
                    />
                  )}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: 1, margin: 1 }}>
            <AutocompleteCheckbox
              control={control}
              name="assignedFactory"
              label="Select Factories"
              options={factories}
              selectedValues={selectedFactories}
              setSelectedValues={setSelectedFactories}
              getOptionLabel={(option) => option.factoryName}
              getOptionValue={(option) => option.id}
              placeholder="Choose Factories"
              limitTags={2}
            />
          </Box>

          <Box sx={{ flex: 1, margin: 1}}>
            <AutocompleteCheckbox
              control={control}
              name="responsibleSection"
              label="Select Responsible Sections"
              options={sections}
              selectedValues={selectedSections}
              setSelectedValues={setSelectedSections}
              getOptionLabel={(option) => option.sectionName}
              getOptionValue={(option) => option.id}
              placeholder="Select Sections"
              limitTags={2}
            />
          </Box>


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
