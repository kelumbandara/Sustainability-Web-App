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
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import useIsMobile from "../../../customHooks/useIsMobile";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import DropzoneComponent from "../../../components/DropzoneComponent";
import { grey } from "@mui/material/colors";
import DatePickerComponent from "../../../components/DatePickerComponent";
import CustomButton from "../../../components/CustomButton";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { HazardAndRiskStatus } from "../../../api/hazardRiskApi";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import theme from "../../../theme";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RichTextComponent from "../../../components/RichTextComponent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useCurrentUser from "../../../hooks/useCurrentUser";
import { fetchAllUsers, fetchIncidentAssignee } from "../../../api/userApi";
import { useQuery } from "@tanstack/react-query";
import { fetchDivision } from "../../../api/divisionApi";
import { fetchNearMiss } from "../../../api/nearMissApi";
import { fetchTypeOfConcerns } from "../../../api/typeOfConcern";
import { fetchAllFactors } from "../../../api/incidentFactorsApi";
import { fetchAllCircumstances } from "../../../api/circumstancesApi";
import UserAutoComplete from "../../../components/UserAutoComplete";
import { ExistingFileItemsEdit } from "../../../components/ExistingFileItemsEdit";
import { StorageFile } from "../../../utils/StorageFiles.util";
import { TargetSettings } from "../../../api/TargetSettings/targetSettingsApi";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AdsClickIcon from "@mui/icons-material/AdsClick";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: TargetSettings;
  onSubmit?: (data: TargetSettings) => void;
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

export default function AddOrEditTargetSettingsDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: DialogProps) {
  const { isMobile, isTablet } = useIsMobile();
  const [files, setFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [existingFiles, setExistingFiles] = useState<StorageFile[]>(
    defaultValues?.document as StorageFile[]
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
  } = useForm<TargetSettings>({
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const approver = watch("approver");
  const responsible = watch("responsible");

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

  const handleSubmitTargetSettings = (data: TargetSettings) => {
    const submitData: Partial<TargetSettings> = data;
    submitData.id = defaultValues?.id ?? uuidv4();
    submitData.approverId = approver?.id;
    submitData.responsibleId = responsible?.id;
    submitData.status = defaultValues?.status ?? HazardAndRiskStatus.DRAFT;
    submitData.document = files;
    if (filesToRemove?.length > 0) submitData.removeDoc = filesToRemove;
    onSubmit(submitData as TargetSettings);
  };

  const isGeneralDetailsValid = useMemo(() => {
    return (
      !errors.division &&
      !errors.department &&
      !errors.category &&
      !errors.source &&
      !errors.baseLineConsumption &&
      !errors.ghcEmmision
    );
  }, [
    errors.division,
    errors.department,
    errors.category,
    errors.source,
    errors.baseLineConsumption,
    errors.ghcEmmision,
  ]);

  const isImprovementsDetailsValid = useMemo(() => {
    return !errors.action && !errors.possibilityCategory;
  }, [errors.action, errors.possibilityCategory]);

  const isTargetSettingsValid = useMemo(() => {
    return (
      !errors.implementationCost &&
      !errors.expectedSavings &&
      !errors.targetGhcRedution &&
      !errors.costSaving &&
      !errors.paybackPeriod &&
      !errors.projectLifespan
    );
  }, [
    errors.implementationCost,
    errors.expectedSavings,
    errors.targetGhcRedution,
    errors.costSaving,
    errors.paybackPeriod,
    errors.projectLifespan,
  ]);

  const triggerTargetSettingsSection = () => {
    trigger([
      "implementationCost",
      "expectedSavings",
      "targetGhcRedution",
      "costSaving",
      "paybackPeriod",
      "projectLifespan",
    ]);
  };

  const triggerGeneralDetailsSection = () => {
    trigger([
      "division",
      "department",
      "category",
      "source",
      "baseLineConsumption",
      "ghcEmmision",
    ]);
  };

  const triggerImprovementsDetailsSection = () => {
    trigger(["action", "possibilityCategory"]);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (activeTab === 0) {
      triggerGeneralDetailsSection();
    } else if (activeTab === 1) {
      triggerImprovementsDetailsSection();
    } else {
      triggerTargetSettingsSection();
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
            {defaultValues ? "Edit a Target Setting" : "Create a Target Setting"}
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
                      isImprovementsDetailsValid && isGeneralDetailsValid
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
                        color: isImprovementsDetailsValid
                          ? "var(--pallet-blue)"
                          : "var(--pallet-red)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <DateRangeIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Improvement Details
                      </Typography>
                      {!isImprovementsDetailsValid && (
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
                <Tab
                  label={
                    <Box
                      sx={{
                        color: isTargetSettingsValid
                          ? "var(--pallet-blue)"
                          : "var(--pallet-red)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <AdsClickIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Target Settings
                      </Typography>
                      {!isTargetSettingsValid && (
                        <Typography
                          variant="subtitle1"
                          sx={{ ml: "0.3rem", color: "var(--pallet-red)" }}
                        >
                          *
                        </Typography>
                      )}
                    </Box>
                  }
                  {...a11yProps(2)}
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

                    <Controller
                      name="department"
                      control={control}
                      defaultValue={defaultValues?.department ?? ""}
                      {...register("department", { required: true })}
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
                              error={!!errors.department}
                              helperText={errors.department && "Required"}
                              label="Department"
                              name="department"
                            />
                          )}
                        />
                      )}
                    />

                    <Controller
                      name="category"
                      control={control}
                      defaultValue={defaultValues?.category ?? ""}
                      {...register("category", { required: true })}
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
                      name="source"
                      control={control}
                      defaultValue={defaultValues?.source ?? ""}
                      {...register("source", { required: true })}
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
                              error={!!errors.source}
                              helperText={errors.source && "Required"}
                              label="Source"
                              name="source"
                            />
                          )}
                        />
                      )}
                    />

                    <TextField
                      required
                      id="baseLineConsumption"
                      label="Base Line Consumption"
                      error={!!errors.baseLineConsumption}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("baseLineConsumption", { required: true })}
                    />
                    <TextField
                      required
                      id="ghcEmmision"
                      label="GHC Emmision"
                      error={!!errors.ghcEmmision}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("ghcEmmision", { required: true })}
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
                      name={"problems"}
                      render={({ field }) => {
                        return (
                          <RichTextComponent
                            onChange={(e) => field.onChange(e)}
                            placeholder={field.value ?? "Findings/Problem"}
                          />
                        );
                      }}
                    />
                  </Box>
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
                      dropzoneLabel={"Drop Your Images Here"}
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
                      margin: "0.5rem",
                    }}
                  >
                    <Controller
                      control={control}
                      name={"action"}
                      render={({ field }) => {
                        return (
                          <RichTextComponent
                            onChange={(e) => field.onChange(e)}
                            placeholder={field.value ?? "Action"}
                          />
                        );
                      }}
                    />
                  </Box>
                  <Controller
                    name="possibilityCategory"
                    control={control}
                    defaultValue={defaultValues?.possibilityCategory ?? ""}
                    {...register("possibilityCategory", { required: true })}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        onChange={(event, newValue) => field.onChange(newValue)}
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
                            error={!!errors.possibilityCategory}
                            helperText={
                              errors.possibilityCategory && "Required"
                            }
                            label="Possibility Category"
                            name="possibilityCategory"
                          />
                        )}
                      />
                    )}
                  />

                  <Controller
                    name="opportunity"
                    control={control}
                    defaultValue={defaultValues?.opportunity ?? ""}
                    {...register("opportunity", { required: true })}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        onChange={(event, newValue) => field.onChange(newValue)}
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
                            error={!!errors.opportunity}
                            helperText={errors.opportunity && "Required"}
                            label="Opportunity"
                            name="opportunity"
                          />
                        )}
                      />
                    )}
                  />
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
                        handleTabChange(null, 0);
                      }}
                      endIcon={<ArrowBackIcon />}
                    >
                      Previous
                    </CustomButton>
                    <CustomButton
                      variant="contained"
                      sx={{
                        backgroundColor: "var(--pallet-blue)",
                        marginLeft: "0.5rem",
                      }}
                      size="medium"
                      onClick={() => {
                        handleTabChange(null, 2);
                      }}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Next
                    </CustomButton>
                  </Box>
                </Stack>
              </TabPanel>
              <TabPanel value={activeTab} index={2} dir={theme.direction}>
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
                      id="implementationCost"
                      label="Implementation Cost"
                      error={!!errors.implementationCost}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("implementationCost", { required: true })}
                    />
                    <TextField
                      required
                      id="expectedSavings"
                      label="Expected Savings"
                      error={!!errors.expectedSavings}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("expectedSavings", { required: true })}
                    />
                    <TextField
                      required
                      id="targetGhcRedution"
                      label="Target GHC Redution"
                      error={!!errors.targetGhcRedution}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("targetGhcRedution", { required: true })}
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
                      id="costSaving"
                      label="Cost Saving"
                      error={!!errors.costSaving}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("costSaving", { required: true })}
                    />
                    <TextField
                      required
                      id="paybackPeriod"
                      label="Payback Period"
                      error={!!errors.paybackPeriod}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("paybackPeriod", { required: true })}
                    />
                    <TextField
                      required
                      id="projectLifespan"
                      label="Project Lifespan"
                      error={!!errors.projectLifespan}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("projectLifespan", { required: true })}
                    />
                  </Box>
                  <Box sx={{ margin: "0.5rem" }}>
                    <Controller
                      control={control}
                      {...register("implementationTimeline", {
                        required: false,
                      })}
                      name={"implementationTimeline"}
                      render={({ field }) => {
                        return (
                          <DatePickerComponent
                            onChange={(e) => field.onChange(e)}
                            value={
                              field.value ? new Date(field.value) : undefined
                            }
                            label="Implementation Timeline"
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
              <Box>
                <UserAutoComplete
                  name="responsible"
                  label="Responsible"
                  control={control}
                  register={register}
                  errors={errors}
                  userData={asigneeData}
                  defaultValue={defaultValues?.responsible}
                  required={true}
                />
              </Box>
              <Box>
                <UserAutoComplete
                  name="approver"
                  label="Approver"
                  control={control}
                  register={register}
                  errors={errors}
                  userData={asigneeData}
                  defaultValue={defaultValues?.approver}
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
                handleSubmitTargetSettings(data);
            })}
          >
            {defaultValues ? "Update Changes" : "Submit Report"}
          </CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
