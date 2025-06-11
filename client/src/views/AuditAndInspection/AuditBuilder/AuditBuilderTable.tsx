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
import { useMutation, useQuery } from "@tanstack/react-query";
import Breadcrumb from "../../../components/BreadCrumb";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import PageTitle from "../../../components/PageTitle";
import ViewDataDrawer, {
  DrawerHeader,
} from "../../../components/ViewDataDrawer";
import useCurrentUserHaveAccess from "../../../hooks/useCurrentUserHaveAccess";
import queryClient from "../../../state/queryClient";
import theme from "../../../theme";
import { PermissionKeys } from "../../Administration/SectionList";
import {
  InternalAudit,
  getInternalAuditFormsList,
  createInternalAuditForm,
  updateInternalAuditForm,
  deleteInternalAuditForm,
} from "../../../api/AuditAndInspection/internalAudit";
import InternalAuditFormDrawerContent from "./InternalAuditFormDrawerContent";
import AddOrEditInternalAuditFormDialog from "./AddOrEditInternalAuditFormDialog";

function AuditBuilderTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<InternalAudit>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
  // const [internalAuditData, setInternalAuditData] =
  //   useState<InternalAudit[]>(sampleInternalAudits);
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
    { title: `Internal Audit Form Builder` },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: internalAuditData, isFetching: isInternalAuditFormsFetching } =
    useQuery({
      queryKey: ["internal-audit-forms"],
      queryFn: getInternalAuditFormsList,
    });

  const paginatedInternalAuditData = useMemo(() => {
    if (!internalAuditData) return [];
    if (rowsPerPage === -1) {
      return internalAuditData; // Return all data if rowsPerPage is -1
    }
    return internalAuditData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [page, rowsPerPage, internalAuditData]);

  const { mutate: createInternalAuditFormMutation } = useMutation({
    mutationFn: createInternalAuditForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internal-audit-forms"] });
      enqueueSnackbar("Internal Audit Form Created Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Internal Audit Create Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: updateInternalAuditFormMutation } = useMutation({
    mutationFn: updateInternalAuditForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internal-audit-forms"] });
      enqueueSnackbar("Internal Audit Form Updated Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Internal Audit Form Update Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: deleteInternalAuditFormMutation } = useMutation({
    mutationFn: deleteInternalAuditForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internal-audit-forms"] });
      enqueueSnackbar("Internal Audit Form Deleted Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Internal Audit Form Delete Failed`, {
        variant: "error",
      });
    },
  });

  const isInternalAuditCreateDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.AUDIT_INSPECTION_INTERNAL_AUDIT_FORM_BUILDER_CREATE
  );
  const isInternalAuditEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.AUDIT_INSPECTION_INTERNAL_AUDIT_FORM_BUILDER_EDIT
  );
  const isInternalAuditDeleteDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.AUDIT_INSPECTION_INTERNAL_AUDIT_FORM_BUILDER_DELETE
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
        <PageTitle title={`Internal Audit Forms`} />
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
              disabled={isInternalAuditCreateDisabled}
            >
              Create Internal Audit Form
            </Button>
          </Box>
          {isInternalAuditFormsFetching && (
            <LinearProgress sx={{ width: "100%" }} />
          )}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell align="left" colSpan={1}>
                  Reference
                </TableCell>
                <TableCell align="left" colSpan={1}>
                  Name
                </TableCell>
                <TableCell align="left">Created At</TableCell>
                <TableCell align="left">Last Updated At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedInternalAuditData?.length > 0 ? (
                paginatedInternalAuditData?.map((row) => (
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
                    <TableCell align="left">{row.id}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell component="th" scope="row">
                      {row.created_at
                        ? format(
                            new Date(row.created_at),
                            "yyyy-MM-dd hh:mm aa"
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.updated_at
                        ? format(
                            new Date(row.updated_at),
                            "yyyy-MM-dd hh:mm aa"
                          )
                        : "N/A"}
                    </TableCell>
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
                  count={internalAuditData?.length}
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
              title="Internal Audit Form Details"
              handleClose={() => setOpenViewDrawer(false)}
              disableEdit={isInternalAuditEditDisabled}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              onDelete={() => setDeleteDialogOpen(true)}
              disableDelete={isInternalAuditDeleteDisabled}
            />

            {selectedRow && (
              <Stack>
                <InternalAuditFormDrawerContent
                  internalAuditForm={selectedRow}
                />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditInternalAuditFormDialog
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          onSubmit={(data) => {
            if (selectedRow) {
              updateInternalAuditFormMutation({
                id: selectedRow.id,
                data,
              });
              // enqueueSnackbar("Details Updated Successfully!", {
              //   variant: "success",
              // });
            } else {
              createInternalAuditFormMutation(data);
              // enqueueSnackbar("Hazard/Risk Created Successfully!", {
              //   variant: "success",
              // });
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
          title="Remove Internal Audit Form Confirmation"
          content={
            <>
              Are you sure you want to remove this internal audit form?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            // setRiskData(riskData.filter((doc) => doc.id !== selectedRow.id));
            deleteInternalAuditFormMutation({ id: selectedRow.id });
          }}
          onSuccess={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
            // enqueueSnackbar("Hazard Risk Record Deleted Successfully!", {
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

export default AuditBuilderTable;
