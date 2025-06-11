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
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import useIsMobile from "../../../customHooks/useIsMobile";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import CustomButton from "../../../components/CustomButton";
import AddOrEditAdditionalDialog from "./AddOrEditAdditionalDialog";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDivision } from "../../../api/divisionApi";
import theme from "../../../theme";
import {
  Consumption,
  Environment,
  fetchConsumptionAssignee,
  Status,
} from "../../../api/Environment/environmentApi";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UserAutoComplete from "../../../components/UserAutoComplete";
import { monthData, yearData } from "../../../api/sampleData/consumptionData";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: Environment;
  onSubmit?: (data: Environment) => void;
};

export default function AddOrEditConsumptionDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: DialogProps) {
  const { isMobile, isTablet } = useIsMobile();
  // const [selectedEnvironment, setSelectedEnvironment] =
  //   useState<Environment>(null);
  const [openAddOrEditAdditionalDialog, setOpenAddOrEditAdditionalDialog] =
    useState(false);
  const [selectedConsumption, setSelectedConsumption] =
    useState<Consumption>(null);
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<Environment>({
    defaultValues: defaultValues,
  });

  const { data: divisionData, isFetching: isDivisionDataFetching } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  const {
    data: consumptionAssigneeData,
    isFetching: isConsumptionAssigneeData,
  } = useQuery({
    queryKey: ["cs-assignee"],
    queryFn: fetchConsumptionAssignee,
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
  const consumptionWatch = watch("impactConsumption");
  const selectMonth = watch("month");
  const selectYear = watch("year");
  const selectDivision = watch("division");
  const reviewer = watch("reviewer");
  const approver = watch("approver");

  const handleCreateConsumption = (data: Environment) => {
    const submitData: Partial<Environment> = data;
    submitData.reviewerId = reviewer.id;
    submitData.approverId = approver.id;
    onSubmit(submitData as Environment);
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
              ? "Edit Consumption Details"
              : "Create a New Consumption"}
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
              gap={2}
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
                <TextField
                  required
                  type="number"
                  id="totalWorkForce"
                  label="Total WorkForce"
                  error={!!errors.totalWorkForce}
                  helperText={
                    errors.totalWorkForce && errors.totalWorkForce.message
                  }
                  size="small"
                  sx={{ flex: 1, margin: "0.5rem" }}
                  {...register("totalWorkForce", {
                    required: {
                      value: true,
                      message: "Required",
                    },
                    min: {
                      value: 0,
                      message: "Total WorkForce must be greater than 0",
                    },
                  })}
                />
                <TextField
                  required
                  id="numberOfDaysWorked"
                  label="Number Of Days Worked"
                  type="number"
                  helperText={
                    errors.numberOfDaysWorked &&
                    errors.numberOfDaysWorked.message
                  }
                  error={!!errors.numberOfDaysWorked}
                  size="small"
                  sx={{ flex: 1, margin: "0.5rem" }}
                  {...register("numberOfDaysWorked", {
                    required: {
                      value: true,
                      message: "Required",
                    },
                    min: {
                      value: 0,
                      message: "Number of Days Worked must be greater than 0",
                    },
                  })}
                />
                <TextField
                  required
                  id="area"
                  label="Area In Square Meter"
                  type="number"
                  error={!!errors.area}
                  helperText={errors.area && errors.area.message}
                  size="small"
                  sx={{ flex: 1, margin: "0.5rem" }}
                  {...register("area", {
                    required: {
                      value: true,
                      message: "Required",
                    },
                    min: {
                      value: 0,
                      message: "Area must be greater than 0",
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
                  id="totalProductProducedPcs"
                  label="Total Product Produced/Shipped (Pcs)"
                  error={!!errors.totalProductProducedPcs}
                  helperText={
                    errors.totalProductProducedPcs &&
                    errors.totalProductProducedPcs.message
                  }
                  size="small"
                  type="number"
                  sx={{ flex: 1, margin: "0.5rem" }}
                  {...register("totalProductProducedPcs", {
                    required: {
                      value: true,
                      message: "Required",
                    },
                    min: {
                      value: 0,
                      message: "Total Product Produced must be greater than 0",
                    },
                  })}
                />
                <TextField
                  required
                  id="totalProductProducedKg"
                  label="Total Product Produced/Shipped(Kg)"
                  type="number"
                  error={!!errors.totalProductProducedKg}
                  helperText={
                    errors.totalProductProducedKg &&
                    errors.totalProductProducedKg.message
                  }
                  size="small"
                  sx={{ flex: 1, margin: "0.5rem" }}
                  {...register("totalProductProducedKg", {
                    required: {
                      value: true,
                      message: "Required",
                    },
                    min: {
                      value: 0,
                      message: "Total Product Produced must be greater than 0",
                    },
                  })}
                />
              </Box>

              <Stack
                sx={{
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <Controller
                  name="division"
                  control={control}
                  defaultValue={defaultValues?.division ?? null}
                  rules={{ required: true }}
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

                <Controller
                  name="year"
                  control={control}
                  defaultValue={defaultValues?.year ?? null}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      size="small"
                      options={
                        yearData?.length
                          ? yearData.map((year) => year.year)
                          : []
                      }
                      sx={{ flex: 1, margin: "0.5rem" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          error={!!errors.year}
                          helperText={errors.year && "Required"}
                          label="Year"
                          name="year"
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="month"
                  control={control}
                  defaultValue={defaultValues?.month ?? null}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      size="small"
                      options={
                        monthData?.length
                          ? monthData.map((month) => month.month)
                          : []
                      }
                      sx={{ flex: 1, margin: "0.5rem" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          error={!!errors.month}
                          helperText={errors.month && "Required"}
                          label="Month"
                          name="month"
                        />
                      )}
                    />
                  )}
                />
              </Stack>

              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", marginBottom: "1rem" }}
              >
                Additional Details
              </Typography>
              <Stack sx={{ alignItems: "center", m: "0.5rem" }}>
                <TableContainer
                  component={Paper}
                  elevation={2}
                  sx={{
                    overflowX: "auto",
                    maxWidth: isMobile ? "88vw" : "100%",
                  }}
                >
                  {selectMonth && selectYear && selectDivision ? (
                    <Box
                      sx={{
                        padding: theme.spacing(2),
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "var(--pallet-blue)" }}
                        startIcon={<AddIcon />}
                        onClick={() => {
                          // setSelectedEnvironment(null);
                          setOpenAddOrEditAdditionalDialog(true);
                        }}
                      >
                        Add Impact Consumption
                      </Button>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        padding: theme.spacing(2),
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Typography variant="body2">
                        Select Month, Year, and Division to Add Impact
                        Consumption
                      </Typography>
                    </Box>
                  )}

                  <Table aria-label="simple table">
                    <TableHead
                      sx={{
                        backgroundColor: "var(--pallet-lighter-grey)",
                      }}
                    >
                      <TableRow>
                        <TableCell align="center">Category</TableCell>
                        <TableCell align="center">Source</TableCell>
                        <TableCell align="center">Unit</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="center">Amount</TableCell>
                        <TableCell align="center">GHG in Tonnes</TableCell>
                        <TableCell align="center"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {consumptionWatch?.length > 0 ? (
                        consumptionWatch?.map((row) => (
                          <TableRow
                            // key={`${row.consumptionsId}`}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: 0,
                              },
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              console.log("row");
                            }}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              align="center"
                            >
                              {row.category}
                            </TableCell>
                            <TableCell align="center">{row.source}</TableCell>
                            <TableCell align="center">{row.unit}</TableCell>
                            <TableCell align="center">{row.quantity}</TableCell>
                            <TableCell align="center">{row.amount}</TableCell>
                            <TableCell align="center">
                              {row.ghgInTonnes}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                onClick={() => {
                                  setSelectedConsumption(row);
                                  setOpenAddOrEditAdditionalDialog(true);
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => {
                                  setValue(
                                    "impactConsumption",
                                    (consumptionWatch ?? []).filter(
                                      (item) =>
                                        item.consumptionId !== row.consumptionId
                                    )
                                  );
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={11} align="center">
                            <Typography variant="body2">
                              No Records found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </Stack>
            <Stack
              gap={2}
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
              <Box>
                <UserAutoComplete
                  name="approver"
                  label="Approver"
                  control={control}
                  register={register}
                  errors={errors}
                  userData={consumptionAssigneeData}
                  defaultValue={defaultValues?.approver}
                  required={true}
                />
              </Box>

              <Box>
                <UserAutoComplete
                  name="reviewer"
                  label="Reviewer"
                  control={control}
                  register={register}
                  errors={errors}
                  userData={consumptionAssigneeData}
                  defaultValue={defaultValues?.reviewer}
                  required={true}
                />
              </Box>

              {defaultValues && (
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
                        </ToggleButtonGroup>
                      );
                    }}
                  />
                </Box>
              )}
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
              handleCreateConsumption(data);
            })}
          >
            {defaultValues ? "Update Changes" : "Create Consumption"}
          </CustomButton>
        </DialogActions>
      </Dialog>
      {openAddOrEditAdditionalDialog && (
        <AddOrEditAdditionalDialog
          open={openAddOrEditAdditionalDialog}
          handleClose={() => setOpenAddOrEditAdditionalDialog(false)}
          onSubmit={(data) => {
            console.log("Adding new Consumption", data);
            if (selectedConsumption) {
              setValue("impactConsumption", [
                ...(consumptionWatch ?? []).map((item) => {
                  if (
                    item.consumptionId === selectedConsumption.consumptionId
                  ) {
                    return data;
                  }
                  return item;
                }),
              ]);
            } else {
              setValue("impactConsumption", [
                ...(consumptionWatch ?? []),
                data,
              ]);
            }
            setOpenAddOrEditAdditionalDialog(false);
            setSelectedConsumption(null);
          }}
          defaultValues={selectedConsumption}
        />
      )}
    </>
  );
}
