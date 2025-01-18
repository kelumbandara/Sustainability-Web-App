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
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
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
import { Patient } from "../../../api/OccupationalHealth/patientApi";
import { samplePatientData } from "../../../api/sampleData/patientData";
import ViewPatientContent from "./ViewPatientContent";
import AddOrEditPatientDialog from "./AddOrEditPatientDialog";

function PatientTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Patient>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
  const [patients, setPatients] = useState<Patient[]>(samplePatientData);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: "Patient Management" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
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
            >
              Add New Patient
            </Button>
          </Box>
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
              {patients?.length > 0 ? (
                patients.map((row) => (
                  <TableRow
                    key={`${row.id}${row.employee_id}`}
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
                    <TableCell align="right">{row.employee_id}</TableCell>
                    <TableCell align="right">{row.employee_name}</TableCell>
                    <TableCell align="right">{row.gender}</TableCell>
                    <TableCell align="right">
                      {row?.check_in_date
                        ? format(new Date(row.check_in_date), "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.consulting_doctor}
                    </TableCell>
                    <TableCell align="right">{row.disease ?? "--"}</TableCell>
                    <TableCell align="right">
                      {row?.check_out_date
                        ? format(new Date(row.check_out_date), "yyyy-MM-dd")
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
              onDelete={() => setDeleteDialogOpen(true)}
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
              setPatients(
                patients.map((doc) => (doc.id === data.id ? data : doc))
              ); // Update the patient in the list if it already exists
              enqueueSnackbar("Document Details Updated Successfully!", {
                variant: "success",
              });
            } else {
              console.log("Adding new document", data);
              setPatients([...patients, data]); // Add new patient to the list
              enqueueSnackbar("Patient Created Successfully!", {
                variant: "success",
              });
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
            setPatients(patients.filter((doc) => doc.id !== selectedRow.id));
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
