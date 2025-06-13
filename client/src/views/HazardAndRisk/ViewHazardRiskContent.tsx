import {
  Alert,
  AppBar,
  Box,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { DrawerContentItem } from "../../components/ViewDataDrawer";
import {
  approveHazardOrRisk,
  HazardAndRisk,
  HazardAndRiskStatus,
} from "../../api/hazardRiskApi";
import { differenceInDays, format } from "date-fns";
import { useState } from "react";
import theme from "../../theme";
import useIsMobile from "../../customHooks/useIsMobile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import FireExtinguisherIcon from "@mui/icons-material/FireExtinguisher";
import { FileItemsViewer } from "../../components/FileItemsViewer";
import { StorageFile } from "../../utils/StorageFiles.util";
import CustomButton from "../../components/CustomButton";
import { useMutation } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import { useSnackbar } from "notistack";
import ApproveConfirmationModal from "../OccupationalHealth/MedicineInventory/MedicineRequest/ApproveConfirmationModal";
import useCurrentUser from "../../hooks/useCurrentUser";

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

function ViewHazardOrRiskContent({
  hazardOrRisk,
  handleCloseDrawer,
}: {
  hazardOrRisk: HazardAndRisk;
  handleCloseDrawer: () => void;
}) {
  const { isTablet } = useIsMobile();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useCurrentUser();
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const {
    mutate: approveHazardOrRiskMutation,
    isPending: isHazardOrRiskApproving,
  } = useMutation({
    mutationFn: approveHazardOrRisk,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["hazardRisks"],
      });
      enqueueSnackbar("Hazard/Risk Approved Successfully!", {
        variant: "success",
      });
      setApproveDialogOpen(false);
      handleCloseDrawer();
    },
    onError: () => {
      enqueueSnackbar(`Hazard/Risk Approval Failed`, {
        variant: "error",
      });
    },
  });

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
            value={hazardOrRisk.id}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Reported Date"
            value={
              hazardOrRisk.created_at
                ? format(new Date(hazardOrRisk.created_at), "yyyy-MM-dd")
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
                    Hazard / Risk Details
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
                  <FireExtinguisherIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Resolution Details
                  </Typography>
                </Box>
              }
              {...a11yProps(1)}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={activeTab} index={0} dir={theme.direction}>
          <Box>
            <DrawerContentItem label="Category" value={hazardOrRisk.category} />
            <DrawerContentItem
              label="Sub Category"
              value={hazardOrRisk.subCategory}
            />

            <DrawerContentItem
              label="ObservationType"
              value={hazardOrRisk.observationType}
            />
            <DrawerContentItem label="Division" value={hazardOrRisk.division} />
            <DrawerContentItem
              label="Location or Department"
              value={hazardOrRisk.locationOrDepartment}
            />
            <DrawerContentItem
              label="Sub Location"
              value={hazardOrRisk.subLocation}
            />
            <DrawerContentItem
              label="Description"
              value={hazardOrRisk.description}
            />
            <FileItemsViewer
              label="Evidence"
              files={hazardOrRisk.documents as StorageFile[]}
              sx={{ marginY: "1rem" }}
            />
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={1} dir={theme.direction}>
          <DrawerContentItem label="Control" value={hazardOrRisk.control} />
          <DrawerContentItem label="Cost" value={hazardOrRisk.cost} />
          <DrawerContentItem
            label="Action Taken"
            value={hazardOrRisk.actionTaken}
          />
          <DrawerContentItem label="Remarks" value={hazardOrRisk.remarks} />
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
        <DrawerContentItem label="Status" value={hazardOrRisk.status} />
        <DrawerContentItem label="Risk Level" value={hazardOrRisk.riskLevel} />
        <DrawerContentItem
          label="Unsafe Act or Condition"
          value={hazardOrRisk.unsafeActOrCondition}
        />
        <DrawerContentItem
          label="Reporter"
          value={hazardOrRisk.createdByUserName}
        />
        <DrawerContentItem
          label="Responsible"
          value={hazardOrRisk.assignee?.name}
        />
        <DrawerContentItem
          label="Due date"
          value={
            hazardOrRisk.dueDate
              ? format(new Date(hazardOrRisk.dueDate), "yyyy-MM-dd")
              : "N/A"
          }
        />
        <DrawerContentItem
          label="Delayed Days"
          value={
            hazardOrRisk.dueDate
              ? differenceInDays(new Date(), hazardOrRisk.dueDate)
              : "--"
          }
        />
        {hazardOrRisk.status === HazardAndRiskStatus.DRAFT &&
          user.userLevel.id === 5 && (
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
                disabled={isHazardOrRiskApproving}
                endIcon={
                  isHazardOrRiskApproving ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
                onClick={() => setApproveDialogOpen(true)}
              >
                Approve Hazard/Risk
              </CustomButton>
            </Box>
          )}
      </Box>
      {approveDialogOpen && (
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
      )}
    </Stack>
  );
}

export default ViewHazardOrRiskContent;
