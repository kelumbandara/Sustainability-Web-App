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
import AddOrEditConsumptionDialog from "./AddOrEditConsumption";
import {
  Environment,
  createConsumption,
  getConsumptionList,
  updateConsumption,
  deleteConsumption,
  getConsumptionAssignedList,
} from "../../../api/Environment/environmentApi";
import ViewConsumptionContent from "./ViewConsumptionContent";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../../state/queryClient";
import useCurrentUserHaveAccess from "../../../hooks/useCurrentUserHaveAccess";
import { PermissionKeys } from "../../Administration/SectionList";

function ConsumptionTable({ isAssignedTasks }: { isAssignedTasks: boolean }) {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Environment>(null);
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
    { title: `${isAssignedTasks ? "Assigned " : ""}Consumption Management` },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: consumptionData, isFetching: isConsumptionDataFetching } =
    useQuery({
      queryKey: ["consumptionRecords"],
      queryFn: getConsumptionList,
    });

  const {
    data: assignedConsumptionData,
    isFetching: isConsumptionAssignedDataFetching,
  } = useQuery({
    queryKey: ["assigned-consumptionRecords"],
    queryFn: getConsumptionAssignedList,
  });

  const { mutate: createConsumptionMutation } = useMutation({
    mutationFn: createConsumption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consumptionRecords"] });
      enqueueSnackbar("Consumption Record Created Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Consumption Record Creation Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: updateConsumptionMutation } = useMutation({
    mutationFn: updateConsumption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consumptionRecords"] });
      enqueueSnackbar("Consumption Record Updated Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Consumption Record Update Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: deleteConsumptionMutation } = useMutation({
    mutationFn: deleteConsumption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consumptionRecords"] });
      enqueueSnackbar("Consumption Records Deleted Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Consumption Delete Delete Failed`, {
        variant: "error",
      });
    },
  });

  const paginatedConsumptionData = useMemo(() => {
    if (isAssignedTasks) {
      if (!assignedConsumptionData) return [];
      if (rowsPerPage === -1) {
        return assignedConsumptionData; // If 'All' is selected, return all data
      }
      return assignedConsumptionData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    } else {
      if (!consumptionData) return [];
      if (rowsPerPage === -1) {
        return consumptionData; // If 'All' is selected, return all data
      }
      return consumptionData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    }
  }, [
    isAssignedTasks,
    assignedConsumptionData,
    page,
    rowsPerPage,
    consumptionData,
  ]);

  const isConsumptionCreateDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.ENVIRONMENT_HISTORY_CONSUMPTION_CREATE
  );
  const isConsumptionEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.ENVIRONMENT_HISTORY_CONSUMPTION_EDIT
  );
  const isConsumptionDeleteDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.ENVIRONMENT_HISTORY_CONSUMPTION_DELETE
  );
  const isConsumptionAssignCreateDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.ENVIRONMENT_ASSIGNED_TASKS_CONSUMPTION_CREATE
  );
  const isConsumptionAssignEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.ENVIRONMENT_ASSIGNED_TASKS_CONSUMPTION_EDIT
  );
  const isConsumptionAssignDeleteDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.ENVIRONMENT_ASSIGNED_TASKS_CONSUMPTION_DELETE
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
        <PageTitle title="Environment Management" />
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
                    ? isConsumptionAssignCreateDisabled
                    : isConsumptionCreateDisabled
                }
              >
                Report a Consumption
              </Button>
            </Box>
          )}
          {(isConsumptionAssignedDataFetching || isConsumptionDataFetching) && (
            <LinearProgress sx={{ width: "100%" }} />
          )}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Reference</TableCell>
                <TableCell align="right">Year</TableCell>
                <TableCell align="right">Month</TableCell>
                <TableCell align="right">Division</TableCell>
                <TableCell align="right">Work Force</TableCell>
                <TableCell align="right">Days Worked</TableCell>
                <TableCell align="right">Product Produced</TableCell>
                <TableCell align="right">Area</TableCell>
                <TableCell align="right">Reviewer</TableCell>
                <TableCell align="right">Approver</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedConsumptionData?.length > 0 ? (
                paginatedConsumptionData.map((row) => (
                  <TableRow
                    key={`${row.referenceNumber}`}
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
                    <TableCell align="right">{row.year}</TableCell>
                    <TableCell align="right">{row.month}</TableCell>
                    <TableCell align="right">{row.division}</TableCell>
                    <TableCell align="right">{row.totalWorkForce}</TableCell>
                    <TableCell align="right">
                      {row.numberOfDaysWorked}
                    </TableCell>
                    <TableCell align="right">
                      {row.totalProductProducedKg}
                    </TableCell>
                    <TableCell align="right">{row.area}</TableCell>
                    <TableCell align="right">{row.reviewer?.name}</TableCell>
                    <TableCell align="right">{row.approver?.name}</TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">
                      No Consumptions found
                    </Typography>
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
                      ? assignedConsumptionData?.length
                      : consumptionData?.length
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
        fullScreen={true}
        handleClose={() => setOpenViewDrawer(false)}
        drawerContent={
          <Stack spacing={1} sx={{ paddingX: theme.spacing(1) }}>
            <DrawerHeader
              title="Consumption Details"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              disableEdit={
                isAssignedTasks
                  ? isConsumptionAssignEditDisabled
                  : isConsumptionEditDisabled
              }
              onDelete={() => setDeleteDialogOpen(true)}
              disableDelete={
                isAssignedTasks
                  ? isConsumptionAssignDeleteDisabled
                  : isConsumptionDeleteDisabled
              }
            />

            {selectedRow && (
              <Stack>
                <ViewConsumptionContent consumption={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditConsumptionDialog
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          onSubmit={(data) => {
            if (selectedRow) {
              console.log("Updating Consumption", data);
              updateConsumptionMutation(data);
            } else {
              console.log("Adding new Consumption", data);
              createConsumptionMutation(data);
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
          title="Remove Consumption Confirmation"
          content={
            <>
              Are you sure you want to remove this consumption record?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            deleteConsumptionMutation(selectedRow.id);
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

export default ConsumptionTable;
