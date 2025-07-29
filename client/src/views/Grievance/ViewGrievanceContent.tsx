import {
  Alert,
  AppBar,
  Box,
  Chip,
  CircularProgress,
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
import { useMemo, useState } from "react";
import theme from "../../theme";
import useIsMobile from "../../customHooks/useIsMobile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { format } from "date-fns";
import {
  completeGrievance,
  feedbackGrievance,
  Grievance,
  GrievanceStatus,
  GrievanceType,
  openGrievance,
} from "../../api/Grievance/grievanceApi";
import { FileItemsViewer } from "../../components/FileItemsViewer";
import { StorageFile } from "../../utils/StorageFiles.util";
import DeskIcon from "@mui/icons-material/Desk";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { getSeverityLevel } from "./GrievanceUtils";
import CustomButton from "../../components/CustomButton";
import ApproveConfirmationModal from "../OccupationalHealth/MedicineInventory/MedicineRequest/ApproveConfirmationModal";
import { useMutation } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import { useSnackbar } from "notistack";
import AddEmployeeReviewDialog from "./AddEmployeeReviewDialog";
import ReviewStars from "../../components/ReviewStars";

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

function ViewGrievanceContent({
  grievance,
  handleCloseDrawer,
}: {
  grievance: Grievance;
  handleCloseDrawer: () => void;
}) {
  const { isTablet } = useIsMobile();
  const { enqueueSnackbar } = useSnackbar();
  const [openStatusDialogOpen, setOpenStatusDialogOpen] = useState(false);
  const [completeStatusDialogOpen, setCompleteStatusDialogOpen] =
    useState(false);
  const [employeeRatingDialogOpen, setEmployeeRatingDialogOpen] =
    useState(false);

  const { mutate: openGrievanceMutation, isPending: isGrievanceOpening } =
    useMutation({
      mutationFn: openGrievance,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["grievances"],
        });
        enqueueSnackbar("Grievance Opened Successfully!", {
          variant: "success",
        });
        setOpenStatusDialogOpen(false);
        handleCloseDrawer();
      },
      onError: () => {
        enqueueSnackbar(`Grievance Opening Failed`, {
          variant: "error",
        });
      },
    });

  const {
    mutate: completeGrievanceMutation,
    isPending: isGrievanceCompleting,
  } = useMutation({
    mutationFn: completeGrievance,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["grievances"],
      });
      queryClient.invalidateQueries({
        queryKey: ["grievances-completed-task"],
      });
      enqueueSnackbar("Grievance Completed Successfully!", {
        variant: "success",
      });
      setCompleteStatusDialogOpen(false);
      handleCloseDrawer();
    },
    onError: () => {
      enqueueSnackbar(`Grievance Completing Failed`, {
        variant: "error",
      });
    },
  });

  const {
    mutate: feedbackGrievanceMutation,
    isPending: isGrievanceFeedbackSubmitting,
  } = useMutation({
    mutationFn: feedbackGrievance,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["grievances"],
      });
      enqueueSnackbar("Employee Feedback Submitted Successfully!", {
        variant: "success",
      });
      setEmployeeRatingDialogOpen(false);
      handleCloseDrawer();
    },
    onError: () => {
      enqueueSnackbar(`Employee Feedback Submission Failed`, {
        variant: "error",
      });
    },
  });

  const isShowSolutionTab = useMemo(() => {
    return grievance && grievance.status !== GrievanceStatus.draft;
  }, [grievance]);

  const isShowPersonalAndEmploymentDetailsTab = useMemo(() => {
    return (
      !grievance || (grievance && grievance.isAnonymous === false)
      // (grievance && grievance.createdByUserId === user.id)
    );
  }, [grievance]);

  const [activeTab, setActiveTab] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const severityScoreValue = useMemo(() => {
    if (
      !grievance.humanRightsViolation ||
      !grievance.frequencyRate ||
      !grievance.scale
    ) {
      return null;
    }
    return getSeverityLevel(
      grievance.humanRightsViolation,
      grievance.scale,
      grievance.frequencyRate
    );
  }, [grievance]);

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
            {isShowPersonalAndEmploymentDetailsTab && (
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
            )}
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
              {...a11yProps(isShowPersonalAndEmploymentDetailsTab ? 1 : 0)}
              tabIndex={isShowPersonalAndEmploymentDetailsTab ? 1 : 0}
            />
            {isShowSolutionTab && (
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
                {...a11yProps(isShowPersonalAndEmploymentDetailsTab ? 2 : 1)}
                tabIndex={isShowPersonalAndEmploymentDetailsTab ? 2 : 1}
              />
            )}
          </Tabs>
        </AppBar>
        {isShowPersonalAndEmploymentDetailsTab && (
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
                  label="Employee Id"
                  value={grievance.employeeId}
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
                  label="Gender"
                  value={grievance.gender}
                  sx={{ flex: 1 }}
                />
                <DrawerContentItem
                  label="Employee Shift"
                  value={grievance.employeeShift}
                  sx={{ flex: 1 }}
                />
              </Box>
              {(grievance.type === GrievanceType.complaint ||
                grievance.type === GrievanceType.grievance) && (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  <DrawerContentItem
                    label="Supervisor"
                    value={grievance.supervisor}
                    sx={{ flex: 1 }}
                  />
                  <DrawerContentItem
                    label="Location"
                    value={grievance.location}
                    sx={{ flex: 1 }}
                  />
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <DrawerContentItem
                  label="Date of Join"
                  value={
                    grievance.dateOfJoin
                      ? format(grievance.dateOfJoin, "MMM dd, yyyy")
                      : "--"
                  }
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
        )}
        <TabPanel
          value={activeTab}
          index={isShowPersonalAndEmploymentDetailsTab ? 1 : 0}
          dir={theme.direction}
        >
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
            {(grievance.type === GrievanceType.complaint ||
              grievance.type === GrievanceType.grievance) && (
              <>
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
                    value={severityScoreValue}
                    sx={{ flex: 1 }}
                  />
                </Box>
              </>
            )}
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
        {isShowSolutionTab && (
          <TabPanel
            value={activeTab}
            index={isShowPersonalAndEmploymentDetailsTab ? 2 : 1}
            dir={theme.direction}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Issue Previously Raised"
                value={
                  grievance.isIssuesPreviouslyRaised === true
                    ? "Yes"
                    : grievance.isIssuesPreviouslyRaised === false
                    ? "No"
                    : "--"
                }
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
                {grievance?.respondents?.length > 0 ? (
                  grievance?.respondents.map((row) => (
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
                {grievance?.committeeMembers?.length > 0 ? (
                  grievance?.committeeMembers.map((row) => (
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
                {grievance?.nominees?.length > 0 ? (
                  grievance?.nominees.map((row) => (
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
                {grievance?.legalAdvisors?.length > 0 ? (
                  grievance?.legalAdvisors.map((row) => (
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
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Committee Statement"
                value={grievance.committeeStatement}
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
                label="Solution Provided"
                value={grievance.solutionProvided}
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
                label="Solution Remarks"
                value={grievance.solutionRemark}
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
                label="Appeal?"
                value={
                  grievance.isAppeal === true
                    ? "Yes"
                    : grievance.isAppeal === false
                    ? "No"
                    : "--"
                }
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Follow Up?"
                value={
                  grievance.isFollowUp === true
                    ? "Yes"
                    : grievance.isFollowUp === false
                    ? "No"
                    : "--"
                }
                sx={{ flex: 1 }}
              />
            </Box>
          </TabPanel>
        )}
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
            grievance.dueDate ? format(grievance.dueDate, "MM-dd-yyyy") : "--"
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
        {grievance.status !== GrievanceStatus.draft && (
          <DrawerContentItem
            label="Resolution Date"
            value={
              grievance.resolutionDate
                ? format(grievance.resolutionDate, "MM-dd-yyyy")
                : "--"
            }
          />
        )}
        {grievance.status === GrievanceStatus.completed &&
          (grievance.stars || grievance.feedback) && (
            <>
              <Typography
                variant="caption"
                sx={{ margin: "0.5rem", color: "var(--pallet-grey)" }}
              >
                Employee Feedback
              </Typography>
              <ReviewStars defaultRating={grievance.stars} />
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <DrawerContentItem
                  label="Feedback"
                  value={grievance.feedback}
                  isRichText={true}
                  sx={{ flex: 1 }}
                />
              </Box>
            </>
          )}

        {grievance.status === GrievanceStatus.draft && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: "1rem",
              objectFit: "contain",
            }}
          >
            <CustomButton
              variant="contained"
              sx={{
                backgroundColor: "var(--pallet-blue)",
                marginTop: "1rem",
                marginX: "0.5rem",
              }}
              size="medium"
              fullWidth
              disabled={isGrievanceOpening}
              endIcon={
                isGrievanceOpening ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
              onClick={() => setOpenStatusDialogOpen(true)}
            >
              {`Open ${grievance.type}`}
            </CustomButton>
          </Box>
        )}
        {grievance.status === GrievanceStatus.inprogress && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: "1rem",
              objectFit: "contain",
            }}
          >
            <CustomButton
              variant="contained"
              sx={{
                backgroundColor: "var(--pallet-blue)",
                marginTop: "1rem",
                marginX: "0.5rem",
              }}
              size="medium"
              fullWidth
              disabled={isGrievanceCompleting}
              endIcon={
                isGrievanceCompleting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
              onClick={() => setCompleteStatusDialogOpen(true)}
            >
              {`Complete ${grievance.type}`}
            </CustomButton>
          </Box>
        )}
        {grievance.status === GrievanceStatus.completed &&
          !grievance.stars &&
          !grievance.feedback && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: "1rem",
                objectFit: "contain",
              }}
            >
              <CustomButton
                variant="contained"
                sx={{
                  backgroundColor: "var(--pallet-blue)",
                  marginTop: "1rem",
                  marginX: "0.5rem",
                }}
                size="medium"
                fullWidth
                disabled={isGrievanceFeedbackSubmitting}
                endIcon={
                  isGrievanceFeedbackSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
                onClick={() => setEmployeeRatingDialogOpen(true)}
              >
                {`Add employee feedback`}
              </CustomButton>
            </Box>
          )}
      </Box>
      {openStatusDialogOpen && (
        <ApproveConfirmationModal
          open={openStatusDialogOpen}
          title={`Open ${grievance.type}`}
          content={
            <>
              {`Are you sure you want to open this ${grievance.type}?`}
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setOpenStatusDialogOpen(false)}
          approveFunc={async () => {
            await openGrievanceMutation(grievance.id);
          }}
          onSuccess={() => {}}
          handleReject={() => {}}
        />
      )}
      {completeStatusDialogOpen && (
        <ApproveConfirmationModal
          open={completeStatusDialogOpen}
          title={`Complete ${grievance.type}`}
          content={
            <>
              {`Are you sure you want to complete this ${grievance.type}?`}
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setCompleteStatusDialogOpen(false)}
          approveFunc={async () => {
            await completeGrievanceMutation(grievance.id);
          }}
          onSuccess={() => {}}
          handleReject={() => {}}
        />
      )}
      {employeeRatingDialogOpen && (
        <AddEmployeeReviewDialog
          open={employeeRatingDialogOpen}
          onClose={() => setEmployeeRatingDialogOpen(false)}
          onSubmit={async (data) => {
            setEmployeeRatingDialogOpen(false);
            await feedbackGrievanceMutation({
              feedback: data.feedback,
              stars: data.stars,
              id: grievance.id,
            });
          }}
          grievance={grievance}
        />
      )}
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
