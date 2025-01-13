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
import { DocumentType } from "../../api/documentApi";
import { Document } from "../../api/documentApi";
import useIsMobile from "../../customHooks/useIsMobile";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { sampleDivisions } from "../../api/sampleData/documentData";
import RichTextComponent from "../../components/RichTextComponent";
import DropzoneComponent from "../../components/DropzoneComponent";
import { grey } from "@mui/material/colors";
import DatePickerComponent from "../../components/DatePickerComponent";
import SwitchButton from "../../components/SwitchButton";
import CustomButton from "../../components/CustomButton";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: Document;
  onSubmit?: (data: Document) => void;
};

export default function AddOrEditDocumentDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: DialogProps) {
  const { isMobile, isTablet } = useIsMobile();
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<Document>({
    defaultValues: defaultValues,
  });

  const isNoExpiry = watch("isNoExpiry");
  const versionNumber = watch("versionNumber");

  console.log("versionNumber", versionNumber, defaultValues);

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    } else {
      reset();
    }
  }, [defaultValues, reset]);

  const resetForm = () => {
    reset();
    setFiles([]);
  };

  const handleCreateDocument = (data: Document) => {
    const { isNoExpiry, expiryDate, notifyDate, ...rest } = data;
    const submitData: Partial<Document> = rest;
    submitData.id = defaultValues?.id ?? uuidv4();
    if (!isNoExpiry) {
      submitData.isNoExpiry = false;
      submitData.expiryDate = expiryDate;
      submitData.notifyDate = notifyDate;
    } else {
      submitData.isNoExpiry = true;
    }
    onSubmit(submitData as Document);
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
          {defaultValues ? "Edit Document Details" : "Create a New Document"}
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
              flex: { lg: 3, md: 1 },
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
                {...register("documentType", { required: true })}
                size="small"
                options={Object.values(DocumentType)}
                sx={{ flex: 1, margin: "0.5rem" }}
                defaultValue={defaultValues?.documentType}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.documentType}
                    label="Document Type"
                    name="documentType"
                  />
                )}
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
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <TextField
                required
                id="issuingAuthority"
                label="Issuing Authority"
                error={!!errors.issuingAuthority}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("issuingAuthority", { required: true })}
              />
              <TextField
                required
                id="documentNumber"
                label="Document Number"
                error={!!errors.documentNumber}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("documentNumber", { required: true })}
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
                id="title"
                label="Title"
                error={!!errors.title}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("title", { required: true })}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <TextField
                id="documentOwner"
                label="Document Owner"
                error={!!errors.documentOwner}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("documentOwner")}
              />
              <TextField
                required
                id="documentReviewer"
                label="Document Reviewer"
                error={!!errors.documentReviewer}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("documentReviewer", { required: true })}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <TextField
                id="physicalLocation"
                label="Physical Location"
                error={!!errors.physicalLocation}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("physicalLocation")}
              />
              <TextField
                required
                id="versionNumber"
                label="Version Number"
                error={!!errors.versionNumber}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("versionNumber", { required: true })}
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
                name={"remarks"}
                render={({ field }) => {
                  return (
                    <RichTextComponent
                      onChange={(e) => field.onChange(e)}
                      placeholder={field.value ?? "Remarks"}
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
                dropzoneLabel={"Drop Your Documents Here"}
              />
            </Box>
          </Stack>
          <Stack
            sx={{
              display: "flex",
              flex: { lg: 1, md: 1 },
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
                name={"issuedDate"}
                render={({ field }) => {
                  return (
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value}
                      label="Issued Date"
                    />
                  );
                }}
              />
            </Box>
            <Box sx={{ margin: "0.5rem" }}>
              <Controller
                control={control}
                name={"isNoExpiry"}
                render={({ field }) => {
                  return (
                    <SwitchButton
                      label="No Expiry"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  );
                }}
              />
            </Box>

            {!isNoExpiry && (
              <>
                <Box sx={{ margin: "0.5rem" }}>
                  <Controller
                    control={control}
                    name={"expiryDate"}
                    render={({ field }) => {
                      return (
                        <DatePickerComponent
                          onChange={(e) => field.onChange(e)}
                          value={field.value}
                          label="Expiry Date"
                        />
                      );
                    }}
                  />
                </Box>

                <Box sx={{ margin: "0.5rem" }}>
                  <Controller
                    control={control}
                    name={"notifyDate"}
                    render={({ field }) => {
                      return (
                        <DatePickerComponent
                          onChange={(e) => field.onChange(e)}
                          value={field.value}
                          label="Notify Date"
                        />
                      );
                    }}
                  />
                </Box>
              </>
            )}
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
          {defaultValues ? "Update Changes" : "Create Document"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
