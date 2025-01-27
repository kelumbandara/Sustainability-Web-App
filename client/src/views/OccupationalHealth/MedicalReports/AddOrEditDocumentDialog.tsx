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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MedicalDocument>({
    defaultValues: defaultDocument,
  });
  console.log("defaultValues", defaultDocument);

  // useEffect(() => {
  //   if (defaultValues) {
  //     reset(defaultValues);
  //   } else {
  //     reset();
  //   }
  // }, [reset, defaultValues]);
  // console.log("def", defaultValues);

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
          {defaultDocument ? "Edit Witness" : "Add Witness"}
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
            {...register("document_type", { required: true })}
            size="small"
            options={["Pregnancy Certificate", "Fitness Certificate"]}
            defaultValue={defaultDocument?.document_type || ""}
            sx={{ flex: 1 }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                error={!!errors.document_type}
                label="Document Type"
                name="document_type"
              />
            )}
          />

          <DropzoneComponent
            files={files}
            setFiles={setFiles}
            dropzoneLabel={
              "Drop your evidence here. Please ensure the image size is less than 10mb."
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
