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
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { HazardAndRiskStatus } from "../../../../api/hazardRiskApi";
import { sampleDivisions } from "../../../../api/sampleData/documentData";
import CustomButton from "../../../../components/CustomButton";
import DatePickerComponent from "../../../../components/DatePickerComponent";
import RichTextComponent from "../../../../components/RichTextComponent";
import useIsMobile from "../../../../customHooks/useIsMobile";
import theme from "../../../../theme";
import { MedicineInventory } from "../../../../api/OccupationalHealth/medicineInventoryApi";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ApartmentIcon from "@mui/icons-material/Apartment";
import {
  medicineInventoryForms,
  medicineTypes,
  sampleMedicineSuppliers,
  supplierTypes,
} from "../../../../api/sampleData/medicineInventorySampleData";

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
  const { isMobile, isTablet } = useIsMobile();
  const [files, setFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log("event", event);
    setActiveTab(newValue);
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
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
                        color: "var(--pallet-blue)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <TextSnippetIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Medicine Details
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(0)}
                />
                <Tab
                  label={
                    <Box
                      sx={{
                        color: "var(--pallet-blue)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <LocalShippingIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Supplier Details
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(1)}
                />
                <Tab
                  label={
                    <Box
                      sx={{
                        color: "var(--pallet-blue)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ReceiptLongIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Purchase Details
                      </Typography>
                    </Box>
                  }
                  {...a11yProps(2)}
                />
                <Tab
                  label={
                    <Box
                      sx={{
                        color: "var(--pallet-blue)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ApartmentIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                        Storage & Usage
                      </Typography>
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
                          options={medicineInventoryForms}
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
                          options={medicineTypes}
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
                        setActiveTab(1);
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
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={
                            sampleMedicineSuppliers.map(
                              (supplier) => supplier.supplierName
                            ) ?? []
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
                      size="small"
                      type="number"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("supplierContactNumber", {
                        required: true,
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
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          size="small"
                          options={supplierTypes}
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
                        setActiveTab(0);
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
                        setActiveTab(2);
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
                      size="small"
                      type="number"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("deliveryQuantity", { required: true })}
                    />
                    <TextField
                      required
                      id="purchaseAmount"
                      label="Purchased Amount"
                      error={!!errors.purchaseAmount}
                      size="small"
                      type="number"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("purchaseAmount", { required: true })}
                    />
                    <TextField
                      required
                      id="thresholdLimit"
                      label="Threshold Limit"
                      error={!!errors.thresholdLimit}
                      size="small"
                      type="number"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("thresholdLimit", { required: true })}
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
                        setActiveTab(1);
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
                        setActiveTab(3);
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
                      size="small"
                      type="number"
                      sx={{ flex: 1, margin: "0.5rem" }}
                      {...register("batchNumber", { required: true })}
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
                        setActiveTab(2);
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
                  <Box sx={{ margin: "0.5rem" }}>
                    <Typography
                      variant="body2"
                      sx={{ marginBottom: "0.1rem", color: grey[700] }}
                    >
                      Requested By
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ marginBottom: "0.1rem", color: grey[700] }}
                    >
                      {defaultValues?.requestedBy ?? "--"}
                    </Typography>
                  </Box>

                  <Box sx={{ margin: "0.5rem" }}>
                    <Typography
                      variant="body2"
                      sx={{ marginBottom: "0.1rem", color: grey[700] }}
                    >
                      Approved By
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ marginBottom: "0.1rem", color: grey[700] }}
                    >
                      {defaultValues?.requestedBy ?? "--"}
                    </Typography>
                  </Box>
                </>
              )}
              <Box sx={{ margin: "0.5rem" }}>
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
              handleCreateMedicineInventory(data);
            })}
          >
            {defaultValues ? "Update Changes" : "Submit Item"}
          </CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
