import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Autocomplete,
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
import { sampleMedicines } from "../../../../api/sampleData/medicineRequestSampleData";
import { sampleDivisions } from "../../../../api/sampleData/documentData";
import { sampleAssignees } from "../../../../api/sampleData/usersSampleData";
import CustomButton from "../../../../components/CustomButton";

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
  } = useForm<MedicineRequest>({
    defaultValues,
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

  const handleCreateDocument = (data: MedicineRequest) => {
    const submitData: Partial<MedicineRequest> = data;
    submitData.id = defaultValues?.id ?? uuidv4();
    submitData.reference_number = defaultValues?.reference_number ?? uuidv4();
    submitData.request_date =
      defaultValues?.request_date ?? new Date().toDateString();
    submitData.status = defaultValues?.status ?? "Approved";
    submitData.created_at =
      defaultValues?.created_at ?? new Date().toDateString();

    onSubmit(submitData as MedicineRequest);
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
              {...register("medicine_name", { required: true })}
              size="small"
              options={sampleMedicines}
              defaultValue={defaultValues?.medicine_name}
              sx={{ flex: 1, margin: "0.5rem" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!!errors.medicine_name}
                  label="Medicine Name"
                  name="medicine_name"
                />
              )}
            />
            <TextField
              required
              id="generic_name"
              label="Generic Name"
              error={!!errors.generic_name}
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("generic_name", { required: true })}
            />
            <Autocomplete
              {...register("division", { required: true })}
              size="small"
              options={sampleDivisions?.map((division) => division.name)}
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
              id="requested_quantity"
              label="Requested Quantity"
              error={!!errors.requested_quantity}
              type="number"
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("requested_quantity", { required: true })}
            />
            <Autocomplete
              {...register("approver", { required: true })}
              size="small"
              options={sampleAssignees?.map((category) => category.name)}
              sx={{ flex: 1, margin: "0.5rem" }}
              defaultValue={defaultValues?.approver}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!!errors.approver}
                  label="Approver"
                  name="approver"
                />
              )}
            />
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
