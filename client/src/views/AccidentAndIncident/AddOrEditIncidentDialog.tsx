import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Alert,
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
import DropzoneComponent from "../../components/DropzoneComponent";
import { grey } from "@mui/material/colors";
import DatePickerComponent from "../../components/DatePickerComponent";
import CustomButton from "../../components/CustomButton";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";
import { HazardAndRiskStatus } from "../../api/hazardRiskApi";
import {
  AccidentEffectedIndividual,
  AccidentWitness,
  Incident,
  IncidentSeverity,
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
import useCurrentUser from "../../hooks/useCurrentUser";
import { fetchAllUsers, fetchIncidentAssignee } from "../../api/userApi";
import { useQuery } from "@tanstack/react-query";
import { fetchDivision } from "../../api/divisionApi";
import { fetchNearMiss } from "../../api/nearMissApi";
import { fetchTypeOfConcerns } from "../../api/typeOfConcern";
import { fetchAllFactors } from "../../api/incidentFactorsApi";
import { fetchAllCircumstances } from "../../api/circumstancesApi";
import UserAutoComplete from "../../components/UserAutoComplete";
import { ExistingFileItemsEdit } from "../../components/ExistingFileItemsEdit";
import { StorageFile } from "../../utils/StorageFiles.util";

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
  const [existingFiles, setExistingFiles] = useState<StorageFile[]>(
    defaultValues?.evidence as StorageFile[]
  );
  const [filesToRemove, setFilesToRemove] = useState<string[]>([]);

  const { user } = useCurrentUser();

  const { data: userData } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  const { data: divisionData } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  const { data: nearMissData } = useQuery({
    queryKey: ["nearMissData"],
    queryFn: fetchNearMiss,
  });

  const { data: concernData } = useQuery({
    queryKey: ["concernData"],
    queryFn: fetchTypeOfConcerns,
  });

  const { data: factorData } = useQuery({
    queryKey: ["factorData"],
    queryFn: fetchAllFactors,
  });

  const { data: circumstancesData, isFetching: isCircumstancesDataFetching } =
    useQuery({
      queryKey: ["circumstancesData"],
      queryFn: fetchAllCircumstances,
    });

  const { data: asigneeData, isFetching: isAssigneeDataFetching } = useQuery({
    queryKey: ["incident-assignee"],
    queryFn: fetchIncidentAssignee,
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm<Incident>({
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const witnessesWatch = watch("witnesses");
  const effectedIndividualsWatch = watch("effectedIndividuals");
  const assignee = watch("assignee");

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

  const handleSubmitIncident = (data: Incident) => {
    const submitData: Partial<Incident> = data;
    submitData.id = defaultValues?.id ?? uuidv4();
    submitData.assigneeId = assignee?.id;
    submitData.createdByUser = user.id;
    submitData.status = defaultValues?.status ?? HazardAndRiskStatus.DRAFT;
    submitData.evidence = files;
    if (filesToRemove?.length > 0) submitData.removeDoc = filesToRemove;
    onSubmit(submitData as Incident);
  };

  const isGeneralDetailsValid = useMemo(() => {
    return !errors.division && !errors.location && !errors.circumstances;
  }, [errors.division, errors.location, errors.circumstances]);

  const isIncidentDetailsValid = useMemo(() => {
    return !errors.typeOfNearMiss && !errors.typeOfConcern && !errors.factors;
  }, [errors.typeOfNearMiss, errors.typeOfConcern, errors.factors]);

  const triggerGeneralDetailsSection = () => {
    trigger(["division", "location", "circumstances"]);
  };

  const triggerIncidentDetailsSection = () => {
    trigger(["typeOfNearMiss", "typeOfConcern", "factors"]);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 1) {
      triggerGeneralDetailsSection();
    } else {
      triggerIncidentDetailsSection();
    }
    setActiveTab(newValue);
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
          {Object.keys(errors).length > 0 && (
            <Alert
              severity="error"
              style={{ marginLeft: "1rem", marginRight: "1rem" }}
            >
              Please make sure to fill all the required fields with valid data
            </Alert>
          )}

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
                onChange={handleTabChange}
                indicatorColor="secondary"
                TabIndicatorProps={{
                  style: {
                    backgroundColor:
                      isIncidentDetailsValid && isGeneralDetailsValid
                        ? "var(--pallet-blue)"
                        : "var(--pallet-red)",
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
                        color: isGeneralDetailsValid
                          ? "var(--pallet-blue)"
                          : "var(--pallet-red)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <TextSnippetIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        General Details
                      </Typography>
                      {!isGeneralDetailsValid && (
                        <Typography
                          variant="subtitle1"
                          sx={{ ml: "0.3rem", color: "var(--pallet-red)" }}
                        >
                          *
                        </Typography>
                      )}
                    </Box>
                  }
                  {...a11yProps(0)}
                />
                <Tab
                  label={
                    <Box
                      sx={{
                        color: isIncidentDetailsValid
                          ? "var(--pallet-blue)"
                          : "var(--pallet-red)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <WarningIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Incident Details
                      </Typography>
                      {!isIncidentDetailsValid && (
                        <Typography
                          variant="subtitle1"
                          sx={{ ml: "0.3rem", color: "var(--pallet-red)" }}
                        >
                          *
                        </Typography>
                      )}
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
                    <Controller
                      name="division"
                      control={control}
                      defaultValue={defaultValues?.division ?? ""}
                      {...register("division", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={
                            divisionData?.length
                              ? divisionData.map(
                                  (division) => division.divisionName
                                )
                              : []
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.division}
                              helperText={errors.division && "Required"}
                              label="Division"
                              name="division"
                            />
                          )}
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
                    <Controller
                      name="circumstances"
                      control={control}
                      defaultValue={defaultValues?.circumstances ?? ""}
                      {...register("circumstances", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={
                            circumstancesData?.length
                              ? circumstancesData.map(
                                  (circumstance) => circumstance.name
                                )
                              : []
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.circumstances}
                              helperText={errors.circumstances && "Required"}
                              label="Circumstances"
                              name="circumstances"
                            />
                          )}
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
                  {defaultValues && (
                    <ExistingFileItemsEdit
                      label="Existing evidence"
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
                        handleTabChange(null, 1);
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
                    <Controller
                      name="typeOfNearMiss"
                      control={control}
                      defaultValue={defaultValues?.typeOfNearMiss ?? null}
                      {...register("typeOfNearMiss", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={
                            nearMissData?.length
                              ? nearMissData.map((nearMiss) => nearMiss.type)
                              : []
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.typeOfNearMiss}
                              helperText={errors.typeOfNearMiss && "Required"}
                              label="Type of Near Miss"
                              name="typeOfNearMiss"
                            />
                          )}
                        />
                      )}
                    />
                    <Controller
                      name="typeOfConcern"
                      control={control}
                      defaultValue={defaultValues?.typeOfConcern ?? null}
                      {...register("typeOfConcern", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={
                            concernData?.length
                              ? concernData.map(
                                  (concern) => concern.typeConcerns
                                )
                              : []
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.typeOfConcern}
                              helperText={errors.typeOfConcern && "Required"}
                              label="Type of Concern"
                              name="typeOfConcern"
                            />
                          )}
                        />
                      )}
                    />
                    <Controller
                      name="factors"
                      control={control}
                      defaultValue={defaultValues?.factors ?? null}
                      {...register("factors", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={
                            factorData?.length
                              ? factorData.map((factors) => factors.factorName)
                              : []
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.factors}
                              helperText={errors.factors && "Required"}
                              label="Factors"
                              name="factors"
                            />
                          )}
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
                      {...register("incidentDetails")}
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
                        handleTabChange(null, 0);
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
                <UserAutoComplete
                  name="assignee"
                  label="Assignee"
                  control={control}
                  register={register}
                  errors={errors}
                  userData={asigneeData}
                  defaultValue={defaultValues?.assignee}
                  required={true}
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
              handleSubmitIncident(data);
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
