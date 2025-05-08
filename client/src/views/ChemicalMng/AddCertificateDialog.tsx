import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { Controller, useForm } from "react-hook-form";
import { AccidentWitness } from "../../api/accidentAndIncidentApi";
import {
  sampleDivisions,
  sampleDepartments,
} from "../../api/sampleData/documentData";
import CustomButton from "../../components/CustomButton";
import useIsMobile from "../../customHooks/useIsMobile";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from "@tanstack/react-query";
import { fetchDivision } from "../../api/divisionApi";
import { fetchDepartmentData } from "../../api/departmentApi";
import { ChemicalCertificate } from "../../api/ChemicalManagement/ChemicalRequestApi";
import DatePickerComponent from "../../components/DatePickerComponent";
import RichTextComponent from "../../components/RichTextComponent";
import DropzoneComponent from "../../components/DropzoneComponent";
import { useState } from "react";

const AddCertificateDialog = ({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ChemicalCertificate) => void;
}) => {
  const { isMobile } = useIsMobile();
  const [files, setFiles] = useState<File[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ChemicalCertificate>();
  const { data: divisionData, isFetching: isCategoryDataFetching } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  const { data: departmentData, isFetching: isDepartmentDataFetching } =
    useQuery({
      queryKey: ["departments"],
      queryFn: fetchDepartmentData,
    });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      fullWidth
      maxWidth={"md"}
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
          Add Certificate
        </Typography>
        <IconButton
          aria-label="open drawer"
          onClick={onClose}
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
            padding: "1rem",
            flex: { lg: 3, md: 1 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <TextField
                {...register("testName", { required: true })}
                required
                id="testName"
                label="Certificate/Test Name"
                error={!!errors.testDate}
                size="small"
                sx={{ margin: "0.5rem", width: "100%" }}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Controller
                control={control}
                {...register("testDate", { required: true })}
                name={"testDate"}
                render={({ field }) => {
                  return (
                    <Box sx={{ flex: 1, margin: "0.5rem" }}>
                      <DatePickerComponent
                        onChange={(e) => field.onChange(e)}
                        value={field.value ? new Date(field.value) : undefined}
                        label="Test Date"
                        error={errors?.testDate ? "Required" : ""}
                      />
                    </Box>
                  );
                }}
              />
              <Autocomplete
                {...register("testLab", { required: true })}
                size="small"
                options={
                  divisionData?.length
                    ? divisionData.map((division) => division.divisionName)
                    : []
                }
                sx={{
                  flex: 1,
                  margin: "0.5rem",
                  marginTop: isMobile ? "0.5rem" : "1.85rem",
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.testLab}
                    label="Testing Lab"
                    name="testLab"
                  />
                )}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Controller
                control={control}
                {...register("issuedDate", { required: true })}
                name={"issuedDate"}
                render={({ field }) => {
                  return (
                    <Box sx={{ flex: 1, margin: "0.5rem" }}>
                      <DatePickerComponent
                        onChange={(e) => field.onChange(e)}
                        value={field.value ? new Date(field.value) : undefined}
                        label="Issued Date"
                        error={errors?.issuedDate ? "Required" : ""}
                      />
                    </Box>
                  );
                }}
              />
              <Controller
                control={control}
                {...register("expiryDate", { required: true })}
                name={"expiryDate"}
                render={({ field }) => {
                  return (
                    <Box sx={{ flex: 1, margin: "0.5rem" }}>
                      <DatePickerComponent
                        onChange={(e) => field.onChange(e)}
                        value={field.value ? new Date(field.value) : undefined}
                        label="Expiry Date"
                        error={errors?.expiryDate ? "Required" : ""}
                      />
                    </Box>
                  );
                }}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <TextField
                {...register("positiveList", { required: true })}
                required
                id="positiveList"
                label="Positive List"
                error={!!errors.positiveList}
                size="small"
                sx={{ margin: "0.5rem", width: "100%" }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                margin: "0.5rem",
              }}
            >
              <Controller
                control={control}
                name={"description"}
                render={({ field }) => {
                  return (
                    <RichTextComponent
                      onChange={(e) => field.onChange(e)}
                      placeholder={field.value ?? "Description"}
                    />
                  );
                }}
              />
            </Box>
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
                dropzoneLabel={"Drop Your Evidence Here"}
              />
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: "1rem" }}>
        <Button onClick={onClose} sx={{ color: "var(--pallet-blue)" }}>
          Cancel
        </Button>
        <CustomButton
          variant="contained"
          sx={{
            backgroundColor: "var(--pallet-blue)",
          }}
          size="medium"
          onClick={handleSubmit((data) => {
            data.documents = files;
            onSubmit(data);
            reset();
          })}
        >
          Add Cirtificate
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddCertificateDialog;
