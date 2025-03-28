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
import {
  createMaternityRegister,
  deleteMaternityRegister,
  getMaternityRegistersList,
  MaternityRegister,
  updateMaternityRegister,
} from "../../../api/OccupationalHealth/maternityRegisterApi";
import theme from "../../../theme";
import PageTitle from "../../../components/PageTitle";
import Breadcrumb from "../../../components/BreadCrumb";
import ViewDataDrawer, {
  DrawerHeader,
} from "../../../components/ViewDataDrawer";
import ViewMaternityRegisterContent from "./ViewMaternityRegisterContent";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import AddOrEditMaternityRegisterDialog from "./AddOrEditMaternityRegisterDialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../../state/queryClient";
import useCurrentUserHaveAccess from "../../../hooks/useCurrentUserHaveAccess";
import { PermissionKeys } from "../../Administration/SectionList";

function MaternityRegisterTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<MaternityRegister>(null);
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
    { title: "Maternity Register" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: maternityRegisterList, isLoading } = useQuery({
    queryKey: ["maternity-register"],
    queryFn: getMaternityRegistersList,
  });

  const { mutate: createMaternityRegisterMutation } = useMutation({
    mutationFn: createMaternityRegister,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maternity-register"] });
      enqueueSnackbar("Maternity Register Report Created Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Maternity Register Creation Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: updateMaternityRegisterMutation } = useMutation({
    mutationFn: updateMaternityRegister,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maternity-register"] });
      enqueueSnackbar("Maternity Register Report Updated Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Maternity Register Update Failed`, {
        variant: "error",
      });
    },
  });

  const paginatedMaternityRegisterData = useMemo(() => {
    if (!maternityRegisterList) return [];
    return maternityRegisterList.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [maternityRegisterList, page, rowsPerPage]);

  const { mutate: deleteMaternityRegisterMutation } = useMutation({
    mutationFn: deleteMaternityRegister,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maternity-register"] });
      enqueueSnackbar("Maternity Register Report Deleted Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Maternity Register Delete Failed`, {
        variant: "error",
      });
    },
  });

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
        <PageTitle title="Maternity Register" />
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
                  PermissionKeys.OCCUPATIONAL_HEALTH_MEDICAL_RECORDS_MATERNITY_REGISTER_CREATE
                )
              }
            >
              Add New Benefit
            </Button>
          </Box>
          {isLoading && <LinearProgress sx={{ width: "100%" }} />}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Employee ID</TableCell>
                <TableCell align="right">Employee Name</TableCell>
                <TableCell align="right">Application ID</TableCell>
                <TableCell align="right">Application Date</TableCell>
                <TableCell align="right">Leave Status</TableCell>
                <TableCell align="right">Rejoining Date</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMaternityRegisterData?.length > 0 ? (
                paginatedMaternityRegisterData.map((row) => (
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
                      {row.employeeId}
                    </TableCell>
                    <TableCell align="right">{row.employeeName}</TableCell>
                    <TableCell align="right">{row.applicationId}</TableCell>
                    <TableCell align="right">
                      {row?.applicationDate
                        ? format(new Date(row.applicationDate), "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">{row?.leaveStatus}</TableCell>
                    <TableCell align="right">
                      {row?.reJoinDate
                        ? format(new Date(row.reJoinDate), "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">{row?.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">No Records Found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={100}
                  count={maternityRegisterList?.length}
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
              title="Benefit Request"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              onDelete={() => setDeleteDialogOpen(true)}
              disableEdit={
                !useCurrentUserHaveAccess(
                  PermissionKeys.OCCUPATIONAL_HEALTH_MEDICAL_RECORDS_MATERNITY_REGISTER_EDIT
                )
              }
              disableDelete={
                !useCurrentUserHaveAccess(
                  PermissionKeys.OCCUPATIONAL_HEALTH_MEDICAL_RECORDS_MATERNITY_REGISTER_DELETE
                )
              }
            />

            {selectedRow && (
              <Stack>
                <ViewMaternityRegisterContent maternityRegister={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditMaternityRegisterDialog
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          onSubmit={(data) => {
            if (selectedRow) {
              updateMaternityRegisterMutation(data);
            } else {
              createMaternityRegisterMutation(data);
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
          title="Remove Benefit Request Confirmation"
          content={
            <>
              Are you sure you want to remove this benefit request?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            if (selectedRow) {
              deleteMaternityRegisterMutation(selectedRow.id);
            }
          }}
          onSuccess={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
            enqueueSnackbar("Benefit Request Deleted Successfully!", {
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

export default MaternityRegisterTable;
