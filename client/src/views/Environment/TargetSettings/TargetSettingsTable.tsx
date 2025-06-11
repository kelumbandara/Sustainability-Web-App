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
import ViewTargetSettingsContent from "./ViewTargetSettings";
import { PermissionKeys } from "../../Administration/SectionList";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../../state/queryClient";
import useCurrentUserHaveAccess from "../../../hooks/useCurrentUserHaveAccess";
import AddOrEditTargetSettingsDialog from "./AddOrEditTargetSettingsDialog";
import {
  TargetSettings,
  createTargetSettings,
  deleteTargetSettings,
  getAssignedTargetSettings,
  getTargetSettings,
  updateTargetSettings,
} from "../../../api/TargetSettings/targetSettingsApi";

function TargetSettingsTable({
  isAssignedTasks,
}: {
  isAssignedTasks: boolean;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TargetSettings>(null);
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
      title: `${isAssignedTasks ? "Assigned " : ""}Target Settings Management`,
    },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: targetSettingsData, isFetching: isTargetSettingsData } =
    useQuery({
      queryKey: ["targetSettings"],
      queryFn: getTargetSettings,
    });

  const {
    data: assignedTargetSettingsData,
    isFetching: isAssignedRiskDataFetching,
  } = useQuery({
    queryKey: ["assigned-targetSettings"],
    queryFn: getAssignedTargetSettings,
  });

  const paginatedGetTargetSettingsData = useMemo(() => {
    if (isAssignedTasks) {
      if (!assignedTargetSettingsData) return [];
      if (rowsPerPage === -1) {
        return assignedTargetSettingsData; // If 'All' is selected, return all data
      }
      return assignedTargetSettingsData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    } else {
      if (!targetSettingsData) return [];
      if (rowsPerPage === -1) {
        return targetSettingsData; // If 'All' is selected, return all data
      }
      return targetSettingsData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    }
  }, [
    isAssignedTasks,
    assignedTargetSettingsData,
    page,
    rowsPerPage,
    targetSettingsData,
  ]);

  const { mutate: createTargetSettingsMutation } = useMutation({
    mutationFn: createTargetSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["targetSettings"] });
      queryClient.invalidateQueries({ queryKey: ["assigned-targetSettings"] });
      enqueueSnackbar("Target Settings Created Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Target Settings Creation Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: updateTargetSettingsMutation } = useMutation({
    mutationFn: updateTargetSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["targetSettings"] });
      queryClient.invalidateQueries({ queryKey: ["assigned-targetSettings"] });
      enqueueSnackbar("Target Settings Update Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Target Settings Update Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: deleteTargetSettingsMutation } = useMutation({
    mutationFn: deleteTargetSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["targetSettings"] });
      queryClient.invalidateQueries({ queryKey: ["assigned-targetSettings"] });
      enqueueSnackbar("Target Settings Deleted Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Target Settings Delete Failed`, {
        variant: "error",
      });
    },
  });

  const isTargetSettingsCreateDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_CREATE
  );
  const isTargetSettingsEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_EDIT
  );
  const isTargetSettingsDeleteDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_DELETE
  );
  const isTargetSettingsAssignCreateDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_CREATE
  );
  const isTargetSettingsAssignEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_EDIT
  );
  const isTargetSettingsAssignDeleteDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING_DELETE
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
          title={`${isAssignedTasks ? "Assigned " : ""}Environment Management`}
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
          {!isAssignedTasks && (
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
                    ? isTargetSettingsAssignCreateDisabled
                    : isTargetSettingsCreateDisabled
                }
              >
                Create Target Setting
              </Button>
            </Box>
          )}
          {(isTargetSettingsData || isAssignedRiskDataFetching) && (
            <LinearProgress sx={{ width: "100%" }} />
          )}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell align="right">Reference</TableCell>
                <TableCell align="right">Division</TableCell>
                <TableCell align="right">Department</TableCell>
                <TableCell align="right">Category</TableCell>
                <TableCell align="right">Source</TableCell>
                <TableCell align="right">Responsible</TableCell>
                <TableCell align="right">Approver</TableCell>
                <TableCell align="right">Implementation Timeline</TableCell>
                {/* <TableCell align="right">Progress</TableCell> */}
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedGetTargetSettingsData?.length > 0 ? (
                paginatedGetTargetSettingsData?.map((row) => (
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
                    <TableCell align="right">{row.referenceNumber}</TableCell>

                    <TableCell align="right">{row.division}</TableCell>
                    <TableCell align="right">{row.department}</TableCell>
                    <TableCell align="right">{row.category}</TableCell>
                    <TableCell align="right">{row.source}</TableCell>
                    <TableCell align="right">{row.responsible?.name}</TableCell>
                    <TableCell align="right">{row.approver?.name}</TableCell>
                    <TableCell align="right">
                      {format(new Date(row.created_at), "yyyy-MM-dd")}
                    </TableCell>
                    {/* <TableCell align="right">{row.progress}</TableCell> */}
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
                      ? assignedTargetSettingsData?.length
                      : targetSettingsData?.length
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
              title="Target Settings Details"
              handleClose={() => setOpenViewDrawer(false)}
              disableEdit={
                isAssignedTasks
                  ? isTargetSettingsAssignEditDisabled
                  : isTargetSettingsEditDisabled
              }
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              onDelete={() => setDeleteDialogOpen(true)}
              disableDelete={
                isAssignedTasks
                  ? isTargetSettingsAssignDeleteDisabled
                  : isTargetSettingsDeleteDisabled
              }
            />

            {selectedRow && (
              <Stack>
                <ViewTargetSettingsContent targetSettings={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditTargetSettingsDialog
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          onSubmit={(data) => {
            if (selectedRow) {
              console.log("Updating document", data);
              updateTargetSettingsMutation(data);
            } else {
              console.log("Adding new hazard/risk", data);

              createTargetSettingsMutation(data);
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
          title="Remove Hazard/Risk Confirmation"
          content={
            <>
              Are you sure you want to remove this Target Settings?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            deleteTargetSettingsMutation(selectedRow.id);
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

export default TargetSettingsTable;
