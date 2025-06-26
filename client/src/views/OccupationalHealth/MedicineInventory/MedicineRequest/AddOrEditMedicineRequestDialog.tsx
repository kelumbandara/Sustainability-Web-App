import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Autocomplete,
  Box,
  CircularProgress,
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
import { v4 as uuidv4 } from "uuid";
import { MedicineRequest } from "../../../../api/medicineRequestApi";
import useIsMobile from "../../../../customHooks/useIsMobile";
import CustomButton from "../../../../components/CustomButton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createMedicineName, fetchMedicineList, Medicine } from "../../../../api/OccupationalHealth/medicineNameApi";
import { fetchDivision } from "../../../../api/divisionApi";
import {
  fetchAllUsers,
  fetchMedicineRequestAssignee,
} from "../../../../api/userApi";
import UserAutoComplete from "../../../../components/UserAutoComplete";
import AddIcon from "@mui/icons-material/Add";
import queryClient from "../../../../state/queryClient";
import { enqueueSnackbar } from "notistack";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: MedicineRequest;
  onSubmit?: (data: MedicineRequest) => void;
};

export default function AddOrEditMedicineRequestDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: DialogProps) {
  const { isTablet } = useIsMobile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<MedicineRequest>({
    defaultValues,
  });

  const approver = watch("approver");

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

  const handleCreateDocument = (data: MedicineRequest) => {
    const submitData: Partial<MedicineRequest> = data;
    submitData.id = defaultValues?.id ?? uuidv4();
    submitData.approverId = approver?.id ?? defaultValues?.approverId;
    submitData.referenceNumber = defaultValues?.referenceNumber ?? uuidv4();
    submitData.requestDate =
      defaultValues?.requestDate ?? new Date().toDateString();
    submitData.status = defaultValues?.status ?? "Approved";
    submitData.createdAt =
      defaultValues?.createdAt ?? new Date().toDateString();

    onSubmit(submitData as MedicineRequest);
    resetForm();
  };

  const { data: medicineData, isFetching: isDoctorDataFetching } = useQuery({
    queryKey: ["medicine"],
    queryFn: fetchMedicineList,
  });

  const { data: divisionData, isFetching: isDivisionDataFetching } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  const { data: userData, isFetching: isUserDataFetching } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  const { data: asigneeData, isFetching: isAssigneeDataFetching } = useQuery({
    queryKey: ["medicine-assignee"],
    queryFn: fetchMedicineRequestAssignee,
  });

  const [addNewMedicineDialogOpen, setAddNewMedicineDialogOpen] = useState(false);

  const AddNewMedicineButton = (props) => (
    <li
      {...props}
      variant="contained"
      style={{
        backgroundColor: "var(--pallet-lighter-blue)",
        color: "var(--pallet-blue)",
        textTransform: "none",
        margin: "0.5rem",
        borderRadius: "0.3rem",
        display: "flex",
        flexDirection: "row",
      }}
      size="small"
      // onClick closes the menu
      onMouseDown={() => {
        setAddNewMedicineDialogOpen(true);
      }}
    >
      <AddIcon />
      <Typography variant="body2" component="div">
        Add a new Medicine
      </Typography>
    </li>
  );

  const AddNewMedicineDialog = () => {
    const { register, handleSubmit } = useForm<Medicine>({});
    const {
      mutate: addNewMedicineMutation,
      isPending: isAddNewJobPositionMutation,
    } = useMutation({
      mutationFn: createMedicineName,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["medicine"],
        });
        enqueueSnackbar("Medicine Created Successfully!", {
          variant: "success",
        });
        reset();
        setAddNewMedicineDialogOpen(false);
      },
      onError: () => {
        enqueueSnackbar(`Medicine Created Failed`, {
          variant: "error",
        });
      },
    });

    const handleCreateMedicine = (data: Medicine) => {
      addNewMedicineMutation(data);
    };
    

    return (
      <Dialog
        open={addNewMedicineDialogOpen}
        onClose={() => setAddNewMedicineDialogOpen(false)}
        fullWidth
        maxWidth="sm"
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
            Add a New Medicine
          </Typography>
          <IconButton
            aria-label="open drawer"
            onClick={() => setAddNewMedicineDialogOpen(false)}
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
            }}
            gap={1}
          >
            <TextField
              {...register("medicineName", { required: true })}
              required
              id="medicineName"
              label="Medicine Name"
              size="small"
              fullWidth
              sx={{ marginBottom: "0.5rem" }}
            />
            <TextField
              {...register("genericName", { required: true })}
              required
              id="genericName"
              label="Generic Name"
              size="small"
              fullWidth
              sx={{ marginBottom: "0.5rem" }}
            />
            <TextField
              {...register("dosageStrength", { required: true })}
              required
              id="dosageStrength"
              label="Dosage Strength"
              size="small"
              fullWidth
              sx={{ marginBottom: "0.5rem" }}
            />
            <TextField
              {...register("form", { required: true })}
              required
              id="form"
              label="Form"
              size="small"
              fullWidth
              sx={{ marginBottom: "0.5rem" }}
            />
            <TextField
              {...register("medicineType", { required: true })}
              required
              id="medicineType"
              label="Medicine Type"
              size="small"
              fullWidth
              sx={{ marginBottom: "0.5rem" }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ padding: "1rem" }}>
          <Button
            onClick={() => setAddNewMedicineDialogOpen(false)}
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
            disabled={isAddNewJobPositionMutation}
            endIcon={
              isAddNewJobPositionMutation ? (
                <CircularProgress size={20} />
              ) : null
            }
            onClick={handleSubmit(handleCreateMedicine)}
          >
            Add New Medicine
          </CustomButton>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        resetForm();
        handleClose();
      }}
      fullScreen={isTablet}
      maxWidth={isTablet ? "lg" : "md"}
      PaperProps={{
        style: {
          backgroundColor: grey[50],
        },
        component: "form",
      }}
    >
      <AddNewMedicineDialog/>
      <DialogTitle
        sx={{
          paddingY: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" component="div">
          {defaultValues
            ? "Edit Medicine Request"
            : "Add a New Medicine Request"}
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
          sx={{
            display: "flex",
            flexDirection: isTablet ? "column" : "row",
            padding: "1rem",
          }}
        >
          <Stack
            sx={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              padding: "0.5rem",
              borderRadius: "0.3rem",
              height: "fit-content",
            }}
          >
            <Controller
              name="medicineName"
              control={control}
              defaultValue={defaultValues?.medicineName ?? ""}
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  onChange={(event, newValue) => field.onChange(newValue)}
                  value={field.value || ""}
                  size="small"
                  options={[
                    ...(medicineData?.length
                      ? medicineData.map((item) => item.medicineName)
                      : []),
                    "$ADD_NEW_JOB_POSITION",
                  ]}
                  getOptionLabel={(option) => option}
                  isOptionEqualToValue={(option, value) => option === value}
                  renderOption={(props, option) =>
                    option === "$ADD_NEW_JOB_POSITION" ? (
                      <AddNewMedicineButton {...props} />
                    ) : (
                      <li {...props} key={option}>
                        {option}
                      </li>
                    )
                  }
                  sx={{ flex: 1, margin: "0.5rem" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={!!errors.medicineName}
                      helperText={errors.medicineName && "Required"}
                      label="Medicine Name"
                      name="medicineName"
                    />
                  )}
                />
              )}
            />
            <TextField
              required
              id="generic_name"
              label="Generic Name"
              error={!!errors.genericName}
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("genericName", { required: true })}
            />
            <Autocomplete
              {...register("division", { required: true })}
              size="small"
              options={
                divisionData?.length
                  ? divisionData.map((division) => division.divisionName)
                  : []
              }
              defaultValue={defaultValues?.division}
              sx={{ flex: 1, margin: "0.5rem" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!!errors.division}
                  label="Division"
                  name="division"
                />
              )}
            />
            <TextField
              required
              id="requestQuantity"
              label="Requested Quantity"
              error={!!errors.requestQuantity}
              name="requestQuantity"
              helperText={
                errors.requestQuantity ? errors.requestQuantity.message : ""
              }
              type="number"
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("requestQuantity", {
                required: {
                  value: true,
                  message: "Required",
                },
                min: {
                  value: 1,
                  message: "Quantity must be at least 1",
                },
              })}
            />
            <Box sx={{ flex: 1 }}>
              <UserAutoComplete
                name="approver"
                label="Approver"
                control={control}
                register={register}
                errors={errors}
                userData={asigneeData}
                defaultValue={defaultValues?.approver}
                required={true}
              />
            </Box>
          </Stack>
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
            handleCreateDocument(data);
          })}
        >
          {defaultValues ? "Update Changes" : "Save Medical Request"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
