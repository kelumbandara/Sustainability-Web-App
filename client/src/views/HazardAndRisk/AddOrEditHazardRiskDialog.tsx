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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import useIsMobile from "../../customHooks/useIsMobile";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { sampleDivisions } from "../../api/sampleData/documentData";
import RichTextComponent from "../../components/RichTextComponent";
import DropzoneComponent from "../../components/DropzoneComponent";
import { grey } from "@mui/material/colors";
import DatePickerComponent from "../../components/DatePickerComponent";
import CustomButton from "../../components/CustomButton";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";
import {
  HazardAndRisk,
  HazardAndRiskStatus,
  HazardOrRiskCategories,
  RiskLevel,
  UnsafeActOrCondition,
  createHazardRisk,
} from "../../api/hazardRiskApi";
import { sampleAssignees } from "../../api/sampleData/usersSampleDate";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: HazardAndRisk;
  onSubmit?: (data: HazardAndRisk) => void;
};

export default function AddOrEditHazardRiskDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: DialogProps) {
  const { isMobile, isTablet } = useIsMobile();
  const [files, setFiles] = useState<File[]>([]);
  const [addNewContactDialogOpen, setAddNewContactDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<HazardAndRisk>({
    defaultValues: {
      category: defaultValues?.category ?? "", // Make sure default is not undefined
      division: defaultValues?.division ?? "",
      locationOrDepartment: defaultValues?.locationOrDepartment ?? "",
      subLocation: defaultValues?.subLocation ?? "", // Added subLocation if applicable
      description: defaultValues?.description ?? "", // Added description for hazard/risk details
      riskLevel: defaultValues?.riskLevel ?? RiskLevel.LOW, // Default risk level to LOW
      unsafeActOrCondition: defaultValues?.unsafeActOrCondition ?? UnsafeActOrCondition.UNSAFE_ACT, // Default to UNSAFE_ACT
      observationType: defaultValues?.observationType ?? "", // Added observationType if applicable
      actionTaken: defaultValues?.actionTaken ?? "", // Added actionTaken if applicable
      status: defaultValues?.status ?? HazardAndRiskStatus.DRAFT, // Default status to DRAFT
      createdByUser: defaultValues?.createdByUser ?? "", // Optional: Assign a default if needed
      // createdDate: defaultValues?.createdDate ?? new Date(), // Optional: Current date if not set
      // Add other fields if applicable in your HazardAndRisk type
    },
  });
  

  const onSubmitForm = async (data: HazardAndRisk) => {
    // Check if required fields are filled
    if (!data.category || !data.division || !data.locationOrDepartment || !data.riskLevel) {
      // Handle error (show a message, etc.)
      console.error("Required fields are missing");
      return;
    }
  
    try {
      // Handle create document logic (async call)
      await handleCreateDocument(data);
  
      // Call the createHazardRisk function
      await createHazardRisk({
        
        category: data.category,
        subCategory: data.subCategory ?? "",
        observationType: data.observationType ?? "",
        division: data.division,
        locationOrDepartment: data.locationOrDepartment,
        subLocation: data.subLocation ?? "",
        description: data.description ?? "",
        riskLevel: data.riskLevel,
        unsafeActOrCondition: data.unsafeActOrCondition,
        dueDate: data.dueDate ?? new Date(),
        assignee: data.assignee ?? "",
        // createdDate: new Date(),
        createdByUser: data.createdByUser ?? "",
      });
  
      // Optionally, display a success message
      console.log("Form submitted successfully!");
  
      // Optionally reset the form
      reset();
    } catch (error) {
      console.error("Error while submitting form: ", error);
    }
  };
  
  
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

  const category = watch("category");
  const subCategory = watch("subCategory");

  const subCategoryOptions = useMemo(() => {
    return category
      ? HazardOrRiskCategories?.find(
          (d) => d.name === category
        )?.subCategories?.map((sc) => sc.name) || []
      : [];
  }, [category]);

  const observationTypeOptions = useMemo(() => {
    return category && subCategory
      ? HazardOrRiskCategories?.find(
          (d) => d.name === category
        )?.subCategories?.find((sc) => sc.name === subCategory)
          ?.observationTypes
      : [];
  }, [category, subCategory]);

  const handleCreateDocument = (data: HazardAndRisk) => {
    // Ensure that the required fields are set
    if (!data.category || !data.division || !data.locationOrDepartment || !data.riskLevel) {
      console.error("Required fields are missing");
      return;
    }
  
    // Prepare the data for submission
    const submitData: HazardAndRisk = {
      ...data,
      id: defaultValues?.id ?? uuidv4(), // Ensure ID is set, generating new one if not available
      // createdDate: new Date(), // Set the current date for the document creation
      createdByUser: sampleAssignees[0]?.name ?? 'Unknown', // Ensure there is a fallback value for createdByUser
      status: defaultValues?.status ?? HazardAndRiskStatus.DRAFT, // Default to DRAFT if status is missing
    };
  
    // Submit the data
    onSubmit(submitData);
  
    // Reset the form state
    resetForm();
  };
  
  const AddNewObservationButton = (props) => (
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
        setAddNewContactDialogOpen(true);
      }}
    >
      <AddIcon />
      <Typography variant="body2" component="div">
        Add New Observation Type
      </Typography>
    </li>
  );

  const AddNewObservationTypeDialog = ({
    category,
    subCategory,
  }: {
    category: string;
    subCategory: string;
  }) => {
    const { register, handleSubmit } = useForm({
      defaultValues: {
        observation: "",
      },
    });

    const handleCreateObservationType = (data: { observation: string }) => {
      console.log("Creating observation type", data, category, subCategory);
    };

    return (
      <Dialog
        open={addNewContactDialogOpen}
        onClose={() => setAddNewContactDialogOpen(false)}
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
            Add New Observation Type
          </Typography>
          <IconButton
            aria-label="open drawer"
            onClick={() => setAddNewContactDialogOpen(false)}
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
              {...register("observation", { required: true })}
              required
              id="observation"
              label="Observation"
              size="small"
              fullWidth
              sx={{ marginBottom: "0.5rem" }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ padding: "1rem" }}>
          <Button
            onClick={() => setAddNewContactDialogOpen(false)}
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
            onClick={handleSubmit(handleCreateObservationType)}
          >
            Add Observation Type
          </CustomButton>
        </DialogActions>
      </Dialog>
    );
  };

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
      {/* {addNewContactDialogOpen &&  */}
      <AddNewObservationTypeDialog
        category={category}
        subCategory={subCategory}
      />
      {/* } */}
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
            ? "Edit Hazard or Risk"
            : "Report a New Hazard or Risk"}
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
                alignItems: "flex-end",
                flexDirection: "column",
                margin: "0.5rem",
              }}
            >
              <Typography variant="body2" component="div">
                <b>Date</b>
              </Typography>
              <Typography variant="body2" component="div">
                {new Date().toDateString()}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Autocomplete
                {...register("category", { required: true })}
                size="small"
                options={HazardOrRiskCategories?.map(
                  (category) => category.name
                )}
                sx={{ flex: 1, margin: "0.5rem" }}
                defaultValue={defaultValues?.category}
                onChange={(e, value) => {
                  console.log("e", e);
                  setValue("category", value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.category}
                    label="Category"
                    name="category"
                  />
                )}
              />
              {category && (
                <Autocomplete
                  {...register("subCategory", { required: true })}
                  size="small"
                  disablePortal
                  options={subCategoryOptions}
                  defaultValue={defaultValues?.subCategory}
                  onChange={(e, value) => {
                    console.log("e", e);
                    setValue("subCategory", value);
                  }}
                  sx={{ flex: 1, margin: "0.5rem" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={!!errors.subCategory}
                      label="Sub Category"
                      name="subCategory"
                    />
                  )}
                />
              )}
            </Box>

            {category && subCategory && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <Autocomplete
                  {...register("observationType")}
                  size="small"
                  disablePortal
                  noOptionsText={
                    <>
                      <Typography variant="body2" color="inherit" gutterBottom>
                        No matching Items
                      </Typography>
                    </>
                  }
                  options={[...observationTypeOptions, "$ADD_NEW_ITEM"]}
                  renderOption={(props, option) => (
                    <>
                      {option === "$ADD_NEW_ITEM" ? (
                        <AddNewObservationButton {...props} />
                      ) : (
                        <li {...props} key={option}>
                          {option}
                        </li>
                      )}
                    </>
                  )}
                  defaultValue={defaultValues?.observationType}
                  sx={{ flex: 1, margin: "0.5rem" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.observationType}
                      label="Observation Type"
                      name="observationType"
                    />
                  )}
                />
              </Box>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Autocomplete
                {...register("division", { required: true })}
                size="small"
                disablePortal
                options={sampleDivisions?.map((division) => division.name)}
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
                id="locationOrDepartment"
                label="Location or Department"
                error={!!errors.locationOrDepartment}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("locationOrDepartment", { required: true })}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <TextField
                id="subLocation"
                label="Sub Location"
                error={!!errors.subLocation}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("subLocation")}
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
                margin: "0.5rem",
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
              <Typography
                variant="body2"
                sx={{ marginBottom: "0.1rem", color: grey[700] }}
              >
                Risk Level
              </Typography>
              <Controller
                control={control}
                name={"riskLevel"}
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
                      <ToggleButton value={RiskLevel.HIGH} key={RiskLevel.HIGH}>
                        <Typography variant="caption" component="div">
                          {RiskLevel.HIGH}
                        </Typography>
                      </ToggleButton>
                      <ToggleButton
                        value={RiskLevel.MEDIUM}
                        key={RiskLevel.MEDIUM}
                      >
                        <Typography variant="caption" component="div">
                          {RiskLevel.MEDIUM}
                        </Typography>
                      </ToggleButton>
                      <ToggleButton value={RiskLevel.LOW} key={RiskLevel.LOW}>
                        <Typography variant="caption" component="div">
                          {RiskLevel.LOW}
                        </Typography>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  );
                }}
              />
            </Box>

            <Box sx={{ margin: "0.5rem" }}>
              <Typography
                variant="body2"
                sx={{ marginBottom: "0.1rem", color: grey[700] }}
              >
                Unsafe Act or Condition
              </Typography>
              <Controller
                control={control}
                name={"unsafeActOrCondition"}
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
                        value={UnsafeActOrCondition.UNSAFE_ACT}
                        key={UnsafeActOrCondition.UNSAFE_ACT}
                      >
                        <Typography variant="caption" component="div">
                          {UnsafeActOrCondition.UNSAFE_ACT}
                        </Typography>
                      </ToggleButton>
                      <ToggleButton
                        value={UnsafeActOrCondition.UNSAFE_CONDITION}
                        key={UnsafeActOrCondition.UNSAFE_CONDITION}
                      >
                        <Typography variant="caption" component="div">
                          {UnsafeActOrCondition.UNSAFE_CONDITION}
                        </Typography>
                      </ToggleButton>
                    </ToggleButtonGroup>
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
                      value={field.value}
                      label="Due Date"
                      error={errors?.dueDate ? "Required" : ""}
                    />
                  );
                }}
              />
            </Box>
            <Box sx={{ margin: "0.5rem" }}>
              <Autocomplete
                {...register("assignee", { required: true })}
                size="small"
                disablePortal
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
          onClick={handleSubmit(onSubmitForm)} // Using onSubmitForm here
        >
          {defaultValues ? "Update Changes" : "Submit Report"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
