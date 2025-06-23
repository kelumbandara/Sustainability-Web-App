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
import FireExtinguisherIcon from "@mui/icons-material/FireExtinguisher";
import { useSnackbar } from "notistack";
// import ApproveConfirmationModal from "../OccupationalHealth/MedicineInventory/MedicineRequest/ApproveConfirmationModal";
import AccessibilityNewOutlinedIcon from "@mui/icons-material/AccessibilityNewOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WarningIcon from "@mui/icons-material/Warning";
import { Attrition } from "../../api/Attrition/attritionApi";

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
  attrition,
  handleCloseDrawer,
}: {
  attrition: Attrition;
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
            label="Reference Number"
            value={attrition.referenceNumber}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Reported Date"
            value={
              attrition.created_at
                ? format(new Date(attrition.created_at), "yyyy-MM-dd")
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
                  <WarningIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Attrition Details
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
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <DrawerContentItem
                label="Employee Name"
                value={attrition.employeeName}
              />
              <DrawerContentItem
                label="Employee Id"
                value={attrition.employeeId}
              />
            </Box>
            <DrawerContentItem label="Gender" value={attrition.gender} />
            <DrawerContentItem label="Country" value={attrition.countryName.countryName} />
            <DrawerContentItem label="State" value={attrition.state} />
          </Stack>
        </TabPanel>
        <TabPanel value={activeTab} index={1} dir={theme.direction}>
          <Stack>
            <DrawerContentItem label="Division" value={attrition.division} />
            <DrawerContentItem
              label="Designation"
              value={attrition.designation}
            />
            <DrawerContentItem
              label="Department"
              value={attrition.department}
            />

            <DrawerContentItem
              label="Date Of Join"
              value={
                attrition.dateOfJoin
                  ? format(new Date(attrition.dateOfJoin), "yyyy-MM-dd")
                  : "N/A"
              }
            />
            <DrawerContentItem
              label="Per Day Salary"
              value={attrition.perDaySalary}
            />
            <DrawerContentItem
              label="Employment Classification"
              value={attrition.employmentClassification}
            />
            <DrawerContentItem
              label="Employment Type"
              value={attrition.employmentType}
            />

            <DrawerContentItem
              label="Hotel Access"
              value={attrition.isHostelAccess ? "Yes" : "No"}
            />
          </Stack>
        </TabPanel>
        <TabPanel value={activeTab} index={2} dir={theme.direction}>
          <Stack>
            <DrawerContentItem
              label="Resignation Type"
              value={attrition.resignationType}
            />
            <DrawerContentItem
              label="Resignation Reason"
              value={attrition.resignationReason}
            />
            <DrawerContentItem
              label="Designation"
              value={attrition.attritionDesignation}
            />
            <DrawerContentItem
              label="Service Period"
              value={attrition.servicePeriod}
            />
            <DrawerContentItem
              label="Tenure Split"
              value={attrition.tenureSplit}
            />
            <DrawerContentItem
              label="Normal Resignation"
              value={attrition.isNormalResignation ? "Yes" : "No"}
            />
          </Stack>
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
        <DrawerContentItem
          label="Resigned Data"
          value={
            attrition.resignedDate
              ? format(new Date(attrition.resignedDate), "yyyy-MM-dd")
              : "N/A"
          }
        />

        <DrawerContentItem
          label="Resigned Data"
          value={
            attrition.relievedDate
              ? format(new Date(attrition.relievedDate), "yyyy-MM-dd")
              : "N/A"
          }
        />
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
