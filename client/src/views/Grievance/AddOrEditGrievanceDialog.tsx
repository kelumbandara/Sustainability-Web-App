import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Alert,
  Autocomplete,
  Box,
  CircularProgress,
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
  Typography,
} from "@mui/material";
import useIsMobile from "../../customHooks/useIsMobile";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import DropzoneComponent from "../../components/DropzoneComponent";
import { grey } from "@mui/material/colors";
import CustomButton from "../../components/CustomButton";
import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import theme from "../../theme";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RichTextComponent from "../../components/RichTextComponent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useQuery } from "@tanstack/react-query";
import { fetchDepartmentData } from "../../api/departmentApi";
import { StorageFile } from "../../utils/StorageFiles.util";
import {
  fetchGrievanceSubmissions,
  fetchGrievanceTopic,
  Frequency,
  Grievance,
  GrievanceCategory,
  GrievanceChannel,
  GrievanceCommitteeMemberDetails,
  GrievanceEmployeeShift,
  GrievanceLegalAdvisorDetails,
  GrievanceNomineeDetails,
  GrievancePersonType,
  GrievanceRespondentDetails,
  GrievanceStatus,
  GrievanceType,
  HumanRightViolation,
  Scale,
} from "../../api/Grievance/grievanceApi";
import DeskIcon from "@mui/icons-material/Desk";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { Gender } from "../../api/OccupationalHealth/patientApi";
import {
  AddNewGrievanceTopicButton,
  AddNewTopicDialog,
} from "./AddNewTopicDialog";
import {
  AddNewGrievanceSubmissionButton,
  AddNewSubmissionDialog,
} from "./AddNewSubmissionDialog";
import AddOrEditRespondentDialog from "./AddOrEditRespondentDialog";
import AddOrEditCommitteeMemberDialog from "./AddOrEditCommitteeMemberDialog";
import AddOrEditNomineeDialog from "./AddOrEditNomineeDialog";
import AddOrEditLegalAdvisorDialog from "./AddOrEditLegalAdvisorDialog";
import { ExistingFileItemsEdit } from "../../components/ExistingFileItemsEdit";
import DatePickerComponent from "../../components/DatePickerComponent";
import UserAutoComplete from "../../components/UserAutoComplete";
import { fetchGrievanceAssignee } from "../../api/userApi";
import { fetchDivision } from "../../api/divisionApi";
import { DrawerContentItem } from "../../components/ViewDataDrawer";
import { getSeverityLevel } from "./GrievanceUtils";
import FormDataSwitchButton from "../../components/FormDataSwitchButton";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: Grievance;
  grievanceType: GrievanceType;
  onSubmit?: (data: Grievance) => void;
  isLoading?: boolean;
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

export default function AddOrEditGrievanceDialog({
  open,
  handleClose,
  defaultValues,
  grievanceType,
  onSubmit,
  isLoading,
}: DialogProps) {
  const { isMobile, isTablet } = useIsMobile();
  const [evidence, setEvidence] = useState<File[]>([]);
  const [existingEvidence, setExistingEvidence] = useState<StorageFile[]>(
    defaultValues?.evidence as StorageFile[]
  );
  const [removeEvidence, setEvidenceToRemove] = useState<string[]>([]);
  const [statements, setStatements] = useState<File[]>([]);
  const [existingStatements, setExistingStatements] = useState<StorageFile[]>(
    defaultValues?.statementDocuments as StorageFile[]
  );
  const [removeStatementsDocuments, setStatementsToRemove] = useState<string[]>(
    []
  );

  const [
    investigationCommitteeStatements,
    setInvestigationCommitteeStatements,
  ] = useState<File[]>([]);
  const [
    existingInvestigationCommitteeStatements,
    setExistingInvestigationCommitteeStatements,
  ] = useState<StorageFile[]>(
    defaultValues?.investigationCommitteeStatementDocuments as StorageFile[]
  );
  const [
    investigationCommitteeStatementsToRemove,
    setInvestigationCommitteeStatementsToRemove,
  ] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState(0);
  const [addTopicDialogOpen, setAddTopicDialogOpen] = useState(false);
  const [addSubmissionDialog, setAddSubmissionDialog] = useState(false);

  const [selectedRespondent, setSelectedRespondent] =
    useState<GrievanceRespondentDetails>(null);
  const [addRespondentDialogOpen, setAddRespondentDialogOpen] = useState(false);

  const [selectedCommitteeMember, setSelectedCommitteeMember] =
    useState<GrievanceCommitteeMemberDetails>(null);
  const [addCommitteeMemberDialogOpen, setAddCommitteeMemberDialogOpen] =
    useState(false);

  const [selectedNominee, setSelectedNominee] =
    useState<GrievanceNomineeDetails>(null);
  const [addNomineeDialogOpen, setAddNomineeDialogOpen] = useState(false);

  const [selectedLegalAdvisor, setSelectedLegalAdvisor] =
    useState<GrievanceLegalAdvisorDetails>(null);
  const [addLegalAdvisorDialogOpen, setAddLegalAdvisorDialogOpen] =
    useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm<Grievance>({
    defaultValues: {
      evidence: [],
      ...defaultValues,
      isAnonymous: defaultValues?.isAnonymous ? 1 : 0,
      isAppeal: defaultValues?.isAppeal ? 1 : 0,
      isFollowUp: defaultValues?.isFollowUp ? 1 : 0,
      isIssuesPreviouslyRaised: defaultValues?.isIssuesPreviouslyRaised ? 1 : 0,
    },
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const respondentWatch = watch("respondents");
  const committeeMemberWatch = watch("committeeMembers");
  const nomineeWatch = watch("nominees");
  const legalAdvisorWatch = watch("legalAdvisors");
  const humanRightsViolationWatch = watch("humanRightsViolation");
  const frequencyRateWatch = watch("frequencyRate");
  const scaleWatch = watch("scale");
  const assignee = watch("assignee");
  const personTypeWatch = watch("personType");
  const isAnonymousWatch = watch("isAnonymous");

  const severityScoreValue = useMemo(() => {
    if (!humanRightsViolationWatch || !frequencyRateWatch || !scaleWatch) {
      return null;
    }
    return getSeverityLevel(
      humanRightsViolationWatch,
      scaleWatch,
      frequencyRateWatch
    );
  }, [humanRightsViolationWatch, scaleWatch, frequencyRateWatch]);

  const { data: assigneeData } = useQuery({
    queryKey: ["gr-assignee"],
    queryFn: fetchGrievanceAssignee,
  });

  const { data: divisionData } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  const resetForm = () => {
    reset();
    setEvidence([]);
    setStatements([]);
    setInvestigationCommitteeStatements([]);
  };

  const { data: departmentData } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartmentData,
  });

  const { data: grievanceTopicData } = useQuery({
    queryKey: ["grievance-topics"],
    queryFn: fetchGrievanceTopic,
  });

  const { data: grievanceSubmissionsData } = useQuery({
    queryKey: ["grievance-submissions"],
    queryFn: fetchGrievanceSubmissions,
  });

  const handleSubmitGrievanceRecord = (data: Grievance) => {
    const submitData: Partial<Grievance> = data;
    submitData.assigneeId = assignee?.id;
    if (!defaultValues || defaultValues.status === GrievanceStatus.draft) {
      submitData.status = GrievanceStatus.draft;
    }
    if (defaultValues?.status === GrievanceStatus.open) {
      submitData.status = GrievanceStatus.inprogress;
    }
    submitData.type = grievanceType;

    if (defaultValues) {
      submitData.id = defaultValues.id;
    }

    if (data.isAnonymous) {
      submitData.isAnonymous = 1;
    } else {
      submitData.isAnonymous = 0;
    }

    if (data.isAppeal) {
      submitData.isAppeal = 1;
    } else {
      submitData.isAppeal = 0;
    }

    if (data.isFollowUp) {
      submitData.isFollowUp = 1;
    } else {
      submitData.isFollowUp = 0;
    }

    if (data.isIssuesPreviouslyRaised) {
      submitData.isIssuesPreviouslyRaised = 1;
    } else {
      submitData.isIssuesPreviouslyRaised = 0;
    }

    submitData.evidence = evidence;
    if (removeEvidence?.length > 0) submitData.removeEvidence = removeEvidence;

    submitData.statementDocuments = statements;
    if (removeStatementsDocuments?.length > 0)
      submitData.removeStatementsDocuments = removeStatementsDocuments;
    submitData.investigationCommitteeStatementDocuments =
      investigationCommitteeStatements;
    if (investigationCommitteeStatementsToRemove?.length > 0)
      submitData.removeInvestigationCommitteeStatementDocuments =
        investigationCommitteeStatementsToRemove;
    console.log("submitData", JSON.stringify(submitData));
    onSubmit(submitData as Grievance);
  };

  const isPersonalAndEmploymentDetailsValid = useMemo(() => {
    return !errors.personType && !errors.name && !errors.gender;
  }, [errors.personType, errors.name, errors.gender]);

  const isHelpdeskDetailsValid = useMemo(() => {
    if (
      grievanceType === GrievanceType.appreciation ||
      grievanceType === GrievanceType.suggestion ||
      grievanceType === GrievanceType.question
    ) {
      return (
        !errors.channel &&
        !errors.category &&
        !errors.helpDeskPerson &&
        !errors.responsibleDepartment
      );
    } else {
      return (
        !errors.channel &&
        !errors.category &&
        !errors.helpDeskPerson &&
        !errors.responsibleDepartment &&
        !errors.humanRightsViolation &&
        !errors.frequencyRate &&
        !errors.scale
      );
    }
  }, [
    errors.channel,
    errors.category,
    errors.helpDeskPerson,
    errors.responsibleDepartment,
    errors.humanRightsViolation,
    errors.frequencyRate,
    errors.scale,
    grievanceType,
  ]);

  const triggerPersonalAndEmploymentSection = () => {
    trigger(["personType", "name", "gender"]);
  };

  const triggerHelpdeskDetailsSection = () => {
    if (
      grievanceType === GrievanceType.appreciation ||
      grievanceType === GrievanceType.suggestion ||
      grievanceType === GrievanceType.question
    ) {
      trigger([
        "channel",
        "category",
        "helpDeskPerson",
        "responsibleDepartment",
      ]);
    } else {
      trigger([
        "channel",
        "category",
        "helpDeskPerson",
        "responsibleDepartment",
        "humanRightsViolation",
        "frequencyRate",
        "scale",
      ]);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (activeTab === 0) {
      triggerPersonalAndEmploymentSection();
    } else if (activeTab === 1) {
      triggerHelpdeskDetailsSection();
    }
    setActiveTab(newValue);
  };

  const isShowSolutionTab = useMemo(() => {
    return defaultValues && defaultValues.status !== GrievanceStatus.draft;
  }, [defaultValues]);

  const isShowPersonalAndEmploymentDetailsTab = useMemo(() => {
    return (
      !defaultValues || (defaultValues && defaultValues.isAnonymous === false)
      // (defaultValues && defaultValues.createdByUserId === user.id)
    );
  }, [defaultValues]);

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
            maxHeight: "100vh",
            overflowY: "hidden",
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
              ? `Edit ${
                  grievanceType === GrievanceType.appreciation ? "an" : "a"
                } ${grievanceType}`
              : `Report ${
                  grievanceType === GrievanceType.appreciation ? "an" : "a"
                } ${grievanceType}`}
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
                      isPersonalAndEmploymentDetailsValid &&
                      isHelpdeskDetailsValid
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
                {isShowPersonalAndEmploymentDetailsTab && (
                  <Tab
                    label={
                      <Box
                        sx={{
                          color: isPersonalAndEmploymentDetailsValid
                            ? "var(--pallet-blue)"
                            : "var(--pallet-red)",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <TextSnippetIcon fontSize="small" />
                        <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                          Personal and Employement Details
                        </Typography>
                        {!isPersonalAndEmploymentDetailsValid && (
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
                    tabIndex={0}
                  />
                )}
                <Tab
                  label={
                    <Box
                      sx={{
                        color: isHelpdeskDetailsValid
                          ? "var(--pallet-blue)"
                          : "var(--pallet-red)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <DeskIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Helpdesk Details
                      </Typography>{" "}
                      {!isHelpdeskDetailsValid && (
                        <Typography
                          variant="subtitle1"
                          sx={{ ml: "0.3rem", color: "var(--pallet-red)" }}
                        >
                          *
                        </Typography>
                      )}
                    </Box>
                  }
                  {...a11yProps(isShowPersonalAndEmploymentDetailsTab ? 1 : 0)}
                  tabIndex={isShowPersonalAndEmploymentDetailsTab ? 1 : 0}
                />
                {isShowSolutionTab && (
                  <Tab
                    label={
                      <Box
                        sx={{
                          color: isHelpdeskDetailsValid
                            ? "var(--pallet-blue)"
                            : "var(--pallet-red)",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <LightbulbIcon fontSize="small" />
                        <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                          Solution
                        </Typography>{" "}
                        {!isHelpdeskDetailsValid && (
                          <Typography
                            variant="subtitle1"
                            sx={{ ml: "0.3rem", color: "var(--pallet-red)" }}
                          >
                            *
                          </Typography>
                        )}
                      </Box>
                    }
                    {...a11yProps(
                      isShowPersonalAndEmploymentDetailsTab ? 2 : 1
                    )}
                    tabIndex={isShowPersonalAndEmploymentDetailsTab ? 2 : 1}
                  />
                )}
              </Tabs>
              {isShowPersonalAndEmploymentDetailsTab && (
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
                    <Alert severity="info" sx={{ margin: "0.5rem" }}>
                      If the grievance is anonymous, the personal and employment
                      details will not be able to edit or view. This is a one
                      time action. If you want to change the personal and
                      employment details, please create a new grievance.
                    </Alert>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                      }}
                    >
                      <Controller
                        name="personType"
                        control={control}
                        defaultValue={defaultValues?.personType ?? null}
                        {...register("personType", { required: true })}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            onChange={(event, newValue) =>
                              field.onChange(newValue)
                            }
                            size="small"
                            options={Object.values(GrievancePersonType).map(
                              (personType) => personType
                            )}
                            sx={{ flex: 1, margin: "0.5rem" }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                required
                                error={!!errors.personType}
                                helperText={errors.personType && "Required"}
                                label="Person Type"
                                name="personType"
                              />
                            )}
                          />
                        )}
                      />
                      <Controller
                        name="gender"
                        control={control}
                        defaultValue={defaultValues?.gender ?? null}
                        {...register("gender", { required: true })}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            onChange={(event, newValue) =>
                              field.onChange(newValue)
                            }
                            size="small"
                            options={Object.values(Gender).map(
                              (gender) => gender
                            )}
                            sx={{ flex: 1, margin: "0.5rem" }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                required
                                error={!!errors.gender}
                                helperText={errors.gender && "Required"}
                                label="Gender"
                                name="gender"
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
                        required
                        id="name"
                        label="name"
                        error={!!errors.name}
                        helperText={errors.name && "Required"}
                        size="small"
                        sx={{ flex: 1, margin: "0.5rem" }}
                        {...register("name", { required: true })}
                      />
                      {personTypeWatch === GrievancePersonType.employee && (
                        <TextField
                          required
                          id="employeeId"
                          label="Employee ID"
                          size="small"
                          sx={{ flex: 1, margin: "0.5rem" }}
                          {...register("employeeId")}
                        />
                      )}
                    </Box>
                    {personTypeWatch === GrievancePersonType.employee && (
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                          }}
                        >
                          <Controller
                            name="employeeShift"
                            control={control}
                            defaultValue={defaultValues?.employeeShift ?? null}
                            {...register("employeeShift")}
                            render={({ field }) => (
                              <Autocomplete
                                {...field}
                                onChange={(event, newValue) =>
                                  field.onChange(newValue)
                                }
                                size="small"
                                options={Object.values(
                                  GrievanceEmployeeShift
                                ).map((shift) => shift)}
                                sx={{ flex: 1, margin: "0.5rem" }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Employee Shift"
                                    name="employeeShift"
                                  />
                                )}
                              />
                            )}
                          />
                          <TextField
                            id="tenureSplit"
                            label="Tenure Split"
                            size="small"
                            sx={{ flex: 1, margin: "0.5rem" }}
                            {...register("tenureSplit")}
                          />
                        </Box>
                      </>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                      }}
                    >
                      <Box sx={{ flex: 1, margin: "0.5rem" }}>
                        <Controller
                          control={control}
                          {...register("dateOfJoin")}
                          name={"dateOfJoin"}
                          render={({ field }) => {
                            return (
                              <DatePickerComponent
                                onChange={(e) => field.onChange(e)}
                                value={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                label="Date of Join"
                              />
                            );
                          }}
                        />
                      </Box>
                      <TextField
                        id="servicePeriod"
                        label="Service Period"
                        size="small"
                        sx={{ flex: 1, margin: "0.5rem", marginTop: "1.8rem" }}
                        {...register("servicePeriod")}
                      />
                    </Box>
                    {(grievanceType === GrievanceType.complaint ||
                      grievanceType === GrievanceType.grievance) && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: isMobile ? "column" : "row",
                        }}
                      >
                        <TextField
                          id="supervisor"
                          label="Supervisor"
                          size="small"
                          sx={{ flex: 1, margin: "0.5rem" }}
                          {...register("supervisor")}
                        />
                        <TextField
                          id="location"
                          label="Location"
                          size="small"
                          sx={{ flex: 1, margin: "0.5rem" }}
                          {...register("location")}
                        />
                      </Box>
                    )}
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
              )}
              <TabPanel
                value={activeTab}
                index={isShowPersonalAndEmploymentDetailsTab ? 1 : 0}
                dir={theme.direction}
              >
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
                      name="channel"
                      control={control}
                      defaultValue={defaultValues?.channel ?? null}
                      {...register("channel", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={Object.values(GrievanceChannel).map(
                            (channel) => channel
                          )}
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.channel}
                              helperText={errors.channel && "Required"}
                              label="Channel"
                              name="channel"
                            />
                          )}
                        />
                      )}
                    />
                    <Controller
                      name="category"
                      control={control}
                      defaultValue={defaultValues?.category ?? null}
                      {...register("category", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={Object.values(GrievanceCategory).map(
                            (category) => category
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
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <Controller
                      name="topic"
                      control={control}
                      // defaultValue={defaultValues?.topic ?? null}
                      {...register("topic", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          size="small"
                          noOptionsText={
                            <>
                              <Typography
                                variant="body2"
                                color="inherit"
                                gutterBottom
                              >
                                No matching Items
                              </Typography>
                            </>
                          }
                          options={[
                            ...(grievanceTopicData?.length
                              ? grievanceTopicData.map(
                                  (topic) => topic.topicName
                                )
                              : []),
                            "$ADD_NEW_TOPIC",
                          ]}
                          // getOptionLabel={(option) => option.topicName || ""}
                          // onChange={(_, data) => {
                          //   setValue("topic", data.topicName);
                          // }}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderOption={(props, option) => (
                            <>
                              {option === "$ADD_NEW_TOPIC" ? (
                                <AddNewGrievanceTopicButton
                                  {...props}
                                  onMouseDown={() =>
                                    setAddTopicDialogOpen(true)
                                  }
                                />
                              ) : (
                                <li {...props} key={option}>
                                  {option}
                                </li>
                              )}
                            </>
                          )}
                          renderInput={(params) => (
                            <TextField
                              required
                              {...params}
                              error={!!errors.topic}
                              label="Grievance Topic"
                              name="topic"
                            />
                          )}
                        />
                      )}
                    />

                    <Controller
                      name="submissions"
                      control={control}
                      // defaultValue={defaultValues?.submissions ?? null}
                      {...register("submissions", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          size="small"
                          noOptionsText={
                            <>
                              <Typography
                                variant="body2"
                                color="inherit"
                                gutterBottom
                              >
                                No matching Items
                              </Typography>
                            </>
                          }
                          options={[
                            ...(grievanceSubmissionsData?.length
                              ? grievanceSubmissionsData.map(
                                  (submission) => submission.submissionName
                                )
                              : []),
                            "$ADD_NEW_SUBMISSION",
                          ]}
                          // getOptionLabel={(option) =>
                          //   option.submissionName || ""
                          // }
                          // onChange={(_, data) => {
                          //   setValue("submissions", data?.submissionName || "");
                          // }}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderOption={(props, option) => (
                            <>
                              {option === "$ADD_NEW_SUBMISSION" ? (
                                <AddNewGrievanceSubmissionButton
                                  {...props}
                                  onMouseDown={() =>
                                    setAddSubmissionDialog(true)
                                  }
                                />
                              ) : (
                                <li {...props} key={option}>
                                  {option}
                                </li>
                              )}
                            </>
                          )}
                          renderInput={(params) => (
                            <TextField
                              required
                              {...params}
                              error={!!errors.topic}
                              label="Grievance Submission"
                              name="topic"
                            />
                          )}
                        />
                      )}
                    />
                  </Box>

                  <Box
                    sx={{
                      margin: "0.5rem",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                    >
                      Description
                    </Typography>
                    <Controller
                      control={control}
                      name={"description"}
                      {...register("description")}
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
                      margin: "0.5rem",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                    >
                      Remarks
                    </Typography>
                    <Controller
                      control={control}
                      name={"remarks"}
                      {...register("remarks")}
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
                    }}
                  >
                    <TextField
                      required
                      id="helpdeskPerson"
                      label="Helpdesk Person"
                      error={!!errors.helpDeskPerson}
                      helperText={errors.helpDeskPerson && "Required"}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("helpDeskPerson", { required: true })}
                    />
                    <Controller
                      name="responsibleDepartment"
                      control={control}
                      defaultValue={defaultValues?.responsibleDepartment ?? ""}
                      {...register("responsibleDepartment", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={
                            departmentData?.length
                              ? departmentData.map(
                                  (department) => department.department
                                )
                              : []
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.responsibleDepartment}
                              helperText={
                                errors.responsibleDepartment && "Required"
                              }
                              label="Responsible Department"
                              name="responsibleDepartment"
                            />
                          )}
                        />
                      )}
                    />
                  </Box>
                  {(grievanceType === GrievanceType.complaint ||
                    grievanceType === GrievanceType.grievance) && (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: isMobile ? "column" : "row",
                        }}
                      >
                        <Controller
                          name="humanRightsViolation"
                          control={control}
                          defaultValue={
                            defaultValues?.humanRightsViolation ?? null
                          }
                          {...register("humanRightsViolation", {
                            required: true,
                          })}
                          render={({ field }) => (
                            <Autocomplete
                              {...field}
                              onChange={(event, newValue) =>
                                field.onChange(newValue)
                              }
                              size="small"
                              options={Object.values(HumanRightViolation).map(
                                (violation) => violation
                              )}
                              sx={{ flex: 1, margin: "0.5rem" }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  required
                                  error={!!errors.humanRightsViolation}
                                  helperText={
                                    errors.humanRightsViolation && "Required"
                                  }
                                  label="Human Rights Violation"
                                  name="humanRightsViolation"
                                />
                              )}
                            />
                          )}
                        />
                        <Controller
                          name="scale"
                          control={control}
                          defaultValue={defaultValues?.scale ?? null}
                          {...register("scale", { required: true })}
                          render={({ field }) => (
                            <Autocomplete
                              {...field}
                              onChange={(event, newValue) =>
                                field.onChange(newValue)
                              }
                              size="small"
                              options={Object.values(Scale).map(
                                (scale) => scale
                              )}
                              sx={{ flex: 1, margin: "0.5rem" }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  required
                                  error={!!errors.scale}
                                  helperText={errors.scale && "Required"}
                                  label="Scale"
                                  name="scale"
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
                        <Controller
                          name="frequencyRate"
                          control={control}
                          defaultValue={defaultValues?.frequencyRate ?? null}
                          {...register("frequencyRate", { required: true })}
                          render={({ field }) => (
                            <Autocomplete
                              {...field}
                              onChange={(event, newValue) =>
                                field.onChange(newValue)
                              }
                              size="small"
                              options={Object.values(Frequency).map(
                                (frequency) => frequency
                              )}
                              sx={{ flex: 1, margin: "0.5rem" }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  required
                                  error={!!errors.frequencyRate}
                                  helperText={
                                    errors.frequencyRate && "Required"
                                  }
                                  label="Frequency Rate"
                                  name="frequencyRate"
                                />
                              )}
                            />
                          )}
                        />
                        <DrawerContentItem
                          label="Severity Score"
                          value={severityScoreValue}
                          sx={{ flex: 1 }}
                        />
                      </Box>{" "}
                    </>
                  )}
                  <ExistingFileItemsEdit
                    label="Existing evidence"
                    files={existingEvidence}
                    sx={{ marginY: "1rem" }}
                    handleRemoveItem={(file) => {
                      setEvidenceToRemove([...removeEvidence, file.gsutil_uri]);
                      setExistingEvidence(
                        existingEvidence.filter(
                          (f) => f.gsutil_uri !== file.gsutil_uri
                        )
                      );
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      margin: "0.5rem",
                    }}
                  >
                    <DropzoneComponent
                      files={evidence}
                      setFiles={setEvidence}
                      dropzoneLabel={"Drop Your Evidence Here"}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      margin: "0.5rem",
                      justifyContent: "space-between",
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
                    {isShowSolutionTab && (
                      <CustomButton
                        variant="contained"
                        sx={{
                          backgroundColor: "var(--pallet-blue)",
                        }}
                        size="medium"
                        onClick={() => {
                          handleTabChange(null, 2);
                        }}
                        endIcon={<ArrowForwardIcon />}
                      >
                        Next
                      </CustomButton>
                    )}
                  </Box>
                </Stack>
              </TabPanel>
              {isShowSolutionTab && (
                <TabPanel
                  value={activeTab}
                  index={isShowPersonalAndEmploymentDetailsTab ? 2 : 1}
                  dir={theme.direction}
                >
                  <Box>
                    <Controller
                      control={control}
                      name="isIssuesPreviouslyRaised"
                      defaultValue={0 as 0 | 1}
                      render={({ field }) => (
                        <FormDataSwitchButton
                          label="Is Issues Previously Raised?"
                          onChange={field.onChange}
                          value={field.value as 0 | 1}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ marginX: "0.5rem", marginY: "1rem" }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                    >
                      Respondent Details
                    </Typography>
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
                            setSelectedRespondent(null);
                            setAddRespondentDialogOpen(true);
                          }}
                        >
                          Add Respondent
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
                            <TableCell align="center">Designation</TableCell>
                            <TableCell align="center">Department</TableCell>
                            <TableCell align="center"></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {respondentWatch?.length > 0 ? (
                            respondentWatch?.map((row) => (
                              <TableRow
                                // key={`${row.id}`}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                  cursor: "pointer",
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
                                  {row.designation}
                                </TableCell>
                                <TableCell align="center">
                                  {row.department}
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    onClick={() => {
                                      setSelectedRespondent(row);
                                      setAddRespondentDialogOpen(true);
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => {
                                      setValue(
                                        "respondents",
                                        (respondentWatch ?? []).filter(
                                          (item) =>
                                            item.respondentId !==
                                            row.respondentId
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
                  </Box>
                  <Box sx={{ marginX: "0.5rem", marginY: "1rem" }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                    >
                      Committee Member Details
                    </Typography>
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
                            setSelectedNominee(null);
                            setAddCommitteeMemberDialogOpen(true);
                          }}
                        >
                          Add Member
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
                            <TableCell align="center">Designation</TableCell>
                            <TableCell align="center">Department</TableCell>
                            <TableCell align="center"></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {committeeMemberWatch?.length > 0 ? (
                            committeeMemberWatch?.map((row) => (
                              <TableRow
                                // key={`${row.id}`}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                  cursor: "pointer",
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
                                  {row.designation}
                                </TableCell>
                                <TableCell align="center">
                                  {row.department}
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    onClick={() => {
                                      setSelectedCommitteeMember(row);
                                      setAddCommitteeMemberDialogOpen(true);
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => {
                                      setValue(
                                        "committeeMembers",
                                        (committeeMemberWatch ?? []).filter(
                                          (item) =>
                                            item.memberId !== row.memberId
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
                  </Box>
                  <Box sx={{ marginX: "0.5rem", marginY: "1rem" }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                    >
                      Nominee Details
                    </Typography>
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
                            setSelectedNominee(null);
                            setAddNomineeDialogOpen(true);
                          }}
                        >
                          Add Nominee
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
                            <TableCell align="center">Designation</TableCell>
                            <TableCell align="center">Department</TableCell>
                            <TableCell align="center"></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {nomineeWatch?.length > 0 ? (
                            nomineeWatch?.map((row) => (
                              <TableRow
                                // key={`${row.id}`}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                  cursor: "pointer",
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
                                  {row.designation}
                                </TableCell>
                                <TableCell align="center">
                                  {row.department}
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    onClick={() => {
                                      setSelectedNominee(row);
                                      setAddNomineeDialogOpen(true);
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => {
                                      setValue(
                                        "nominees",
                                        (nomineeWatch ?? []).filter(
                                          (item) =>
                                            item.nomineeId !== row.nomineeId
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
                  </Box>
                  <Box sx={{ marginX: "0.5rem", marginY: "1rem" }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                    >
                      Legal Advisor Details
                    </Typography>
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
                            setSelectedLegalAdvisor(null);
                            setAddLegalAdvisorDialogOpen(true);
                          }}
                        >
                          Add Advisor
                        </Button>
                      </Box>
                      <Table aria-label="simple table">
                        <TableHead
                          sx={{
                            backgroundColor: "var(--pallet-lighter-grey)",
                          }}
                        >
                          <TableRow>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Phone</TableCell>
                            <TableCell align="center"></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {legalAdvisorWatch?.length > 0 ? (
                            legalAdvisorWatch?.map((row) => (
                              <TableRow
                                // key={`${row.id}`}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                  cursor: "pointer",
                                }}
                              >
                                <TableCell
                                  component="th"
                                  scope="row"
                                  align="center"
                                >
                                  {row.name}
                                </TableCell>
                                <TableCell align="center">
                                  {row.email}
                                </TableCell>
                                <TableCell align="center">
                                  {row.phone}
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    onClick={() => {
                                      setSelectedLegalAdvisor(row);
                                      setAddLegalAdvisorDialogOpen(true);
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => {
                                      setValue(
                                        "legalAdvisors",
                                        (legalAdvisorWatch ?? []).filter(
                                          (item) =>
                                            item.legalAdvisorId !==
                                            row.legalAdvisorId
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
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <TextField
                      id="tradeUnionRepresentative"
                      label="Trade Union Representative"
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("tradeUnionRepresentative")}
                    />
                  </Box>
                  <Box
                    sx={{
                      margin: "0.5rem",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                    >
                      Grievant Statement
                    </Typography>
                    <Controller
                      control={control}
                      name={"grievantStatement"}
                      {...register("grievantStatement")}
                      render={({ field }) => {
                        return (
                          <RichTextComponent
                            onChange={(e) => field.onChange(e)}
                            placeholder={field.value ?? "Grievant Statement"}
                          />
                        );
                      }}
                    />
                  </Box>
                  <ExistingFileItemsEdit
                    label="Existing Statements"
                    files={existingStatements}
                    sx={{ marginY: "1rem" }}
                    handleRemoveItem={(file) => {
                      setStatementsToRemove([
                        ...removeStatementsDocuments,
                        file.gsutil_uri,
                      ]);
                      setExistingStatements(
                        existingStatements.filter(
                          (f) => f.gsutil_uri !== file.gsutil_uri
                        )
                      );
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      margin: "0.5rem",
                    }}
                  >
                    <DropzoneComponent
                      files={statements}
                      setFiles={setStatements}
                      dropzoneLabel={"Drop Your Statement Here"}
                    />
                  </Box>
                  <ExistingFileItemsEdit
                    label="Existing Investigation Committee Statements"
                    files={existingInvestigationCommitteeStatements}
                    sx={{ marginY: "1rem" }}
                    handleRemoveItem={(file) => {
                      setInvestigationCommitteeStatementsToRemove([
                        ...investigationCommitteeStatementsToRemove,
                        file.gsutil_uri,
                      ]);
                      setExistingInvestigationCommitteeStatements(
                        existingInvestigationCommitteeStatements.filter(
                          (f) => f.gsutil_uri !== file.gsutil_uri
                        )
                      );
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      margin: "0.5rem",
                    }}
                  >
                    <DropzoneComponent
                      files={investigationCommitteeStatements}
                      setFiles={setInvestigationCommitteeStatements}
                      dropzoneLabel={"Drop Your Statement Here"}
                    />
                  </Box>
                  <Box
                    sx={{
                      margin: "0.5rem",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                    >
                      Committee Statement
                    </Typography>
                    <Controller
                      control={control}
                      name={"committeeStatement"}
                      {...register("committeeStatement")}
                      render={({ field }) => {
                        return (
                          <RichTextComponent
                            onChange={(e) => field.onChange(e)}
                            placeholder={field.value ?? "Committee Statement"}
                          />
                        );
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      margin: "0.5rem",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                    >
                      Solution Provided
                    </Typography>
                    <Controller
                      control={control}
                      name={"solutionProvided"}
                      {...register("solutionProvided")}
                      render={({ field }) => {
                        return (
                          <RichTextComponent
                            onChange={(e) => field.onChange(e)}
                            placeholder={field.value ?? "Solution Provided"}
                          />
                        );
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      margin: "0.5rem",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                    >
                      Solution Remarks
                    </Typography>
                    <Controller
                      control={control}
                      name={"solutionRemark"}
                      {...register("solutionRemark")}
                      render={({ field }) => {
                        return (
                          <RichTextComponent
                            onChange={(e) => field.onChange(e)}
                            placeholder={field.value ?? "Solution Remarks"}
                          />
                        );
                      }}
                    />
                  </Box>
                  <Box sx={{ margin: "0.5rem" }}>
                    <Controller
                      control={control}
                      name="isFollowUp"
                      defaultValue={0 as 0 | 1}
                      render={({ field }) => (
                        <FormDataSwitchButton
                          label="Follow Up?"
                          onChange={field.onChange}
                          value={field.value as 0 | 1}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ margin: "0.5rem" }}>
                    <Controller
                      control={control}
                      name="isAppeal"
                      defaultValue={0 as 0 | 1}
                      render={({ field }) => (
                        <FormDataSwitchButton
                          label="Appeal?"
                          onChange={field.onChange}
                          value={field.value as 0 | 1}
                        />
                      )}
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
                        handleTabChange(null, 1);
                      }}
                      startIcon={<ArrowBackIcon />}
                    >
                      Previous
                    </CustomButton>
                  </Box>
                </TabPanel>
              )}
            </Box>
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
                  {...register("submissionDate", { required: true })}
                  name={"submissionDate"}
                  render={({ field }) => {
                    return (
                      <DatePickerComponent
                        onChange={(e) => field.onChange(e)}
                        value={field.value ? new Date(field.value) : undefined}
                        label="Submission Date"
                        error={errors?.submissionDate ? "Required" : ""}
                        disablePast={true}
                      />
                    );
                  }}
                />
              </Box>
              <Box sx={{ margin: "0.5rem" }}>
                <Controller
                  control={control}
                  {...register("dueDate", { required: true })}
                  name={"dueDate"}
                  render={({ field }) => {
                    return (
                      <DatePickerComponent
                        onChange={(e) => field.onChange(e)}
                        value={field.value ? new Date(field.value) : undefined}
                        label="Due Date"
                        error={errors?.dueDate ? "Required" : ""}
                        disablePast={true}
                      />
                    );
                  }}
                />
              </Box>
              <Box sx={{ margin: "0.5rem" }}>
                <Autocomplete
                  {...register("businessUnit", { required: true })}
                  size="small"
                  options={
                    divisionData?.length
                      ? divisionData.map(
                          (businessUnit) => businessUnit.divisionName
                        )
                      : []
                  }
                  defaultValue={defaultValues?.businessUnit}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={!!errors.businessUnit}
                      helperText={errors.businessUnit ? "Required" : ""}
                      label="Business Unit"
                      name="businessUnit"
                    />
                  )}
                />
              </Box>
              <Box>
                <UserAutoComplete
                  name="assignee"
                  label="Assignee"
                  control={control}
                  register={register}
                  errors={errors}
                  userData={assigneeData}
                  defaultValue={defaultValues?.assignee}
                  required={true}
                />
              </Box>
              {defaultValues &&
                defaultValues.status !== GrievanceStatus.draft && (
                  <Box sx={{ margin: "0.5rem" }}>
                    <Controller
                      control={control}
                      {...register("resolutionDate")}
                      name={"resolutionDate"}
                      render={({ field }) => {
                        return (
                          <DatePickerComponent
                            onChange={(e) => field.onChange(e)}
                            value={
                              field.value ? new Date(field.value) : undefined
                            }
                            label="Resolution Date"
                            disablePast={true}
                          />
                        );
                      }}
                    />
                  </Box>
                )}
              <Box sx={{ margin: "0.5rem" }}>
                {defaultValues?.isAnonymous ? (
                  <Alert severity="info">This is an anonymous grievance.</Alert>
                ) : (
                  <Controller
                    control={control}
                    name="isAnonymous"
                    defaultValue={0 as 0 | 1}
                    render={({ field }) => (
                      <FormDataSwitchButton
                        label="Is Anonymous?"
                        onChange={field.onChange}
                        value={field.value as 0 | 1}
                      />
                    )}
                  />
                )}
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
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={24} /> : null}
            onClick={handleSubmit((data) => {
              handleSubmitGrievanceRecord(data);
            })}
          >
            {defaultValues ? "Update Changes" : `Submit ${grievanceType}`}
          </CustomButton>
        </DialogActions>
      </Dialog>
      {addTopicDialogOpen && (
        <AddNewTopicDialog
          open={addTopicDialogOpen}
          setOpen={setAddTopicDialogOpen}
        />
      )}
      {addSubmissionDialog && (
        <AddNewSubmissionDialog
          open={addSubmissionDialog}
          setOpen={setAddSubmissionDialog}
        />
      )}
      {addRespondentDialogOpen && (
        <AddOrEditRespondentDialog
          open={addRespondentDialogOpen}
          onClose={() => setAddRespondentDialogOpen(false)}
          grievanceId={defaultValues?.id || null}
          onSubmit={(data) => {
            if (selectedRespondent) {
              setValue("respondents", [
                ...(respondentWatch ?? []).map((item) => {
                  if (item.respondentId === selectedRespondent.respondentId) {
                    return data;
                  }
                  return item;
                }),
              ]);
            } else {
              setValue("respondents", [...(respondentWatch ?? []), data]);
            }
            setAddRespondentDialogOpen(false);
          }}
          defaultValues={selectedRespondent}
        />
      )}
      {addCommitteeMemberDialogOpen && (
        <AddOrEditCommitteeMemberDialog
          open={addCommitteeMemberDialogOpen}
          onClose={() => setAddCommitteeMemberDialogOpen(false)}
          grievanceId={defaultValues?.id || null}
          onSubmit={(data) => {
            if (selectedCommitteeMember) {
              setValue("committeeMembers", [
                ...(committeeMemberWatch ?? []).map((item) => {
                  if (item.memberId === selectedCommitteeMember.memberId) {
                    return data;
                  }
                  return item;
                }),
              ]);
            } else {
              setValue("committeeMembers", [
                ...(committeeMemberWatch ?? []),
                data,
              ]);
            }
            setAddCommitteeMemberDialogOpen(false);
          }}
          defaultValues={selectedCommitteeMember}
        />
      )}
      {addNomineeDialogOpen && (
        <AddOrEditNomineeDialog
          open={addNomineeDialogOpen}
          grievanceId={defaultValues?.id || null}
          onClose={() => setAddNomineeDialogOpen(false)}
          onSubmit={(data) => {
            if (selectedNominee) {
              setValue("nominees", [
                ...(nomineeWatch ?? []).map((item) => {
                  if (item.nomineeId === selectedNominee.nomineeId) {
                    return data;
                  }
                  return item;
                }),
              ]);
            } else {
              setValue("nominees", [...(nomineeWatch ?? []), data]);
            }
            setAddNomineeDialogOpen(false);
          }}
          defaultValues={selectedNominee}
        />
      )}
      <AddOrEditLegalAdvisorDialog
        open={addLegalAdvisorDialogOpen}
        grievanceId={defaultValues?.id || null}
        onClose={() => setAddLegalAdvisorDialogOpen(false)}
        onSubmit={(data) => {
          if (selectedLegalAdvisor) {
            setValue("legalAdvisors", [
              ...(legalAdvisorWatch ?? []).map((item) => {
                if (
                  item.legalAdvisorId === selectedLegalAdvisor.legalAdvisorId
                ) {
                  return data;
                }
                return item;
              }),
            ]);
          } else {
            setValue("legalAdvisors", [...(legalAdvisorWatch ?? []), data]);
          }
          setAddLegalAdvisorDialogOpen(false);
        }}
        defaultValues={selectedLegalAdvisor}
      />
    </>
  );
}
