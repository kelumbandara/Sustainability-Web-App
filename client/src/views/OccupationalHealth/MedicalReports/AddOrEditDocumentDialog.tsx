import {
  Autocomplete,
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
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { MedicalDocument } from "../../../api/OccupationalHealth/maternityRegisterApi";
import useIsMobile from "../../../customHooks/useIsMobile";
import CustomButton from "../../../components/CustomButton";
import DropzoneComponent from "../../../components/DropzoneComponent";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllMedicalReportType } from "../../../api/OccupationalHealth/medicalReportTypeApi";
import { ExistingFileItemsEdit } from "../../../components/ExistingFileItemsEdit";
import { StorageFile } from "../../../utils/StorageFiles.util";

const AddOrEditDocumentDialog = ({
  open,
  handleClose,
  onSubmit,
  defaultValues: defaultDocument,
}: {
  open: boolean;
  handleClose: () => void;
  onSubmit: (data: MedicalDocument) => void;
  defaultValues?: MedicalDocument;
}) => {
  const { isMobile } = useIsMobile();
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<StorageFile[]>(
    (defaultDocument?.document as StorageFile[]) || []
  );
  const [filesToRemove, setFilesToRemove] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MedicalDocument>({
    defaultValues: defaultDocument,
  });

  const {
    data: medicalReportTypeData,
    isFetching: isMedicalReportTypeDataFetching,
  } = useQuery({
    queryKey: ["medicalReport"],
    queryFn: fetchAllMedicalReportType,
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={isMobile}
      fullWidth
      maxWidth={"sm"}
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
          {defaultDocument ? "Edit Document" : "Add Document"}
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
            flexDirection: "column",
            padding: "1rem",
            flex: { lg: 3, md: 1 },
          }}
        >
          <Autocomplete
            {...register("documentType", { required: true })}
            size="small"
            options={
              medicalReportTypeData?.length
                ? medicalReportTypeData.map((report) => report.documentName)
                : []
            }
            defaultValue={defaultDocument?.documentType || ""}
            sx={{ flex: 1 }}
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
          {defaultDocument && (
            <ExistingFileItemsEdit
              label="Existing documents"
              files={existingFiles}
              sx={{ marginY: "1rem" }}
              handleRemoveItem={(file) => {
                if (file.gsutil_uri) {
                  setFilesToRemove([...filesToRemove, file.gsutil_uri]);
                  setExistingFiles(
                    existingFiles.filter(
                      (f) => f.gsutil_uri !== file.gsutil_uri
                    )
                  );
                }
              }}
            />
          )}
          <DropzoneComponent
            files={files}
            setFiles={setFiles}
            dropzoneLabel={
              "Drop your documents here. Please ensure the file size is less than 10mb."
            }
          />
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: "1rem" }}>
        <Button onClick={handleClose} sx={{ color: "var(--pallet-blue)" }}>
          Cancel
        </Button>
        <CustomButton
          variant="contained"
          sx={{
            backgroundColor: "var(--pallet-blue)",
          }}
          size="medium"
          onClick={handleSubmit((data) => {
            onSubmit(data);
            reset();
            setFiles([]);
            handleClose();
          })}
        >
          Add Document
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrEditDocumentDialog;
