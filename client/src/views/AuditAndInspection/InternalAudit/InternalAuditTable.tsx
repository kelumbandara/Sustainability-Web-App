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
import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
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
  ScheduledInternalAuditStatus,
  ScheduledInternalAudit,
  createInternalAudit,
  updateInternalAudit,
  deleteInternalAudit,
} from "../../../api/AuditAndInspection/internalAudit";
import { sampleScheduledInternalAudits } from "../../../api/sampleData/sampleInternalAuditData";
import ViewInternalAuditContent from "./ViewInternalAuditContent";
import AddScheduledInternalAudit from "./AddScheduledInternalAudit";

function InternalAuditTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ScheduledInternalAudit>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
  const [internalAuditData, setInternalAuditData] = useState<
    ScheduledInternalAudit[]
  >(sampleScheduledInternalAudits);
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
    { title: `Internal Audit` },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  //   const { data: internalAuditData, isFetching: isInternalAuditDataFetching } = useQuery({
  //     queryKey: ["internal-audit"],
  //     queryFn: getInternalAuditList,
  //   });

  const paginatedInternalAuditData = useMemo(() => {
    if (!internalAuditData) return [];
    return internalAuditData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [page, rowsPerPage, internalAuditData]);

  const { mutate: createInternalAuditMutation } = useMutation({
    mutationFn: createInternalAudit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internal-audit"] });
      enqueueSnackbar("Internal Audit Scheduled Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Internal Audit Schedule Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: updateInternalAuditMutation } = useMutation({
    mutationFn: updateInternalAudit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internal-audit"] });
      enqueueSnackbar("Scheduled Internal Audit Updated Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Scheduled Internal Audit Update Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: deleteInternalAuditMutation } = useMutation({
    mutationFn: deleteInternalAudit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internal-audit"] });
      enqueueSnackbar("Scheduled Internal Audit Deleted Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Scheduled Internal Audit Delete Failed`, {
        variant: "error",
      });
    },
  });

  const isInternalAuditCreateDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.AUDIT_INSPECTION_INTERNAL_AUDIT_REGISTER_CREATE
  );
  const isInternalAuditEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.AUDIT_INSPECTION_INTERNAL_AUDIT_REGISTER_EDIT
  );
  const isInternalAuditDeleteDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.AUDIT_INSPECTION_INTERNAL_AUDIT_REGISTER_DELETE
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
        <PageTitle title={`Internal Audit`} />
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
              Schedule Internal Audit
            </Button>
          </Box>
          {/* {isInternalAuditDataFetching && (
            <LinearProgress sx={{ width: "100%" }} />
          )} */}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell align="right">Reference</TableCell>
                <TableCell align="right">Audit Date</TableCell>
                <TableCell align="right">Division</TableCell>
                <TableCell align="right">Audit Title</TableCell>
                <TableCell align="right">Audit Type</TableCell>
                <TableCell align="right">Auditee</TableCell>
                <TableCell align="right">Approver</TableCell>
                <TableCell align="right">Audit Status</TableCell>
                <TableCell align="right">Status</TableCell>
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
                    <TableCell align="right">{row.id}</TableCell>
                    <TableCell component="th" scope="row">
                      {row.auditDate
                        ? format(new Date(row.auditDate), "yyyy-MM-dd")
                        : "N/A"}
                    </TableCell>
                    <TableCell align="right">{row.division}</TableCell>
                    <TableCell align="right">{row.audit.name}</TableCell>
                    <TableCell align="right">{row.auditType}</TableCell>
                    <TableCell align="right">{row.auditee?.name}</TableCell>
                    <TableCell align="right">{row.approver?.name}</TableCell>
                    <TableCell align="right">{row.auditStatus}</TableCell>
                    <TableCell align="right">
                      {RenderInternalAuditStatusChip(row.status)}
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
              title="Internal Audit Details"
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
                <ViewInternalAuditContent internalAudit={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddScheduledInternalAudit
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          onSubmit={(data) => {
            // createInternalAuditMutation(data);
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
        />
      )}
      {/* {openAddOrEditDialog && (
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
              updateHazardRiskMutation(data);
              // setRiskData(
              //   riskData.map((risk) => (risk.id === data.id ? data : risk))
              // ); // Update the document in the list if it already exists
              // enqueueSnackbar("Details Updated Successfully!", {
              //   variant: "success",
              // });
            } else {
              console.log("Adding new hazard/risk", data);
              // setRiskData([...riskData, data]); // Add new document to the list
              createHazardRiskMutation(data);
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
      )} */}
      {deleteDialogOpen && (
        <DeleteConfirmationModal
          open={deleteDialogOpen}
          title="Remove Scheduled Internal Audit Confirmation"
          content={
            <>
              Are you sure you want to remove this internal audit?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            // setRiskData(riskData.filter((doc) => doc.id !== selectedRow.id));
            deleteInternalAuditMutation(selectedRow.id);
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

export default InternalAuditTable;

export function RenderInternalAuditStatusChip(
  status: ScheduledInternalAuditStatus
) {
  switch (status) {
    case ScheduledInternalAuditStatus.DRAFT:
      return (
        <Chip
          label={status}
          sx={{
            color: "var(--pallet-blue)",
            backgroundColor: "var(--pallet-lighter-blue)",
          }}
        />
      );
    case ScheduledInternalAuditStatus.SCHEDULED:
      return (
        <Chip
          label={status}
          sx={{
            color: "var(--pallet-orange)",
            backgroundColor: colors.orange[50],
          }}
        />
      );
    case ScheduledInternalAuditStatus.IN_PROGRESS:
      return (
        <Chip
          label={status}
          sx={{
            color: "var(--pallet-green)",
            backgroundColor: colors.green[50],
          }}
        />
      );
    case ScheduledInternalAuditStatus.COMPLETED:
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
