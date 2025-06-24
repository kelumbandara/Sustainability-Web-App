import {
  AppBar,
  Box,
  Chip,
  colors,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { DrawerContentItem } from "../../components/ViewDataDrawer";
import { useState } from "react";
import theme from "../../theme";
import useIsMobile from "../../customHooks/useIsMobile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { format } from "date-fns";
import { Grievance, GrievanceStatus } from "../../api/Grievance/grievanceApi";
import { FileItemsViewer } from "../../components/FileItemsViewer";
import { StorageFile } from "../../utils/StorageFiles.util";
import DeskIcon from "@mui/icons-material/Desk";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

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

function ViewGrievanceContent({ grievance }: { grievance: Grievance }) {
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
          <DrawerContentItem
            label="Reference Id"
            value={grievance.referenceNumber}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Date"
            value={format(new Date(), "MMM dd, yyyy")}
            sx={{ flex: 1 }}
          />
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
                  <TextSnippetIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Personal and Employement Details
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
                  <DeskIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Helpdesk Details
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
                  <LightbulbIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Solution
                  </Typography>
                </Box>
              }
              {...a11yProps(2)}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={activeTab} index={0} dir={theme.direction}>
          <Stack>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Person Type"
                value={grievance.personType}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Name"
                value={grievance.name}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Employee Id"
                value={grievance.employeeId}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Division"
                value={grievance.division}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Gender"
                value={grievance.gender}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Supervisor"
                value={grievance.supervisor}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Employee Shift"
                value={grievance.employeeShift}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Location"
                value={grievance.location}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Date of Join"
                value={format(grievance.dateOfJoin, "MMM dd, yyyy")}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Service Period"
                value={grievance.servicePeriod}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Tenure Split"
                value={grievance.tenureSplit}
                sx={{ flex: 1 }}
              />
            </Box>
          </Stack>
        </TabPanel>
        <TabPanel value={activeTab} index={1} dir={theme.direction}>
          <Stack>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Channel"
                value={grievance.channel}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Category"
                value={grievance.category}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Topic"
                value={grievance.topic}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Submissions"
                value={grievance.submissions}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Description"
                value={grievance.description}
                isRichText={true}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Remarks"
                value={grievance.remarks}
                isRichText={true}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Helpdesk Person"
                value={grievance.helpDeskPerson}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Responsible Department"
                value={grievance.responsibleDepartment}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Helpdesk Person"
                value={grievance.helpDeskPerson}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Responsible Department"
                value={grievance.responsibleDepartment}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Human Rights Violation"
                value={grievance.humanRightsViolation ? "Yes" : "No"}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Scale"
                value={grievance.scale}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Frequency Rate"
                value={grievance.frequencyRate}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Severity Score"
                value={grievance.severityScore}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <FileItemsViewer
                label="Evidance"
                files={grievance?.evidence as StorageFile[]}
                sx={{ marginY: "1rem" }}
              />
            </Box>
          </Stack>
        </TabPanel>
        <TabPanel value={activeTab} index={2} dir={theme.direction}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <DrawerContentItem
              label="Issue Previously Raised"
              value={grievance.isIssuesPreviouslyRaised ? "Yes" : "No"}
              sx={{ flex: 1 }}
            />
          </Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", marginY: "0.5rem" }}
          >
            Rerspondent Details
          </Typography>
          <Table aria-label="activity stream table">
            <TableHead
              sx={{
                backgroundColor: "var(--pallet-lighter-grey)",
              }}
            >
              <TableRow>
                <TableCell align="center">Employee Id</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Designation</TableCell>
                <TableCell align="center">Department</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grievance?.respondentDetails?.length > 0 ? (
                grievance?.respondentDetails.map((row) => (
                  <TableRow
                    key={`${row.employeeId}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      {row.employeeId}
                    </TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.designation}</TableCell>
                    <TableCell align="center">{row.department}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">
                      No respondent details found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", marginY: "0.5rem" }}
          >
            Committee Member Details
          </Typography>
          <Table aria-label="activity stream table">
            <TableHead
              sx={{
                backgroundColor: "var(--pallet-lighter-grey)",
              }}
            >
              <TableRow>
                <TableCell align="center">Employee Id</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Designation</TableCell>
                <TableCell align="center">Department</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grievance?.committeeMemberDetails?.length > 0 ? (
                grievance?.committeeMemberDetails.map((row) => (
                  <TableRow
                    key={`${row.employeeId}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      {row.employeeId}
                    </TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.designation}</TableCell>
                    <TableCell align="center">{row.department}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">
                      No committee member details found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", marginY: "0.5rem" }}
          >
            Nominee Details
          </Typography>
          <Table aria-label="activity stream table">
            <TableHead
              sx={{
                backgroundColor: "var(--pallet-lighter-grey)",
              }}
            >
              <TableRow>
                <TableCell align="center">Employee Id</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Designation</TableCell>
                <TableCell align="center">Department</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grievance?.nomineeDetails?.length > 0 ? (
                grievance?.nomineeDetails.map((row) => (
                  <TableRow
                    key={`${row.employeeId}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      {row.employeeId}
                    </TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.designation}</TableCell>
                    <TableCell align="center">{row.department}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">
                      No nominee details found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", marginY: "0.5rem" }}
          >
            Legal Advisor Details
          </Typography>
          <Table aria-label="activity stream table">
            <TableHead
              sx={{
                backgroundColor: "var(--pallet-lighter-grey)",
              }}
            >
              <TableRow>
                <TableCell align="center">Employee Id</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Designation</TableCell>
                <TableCell align="center">Department</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grievance?.legalAdvisorDetails?.length > 0 ? (
                grievance?.legalAdvisorDetails.map((row) => (
                  <TableRow
                    key={`${row.id}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.email}</TableCell>
                    <TableCell align="center">{row.phone}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">
                      No legal advisor details found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <DrawerContentItem
              label="Trade Union Representative"
              value={grievance.tradeUnionRepresentative}
              sx={{ flex: 1 }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <DrawerContentItem
              label="Grievant Statement"
              value={grievance.grievantStatement}
              isRichText={true}
              sx={{ flex: 1 }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <FileItemsViewer
              label="Statement Documents"
              files={grievance?.statementDocuments as StorageFile[]}
              sx={{ marginY: "1rem" }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <FileItemsViewer
              label="Investigation Committee Statement Documents"
              files={
                grievance?.investigationCommitteeStatementDocuments as StorageFile[]
              }
              sx={{ marginY: "1rem" }}
            />
          </Box>
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
        <Typography
          variant="caption"
          sx={{ paddingBottom: 0, color: "var(--pallet-grey)" }}
        >
          Status
        </Typography>
        <Box>{RenderGrievanceStatusChip(grievance.status)}</Box>

        <DrawerContentItem
          label="Submission Date"
          value={
            grievance.submissionDate
              ? format(grievance.submissionDate, "MM-dd-yyyy")
              : "N/A"
          }
        />

        <DrawerContentItem
          label="Due Date"
          value={
            grievance.dueDate ? format(grievance.dueDate, "MM-dd-yyyy") : "N/A"
          }
        />
        <DrawerContentItem
          label="Business Unit"
          value={grievance.businessUnit}
        />
        <DrawerContentItem label="Assignee" value={grievance.assignee?.name} />
        <DrawerContentItem
          label="Is Anonymous"
          value={grievance.isAnonymous ? "Yes" : "No"}
        />
      </Box>
    </Stack>
  );
}

export default ViewGrievanceContent;

export function RenderGrievanceStatusChip(status: GrievanceStatus) {
  switch (status) {
    case GrievanceStatus.draft:
      return (
        <Chip
          label={status}
          sx={{
            color: "var(--pallet-blue)",
            backgroundColor: "var(--pallet-lighter-blue)",
          }}
        />
      );
    case GrievanceStatus.open:
      return (
        <Chip
          label={status}
          sx={{
            color: "var(--pallet-orange)",
            backgroundColor: colors.orange[50],
          }}
        />
      );
    case GrievanceStatus.inprogress:
      return (
        <Chip
          label={status}
          sx={{
            color: "var(--pallet-blue)",
            backgroundColor: colors.purple[50],
          }}
        />
      );
    case GrievanceStatus.completed:
      return (
        <Chip
          label={status}
          sx={{
            color: "var(--pallet-green)",
            backgroundColor: colors.green[50],
          }}
        />
      );
    default:
      return (
        <Chip
          label={status}
          sx={{
            color: "var(--pallet-blue)",
            backgroundColor: "var(--pallet-lighter-blue)",
          }}
        />
      );
  }
}
