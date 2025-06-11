import {
  Accordion,
  AccordionSummary,
  Stack,
  Typography,
  Box,
  AccordionDetails,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import { useMemo, useState } from "react";
import {
  InternalAuditQuestionGroup,
  InternalAuditAnswerToQuestions,
  ScheduledInternalAuditStatus,
  InternalAuditQuestion,
} from "../../../api/AuditAndInspection/internalAudit";
import { CircularProgressWithLabel } from "../../../components/CircularProgressWithLabel";
import useIsMobile from "../../../customHooks/useIsMobile";
import { RenderAuditQuestionColorTag } from "../AuditBuilder/InternalAuditFormDrawerContent";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { EditInternalAuditQuestionDialog } from "./EditInternalAuditQuestionDialog";

export const AuditQuestionsSectionAccordion = ({
  questionGroup,
  auditAnswers,
  auditStatus,
  submitAnAnswer,
}: {
  questionGroup: InternalAuditQuestionGroup;
  auditAnswers: InternalAuditAnswerToQuestions[];
  auditStatus: ScheduledInternalAuditStatus;
  submitAnAnswer: (data: InternalAuditAnswerToQuestions) => void;
}) => {
  const { isTablet } = useIsMobile();
  const [selectedQuestion, setSelectedQuestion] =
    useState<InternalAuditQuestion | null>(null);
  const [openEditQuestionDialog, setOpenEditQuestionDialog] = useState(false);

  const groupAnswers = useMemo(
    () =>
      auditAnswers.filter(
        (answer) => answer.queGroupId === questionGroup.queGroupId
      ),
    [auditAnswers, questionGroup]
  );

  return (
    <>
      <Accordion>
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
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginX: "1rem",
              }}
            >
              <Typography variant="body2" sx={{ color: "var(--pallet-grey)" }}>
                {questionGroup.questions.length} Questions
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "var(--pallet-grey)", marginLeft: "1rem" }}
              >
                {questionGroup.questions
                  ? questionGroup.questions.reduce(
                      (acc, question) => acc + question.allocatedScore,
                      0
                    )
                  : 0}{" "}
                Allocated Score
              </Typography>
              {auditStatus !== ScheduledInternalAuditStatus.DRAFT && (
                <>
                  <Box
                    sx={{
                      marginLeft: "1rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgressWithLabel
                      value={
                        ((groupAnswers?.length || 0) /
                          (questionGroup?.questions?.length || 1)) *
                        100
                      }
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        marginLeft: "0.5rem",
                      }}
                    >
                      Completed
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer
            sx={{
              overflowX: "auto",
              maxWidth: isTablet ? "88vw" : "100%",
            }}
          >
            <Table aria-label="simple table">
              <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
                <TableRow>
                  <TableCell align="center">Color Code</TableCell>
                  <TableCell align="left">Question</TableCell>
                  <TableCell align="center">Allocated Score</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Rating</TableCell>
                  <TableCell align="center">Score</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questionGroup?.questions.length === 0 && (
                  <TableRow key="no-questions">
                    <TableCell colSpan={3} align="center">
                      <Typography variant="body2">
                        No Questions found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {questionGroup?.questions.map((row) => {
                  const questionAnswers = auditAnswers.find(
                    (answer) => answer.questionId === row.queId
                  );

                  return (
                    <TableRow key={row.queId}>
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
                        {questionAnswers?.status ?? "--"}
                      </TableCell>
                      <TableCell align="center">
                        {questionAnswers?.rating ?? "--"}
                      </TableCell>
                      <TableCell align="center">
                        {questionAnswers?.score ?? "--"}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="edit"
                          size="small"
                          onClick={() => {
                            setSelectedQuestion(row);
                            setOpenEditQuestionDialog(true);
                          }}
                        >
                          <EditIcon fontSize="inherit" />
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
      {openEditQuestionDialog && (
        <EditInternalAuditQuestionDialog
          open={openEditQuestionDialog}
          setOpen={setOpenEditQuestionDialog}
          question={selectedQuestion}
          answer={auditAnswers.find(
            (answer) => answer.questionId === selectedQuestion?.queId
          )}
          setAnswer={(answer) => {
            submitAnAnswer(answer);
          }}
        />
      )}
    </>
  );
};
