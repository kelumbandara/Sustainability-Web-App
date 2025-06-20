import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  Box,
  Stack,
  Divider,
  DialogContent,
  IconButton,
  DialogTitle,
  Dialog,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { Controller, useForm } from "react-hook-form";
import CustomButton from "../../../components/CustomButton";
import useIsMobile from "../../../customHooks/useIsMobile";
import theme from "../../../theme";
import {
  InternalAudit,
  InternalAuditQuestion,
  InternalAuditQuestionGroup,
  QuestionColorCodes,
} from "../../../api/AuditAndInspection/internalAudit";
import { RenderAuditQuestionColorTag } from "./InternalAuditFormDrawerContent";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { generateRandomNumberId } from "../../../util/numbers.util";

function AddOrEditInternalAuditFormDialog({
  open,
  defaultValues,
  handleClose,
  onSubmit,
}: {
  open: boolean;
  defaultValues: InternalAudit;
  handleClose: () => void;
  onSubmit: (data: InternalAudit) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<InternalAudit>({
    defaultValues: {
      id: defaultValues?.id,
      name: defaultValues?.name,
      description: defaultValues?.description,
      questionGroups: defaultValues?.questionGroups,
    },
  });

  const [openAddOrEditQuestionGroupModal, setOpenAddOrEditQuestionGroupModal] =
    useState(false);
  const [openAddOrEditQuestionModal, setOpenAddOrEditQuestionModal] =
    useState(false);
  const [selectedQuestionGroup, setSelectedQuestionGroup] =
    useState<InternalAuditQuestionGroup | null>(null);
  const [selectedQuestion, setSelectedQuestion] =
    useState<InternalAuditQuestion | null>(null);
  const [openDeleteQuestionGroupModal, setOpenDeleteQuestionGroupModal] =
    useState(false);

  const handleSubmitInternalAudit = (data: Partial<InternalAudit>) => {
    onSubmit(data);
    handleClose();
  };

  const questionGroups = watch("questionGroups");

  return (
    <Dialog
      open={open}
      onClose={() => {
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
            ? "Edit Internal Audit Form"
            : "Add a New Internal Audit Form"}
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
        <Stack spacing={1} sx={{ padding: theme.spacing(1) }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TextField
              required
              label="Name"
              size="small"
              sx={{ margin: "0.5rem" }}
              error={!!errors.name}
              {...register("name", { required: true })}
              helperText={errors.name ? "Name is required" : ""}
            />
            <TextField
              required
              label="Description"
              multiline
              rows={4}
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              error={!!errors.description}
              {...register("description", { required: true })}
              helperText={errors.description ? "Description is required" : ""}
            />
          </Box>
          <Box
            sx={{
              padding: "1rem",
              backgroundColor: grey[50],
              borderRadius: "0.3rem",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
          >
            <Box
              sx={{
                padding: theme.spacing(2),
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" sx={{ paddingBottom: 0 }}>
                Question Groups
              </Typography>
              <Button
                variant="contained"
                sx={{ backgroundColor: "var(--pallet-blue)" }}
                startIcon={<AddIcon />}
                onClick={() => {
                  setSelectedQuestionGroup(null);
                  setOpenAddOrEditQuestionGroupModal(true);
                }}
              >
                Create New Question Group
              </Button>
            </Box>
            <Stack>
              {!questionGroups?.length && (
                <Box sx={{ padding: "1rem" }}>
                  <Alert variant="standard" severity="info">
                    No Question Groups Added
                  </Alert>
                </Box>
              )}
              {questionGroups?.map((group) => (
                <SectionAccordion
                  key={group.queGroupId}
                  questionGroup={group}
                  setOpenAddOrEditQuestionGroupModal={
                    setOpenAddOrEditQuestionGroupModal
                  }
                  setSelectedQuestionGroup={setSelectedQuestionGroup}
                  setOpenAddOrEditQuestionModal={setOpenAddOrEditQuestionModal}
                  setSelectedQuestion={setSelectedQuestion}
                  onRemoveQuestionGroup={() => {
                    setSelectedQuestionGroup(group);
                    setOpenDeleteQuestionGroupModal(true);
                  }}
                  onRemoveQuestion={(questionToRemove) => {
                    setValue(
                      "questionGroups",
                      questionGroups.map((qGroup) =>
                        qGroup.queGroupId === group.queGroupId
                          ? {
                              ...qGroup,
                              questions: qGroup.questions.filter(
                                (question) =>
                                  question.queId !== questionToRemove?.queId
                              ),
                            }
                          : qGroup
                      )
                    );
                    setSelectedQuestionGroup(null);
                    setSelectedQuestion(null);
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: "1rem" }}>
        <Button
          onClick={() => {
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
            handleSubmitInternalAudit(data);
          })}
        >
          {defaultValues ? "Update Changes" : "Create Audit Form"}
        </CustomButton>
      </DialogActions>
      {openDeleteQuestionGroupModal && (
        <DeleteConfirmationModal
          open={openDeleteQuestionGroupModal}
          title="Remove Question Group Confirmation"
          content={
            <>
              Are you sure you want to remove this question group?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setOpenAddOrEditQuestionGroupModal(false)}
          deleteFunc={async () => {
            if (selectedQuestionGroup) {
              setValue(
                "questionGroups",
                questionGroups.filter(
                  (group) =>
                    group.queGroupId !== selectedQuestionGroup.queGroupId
                )
              );
            }
          }}
          onSuccess={() => {
            setOpenDeleteQuestionGroupModal(false);
            setSelectedQuestionGroup(null);
          }}
          handleReject={() => {
            setOpenDeleteQuestionGroupModal(false);
            setSelectedQuestionGroup(null);
          }}
        />
      )}
      {openAddOrEditQuestionGroupModal && (
        <AddOrEditQuestionGroupDialog
          open={openAddOrEditQuestionGroupModal}
          handleClose={() => {
            setOpenAddOrEditQuestionGroupModal(false);
            setSelectedQuestionGroup(null);
          }}
          onSubmit={(data) => {
            if (data.queGroupId) {
              setValue(
                "questionGroups",
                questionGroups.map((group) =>
                  group.queGroupId === selectedQuestionGroup.queGroupId
                    ? { ...group, groupName: data.groupName }
                    : group
                )
              );
            } else {
              setValue("questionGroups", [
                ...(questionGroups || []),
                {
                  ...data,
                  queGroupId: generateRandomNumberId(),
                  questions: [],
                },
              ]);
            }
            setOpenAddOrEditQuestionGroupModal(false);
            setSelectedQuestionGroup(null);
          }}
          defaultValues={selectedQuestionGroup}
        />
      )}

      {openAddOrEditQuestionModal && (
        <AddOrEditQuestionDialog
          open={openAddOrEditQuestionModal}
          handleClose={() => {
            setOpenAddOrEditQuestionModal(false);
            setSelectedQuestion(null);
            setSelectedQuestionGroup(null);
          }}
          onSubmit={(data) => {
            if (data.queId) {
              setValue(
                "questionGroups",
                questionGroups.map((group) =>
                  group.queGroupId === selectedQuestionGroup?.queGroupId
                    ? {
                        ...group,
                        questions: group.questions.map((question) =>
                          question.queId === data.queId ? { ...data } : question
                        ),
                      }
                    : group
                )
              );
            } else {
              setValue(
                "questionGroups",
                questionGroups.map((group) =>
                  group.queGroupId === selectedQuestionGroup?.queGroupId
                    ? {
                        ...group,
                        questions: [
                          ...(group?.questions || []),
                          {
                            ...data,
                            queId: generateRandomNumberId(),
                            queGroupId: group.queGroupId,
                          },
                        ],
                      }
                    : group
                )
              );
            }
            setOpenAddOrEditQuestionModal(false);
            setSelectedQuestion(null);
            setSelectedQuestionGroup(null);
          }}
          defaultValues={selectedQuestion}
        />
      )}
    </Dialog>
  );
}

export default AddOrEditInternalAuditFormDialog;

const SectionAccordion = ({
  questionGroup,
  setOpenAddOrEditQuestionGroupModal,
  setSelectedQuestionGroup,
  setOpenAddOrEditQuestionModal,
  setSelectedQuestion,
  onRemoveQuestionGroup,
  onRemoveQuestion,
}: {
  questionGroup: InternalAuditQuestionGroup;
  setOpenAddOrEditQuestionGroupModal: (open: boolean) => void;
  setSelectedQuestionGroup: (questionGroup: InternalAuditQuestionGroup) => void;
  setOpenAddOrEditQuestionModal: (open: boolean) => void;
  setSelectedQuestion: (question: InternalAuditQuestion) => void;
  onRemoveQuestionGroup: () => void;
  onRemoveQuestion: (questionToRemove: InternalAuditQuestion) => void;
}) => {
  const { isMobile } = useIsMobile();

  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Typography component="span">{questionGroup.groupName}</Typography>
          <Box
            sx={{ display: "flex", gap: "1rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              onClick={() => {
                setSelectedQuestionGroup(questionGroup);
                setOpenAddOrEditQuestionGroupModal(true);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                onRemoveQuestionGroup();
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer
          sx={{
            overflowX: "auto",
            maxWidth: isMobile ? "88vw" : "100%",
          }}
        >
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
                setSelectedQuestion(null);
                setSelectedQuestionGroup(questionGroup);
                setOpenAddOrEditQuestionModal(true);
              }}
            >
              Create New Question
            </Button>
          </Box>
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell align="center">Color Code</TableCell>
                <TableCell align="left">Question</TableCell>
                <TableCell align="center">Allocated Score</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questionGroup?.questions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography variant="body2">No Questions found</Typography>
                  </TableCell>
                </TableRow>
              )}
              {questionGroup?.questions.map((row) => {
                return (
                  <TableRow>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {RenderAuditQuestionColorTag(row.colorCode)}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        marginTop: "0.5rem",
                      }}
                    >
                      <Typography variant="body2">{row.question}</Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        marginTop: "0.5rem",
                      }}
                    >
                      <Typography variant="body2">
                        {row.allocatedScore}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => {
                          setSelectedQuestion(row);
                          setSelectedQuestionGroup(questionGroup);
                          setOpenAddOrEditQuestionModal(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setSelectedQuestion(row);
                          setSelectedQuestionGroup(questionGroup);
                          onRemoveQuestion(row);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
};

const AddOrEditQuestionGroupDialog = ({
  open,
  defaultValues,
  handleClose,
  onSubmit,
}: {
  open: boolean;
  defaultValues: InternalAuditQuestionGroup | null;
  handleClose: () => void;
  onSubmit: (data: Partial<InternalAuditQuestionGroup>) => void;
}) => {
  const { isTablet } = useIsMobile();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InternalAuditQuestionGroup>({
    defaultValues: {
      queGroupId: defaultValues?.queGroupId,
      groupName: defaultValues?.groupName,
    },
  });

  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClose();
      }}
      maxWidth={isTablet ? "lg" : "sm"}
      fullWidth={true}
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
          {defaultValues ? "Edit Question Group" : "Add a New Question Group"}
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
        <Stack spacing={1} sx={{ padding: theme.spacing(1) }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TextField
              required
              label="Name"
              size="small"
              sx={{ margin: "0.5rem" }}
              error={!!errors.groupName}
              {...register("groupName", { required: true })}
              helperText={errors.groupName ? "Name is required" : ""}
            />
          </Box>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: "1rem" }}>
        <Button
          onClick={() => {
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
            onSubmit(data);
          })}
        >
          {defaultValues ? "Update Changes" : "Create Question Group"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

const AddOrEditQuestionDialog = ({
  open,
  defaultValues,
  handleClose,
  onSubmit,
}: {
  open: boolean;
  defaultValues: InternalAuditQuestion | null;
  handleClose: () => void;
  onSubmit: (data: Partial<InternalAuditQuestion>) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<InternalAuditQuestion>({
    defaultValues: {
      queId: defaultValues?.queId,
      question: defaultValues?.question,
      colorCode: defaultValues?.colorCode,
      allocatedScore: defaultValues?.allocatedScore,
    },
  });

  const colorCodeData = Object.values(QuestionColorCodes);

  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClose();
      }}
      maxWidth={"lg"}
      fullWidth={true}
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
          {defaultValues ? "Edit Question" : "Add a New Question"}
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
        <Stack spacing={1} sx={{ padding: theme.spacing(1) }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TextField
              required
              label="Question"
              size="small"
              sx={{ margin: "0.5rem" }}
              error={!!errors.question}
              multiline
              minRows={4}
              maxRows={10}
              {...register("question", { required: true })}
              helperText={errors.question ? "Question is required" : ""}
            />
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Controller
                name="colorCode"
                control={control}
                defaultValue={defaultValues?.colorCode ?? ""}
                {...register("colorCode", { required: true })}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    size="small"
                    options={colorCodeData}
                    sx={{ flex: 1, margin: "0.5rem" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        error={!!errors.colorCode}
                        helperText={errors.colorCode && "Required"}
                        label="Color Code"
                        name="colorCode"
                      />
                    )}
                  />
                )}
              />
              <TextField
                required
                type="number"
                label="Allocated Score"
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                error={!!errors.allocatedScore}
                {...register("allocatedScore", {
                  required: {
                    value: true,
                    message: "Required",
                  },
                  min: {
                    value: 0,
                    message: "Allocated score must be a positive number",
                  },
                })}
                helperText={
                  errors.allocatedScore
                    ? errors.allocatedScore.message ??
                      "Allocated score must be a positive number"
                    : ""
                }
              />
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: "1rem" }}>
        <Button
          onClick={() => {
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
            onSubmit(data);
          })}
        >
          {defaultValues ? "Update Changes" : "Create Question"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};
