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
  Stack,
  Tab,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Announcement,
  ExternalAudit,
  fetchAuditCategory,
  fetchAuditFirm,
  fetchAuditStandard,
  fetchAuditType,
  Status,
} from "../../../api/ExternalAudit/externalAuditApi";
import useIsMobile from "../../../customHooks/useIsMobile";
import theme from "../../../theme";
import CustomButton from "../../../components/CustomButton";
import { fetchDivision } from "../../../api/divisionApi";
import { useQuery } from "@tanstack/react-query";
import RichTextComponent from "../../../components/RichTextComponent";
import { ExistingFileItemsEdit } from "../../../components/ExistingFileItemsEdit";
import DropzoneComponent from "../../../components/DropzoneComponent";
import { StorageFile } from "../../../utils/StorageFiles.util";
import DatePickerComponent from "../../../components/DatePickerComponent";
import UserAutoComplete from "../../../components/UserAutoComplete";
import { fetchHazardRiskAssignee } from "../../../api/userApi";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ListIcon from "@mui/icons-material/List";
import Diversity3Icon from "@mui/icons-material/Diversity3";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  isPending: boolean;
  defaultValues?: ExternalAudit;
  onSubmit?: (data: ExternalAudit) => void;
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

export default function AddOrEditExternalAuditDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
  isPending,
}: DialogProps) {
  const { isMobile, isTablet } = useIsMobile();
  const [files, setFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const { data: assigneeData, isFetching: isAssigneeDataFetching } = useQuery({
    queryKey: ["hr-assignee"],
    queryFn: fetchHazardRiskAssignee, //need to change
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    trigger,
  } = useForm<ExternalAudit>({
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const [existingFiles, setExistingFiles] = useState<StorageFile[]>(
    defaultValues?.documents as StorageFile[]
  );
  const [filesToRemove, setFilesToRemove] = useState<string[]>([]);

  const approver = watch("approver");
  const representorSchema = watch("representor");

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

  const handleCreateExternalAudit = (data: ExternalAudit) => {
    const submitData: Partial<ExternalAudit> = data;
    submitData.documents = files;
    submitData.approverId = approver.id;
    submitData.representorId = representorSchema.id;
    if (filesToRemove?.length > 0) submitData.removeDoc = filesToRemove;
    onSubmit(submitData as ExternalAudit);
    resetForm();
  };

  const { data: divisionData, isFetching: isDivisionDataFetching } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  const { data: auditTypes, isFetching: isAuditTypeDataFetching } = useQuery({
    queryKey: ["audit-types"],
    queryFn: fetchAuditType,
  });

  const { data: auditCategory, isFetching: isAuditCategoryDataFetching } =
    useQuery({
      queryKey: ["audit-category"],
      queryFn: fetchAuditCategory,
    });

  const { data: auditStandards, isFetching: isAuditStandardsDataFetching } =
    useQuery({
      queryKey: ["audit-standards"],
      queryFn: fetchAuditStandard,
    });

  const { data: auditFirms, isFetching: isAuditFirmsDataFetching } = useQuery({
    queryKey: ["audit-firms"],
    queryFn: fetchAuditFirm,
  });
  const isGeneralDetailsValid = useMemo(() => {
    return (
      !errors.auditType &&
      !errors.auditCategory &&
      !errors.customer &&
      !errors.auditStandard &&
      !errors.auditFirm &&
      !errors.division &&
      !errors.remarks
    );
  }, [
    errors.auditType,
    errors.auditCategory,
    errors.customer,
    errors.auditStandard,
    errors.auditFirm,
    errors.division,
    errors.remarks,
  ]);

  const triggerGeneralDetailsSection = () => {
    trigger([
      "auditType",
      "auditCategory",
      "customer",
      "auditStandard",
      "auditFirm",
      "division",
      "remarks",
    ]);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (activeTab === 0) {
      triggerGeneralDetailsSection();
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
            {defaultValues
              ? "Edit External Audit Report"
              : "Create External Audit Report"}
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
                    backgroundColor: isGeneralDetailsValid
                      ? "var(--pallet-blue)"
                      : "var(--pallet-red)",
                    height: "3px",
                  },
                }}
                sx={{
                  backgroundColor: "var(--pallet-lighter-grey)",
                  color: "var(--pallet-blue)",
                  width: "100%",
                  display: "flex",
                }}
                textColor="inherit"
                variant="scrollable"
                scrollButtons={true}
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
                        General
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
                        backgroundColor: "var(--pallet-lighter-grey)",
                        color: "var(--pallet-blue)",
                        width: "100%",
                        display: "flex",
                      }}
                    >
                      <ListIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Audit details
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(1)}
                />
                {defaultValues ? (
                  <Tab
                    label={
                      <Box
                        sx={{
                          backgroundColor: "var(--pallet-lighter-grey)",
                          color: "var(--pallet-blue)",
                          width: "100%",
                          display: "flex",
                        }}
                      >
                        <Diversity3Icon fontSize="small" />
                        <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                          Action Plan
                        </Typography>
                      </Box>
                    }
                    {...a11yProps(2)}
                  />
                ) : null}
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
                  <Stack
                    gap={1}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      backgroundColor: "#fff",
                      flex: { lg: 3, md: 1 },
                      borderRadius: "0.3rem",
                    }}
                  >
                    <Controller
                      name="auditType"
                      control={control}
                      defaultValue={defaultValues?.auditType ?? ""}
                      {...register("auditType", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={
                            auditTypes?.length
                              ? auditTypes.map((types) => types.auditTypeName)
                              : []
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.auditType}
                              helperText={errors.auditType && "Required"}
                              label="Audit Type"
                              name="auditType"
                            />
                          )}
                        />
                      )}
                    />

                    <Controller
                      name="auditCategory"
                      control={control}
                      defaultValue={defaultValues?.auditCategory ?? ""}
                      {...register("auditCategory", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={
                            auditCategory?.length
                              ? auditCategory.map(
                                  (category) => category.auditCategoryName
                                )
                              : []
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.auditCategory}
                              helperText={errors.auditCategory && "Required"}
                              label="Audit Category"
                              name="auditCategory"
                            />
                          )}
                        />
                      )}
                    />

                    <TextField
                      id="customer"
                      type="text"
                      label="Customer"
                      required
                      error={!!errors.customer}
                      helperText={errors.customer ? "Required" : ""}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("customer", { required: true })}
                    />
                  </Stack>

                  <Stack
                    gap={1}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      backgroundColor: "#fff",
                      flex: { lg: 3, md: 1 },
                      borderRadius: "0.3rem",
                    }}
                  >
                    <Controller
                      name="auditStandard"
                      control={control}
                      defaultValue={defaultValues?.auditStandard ?? ""}
                      {...register("auditStandard", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={
                            auditStandards?.length
                              ? auditStandards.map(
                                  (standard) => standard.auditStandardName
                                )
                              : []
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.auditStandard}
                              helperText={errors.auditStandard && "Required"}
                              label="Audit Standard"
                              name="auditStandard"
                            />
                          )}
                        />
                      )}
                    />
                  </Stack>

                  <Stack
                    gap={1}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      backgroundColor: "#fff",
                      flex: { lg: 3, md: 1 },
                      borderRadius: "0.3rem",
                    }}
                  >
                    <Controller
                      name="auditFirm"
                      control={control}
                      defaultValue={defaultValues?.auditFirm ?? ""}
                      {...register("auditFirm", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={
                            auditFirms?.length
                              ? auditFirms.map((firm) => firm.auditFirmName)
                              : []
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.auditFirm}
                              helperText={errors.auditFirm && "Required"}
                              label="Audit Firm"
                              name="auditFirm"
                            />
                          )}
                        />
                      )}
                    />

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
                          } //need to change
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
                  </Stack>

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
                  <Stack
                    gap={1}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      backgroundColor: "#fff",
                      flex: { lg: 3, md: 1 },
                      borderRadius: "0.3rem",
                    }}
                  >
                    <TextField
                      id="auditStatus"
                      type="text"
                      label="Audit Status"
                      error={!!errors.auditStatus}
                      // required
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("auditStatus")}
                    />

                    <TextField
                      id="auditScore"
                      type="number"
                      label="Audit Score"
                      error={!!errors.auditScore}
                      size="small"
                      // required
                      helperText={
                        errors.auditScore &&
                        (errors.auditScore.message ??
                          "Audit Score must be at least 0")
                      }
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("auditScore", {
                        min: {
                          value: 0,
                          message: "Audit Score must be at least 0",
                        },
                      })}
                    />

                    <TextField
                      id="gradePeriod"
                      type="text"
                      label="Grade Period"
                      error={!!errors.gradePeriod}
                      // required
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("gradePeriod")}
                    />
                  </Stack>

                  <Stack
                    gap={1}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      backgroundColor: "#fff",
                      flex: { lg: 3, md: 1 },
                      borderRadius: "0.3rem",
                    }}
                  >
                    <TextField
                      id="numberOfNonCom"
                      type="number"
                      label="Number Of Non Com"
                      // required
                      error={!!errors.numberOfNonCom}
                      size="small"
                      helperText={
                        errors.numberOfNonCom &&
                        (errors.numberOfNonCom.message ??
                          "Number of Non Com must be at least 0")
                      }
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("numberOfNonCom", {
                        min: {
                          value: 0,
                          message: "Number of Non Com must be at least 0",
                        },
                      })}
                    />

                    <TextField
                      id="auditFee"
                      type="number"
                      label="Audit Fee"
                      error={!!errors.auditFee}
                      size="small"
                      // required
                      sx={{ flex: 1, margin: "0.5rem" }}
                      helperText={
                        errors.auditFee &&
                        (errors.auditFee.message ??
                          "Audit Fee must be at least 0")
                      }
                      {...register("auditFee", {
                        min: {
                          value: 0,
                          message: "Audit Fee must be at least 0",
                        },
                      })}
                    />

                    <TextField
                      id="auditGrade"
                      type="text"
                      label="Audit Grade"
                      // required
                      error={!!errors.auditGrade}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("auditGrade")}
                    />
                  </Stack>

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
                        handleTabChange(null, 0);
                      }}
                      endIcon={<ArrowBackIcon />}
                    >
                      Previous
                    </CustomButton>
                    {/* <CustomButton
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
                    </CustomButton> */}
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
                  <Table aria-label="simple table">
                    <TableHead
                      sx={{
                        backgroundColor: "var(--pallet-lighter-grey)",
                      }}
                    >
                      <TableRow>
                        <TableCell align="center">#</TableCell>
                        <TableCell align="center">Finding</TableCell>
                        <TableCell align="center"></TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      margin: "0.5rem",
                      justifyContent: "flex-end",
                      marginTop: "1.2rem",
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
                      endIcon={<ArrowBackIcon />}
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
                  {...register("auditDate", { required: true })}
                  name={"auditDate"}
                  render={({ field }) => {
                    return (
                      <Box sx={{ flex: 1, margin: "0.5rem" }}>
                        <DatePickerComponent
                          onChange={(e) => field.onChange(e)}
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
                          label="Audit Date"
                          error={errors?.auditDate ? "Required" : ""}
                        />
                      </Box>
                    );
                  }}
                />
              </Box>

              <Box sx={{ margin: "0.5rem" }}>
                <Controller
                  control={control}
                  {...register("approvalDate", { required: true })}
                  name={"approvalDate"}
                  render={({ field }) => {
                    return (
                      <Box sx={{ flex: 1, margin: "0.5rem" }}>
                        <DatePickerComponent
                          onChange={(e) => field.onChange(e)}
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
                          label="Approval Date"
                          error={errors?.approvalDate ? "Required" : ""}
                        />
                      </Box>
                    );
                  }}
                />
              </Box>

              <Box sx={{ margin: "0.5rem" }}>
                <UserAutoComplete
                  name="approver"
                  label="Approver"
                  control={control}
                  register={register}
                  errors={errors}
                  userData={assigneeData}
                  defaultValue={defaultValues?.approver}
                  required={true}
                />
              </Box>

              <Box sx={{ margin: "0.5rem" }}>
                <UserAutoComplete
                  name="representor"
                  label="Management Representative"
                  control={control}
                  register={register}
                  errors={errors}
                  userData={assigneeData}
                  defaultValue={defaultValues?.representor}
                  required={true}
                />
              </Box>

              <Box sx={{ margin: "1rem", width: "full" }}>
                <TextField
                  id="auditorName"
                  type="text"
                  label="Auditor Name"
                  required
                  error={!!errors.auditorName}
                  size="small"
                  sx={{ width: "100%" }}
                  {...register("auditorName", { required: true })}
                />
              </Box>

              <Box sx={{ margin: "0.5rem" }}>
                <Controller
                  control={control}
                  {...register("assessmentDate", { required: true })}
                  name={"assessmentDate"}
                  render={({ field }) => {
                    return (
                      <Box sx={{ flex: 1, margin: "0.5rem" }}>
                        <DatePickerComponent
                          onChange={(e) => field.onChange(e)}
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
                          label="Assesment Date"
                          error={errors?.assessmentDate ? "Required" : ""}
                        />
                      </Box>
                    );
                  }}
                />
              </Box>

              <Box sx={{ margin: "0.5rem" }}>
                <Controller
                  control={control}
                  {...register("auditExpiryDate", { required: true })}
                  name={"auditExpiryDate"}
                  render={({ field }) => {
                    return (
                      <Box sx={{ flex: 1, margin: "0.5rem" }}>
                        <DatePickerComponent
                          onChange={(e) => field.onChange(e)}
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
                          label="Audit Expiry Date"
                          error={errors?.auditExpiryDate ? "Required" : ""}
                        />
                      </Box>
                    );
                  }}
                />
              </Box>
              {defaultValues && defaultValues.status !== Status.COMPLETE && (
                <Box sx={{ margin: "0.5rem" }}>
                  <Typography
                    variant="caption"
                    sx={{ marginBottom: "0.1rem", color: grey[700] }}
                  >
                    Status:
                  </Typography>
                  <Controller
                    control={control}
                    name={"status"}
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
                          <ToggleButton value={Status.DRAFT} key={Status.DRAFT}>
                            <Typography variant="caption" component="div">
                              {Status.DRAFT}
                            </Typography>
                          </ToggleButton>
                          <ToggleButton
                            value={Status.APPROVED}
                            key={Status.APPROVED}
                          >
                            <Typography variant="caption" component="div">
                              {Status.APPROVED}
                            </Typography>
                          </ToggleButton>
                          <ToggleButton
                            value={Status.COMPLETE}
                            key={Status.COMPLETE}
                          >
                            <Typography variant="caption" component="div">
                              {Status.COMPLETE}
                            </Typography>
                          </ToggleButton>
                        </ToggleButtonGroup>
                      );
                    }}
                  />
                </Box>
              )}

              <Box sx={{ margin: "0.5rem" }}>
                <Typography
                  variant="caption"
                  sx={{ marginBottom: "0.1rem", color: grey[700] }}
                >
                  Announcement:
                </Typography>
                <Controller
                  control={control}
                  name={"announcement"}
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
                          value={Announcement.ANNOUNCED}
                          key={Announcement.ANNOUNCED}
                        >
                          <Typography variant="caption" component="div">
                            {Announcement.ANNOUNCED}
                          </Typography>
                        </ToggleButton>
                        <ToggleButton
                          value={Announcement.SEMI_ANNOUNCED}
                          key={Announcement.SEMI_ANNOUNCED}
                        >
                          <Typography variant="caption" component="div">
                            {Announcement.SEMI_ANNOUNCED}
                          </Typography>
                        </ToggleButton>
                        <ToggleButton
                          value={Announcement.UN_ANNOUNCED}
                          key={Announcement.UN_ANNOUNCED}
                        >
                          <Typography variant="caption" component="div">
                            {Announcement.UN_ANNOUNCED}
                          </Typography>
                        </ToggleButton>
                      </ToggleButtonGroup>
                    );
                  }}
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
            disabled={isPending}
            startIcon={
              isPending && <CircularProgress color="inherit" size={"1rem"} />
            }
            onClick={handleSubmit((data) => {
              handleCreateExternalAudit(data);
            })}
          >
            {defaultValues ? "Update Changes" : "Submit Item"}
          </CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
