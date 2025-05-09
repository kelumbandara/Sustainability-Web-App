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
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { MedicineRequest } from "../../../../api/medicineRequestApi";
import useIsMobile from "../../../../customHooks/useIsMobile";
import CustomButton from "../../../../components/CustomButton";
import { useQuery } from "@tanstack/react-query";
import { fetchMedicineList } from "../../../../api/OccupationalHealth/medicineNameApi";
import { fetchDivision } from "../../../../api/divisionApi";
import { fetchAllUsers, fetchMedicineRequestAssignee } from "../../../../api/userApi";
import UserAutoComplete from "../../../../components/UserAutoComplete";

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
            <Autocomplete
              {...register("medicineName", { required: false })}
              size="small"
              options={
                medicineData?.length
                  ? medicineData.map((medicine) => medicine.medicineName)
                  : []
              }
              defaultValue={defaultValues?.medicineName}
              sx={{ flex: 1, margin: "0.5rem" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!!errors.medicineName}
                  label="Medicine Name"
                  name="medicineName"
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
              type="number"
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("requestQuantity", { required: true })}
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
