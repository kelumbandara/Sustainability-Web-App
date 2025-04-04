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
  Stack,
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
import useIsMobile from "../../../customHooks/useIsMobile";
import AutoCheckBox from "../../../components/AutoCheckbox";
import {
  Factory,
  InternalAuditType,
  ScheduledInternalAudit,
  SupplierType,
} from "../../../api/AuditAndInspection/internalAudit";
import { fetchDepartmentData } from "../../../api/departmentApi";
import {
  sampleFactories,
  sampleInternalAudits,
  sampleProcessData,
} from "../../../api/sampleData/sampleInternalAuditData";
import SwitchButton from "../../../components/SwitchButton";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  onSubmit?: (data: ScheduledInternalAudit) => void;
};

export default function AddScheduledInternalAudit({
  open,
  handleClose,
  onSubmit,
}: DialogProps) {
  const { isMobile, isTablet } = useIsMobile();
  const [openAddNewFactoryDialog, setOpenAddNewFactoryDialog] = useState(false);
  const [openAddNewProcessTypeDialog, setOpenAddNewProcessTypeDialog] =
    useState(false);

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
    console.log(submitData);
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
          Schedule Internal Audit
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
          <Stack
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
                flexDirection: isMobile ? "column" : "row",
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
                flexDirection: isMobile ? "column" : "row",
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
                      userData && Array.isArray(sampleInternalAudits)
                        ? sampleInternalAudits
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
                        helperText={
                          errors["audit"] ? "This field is required" : ""
                        }
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
                    flexDirection: isMobile ? "column" : "row",
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
                    flexDirection: isMobile ? "column" : "row",
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
                        ...(sampleProcessData?.length
                          ? sampleProcessData.map((category) => category.name)
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
                flexDirection: isMobile ? "column" : "row",
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
                  ...(sampleFactories?.length
                    ? sampleFactories.map((category) => category.name)
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
                  const selectedFactory = sampleFactories?.find(
                    (factory) => factory.name === data
                  );
                  console.log("yoo", selectedFactory);
                  await setValue("factory", selectedFactory);
                  await setValue("factoryId", selectedFactory?.id);
                  await setValue("factoryEmail", selectedFactory?.email);
                  await setValue(
                    "factoryContactNumber",
                    selectedFactory?.contactNumber
                  );
                  await setValue(
                    "factoryAddress",
                    selectedFactory?.factoryAddress
                  );
                  await setValue(
                    "factoryContactPerson",
                    selectedFactory?.factoryContactPerson?.name
                  );
                  await setValue("designation", selectedFactory?.designation);
                  await setValue("factoryEmail", selectedFactory?.email);
                  await setValue(
                    "factoryContactNumber",
                    selectedFactory?.contactNumber
                  );
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
                flexDirection: isMobile ? "column" : "row",
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

            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            ></Box>
          </Stack>
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
            <Box sx={{ margin: "0.5rem" }}>
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
          onClick={handleSubmit((data) => {
            handleSubmitScheduledInternalAudit(data);
          })}
        >
          Schedule Internal Audit
        </CustomButton>
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

  const { isMobile } = useIsMobile();

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
        fullScreen={isMobile}
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
      fullScreen={isMobile}
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
            {...register("name", { required: true })}
            required
            id="name"
            label="Factory Name"
            size="small"
            fullWidth
            sx={{ marginBottom: "0.5rem" }}
            error={!!errors.name}
            helperText={errors.name ? "This field is required" : ""}
          />
          <TextField
            {...register("email", { required: true })}
            required
            id="email"
            label="Factory Email"
            size="small"
            fullWidth
            sx={{ marginBottom: "0.5rem" }}
            error={!!errors.email}
            helperText={errors.email ? "This field is required" : ""}
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
            helperText={errors.factoryAddress ? "This field is required" : ""}
          />

          <Box
            sx={{
              display: "flex",
            }}
          >
            <TextField
              {...register("contactNumber", { required: true })}
              required
              id="contactNumber"
              label="Contact Number"
              type="number"
              size="small"
              fullWidth
              error={!!errors.contactNumber}
              helperText={errors.contactNumber ? "This field is required" : ""}
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
              helperText={errors.designation ? "This field is required" : ""}
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
  const { isMobile } = useIsMobile();

  const handleCreateProcessType = (data) => {
    console.log("Creating process type", data);
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullScreen={isMobile}
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
