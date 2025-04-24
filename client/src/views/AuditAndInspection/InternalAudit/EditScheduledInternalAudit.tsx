import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AppBar,
  Autocomplete,
  Box,
  Divider,
  IconButton,
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
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import { fetchDivision } from "../../../api/divisionApi";
import {
  fetchAllUsers,
  fetchMedicineRequestAssignee,
} from "../../../api/userApi";
import CustomButton from "../../../components/CustomButton";
import DatePickerComponent from "../../../components/DatePickerComponent";
import RichTextComponent from "../../../components/RichTextComponent";
import UserAutoComplete from "../../../components/UserAutoComplete";
import AutoCheckBox from "../../../components/AutoCheckbox";
import {
  Factory,
  InternalAuditAnswerToQuestions,
  InternalAuditQuestionGroup,
  InternalAuditType,
  ScheduledInternalAudit,
  ScheduledInternalAuditStatus,
  SupplierType,
  InternalAuditQuestion,
  InternalAuditQuestionAnswersStatus,
  InternalAuditQuestionAnswerRating,
  getInternalAuditFormsList,
  getFactoryList,
  getProcessTypeList,
} from "../../../api/AuditAndInspection/internalAudit";
import { fetchDepartmentData } from "../../../api/departmentApi";
import SwitchButton from "../../../components/SwitchButton";
import ArticleIcon from "@mui/icons-material/Article";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import theme from "../../../theme";
import { RenderInternalAuditStatusChip } from "./InternalAuditTable";
import { CircularProgressWithLabel } from "../../../components/CircularProgressWithLabel";
import { RenderAuditQuestionColorTag } from "../AuditBuilder/InternalAuditFormDrawerContent";
import EditIcon from "@mui/icons-material/Edit";
import useIsMobile from "../../../customHooks/useIsMobile";
import { DrawerContentItem } from "../../../components/ViewDataDrawer";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  onSubmit?: (data: ScheduledInternalAudit) => void;
  defaultValues?: ScheduledInternalAudit;
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

export default function EditScheduledInternalAudit({
  open,
  handleClose,
  onSubmit,
  defaultValues,
}: DialogProps) {
  const { isTablet } = useIsMobile();
  const [openAddNewFactoryDialog, setOpenAddNewFactoryDialog] = useState(false);
  const [openAddNewProcessTypeDialog, setOpenAddNewProcessTypeDialog] =
    useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const {
    data: internalAuditFormsData,
    isFetching: isInternalAuditFormsFetching,
  } = useQuery({
    queryKey: ["internal-audit-forms"],
    queryFn: getInternalAuditFormsList,
  });

  const { data: processTypesData, isFetching: isProcessTypesDataFetching } =
    useQuery({
      queryKey: ["process-types"],
      queryFn: getProcessTypeList,
    });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<ScheduledInternalAudit>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues,
  });

  const resetForm = () => {
    reset();
  };

  const { data: userData, isFetching: isUserDataFetching } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  const { data: divisionData, isFetching: isDivisionDataFetching } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  const { data: departmentData, isFetching: isDepartmentDataFetching } =
    useQuery({
      queryKey: ["departments"],
      queryFn: fetchDepartmentData,
    });

  const { data: assigneeData, isFetching: isAssigneeDataFetching } = useQuery({
    queryKey: ["medicine-assignee"],
    queryFn: fetchMedicineRequestAssignee,
  });

  const { data: factoryData, isFetching: isFactoryDataFetching } = useQuery({
    queryKey: ["factories"],
    queryFn: getFactoryList,
  });

  const handleSubmitScheduledInternalAudit = (data: ScheduledInternalAudit) => {
    const submitData: Partial<ScheduledInternalAudit> = data;
    submitData.id = uuidv4();
    // submitData.assigneeId = assignee.id;
    // submitData.createdDate = new Date();
    // submitData.createdByUser = sampleAssignees[0].name;
    // submitData.status = HazardAndRiskStatus.DRAFT;
    // if (filesToRemove?.length > 0) submitData.removeDoc = filesToRemove;
    // submitData.documents = files;
    onSubmit(submitData as ScheduledInternalAudit);
    resetForm();
  };

  const AddNewFactoryButton = (props) => (
    <li
      {...props}
      variant="contained"
      style={{
        backgroundColor: "var(--pallet-lighter-blue)",
        color: "var(--pallet-blue)",
        textTransform: "none",
        margin: "0.5rem",
        borderRadius: "0.3rem",
        display: "flex",
        flexDirection: "row",
      }}
      size="small"
      // onClick closes the menu
      onMouseDown={() => {
        setOpenAddNewFactoryDialog(true);
      }}
    >
      <AddIcon />
      <Typography variant="body2" component="div">
        Add a new factory
      </Typography>
    </li>
  );

  const AddNewProcessTypeButton = (props) => (
    <li
      {...props}
      variant="contained"
      style={{
        backgroundColor: "var(--pallet-lighter-blue)",
        color: "var(--pallet-blue)",
        textTransform: "none",
        margin: "0.5rem",
        borderRadius: "0.3rem",
        display: "flex",
        flexDirection: "row",
      }}
      size="small"
      // onClick closes the menu
      onMouseDown={() => {
        setOpenAddNewProcessTypeDialog(true);
      }}
    >
      <AddIcon />
      <Typography variant="body2" component="div">
        Add a new process type
      </Typography>
    </li>
  );

  const isAuditScheduledForSupplier = watch("isAuditScheduledForSupplier");

  return (
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
      <AddNewFactoryDialog
        open={openAddNewFactoryDialog}
        setOpen={setOpenAddNewFactoryDialog}
      />
      <AddNewProcessTypeDialog
        open={openAddNewProcessTypeDialog}
        setOpen={setOpenAddNewProcessTypeDialog}
      />
      <DialogTitle
        sx={{
          paddingY: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" component="div">
          Edit Internal Audit
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
            backgroundColor: "#fff",
            flex: { lg: 3, md: 1 },
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            padding: "0.5rem",
            borderRadius: "0.3rem",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isTablet ? "column" : "row",
              alignItems: "center",
              marginY: "0.54rem",
            }}
          >
            <Box
              sx={{
                paddingY: "0.3rem",
                paddingX: "0.5rem",
                minWidth: "8rem",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{ paddingBottom: 0, color: "var(--pallet-grey)" }}
              >
                Status
              </Typography>
              <Box>{RenderInternalAuditStatusChip(defaultValues.status)}</Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                margin: "0.5rem",
                flex: 1,
              }}
            >
              <Typography variant="body2" component="div">
                <b>Date</b>
              </Typography>
              <Typography variant="body2" component="div">
                {new Date().toDateString()}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Box sx={{ margin: "0.5rem", flex: 1 }}>
              <Controller
                control={control}
                {...register("auditDate")}
                name={"auditDate"}
                render={({ field }) => {
                  return (
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value ? new Date(field.value) : null}
                      label="Audit Date"
                    />
                  );
                }}
              />
            </Box>
            <Box sx={{ margin: "0.5rem", flex: 1 }}>
              <Controller
                control={control}
                {...register("dateForApproval", { required: true })}
                name={"dateForApproval"}
                render={({ field }) => {
                  return (
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value ? new Date(field.value) : null}
                      label="Date for Approval"
                      error={errors?.dateForApproval ? "Required" : ""}
                    />
                  );
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <UserAutoComplete
                name="auditee"
                label="Auditee"
                control={control}
                register={register}
                errors={errors}
                userData={assigneeData}
                required={true}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <UserAutoComplete
                name="approver"
                label="Approver"
                control={control}
                register={register}
                errors={errors}
                userData={assigneeData}
                required={true}
              />
            </Box>
          </Box>
          <AppBar position="static" sx={{ marginY: "1rem" }}>
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
              variant="scrollable"
              scrollButtons={true}
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
                    <ArticleIcon fontSize="small" />
                    <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                      General Details
                    </Typography>
                  </Box>
                }
                {...a11yProps(0)}
              />
              {defaultValues.status !== ScheduledInternalAuditStatus.DRAFT && (
                <Tab
                  label={
                    <Box
                      sx={{
                        color: "var(--pallet-blue)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ContentPasteSearchIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        {defaultValues.audit?.name}
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(1)}
                />
              )}
              {defaultValues.status ===
                ScheduledInternalAuditStatus.COMPLETED && (
                <Tab
                  label={
                    <Box
                      sx={{
                        color: "var(--pallet-blue)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Diversity3Icon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Action Plan
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(1)}
                />
              )}
            </Tabs>
          </AppBar>
          <TabPanel value={activeTab} index={0} dir={theme.direction}>
            <Box
              sx={{
                display: "flex",
                flexDirection: isTablet ? "column" : "row",
              }}
            >
              <Autocomplete
                {...register("division", { required: true })}
                size="small"
                options={
                  divisionData?.length
                    ? divisionData.map((division) => division.divisionName)
                    : []
                }
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.division}
                    helperText={errors.division ? "Required" : ""}
                    label="Division"
                    name="division"
                  />
                )}
              />
              <Box sx={{ flex: 1, margin: "0.5rem" }}>
                <AutoCheckBox
                  control={control}
                  required={true}
                  name="department"
                  label="Departments"
                  options={departmentData || []}
                  selectedValues={getValues("department")}
                  setSelectedValues={(value) => setValue("department", value)}
                  getOptionLabel={(option) => option.department}
                  getOptionValue={(option) => option.id}
                  placeholder="Choose Departments"
                  limitTags={10}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isTablet ? "column" : "row",
              }}
            >
              <Controller
                name={"audit"}
                control={control}
                {...register("audit", { required: true })}
                render={({ field }) => (
                  <Autocomplete
                    size="small"
                    options={
                      internalAuditFormsData &&
                      Array.isArray(internalAuditFormsData)
                        ? internalAuditFormsData
                        : []
                    }
                    sx={{ flex: 1, margin: "0.5rem" }}
                    getOptionLabel={(option) => option?.name || ""}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        error={!!errors["audit"]}
                        helperText={errors["audit"] ? "Required" : ""}
                        label={"Audit Title"}
                        name={"audit"}
                      />
                    )}
                    onChange={(_, data) => field.onChange(data)}
                  />
                )}
              />
              <Autocomplete
                {...register("auditType", { required: true })}
                size="small"
                options={Object.values(InternalAuditType)}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.auditType}
                    helperText={errors.auditType ? "Required" : ""}
                    label="Audit Type"
                    name="auditType"
                  />
                )}
              />
            </Box>
            <Box
              sx={{
                marginLeft: "0.5rem",
              }}
            >
              <Controller
                control={control}
                name={"isAuditScheduledForSupplier"}
                render={({ field }) => {
                  return (
                    <SwitchButton
                      label="Is the audit scheduled for a supplier?"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  );
                }}
              />
            </Box>
            {isAuditScheduledForSupplier && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isTablet ? "column" : "row",
                  }}
                >
                  <Autocomplete
                    {...register("supplierType", { required: true })}
                    size="small"
                    options={Object.values(SupplierType)}
                    sx={{ flex: 1, margin: "0.5rem" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        error={!!errors.supplierType}
                        helperText={errors.supplierType ? "Required" : ""}
                        label="Supplier Type"
                        name="supplierType"
                      />
                    )}
                  />
                  <Box sx={{ flex: 1, margin: "0.5rem" }}>
                    <TextField
                      id="factoryLicenseNo"
                      required
                      label="Factory License No"
                      sx={{ width: "100%" }}
                      error={!!errors.factoryLicenseNo}
                      size="small"
                      {...register("factoryLicenseNo", { required: true })}
                    />
                  </Box>
                  <Box sx={{ flex: 1, margin: "0.5rem" }}>
                    <TextField
                      id="higgId"
                      label="Higg Id"
                      error={!!errors.higgId}
                      sx={{ width: "100%" }}
                      size="small"
                      {...register("higgId")}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isTablet ? "column" : "row",
                  }}
                >
                  <Box sx={{ flex: 1, margin: "0.5rem" }}>
                    <TextField
                      id="zdhcId"
                      label="Factory License No"
                      error={!!errors.zdhcId}
                      size="small"
                      sx={{ width: "100%" }}
                      {...register("zdhcId")}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Autocomplete
                      {...register("processType", { required: true })}
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
                        ...(processTypesData?.length
                          ? processTypesData.map((category) => category.name)
                          : []),
                        "$ADD_NEW_PROCESS_TYPE",
                      ]}
                      renderOption={(props, option) => (
                        <>
                          {option === "$ADD_NEW_PROCESS_TYPE" ? (
                            <AddNewProcessTypeButton {...props} />
                          ) : (
                            <li {...props} key={option}>
                              {option}
                            </li>
                          )}
                        </>
                      )}
                      sx={{ flex: 1, margin: "0.5rem" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!errors.processType}
                          label="Process Type"
                          name="processType"
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                      )}
                    />
                  </Box>
                </Box>
                <Divider sx={{ margin: "1rem" }} />
              </>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: isTablet ? "column" : "row",
              }}
            >
              <Autocomplete
                {...register("factoryName", { required: true })}
                size="small"
                noOptionsText={
                  <>
                    <Typography variant="body2" color="inherit" gutterBottom>
                      No matching Items
                    </Typography>
                  </>
                }
                options={[
                  ...(factoryData?.length
                    ? factoryData.map((category) => category.factoryName)
                    : []),
                  "$ADD_NEW_FACTORY",
                ]}
                renderOption={(props, option) => (
                  <>
                    {option === "$ADD_NEW_FACTORY" ? (
                      <AddNewFactoryButton {...props} />
                    ) : (
                      <li {...props} key={option}>
                        {option}
                      </li>
                    )}
                  </>
                )}
                sx={{ flex: 1, margin: "0.5rem" }}
                onChange={async (_, data) => {
                  const selectedFactory = factoryData?.find(
                    (factory) => factory.factoryName === data
                  );
                  await setValue("factory", selectedFactory);
                  await setValue("factoryId", selectedFactory?.id);
                  await setValue("factoryEmail", selectedFactory?.factoryEmail);
                  await setValue(
                    "factoryContactNumber",
                    selectedFactory?.factoryContactNumber
                  );
                  await setValue(
                    "factoryAddress",
                    selectedFactory?.factoryAddress
                  );
                  await setValue(
                    "factoryContactPerson",
                    selectedFactory?.factoryContactPerson
                  );
                  await setValue("designation", selectedFactory?.designation);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!!errors.factoryName}
                    label="Factory Name"
                    name="factoryName"
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                )}
              />
              <Box sx={{ flex: 1, margin: "0.5rem" }}>
                <TextField
                  id="factoryAddress"
                  label="Factory Address"
                  required
                  sx={{ width: "100%" }}
                  error={!!errors.factoryAddress}
                  size="small"
                  {...register("factoryAddress", { required: true })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>
              <Box sx={{ flex: 1, margin: "0.5rem" }}>
                <TextField
                  id="factoryContactPerson"
                  label="Factory Contact Person"
                  required
                  error={!!errors.factoryContactPerson}
                  sx={{ width: "100%" }}
                  size="small"
                  {...register("factoryContactPerson", { required: true })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: isTablet ? "column" : "row",
              }}
            >
              <Box sx={{ flex: 1, margin: "0.5rem" }}>
                <TextField
                  id="designation"
                  label="Designation"
                  type="email"
                  required
                  sx={{ width: "100%" }}
                  error={!!errors.designation}
                  size="small"
                  {...register("designation", { required: true })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>

              <Box sx={{ flex: 1, margin: "0.5rem" }}>
                <TextField
                  id="factoryEmail"
                  label="Factory Email"
                  type="email"
                  required
                  sx={{ width: "100%" }}
                  error={!!errors.factoryEmail}
                  size="small"
                  {...register("factoryEmail", { required: true })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>
              <Box sx={{ flex: 1, margin: "0.5rem" }}>
                <TextField
                  id="factoryContactNumber"
                  label="Contact Number"
                  required
                  error={!!errors.factoryContactNumber}
                  sx={{ width: "100%" }}
                  size="small"
                  {...register("factoryContactNumber", { required: true })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                margin: "0.5rem",
              }}
            >
              <Controller
                control={control}
                name={"description"}
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
          </TabPanel>
          <TabPanel value={activeTab} index={1} dir={theme.direction}>
            <Stack>
              {!defaultValues?.audit?.questionGroups?.length && (
                <Box sx={{ padding: "1rem" }}>
                  <Alert variant="standard" severity="info">
                    No Question Groups Added
                  </Alert>
                </Box>
              )}
              {defaultValues?.audit?.questionGroups?.map((group) => (
                <AuditQuestionsSectionAccordion
                  key={group.queGroupId}
                  questionGroup={group}
                  auditAnswers={
                    defaultValues?.auditAnswers?.find(
                      (answer) => answer.questionGroupId === group.queGroupId
                    )?.answers ?? []
                  }
                  auditStatus={defaultValues.status}
                />
              ))}
            </Stack>
          </TabPanel>
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
        {defaultValues.status === ScheduledInternalAuditStatus.DRAFT ? (
          <>
            <CustomButton
              variant="outlined"
              sx={{
                border: "1px solid var(--pallet-blue)",
              }}
              size="medium"
              onClick={handleSubmit((data) => {
                handleSubmitScheduledInternalAudit(data);
              })}
            >
              Update Draft
            </CustomButton>

            <CustomButton
              variant="contained"
              sx={{
                backgroundColor: "var(--pallet-blue)",
              }}
              size="medium"
              onClick={handleSubmit((data) => {
                handleSubmitScheduledInternalAudit(data);
              })}
            >
              Schedule Internal Audit
            </CustomButton>
          </>
        ) : (
          <>
            <CustomButton
              variant="outlined"
              sx={{
                border: "1px solid var(--pallet-blue)",
              }}
              size="medium"
              onClick={handleSubmit((data) => {
                handleSubmitScheduledInternalAudit(data);
              })}
            >
              Update Internal Audit
            </CustomButton>
            <CustomButton
              variant="contained"
              sx={{
                backgroundColor: "var(--pallet-blue)",
              }}
              size="medium"
              onClick={handleSubmit((data) => {
                handleSubmitScheduledInternalAudit(data);
              })}
            >
              Complete Internal Audit
            </CustomButton>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

const AddNewFactoryDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Factory>();
  const [openAddNewContactPersonDialog, setOpenAddNewContactPersonDialog] =
    useState(false);

  const { data: assigneeData, isFetching: isAssigneeDataFetching } = useQuery({
    queryKey: ["medicine-assignee"],
    queryFn: fetchMedicineRequestAssignee,
  });

  const { isTablet } = useIsMobile();

  const handleCreateFactory = (data: Partial<Factory>) => {
    setOpen(false);
  };

  const AddNewContactPersonButton = (props) => (
    <li
      {...props}
      variant="contained"
      style={{
        backgroundColor: "var(--pallet-lighter-blue)",
        color: "var(--pallet-blue)",
        textTransform: "none",
        margin: "0.5rem",
        borderRadius: "0.3rem",
        display: "flex",
        flexDirection: "row",
      }}
      size="small"
      // onClick closes the menu
      onMouseDown={() => {
        setOpenAddNewContactPersonDialog(true);
      }}
    >
      <AddIcon />
      <Typography variant="body2" component="div">
        Add a new contact person
      </Typography>
    </li>
  );

  const AddNewContactPersonDialog = () => {
    const { register, handleSubmit } = useForm();

    const handleCreateContactPerson = (data) => {
      console.log("Creating contact person", data);
    };

    return (
      <Dialog
        open={openAddNewContactPersonDialog}
        onClose={() => setOpenAddNewContactPersonDialog(false)}
        fullScreen={isTablet}
        fullWidth
        maxWidth="sm"
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
            Add New Contact Person
          </Typography>
          <IconButton
            aria-label="open drawer"
            onClick={() => setOpenAddNewContactPersonDialog(false)}
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
            }}
          >
            <TextField
              {...register("name", { required: true })}
              required
              id="name"
              label="name"
              size="small"
              fullWidth
              sx={{ marginBottom: "0.5rem" }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ padding: "1rem" }}>
          <Button
            onClick={() => setOpenAddNewContactPersonDialog(false)}
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
            onClick={handleSubmit(handleCreateContactPerson)}
          >
            Add Contact Person
          </CustomButton>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullScreen={isTablet}
      fullWidth
      maxWidth="sm"
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
          Add a new factory
        </Typography>
        <IconButton
          aria-label="open drawer"
          onClick={() => setOpen(false)}
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
          }}
        >
          <TextField
            {...register("factoryName", { required: true })}
            required
            id="factoryName"
            label="Factory Name"
            size="small"
            fullWidth
            sx={{ marginBottom: "0.5rem" }}
            error={!!errors.factoryName}
            helperText={errors.factoryName ? "Required" : ""}
          />
          <TextField
            {...register("factoryEmail", { required: true })}
            required
            id="factoryEmail"
            label="Factory Email"
            size="small"
            fullWidth
            sx={{ marginBottom: "0.5rem" }}
            error={!!errors.factoryEmail}
            helperText={errors.factoryEmail ? "Required" : ""}
            type="email"
          />
          <TextField
            {...register("factoryAddress", { required: true })}
            required
            id="factoryAddress"
            label="Factory Address"
            size="small"
            fullWidth
            sx={{ marginBottom: "0.5rem" }}
            error={!!errors.factoryAddress}
            helperText={errors.factoryAddress ? "Required" : ""}
          />

          <Box
            sx={{
              display: "flex",
            }}
          >
            <TextField
              {...register("factoryContactNumber", { required: true })}
              required
              id="factoryContactNumber"
              label="Contact Number"
              type="number"
              size="small"
              fullWidth
              error={!!errors.factoryContactNumber}
              helperText={errors.factoryContactNumber ? "Required" : ""}
            />
            <TextField
              {...register("designation", { required: true })}
              required
              id="designation"
              label="Designation"
              size="small"
              fullWidth
              sx={{ marginLeft: "0.5rem" }}
              error={!!errors.designation}
              helperText={errors.designation ? "Required" : ""}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Autocomplete
              {...register("factoryContactPerson", { required: true })}
              size="small"
              noOptionsText={
                <>
                  <Typography variant="body2" color="inherit" gutterBottom>
                    No matching Items
                  </Typography>
                </>
              }
              options={[
                ...(assigneeData?.length
                  ? assigneeData.map((category) => category.name)
                  : []),
                "$ADD_NEW_CONTACT_PERSON",
              ]}
              renderOption={(props, option) => (
                <>
                  {option === "$ADD_NEW_CONTACT_PERSON" ? (
                    <AddNewContactPersonButton {...props} />
                  ) : (
                    <li {...props} key={option}>
                      {option}
                    </li>
                  )}
                </>
              )}
              sx={{ flex: 1, marginY: "1rem" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!errors.factoryContactPerson}
                  label="Factory Contact Person"
                  name="factoryContactPerson"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              )}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: "1rem" }}>
        <Button
          onClick={() => setOpen(false)}
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
          onClick={handleSubmit(handleCreateFactory)}
        >
          Add Factory
        </CustomButton>
      </DialogActions>
      <AddNewContactPersonDialog />
    </Dialog>
  );
};

const AddNewProcessTypeDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { register, handleSubmit } = useForm();
  const { isTablet } = useIsMobile();

  const handleCreateProcessType = (data) => {
    console.log("Creating process type", data);
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullScreen={isTablet}
      fullWidth
      maxWidth="sm"
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
          Add New Process Type
        </Typography>
        <IconButton
          aria-label="open drawer"
          onClick={() => setOpen(false)}
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
          }}
        >
          <TextField
            {...register("name", { required: true })}
            required
            id="name"
            label="name"
            size="small"
            fullWidth
            sx={{ marginBottom: "0.5rem" }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: "1rem" }}>
        <Button
          onClick={() => setOpen(false)}
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
          onClick={handleSubmit(handleCreateProcessType)}
        >
          Add New Process Type
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export const AuditQuestionsSectionAccordion = ({
  questionGroup,
  auditAnswers,
  auditStatus,
}: {
  questionGroup: InternalAuditQuestionGroup;
  auditAnswers: InternalAuditAnswerToQuestions[];
  auditStatus: ScheduledInternalAuditStatus;
}) => {
  const { isTablet } = useIsMobile();
  const [selectedQuestion, setSelectedQuestion] =
    useState<InternalAuditQuestion | null>(null);
  const [openEditQuestionDialog, setOpenEditQuestionDialog] = useState(false);

  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Typography component="span">{questionGroup.groupName}</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginX: "1rem",
              }}
            >
              <Typography variant="body2" sx={{ color: "var(--pallet-grey)" }}>
                {questionGroup.questions.length} Questions
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "var(--pallet-grey)", marginLeft: "1rem" }}
              >
                {questionGroup.questions
                  ? questionGroup.questions.reduce(
                      (acc, question) => acc + question.allocatedScore,
                      0
                    )
                  : 0}{" "}
                Allocated Score
              </Typography>
              {auditStatus !== ScheduledInternalAuditStatus.DRAFT && (
                <>
                  <Box
                    sx={{
                      marginLeft: "1rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgressWithLabel
                      value={
                        (auditAnswers.length /
                          (questionGroup?.questions?.length || 1)) *
                        100
                      }
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        marginLeft: "0.5rem",
                      }}
                    >
                      Completed
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer
            sx={{
              overflowX: "auto",
              maxWidth: isTablet ? "88vw" : "100%",
            }}
          >
            <Table aria-label="simple table">
              <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
                <TableRow>
                  <TableCell align="center">Color Code</TableCell>
                  <TableCell align="left">Question</TableCell>
                  <TableCell align="center">Allocated Score</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Rating</TableCell>
                  <TableCell align="center">Score</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questionGroup?.questions.length === 0 && (
                  <TableRow key="no-questions">
                    <TableCell colSpan={3} align="center">
                      <Typography variant="body2">
                        No Questions found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {questionGroup?.questions.map((row) => {
                  const questionAnswers = auditAnswers.find(
                    (answer) => answer.questionId === row.queId
                  );

                  return (
                    <TableRow key={row.queId}>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {RenderAuditQuestionColorTag(row.colorCode)}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          marginTop: "0.5rem",
                        }}
                      >
                        <Typography variant="body2">{row.question}</Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          marginTop: "0.5rem",
                        }}
                      >
                        <Typography variant="body2">
                          {row.allocatedScore}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {questionAnswers?.status ?? "--"}
                      </TableCell>
                      <TableCell align="center">
                        {questionAnswers?.rating ?? "--"}
                      </TableCell>
                      <TableCell align="center">
                        {questionAnswers?.score ?? "--"}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="edit"
                          size="small"
                          onClick={() => {
                            setSelectedQuestion(row);
                            setOpenEditQuestionDialog(true);
                          }}
                        >
                          <EditIcon fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
      <EditInternalAuditQuestionDialog
        open={openEditQuestionDialog}
        setOpen={setOpenEditQuestionDialog}
        question={selectedQuestion}
        answer={auditAnswers.find(
          (answer) => answer.questionId === selectedQuestion?.queId
        )}
      />
    </>
  );
};

const EditInternalAuditQuestionDialog = ({
  open,
  setOpen,
  question,
  answer,
  onSubmit,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  question: InternalAuditQuestion;
  answer: InternalAuditAnswerToQuestions | null;
  onSubmit?: (data: InternalAuditAnswerToQuestions) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<InternalAuditAnswerToQuestions>({
    defaultValues: {
      score: answer?.score ?? null,
      status: answer?.status ?? null,
      rating: answer?.rating ?? null,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const { isTablet } = useIsMobile();

  const handleCreateFactory = (
    data: Partial<InternalAuditAnswerToQuestions>
  ) => {
    console.log("Creating factory", { ...data, questionId: question.queId });
    reset({
      score: null,
      status: null,
      rating: null,
    });
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset({
          score: null,
          status: null,
          rating: null,
        });
        setOpen(false);
      }}
      fullScreen={isTablet}
      fullWidth
      maxWidth="md"
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
          Answer Question
        </Typography>
        <IconButton
          aria-label="open drawer"
          onClick={() => setOpen(false)}
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
            paddingX: "0.5rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Box
              sx={{
                backgroundColor: "var(--pallet-lighter-grey)",
                padding: "0.3rem",
                borderRadius: "0.3rem",
                display: "flex",
                alignItems: "center",
                marginRight: "0.5rem",
                marginTop: "0.8rem",
                objectFit: "contain",
                width: "fit-content",
                height: "fit-content",
              }}
            >
              {RenderAuditQuestionColorTag(question?.colorCode, "medium")}
            </Box>
            <DrawerContentItem label="Question" value={question?.question} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              marginBottom: "1rem",
            }}
          >
            <Typography variant="caption" sx={{ color: "var(--pallet-grey)" }}>
              {`${question?.allocatedScore} Allocated Score`}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Controller
              name="status"
              control={control}
              {...register("status", {
                required: true,
              })}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  size="small"
                  options={Object.values(InternalAuditQuestionAnswersStatus)}
                  onChange={(_, value) => field.onChange(value)}
                  sx={{ flex: 1, margin: "0.5rem" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={!!errors.status}
                      helperText={errors.status && "Required"}
                      label="Status"
                      name="status"
                    />
                  )}
                />
              )}
            />
            <Controller
              name="rating"
              control={control}
              {...register("rating", {
                required: true,
              })}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  size="small"
                  options={Object.values(InternalAuditQuestionAnswerRating)}
                  onChange={(_, value) => field.onChange(value)}
                  sx={{ flex: 1, margin: "0.5rem" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={!!errors.rating}
                      helperText={errors.rating && "Required"}
                      label="Rating"
                      name="rating"
                    />
                  )}
                />
              )}
            />
            <Controller
              name="score"
              control={control}
              rules={{
                required: "Score is required",
                min: {
                  value: 0,
                  message: "Score must be greater than 0",
                },
                max: {
                  value: question?.allocatedScore,
                  message: `Score must be less than ${question?.allocatedScore}`,
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  id="score"
                  label="Score"
                  size="small"
                  fullWidth
                  type="number"
                  sx={{ margin: "0.5rem", flex: 1 }}
                  error={!!errors.score}
                  helperText={errors.score ? errors.score.message : ""}
                />
              )}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: "1rem" }}>
        <Button
          onClick={() => setOpen(false)}
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
          onClick={handleSubmit(handleCreateFactory)}
        >
          Submit Answer
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};
