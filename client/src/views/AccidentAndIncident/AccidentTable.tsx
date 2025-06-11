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
  Accident,
  createAccident,
  deleteAccident,
  getAccidentsAssignedTaskList,
  getAccidentsList,
  updateAccident,
} from "../../api/accidentAndIncidentApi";
import ViewAccidentContent from "./ViewAccidentContent";
import AddOrEditAccidentDialog from "./AddOrEditAccidentDialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import useCurrentUserHaveAccess from "../../hooks/useCurrentUserHaveAccess";
import { PermissionKeys } from "../Administration/SectionList";

function AccidentTable({ isAssignedTasks }: { isAssignedTasks: boolean }) {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Accident>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
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
    { title: `${isAssignedTasks ? "Assigned " : ""}Accident Management` },
  ];

  const { data: accidentData, isFetching: isAccidentDataFetching } = useQuery({
    queryKey: ["accidents"],
    queryFn: getAccidentsList,
  });

  const {
    data: accidentAssignedTaskData,
    isFetching: isAccidentAssignedTaskData,
  } = useQuery({
    queryKey: ["accidents-assigned-task"],
    queryFn: getAccidentsAssignedTaskList,
  });

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { mutate: createAccidentMutation, isPending: isAccidentCreating } =
    useMutation({
      mutationFn: createAccident,
      onSuccess: () => {
        setSelectedRow(null);
        setOpenViewDrawer(false);
        setOpenAddOrEditDialog(false);
        queryClient.invalidateQueries({ queryKey: ["accidents"] });
        queryClient.invalidateQueries({
          queryKey: ["accidents-assigned-task"],
        });
        enqueueSnackbar("Accident Report Created Successfully!", {
          variant: "success",
        });
      },
      onError: () => {
        enqueueSnackbar(`Accident Creation Failed`, {
          variant: "error",
        });
      },
    });

  const { mutate: updateAccidentMutation, isPending: isAccidentUpdating } =
    useMutation({
      mutationFn: updateAccident,
      onSuccess: () => {
        setSelectedRow(null);
        setOpenViewDrawer(false);
        setOpenAddOrEditDialog(false);
        queryClient.invalidateQueries({ queryKey: ["accidents"] });
        queryClient.invalidateQueries({
          queryKey: ["accidents-assigned-task"],
        });
        enqueueSnackbar("Accident Report Updated Successfully!", {
          variant: "success",
        });
      },
      onError: () => {
        enqueueSnackbar(`Accident Update Failed`, {
          variant: "error",
        });
      },
    });

  const { mutate: deleteAccidentMutation } = useMutation({
    mutationFn: deleteAccident,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accidents"] });
      await queryClient.invalidateQueries({
        queryKey: ["accidents-assigned-task"],
      });
      setOpenViewDrawer(false);
      setSelectedRow(null);
      enqueueSnackbar("Accident Report Deleted Successfully!", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar(`Accident Delete Failed`, {
        variant: "error",
      });
    },
  });

  const paginatedAccidentData = useMemo(() => {
    if (isAssignedTasks) {
      if (!accidentAssignedTaskData) return [];
      if (rowsPerPage === -1) {
        return accidentAssignedTaskData; // If 'All' is selected, return all data
      }
      return accidentAssignedTaskData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    } else {
      if (!accidentData) return [];
      if (rowsPerPage === -1) {
        return accidentData; // If 'All' is selected, return all data
      }
      return accidentData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    }
  }, [
    accidentData,
    page,
    rowsPerPage,
    accidentAssignedTaskData,
    isAssignedTasks,
  ]);

  const isAccidentCreateDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.INCIDENT_ACCIDENT_REGISTER_ACCIDENT_CREATE
  );
  const isAccidentEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.INCIDENT_ACCIDENT_REGISTER_ACCIDENT_EDIT
  );
  const isAccidentDeleteDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.INCIDENT_ACCIDENT_REGISTER_ACCIDENT_DELETE
  );
  const isAccidentAssignedTaskListDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT_CREATE
  );
  const isAccidentAssignedTaskEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT_EDIT
  );
  const isAccidentAssignedTaskDeleteDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT_DELETE
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
          title={`${isAssignedTasks ? "Assigned " : ""}Accident Management`}
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
                  ? isAccidentAssignedTaskListDisabled
                  : isAccidentCreateDisabled
              }
            >
              Report an accident
            </Button>
          </Box>
          {(isAccidentDataFetching || isAccidentAssignedTaskData) && (
            <LinearProgress sx={{ width: "100%" }} />
          )}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Reference</TableCell>
                <TableCell align="right">Accident Date</TableCell>
                <TableCell align="right">Accident Time</TableCell>
                <TableCell align="right">Severity</TableCell>
                <TableCell align="right">Injury Type</TableCell>
                {/* <TableCell align="right">Time of Work</TableCell>
                <TableCell align="right">Return for Work</TableCell> */}
                <TableCell align="right">Division</TableCell>
                <TableCell align="right">Department</TableCell>
                <TableCell align="right">Category</TableCell>
                <TableCell align="right">Assignee</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAccidentData?.length > 0 ? (
                paginatedAccidentData?.map((row) => (
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
                      {format(row.accidentDate, "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell align="right">
                      {format(row.accidentTime, "HH:mm")}
                    </TableCell>
                    <TableCell align="right">{row.severity}</TableCell>
                    <TableCell align="right">{row.injuryType}</TableCell>
                    {/* hide until figure out from where this come */}
                    {/* <TableCell align="right">{row.timeOfWork}</TableCell>
                    <TableCell align="right">
                      {row.returnForWork ? row.returnForWork : "--"}
                    </TableCell> */}
                    <TableCell align="right">{row.division}</TableCell>
                    <TableCell align="right">{row.department}</TableCell>
                    <TableCell align="right">{row.category}</TableCell>
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
                      ? accidentAssignedTaskData?.length
                      : accidentData?.length
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
              title="Accident Details"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              disableEdit={
                isAssignedTasks
                  ? isAccidentAssignedTaskEditDisabled
                  : isAccidentEditDisabled
              }
              onDelete={() => setDeleteDialogOpen(true)}
              disableDelete={
                isAssignedTasks
                  ? isAccidentAssignedTaskDeleteDisabled
                  : isAccidentDeleteDisabled
              }
            />

            {selectedRow && (
              <Stack>
                <ViewAccidentContent accident={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditAccidentDialog
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          onSubmit={(data) => {
            if (selectedRow) {
              updateAccidentMutation(data);
            } else {
              createAccidentMutation(data);
            }
          }}
          defaultValues={selectedRow}
          isLoading={isAccidentCreating || isAccidentUpdating}
        />
      )}
      {deleteDialogOpen && (
        <DeleteConfirmationModal
          open={deleteDialogOpen}
          title="Remove Accident Confirmation"
          content={
            <>
              Are you sure you want to remove this accident?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            deleteAccidentMutation(selectedRow.id);
          }}
          onSuccess={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
            // enqueueSnackbar("Accident Deleted Successfully!", {
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

export default AccidentTable;
