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
import useIsMobile from "../../../customHooks/useIsMobile";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import CustomButton from "../../../components/CustomButton";
import { useEffect } from "react";
import {
  Consumption,
  fetchConsumptionCategories,
  fetchConsumptionSource,
  fetchConsumptionUnit,
} from "../../../api/Environment/environmentApi";
import { useQuery } from "@tanstack/react-query";
import RichTextComponent from "../../../components/RichTextComponent";
import FormDataSwitchButton from "../../../components/FormDataSwitchButton";
import { generateRandomNumberId } from "../../../util/numbers.util";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: Consumption;
  onSubmit: (data: Consumption) => void;
};

export default function AddOrEditAdditionalDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: DialogProps) {
  const { isMobile } = useIsMobile();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<Consumption>({
    defaultValues,
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
  };

  const category = watch("category");

  const {
    data: consumptionCategoryData,
    isFetching: isConsumptionCategoryDataFetching,
  } = useQuery({
    queryKey: ["cs-category"],
    queryFn: fetchConsumptionCategories,
  });

  const { data: consumptionSourceData, isFetching: isConsumptionSourceData } =
    useQuery({
      queryKey: ["cs-sources", category],
      queryFn: () => fetchConsumptionSource(category),
      enabled: !!category,
    });

  const {
    data: consumptionUnitData,
    isFetching: isConsumptionUnitDataFetching,
  } = useQuery({
    queryKey: ["cs-unit", category],
    queryFn: () => fetchConsumptionUnit(category),
    enabled: !!category,
  });

  return (
    <Dialog
      open={open}
      onClose={() => {
        resetForm();
        handleClose();
      }}
      fullWidth
      fullScreen={isMobile}
      maxWidth={"lg"}
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
          {defaultValues ? "Edit Consumption" : "Add Consumption"}
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
            direction: "column",
            flex: { lg: 3, md: 1 },
            padding: "0.5rem",
            borderRadius: "0.3rem",
          }}
        >
          <Stack
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              padding: "0.5rem",
              borderRadius: "0.3rem",
            }}
          >
            <Controller
              name="category"
              control={control}
              defaultValue={defaultValues?.category ?? ""}
              {...register("category", { required: true })}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  onChange={(event, newValue) => {
                    field.onChange(newValue);
                    setValue("unit", "");
                    setValue("source", "");
                  }}
                  size="small"
                  options={
                    consumptionCategoryData?.length
                      ? consumptionCategoryData.map(
                          (category) => category.categoryName
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
            <Controller
              name="source"
              control={control}
              defaultValue={defaultValues?.source ?? ""}
              {...register("source", { required: true })}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  onChange={(event, newValue) => field.onChange(newValue)}
                  size="small"
                  options={
                    consumptionSourceData?.length
                      ? consumptionSourceData.map((source) => source.sourceName)
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
            <Controller
              name="unit"
              control={control}
              defaultValue={defaultValues?.unit ?? ""}
              {...register("unit", { required: true })}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  onChange={(event, newValue) => field.onChange(newValue)}
                  size="small"
                  options={
                    consumptionUnitData?.length
                      ? consumptionUnitData.map((units) => units.unit)
                      : []
                  }
                  sx={{ flex: 1, margin: "0.5rem" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={!!errors.unit}
                      helperText={errors.unit && "Required"}
                      label="Unit"
                      name="unit"
                    />
                  )}
                />
              )}
            />
          </Stack>
          <Stack
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              padding: "0.5rem",
              borderRadius: "0.3rem",
            }}
          >
            <TextField
              required
              id="quantity"
              type="number"
              label="Quantity"
              error={!!errors.quantity}
              helperText={errors.quantity && errors.quantity.message}
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("quantity", {
                required: {
                  value: true,
                  message: "Required",
                },
                min: {
                  value: 0,
                  message: "Quantity must be greater than or equal to 0",
                },
              })}
            />
            <TextField
              required
              id="amount"
              type="number"
              label="Amount"
              error={!!errors.amount}
              helperText={errors.amount && errors.amount.message}
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("amount", {
                required: {
                  value: true,
                  message: "Required",
                },
                min: {
                  value: 0,
                  message: "Amount must be greater than or equal to 0",
                },
              })}
            />
            <TextField
              required
              id="ghgInTonnes"
              type="number"
              label="GHG in Tonnes"
              error={!!errors.ghgInTonnes}
              helperText={errors.ghgInTonnes && errors.ghgInTonnes.message}
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("ghgInTonnes", {
                required: {
                  value: true,
                  message: "Required",
                },
              })}
            />
          </Stack>
          <Stack
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              padding: "0.5rem",
              borderRadius: "0.3rem",
            }}
          >
            <TextField
              required
              id="scope"
              label="Scope"
              error={!!errors.scope}
              helperText={errors.scope && "Required"}
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("scope", { required: true })}
            />
            <TextField
              required
              id="methodOfTracking"
              label="Method Of Tracking"
              error={!!errors.methodOfTracking}
              helperText={errors.methodOfTracking && "Required"}
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("methodOfTracking", { required: true })}
            />
            <TextField
              required
              id="usageType"
              label="Usage Type"
              error={!!errors.usageType}
              helperText={errors.usageType && "Required"}
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("usageType", { required: true })}
            />
          </Stack>
          <Box
            sx={{
              margin: "1rem",
            }}
          >
            <Controller
              control={control}
              name="doYouHaveREC"
              defaultValue={0 as 0 | 1}
              render={({ field }) => (
                <FormDataSwitchButton
                  label="Do You Have Records"
                  onChange={field.onChange}
                  value={field.value as 0 | 1}
                />
              )}
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
            if (!data.consumptionId) {
              data.consumptionId = generateRandomNumberId();
            }
            onSubmit(data);
            resetForm();
            handleClose();
          })}
        >
          {defaultValues ? "Update Changes" : "Add Consumption"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
