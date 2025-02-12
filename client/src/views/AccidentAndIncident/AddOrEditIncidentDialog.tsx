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
import { sampleDivisions } from "../../api/sampleData/documentData";
import DropzoneComponent from "../../components/DropzoneComponent";
import { grey } from "@mui/material/colors";
import DatePickerComponent from "../../components/DatePickerComponent";
import CustomButton from "../../components/CustomButton";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";
import { HazardAndRiskStatus } from "../../api/hazardRiskApi";
import { sampleAssignees } from "../../api/sampleData/usersSampleData";
import {
  AccidentEffectedIndividual,
  AccidentWitness,
  Incident,
  IncidentFactors,
  IncidentSeverity,
  IncidentTypeOfConcern,
  IncidentTypeOfNearMiss,
} from "../../api/accidentAndIncidentApi";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import WarningIcon from "@mui/icons-material/Warning";
import theme from "../../theme";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TimePickerComponent from "../../components/TimePickerComponent";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RichTextComponent from "../../components/RichTextComponent";
import AddOrEditWitnessDialog from "./AddOrEditWitnessDialog";
import AddOrEditPersonDialog from "./AddOrEditPersonDialog";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { circumstancesOptions } from "../../api/sampleData/incidentData";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: Incident;
  onSubmit?: (data: Incident) => void;
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

export default function AddOrEditIncidentDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: DialogProps) {
  const { isMobile, isTablet } = useIsMobile();
  const [files, setFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [addWitnessDialogOpen, setAddWitnessDialogOpen] = useState(false);
  const [openAddOrEditPersonDialog, setOpenAddOrEditPersonDialog] =
    useState(false);
  const [selectedWitness, setSelectedWitness] = useState<AccidentWitness>(null);
  const [selectedPerson, setSelectedPerson] =
    useState<AccidentEffectedIndividual>(null);

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
  } = useForm<Incident>({});

  const witnessesWatch = watch("witnesses");
  const effectedIndividualsWatch = watch("effectedIndividuals");

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

  const handleCreateDocument = (data: Incident) => {
    const submitData: Partial<Incident> = data;
    submitData.id = defaultValues?.id ?? uuidv4();
    // submitData.createdDate = new Date();
    // submitData.createdByUser = sampleAssignees[0].name;
    submitData.status = defaultValues?.status ?? HazardAndRiskStatus.DRAFT;
    onSubmit(submitData as Incident);
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
            {defaultValues ? "Edit an Incident" : "Report an Incident"}
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
                      <WarningIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Incident Details
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(1)}
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
                    <Autocomplete
                      {...register("division", { required: true })}
                      size="small"
                      options={sampleDivisions?.map(
                        (division) => division.name
                      )}
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
                      id="location"
                      label="Location"
                      error={!!errors.location}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("location", { required: true })}
                    />
                    <Autocomplete
                      {...register("circumstances", { required: true })}
                      size="small"
                      options={circumstancesOptions}
                      defaultValue={defaultValues?.circumstances}
                      sx={{ flex: 1, margin: "0.5rem" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          error={!!errors.circumstances}
                          label="Circumstances"
                          name="circumstances"
                        />
                      )}
                    />
                  </Box>

                  <Stack sx={{ alignItems: "center", m: "0.5rem" }}>
                    <TableContainer
                      component={Paper}
                      elevation={2}
                      sx={{
                        overflowX: "auto",
                        maxWidth: isMobile ? "88vw" : "100%",
                      }}
                    >
                      <Box
                        sx={{
                          padding: theme.spacing(2),
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "var(--pallet-blue)" }}
                          startIcon={<AddIcon />}
                          onClick={() => {
                            setSelectedWitness(null);
                            setAddWitnessDialogOpen(true);
                          }}
                        >
                          Add Witness
                        </Button>
                      </Box>
                      <Table aria-label="simple table">
                        <TableHead
                          sx={{
                            backgroundColor: "var(--pallet-lighter-grey)",
                          }}
                        >
                          <TableRow>
                            <TableCell align="center">Employee ID</TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Division</TableCell>
                            <TableCell align="center">Department</TableCell>
                            <TableCell align="center"></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {witnessesWatch?.length > 0 ? (
                            witnessesWatch?.map((row) => (
                              <TableRow
                                // key={`${row.id}`}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  console.log("row");
                                }}
                              >
                                <TableCell
                                  component="th"
                                  scope="row"
                                  align="center"
                                >
                                  {row.employeeId}
                                </TableCell>
                                <TableCell align="center">{row.name}</TableCell>
                                <TableCell align="center">
                                  {row.division}
                                </TableCell>
                                <TableCell align="center">
                                  {row.department}
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    onClick={() => {
                                      setSelectedWitness(row);
                                      setAddWitnessDialogOpen(true);
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => {
                                      setValue(
                                        "witnesses",
                                        (witnessesWatch ?? []).filter(
                                          (item) =>
                                            item.employeeId !== row.employeeId
                                        )
                                      );
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={11} align="center">
                                <Typography variant="body2">
                                  No Records found
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Stack>

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
              <TabPanel value={activeTab} index={1} dir={theme.direction}>
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
                    <Autocomplete
                      {...register("typeOfNearMiss", { required: true })}
                      size="small"
                      options={Object.values(IncidentTypeOfNearMiss)}
                      defaultValue={defaultValues?.typeOfNearMiss}
                      sx={{ flex: 1, margin: "0.5rem" }}
                      onChange={(e, value) => {
                        setValue("typeOfNearMiss", value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          error={!!errors.typeOfNearMiss}
                          label="Type of Near Miss"
                          name="typeOfNearMiss"
                        />
                      )}
                    />
                    <Autocomplete
                      {...register("typeOfConcern", { required: true })}
                      size="small"
                      options={Object.values(IncidentTypeOfConcern)}
                      defaultValue={defaultValues?.typeOfConcern}
                      sx={{ flex: 1, margin: "0.5rem" }}
                      onChange={(e, value) => {
                        setValue("typeOfConcern", value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          error={!!errors.typeOfConcern}
                          label="Type of Concern"
                          name="typeOfConcern"
                        />
                      )}
                    />
                    <Autocomplete
                      {...register("factors", { required: true })}
                      size="small"
                      options={Object.values(IncidentFactors)}
                      defaultValue={defaultValues?.factors}
                      sx={{ flex: 1, margin: "0.5rem" }}
                      onChange={(e, value) => {
                        setValue("factors", value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          error={!!errors.factors}
                          label="Factors"
                          name="factors"
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
                      id="causes"
                      label="causes"
                      error={!!errors.causes}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("causes")}
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
                      name={"incidentDetails"}
                      render={({ field }) => {
                        return (
                          <RichTextComponent
                            onChange={(e) => field.onChange(e)}
                            placeholder={field.value ?? "Incident Details"}
                          />
                        );
                      }}
                    />
                  </Box>
                  <Stack sx={{ alignItems: "center", m: "0.5rem" }}>
                    <TableContainer
                      component={Paper}
                      elevation={2}
                      sx={{
                        overflowX: "auto",
                        maxWidth: isMobile ? "88vw" : "100%",
                      }}
                    >
                      <Box
                        sx={{
                          padding: theme.spacing(2),
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "var(--pallet-blue)" }}
                          startIcon={<AddIcon />}
                          onClick={() => {
                            setSelectedPerson(null);
                            setOpenAddOrEditPersonDialog(true);
                          }}
                        >
                          Add Person
                        </Button>
                      </Box>
                      <Table aria-label="simple table">
                        <TableHead
                          sx={{
                            backgroundColor: "var(--pallet-lighter-grey)",
                          }}
                        >
                          <TableRow>
                            <TableCell align="center">Person Type</TableCell>
                            <TableCell align="center">Person Name</TableCell>
                            <TableCell align="center">Gender</TableCell>
                            <TableCell align="center">Designation</TableCell>
                            <TableCell align="center"></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {effectedIndividualsWatch?.length > 0 ? (
                            effectedIndividualsWatch?.map((row) => (
                              <TableRow
                                // key={`${row.id}`}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  console.log("row");
                                }}
                              >
                                <TableCell
                                  component="th"
                                  scope="row"
                                  align="center"
                                >
                                  {row.personType}
                                </TableCell>
                                <TableCell align="center">{row.name}</TableCell>
                                <TableCell align="center">
                                  {row.gender}
                                </TableCell>
                                <TableCell align="center">
                                  {row.designation}
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    onClick={() => {
                                      setSelectedPerson(row);
                                      setOpenAddOrEditPersonDialog(true);
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => {
                                      setValue(
                                        "effectedIndividuals",
                                        (effectedIndividualsWatch ?? []).filter(
                                          (item) => item.id !== row.id
                                        )
                                      );
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={11} align="center">
                                <Typography variant="body2">
                                  No Records found
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Stack>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      margin: "0.5rem",
                      justifyContent: "flex-start",
                    }}
                  >
                    <CustomButton
                      variant="contained"
                      sx={{
                        backgroundColor: "var(--pallet-blue)",
                      }}
                      size="medium"
                      onClick={() => {
                        setActiveTab(0);
                      }}
                      startIcon={<ArrowBackIcon />}
                    >
                      Previous
                    </CustomButton>
                  </Box>
                </Stack>
              </TabPanel>
            </Box>
            <Box
              sx={{
                display: "flex",
                flex: { lg: 1, md: 1 },
                flexDirection: "column",
                backgroundColor: "#fff",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                padding: "1rem",
                borderRadius: "0.3rem",
                marginY: isTablet ? "0.5rem" : 0,
                marginLeft: isTablet ? 0 : "0.5rem",
                height: "fit-content",
              }}
            >
              <Box sx={{ margin: "0.5rem" }}>
                <Controller
                  control={control}
                  {...register("incidentDate", { required: true })}
                  name={"incidentDate"}
                  render={({ field }) => {
                    return (
                      <DatePickerComponent
                        onChange={(e) => field.onChange(e)}
                        value={field.value ? new Date(field.value) : undefined}
                        label="Incident Date"
                        error={errors?.incidentDate ? "Required" : ""}
                      />
                    );
                  }}
                />
              </Box>
              <Box sx={{ margin: "0.5rem" }}>
                <Controller
                  control={control}
                  {...register("incidentTime", { required: true })}
                  name={"incidentTime"}
                  render={({ field }) => {
                    return (
                      <TimePickerComponent
                        onChange={(e) => field.onChange(e)}
                        value={field.value ? new Date(field.value) : undefined}
                        label="Incident Time"
                        error={errors?.incidentTime ? "Required" : ""}
                      />
                    );
                  }}
                />
              </Box>

              <Box sx={{ margin: "0.5rem" }}>
                <Typography
                  variant="caption"
                  sx={{ marginBottom: "0.1rem", color: grey[700] }}
                >
                  Severity
                </Typography>
                <Controller
                  control={control}
                  name={"severity"}
                  render={({ field }) => {
                    return (
                      <ToggleButtonGroup
                        size="small"
                        {...control}
                        aria-label="Small sizes"
                        color="primary"
                        value={field.value}
                        exclusive
                        orientation="vertical"
                        fullWidth
                        onChange={(e, value) => {
                          console.log("e", e);
                          field.onChange(value);
                        }}
                      >
                        <ToggleButton
                          value={IncidentSeverity.LOW}
                          key={IncidentSeverity.LOW}
                        >
                          <Typography variant="caption" component="div">
                            {IncidentSeverity.LOW}
                          </Typography>
                        </ToggleButton>
                        <ToggleButton
                          value={IncidentSeverity.MEDIUM}
                          key={IncidentSeverity.MEDIUM}
                        >
                          <Typography variant="caption" component="div">
                            {IncidentSeverity.MEDIUM}
                          </Typography>
                        </ToggleButton>
                        <ToggleButton
                          value={IncidentSeverity.HIGH}
                          key={IncidentSeverity.HIGH}
                        >
                          <Typography variant="caption" component="div">
                            {IncidentSeverity.HIGH}
                          </Typography>
                        </ToggleButton>
                        <ToggleButton
                          value={IncidentSeverity.VERY_HIGH}
                          key={IncidentSeverity.VERY_HIGH}
                        >
                          <Typography variant="caption" component="div">
                            {IncidentSeverity.VERY_HIGH}
                          </Typography>
                        </ToggleButton>
                        <ToggleButton
                          value={IncidentSeverity.EXTREME}
                          key={IncidentSeverity.EXTREME}
                        >
                          <Typography variant="caption" component="div">
                            {IncidentSeverity.EXTREME}
                          </Typography>
                        </ToggleButton>
                      </ToggleButtonGroup>
                    );
                  }}
                />
              </Box>

              <Box sx={{ margin: "0.5rem" }}>
                <Autocomplete
                  {...register("assignee", { required: true })}
                  size="small"
                  options={sampleAssignees?.map((category) => category.name)}
                  sx={{ flex: 1 }}
                  defaultValue={defaultValues?.assignee}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={!!errors.assignee}
                      label="Assignee"
                      name="assignee"
                    />
                  )}
                />
              </Box>
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
      {addWitnessDialogOpen && (
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
      )}
      {openAddOrEditPersonDialog && (
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
      )}
    </>
  );
}
