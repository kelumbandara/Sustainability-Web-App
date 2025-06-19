import {
  Alert,
  AppBar,
  Box,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { DrawerContentItem } from "../../components/ViewDataDrawer";

import { format } from "date-fns";
import { useState } from "react";
import theme from "../../theme";
import useIsMobile from "../../customHooks/useIsMobile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
// import ApproveConfirmationModal from "../OccupationalHealth/MedicineInventory/MedicineRequest/ApproveConfirmationModal";
import { RAG } from "../../api/RAG/ragApi";
import AccessibilityNewOutlinedIcon from "@mui/icons-material/AccessibilityNewOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WarningIcon from "@mui/icons-material/Warning";

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

function ViewRAGContent({
  rag,
  handleCloseDrawer,
}: {
  rag: RAG;
  handleCloseDrawer: () => void;
}) {
  // const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { isMobile, isTablet } = useIsMobile();

  // const {
  //   mutate: approveHazardOrRiskMutation,
  //   isPending: isHazardOrRiskApproving,
  // } = useMutation({
  //   mutationFn: approveHazardOrRisk,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: ["hazardRisks"],
  //     });
  //     enqueueSnackbar("Hazard/Risk Approved Successfully!", {
  //       variant: "success",
  //     });
  //     setApproveDialogOpen(false);
  //     handleCloseDrawer();
  //   },
  //   onError: () => {
  //     enqueueSnackbar(`Hazard/Risk Approval Failed`, {
  //       variant: "error",
  //     });
  //   },
  // });

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
            label="Reference"
            value={rag.id}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Reported Date"
            value={
              rag.created_at
                ? format(new Date(rag.created_at), "yyyy-MM-dd")
                : "N/A"
            }
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
                    Personal Details
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
                  <AccessibilityNewOutlinedIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Employment Details
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
                  <LocationOnOutlinedIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Location Details
                  </Typography>
                </Box>
              }
              {...a11yProps(2)}
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
                  <WarningIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    RAG Details
                  </Typography>
                </Box>
              }
              {...a11yProps(3)}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={activeTab} index={0} dir={theme.direction}>
          <Stack>
            <DrawerContentItem label="Division" value={rag.division} />

            <DrawerContentItem label="Employee Type" value={rag.employeeType} />
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <DrawerContentItem
                label="Employee Name"
                value={rag.employeeName}
              />
              <DrawerContentItem label="Employee ID" value={rag.employeeId} />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <DrawerContentItem label="Gender" value={rag.gender} />
              <DrawerContentItem
                label="Date Of Birth"
                value={
                  rag.dateOfJoin
                    ? format(new Date(rag.dateOfJoin), "yyyy-MM-dd")
                    : "N/A"
                }
              />
              <DrawerContentItem label="Age" value={rag.age} />
            </Box>
          </Stack>
        </TabPanel>
        <TabPanel value={activeTab} index={1} dir={theme.direction}>
          <Stack>
            <DrawerContentItem
              label="Due date"
              value={
                rag.dateOfJoin
                  ? format(new Date(rag.dateOfJoin), "yyyy-MM-dd")
                  : "N/A"
              }
            />
            <DrawerContentItem
              label="Service Period"
              value={rag.servicePeriod}
            />
            <DrawerContentItem label="Tenure Split" value={rag.tenureSplit} />

            <DrawerContentItem label="Designation" value={rag.designation} />
            <DrawerContentItem label="Department" value={rag.department} />
            <DrawerContentItem label="Function" value={rag.function} />
          </Stack>
        </TabPanel>
        <TabPanel value={activeTab} index={2} dir={theme.direction}>
          <Stack>
            <DrawerContentItem
              label="Country"
              value={rag.countryName.countryName}
            />
            <DrawerContentItem label="State" value={rag.state} />
            <DrawerContentItem label="Origin" value={rag.origin} />
          </Stack>
        </TabPanel>
        <TabPanel value={activeTab} index={3} dir={theme.direction}>
          <Stack>
            <DrawerContentItem label="Category" value={rag.category} />
            <DrawerContentItem
              label="Summery Of Discussion"
              value={rag.discussionSummary}
            />
            <DrawerContentItem label="Remark" value={rag.remark} />
          </Stack>
        </TabPanel>
      </Box>

      {/* {approveDialogOpen && (
        <ApproveConfirmationModal
          open={approveDialogOpen}
          title="Approve Hazard/Risk Confirmation"
          content={
            <>
              Are you sure you want to approve this hazard/risk?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setApproveDialogOpen(false)}
          approveFunc={async () => {
            await approveHazardOrRiskMutation(hazardOrRisk.id);
          }}
          onSuccess={() => {}}
          handleReject={() => {}}
        />
      )} */}
    </Stack>
  );
}

export default ViewRAGContent;
