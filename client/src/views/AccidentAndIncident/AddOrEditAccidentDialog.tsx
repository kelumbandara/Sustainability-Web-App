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
import { HazardAndRiskStatus } from "../../api/hazardRiskApi";
import { sampleAssignees } from "../../api/sampleData/usersSampleData";
import {
  Accident,
  AccidentEffectedIndividual,
  AccidentWitness,
  BodyPrimaryRegion,
  InjuryType,
  Severity,
} from "../../api/accidentAndIncidentApi";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import WarningIcon from "@mui/icons-material/Warning";
import theme from "../../theme";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TimePickerComponent from "../../components/TimePickerComponent";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  accidentCategories,
  accidentTypesOptions,
} from "../../constants/accidentConstants";
import RichTextComponent from "../../components/RichTextComponent";
import AddOrEditWitnessDialog from "./AddOrEditWitnessDialog";
import AddOrEditPersonDialog from "./AddOrEditPersonDialog";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: Accident;
  onSubmit?: (data: Accident) => void;
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
  } = useForm<Accident>({});

  const witnessesWatch = watch("witnesses");
  const categoryWatch = watch("category");
  const effectedIndividualsWatch = watch("effectedIndividuals");

  const relatedSubCategories = useMemo(() => {
    return accidentCategories?.find(
      (division) => division.name === categoryWatch
    )?.subCategories;
  }, [categoryWatch]);

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

  const handleCreateDocument = (data: Accident) => {
    const submitData: Partial<Accident> = data;
    submitData.id = defaultValues?.id ?? uuidv4();
    submitData.status = defaultValues?.status ?? HazardAndRiskStatus.DRAFT;
    onSubmit(submitData as Accident);
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
                      <WarningIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Accident Details
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
                    <Controller
                      name="division"
                      control={control}
                      defaultValue={defaultValues?.division}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={sampleDivisions?.map(
                            (division) => division.name
                          )}
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
                      helperText={errors.location && "Required"}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("location", { required: true })}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <Controller
                      name="department"
                      control={control}
                      defaultValue={defaultValues?.department}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={sampleDepartments?.map(
                            (department) => department.name
                          )}
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.department}
                              helperText={errors.department && "Required"}
                              label="Department"
                              name="department"
                            />
                          )}
                        />
                      )}
                    />
                    <TextField
                      required
                      id="supervisorName"
                      label="Supervisor"
                      error={!!errors.supervisorName}
                      helperText={errors.supervisorName && "Required"}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("supervisorName", { required: true })}
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
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", marginBottom: "1rem" }}
                >
                  Personal Details
                </Typography>
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
                              <TableCell align="center">{row.gender}</TableCell>
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
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#fff",
                    flex: { lg: 3, md: 1 },
                    borderRadius: "0.3rem",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", marginY: "0.5rem" }}
                  >
                    Accident Details
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <Controller
                      name="category"
                      control={control}
                      defaultValue={defaultValues?.category}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={accidentCategories?.map(
                            (category) => category.name
                          )}
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.category}
                              helperText={errors.category && "Required"}
                              label="Category"
                              name="category"
                            />
                          )}
                        />
                      )}
                    />
                    {categoryWatch && (
                      <Controller
                        name="subCategory"
                        control={control}
                        defaultValue={defaultValues?.subCategory}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            onChange={(event, newValue) =>
                              field.onChange(newValue)
                            }
                            size="small"
                            options={relatedSubCategories?.map(
                              (subCategory) => subCategory.name
                            )}
                            sx={{ flex: 1, margin: "0.5rem" }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                required
                                error={!!errors.subCategory}
                                helperText={errors.subCategory && "Required"}
                                label="Sub Category"
                                name="subCategory"
                              />
                            )}
                          />
                        )}
                      />
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <Controller
                      name="accidentType"
                      control={control}
                      defaultValue={defaultValues?.accidentType}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={accidentTypesOptions}
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.accidentType}
                              helperText={errors.accidentType && "Required"}
                              label="Accident Type"
                              name="accidentType"
                            />
                          )}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ margin: "0.5rem" }}>
                    <Controller
                      name="affectedPrimaryRegion"
                      control={control}
                      defaultValue={defaultValues?.affectedPrimaryRegion}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={Object.values(BodyPrimaryRegion)}
                          sx={{ flex: 1 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.affectedPrimaryRegion}
                              helperText={
                                errors.affectedPrimaryRegion && "Required"
                              }
                              label="Body Primary Region"
                              name="affectedPrimaryRegion"
                            />
                          )}
                        />
                      )}
                    />
                  </Box>

                  <Box sx={{ margin: "0.5rem" }}>
                    <Controller
                      name="affectedSecondaryRegion"
                      control={control}
                      defaultValue={defaultValues?.affectedSecondaryRegion}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={Object.values(BodyPrimaryRegion)}
                          sx={{ flex: 1 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.affectedSecondaryRegion}
                              helperText={
                                errors.affectedSecondaryRegion && "Required"
                              }
                              label="Body Secondary Region"
                              name="affectedSecondaryRegion"
                            />
                          )}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ margin: "0.5rem" }}>
                    <Controller
                      name="affectedTertiaryRegion"
                      control={control}
                      defaultValue={defaultValues?.affectedTertiaryRegion}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={Object.values(BodyPrimaryRegion)}
                          sx={{ flex: 1 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.affectedTertiaryRegion}
                              helperText={
                                errors.affectedTertiaryRegion && "Required"
                              }
                              label="Body Tertiary Region"
                              name="affectedTertiaryRegion"
                            />
                          )}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ display: "flex" }}>
                    <Controller
                      name="injuryCause"
                      control={control}
                      defaultValue={defaultValues?.injuryCause}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={Object.values(BodyPrimaryRegion)}
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.injuryCause}
                              helperText={errors.injuryCause && "Required"}
                              label="Injury Cause"
                              name="injuryCause"
                            />
                          )}
                        />
                      )}
                    />
                    <TextField
                      required
                      id="rootCause"
                      label="Cause"
                      error={!!errors.rootCause}
                      helperText={errors.rootCause && "Required"}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("rootCause", { required: true })}
                    />
                  </Box>
                  <Box sx={{ display: "flex" }}>
                    <TextField
                      required
                      id="consultedHospital"
                      label="Consulted Hospital"
                      error={!!errors.consultedHospital}
                      helperText={errors.consultedHospital && "Required"}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("consultedHospital", { required: true })}
                    />
                    <TextField
                      required
                      id="consultedDoctor"
                      label="Consulted Doctor"
                      error={!!errors.consultedDoctor}
                      helperText={errors.consultedDoctor && "Required"}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("consultedDoctor", { required: true })}
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
                      name={"workPerformed"}
                      render={({ field }) => {
                        return (
                          <RichTextComponent
                            onChange={(e) => field.onChange(e)}
                            placeholder={field.value ?? "Work Performed"}
                          />
                        );
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "0.3rem",
                      margin: "0.2rem",
                      border: errors.description
                        ? `1px solid ${theme.palette.error.main}`
                        : "none",
                      borderRadius: "0.5rem",
                    }}
                  >
                    <Controller
                      control={control}
                      name={"description"}
                      rules={{ required: true }}
                      render={({ field }) => {
                        return (
                          <RichTextComponent
                            onChange={(e) => field.onChange(e)}
                            placeholder={field.value ?? "Description"}
                          />
                        );
                      }}
                    />
                    {errors.description && (
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.error.main, ml: "0.5rem" }}
                      >
                        Required
                      </Typography>
                    )}
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
                      name={"actionTaken"}
                      render={({ field }) => {
                        return (
                          <RichTextComponent
                            onChange={(e) => field.onChange(e)}
                            placeholder={field.value ?? "Action Taken"}
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
                  {...register("accidentDate", { required: true })}
                  name={"accidentDate"}
                  render={({ field }) => {
                    return (
                      <DatePickerComponent
                        onChange={(e) => field.onChange(e)}
                        value={field.value}
                        label="Accident Date"
                        error={errors?.accidentDate ? "Required" : ""}
                      />
                    );
                  }}
                />
              </Box>
              <Box sx={{ margin: "0.5rem" }}>
                <Controller
                  control={control}
                  {...register("accidentTime", { required: true })}
                  name={"accidentTime"}
                  render={({ field }) => {
                    return (
                      <TimePickerComponent
                        onChange={(e) => field.onChange(e)}
                        value={field.value}
                        label="Accident Time"
                        error={errors?.accidentTime ? "Required" : ""}
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
                  Injury Type
                </Typography>
                <Controller
                  control={control}
                  name={"injuryType"}
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
                          value={InjuryType.FIRST_AID}
                          key={InjuryType.FIRST_AID}
                        >
                          <Typography variant="caption" component="div">
                            {InjuryType.FIRST_AID}
                          </Typography>
                        </ToggleButton>
                        <ToggleButton
                          value={InjuryType.REPORTABLE_ACCIDENT}
                          key={InjuryType.REPORTABLE_ACCIDENT}
                        >
                          <Typography variant="caption" component="div">
                            {InjuryType.REPORTABLE_ACCIDENT}
                          </Typography>
                        </ToggleButton>
                        <ToggleButton
                          value={InjuryType.NON_REPORTABLE_ACCIDENT}
                          key={InjuryType.NON_REPORTABLE_ACCIDENT}
                        >
                          <Typography variant="caption" component="div">
                            {InjuryType.NON_REPORTABLE_ACCIDENT}
                          </Typography>
                        </ToggleButton>
                      </ToggleButtonGroup>
                    );
                  }}
                />
              </Box>

              <Box
                sx={{
                  margin: "0.5rem",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
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
                        onChange={(e, value) => {
                          console.log("e", e);
                          field.onChange(value);
                        }}
                      >
                        <ToggleButton
                          value={Severity.MAJOR}
                          key={Severity.MAJOR}
                        >
                          <Typography variant="caption" component="div">
                            {Severity.MAJOR}
                          </Typography>
                        </ToggleButton>
                        <ToggleButton
                          value={Severity.MINOR}
                          key={Severity.MINOR}
                        >
                          <Typography variant="caption" component="div">
                            {Severity.MINOR}
                          </Typography>
                        </ToggleButton>
                      </ToggleButtonGroup>
                    );
                  }}
                />
              </Box>

              <Box sx={{ margin: "0.5rem" }}>
                <Controller
                  name="assignee"
                  control={control}
                  defaultValue={defaultValues?.assignee}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      size="small"
                      options={sampleAssignees?.map(
                        (category) => category.name
                      )}
                      sx={{ flex: 1, margin: "0.5rem" }}
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
