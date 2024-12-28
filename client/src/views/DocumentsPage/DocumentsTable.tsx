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
import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import { useState } from "react";
import ViewDataDrawer, { DrawerHeader } from "../../components/ViewDataDrawer";
import AddIcon from "@mui/icons-material/Add";
import AddOrEditDocumentDialog from "./AddOrEditDocumentDialog";
import { sampleDocuments } from "../../api/sampleData/documentData";
import { Document } from "../../api/documentApi";
import { differenceInDays, format } from "date-fns";
import ViewDocumentContent from "./ViewDocumentContent";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";

function DocumentTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Document>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: "Document Management" },
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
        <PageTitle title="Document Management" />
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
              Add New Document
            </Button>
          </Box>
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Document Number</TableCell>
                <TableCell align="right">Version Number</TableCell>
                <TableCell align="right">Document Type</TableCell>
                <TableCell align="right">Title</TableCell>
                <TableCell align="right">Division</TableCell>
                <TableCell align="right">Issuing Authority</TableCell>
                <TableCell align="right">Issued Date</TableCell>
                <TableCell align="right">Expiry Date</TableCell>
                <TableCell align="right">Notify Date</TableCell>
                <TableCell align="right">Elapse Days</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents?.length > 0 ? (
                documents.map((row) => (
                  <TableRow
                    key={`${row.documentNumber}${row.title}`}
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
                      {row.documentNumber}
                    </TableCell>
                    <TableCell align="right">{row.versionNumber}</TableCell>
                    <TableCell align="right">{row.documentType}</TableCell>
                    <TableCell align="right">{row.title}</TableCell>
                    <TableCell align="right">{row.division}</TableCell>
                    <TableCell align="right">{row.issuingAuthority}</TableCell>
                    <TableCell align="right">
                      {format(new Date(row.issuedDate), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell align="right">
                      {row.expiryDate
                        ? format(new Date(row.expiryDate), "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row.notifyDate
                        ? format(new Date(row.notifyDate), "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row.expiryDate
                        ? differenceInDays(row.expiryDate, row.issuedDate)
                        : "--"}
                    </TableCell>
                    <TableCell align="right">
                      {differenceInDays(row.expiryDate, new Date()) > 10 ? (
                        <Typography sx={{ color: "green" }}>Active</Typography>
                      ) : differenceInDays(row.expiryDate, new Date()) > 0 ? (
                        <Typography sx={{ color: "orange" }}>
                          Expiring Soon
                        </Typography>
                      ) : (
                        <Typography sx={{ color: "red" }}>Expired</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">No documents found</Typography>
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
              title="Document Details"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              onDelete={() => setDeleteDialogOpen(true)}
            />

            {selectedRow && (
              <Stack>
                <ViewDocumentContent document={selectedRow} />
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
              setDocuments(
                documents.map((doc) => (doc.id === data.id ? data : doc))
              ); // Update the document in the list if it already exists
              enqueueSnackbar("Document Details Updated Successfully!", {
                variant: "success",
              });
            } else {
              console.log("Adding new document", data);
              setDocuments([...documents, data]); // Add new document to the list
              enqueueSnackbar("Document Created Successfully!", {
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
          title="Remove Document Confirmation"
          content={
            <>
              Are you sure you want to remove this document?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            setDocuments(documents.filter((doc) => doc.id !== selectedRow.id));
          }}
          onSuccess={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
            enqueueSnackbar("Document Deleted Successfully!", {
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

export default DocumentTable;
