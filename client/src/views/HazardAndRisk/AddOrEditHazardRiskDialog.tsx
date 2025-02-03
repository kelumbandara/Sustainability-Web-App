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
import { useNavigate } from "react-router";
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
// import { sampleAssignees } from "../../api/sampleData/usersSampleDate";
import { useMutation } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import { enqueueSnackbar } from "notistack";

//API imports
import useCurrentUser from "../../hooks/useCurrentUser";
import { getAllUsers, User } from "../../api/userApi";
import { categorySchema, fetchMainCategory, fetchSubCategory, fetchObservationType } from "../../api/categoryApi";

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
  const { user } = useCurrentUser();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [mainCategory, setMainCategory] = useState<categorySchema[]>([]);
  const [subCategoryData, setSubCategory] = useState<categorySchema[]>([]);
  const [observationTypeData, setObservationType] = useState<categorySchema[]>([]);
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedObservationType, setSelectedObservationType] = useState(null);
  const asigneeLevel = user.assigneeLevel

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<HazardAndRisk>({
    defaultValues: {
      ...defaultValues,
      riskLevel: defaultValues?.riskLevel ?? RiskLevel.LOW,
      unsafeActOrCondition:
        defaultValues?.unsafeActOrCondition ?? UnsafeActOrCondition.UNSAFE_ACT,
    },
  });

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

  //API call to get all users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getAllUsers();
        if (data && Array.isArray(data.user)) {
          setAllUsers(data.user);
          console.log(data);
        } else {
          setAllUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setAllUsers([]);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    async function getMainCategory() {
      const data = await fetchMainCategory();
      setMainCategory(data);
    }
    getMainCategory();
  }, []);

  useEffect(() => {
    if (selectedCategory != null) {
      async function getSubCategory() {
        try {
          const data = await fetchSubCategory(selectedCategory);
          setSubCategory(data);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }

      getSubCategory();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubCategory != null) {
      async function getObservationType() {
        try {
          const data = await fetchObservationType(selectedSubCategory);
          setObservationType(data);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }

      getObservationType();
    }
  }, [selectedSubCategory]);

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

  const { mutate: createHazardRiskDocument } = useMutation({
    mutationFn: createHazardRisk,
  });

  const handleCreateDocument = (data: HazardAndRisk) => {
    console.log(data)
    const submitData: Partial<HazardAndRisk> = data;
    submitData.id = defaultValues?.id ?? uuidv4();
    submitData.createdDate = new Date();
    submitData.assigneeLevel = user.assigneeLevel;
    submitData.status = defaultValues?.status ?? HazardAndRiskStatus.DRAFT;
    onSubmit(submitData as HazardAndRisk);
    console.log('asigneeLevel',submitData.assigneeLevel)
    createHazardRiskDocument(data);
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
                options={mainCategory?.map((category) => category.categoryName)}
                sx={{ flex: 1, margin: "0.5rem" }}
                defaultValue={defaultValues?.category}
                onChange={(e, value) => {
                  console.log("Category selected:", value);
                  setSelectedCategory(value);
                  setValue("category", value);
                  setValue("subCategory", null);
                  setSelectedSubCategory(null);
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
                  options={subCategoryData?.map((category) => category.subCategory)}
                  value={selectedSubCategory}
                  onChange={(e, value) => {
                    console.log("Sub Category selected:", value);
                    setSelectedSubCategory(value);
                    setValue("subCategory", value);
                    setSelectedObservationType(null);
                    setValue("observationType", null);
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
                  noOptionsText={
                    <Typography variant="body2" color="inherit" gutterBottom>
                      No matching items
                    </Typography>
                  }
                  options={[...observationTypeData?.map((category) => category.observationType), "$ADD_NEW_ITEM"]}
                  value={selectedObservationType}
                  renderOption={(props, option) =>
                    option === "$ADD_NEW_ITEM" ? (
                      <AddNewObservationButton {...props} />
                    ) : (
                      <li {...props} key={option}>{option}</li>
                    )
                  }
                  onChange={(e, value) => {
                    console.log("Observation Type selected:", value);
                    setSelectedObservationType(value);
                    setValue("observationType", value);
                  }}
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
                options={
                  (allUsers || [])
                    .filter((assign) =>
                      assign?.assigneeLevel === (user?.assigneeLevel + 1) &&
                      Array.isArray(assign?.assignedFactory) &&
                      (assign.assignedFactory === null || assign.assignedFactory.includes("ABC Group"))
                    )
                    .map((assign) => assign?.name || "Unknown")
                }
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
          onClick={handleSubmit((data) => {
            handleCreateDocument(data);
          })}
        >
          {defaultValues ? "Update Changes" : "Submit Report"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
