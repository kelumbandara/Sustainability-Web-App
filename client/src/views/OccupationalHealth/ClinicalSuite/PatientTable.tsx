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
import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import theme from "../../../theme";
import PageTitle from "../../../components/PageTitle";
import Breadcrumb from "../../../components/BreadCrumb";
import ViewDataDrawer, {
  DrawerHeader,
} from "../../../components/ViewDataDrawer";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import {
  createPatient,
  deletePatient,
  getPatientList,
  Patient,
  updatePatient,
} from "../../../api/OccupationalHealth/patientApi";
import ViewPatientContent from "./ViewPatientContent";
import AddOrEditPatientDialog from "./AddOrEditPatientDialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../../state/queryClient";
import useCurrentUserHaveAccess from "../../../hooks/useCurrentUserHaveAccess";
import { PermissionKeys } from "../../Administration/SectionList";

function PatientTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Patient>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
  // const [patients, setPatients] = useState<Patient[]>(samplePatientData);
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
    { title: "Patient Management" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: patientData, isFetching: isPatientDataFetching } = useQuery({
    queryKey: ["patients"],
    queryFn: getPatientList,
  });

  const { mutate: createPatientMutation } = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      enqueueSnackbar("Patient Report Created Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Patient Report Creation Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: updatePatientMutation } = useMutation({
    mutationFn: updatePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      enqueueSnackbar("Patient Report Update Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Patient Report Update Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: deletePatientMutation } = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      enqueueSnackbar("Patient Report Delete Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Patient Report Delete Failed`, {
        variant: "error",
      });
    },
  });

  const paginatedPatientData = useMemo(() => {
    if (!patientData) return [];
    if (rowsPerPage === -1) {
      return patientData; // If 'All' is selected, return all data
    }
    return patientData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [patientData, page, rowsPerPage]);

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
        <PageTitle title="Patient Management" />
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
                !useCurrentUserHaveAccess(
                  PermissionKeys.OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PATIENT_REGISTER_CREATE
                )
              }
            >
              Add New Patient
            </Button>
          </Box>
          {isPatientDataFetching && <LinearProgress sx={{ width: "100%" }} />}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Patient ID</TableCell>
                <TableCell align="right">Employee ID</TableCell>
                <TableCell align="right">Employee Name</TableCell>
                <TableCell align="right">Gender</TableCell>
                <TableCell align="right">Check In</TableCell>
                <TableCell align="right">Consulting Doctor</TableCell>
                <TableCell align="right">Disease</TableCell>
                <TableCell align="right">Check Out</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPatientData?.length > 0 ? (
                paginatedPatientData.map((row) => (
                  <TableRow
                    key={`${row.id}${row.employeeId}`}
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
                      {row.id}
                    </TableCell>
                    <TableCell align="right">{row.employeeId}</TableCell>
                    <TableCell align="right">{row.employeeName}</TableCell>
                    <TableCell align="right">{row.gender}</TableCell>
                    <TableCell align="right">
                      {row?.checkInDate
                        ? format(new Date(row.checkInDate), "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">{row?.consultingDoctor}</TableCell>
                    <TableCell align="right">{row.disease ?? "--"}</TableCell>
                    <TableCell align="right">
                      {row?.checkOutDate
                        ? format(new Date(row.checkOutDate), "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">No patients found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={100}
                  count={patientData?.length}
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
        fullScreen={true}
        handleClose={() => setOpenViewDrawer(false)}
        drawerContent={
          <Stack spacing={1} sx={{ paddingX: theme.spacing(1) }}>
            <DrawerHeader
              title="Patient Details"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              disableEdit={
                !useCurrentUserHaveAccess(
                  PermissionKeys.OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PATIENT_REGISTER_EDIT
                )
              }
              onDelete={() => setDeleteDialogOpen(true)}
              disableDelete={
                !useCurrentUserHaveAccess(
                  PermissionKeys.OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PATIENT_REGISTER_DELETE
                )
              }
            />

            {selectedRow && (
              <Stack>
                <ViewPatientContent patient={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditPatientDialog
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          onSubmit={(data) => {
            if (selectedRow) {
              updatePatientMutation(data);
            } else {
              createPatientMutation(data);
            }
          }}
          defaultValues={selectedRow}
        />
      )}
      {deleteDialogOpen && (
        <DeleteConfirmationModal
          open={deleteDialogOpen}
          title="Remove Patient Confirmation"
          content={
            <>
              Are you sure you want to remove this patient?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            deletePatientMutation(selectedRow.id);
          }}
          onSuccess={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
            enqueueSnackbar("Patient Deleted Successfully!", {
              variant: "success",
            });
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

export default PatientTable;
