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
import theme from "../../../../theme";
import PageTitle from "../../../../components/PageTitle";
import Breadcrumb from "../../../../components/BreadCrumb";
import ViewDataDrawer, {
  DrawerHeader,
} from "../../../../components/ViewDataDrawer";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { MedicineRequest } from "../../../../api/medicineRequestApi";
import { medicineRequestSampleData } from "../../../../api/sampleData/medicineRequestSampleData";
import AddOrEditMedicineRequestDialog from "./AddOrEditMedicineRequestDialog";
import ViewMedicineRequestContent from "./ViewMedicineRequestContent";

function MedicineRequestTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<MedicineRequest>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
  const [medicineRequests, setMedicineRequests] = useState<MedicineRequest[]>(
    medicineRequestSampleData
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: "Medicine Request Management" },
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
        <PageTitle title="Medicine Request Management" />
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
              Add New Medicine Request
            </Button>
          </Box>
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Reference Number</TableCell>
                <TableCell align="right">Requested Date</TableCell>
                <TableCell align="right">Medicine Name</TableCell>
                <TableCell align="right">Generic Name</TableCell>
                <TableCell align="right">Division</TableCell>
                <TableCell align="right">Approver</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicineRequests?.length > 0 ? (
                medicineRequests.map((row) => (
                  <TableRow
                    key={`${row.id}${row.reference_number}`}
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
                      {row.reference_number}
                    </TableCell>
                    <TableCell align="right">
                      {row?.request_date
                        ? format(new Date(row.request_date), "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">{row.medicine_name}</TableCell>
                    <TableCell align="right">{row.generic_name}</TableCell>
                    <TableCell align="right">{row?.division ?? "--"}</TableCell>
                    <TableCell align="right">{row?.approver ?? "--"}</TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">
                      No Medical Request found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
      <ViewDataDrawer
        open={openViewDrawer}
        handleClose={() => setOpenViewDrawer(false)}
        drawerContent={
          <Stack spacing={1} sx={{ paddingX: theme.spacing(1) }}>
            <DrawerHeader
              title="Medicine Request Details"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              onDelete={() => setDeleteDialogOpen(true)}
            />

            {selectedRow && (
              <Stack>
                <ViewMedicineRequestContent medicalRequest={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditMedicineRequestDialog
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          onSubmit={(data) => {
            if (selectedRow) {
              setMedicineRequests(
                medicineRequests.map((request) =>
                  request.id === data.id ? data : request
                )
              ); // Update the patient in the list if it already exists
              enqueueSnackbar("Medicine Request Updated Successfully!", {
                variant: "success",
              });
            } else {
              console.log("Adding new document", data);
              setMedicineRequests([...medicineRequests, data]); // Add new medicine request to the list
              enqueueSnackbar("Medicine Request Created Successfully!", {
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
          title="Remove Medicine Request Confirmation"
          content={
            <>
              Are you sure you want to remove this medicine request?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            setMedicineRequests(
              medicineRequests.filter((doc) => doc.id !== selectedRow.id)
            );
          }}
          onSuccess={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
            enqueueSnackbar("Medicine Request Deleted Successfully!", {
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

export default MedicineRequestTable;
