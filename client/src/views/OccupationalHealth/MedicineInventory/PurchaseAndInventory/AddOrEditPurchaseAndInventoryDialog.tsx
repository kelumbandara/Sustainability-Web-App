import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Alert,
  Autocomplete,
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { HazardAndRiskStatus } from "../../../../api/hazardRiskApi";
import CustomButton from "../../../../components/CustomButton";
import DatePickerComponent from "../../../../components/DatePickerComponent";
import RichTextComponent from "../../../../components/RichTextComponent";
import useIsMobile from "../../../../customHooks/useIsMobile";
import theme from "../../../../theme";
import {
  MedicineInventory,
  publishMedicineInventory,
} from "../../../../api/OccupationalHealth/medicineInventoryApi";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { fetchMedicineList } from "../../../../api/OccupationalHealth/medicineNameApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchDivision } from "../../../../api/divisionApi";
import { fetchAllSupplierName } from "../../../../api/OccupationalHealth/medicineSupplierNameApi";
import { fetchAllSupplierTypes } from "../../../../api/OccupationalHealth/supplierType";
import SaveIcon from "@mui/icons-material/Save";
import PublishIcon from "@mui/icons-material/Publish";
import ApproveConfirmationModal from "../MedicineRequest/ApproveConfirmationModal";
import queryClient from "../../../../state/queryClient";
import { useSnackbar } from "notistack";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: MedicineInventory;
  onSubmit?: (data: MedicineInventory) => void;
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

export default function AddOrEditPurchaseAndInventoryDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: DialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { isMobile, isTablet } = useIsMobile();
  const [files, setFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    getValues,
    trigger,
  } = useForm<MedicineInventory>({});

  const manufacturingDate = watch("manufacturingDate");
  const expiryDate = watch("expiryDate");

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

  const handleCreateMedicineInventory = (data: MedicineInventory) => {
    const submitData: Partial<MedicineInventory> = data;
    submitData.id = defaultValues?.id ?? uuidv4();
    submitData.status = defaultValues?.status ?? HazardAndRiskStatus.DRAFT;
    onSubmit(submitData as MedicineInventory);
    resetForm();
  };

  const handlePublishMedicineInventory = () => {
    const data = getValues();
    data.status = HazardAndRiskStatus.PUBLISHED.toLowerCase();
    publishMedicineInventoryMutation(data);
  };

  const {
    data: medicineInventoryData,
    isFetching: isMedicineInventoryFetching,
  } = useQuery({
    queryKey: ["medicineInventory"],
    queryFn: fetchMedicineList,
  });

  const { data: divisionData, isFetching: isDivisionDataFetching } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  const { data: supplierTypeData, isFetching: isSupplierDataFetching } =
    useQuery({
      queryKey: ["supplierType"],
      queryFn: fetchAllSupplierTypes,
    });

  const { data: supplierNameData, isFetching: isSupplierNameDataFetching } =
    useQuery({
      queryKey: ["supplierName"],
      queryFn: fetchAllSupplierName,
    });

  const { mutate: publishMedicineInventoryMutation } = useMutation({
    mutationFn: publishMedicineInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicine-inventory"] });
      enqueueSnackbar("Medicine Inventory Report Published Successfully!", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar(`Medicine Inventory Publish Failed`, {
        variant: "error",
      });
    },
  });

  const isMedicineDetailsValid = useMemo(() => {
    return (
      !errors.medicineName &&
      !errors.genericName &&
      !errors.dosageStrength &&
      !errors.form &&
      !errors.medicineType
    );
  }, [
    errors.medicineName,
    errors.genericName,
    errors.dosageStrength,
    errors.form,
    errors.medicineType,
  ]);

  const isSupplierDetailsValid = useMemo(() => {
    return (
      !errors.supplierName &&
      !errors.supplierContactNumber &&
      !errors.supplierEmail &&
      !errors.supplierType &&
      !errors.location
    );
  }, [
    errors.supplierName,
    errors.supplierContactNumber,
    errors.supplierEmail,
    errors.supplierType,
    errors.location,
  ]);

  const isPurchaseDetailsValid = useMemo(() => {
    return (
      !errors.deliveryQuantity &&
      !errors.purchaseAmount &&
      !errors.thresholdLimit &&
      !errors.invoiceReference &&
      !errors.manufacturerName
    );
  }, [
    errors.deliveryQuantity,
    errors.purchaseAmount,
    errors.thresholdLimit,
    errors.invoiceReference,
    errors.manufacturerName,
  ]);

  const isStorageUsageValid = useMemo(() => {
    return !errors.batchNumber;
  }, [errors.batchNumber]);

  const triggerMedicineDetailsSection = () => {
    trigger([
      "medicineName",
      "genericName",
      "dosageStrength",
      "form",
      "medicineType",
    ]);
  };

  const triggerSupplierDetailsSection = () => {
    trigger([
      "supplierName",
      "supplierContactNumber",
      "supplierEmail",
      "supplierType",
      "location",
    ]);
  };

  const triggerPurchaseDetailsSection = () => {
    trigger([
      "deliveryQuantity",
      "purchaseAmount",
      "thresholdLimit",
      "invoiceReference",
      "manufacturerName",
    ]);
  };

  const triggerStorageUsageSection = () => {
    trigger(["batchNumber"]);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 1) {
      triggerMedicineDetailsSection();
    } else if (newValue === 2) {
      triggerSupplierDetailsSection();
    } else if (newValue === 3) {
      triggerPurchaseDetailsSection();
    } else if (newValue === 4) {
      triggerStorageUsageSection();
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
              ? "Edit an Medicine Inventory"
              : "Create a Medicine Inventory Item"}
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
                  <b>Request Date</b>
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
                      isMedicineDetailsValid &&
                      isSupplierDetailsValid &&
                      isPurchaseDetailsValid &&
                      isStorageUsageValid
                        ? "var(--pallet-blue)"
                        : "var(--pallet-red)",
                    height: "3px",
                  },
                }}
                sx={{
                  backgroundColor: "var(--pallet-lighter-grey)",
                  color: "var(--pallet-blue)",
                  width: "100%",
                }}
                textColor="inherit"
                variant="scrollable"
                scrollButtons={true}
              >
                <Tab
                  label={
                    <Box
                      sx={{
                        color: isMedicineDetailsValid
                          ? "var(--pallet-blue)"
                          : "var(--pallet-red)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <TextSnippetIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Medicine Details
                      </Typography>
                      {!isMedicineDetailsValid && (
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
                        color: isSupplierDetailsValid
                          ? "var(--pallet-blue)"
                          : "var(--pallet-red)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <LocalShippingIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Supplier Details
                      </Typography>
                      {!isSupplierDetailsValid && (
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
                        color: isPurchaseDetailsValid
                          ? "var(--pallet-blue)"
                          : "var(--pallet-red)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ReceiptLongIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Purchase Details
                      </Typography>
                      {!isPurchaseDetailsValid && (
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
                <Tab
                  label={
                    <Box
                      sx={{
                        color: isStorageUsageValid
                          ? "var(--pallet-blue)"
                          : "var(--pallet-red)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ApartmentIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Storage & Usage
                      </Typography>
                      {!isStorageUsageValid && (
                        <Typography
                          variant="subtitle1"
                          sx={{ ml: "0.3rem", color: "var(--pallet-red)" }}
                        >
                          *
                        </Typography>
                      )}
                    </Box>
                  }
                  {...a11yProps(3)}
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
                    <TextField
                      required
                      id="medicineName "
                      label="Medicine Name"
                      error={!!errors.medicineName}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("medicineName", { required: true })}
                    />
                    <TextField
                      required
                      id="genericName"
                      label="Generic Name"
                      error={!!errors.genericName}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("genericName", { required: true })}
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
                      id="dosageStrength"
                      label="Dosage Strength"
                      error={!!errors.dosageStrength}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("dosageStrength", { required: true })}
                    />
                    <Controller
                      name="form"
                      control={control}
                      defaultValue={defaultValues?.form}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={
                            medicineInventoryData?.length
                              ? [
                                  ...new Set(
                                    medicineInventoryData.map(
                                      (inventory) => inventory.form
                                    )
                                  ),
                                ]
                              : []
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.form}
                              label="Form"
                              name="form"
                            />
                          )}
                        />
                      )}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Controller
                      name="medicineType"
                      control={control}
                      defaultValue={defaultValues?.medicineType}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={
                            medicineInventoryData?.length
                              ? [
                                  ...new Set(
                                    medicineInventoryData.map(
                                      (inventory) => inventory.medicineType
                                    )
                                  ),
                                ]
                              : []
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.medicineType}
                              label="Medicine Type"
                              name="medicineType"
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
                    }}
                  >
                    <Controller
                      name="supplierName"
                      control={control}
                      defaultValue={defaultValues?.supplierName}
                      {...register("supplierName", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={
                            supplierNameData?.length
                              ? supplierNameData.map(
                                  (supplier) => supplier.supplierName
                                )
                              : []
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.supplierName}
                              label="Supplier Name"
                              name="supplierName"
                            />
                          )}
                        />
                      )}
                    />
                    <TextField
                      required
                      id="supplierContactNumber"
                      label="Supplier Contact Number"
                      error={!!errors.supplierContactNumber}
                      helperText={
                        errors.supplierContactNumber
                          ? errors.supplierContactNumber.message
                          : ""
                      }
                      size="small"
                      type="number"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("supplierContactNumber", {
                        required: {
                          value: true,
                          message: "Required",
                        },
                        min: {
                          value: 0,
                          message: "Invalid Contact Number",
                        },
                      })}
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
                      id="supplierEmail"
                      label="Email ID"
                      error={!!errors.supplierEmail}
                      size="small"
                      type="email"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("supplierEmail", { required: true })}
                    />
                    <Controller
                      name="supplierType"
                      control={control}
                      defaultValue={defaultValues?.supplierType}
                      {...register("supplierType", { required: true })}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={
                            supplierTypeData?.length
                              ? supplierTypeData.map(
                                  (supplier) => supplier.type
                                )
                              : []
                          }
                          sx={{ flex: 1, margin: "0.5rem" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              error={!!errors.supplierType}
                              label="Supplier Type"
                              name="supplierType"
                            />
                          )}
                        />
                      )}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <TextField
                      required
                      id="location"
                      label="Location / Country"
                      error={!!errors.location}
                      size="small"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("location", { required: true })}
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
                    <Controller
                      control={control}
                      {...register("manufacturingDate", { required: true })}
                      name={"manufacturingDate"}
                      render={({ field }) => {
                        return (
                          <Box sx={{ flex: 1, margin: "0.5rem" }}>
                            <DatePickerComponent
                              onChange={(e) => field.onChange(e)}
                              value={
                                field.value ? new Date(field.value) : undefined
                              }
                              label="Manufacturing Date"
                              error={
                                errors?.manufacturingDate ? "Required" : ""
                              }
                            />
                          </Box>
                        );
                      }}
                    />
                    <Controller
                      control={control}
                      {...register("expiryDate", { required: true })}
                      name={"expiryDate"}
                      render={({ field }) => {
                        return (
                          <Box sx={{ flex: 1, margin: "0.5rem" }}>
                            <DatePickerComponent
                              onChange={(e) => field.onChange(e)}
                              value={
                                field.value ? new Date(field.value) : undefined
                              }
                              label="Expiry Date"
                              error={errors?.expiryDate ? "Required" : ""}
                              minDate={manufacturingDate}
                            />
                          </Box>
                        );
                      }}
                    />
                    <Controller
                      control={control}
                      {...register("deliveryDate", { required: true })}
                      name={"deliveryDate"}
                      render={({ field }) => {
                        return (
                          <Box sx={{ flex: 1, margin: "0.5rem" }}>
                            <DatePickerComponent
                              onChange={(e) => field.onChange(e)}
                              value={
                                field.value ? new Date(field.value) : undefined
                              }
                              label="Delivery Date"
                              minDate={manufacturingDate}
                              maxDate={expiryDate}
                              error={errors?.deliveryDate ? "Required" : ""}
                            />
                          </Box>
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
                      id="deliveryQuantity"
                      label="Delivery Quantity"
                      error={!!errors.deliveryQuantity}
                      helperText={
                        errors.deliveryQuantity
                          ? errors.deliveryQuantity.message
                          : ""
                      }
                      size="small"
                      type="number"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("deliveryQuantity", {
                        required: {
                          value: true,
                          message: "Required",
                        },
                        min: {
                          value: 1,
                          message: "Quantity must be at least 1",
                        },
                      })}
                    />
                    <TextField
                      required
                      id="purchaseAmount"
                      label="Purchased Amount"
                      error={!!errors.purchaseAmount}
                      helperText={
                        errors.purchaseAmount
                          ? errors.purchaseAmount.message
                          : ""
                      }
                      size="small"
                      type="number"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("purchaseAmount", {
                        required: {
                          value: true,
                          message: "Required",
                        },
                        min: {
                          value: 0,
                          message: "Amount must be greater than 0",
                        },
                      })}
                    />
                    <TextField
                      required
                      id="thresholdLimit"
                      label="Threshold Limit"
                      error={!!errors.thresholdLimit}
                      helperText={
                        errors.thresholdLimit
                          ? errors.thresholdLimit.message
                          : ""
                      }
                      size="small"
                      type="number"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("thresholdLimit", {
                        required: {
                          value: true,
                          message: "Required",
                        },
                        min: {
                          value: 0,
                          message: "Threshold Limit must be greater than 0",
                        },
                      })}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Controller
                      control={control}
                      {...register("invoiceDate", { required: true })}
                      name={"invoiceDate"}
                      render={({ field }) => {
                        return (
                          <Box sx={{ flex: 1, margin: "0.5rem" }}>
                            <DatePickerComponent
                              onChange={(e) => field.onChange(e)}
                              value={
                                field.value ? new Date(field.value) : undefined
                              }
                              label="Invoice Date"
                              error={errors?.invoiceDate ? "Required" : ""}
                            />
                          </Box>
                        );
                      }}
                    />
                    <TextField
                      required
                      id="invoiceReference"
                      label="Invoice Reference"
                      error={!!errors.invoiceReference}
                      size="small"
                      sx={{
                        flex: 1,
                        margin: "0.5rem",
                        marginTop: isMobile ? "0.5rem" : "1.85rem",
                      }}
                      {...register("invoiceReference", { required: true })}
                    />
                    <TextField
                      required
                      id="manufacturer_name"
                      label="Manufacturer Name"
                      error={!!errors.manufacturerName}
                      size="small"
                      sx={{
                        flex: 1,
                        margin: "0.5rem",
                        marginTop: isMobile ? "0.5rem" : "1.85rem",
                      }}
                      {...register("manufacturerName", { required: true })}
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
                        handleTabChange(null, 3);
                      }}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Next
                    </CustomButton>
                  </Box>
                </Stack>
              </TabPanel>
              <TabPanel value={activeTab} index={3} dir={theme.direction}>
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
                    }}
                  >
                    <TextField
                      required
                      id="batchNumber"
                      label="Batch Number"
                      error={!!errors.batchNumber}
                      helperText={
                        errors.batchNumber ? errors.batchNumber.message : ""
                      }
                      size="small"
                      type="number"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("batchNumber", {
                        required: {
                          value: true,
                          message: "Required",
                        },
                        min: {
                          value: 0,
                          message: "Batch Number must be greater than 0",
                        },
                      })}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Controller
                      control={control}
                      name={"usageInstruction"}
                      render={({ field }) => {
                        return (
                          <RichTextComponent
                            onChange={(e) => field.onChange(e)}
                            placeholder={field.value ?? "Usage Instructions"}
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
                        handleTabChange(null, 2);
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
              {defaultValues && (
                <>
                  <Typography
                    variant="caption"
                    sx={{ marginLeft: "0.5rem", color: grey[700] }}
                  >
                    Status
                  </Typography>
                  <Box>
                    {defaultValues.status === "approved" ? (
                      <Chip label="Request Approved" />
                    ) : defaultValues.status === "published" ? (
                      <Chip
                        label="Published"
                        sx={{
                          backgroundColor: "var(--pallet-blue)",
                          color: "white",
                        }}
                      />
                    ) : (
                      "--"
                    )}
                  </Box>
                  <Box sx={{ margin: "0.5rem" }}>
                    <Typography
                      variant="caption"
                      sx={{ marginBottom: "0.1rem", color: grey[700] }}
                    >
                      Requested By
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ marginBottom: "0.1rem", color: grey[700] }}
                    >
                      {defaultValues?.requestedBy ?? "--"}
                    </Typography>
                  </Box>
                  <Box sx={{ margin: "0.5rem" }}>
                    <Typography
                      variant="caption"
                      sx={{ marginBottom: "0.1rem", color: grey[700] }}
                    >
                      Approved By
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ marginBottom: "0.1rem", color: grey[700] }}
                    >
                      {defaultValues?.requestedBy ?? "--"}
                    </Typography>
                  </Box>
                </>
              )}
              <Box sx={{ margin: "0.5rem" }}>
                <Controller
                  name="division"
                  control={control}
                  defaultValue={defaultValues?.division ?? ""}
                  {...register("division", { required: true })}
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
                          error={!!errors.division}
                          helperText={errors.division && "Required"}
                          label="Division"
                          name="division"
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
              backgroundColor: "var(--pallet-grey)",
            }}
            startIcon={<SaveIcon />}
            size="medium"
            onClick={handleSubmit((data) => {
              handleCreateMedicineInventory(data);
            })}
          >
            {defaultValues ? "Save Draft" : "Submit Item"}
          </CustomButton>
          <CustomButton
            variant="contained"
            sx={{
              backgroundColor: "var(--pallet-blue)",
            }}
            size="medium"
            startIcon={<PublishIcon />}
            onClick={() =>
              trigger().then((isValid) => {
                if (isValid) {
                  setPublishModalOpen(true);
                }
              })
            }
          >
            Publish Inventory Item
          </CustomButton>
        </DialogActions>

        {publishModalOpen && (
          <ApproveConfirmationModal
            open={publishModalOpen}
            title="Publish Medicine Inventory Confirmation"
            content={
              <>
                Are you sure you want to publish this Medicine Inventory Item?
                <Alert severity="warning" style={{ marginTop: "1rem" }}>
                  This action is not reversible.
                </Alert>
              </>
            }
            handleClose={() => setPublishModalOpen(false)}
            approveFunc={async () => {
              const isValid = await trigger();
              if (isValid) {
                handlePublishMedicineInventory();
              } else {
                enqueueSnackbar("Please fill in all required fields.", {
                  variant: "error",
                });
                setPublishModalOpen(false);
                throw new Error("Form Validation Error");
              }
            }}
            onSuccess={() => {
              setPublishModalOpen(false);
              handleClose();
            }}
            handleReject={() => {
              setPublishModalOpen(false);
            }}
          />
        )}
      </Dialog>
    </>
  );
}
