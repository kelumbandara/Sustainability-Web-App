import {
  Alert,
  AppBar,
  Box,
  IconButton,
  Stack,
  Tab,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { DrawerContentItem } from "../../../components/ViewDataDrawer";
import { format } from "date-fns";
import { useState } from "react";
import theme from "../../../theme";
import useIsMobile from "../../../customHooks/useIsMobile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ListIcon from "@mui/icons-material/List";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import {
  deleteExternalActionPlan,
  ExternalAudit,
  getExternalAuditData,
  ScheduledExternalAuditActionPlan,
  Status,
} from "../../../api/ExternalAudit/externalAuditApi";
import { FileItemsViewer } from "../../../components/FileItemsViewer";
import { StorageFile } from "../../../utils/StorageFiles.util";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "../../../components/CustomButton";
import { ScheduledInternalAuditActionPlan } from "../../../api/AuditAndInspection/internalAudit";
import { AddOrEditActionPlan } from "./AddOrEditActionPlan";
import queryClient from "../../../state/queryClient";
import { enqueueSnackbar } from "notistack";

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

function ViewExternalAuditContent({
  audit,
  handleClose,
}: {
  audit: ExternalAudit;
  handleClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const { isTablet } = useIsMobile();

  const { data: externalAuditData, isFetching: isExternalAuditDataFetching } =
    useQuery({
      queryKey: ["external-audit"],
      queryFn: getExternalAuditData,
    });

    const { mutate: deleteActionItemMutation } = useMutation({
        mutationFn: deleteExternalActionPlan,
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["external-audit"],
          });
          enqueueSnackbar("Action Item Deleted Successfully!", {
            variant: "success",
          });
          setOpenDeleteActionItemModal(false);
          setSelectedActionItem(null);
        },
        onError: () => {
          enqueueSnackbar
          (`Action Item Delete Failed`, {
            variant: "error",
          });
        },
      });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log("event", event);
    setActiveTab(newValue);
  };

  const [selectedActionItem, setSelectedActionItem] =
    useState<ScheduledExternalAuditActionPlan | null>(null);
  const [openActionItemDialog, setOpenActionItemDialog] = useState(false);
  const [openDeleteActionItemModal, setOpenDeleteActionItemModal] =
    useState(false);

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
            value={audit.id}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Reported Date"
            value={
              audit.created_At
                ? format(new Date(audit.created_At), "yyyy-MM-dd")
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
                  <ListIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Audit Details
                  </Typography>
                </Box>
              }
              {...a11yProps(1)}
            />
            {audit.status === Status.COMPLETE && (
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
            )}
          </Tabs>
        </AppBar>
        <TabPanel value={activeTab} index={0} dir={theme.direction}>
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isTablet ? "column" : "row",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Audit Type"
                value={audit.auditType}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Division"
                value={audit.division}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isTablet ? "column" : "row",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Audit Category"
                value={audit.auditCategory}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Customer"
                value={audit.customer}
                sx={{ flex: 1 }}
              />
            </Box>{" "}
            <DrawerContentItem
              label="Audit Firm"
              value={audit.auditFirm}
              sx={{ flex: 1 }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: isTablet ? "column" : "row",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Audit Approver"
                value={audit.approver.name}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isTablet ? "column" : "row",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Representor"
                value={audit.representor?.name}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Announcement"
                value={audit.announcement}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={1} dir={theme.direction}>
          <DrawerContentItem
            label="Audit Status"
            value={audit.auditStatus}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Audit Score"
            value={audit.auditScore}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Grace Period"
            value={audit.gradePeriod}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Number of Non Com"
            value={audit.numberOfNonCom}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Audit Fee"
            value={audit.auditFee}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Audit Grade"
            value={audit.auditGrade}
            sx={{ flex: 1 }}
          />
          <Box>
            <FileItemsViewer
              label="Document File"
              files={audit.documents as StorageFile[]}
              sx={{ marginY: "1rem" }}
            />
          </Box>
        </TabPanel>
        {audit.status === Status.COMPLETE && (
          <TabPanel value={activeTab} index={2} dir={theme.direction}>
            {audit?.actionPlan?.length === 0 && (
              <Box sx={{ padding: "1rem" }}>
                <Alert variant="standard" severity="info">
                  No Action Plans Found
                </Alert>
              </Box>
            )}
            {isExternalAuditDataFetching ? (
              <Box sx={{ padding: "1rem" }}>
                <Alert variant="standard" severity="info">
                  Loading Action Plans...
                </Alert>
              </Box>
            ) : (
              <Stack spacing={1}>
                {audit?.actionPlan?.map((actionPlan, index) => (
                  <ActionPlanItem
                    key={`${actionPlan.actionPlanId}${actionPlan.externalAuditId}${index}`}
                    actionPlan={actionPlan}
                    onClickEdit={() => {
                      setSelectedActionItem(actionPlan);
                      setOpenActionItemDialog(true);
                    }}
                    onClickDelete={() => {
                      setSelectedActionItem(actionPlan);
                      setOpenDeleteActionItemModal(true);
                    }}
                  />
                ))}
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <CustomButton
                    variant="contained"
                    sx={{
                      backgroundColor: "var(--pallet-blue)",
                      objectFit: "contain",
                      marginTop: "1rem",
                    }}
                    size="medium"
                    onClick={() => {
                      setSelectedActionItem(null);
                      setOpenActionItemDialog(true);
                    }}
                  >
                    Add New Action
                  </CustomButton>
                </Box>
              </Stack>
            )}
            {openDeleteActionItemModal && (
              <DeleteConfirmationModal
                open={openDeleteActionItemModal}
                title="Remove Action Plan Confirmation"
                content={
                  <>
                    Are you sure you want to remove this action plan?
                    <Alert severity="warning" style={{ marginTop: "1rem" }}>
                      This action is not reversible.
                    </Alert>
                  </>
                }
                handleClose={() => setOpenDeleteActionItemModal(false)}
                deleteFunc={async () => {
                  if (selectedActionItem) {
                    await deleteActionItemMutation({
                      id: selectedActionItem.actionPlanId,
                    });
                  }
                  console.log(selectedActionItem)
                }}
                onSuccess={() => {
                  setOpenDeleteActionItemModal(false);
                  setSelectedActionItem(null);
                  handleClose();
                }}
                handleReject={() => {
                  setOpenDeleteActionItemModal(false);
                  setSelectedActionItem(null);
                }}
              />
            )}
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
        <DrawerContentItem
          label="Reported By"
          value={audit.createdByUserName}
        />
        <DrawerContentItem
          label="Issued Date"
          value={
            audit.auditDate
              ? format(new Date(audit.auditDate), "yyyy-MM-dd")
              : "N/A"
          }
        />
        <DrawerContentItem
          label="Expiry Date"
          value={
            audit.auditExpiryDate
              ? format(new Date(audit.auditExpiryDate), "yyyy-MM-dd")
              : "N/A"
          }
        />
      </Box>
      <AddOrEditActionPlan
              open={openActionItemDialog}
              setOpen={setOpenActionItemDialog}
              handleClose={() => {
                setSelectedActionItem(null);
                setOpenActionItemDialog(false);
                handleClose();
              }}
              selectedActionItem={selectedActionItem}
              auditId={audit.id}
            />
    </Stack>
  );
}

export default ViewExternalAuditContent;

const ActionPlanItem = ({
  actionPlan,
  onClickEdit,
  onClickDelete,
}: {
  actionPlan: ScheduledExternalAuditActionPlan;
  onClickEdit: () => void;
  onClickDelete: () => void;
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
      <Box sx={{ flex: 1, position: "relative" }}>
        <Box sx={{ position: "absolute", top: 0, right: 0 }}>
          <IconButton
            aria-label="edit"
            size="small"
            sx={{
              marginRight: "0.5rem",
            }}
            onClick={() => {
              onClickEdit();
            }}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            aria-label="edit"
            size="small"
            onClick={() => {
              onClickDelete();
            }}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <DrawerContentItem
            label="Due date"
            value={
              actionPlan?.dueDate
                ? format(new Date(actionPlan?.dueDate), "dd/MM/yyyy")
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
                ? format(
                    new Date(actionPlan?.targetCompletionDate),
                    "dd/MM/yyyy"
                  )
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
            {`Last updated on ${format(
              new Date(actionPlan.updated_at),
              "dd/MM/yyyy"
            )}`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
