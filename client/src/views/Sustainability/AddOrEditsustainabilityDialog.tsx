import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import useIsMobile from "../../customHooks/useIsMobile";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import {
  sampleDepartments,
  sampleDivisions,
} from "../../api/sampleData/documentData";
import DropzoneComponent from "../../components/DropzoneComponent";
import { grey } from "@mui/material/colors";
import DatePickerComponent from "../../components/DatePickerComponent";
import CustomButton from "../../components/CustomButton";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";

import { sampleAssignees } from "../../api/sampleData/usersSampleDate";
import { Sustainability } from "../../api/Sustainability/sustainbilityApi";
import { materialityType } from "../../api/sampleData/sustainabilityData";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";

import theme from "../../theme";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TimePickerComponent from "../../components/TimePickerComponent";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CollectionsIcon from '@mui/icons-material/Collections';
import RichTextComponent from "../../components/RichTextComponent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: Sustainability;
  onSubmit?: (data: Sustainability) => void;
};

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function AddOrEditAccidentDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: DialogProps) {
  const { isMobile, isTablet } = useIsMobile();
  const [files, setFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log("event", event);
    setActiveTab(newValue);
  };

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Sustainability>({});

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

  const handleCreateDocument = (data: Sustainability) => {
    const submitData: Partial<Sustainability> = data;
    submitData.id = defaultValues?.id ?? uuidv4();

    onSubmit(submitData as Sustainability);
    resetForm();
  };

  return (
    <>
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
            {defaultValues ? "Edit an Accident" : "Report an Accident"}
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
            <Box
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
                  marginX: "0.5rem",
                  marginY: "1rem",
                }}
              >
                <Typography variant="body2" component="div">
                  <b>Date</b>
                </Typography>
                <Typography variant="body2" component="div">
                  {new Date().toDateString()}
                </Typography>
              </Box>
              <Tabs
                value={activeTab}
                onChange={handleChange}
                indicatorColor="secondary"
                TabIndicatorProps={{
                  style: {
                    backgroundColor: "var(--pallet-blue)",
                    height: "3px",
                  },
                }}
                sx={{
                  backgroundColor: "var(--pallet-lighter-grey)",
                  color: "var(--pallet-blue)",
                }}
                textColor="inherit"
                variant="fullWidth"
              >
                <Tab
                  label={
                    <Box
                      sx={{
                        color: "var(--pallet-blue)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <TextSnippetIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        General Details
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(0)}
                />
                <Tab
                  label={
                    <Box
                      sx={{
                        color: "var(--pallet-blue)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <BookmarksIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        SDG Details
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(1)}
                />
                <Tab
                  label={
                    <Box
                      sx={{
                        color: "var(--pallet-blue)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <TextSnippetIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Others
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(2)}
                />
                <Tab
                  label={
                    <Box
                      sx={{
                        color: "var(--pallet-blue)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FileDownloadIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Activity Impacts
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(3)}
                />
                <Tab
                  label={
                    <Box
                      sx={{
                        color: "var(--pallet-blue)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CollectionsIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Gallery
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(4)}
                />
              </Tabs>
              <TabPanel value={activeTab} index={0} dir={theme.direction}>
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#fff",
                    flex: { lg: 3, md: 1 },
                    borderRadius: "0.3rem",
                  }}
                >
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
                    <Autocomplete
                      multiple
                      id="checkboxes-tags-demo"
                      options={materialityType}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.id}
                      renderOption={(props, option, { selected }) => {
                        const { key, ...optionProps } = props;
                        return (
                          <li key={key} {...optionProps}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.name}
                          </li>
                        );
                      }}
                      style={{ width: 500 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Checkboxes" placeholder="Favorites" />
                      )}
                    />
                    <Autocomplete
                      {...register("materialIssue", { required: true })}
                      size="small"
                      options={sampleDepartments?.map(
                        (department) => department.name
                      )}
                      defaultValue={defaultValues?.materialIssue}
                      sx={{ flex: 1, margin: "0.5rem" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          error={!!errors.materialIssue}
                          label="Department"
                          name="department"
                        />
                      )}
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

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      margin: "0.5rem",
                      justifyContent: "flex-end",
                    }}
                  >
                    <CustomButton
                      variant="contained"
                      sx={{
                        backgroundColor: "var(--pallet-blue)",
                      }}
                      size="medium"
                      onClick={() => {
                        setActiveTab(1);
                      }}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Next
                    </CustomButton>
                  </Box>
                </Stack>
              </TabPanel>
              
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
              handleCreateDocument(data);
            })}
          >
            {defaultValues ? "Update Changes" : "Submit Report"}
          </CustomButton>
        </DialogActions>
      </Dialog>
      {/* {addWitnessDialogOpen && (
        <AddOrEditWitnessDialog
          open={addWitnessDialogOpen}
          onClose={() => {
            setAddWitnessDialogOpen(false);
            setSelectedWitness(null);
          }}
          onSubmit={(data) => {
            console.log("data", data);
            if (selectedWitness) {
              setValue("witnesses", [
                ...(witnessesWatch ?? []).map((item) => {
                  if (item.employeeId === selectedWitness.employeeId) {
                    return data;
                  }
                  return item;
                }),
              ]);
            } else {
              setValue("witnesses", [...(witnessesWatch ?? []), data]);
            }
            setAddWitnessDialogOpen(false);
            setSelectedWitness(null);
          }}
          defaultValues={selectedWitness}
        />
      )} */}
      {/* {openAddOrEditPersonDialog && (
        <AddOrEditPersonDialog
          open={openAddOrEditPersonDialog}
          handleClose={() => setOpenAddOrEditPersonDialog(false)}
          onSubmit={(data) => {
            console.log("Adding new person", data);
            if (selectedPerson) {
              setValue("effectedIndividuals", [
                ...(effectedIndividualsWatch ?? []).map((item) => {
                  if (item.employeeId === selectedPerson.employeeId) {
                    return data;
                  }
                  return item;
                }),
              ]);
            } else {
              setValue("effectedIndividuals", [
                ...(effectedIndividualsWatch ?? []),
                data,
              ]);
            }
            setOpenAddOrEditPersonDialog(false);
            setSelectedPerson(null);
          }}
          defaultValues={selectedPerson}
        />
      )} */}
    </>
  );
}
