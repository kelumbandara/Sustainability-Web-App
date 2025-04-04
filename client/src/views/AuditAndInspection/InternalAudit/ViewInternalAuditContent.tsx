import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AppBar,
  Box,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useState } from "react";
import { DrawerContentItem } from "../../../components/ViewDataDrawer";
import useIsMobile from "../../../customHooks/useIsMobile";
import {
  InternalAuditAnswerToQuestions,
  InternalAuditQuestionGroup,
  ScheduledInternalAudit,
  ScheduledInternalAuditActionPlan,
} from "../../../api/AuditAndInspection/internalAudit";
import { RenderInternalAuditStatusChip } from "./InternalAuditTable";
import theme from "../../../theme";
import ArticleIcon from "@mui/icons-material/Article";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { RenderAuditQuestionColorTag } from "../AuditBuilder/InternalAuditFormDrawerContent";
import { CircularProgressWithLabel } from "../../../components/CircularProgressWithLabel";

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

function ViewInternalAuditContent({
  internalAudit,
}: {
  internalAudit: ScheduledInternalAudit;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const { isTablet } = useIsMobile();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
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
            p: "0.5rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <DrawerContentItem label="Reference" value={internalAudit.id} />
            <DrawerContentItem
              label="Audit Name"
              value={internalAudit.audit.name}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DrawerContentItem
              label="Audit Progress"
              value={internalAudit.auditStatus}
            />
            <Box
              sx={{
                paddingY: "0.3rem",
                paddingX: "0.5rem",
                minWidth: "8rem",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="caption"
                sx={{ paddingBottom: 0, color: "var(--pallet-grey)" }}
              >
                Status
              </Typography>
              <Box>{RenderInternalAuditStatusChip(internalAudit.status)}</Box>
            </Box>
          </Box>
        </Box>
        <AppBar position="static" sx={{ marginTop: "1rem" }}>
          <Tabs
            value={activeTab}
            onChange={handleChange}
            indicatorColor="secondary"
            TabIndicatorProps={{
              style: { backgroundColor: "var(--pallet-blue)", height: "3px" },
            }}
            sx={{
              backgroundColor: "var(--pallet-lighter-grey)",
              color: "var(--pallet-blue)",
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
                  <ArticleIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    General Details
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
                  <ContentPasteSearchIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    {internalAudit.audit?.name}
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
                  <Diversity3Icon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Action Plan
                  </Typography>
                </Box>
              }
              {...a11yProps(1)}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={activeTab} index={0} dir={theme.direction}>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box sx={{ flex: 1 }}>
              <DrawerContentItem
                label="Division"
                value={internalAudit.division}
              />
              <DrawerContentItem
                label="Audit Type"
                value={internalAudit.auditType}
              />
              <DrawerContentItem
                label="Auditee"
                value={internalAudit.auditee?.name}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <DrawerContentItem
                label="Approver Name"
                value={internalAudit.approver?.name}
              />

              <DrawerContentItem
                label="Date for Approval"
                value={
                  internalAudit.dateForApproval
                    ? format(
                        new Date(internalAudit.dateForApproval),
                        "yyyy-MM-dd"
                      )
                    : "N/A"
                }
              />
              <DrawerContentItem
                label="Reported Date"
                value={
                  internalAudit.createdAt
                    ? format(new Date(internalAudit.createdAt), "yyyy-MM-dd")
                    : "N/A"
                }
              />
            </Box>
          </Box>
          <TableContainer
            component={Paper}
            elevation={2}
            sx={{
              overflowX: "auto",
              maxWidth: isTablet ? "88vw" : "100%",
              marginTop: "1rem",
            }}
          >
            <Table aria-label="simple table">
              <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
                <TableRow>
                  <TableCell align="center">Total No of Questions</TableCell>
                  <TableCell align="center">Total Answered</TableCell>
                  <TableCell align="center">Achievable Score</TableCell>
                  <TableCell align="center">Earned Score</TableCell>
                  <TableCell align="center">% Achieved</TableCell>
                  <TableCell align="center">Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                  }}
                >
                  <TableCell align="center">
                    {internalAudit.audit?.totalNumberOfQuestions}
                  </TableCell>
                  <TableCell align="center">
                    {internalAudit?.answeredQuestionCount ?? "--"}
                  </TableCell>
                  <TableCell align="center">
                    {internalAudit.audit.achievableScore}
                  </TableCell>
                  <TableCell align="center">
                    {internalAudit?.earnedScore ?? "--"}
                  </TableCell>
                  <TableCell align="center">
                    {internalAudit?.earnedScorePercentage ?? "--"}
                  </TableCell>
                  <TableCell align="center">
                    {internalAudit?.rating ?? "--"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={activeTab} index={1} dir={theme.direction}>
          <Stack>
            {!internalAudit?.audit?.questionGroups?.length && (
              <Box sx={{ padding: "1rem" }}>
                <Alert variant="standard" severity="info">
                  No Question Groups Added
                </Alert>
              </Box>
            )}
            {internalAudit?.audit?.questionGroups?.map((group) => (
              <AuditQuestionsSectionAccordion
                key={group.id}
                questionGroup={group}
                auditAnswers={
                  internalAudit?.auditAnswers?.find(
                    (answer) => answer.questionGroupId === group.id
                  )?.answers ?? []
                }
              />
            ))}
          </Stack>
        </TabPanel>
        <TabPanel value={activeTab} index={2} dir={theme.direction}>
          {internalAudit?.actionPlan?.length === 0 && (
            <Box sx={{ padding: "1rem" }}>
              <Alert variant="standard" severity="info">
                No Action Plans Found
              </Alert>
            </Box>
          )}
          <Stack spacing={1}>
            {internalAudit?.actionPlan?.map((actionPlan) => (
              <ActionPlanItem key={actionPlan.id} actionPlan={actionPlan} />
            ))}
          </Stack>
        </TabPanel>
      </Box>
    </Stack>
  );
}

export default ViewInternalAuditContent;

const AuditQuestionsSectionAccordion = ({
  questionGroup,
  auditAnswers,
}: {
  questionGroup: InternalAuditQuestionGroup;
  auditAnswers: InternalAuditAnswerToQuestions[];
}) => {
  const { isMobile } = useIsMobile();

  return (
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
          <Typography component="span">{questionGroup.name}</Typography>
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
            <Box
              sx={{ marginLeft: "1rem", display: "flex", alignItems: "center" }}
            >
              <CircularProgressWithLabel
                value={
                  (auditAnswers.length /
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
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell align="center">Color Code</TableCell>
                <TableCell align="left">Question</TableCell>
                <TableCell align="center">Allocated Score</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Rating</TableCell>
                <TableCell align="center">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questionGroup?.questions.length === 0 && (
                <TableRow key="no-questions">
                  <TableCell colSpan={3} align="center">
                    <Typography variant="body2">No Questions found</Typography>
                  </TableCell>
                </TableRow>
              )}
              {questionGroup?.questions.map((row) => {
                const questionAnswers = auditAnswers.find(
                  (answer) => answer.questionId === row.id
                );

                return (
                  <TableRow key={row.id}>
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

const ActionPlanItem = ({
  actionPlan,
}: {
  actionPlan: ScheduledInternalAuditActionPlan;
}) => {
  return (
    <Box
      sx={{
        padding: "1rem",
        display: "flex",
        flexDirection: "row",
        backgroundColor: theme.palette.grey[100],
        borderRadius: "0.3rem",
      }}
    >
      <Box sx={{ flex: 2, borderRight: "1px solid #ccc", marginRight: "1rem" }}>
        <Typography variant="caption" sx={{ color: "var(--pallet-grey)" }}>
          Corrective/Preventive Action
        </Typography>
        <Typography variant="body2">
          {actionPlan.correctiveOrPreventiveAction}
        </Typography>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <DrawerContentItem
            label="Due date"
            value={
              actionPlan?.dueDate
                ? format(actionPlan?.dueDate, "dd/MM/yyyy")
                : "--"
            }
          />
          <DrawerContentItem
            label="Priority"
            value={actionPlan?.priority ?? "--"}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <DrawerContentItem
            label="Target Completion date"
            value={
              actionPlan?.targetCompletionDate
                ? format(actionPlan?.targetCompletionDate, "dd/MM/yyyy")
                : "--"
            }
          />
          <DrawerContentItem
            label="Approver"
            value={actionPlan?.approver?.name ?? "--"}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Typography variant="caption" sx={{ color: "var(--pallet-grey)" }}>
            {`Created on ${format(actionPlan.date, "dd/MM/yyyy")}`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
