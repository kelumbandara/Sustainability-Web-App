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
// import ViewAccidentContent from "./ViewAccidentContent";
// import AddOrEditAccidentDialog from "./AddOrEditAccidentDialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import useCurrentUserHaveAccess from "../../hooks/useCurrentUserHaveAccess";
import { PermissionKeys } from "../Administration/SectionList";
import { sampleGrievances } from "../../api/sampleData/grievanceSampleData";
import { Grievance } from "../../api/Grievance/grievanceApi";
import ViewGrievanceContent from "./ViewGrievanceContent";
import AddOrEditGrievanceDialog from "./AddOrEditGrievanceDialog";

function GrievanceTable({ isAssignedTasks }: { isAssignedTasks: boolean }) {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Grievance>(null);
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
    { title: `${isAssignedTasks ? "Assigned " : ""}Grievance Management` },
  ];

  //   const { data: grievanceData, isFetching: isGrievanceDataFetching } = useQuery({
  //     queryKey: ["grievances"],
  //     queryFn: getGrievancesList,
  //   });

  const grievanceData = sampleGrievances;

  //   const {
  //     data: grievanceAssignedTaskData,
  //     isFetching: isGrievanceAssignedTaskData,
  //   } = useQuery({
  //     queryKey: ["grievances-assigned-task"],
  //     queryFn: getGrievancesAssignedTaskList,
  //   });

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  //   const { mutate: createGrievanceMutation, isPending: isGrievanceCreating } =
  //     useMutation({
  //       mutationFn: createGrievance,
  //       onSuccess: () => {
  //         setSelectedRow(null);
  //         setOpenViewDrawer(false);
  //         setOpenAddOrEditDialog(false);
  //         queryClient.invalidateQueries({ queryKey: ["grievances"] });
  //         queryClient.invalidateQueries({
  //           queryKey: ["grievances-assigned-task"],
  //         });
  //         enqueueSnackbar("Grievance Report Created Successfully!", {
  //           variant: "success",
  //         });
  //       },
  //       onError: () => {
  //         enqueueSnackbar(`Grievance Creation Failed`, {
  //           variant: "error",
  //         });
  //       },
  //     });

  //   const { mutate: updateGrievanceMutation, isPending: isGrievanceUpdating } =
  //     useMutation({
  //       mutationFn: updateGrievance,
  //       onSuccess: () => {
  //         setSelectedRow(null);
  //         setOpenViewDrawer(false);
  //         setOpenAddOrEditDialog(false);
  //         queryClient.invalidateQueries({ queryKey: ["grievances"] });
  //         queryClient.invalidateQueries({
  //           queryKey: ["grievances-assigned-task"],
  //         });
  //         enqueueSnackbar("Grievance Report Updated Successfully!", {
  //           variant: "success",
  //         });
  //       },
  //       onError: () => {
  //         enqueueSnackbar(`Grievance Update Failed`, {
  //           variant: "error",
  //         });
  //       },
  //     });

  //   const { mutate: deleteGrievanceMutation } = useMutation({
  //     mutationFn: deleteGrievance,
  //     onSuccess: async () => {
  //       await queryClient.invalidateQueries({ queryKey: ["grievances"] });
  //       await queryClient.invalidateQueries({
  //         queryKey: ["grievances-assigned-task"],
  //       });
  //       setOpenViewDrawer(false);
  //       setSelectedRow(null);
  //       enqueueSnackbar("Grievance Report Deleted Successfully!", {
  //         variant: "success",
  //       });
  //     },
  //     onError: () => {
  //       enqueueSnackbar(`Grievance Delete Failed`, {
  //         variant: "error",
  //       });
  //     },
  //   });

  //   const paginatedGrievanceData = useMemo(() => {
  //     if (isAssignedTasks) {
  //       if (!grievanceAssignedTaskData) return [];
  //       if (rowsPerPage === -1) {
  //         return grievanceAssignedTaskData; // If 'All' is selected, return all data
  //       }
  //       return grievanceAssignedTaskData.slice(
  //         page * rowsPerPage,
  //         page * rowsPerPage + rowsPerPage
  //       );
  //     } else {
  //       if (!grievanceData) return [];
  //       if (rowsPerPage === -1) {
  //         return grievanceData; // If 'All' is selected, return all data
  //       }
  //       return grievanceData.slice(
  //         page * rowsPerPage,
  //         page * rowsPerPage + rowsPerPage
  //       );
  //     }
  //   }, [
  //     grievanceData,
  //     page,
  //     rowsPerPage,
  //     grievanceAssignedTaskData,
  //     isAssignedTasks,
  //   ]);

  const isGrievanceCreateDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.INCIDENT_ACCIDENT_REGISTER_ACCIDENT_CREATE
  );
  const isGrievanceEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.INCIDENT_ACCIDENT_REGISTER_ACCIDENT_EDIT
  );
  const isGrievanceDeleteDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.INCIDENT_ACCIDENT_REGISTER_ACCIDENT_DELETE
  );
  const isGrievanceAssignedTaskListDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT_CREATE
  );
  const isGrievanceAssignedTaskEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT_EDIT
  );
  const isGrievanceAssignedTaskDeleteDisabled = !useCurrentUserHaveAccess(
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
          title={`${isAssignedTasks ? "Assigned " : ""}Grievance Management`}
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
                  ? isGrievanceAssignedTaskListDisabled
                  : isGrievanceCreateDisabled
              }
            >
              Report a grievance
            </Button>
          </Box>
          {/* {(isGrievanceDataFetching || isGrievanceAssignedTaskData) && (
            <LinearProgress sx={{ width: "100%" }} />
          )} */}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Reference Id</TableCell>
                <TableCell align="right">Type</TableCell>
                <TableCell align="right">Submission Date</TableCell>
                <TableCell align="right">Anonymous</TableCell>
                {/* <TableCell align="right">Employee ID</TableCell> */}
                <TableCell align="right">Name</TableCell>
                {/* <TableCell align="right">Gender</TableCell> */}
                <TableCell align="right">Business Unit</TableCell>
                <TableCell align="right">Department</TableCell>
                <TableCell align="right">Category</TableCell>
                <TableCell align="right">Severity Score</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {paginatedAccidentData?.length > 0 ? (
                paginatedAccidentData?.map((row) => ( */}
              {grievanceData?.length > 0 ? (
                grievanceData?.map((row) => (
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
                    <TableCell align="right">{row.type}</TableCell>
                    <TableCell align="right">
                      {format(row.submissionDate, "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell align="right">
                      {row.isAnonymous ? "Yes" : "No"}
                    </TableCell>
                    {/* <TableCell align="right">{row.employeeId}</TableCell> */}
                    <TableCell align="right">{row.name}</TableCell>
                    {/* <TableCell align="right">{row.gender}</TableCell> */}
                    <TableCell align="right">{row.businessUnit}</TableCell>
                    <TableCell align="right">{row.department}</TableCell>
                    <TableCell align="right">{row.category}</TableCell>
                    <TableCell align="right">{row.severityScore}</TableCell>
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
            {/* <TableFooter>
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
            </TableFooter> */}
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
              title="Grievance Details"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              //   disableEdit={
              //     isAssignedTasks
              //       ? isAccidentAssignedTaskEditDisabled
              //       : isAccidentEditDisabled
              //   }
              onDelete={() => setDeleteDialogOpen(true)}
              //   disableDelete={
              //     isAssignedTasks
              //       ? isAccidentAssignedTaskDeleteDisabled
              //       : isAccidentDeleteDisabled
              //   }
            />

            {selectedRow && (
              <Stack>
                <ViewGrievanceContent grievance={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditGrievanceDialog
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          onSubmit={(data) => {
            console.log("Submitted Data: ", data);
            // if (selectedRow) {
            //   updateAccidentMutation(data);
            // } else {
            //   createAccidentMutation(data);
            // }
          }}
          defaultValues={selectedRow}
          // isLoading={isAccidentCreating || isAccidentUpdating}
        />
      )}
      {deleteDialogOpen && (
        <DeleteConfirmationModal
          open={deleteDialogOpen}
          title="Remove Grievance Confirmation"
          content={
            <>
              Are you sure you want to remove this grievance?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            console.log("Deleting Grievance with ID: ", selectedRow.id);
            // deleteAccidentMutation(selectedRow.id);
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

export default GrievanceTable;
