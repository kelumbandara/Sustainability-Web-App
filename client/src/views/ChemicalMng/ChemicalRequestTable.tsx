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
import { ChemicalRequest } from "../../api/ChemicalManagement/ChemicalRequestApi";
import { sampleChemicalRequestData } from "../../api/sampleData/chemicalRequestSampleData";
import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import ViewDataDrawer, { DrawerHeader } from "../../components/ViewDataDrawer";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import ViewChemicalRequestContent from "./ViewChemicalRequestContent";

function ChemicalRequestTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ChemicalRequest>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
  const [chemicalRequests, setChemicalRequests] = useState<ChemicalRequest[]>(
    sampleChemicalRequestData
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: "Chemical Management" },
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
        <PageTitle title="Chemical Management" />
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
              Add New Chemical Request
            </Button>
          </Box>
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Reference Number</TableCell>
                <TableCell align="right">Request Date</TableCell>
                <TableCell align="right">Commercial Name</TableCell>
                <TableCell align="right">Substance Name</TableCell>
                <TableCell align="right">Division</TableCell>
                <TableCell align="right">Customer</TableCell>
                <TableCell align="right">Merchandiser</TableCell>
                <TableCell align="right">Reviewer</TableCell>
                <TableCell align="right">Approver</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chemicalRequests?.length > 0 ? (
                chemicalRequests.map((row) => (
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
                      {row.reference_number}
                    </TableCell>
                    <TableCell align="right">
                      {row?.request_date
                        ? format(new Date(row.request_date), "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">{row.commercial_name}</TableCell>
                    <TableCell align="right">{row.substance_name}</TableCell>
                    <TableCell align="right">{row?.division ?? "--"}</TableCell>
                    <TableCell align="right">
                      {row?.requested_customer ?? "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.requested_merchandiser ?? "--"}
                    </TableCell>
                    <TableCell align="right">{row?.reviewer ?? "--"}</TableCell>
                    <TableCell align="right">{row?.approver ?? "--"}</TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">
                      No chemicalRequests found
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
                <ViewChemicalRequestContent chemicalRequest={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {/* {openAddOrEditDialog && (
        <AddOrEditPatientDialog
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          onSubmit={(data) => {
            if (selectedRow) {
              setChemicalRequests(
                chemicalRequests.map((doc) => (doc.id === data.id ? data : doc))
              ); // Update the patient in the list if it already exists
              enqueueSnackbar("Patient Details Updated Successfully!", {
                variant: "success",
              });
            } else {
              console.log("Adding new patient", data);
              setChemicalRequests([...chemicalRequests, data]); // Add new patient to the list
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
      )} */}
      {deleteDialogOpen && (
        <DeleteConfirmationModal
          open={deleteDialogOpen}
          title="Remove Chemical Request Confirmation"
          content={
            <>
              Are you sure you want to remove this chemical request?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            setChemicalRequests(
              chemicalRequests.filter((req) => req.id !== selectedRow.id)
            );
          }}
          onSuccess={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
            enqueueSnackbar("Chemical Request Deleted Successfully!", {
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

export default ChemicalRequestTable;
