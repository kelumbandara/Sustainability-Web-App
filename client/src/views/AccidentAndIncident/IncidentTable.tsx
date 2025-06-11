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
import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import { useMemo, useState } from "react";
import ViewDataDrawer, { DrawerHeader } from "../../components/ViewDataDrawer";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";
import {
  Incident,
  getIncidentsList,
  createIncidents,
  updateIncident,
  deleteIncident,
  getIncidentsAssignedTaskList,
} from "../../api/accidentAndIncidentApi";
import AddOrEditIncidentDialog from "./AddOrEditIncidentDialog";
import ViewIncidentContent from "./ViewIncidentContent";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import useCurrentUserHaveAccess from "../../hooks/useCurrentUserHaveAccess";
import { PermissionKeys } from "../Administration/SectionList";

function IncidentTable({ isAssignedTasks }: { isAssignedTasks: boolean }) {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Incident>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
  // const [incidentData, setIncidentData] = useState<Incident[]>(sampleIncidentData);
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
    { title: `${isAssignedTasks ? "Assigned " : ""}Incident Management` },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: incidentData, isFetching: isIncidentDataFetching } = useQuery({
    queryKey: ["incidents"],
    queryFn: getIncidentsList,
  });

  const {
    data: incidentAssignedTaskData,
    isFetching: isIncidentAssignedDataFetching,
  } = useQuery({
    queryKey: ["incidents-assigned-tasks"],
    queryFn: getIncidentsAssignedTaskList,
  });

  const { mutate: createIncidentMutation, isPending: isIncidentCreating } =
    useMutation({
      mutationFn: createIncidents,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["incidents"] });
        queryClient.invalidateQueries({
          queryKey: ["incidents-assigned-tasks"],
        });
        enqueueSnackbar("Incident Report Created Successfully!", {
          variant: "success",
        });
        setSelectedRow(null);
        setOpenViewDrawer(false);
        setOpenAddOrEditDialog(false);
      },
      onError: () => {
        enqueueSnackbar(`Incident Creation Failed`, {
          variant: "error",
        });
      },
    });

  const { mutate: updateIncidentMutation, isPending: isIncidentUpdating } =
    useMutation({
      mutationFn: updateIncident,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["incidents"] });
        queryClient.invalidateQueries({
          queryKey: ["incidents-assigned-tasks"],
        });
        enqueueSnackbar("Incident Report Update Successfully!", {
          variant: "success",
        });
        setSelectedRow(null);
        setOpenViewDrawer(false);
        setOpenAddOrEditDialog(false);
      },
      onError: () => {
        enqueueSnackbar(`Incident Updation Failed`, {
          variant: "error",
        });
      },
    });

  const { mutate: deleteIncidentMutation } = useMutation({
    mutationFn: deleteIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      queryClient.invalidateQueries({ queryKey: ["incidents-assigned-tasks"] });
      enqueueSnackbar("Incident Report Delete Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Incident Deletion Failed`, {
        variant: "error",
      });
    },
  });

  const paginatedIncidentData = useMemo(() => {
    if (isAssignedTasks) {
      if (!incidentAssignedTaskData) return [];
      if (rowsPerPage === -1) {
        return incidentAssignedTaskData; // If 'All' is selected, return all data
      }
      return incidentAssignedTaskData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    } else {
      if (!incidentData) return [];
      if (rowsPerPage === -1) {
        return incidentData; // If 'All' is selected, return all data
      }
      return incidentData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    }
  }, [
    incidentData,
    page,
    rowsPerPage,
    incidentAssignedTaskData,
    isAssignedTasks,
  ]);

  const isIncidentCreateDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.INCIDENT_ACCIDENT_REGISTER_INCIDENT_CREATE
  );
  const isIncidentEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.INCIDENT_ACCIDENT_REGISTER_INCIDENT_EDIT
  );
  const isIncidentDeleteDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.INCIDENT_ACCIDENT_REGISTER_INCIDENT_DELETE
  );
  const isIncidentAssignedTaskListDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.INCIDENT_ACCIDENT_ASSIGNED_TASKS_INCIDENT_CREATE
  );
  const isIncidentAssignedTaskEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.INCIDENT_ACCIDENT_ASSIGNED_TASKS_INCIDENT_EDIT
  );
  const isIncidentAssignedTaskDeleteDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.INCIDENT_ACCIDENT_ASSIGNED_TASKS_INCIDENT_DELETE
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
          title={`${isAssignedTasks ? "Assigned " : ""}Incident Management`}
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
                  ? isIncidentAssignedTaskListDisabled
                  : isIncidentCreateDisabled
              }
            >
              Report an incident
            </Button>
          </Box>
          {(isIncidentDataFetching || isIncidentAssignedDataFetching) && (
            <LinearProgress sx={{ width: "100%" }} />
          )}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Reference</TableCell>
                <TableCell align="right">Incident Date</TableCell>
                <TableCell align="right">Incident Time</TableCell>
                <TableCell align="right">Severity</TableCell>
                <TableCell align="right">Division</TableCell>
                <TableCell align="right">Location</TableCell>
                <TableCell align="right">Circumstances</TableCell>
                <TableCell align="right">Assignee</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedIncidentData?.length > 0 ? (
                paginatedIncidentData?.map((row) => (
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
                    <TableCell component="th" scope="row">
                      {row.referenceNumber}
                    </TableCell>
                    <TableCell align="right">
                      {row?.incidentDate
                        ? format(row?.incidentDate, "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.incidentTime
                        ? format(row?.incidentTime, "HH:mm")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">{row.severity}</TableCell>
                    <TableCell align="right">{row.division}</TableCell>
                    <TableCell align="right">{row.location}</TableCell>
                    <TableCell align="right">{row.circumstances}</TableCell>
                    <TableCell align="right">{row.assignee?.name}</TableCell>
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
                      ? incidentAssignedTaskData?.length
                      : incidentData?.length
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
              title="Incident Details"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              disableEdit={
                isAssignedTasks
                  ? isIncidentAssignedTaskEditDisabled
                  : isIncidentEditDisabled
              }
              onDelete={() => setDeleteDialogOpen(true)}
              disableDelete={
                isAssignedTasks
                  ? isIncidentAssignedTaskDeleteDisabled
                  : isIncidentDeleteDisabled
              }
            />

            {selectedRow && (
              <Stack>
                <ViewIncidentContent incident={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditIncidentDialog
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          onSubmit={(data) => {
            if (selectedRow) {
              updateIncidentMutation(data);
              // setIncidentData(
              //   incidentData.map((risk) => (risk.id === data.id ? data : risk))
              // ); // Update the document in the list if it already exists
              // enqueueSnackbar("Incident Details Updated Successfully!", {
              //   variant: "success",
              // });
            } else {
              createIncidentMutation(data);
              // setIncidentData([...incidentData, data]); // Add new document to the list
              // enqueueSnackbar("Incident Created Successfully!", {
              //   variant: "success",
              // });
            }
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          defaultValues={selectedRow}
          isLoading={isIncidentCreating || isIncidentUpdating}
        />
      )}
      {deleteDialogOpen && (
        <DeleteConfirmationModal
          open={deleteDialogOpen}
          title="Remove Incident Confirmation"
          content={
            <>
              Are you sure you want to remove this incident?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            deleteIncidentMutation(selectedRow.id);
            // setIncidentData(
            //   incidentData.filter((doc) => doc.id !== selectedRow.id)
            // );
          }}
          onSuccess={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
            // enqueueSnackbar("Incident Deleted Successfully!", {
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

export default IncidentTable;
