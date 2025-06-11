import {
  Dialog,
  DialogTitle,
  Typography,
  IconButton,
  Divider,
  DialogContent,
  Stack,
  Box,
  Autocomplete,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useForm, Controller } from "react-hook-form";
import {
  InternalAuditQuestion,
  InternalAuditAnswerToQuestions,
  InternalAuditQuestionAnswersStatus,
  InternalAuditQuestionAnswerRating,
} from "../../../api/AuditAndInspection/internalAudit";
import CustomButton from "../../../components/CustomButton";
import { DrawerContentItem } from "../../../components/ViewDataDrawer";
import useIsMobile from "../../../customHooks/useIsMobile";
import { RenderAuditQuestionColorTag } from "../AuditBuilder/InternalAuditFormDrawerContent";
import CloseIcon from "@mui/icons-material/Close";

export const EditInternalAuditQuestionDialog = ({
  open,
  setOpen,
  question,
  answer,
  setAnswer,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  question: InternalAuditQuestion;
  answer: InternalAuditAnswerToQuestions | null;
  setAnswer?: (data: InternalAuditAnswerToQuestions) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<InternalAuditAnswerToQuestions>({
    defaultValues: {
      score: answer?.score ?? null,
      status: answer?.status ?? null,
      rating: answer?.rating ?? null,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const { isTablet } = useIsMobile();

  const watchStatus = watch("status");
  const watchRating = watch("rating");
  const watchScore = watch("score");
  console.log("watchStatus", watchStatus, watchRating, watchScore);

  const handleSubmitAnswer = (
    data: Partial<InternalAuditAnswerToQuestions>
  ) => {
    setAnswer({
      answerId: answer?.answerId ?? null,
      queGroupId: question.queGroupId,
      questionId: question.queId,
      score: Number(data.score) || null,
      status: data.status,
      rating: data.rating,
    });
    reset({
      score: null,
      status: null,
      rating: null,
    });
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset({
          score: null,
          status: null,
          rating: null,
        });
        setOpen(false);
      }}
      fullScreen={isTablet}
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
          Answer Question
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
            paddingX: "0.5rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Box
              sx={{
                backgroundColor: "var(--pallet-lighter-grey)",
                padding: "0.3rem",
                borderRadius: "0.3rem",
                display: "flex",
                alignItems: "center",
                marginRight: "0.5rem",
                marginTop: "0.8rem",
                objectFit: "contain",
                width: "fit-content",
                height: "fit-content",
              }}
            >
              {RenderAuditQuestionColorTag(question?.colorCode, "medium")}
            </Box>
            <DrawerContentItem label="Question" value={question?.question} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              marginBottom: "1rem",
            }}
          >
            <Typography variant="caption" sx={{ color: "var(--pallet-grey)" }}>
              {`${question?.allocatedScore} Allocated Score`}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Controller
              name="status"
              control={control}
              {...register("status", {
                required: true,
              })}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  size="small"
                  options={Object.values(InternalAuditQuestionAnswersStatus)}
                  onChange={(_, value) => field.onChange(value)}
                  sx={{ flex: 1, margin: "0.5rem" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={!!errors.status}
                      helperText={errors.status && "Required"}
                      label="Status"
                      name="status"
                    />
                  )}
                />
              )}
            />
            <Controller
              name="rating"
              control={control}
              {...register("rating", {
                required: true,
              })}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  size="small"
                  options={Object.values(InternalAuditQuestionAnswerRating)}
                  onChange={(_, value) => field.onChange(value)}
                  sx={{ flex: 1, margin: "0.5rem" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={!!errors.rating}
                      helperText={errors.rating && "Required"}
                      label="Rating"
                      name="rating"
                    />
                  )}
                />
              )}
            />
            <Controller
              name="score"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Required",
                },
                min: {
                  value: 0,
                  message: "Score must be greater than 0",
                },
                max: {
                  value: question?.allocatedScore,
                  message: `Score must be less than ${question?.allocatedScore}`,
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  id="score"
                  label="Score"
                  size="small"
                  fullWidth
                  type="number"
                  sx={{ margin: "0.5rem", flex: 1 }}
                  error={!!errors.score}
                  helperText={errors.score ? errors.score.message : ""}
                />
              )}
            />
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
          onClick={handleSubmit(handleSubmitAnswer)}
        >
          Submit Answer
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};
