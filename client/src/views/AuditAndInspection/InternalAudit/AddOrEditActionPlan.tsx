import {
  Dialog,
  DialogTitle,
  Typography,
  IconButton,
  Divider,
  DialogContent,
  Stack,
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
  createActionPlan,
  ScheduledInternalAuditActionPlan,
  ScheduledTaskActionPlanPriority,
  updateActionPlan,
} from "../../../api/AuditAndInspection/internalAudit";
import CustomButton from "../../../components/CustomButton";
import useIsMobile from "../../../customHooks/useIsMobile";
import queryClient from "../../../state/queryClient";
import CloseIcon from "@mui/icons-material/Close";
import DatePickerComponent from "../../../components/DatePickerComponent";
import UserAutoComplete from "../../../components/UserAutoComplete";
import { fetchInternalAuditAssignee } from "../../../api/userApi";
import RichTextComponent from "../../../components/RichTextComponent";
import theme from "../../../theme";
import { useEffect } from "react";

export const AddOrEditActionPlan = ({
  open,
  setOpen,
  handleClose,
  selectedActionItem,
  internalAuditId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleClose: () => void;
  selectedActionItem: ScheduledInternalAuditActionPlan;
  internalAuditId: number;
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const { isMobile } = useIsMobile();
  const { enqueueSnackbar } = useSnackbar();

  const { data: assigneeData } = useQuery({
    queryKey: ["internal-audit-assignee"],
    queryFn: fetchInternalAuditAssignee,
  });

  useEffect(() => {
    if (selectedActionItem) {
      reset(selectedActionItem);
    } else {
      reset();
    }
  }, [selectedActionItem, reset]);

  const handleSubmitActionPlan = async (data: any) => {
    const actionPlanData: ScheduledInternalAuditActionPlan = {
      internalAuditId: Number(internalAuditId),
      correctiveOrPreventiveAction: data.correctiveOrPreventiveAction,
      dueDate: data.dueDate,
      targetCompletionDate: data.targetCompletionDate,
      priority: data.priority,
      approverId: data.approver?.id,
    };

    if (selectedActionItem) {
      actionPlanData.actionPlanId = selectedActionItem.actionPlanId;
      updateActionPlanMutation(actionPlanData);
    } else {
      createActionPlanMutation(actionPlanData);
    }
  };

  const { mutate: createActionPlanMutation, isPending: isActionPlanCreating } =
    useMutation({
      mutationFn: createActionPlan,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["scheduled-internal-audit"],
        });
        enqueueSnackbar("Action Plan Updated Successfully!", {
          variant: "success",
        });
        reset();
        handleClose();
      },
      onError: () => {
        enqueueSnackbar(`Action Plan Update Failed`, {
          variant: "error",
        });
      },
    });

  const { mutate: updateActionPlanMutation, isPending: isActionPlanUpdating } =
    useMutation({
      mutationFn: updateActionPlan,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["scheduled-internal-audit"],
        });
        enqueueSnackbar("Action Plan Updated Successfully!", {
          variant: "success",
        });
        reset();
        handleClose();
      },
      onError: () => {
        enqueueSnackbar(`Action Plan Update Failed`, {
          variant: "error",
        });
      },
    });

  return (
    <Dialog
      open={open}
      onClose={() => handleClose()}
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
          onClick={() => handleClose()}
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "0.3rem",
                margin: "0.2rem",
                border: errors.correctiveOrPreventiveAction
                  ? `1px solid ${theme.palette.error.main}`
                  : "none",
                borderRadius: "0.5rem",
              }}
            >
              <Controller
                control={control}
                name={"correctiveOrPreventiveAction"}
                {...register("correctiveOrPreventiveAction", {
                  required: true,
                })}
                render={({ field }) => {
                  return (
                    <RichTextComponent
                      onChange={(e) => field.onChange(e)}
                      placeholder={field.value ?? null}
                    />
                  );
                }}
              />
              {errors.correctiveOrPreventiveAction && (
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.error.main, ml: "0.5rem" }}
                >
                  Required
                </Typography>
              )}
            </Box>
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
                defaultValue={selectedActionItem?.approver ?? null}
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
          disabled={isActionPlanCreating || isActionPlanUpdating}
          endIcon={
            isActionPlanUpdating || isActionPlanCreating ? (
              <CircularProgress size={20} />
            ) : null
          }
          onClick={handleSubmit(handleSubmitActionPlan)}
        >
          {selectedActionItem ? "Update New" : "Add New"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};
