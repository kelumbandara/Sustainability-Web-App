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
import { useState } from "react";
import ViewDataDrawer, { DrawerHeader } from "../../components/ViewDataDrawer";
import AddIcon from "@mui/icons-material/Add";
import {
  createDocumentRecord,
  getDocumentList,
  updateDocumentRecord,
  deleteDocumentRecord,
} from "../../api/documentApi";
import { format } from "date-fns";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import useCurrentUserHaveAccess from "../../hooks/useCurrentUserHaveAccess";
import { PermissionKeys } from "../Administration/SectionList";
import { RAG, RAGData } from "../../api/RAG/ragApi";
import ViewRAGContent from "./ViewRAGContent";
import AddOrEditRAGDialog from "./AddOrEditRagDetailsDialog";

function DocumentTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RAG>(null);
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
    { title: "RAG Details Management" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: documents, isFetching: isDocumentDataFetching } = useQuery({
    queryKey: ["documentRecords"],
    queryFn: getDocumentList,
  });
  const { mutate: deleteDocumentMutation } = useMutation({
    mutationFn: deleteDocumentRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documentRecords"] });
      enqueueSnackbar("Document Records Deleted Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Document Delete Delete Failed`, {
        variant: "error",
      });
    },
  });

  //   const paginatedDocumentData = useMemo(() => {
  //     if (!documents) return [];
  //     if (rowsPerPage === -1) {
  //       return documents;
  //     }
  //     return documents.slice(
  //       page * rowsPerPage,
  //       page * rowsPerPage + rowsPerPage
  //     );
  //   }, [documents, page, rowsPerPage]);

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
        <PageTitle title="RAG Details Management" />
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
                !useCurrentUserHaveAccess(PermissionKeys.RAG_REGISTER_CREATE)
              }
            >
              Add New RAG Detail
            </Button>
          </Box>
          {isDocumentDataFetching && <LinearProgress sx={{ width: "100%" }} />}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Reference Number</TableCell>
                <TableCell align="right">Employment Type</TableCell>
                <TableCell align="right">Employment Id</TableCell>
                <TableCell align="right">Division</TableCell>
                <TableCell align="right">Employee Name</TableCell>
                <TableCell align="right">Date Of Join</TableCell>
                <TableCell align="right">Designation</TableCell>
                <TableCell align="right">Department</TableCell>
                <TableCell align="right">Gender</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {RAGData?.length > 0 ? (
                RAGData.map((row) => (
                  <TableRow
                    key={`${row.id}${row.referenceNumber}`}
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
                    <TableCell align="right">{row.employmentType}</TableCell>
                    <TableCell align="right">{row.employeeId}</TableCell>
                    <TableCell align="right">{row.division}</TableCell>
                    <TableCell align="right">{row.employeeName}</TableCell>
                    <TableCell align="right">
                      {format(new Date(row.dateOfJoin), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell align="right">{row.designation}</TableCell>
                    <TableCell align="right">{row.department}</TableCell>
                    <TableCell align="right">{row.gender}</TableCell>
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
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={100}
                  count={documents?.length ?? 0}
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
              title="RAG Details"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              disableEdit={
                !useCurrentUserHaveAccess(PermissionKeys.DOCUMENT_REGISTER_EDIT)
              }
              onDelete={() => setDeleteDialogOpen(true)}
              disableDelete={
                !useCurrentUserHaveAccess(
                  PermissionKeys.DOCUMENT_REGISTER_DELETE
                )
              }
            />

            {selectedRow && (
              <Stack>
                <ViewRAGContent
                  rag={selectedRow}
                  handleCloseDrawer={() => setOpenViewDrawer(false)}
                />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditRAGDialog
          open={openAddOrEditDialog}
          handleClose={() => {
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
            deleteDocumentMutation(selectedRow.id);
            setDeleteDialogOpen(false);
            setOpenViewDrawer(false);
          }}
          onSuccess={() => {}}
          handleReject={() => {}}
        />
      )}
    </Stack>
  );
}

export default DocumentTable;
