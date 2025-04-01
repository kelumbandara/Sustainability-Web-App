import {
  AppBar,
  Box,
  Button,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useState } from "react";
import { DrawerContentItem } from "../../../components/ViewDataDrawer";
import useIsMobile from "../../../customHooks/useIsMobile";
import {
  ScheduledInternalAudit,
  ScheduledInternalAuditStatus,
} from "../../../api/AuditAndInspection/internalAudit";
import { RenderInternalAuditStatusChip } from "./InternalAuditTable";
import theme from "../../../theme";
import ArticleIcon from "@mui/icons-material/Article";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import AddIcon from "@mui/icons-material/Add";

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
    console.log("event", event);
    setActiveTab(newValue);
  };

  console.log("internalAudit", internalAudit);

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
        <AppBar position="static">
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
            {internalAudit.status !== ScheduledInternalAuditStatus.DRAFT && (
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
            )}
            {internalAudit.status !== ScheduledInternalAuditStatus.DRAFT && (
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
                      Action Plan
                    </Typography>
                  </Box>
                }
                {...a11yProps(1)}
              />
            )}
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
        {/* <TabPanel value={activeTab} index={1} dir={theme.direction}>
          <DrawerContentItem label="Control" value={internalAudit.control} />
          <DrawerContentItem label="Cost" value={internalAudit.cost} />
          <DrawerContentItem
            label="Action Taken"
            value={internalAudit.actionTaken}
          />
          <DrawerContentItem label="Remarks" value={internalAudit.remarks} />
        </TabPanel> */}
      </Box>
    </Stack>
  );
}

export default ViewInternalAuditContent;
