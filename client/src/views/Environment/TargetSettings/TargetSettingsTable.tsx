import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Stack,
  TableFooter,
  TablePagination,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import theme from "../../../theme";
import PageTitle from "../../../components/PageTitle";
import Breadcrumb from "../../../components/BreadCrumb";
import { useMemo, useState } from "react";
import ViewDataDrawer, {
  DrawerHeader,
} from "../../../components/ViewDataDrawer";
import AddIcon from "@mui/icons-material/Add";
import AddOrEditDocumentDialog from "./AddorEditTargetSettings";
import { differenceInDays, format } from "date-fns";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";
import {
  HazardAndRisk,
  HazardAndRiskStatus,
  createHazardRisk,
  getHazardRiskList,
  updateHazardRisk,
  deleteHazardRisk,
  getAssignedHazardRiskList,
} from "../../../api/hazardRiskApi";
import ViewHazardOrRiskContent from "./ViewTargetSettings";
import { PermissionKeys } from "../../Administration/SectionList";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../../state/queryClient";
import useCurrentUserHaveAccess from "../../../hooks/useCurrentUserHaveAccess";
import { TargetSettings } from "../../../api/TargetSettings/targetSettingsApi";
import { targetSettingsData } from "../../../api/sampleData/targetSettingsData";

function TargetSettingsTable({
  isAssignedTasks,
}: {
  isAssignedTasks: boolean;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TargetSettings>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
  // const [riskData, setRiskData] = useState<HazardAndRisk[]>(sampleHazardRiskData);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // handle pagination
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    {
      title: `${isAssignedTasks ? "Assigned " : ""}Target Settings Management`,
    },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: riskData, isFetching: isRiskDataFetching } = useQuery({
    queryKey: ["hazardRisks"],
    queryFn: getHazardRiskList,
  }); //need to change

  const { data: assignedRiskData, isFetching: isAssignedRiskDataFetching } =
    useQuery({
      queryKey: ["assigned-hazardRisks"],
      queryFn: getAssignedHazardRiskList,
    }); //need to change

  //   const paginatedRiskData = useMemo(() => {
  //     if (isAssignedTasks) {
  //       if (!assignedRiskData) return [];
  //       return assignedRiskData.slice(
  //         page * rowsPerPage,
  //         page * rowsPerPage + rowsPerPage
  //       );
  //     } else {
  //       if (!riskData) return [];
  //       return riskData.slice(
  //         page * rowsPerPage,
  //         page * rowsPerPage + rowsPerPage
  //       );
  //     }
  //   }, [isAssignedTasks, assignedRiskData, page, rowsPerPage, riskData]);

  const { mutate: createHazardRiskMutation } = useMutation({
    mutationFn: createHazardRisk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hazardRisks"] });
      queryClient.invalidateQueries({ queryKey: ["assigned-hazardRisks"] });
      enqueueSnackbar("Hazard Risk Report Created Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Hazard Risk Creation Failed`, {
        variant: "error",
      });
    },
  }); //need to change

  const { mutate: updateHazardRiskMutation } = useMutation({
    mutationFn: updateHazardRisk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hazardRisks"] });
      queryClient.invalidateQueries({ queryKey: ["assigned-hazardRisks"] });
      enqueueSnackbar("Hazard Risk Report Update Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Hazard Risk Update Failed`, {
        variant: "error",
      });
    },
  }); //need to change

  const { mutate: deleteHazardRiskMutation } = useMutation({
    mutationFn: deleteHazardRisk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hazardRisks"] });
      queryClient.invalidateQueries({ queryKey: ["assigned-hazardRisks"] });
      enqueueSnackbar("Hazard Risk Report Deleted Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Hazard Risk Delete Failed`, {
        variant: "error",
      });
    },
  }); //need to change

  const isRiskCreateDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_CREATE
  );
  const isRiskEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_EDIT
  );
  const isRiskDeleteDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_DELETE
  );
  const isRiskAssignCreateDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_CREATE
  );
  const isRiskAssignEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_EDIT
  );
  const isRiskAssignDeleteDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_DELETE
  );

  return (
    <Stack>
      <Box
        sx={{
          padding: theme.spacing(2),
          boxShadow: 2,
          marginY: 2,
          borderRadius: 1,
          overflowX: "hidden",
        }}
      >
        <PageTitle
          title={`${isAssignedTasks ? "Assigned " : ""}Environment Management`}
        />
        <Breadcrumb breadcrumbs={breadcrumbItems} />
      </Box>
      <Stack sx={{ alignItems: "center" }}>
        <TableContainer
          component={Paper}
          elevation={2}
          sx={{
            overflowX: "auto",
            maxWidth: isMobile ? "88vw" : "100%",
          }}
        >
          {!isAssignedTasks && (
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
                  setSelectedRow(null);
                  setOpenAddOrEditDialog(true);
                }}
                disabled={
                  isAssignedTasks
                    ? isRiskAssignCreateDisabled
                    : isRiskCreateDisabled
                }
              >
                Create Target Setting
              </Button>
            </Box>
          )}
          {(isRiskDataFetching || isAssignedRiskDataFetching) && (
            <LinearProgress sx={{ width: "100%" }} />
          )}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell align="right">Reference</TableCell>
                <TableCell align="right">Division</TableCell>
                <TableCell align="right">Department</TableCell>
                <TableCell align="right">Category</TableCell>
                <TableCell align="right">Source</TableCell>
                <TableCell align="right">Responsible</TableCell>
                <TableCell align="right">Approver</TableCell>
                <TableCell align="right">Implementation Timeline</TableCell>
                {/* <TableCell align="right">Progress</TableCell> */}
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {targetSettingsData?.length > 0 ? (
                targetSettingsData?.map((row) => (
                  <TableRow
                    key={`${row.id}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedRow(row);
                      setOpenViewDrawer(true);
                    }}
                  >
                    <TableCell align="right">{row.id}</TableCell>

                    <TableCell align="right">{row.division}</TableCell>
                    <TableCell align="right">{row.department}</TableCell>
                    <TableCell align="right">{row.category}</TableCell>
                    <TableCell align="right">{row.source}</TableCell>
                    <TableCell align="center">{row.responsible.name}</TableCell>
                    <TableCell align="center">{row.approver.name}</TableCell>
                    <TableCell align="right">
                      {format(
                        new Date(row.implementationTimeline),
                        "yyyy-MM-dd"
                      )}
                    </TableCell>
                    {/* <TableCell align="right">{row.progress}</TableCell> */}
                    <TableCell align="right">{row.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">No Records found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={100}
                  count={
                    isAssignedTasks
                      ? targetSettingsData?.length
                      : targetSettingsData?.length
                  }
                  rowsPerPage={rowsPerPage}
                  page={page}
                  showFirstButton={true}
                  showLastButton={true}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Stack>
      <ViewDataDrawer
        open={openViewDrawer}
        handleClose={() => setOpenViewDrawer(false)}
        fullScreen={true}
        drawerContent={
          <Stack spacing={1} sx={{ paddingX: theme.spacing(1) }}>
            <DrawerHeader
              title="Hazard or Risk Details"
              handleClose={() => setOpenViewDrawer(false)}
              disableEdit={
                isAssignedTasks ? isRiskAssignEditDisabled : isRiskEditDisabled
              }
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              onDelete={() => setDeleteDialogOpen(true)}
              disableDelete={
                isAssignedTasks
                  ? isRiskAssignDeleteDisabled
                  : isRiskDeleteDisabled
              }
            />

            {selectedRow && (
              <Stack>
                <ViewHazardOrRiskContent targetSettings={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditDocumentDialog
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          onSubmit={(data) => {
            if (selectedRow) {
              console.log("Updating document", data);
              updateHazardRiskMutation(data);
              // setRiskData(
              //   riskData.map((risk) => (risk.id === data.id ? data : risk))
              // ); // Update the document in the list if it already exists
              // enqueueSnackbar("Details Updated Successfully!", {
              //   variant: "success",
              // });
            } else {
              console.log("Adding new hazard/risk", data);
              // setRiskData([...riskData, data]); // Add new document to the list
              createHazardRiskMutation(data);
              // enqueueSnackbar("Hazard/Risk Created Successfully!", {
              //   variant: "success",
              // });
            }
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          defaultValues={selectedRow}
        />
      )}
      {deleteDialogOpen && (
        <DeleteConfirmationModal
          open={deleteDialogOpen}
          title="Remove Hazard/Risk Confirmation"
          content={
            <>
              Are you sure you want to remove this hazard or risk?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            // setRiskData(riskData.filter((doc) => doc.id !== selectedRow.id));
            deleteHazardRiskMutation(selectedRow.id);
          }}
          onSuccess={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
            // enqueueSnackbar("Hazard Risk Record Deleted Successfully!", {
            //   variant: "success",
            // });
          }}
          handleReject={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
          }}
        />
      )}
    </Stack>
  );
}

export default TargetSettingsTable;
