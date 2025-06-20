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
  Chip,
  colors,
  LinearProgress,
  Stack,
  TableFooter,
  TablePagination,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import theme from "../../../theme";
import PageTitle from "../../../components/PageTitle";
import Breadcrumb from "../../../components/BreadCrumb";
import { useMemo, useState } from "react";
import ViewDataDrawer, {
  DrawerHeader,
} from "../../../components/ViewDataDrawer";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";
import ViewExternalAuditContent from "./ViewExternalAuditContent";
import AddOrEditExternalAudit from "./AddOrEditExternalAudit";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../../state/queryClient";
import useCurrentUserHaveAccess from "../../../hooks/useCurrentUserHaveAccess";
import { PermissionKeys } from "../../Administration/SectionList";
import {
  ExternalAudit,
  Status,
  createExternalAudit,
  deleteExternalAudit,
  getExternalAssignedAudit,
  getExternalAuditData,
  updateExternalAudit,
} from "../../../api/ExternalAudit/externalAuditApi";

function ExternalAuditTable({
  isAssignedTasks,
  isCorrectiveAction,
  isAuditQueue,
}: {
  isAssignedTasks: boolean;
  isCorrectiveAction: boolean;
  isAuditQueue: boolean;
}) {
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
    {
      title: `${
        isAssignedTasks
          ? "Assigned "
          : isCorrectiveAction
          ? "Corrective Action "
          : isAuditQueue
          ? "Queue "
          : ""
      }Audit Management`,
    },
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

  const {
    data: externalAuditCorrectiveData,
    isFetching: isExternalAudiAssignedCorrectiveData,
  } = useQuery({
    queryKey: ["external-corrective-audit"],
    queryFn: getExternalAssignedAudit,
  });

  const {
    data: externalAuditQueueData,
    isFetching: isExternalAudiAssignedQueueData,
  } = useQuery({
    queryKey: ["external-queue-audit"],
    queryFn: getExternalAssignedAudit,
  });

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const {
    mutate: createExternalAuditMutation,
    isPending: createExternalAuditMutationIsPending,
  } = useMutation({
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

  const {
    mutate: updateExternalAuditMutation,
    isPending: updateExternalAuditMutationIsPending,
  } = useMutation({
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

  const {
    mutate: deleteExternalAuditMutation,
    isPending: deleteExternalAuditMutationIsPending,
  } = useMutation({
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

  const paginatedExternalAuditData = useMemo(() => {
    if (isAssignedTasks) {
      if (!externalAuditData) return [];
      if (rowsPerPage === -1) {
        return externalAuditData; // If 'All' is selected, return all data
      }
      return externalAuditTaskData?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    } else if (isCorrectiveAction) {
      if (!externalAuditCorrectiveData) return [];
      if (rowsPerPage === -1) {
        return externalAuditCorrectiveData; // If 'All' is selected, return all data
      }
      return externalAuditCorrectiveData?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    } else if (isAuditQueue) {
      if (!externalAuditQueueData) return [];
      if (rowsPerPage === -1) {
        return externalAuditQueueData; // If 'All' is selected, return all data
      }
      return externalAuditQueueData?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    } else {
      if (!externalAuditData) return [];
      if (rowsPerPage === -1) {
        return externalAuditData; // If 'All' is selected, return all data
      }
      return externalAuditData?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    }
  }, [
    page,
    rowsPerPage,
    externalAuditData,
    externalAuditTaskData,
    externalAuditCorrectiveData,
    externalAuditQueueData,

    isAssignedTasks,
    isCorrectiveAction,
    isAuditQueue,
  ]);

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

  const isExternalAuditCorrectiveCreateDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_CORRECTIVE_ACTION_CREATE
  );
  const isExternalAuditCorrectiveEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_CORRECTIVE_ACTION_EDIT
  );
  const isExternalAuditCorrectiveDeleteDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_CORRECTIVE_ACTION_DELETE
  );

  const isExternalAuditQueueCreateDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE_CREATE
  );
  const isExternalAuditQueueEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE_EDIT
  );
  const isExternalAuditQueueDeleteDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE_DELETE
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
            isAssignedTasks
              ? "Assigned "
              : isAuditQueue
              ? "Queued "
              : isCorrectiveAction
              ? "Corrective Actioned "
              : ""
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
                isAssignedTasks || isCorrectiveAction || isAuditQueue
                  ? isExternalAuditTaskListDisabled ||
                    isExternalAuditCorrectiveCreateDisabled ||
                    isExternalAuditQueueCreateDisabled
                  : isExternalAuditCreateDisabled
              }
            >
              Report External Audit
            </Button>
          </Box>
          {(isExternalAuditDataFetching ||
            isExternalAudiAssignedTaskData ||
            isExternalAudiAssignedCorrectiveData ||
            isExternalAudiAssignedQueueData) && (
            <LinearProgress sx={{ width: "100%" }} />
          )}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell align="left">Reference</TableCell>
                <TableCell align="left">Audit Date</TableCell>
                <TableCell align="left">Expiry Date</TableCell>
                <TableCell align="left">Audit Type</TableCell>
                <TableCell align="left">Audit Category</TableCell>
                <TableCell align="left">Audit Standards</TableCell>
                <TableCell align="left">Customer</TableCell>
                <TableCell align="left">Audit Firm</TableCell>
                <TableCell align="left">Division</TableCell>
                <TableCell align="left">Audit Status</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedExternalAuditData?.length > 0 ? (
                paginatedExternalAuditData?.map((row) => (
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
                    <TableCell align="left">{row.referenceNumber}</TableCell>
                    <TableCell align="left">
                      {format(new Date(row.auditDate), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell align="left">
                      {row.auditExpiryDate
                        ? format(new Date(row.auditExpiryDate), "yyyy-MM-dd")
                        : "N/A"}
                    </TableCell>
                    <TableCell align="left">{row.auditType}</TableCell>
                    <TableCell align="left">{row.auditCategory}</TableCell>
                    <TableCell align="left">{row.auditStandard}</TableCell>
                    <TableCell align="left">{row.customer}</TableCell>
                    <TableCell align="left">{row.auditFirm}</TableCell>
                    <TableCell align="left">{row.division}</TableCell>
                    <TableCell align="left">{row.auditStatus}</TableCell>
                    <TableCell align="right">
                      {RenderExternalAuditStatusChip(row.status)}
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
                  count={
                    isAssignedTasks || isAuditQueue || isCorrectiveAction
                      ? externalAuditTaskData?.length ||
                        externalAuditQueueData?.length ||
                        externalAuditCorrectiveData?.length
                      : externalAuditData?.length
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
                selectedRow?.status === Status.COMPLETE
                  ? true
                  : isAssignedTasks || isCorrectiveAction || isAuditQueue
                  ? isExternalAuditTaskEditDisabled ||
                    isExternalAuditCorrectiveEditDisabled ||
                    isExternalAuditQueueEditDisabled
                  : isExternalAuditEditDisabled
              }
              onDelete={() => setDeleteDialogOpen(true)}
              disableDelete={
                isAssignedTasks || isCorrectiveAction || isAuditQueue
                  ? isExternalAuditTaskDeleteDisabled ||
                    isExternalAuditCorrectiveDeleteDisabled ||
                    isExternalAuditQueueDeleteDisabled
                  : isExternalAuditDeleteDisabled
              }
            />

            {selectedRow && (
              <Stack>
                <ViewExternalAuditContent
                  audit={selectedRow}
                  handleClose={() => setOpenViewDrawer(false)}
                />
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
          isPending={
            createExternalAuditMutationIsPending ||
            updateExternalAuditMutationIsPending ||
            deleteExternalAuditMutationIsPending
          }
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

export function RenderExternalAuditStatusChip(status: Status) {
  switch (status) {
    case Status.DRAFT:
      return (
        <Chip
          label={status}
          sx={{
            color: "var(--pallet-blue)",
            backgroundColor: "var(--pallet-lighter-blue)",
          }}
        />
      );
    case Status.APPROVED:
      return (
        <Chip
          label={status}
          sx={{
            color: "var(--pallet-orange)",
            backgroundColor: colors.orange[50],
          }}
        />
      );
    case Status.COMPLETE:
      return (
        <Chip
          label={status}
          sx={{
            color: "var(--pallet-green)",
            backgroundColor: colors.green[50],
          }}
        />
      );
    default:
      return (
        <Chip
          label={status}
          sx={{
            color: "var(--pallet-blue)",
            backgroundColor: "var(--pallet-lighter-blue)",
          }}
        />
      );
  }
}
