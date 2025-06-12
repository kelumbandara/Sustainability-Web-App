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
import RichTextComponent from "../../components/RichTextComponent";
import DropzoneComponent from "../../components/DropzoneComponent";
import { grey } from "@mui/material/colors";
import DatePickerComponent from "../../components/DatePickerComponent";
import CustomButton from "../../components/CustomButton";
import { Component, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";
import {
  HazardAndRis,
  HazardAndRiskStatus,
  HazardOrRiskCategories,
  RiskLevel,
  UnsafeActOrCondition,
} from "../../api/hazardRiskApi";
import {
  fetchSubCategory,
  fetchObservationType,
  fetchMainCategory,
} from "../../api/categoryApi";
import { useQuery } from "@tanstack/react-query";
import useCurrentUser from "../../hooks/useCurrentUser";
import { fetchAllUsers, fetchHazardRiskAssignee } from "../../api/userApi";
import { fetchDivision } from "../../api/divisionApi";
import UserAutoComplete from "../../components/UserAutoComplete";
import { StorageFile } from "../../utils/StorageFiles.util";
import { ExistingFileItemsEdit } from "../../components/ExistingFileItemsEdit";
import { format } from "date-fns";

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
  const [existingFiles, setExistingFiles] = useState<StorageFile[]>(
    defaultValues?.documents as StorageFile[]
  );
  const [filesToRemove, setFilesToRemove] = useState<string[]>([]);
  const [addNewContactDialogOpen, setAddNewContactDialogOpen] = useState(false);
  console.log("files", files);
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Component>({
    defaultValues: {
      ...defaultValues,
      documents: [],
      riskLevel: defaultValues?.riskLevel ?? RiskLevel.LOW,
      unsafeActOrCondition:
        defaultValues?.unsafeActOrCondition ?? UnsafeActOrCondition.UNSAFE_ACT,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

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

  const category = watch("category");
  const subCategory = watch("subCategory");
  const { user } = useCurrentUser();

  const { data: categoryData, isFetching: isCategoryDataFetching } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchMainCategory,
  });

  const { data: userData, isFetching: isUserDataFetching } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  const { data: assigneeData, isFetching: isAssigneeDataFetching } = useQuery({
    queryKey: ["hr-assignee"],
    queryFn: fetchHazardRiskAssignee,
  });

  const { data: subCategoryData, isFetching: isSubCategoryDataFetching } =
    useQuery({
      queryKey: ["Subcategories", category],
      queryFn: () => fetchSubCategory(category),
      enabled: !!category, // Prevents fetching when category is empty
    });

  const { data: observationData, isFetching: isObservationDataFetching } =
    useQuery({
      queryKey: ["observationType", subCategory],
      queryFn: () => fetchObservationType(subCategory),
      enabled: !!subCategory, // Prevents fetching when category is empty
    });

  const { data: divisionData, isFetching: isDivisionDataFetching } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

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

  const handleSubmitHazardAndRisk = (data: HazardAndRisk) => {
    const submitData: Partial<HazardAndRisk> = data;
    submitData.id = defaultValues?.id ?? uuidv4();
    submitData.assigneeId = assignee.id;
    // submitData.createdDate = new Date();
    // submitData.createdByUser = sampleAssignees[0].name;
    submitData.status = defaultValues?.status ?? HazardAndRiskStatus.DRAFT;
    if (filesToRemove?.length > 0) submitData.removeDoc = filesToRemove;
    submitData.documents = files;
    onSubmit(submitData as HazardAndRisk);
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
      onMouseDown={() => {
        setAddNewContactDialogOpen(true);
      }}
    >
      <AddIcon />
      <Typography variant="body2" component="div">
        Add New Demo
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
            Add New Demo
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
              label="Demo"
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
            Add Demo
          </CustomButton>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      <AddNewObservationTypeDialog
        category={category}
        subCategory={subCategory}
      />
      <Stack
        sx={{
          display: "flex",
          flexDirection: isTablet ? "column" : "row",
          padding: "1rem",
        }}
      >
        <Stack
        gap={3}
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
          <Box>
            <Typography>Normal AutoComplete</Typography>
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
                defaultValue={defaultValues?.division}
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
            </Box>
          </Box>
          <Box>
            <Typography>User AutoComplete Return the ID</Typography>
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
          </Box>
          <Box>
            <Typography>AutoComplete with Create Option</Typography>
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
                  <>
                    <Typography variant="body2" color="inherit" gutterBottom>
                      No matching Items
                    </Typography>
                  </>
                }
                options={[
                  ...(observationData?.length
                    ? observationData.map(
                        (category) => category.observationType
                      )
                    : []),
                  "$ADD_NEW_ITEM",
                ]}
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
          </Box>
        </Stack>
      </Stack>
    </>
  );
}
