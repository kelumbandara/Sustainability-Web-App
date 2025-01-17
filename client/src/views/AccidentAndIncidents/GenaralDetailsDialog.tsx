import React, { useState } from "react";
import {
  Autocomplete,
  Box,
  TextField,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogContent from "@mui/material/DialogContent";
import DropzoneComponent from "../../components/DropzoneComponent";

import { sampleDivisions } from "../../api/sampleData/documentData";
import { sampleDepartments } from "../../api/sampleData/documentData";
import CustomButton from "../../components/CustomButton";

import AddWitnessDetails from '../AccidentAndIncidents/AddWitness'

export default function AddGeneralDetails({ defaultValues, errors }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [files, setFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <DialogContent>
      <Stack
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1.1rem",
        }}
      >
        <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 2 : 2}>
          <Autocomplete
            disablePortal
            options={sampleDivisions?.map((division) => division.name)}
            defaultValue={defaultValues?.division}
            fullWidth
            size="small"
            renderInput={(params) => (
              <TextField
                {...params}
                required
                error={!!errors?.division}
                helperText={errors?.division?.message}
                label="Division"
                name="division"
              />
            )}
          />
          <TextField
            required
            id="location"
            label="Location"
            size="small"
            fullWidth
          />
        </Stack>

        <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 2 : 2}>
          <Autocomplete
            disablePortal
            options={sampleDepartments?.map((division) => division.name)}
            defaultValue={defaultValues?.division}
            fullWidth
            size="small"
            renderInput={(params) => (
              <TextField
                {...params}
                required
                error={!!errors?.division}
                helperText={errors?.division?.message}
                label="Department"
                name="department"
              />
            )}
            ListboxProps={{
              style: {
                maxHeight: '200px',
                overflowY: 'auto',
              }
            }}
          />
          <TextField
            required
            id="supervisor"
            label="Supervisor"
            size="small"
            fullWidth
          />
        </Stack>

        <Box
          sx={{
            width: "auto",
          }}
        >
          <CustomButton
            sx={{
              justifyContent: "flex-start",
            }}
            onClick={handleClickOpen}
          >
            <AddIcon sx={{ marginRight: 1 }} />
            Add Witness
          </CustomButton>

          <Dialog open={open} onClose={handleClose}>
            <AddWitnessDetails defaultValues={defaultValues} errors={errors} />
          </Dialog>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <DropzoneComponent
            files={files}
            setFiles={setFiles}
            dropzoneLabel={
              "Drop your evidence here. Please ensure the image size is less than 10mb."
            }
          />
        </Box>
      </Stack>
    </DialogContent>
  );
}
