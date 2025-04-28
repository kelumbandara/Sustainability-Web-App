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
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Chemical,
  ChemicalRequest,
  HazardType,
  ProductStandard,
  UseOfPpe,
  ZdhcUseCategory,
} from "../../api/ChemicalManagement/ChemicalRequestApi";
import useIsMobile from "../../customHooks/useIsMobile";
import CustomButton from "../../components/CustomButton";
import {
  sampleChemicalCategoryList,
  sampleChemicalList,
  sampleProductStandardList,
} from "../../api/sampleData/chemicalRequestSampleData";
import DatePickerComponent from "../../components/DatePickerComponent";
import SwitchButton from "../../components/SwitchButton";
import DropzoneComponent from "../../components/DropzoneComponent";
import { useQuery } from "@tanstack/react-query";
import { fetchDivision } from "../../api/divisionApi";
import UserAutoComplete from "../../components/UserAutoComplete";
import { fetchAllUsers } from "../../api/userApi";
import AddIcon from "@mui/icons-material/Add";
import AutoCheckBox from "../../components/AutoCheckbox";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: ChemicalRequest;
  onSubmit?: (data: ChemicalRequest) => void;
};

export default function AddOrEditChemicalRequestDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: DialogProps) {
  const { isMobile, isTablet } = useIsMobile();
  const [files, setFiles] = useState<File[]>([]);
  const [openAddNewChemicalDialog, setOpenAddNewChemicalDialog] =
    useState(false);
  const [openAddNewStandardDialog, setOpenAddNewStandardDialog] =
    useState(false);
  const [chemicalData, setChemicalData] = useState<Chemical[]>([]);
  const [productStandardList, setProductStandardList] = useState(
    sampleProductStandardList
  );

  const { data: divisionData, isFetching: isDivisionDataFetching } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  const { data: userData, isFetching: isUserDataFetching } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ChemicalRequest>({
    defaultValues,
  });

  const watchMSDS = watch("msds_sds");

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    } else {
      reset();
    }
  }, [defaultValues, reset]);

  const resetForm = () => {
    reset();
  };

  const handleCreateRequest = (data: ChemicalRequest) => {
    const submitData: Partial<ChemicalRequest> = data;
    submitData.id = defaultValues?.id ?? uuidv4();
    onSubmit(submitData as ChemicalRequest);
    resetForm();
  };

  const AddNewChemicalButton = (props) => (
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
        setOpenAddNewChemicalDialog(true);
      }}
    >
      <AddIcon />
      <Typography variant="body2" component="div">
        Add a new chemical
      </Typography>
    </li>
  );

  const AddNewStandardButton = (props) => (
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
        setOpenAddNewStandardDialog(true);
      }}
    >
      <AddIcon />
      <Typography variant="body2" component="div">
        Add a new standard
      </Typography>
    </li>
  );

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
      <AddNewChemicalDialog
        open={openAddNewChemicalDialog}
        setOpen={setOpenAddNewChemicalDialog}
      />
      <AddNewStandardDialog
        open={openAddNewStandardDialog}
        setOpen={setOpenAddNewStandardDialog}
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
          {defaultValues
            ? "Edit Chemical Request"
            : "Add a New Chemical Request"}
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
              flex: 3,
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
                {...register("commercial_name", { required: true })}
                size="small"
                noOptionsText={
                  <>
                    <Typography variant="body2" color="inherit" gutterBottom>
                      No matching Items
                    </Typography>
                  </>
                }
                options={[
                  ...(chemicalData?.length
                    ? chemicalData.map((chemical) => chemical.commercial_name)
                    : []),
                  "$ADD_NEW_CHEMICAL",
                ]}
                renderOption={(props, option) => (
                  <>
                    {option === "$ADD_NEW_CHEMICAL" ? (
                      <AddNewChemicalButton {...props} />
                    ) : (
                      <li {...props} key={option}>
                        {option}
                      </li>
                    )}
                  </>
                )}
                sx={{ flex: 1, margin: "0.5rem" }}
                onChange={async (_, data) => {
                  const selectedChemical = chemicalData?.find(
                    (chemical) => chemical.commercial_name === data
                  );
                  console.log("selectedChemical", selectedChemical);
                  if (selectedChemical?.commercial_name) {
                    await setValue(
                      "commercial_name",
                      selectedChemical?.commercial_name
                    );
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!!errors.commercial_name}
                    label="Commercial Name"
                    name="commercial_name"
                    // slotProps={{ inputLabel: { shrink: true } }}
                  />
                )}
              />
              <TextField
                id="substance_name"
                label="Substance Name"
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("substance_name")}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <TextField
                id="molecular_formula"
                label="Molecular Formula"
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("molecular_formula")}
              />
              <TextField
                id="reach_registration_number"
                label="Reach Registration Number"
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("reach_registration_number")}
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
                id="requested_quantity"
                label="Requested Quantity"
                error={!!errors.requested_quantity}
                size="small"
                type="number"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("requested_quantity", { required: true })}
              />
              <Autocomplete
                {...register("requested_unit", { required: true })}
                size="small"
                options={["KG", "L", "G", "ML", "M", "CM", "MM", "PCS"]}
                defaultValue={defaultValues?.requested_unit}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.requested_unit}
                    label="Requested Unit"
                    name="requested_unit"
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
              <Autocomplete
                {...register("zdhc_use_category", { required: true })}
                size="small"
                options={["Cleaning", "Finishing", "Dyeing", "Washing"]}
                defaultValue={defaultValues?.zdhc_use_category}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.zdhc_use_category}
                    label="ZDHC Use Category"
                    name="ZDHC_use_category"
                  />
                )}
              />
              <Autocomplete
                {...register("chemical_form_type", { required: true })}
                size="small"
                options={["Liquid", "Solid", "Gas", "Plasma"]}
                defaultValue={defaultValues?.chemical_form_type}
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.chemical_form_type}
                    label="Chemical Form Type"
                    name="chemical_form_type"
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
                id="usage"
                label="Where and Why it is used?"
                error={!!errors.where_and_why_it_is_used}
                helperText={errors.where_and_why_it_is_used ? "Required" : ""}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("where_and_why_it_is_used", { required: true })}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flex: 2,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Autocomplete
                {...register("product_standard")}
                size="small"
                noOptionsText={
                  <>
                    <Typography variant="body2" color="inherit" gutterBottom>
                      No matching Items
                    </Typography>
                  </>
                }
                options={[
                  ...(productStandardList?.length
                    ? productStandardList.map((standard) => standard.name)
                    : []),
                  "$ADD_NEW_STANDARD",
                ]}
                renderOption={(props, option) => (
                  <>
                    {option === "$ADD_NEW_STANDARD" ? (
                      <AddNewStandardButton {...props} />
                    ) : (
                      <li {...props} key={option}>
                        {option}
                      </li>
                    )}
                  </>
                )}
                sx={{ flex: 1, margin: "0.5rem" }}
                onChange={async (_, data) => {
                  const selectedStandard = productStandardList?.find(
                    (standard) => standard.name === data
                  );
                  console.log("selectedChemical", selectedStandard);
                  if (selectedStandard?.name) {
                    await setValue("product_standard", selectedStandard?.name);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!!errors.commercial_name}
                    label="Product Standard"
                    name="product_standard"
                    // slotProps={{ inputLabel: { shrink: true } }}
                  />
                )}
              />
              <Box sx={{ flex: 1, margin: "0.5rem" }}></Box>
            </Box>
            <Box sx={{ margin: "0.5rem" }}>
              <Controller
                control={control}
                name={"msds_sds"}
                render={({ field }) => {
                  return (
                    <SwitchButton
                      label="Do you have an MSDS/SDS?"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  );
                }}
              />
            </Box>
            {watchMSDS && (
              <>
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
                      "Drop Your MSDS/SDS document. Please ensure the document size is less than 5MB."
                    }
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flex: 1,
                    flexDirection: isMobile ? "column" : "row",
                  }}
                >
                  {" "}
                  <Box sx={{ margin: "0.5rem", flex: 1 }}>
                    <Controller
                      control={control}
                      {...register("msds_sds_issued_date", { required: true })}
                      name={"msds_sds_issued_date"}
                      render={({ field }) => {
                        return (
                          <DatePickerComponent
                            onChange={(e) => field.onChange(e)}
                            value={field.value}
                            label="MSDS/SDS Issued Date"
                            error={
                              errors?.msds_sds_issued_date ? "Required" : ""
                            }
                          />
                        );
                      }}
                    />
                  </Box>
                  <Box sx={{ margin: "0.5rem", flex: 1 }}>
                    <Controller
                      control={control}
                      {...register("msds_sds_expiry_date", { required: true })}
                      name={"msds_sds_expiry_date"}
                      render={({ field }) => {
                        return (
                          <DatePickerComponent
                            onChange={(e) => field.onChange(e)}
                            value={field.value}
                            label="MSDS/SDS Expiry Date"
                            error={
                              errors?.msds_sds_expiry_date ? "Required" : ""
                            }
                          />
                        );
                      }}
                    />
                  </Box>
                </Box>
              </>
            )}
          </Stack>
          <Stack
            sx={{
              display: "flex",
              flex: 1,
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
                {...register("request_date", { required: true })}
                name={"request_date"}
                render={({ field }) => {
                  return (
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value}
                      label="Request Date"
                      error={errors?.request_date ? "Required" : ""}
                    />
                  );
                }}
              />
            </Box>
            <Box sx={{ margin: "0.5rem" }}>
              <Autocomplete
                {...register("division", { required: false })}
                size="small"
                options={
                  divisionData?.length
                    ? divisionData.map((division) => division.divisionName)
                    : []
                }
                sx={{ flex: 1 }}
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
            </Box>
            <TextField
              id="requested_customer"
              label="Requested Customer"
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("requested_customer")}
            />
            <TextField
              id="requested_merchandiser"
              label="Requested Merchandiser"
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("requested_merchandiser")}
            />
            <Box>
              <UserAutoComplete
                name="assignee"
                label="assignee"
                control={control}
                register={register}
                errors={errors}
                userData={userData}
                defaultValue={defaultValues?.reviewer}
                required={true}
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
            handleCreateRequest(data);
          })}
        >
          {defaultValues ? "Update Changes" : "Save Chemical Request"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}

const AddNewChemicalDialog = ({
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
    control,
    watch,
    setValue,
  } = useForm<Chemical>();
  const { isMobile } = useIsMobile();

  const handleCreateChemical = (data) => {
    console.log("Creating process type", data);
  };

  const useOfPPE = watch("use_of_ppe");
  const hazardType = watch("hazard_type");

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullScreen={isMobile}
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
          Add New Chemical
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
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <TextField
            {...register("commercial_name", { required: true })}
            required
            id="commercial_name"
            label="Commercial Name"
            size="small"
            fullWidth
            sx={{ margin: "0.5rem", flex: 1 }}
          />
          <TextField
            id="substance_name"
            label="Substance Name"
            size="small"
            sx={{ flex: 1, margin: "0.5rem" }}
            {...register("substance_name")}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <TextField
            id="molecular_formula"
            label="Molecular Formula"
            size="small"
            sx={{ flex: 1, margin: "0.5rem" }}
            {...register("molecular_formula")}
            error={!!errors.molecular_formula}
            helperText={
              errors.molecular_formula ? "This field is required" : ""
            }
          />
          <TextField
            id="reach_registration_number"
            label="Reach Registration Number"
            size="small"
            sx={{ flex: 1, margin: "0.5rem" }}
            {...register("reach_registration_number")}
            error={!!errors.reach_registration_number}
            helperText={
              errors.reach_registration_number ? "This field is required" : ""
            }
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Autocomplete
            {...register("zdhc_use_category", { required: true })}
            size="small"
            options={Object.values(ZdhcUseCategory)}
            sx={{ flex: 1, margin: "0.5rem" }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                error={!!errors.zdhc_use_category}
                helperText={
                  errors.zdhc_use_category ? "This field is required" : ""
                }
                label="ZDHC Use Category"
                name="zdhc_use_category"
              />
            )}
          />
          <Autocomplete
            {...register("chemical_form_type", { required: true })}
            size="small"
            options={["Liquid", "Solid", "Gas", "Plasma"]}
            sx={{ flex: 1, margin: "0.5rem" }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                error={!!errors.chemical_form_type}
                helperText={
                  errors.chemical_form_type ? "This field is required" : ""
                }
                label="Chemical Form Type"
                name="chemical_form_type"
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
            id="where_and_why_it_is_used"
            label="Where and Why it is used?"
            error={!!errors.where_and_why_it_is_used}
            size="small"
            sx={{ flex: 1, margin: "0.5rem" }}
            {...register("where_and_why_it_is_used", { required: true })}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Autocomplete
            {...register("zdhc_level", { required: true })}
            size="small"
            options={[
              "Not Applicable",
              "Level 3",
              "Level 2",
              "Level 1",
              "Level 0",
            ]}
            sx={{ flex: 1, margin: "0.5rem" }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                error={!!errors.zdhc_level}
                helperText={errors.zdhc_level ? "This field is required" : ""}
                label="ZDHC Level"
                name="zdhc_level"
              />
            )}
          />
          <TextField
            id="cas_no"
            label="CAS Number"
            error={!!errors.cas_no}
            size="small"
            sx={{ flex: 1, margin: "0.5rem" }}
            {...register("cas_no")}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <TextField
            id="colour_index"
            label="Colour Index"
            error={!!errors.colour_index}
            size="small"
            sx={{ flex: 1, margin: "0.5rem" }}
            {...register("colour_index")}
          />
          <Box sx={{ flex: 1, margin: "0.5rem" }}>
            <AutoCheckBox
              control={control}
              required={true}
              name="use_of_ppe"
              label="Use of PPE"
              options={Object.keys(UseOfPpe)?.map((key) => ({
                label: key,
                value: UseOfPpe[key],
              }))}
              selectedValues={useOfPPE}
              setSelectedValues={(value) => setValue("use_of_ppe", value)}
              getOptionLabel={(option) => option?.label || ""}
              getOptionValue={(option) => option?.value || ""}
              placeholder="Use of PPE"
              limitTags={1}
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
            <AutoCheckBox
              control={control}
              required={false}
              name="hazard_type"
              label="Hazard Type"
              options={Object.keys(HazardType)?.map((key) => ({
                label: key,
                value: HazardType[key],
              }))}
              selectedValues={hazardType}
              setSelectedValues={(value) => setValue("hazard_type", value)}
              getOptionLabel={(option) => option?.label || ""}
              getOptionValue={(option) => option?.value || ""}
              placeholder="Hazard Type"
              limitTags={1}
            />
          </Box>
          <TextField
            id="ghs_classification"
            label="GHS Classification"
            error={!!errors.ghs_classification}
            size="small"
            sx={{ flex: 1, margin: "0.5rem" }}
            {...register("ghs_classification")}
          />
        </Box>
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
          onClick={handleSubmit(handleCreateChemical)}
        >
          Add New Chemical
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

const AddNewStandardDialog = ({
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
    control,
    watch,
    setValue,
  } = useForm<ProductStandard>();
  const { isMobile } = useIsMobile();

  const handleCreateChemical = (data) => {
    console.log("Creating standard", data);
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
          Add New Product Standard
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
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <TextField
            {...register("name", { required: true })}
            required
            id="name"
            label="Name"
            size="small"
            fullWidth
            sx={{ margin: "0.5rem", flex: 1 }}
          />
        </Box>
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
          onClick={handleSubmit(handleCreateChemical)}
        >
          Add New Standard
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};
