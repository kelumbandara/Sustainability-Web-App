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
import ViewExternalAuditContent from "./ViewExternalAuditContent";
import AddOrEditExternalAudit from "./AddOrEditExternalAudit";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import useCurrentUserHaveAccess from "../../hooks/useCurrentUserHaveAccess";
import { PermissionKeys } from "../Administration/SectionList";
import {
  ExternalAudit,
  createExternalAudit,
  deleteExternalAudit,
  getExternalAssignedAudit,
  getExternalAuditData,
  updateExternalAudit,
} from "../../api/ExternalAudit/externalAuditApi";
import { sampleAuditData } from "../../api/sampleData/auditData";

function ExternalAuditTable({ isAssignedTasks }: { isAssignedTasks: boolean }) {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ExternalAudit>(null);
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
    { title: `${isAssignedTasks ? "Assigned " : ""}Audit Management` },
  ];

  const { data: externalAuditData, isFetching: isExternalAuditDataFetching } =
    useQuery({
      queryKey: ["external-audit"],
      queryFn: getExternalAuditData,
    });

  const {
    data: externalAuditTaskData,
    isFetching: isExternalAudiAssignedTaskData,
  } = useQuery({
    queryKey: ["external-assigned-audit"],
    queryFn: getExternalAssignedAudit,
  });

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { mutate: createExternalAuditMutation } = useMutation({
    mutationFn: createExternalAudit,
    onSuccess: () => {
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
      queryClient.invalidateQueries({ queryKey: ["external-audit"] });
      queryClient.invalidateQueries({ queryKey: ["external-assigned-audit"] });
      enqueueSnackbar("External Audit Created Successfully!", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar(`External Audit Creation Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: updateExternalAuditMutation } = useMutation({
    mutationFn: updateExternalAudit,
    onSuccess: () => {
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
      queryClient.invalidateQueries({ queryKey: ["external-audit"] });
      queryClient.invalidateQueries({ queryKey: ["external-assigned-audit"] });
      enqueueSnackbar("External Audit Updated Successfully!", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar(`External Audit Update Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: deleteExternalAuditMutation } = useMutation({
    mutationFn: deleteExternalAudit,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["external-audit"] });
      await queryClient.invalidateQueries({
        queryKey: ["external-assigned-audit"],
      });
      setOpenViewDrawer(false);
      setSelectedRow(null);
      enqueueSnackbar("External Audit Deleted Successfully!", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar(`External Audit Delete Failed`, {
        variant: "error",
      });
    },
  });

  // const paginatedExternalAuditData = useMemo(() => {
  //   if (isAssignedTasks) {
  //     if (!sampleAuditData) return [];
  //     return externalAuditTaskData.slice(
  //       page * rowsPerPage,
  //       page * rowsPerPage + rowsPerPage
  //     );
  //   } else {
  //     if (!sampleAuditData) return [];
  //     return externalAuditData.slice(
  //       page * rowsPerPage,
  //       page * rowsPerPage + rowsPerPage
  //     );
  //   }
  // }, [
  //   externalAuditData,
  //   page,
  //   rowsPerPage,
  //   externalAuditTaskData,
  //   isAssignedTasks,
  // ]);

  const isExternalAuditCreateDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER_CREATE
  );
  const isExternalAuditEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER_EDIT
  );
  const isExternalAuditDeleteDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER_DELETE
  );
  const isExternalAuditTaskListDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_TASK_CREATE
  );
  const isExternalAuditTaskEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_TASK_EDIT
  );
  const isExternalAuditTaskDeleteDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_TASK_DELETE
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
          title={`${
            isAssignedTasks ? "Assigned " : ""
          }External Audit Management`}
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
                  ? isExternalAuditTaskListDisabled
                  : isExternalAuditCreateDisabled
              }
            >
              Report External Audit
            </Button>
          </Box>
          {(isExternalAuditDataFetching || isExternalAudiAssignedTaskData) && (
            <LinearProgress sx={{ width: "100%" }} />
          )}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell align="right">Reference</TableCell>
                <TableCell align="right">Audit Date</TableCell>
                <TableCell align="right">Expiry Date</TableCell>
                <TableCell align="right">Audit Type</TableCell>
                <TableCell align="right">Audit Category</TableCell>
                <TableCell align="right">Audit Standards</TableCell>
                <TableCell align="right">Customer</TableCell>
                <TableCell align="right">Audit Firm</TableCell>
                <TableCell align="right">Division</TableCell>
                <TableCell align="right">Audit Status</TableCell>
                <TableCell align="right">Lapsed Status</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleAuditData?.length > 0 ? (
                sampleAuditData?.map((row) => (
                  <TableRow
                    key={`${row.id}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedRow(row as any);
                      setOpenViewDrawer(true);
                    }}
                  >
                    <TableCell align="right">{row.referenceNumber}</TableCell>
                    <TableCell align="right">
                      {format(new Date(row.auditDate), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell align="right">
                      {row.auditExpiryDate
                        ? format(new Date(row.auditExpiryDate), "yyyy-MM-dd")
                        : "N/A"}
                    </TableCell>
                    <TableCell align="right">{row.auditType}</TableCell>
                    <TableCell align="right">{row.auditCategory}</TableCell>
                    <TableCell align="right">{row.auditStandard}</TableCell>
                    <TableCell align="right">{row.customer}</TableCell>
                    <TableCell align="right">{row.auditFirm}</TableCell>
                    <TableCell align="right">{row.division}</TableCell>
                    <TableCell align="right">{row.auditStatus}</TableCell>
                    <TableCell align="right">{row.lapsedStatus}</TableCell>
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
                      ? sampleAuditData?.length
                      : sampleAuditData?.length
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
              title="External Audit Details"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              disableEdit={
                isAssignedTasks
                  ? isExternalAuditTaskEditDisabled
                  : isExternalAuditEditDisabled
              }
              onDelete={() => setDeleteDialogOpen(true)}
              disableDelete={
                isAssignedTasks
                  ? isExternalAuditTaskDeleteDisabled
                  : isExternalAuditDeleteDisabled
              }
            />

            {selectedRow && (
              <Stack>
                <ViewExternalAuditContent audit={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditExternalAudit
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          onSubmit={(data) => {
            if (selectedRow) {
              updateExternalAuditMutation(data);
            } else {
              createExternalAuditMutation(data);
            }
          }}
          defaultValues={selectedRow}
        />
      )}
      {deleteDialogOpen && (
        <DeleteConfirmationModal
          open={deleteDialogOpen}
          title="Remove External Audit Confirmation"
          content={
            <>
              Are you sure you want to remove this External Audit?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            deleteExternalAuditMutation(selectedRow.id);
          }}
          onSuccess={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
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

export default ExternalAuditTable;
