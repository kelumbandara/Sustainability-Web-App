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
import { v4 as uuidv4 } from "uuid";
import { ChemicalRequest } from "../../api/ChemicalManagement/ChemicalRequestApi";
import useIsMobile from "../../customHooks/useIsMobile";
import CustomButton from "../../components/CustomButton";
import {
  sampleChemicalCategoryList,
  sampleChemicalList,
  sampleProductStandardList,
} from "../../api/sampleData/chemicalRequestSampleData";
import DatePickerComponent from "../../components/DatePickerComponent";
import SwitchButton from "../../components/SwitchButton";
import DropzoneComponent from "../../components/DropzoneComponent";
import { useQuery } from "@tanstack/react-query";
import { fetchDivision } from "../../api/divisionApi";
import UserAutoComplete from "../../components/UserAutoComplete";
import { fetchAllUsers } from "../../api/userApi";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: ChemicalRequest;
  onSubmit?: (data: ChemicalRequest) => void;
};

export default function AddOrEditChemicalRequestDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: DialogProps) {
  const { isMobile, isTablet } = useIsMobile();
  const [files, setFiles] = useState<File[]>([]);

  const { data: divisionData, isFetching: isDivisionDataFetching } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  const { data: userData, isFetching: isUserDataFetching } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<ChemicalRequest>({
    defaultValues,
  });

  const watchMSDS = watch("msds_sds");

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

  const handleCreateRequest = (data: ChemicalRequest) => {
    const submitData: Partial<ChemicalRequest> = data;
    submitData.id = defaultValues?.id ?? uuidv4();
    onSubmit(submitData as ChemicalRequest);
    resetForm();
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        resetForm();
        handleClose();
      }}
      fullScreen={true}
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
            ? "Edit Chemical Request"
            : "Add a New Chemical Request"}
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
              flexDirection: "column",
              backgroundColor: "#fff",
              flex: 3,
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              padding: "0.5rem",
              borderRadius: "0.3rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                flexDirection: "column",
                margin: "0.5rem",
              }}
            >
              <Typography variant="body2" component="div">
                <b>Date</b>
              </Typography>
              <Typography variant="body2" component="div">
                {new Date().toDateString()}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Autocomplete
                {...register("commercial_name", { required: true })}
                size="small"
                options={sampleChemicalList}
                defaultValue={defaultValues?.commercial_name}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.commercial_name}
                    label="Commercial Name"
                    name="commercial_name"
                  />
                )}
              />
              <TextField
                id="substance_name"
                label="Substance Name"
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("substance_name")}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <TextField
                id="formula"
                label="Formula"
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("formula")}
              />
              <TextField
                id="reach_registration_number"
                label="Reach Registration Number"
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("reach_registration_number")}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <TextField
                required
                id="requested_quantity"
                label="Requested Quantity"
                error={!!errors.requested_quantity}
                size="small"
                type="number"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("requested_quantity", { required: true })}
              />
              <Autocomplete
                {...register("requested_unit", { required: true })}
                size="small"
                options={["KG", "L", "G", "ML", "M", "CM", "MM", "PCS"]}
                defaultValue={defaultValues?.requested_unit}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.requested_unit}
                    label="Requested Unit"
                    name="requested_unit"
                  />
                )}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Autocomplete
                {...register("category")}
                size="small"
                options={sampleChemicalCategoryList}
                defaultValue={defaultValues?.category}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField {...params} label="Category" name="category" />
                )}
              />
              <Autocomplete
                {...register("ZDHC_use_category", { required: true })}
                size="small"
                options={["Cleaning", "Finishing", "Dyeing", "Washing"]}
                defaultValue={defaultValues?.ZDHC_use_category}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.ZDHC_use_category}
                    label="ZDHC Use Category"
                    name="ZDHC_use_category"
                  />
                )}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Autocomplete
                {...register("chemical_form_type", { required: true })}
                size="small"
                options={["Liquid", "Solid", "Gas", "Plasma"]}
                defaultValue={defaultValues?.chemical_form_type}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.chemical_form_type}
                    label="Chemical Form Type"
                    name="chemical_form_type"
                  />
                )}
              />
              <TextField
                id="usage"
                label="Where and Why it is used?"
                error={!!errors.usage}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("usage", { required: true })}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flex: 2,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Autocomplete
                {...register("product_standard")}
                size="small"
                options={sampleProductStandardList}
                defaultValue={defaultValues?.product_standard}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Product Standard"
                    name="product_standard"
                  />
                )}
              />
              <Box sx={{ flex: 1, margin: "0.5rem" }}></Box>
            </Box>
            <Box sx={{ margin: "0.5rem" }}>
              <Controller
                control={control}
                name={"msds_sds"}
                render={({ field }) => {
                  return (
                    <SwitchButton
                      label="Do you have an MSDS/SDS?"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  );
                }}
              />
            </Box>
            {watchMSDS && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    margin: "0.5rem",
                  }}
                >
                  <DropzoneComponent
                    files={files}
                    setFiles={setFiles}
                    dropzoneLabel={
                      "Drop Your MSDS/SDS document. Please ensure the document size is less than 5MB."
                    }
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flex: 1,
                    flexDirection: isMobile ? "column" : "row",
                  }}
                >
                  {" "}
                  <Box sx={{ margin: "0.5rem", flex: 1 }}>
                    <Controller
                      control={control}
                      {...register("msds_sds_issued_date", { required: true })}
                      name={"msds_sds_issued_date"}
                      render={({ field }) => {
                        return (
                          <DatePickerComponent
                            onChange={(e) => field.onChange(e)}
                            value={field.value}
                            label="MSDS/SDS Issued Date"
                            error={
                              errors?.msds_sds_issued_date ? "Required" : ""
                            }
                          />
                        );
                      }}
                    />
                  </Box>
                  <Box sx={{ margin: "0.5rem", flex: 1 }}>
                    <Controller
                      control={control}
                      {...register("msds_sds_expiry_date", { required: true })}
                      name={"msds_sds_expiry_date"}
                      render={({ field }) => {
                        return (
                          <DatePickerComponent
                            onChange={(e) => field.onChange(e)}
                            value={field.value}
                            label="MSDS/SDS Expiry Date"
                            error={
                              errors?.msds_sds_expiry_date ? "Required" : ""
                            }
                          />
                        );
                      }}
                    />
                  </Box>
                </Box>
              </>
            )}
          </Stack>
          <Stack
            sx={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              backgroundColor: "#fff",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              padding: "0.5rem",
              borderRadius: "0.3rem",
              marginY: isTablet ? "0.5rem" : 0,
              marginLeft: isTablet ? 0 : "0.5rem",
              height: "fit-content",
            }}
          >
            <Box sx={{ margin: "0.5rem" }}>
              <Controller
                control={control}
                {...register("request_date", { required: true })}
                name={"request_date"}
                render={({ field }) => {
                  return (
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value}
                      label="Request Date"
                      error={errors?.request_date ? "Required" : ""}
                    />
                  );
                }}
              />
            </Box>
            <Box sx={{ margin: "0.5rem" }}>
              <Autocomplete
                {...register("division", { required: false })}
                size="small"
                options={
                  divisionData?.length
                    ? divisionData.map((division) => division.divisionName)
                    : []
                }
                sx={{ flex: 1 }}
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
            </Box>
            <TextField
              id="requested_customer"
              label="Requested Customer"
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("requested_customer")}
            />
            <TextField
              id="requested_merchandiser"
              label="Requested Merchandiser"
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("requested_merchandiser")}
            />
            <Box sx={{ margin: "0.5rem" }}>
              <UserAutoComplete
                name="assignee"
                label="assignee"
                control={control}
                register={register}
                errors={errors}
                userData={userData}
                defaultValue={defaultValues?.reviewer}
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
            handleCreateRequest(data);
          })}
        >
          {defaultValues ? "Update Changes" : "Save Patient"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
