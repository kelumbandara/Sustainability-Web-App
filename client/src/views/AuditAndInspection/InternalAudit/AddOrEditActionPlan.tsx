import {
  Dialog,
  DialogTitle,
  Typography,
  IconButton,
  Divider,
  DialogContent,
  Stack,
  TextField,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import {
  ScheduledInternalAuditActionPlan,
  ScheduledTaskActionPlanPriority,
} from "../../../api/AuditAndInspection/internalAudit";
import CustomButton from "../../../components/CustomButton";
import useIsMobile from "../../../customHooks/useIsMobile";
import queryClient from "../../../state/queryClient";
import CloseIcon from "@mui/icons-material/Close";
import DatePickerComponent from "../../../components/DatePickerComponent";
import UserAutoComplete from "../../../components/UserAutoComplete";
import { fetchInternalAuditAssignee } from "../../../api/userApi";

export const AddOrEditActionPlan = ({
  open,
  setOpen,
  selectedActionItem,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedActionItem: ScheduledInternalAuditActionPlan;
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      correctiveOrPreventiveAction:
        selectedActionItem?.correctiveOrPreventiveAction || "",
      dueDate: selectedActionItem?.dueDate || null,
      targetCompletionDate: selectedActionItem?.targetCompletionDate || null,
      priority:
        selectedActionItem?.priority ?? ScheduledTaskActionPlanPriority.MEDIUM,
      approver: selectedActionItem?.approver || null,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const { isMobile } = useIsMobile();
  const { enqueueSnackbar } = useSnackbar();

  const { data: assigneeData, isFetching: isAssigneeDataFetching } = useQuery({
    queryKey: ["internal-audit-assignee"],
    queryFn: fetchInternalAuditAssignee,
  });

  // const { mutate: createProcessTypeMutation, isPending } = useMutation({
  //   mutationFn: createProcessType,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["process-types"] });
  //     enqueueSnackbar("Process Type Created Successfully!", {
  //       variant: "success",
  //     });
  //     setOpen(false);
  //   },
  //   onError: () => {
  //     enqueueSnackbar(`Process Type Create Failed`, {
  //       variant: "error",
  //     });
  //   },
  // });

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
          {selectedActionItem ? "Update Action Item" : "Add New Action"}
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
          <Box
            sx={{
              margin: "0.5rem",
            }}
          >
            <Typography
              variant="body2"
              sx={{ marginBottom: "0.2rem", color: grey[700] }}
            >
              Corrective or Preventive Action
            </Typography>
            {/* <Controller
              control={control}
              name={"correctiveOrPreventiveAction"}
              render={({ field }) => {
                return (
                  <RichTextComponent
                    onChange={(e) => field.onChange(e)}
                    placeholder={field.value}
                  />
                );
              }}
            /> */}
            <TextField
              id="correctiveOrPreventiveAction"
              required
              label="Factory License No"
              sx={{ width: "100%" }}
              error={!!errors.correctiveOrPreventiveAction}
              size="small"
              {...register("correctiveOrPreventiveAction", { required: true })}
            />
          </Box>
          <Box sx={{ display: "flex" }}>
            <Box sx={{ margin: "0.5rem", flex: 1 }}>
              <Controller
                control={control}
                {...register("dueDate")}
                name={"dueDate"}
                render={({ field }) => {
                  return (
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value ? new Date(field.value) : null}
                      label="Due Date"
                    />
                  );
                }}
              />
            </Box>
            <Box sx={{ margin: "0.5rem", flex: 1 }}>
              <Controller
                control={control}
                {...register("targetCompletionDate")}
                name={"targetCompletionDate"}
                render={({ field }) => {
                  return (
                    <DatePickerComponent
                      onChange={(e) => field.onChange(e)}
                      value={field.value ? new Date(field.value) : null}
                      label="Target Completion Date"
                    />
                  );
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Box sx={{ flex: 1, margin: "0.5rem" }}>
              <Typography
                variant="body2"
                sx={{ marginBottom: "0.1rem", color: grey[700] }}
              >
                Priority
              </Typography>
              <Controller
                control={control}
                name={"priority"}
                defaultValue={
                  selectedActionItem?.priority ??
                  ScheduledTaskActionPlanPriority.MEDIUM
                }
                render={({ field }) => {
                  return (
                    <ToggleButtonGroup
                      size="small"
                      {...control}
                      aria-label="Small sizes"
                      color="primary"
                      value={field.value}
                      exclusive
                      sx={{
                        width: "100%",
                        display: "flex",
                      }}
                      onChange={(e, value) => {
                        field.onChange(value);
                      }}
                    >
                      <ToggleButton
                        value={ScheduledTaskActionPlanPriority.HIGH}
                        key={ScheduledTaskActionPlanPriority.HIGH}
                        sx={{
                          flex: 1,
                        }}
                      >
                        <Typography variant="caption" component="div">
                          {ScheduledTaskActionPlanPriority.HIGH}
                        </Typography>
                      </ToggleButton>
                      <ToggleButton
                        value={ScheduledTaskActionPlanPriority.MEDIUM}
                        key={ScheduledTaskActionPlanPriority.MEDIUM}
                        sx={{
                          flex: 1,
                        }}
                      >
                        <Typography variant="caption" component="div">
                          {ScheduledTaskActionPlanPriority.MEDIUM}
                        </Typography>
                      </ToggleButton>
                      <ToggleButton
                        value={ScheduledTaskActionPlanPriority.LOW}
                        key={ScheduledTaskActionPlanPriority.LOW}
                        sx={{
                          flex: 1,
                        }}
                      >
                        <Typography variant="caption" component="div">
                          {ScheduledTaskActionPlanPriority.LOW}
                        </Typography>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  );
                }}
              />
            </Box>
            <Box sx={{ flex: 1, paddingTop: "1rem", margin: "0.5rem" }}>
              <UserAutoComplete
                name="approver"
                label="Approver"
                control={control as any}
                register={register}
                errors={errors}
                userData={assigneeData}
                required={true}
                style={{ margin: 0 }}
              />
            </Box>
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
          // disabled={isPending}
          // endIcon={isPending ? <CircularProgress size={20} /> : null}
          onClick={handleSubmit((data) => console.log("data", data))}
        >
          {selectedActionItem ? "Update New" : "Add New"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};
