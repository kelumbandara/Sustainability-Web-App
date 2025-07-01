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
import {
  Attrition,
  deleteAttritionRecord,
  fetchAttritionRecord,
} from "../../api/Attrition/attritionApi";
// import { RAG, RAGData } from "../../api/RAG/ragApi";
import ViewAttritionContent from "./ViewAttritionContent";
import AddOrEditAttritionDialog from "./AddOrEditAttritionDialog";

function DocumentTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Attrition>(null);
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
    { title: "Attrition Details Management" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: attritionData, isFetching: isAttritionDataFetching } = useQuery({
      queryKey: ["attrition-data"],
      queryFn: fetchAttritionRecord,
    }
  );
  const { mutate: deleteAttritionMutation } = useMutation({
    mutationFn: deleteAttritionRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attrition-data"] });
      enqueueSnackbar("Attrition Records Deleted Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Attrition Delete Delete Failed`, {
        variant: "error",
      });
    },
  });

  const paginatedAttritionData = useMemo(() => {
    if (!attritionData) return [];
    if (rowsPerPage === -1) {
      return attritionData;
    }
    return attritionData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [attritionData, page, rowsPerPage]);

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
        <PageTitle title="Attrition Details Management" />
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
                  PermissionKeys.ATTRITION_REGISTER_CREATE
                )
              }
            >
              Add New Attrition Detail
            </Button>
          </Box>
          {isAttritionDataFetching && <LinearProgress sx={{ width: "100%" }} />}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Reference Number</TableCell>
                <TableCell align="right">Employee Id</TableCell>
                <TableCell align="right">Employee Name</TableCell>
                <TableCell align="right">Gender</TableCell>
                <TableCell align="right">Date Of Join</TableCell>
                <TableCell align="right">Division</TableCell>
                <TableCell align="right">Resigned Date</TableCell>
                <TableCell align="right">Relieved Date</TableCell>
                <TableCell align="right">Department</TableCell>
                <TableCell align="right">Tenure Split</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAttritionData?.length > 0 ? (
                paginatedAttritionData.map((row) => (
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
                    <TableCell align="right">{row.employeeId}</TableCell>
                    <TableCell align="right">{row.employeeName}</TableCell>
                    <TableCell align="right">{row.gender}</TableCell>
                    <TableCell align="right">
                      {format(new Date(row.dateOfJoin), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell align="right">{row.division}</TableCell>
                    <TableCell align="right">
                      {format(new Date(row.resignedDate), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell align="right">
                      {format(new Date(row.relievedDate), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell align="right">{row.department}</TableCell>
                    <TableCell align="right">{row.tenureSplit}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">No Attrition found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={100}
                  count={attritionData?.length ?? 0}
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
              title="Attrition Details"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              disableEdit={
                !useCurrentUserHaveAccess(
                  PermissionKeys.ATTRITION_REGISTER_EDIT
                )
              }
              onDelete={() => setDeleteDialogOpen(true)}
              disableDelete={
                !useCurrentUserHaveAccess(
                  PermissionKeys.ATTRITION_REGISTER_DELETE
                )
              }
            />

            {selectedRow && (
              <Stack>
                <ViewAttritionContent
                  attrition={selectedRow}
                  handleCloseDrawer={() => setOpenViewDrawer(false)}
                />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditAttritionDialog
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
          title="Remove Attrition Record Confirmation"
          content={
            <>
              Are you sure you want to remove Attrition Record?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            deleteAttritionMutation(selectedRow.id);
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
