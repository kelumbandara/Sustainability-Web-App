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
import theme from "../../../../theme";
import PageTitle from "../../../../components/PageTitle";
import Breadcrumb from "../../../../components/BreadCrumb";
import ViewDataDrawer, {
  DrawerHeader,
} from "../../../../components/ViewDataDrawer";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { MedicineRequest } from "../../../../api/medicineRequestApi";
import AddOrEditMedicineRequestDialog from "./AddOrEditMedicineRequestDialog";
import ViewMedicineRequestContent from "./ViewMedicineRequestContent";
import {
  getMedicineList,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from "../../../../api/medicineRequestApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../../../state/queryClient";
import useCurrentUserHaveAccess from "../../../../hooks/useCurrentUserHaveAccess";
import { PermissionKeys } from "../../../Administration/SectionList";

function MedicineRequestTable({
  isAssignedTasks,
}: {
  isAssignedTasks: boolean;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<MedicineRequest>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
  // const [medicineRequests, setMedicineRequests] = useState<MedicineRequest[]>(
  //   medicineRequestSampleData
  // );
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
      title: `${isAssignedTasks ? "Assigned " : ""}Medicine Request Management`,
    },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: medicineData, isFetching: isMedicineDataFetching } = useQuery({
    queryKey: ["medicines"],
    queryFn: getMedicineList,
  });

  const { mutate: createMedicineMutation } = useMutation({
    mutationFn: createMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      enqueueSnackbar("Medicine Report Created Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Medicine Report Creation Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: updateMedicineMutation } = useMutation({
    mutationFn: updateMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      enqueueSnackbar("Medicine Report Update Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Medicine Report Update Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: deleteMedicineMutation } = useMutation({
    mutationFn: deleteMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      enqueueSnackbar("Medicine Report Delete Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Medicine Report Delete Failed`, {
        variant: "error",
      });
    },
  });

  const paginatedMedicineData = useMemo(() => {
    if (!medicineData) return [];
    return medicineData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [medicineData, page, rowsPerPage]);

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
          }Medicine Request Management`}
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
                !useCurrentUserHaveAccess(
                  PermissionKeys.OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_MEDICINE_REQUEST_CREATE
                )
              }
            >
              Add New Medicine Request
            </Button>
          </Box>
          {isMedicineDataFetching && <LinearProgress sx={{ width: "100%" }} />}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Reference Number</TableCell>
                <TableCell align="right">Requested Date</TableCell>
                <TableCell align="right">Medicine Name</TableCell>
                <TableCell align="right">Generic Name</TableCell>
                <TableCell align="right">Division</TableCell>
                <TableCell align="right">Approver</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMedicineData?.length > 0 ? (
                paginatedMedicineData.map((row) => (
                  <TableRow
                    key={`${row.id}${row.id}`}
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
                    <TableCell align="right">
                      {row?.created_at
                        ? format(new Date(row.created_at), "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">{row.medicineName}</TableCell>
                    <TableCell align="right">{row.genericName}</TableCell>
                    <TableCell align="right">{row?.division ?? "--"}</TableCell>
                    <TableCell align="right">{row?.approver ?? "--"}</TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">
                      No Medical Request found
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
                  count={medicineData?.length}
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
        drawerContent={
          <Stack spacing={1} sx={{ paddingX: theme.spacing(1) }}>
            <DrawerHeader
              title="Medicine Request Details"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              disableEdit={
                !useCurrentUserHaveAccess(
                  PermissionKeys.OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_MEDICINE_REQUEST_EDIT
                )
              }
              onDelete={() => setDeleteDialogOpen(true)}
              disableDelete={
                !useCurrentUserHaveAccess(
                  PermissionKeys.OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_MEDICINE_REQUEST_DELETE
                )
              }
            />

            {selectedRow && (
              <Stack>
                <ViewMedicineRequestContent medicalRequest={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditMedicineRequestDialog
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          onSubmit={(data) => {
            if (selectedRow) {
              updateMedicineMutation(data);
            } else {
              createMedicineMutation(data);
            }
          }}
          defaultValues={selectedRow}
        />
      )}
      {deleteDialogOpen && (
        <DeleteConfirmationModal
          open={deleteDialogOpen}
          title="Remove Medicine Request Confirmation"
          content={
            <>
              Are you sure you want to remove this medicine request?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            if (selectedRow) {
              deleteMedicineMutation(selectedRow.id);
            }
          }}
          onSuccess={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
            // enqueueSnackbar("Medicine Request Deleted Successfully!", {
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

export default MedicineRequestTable;
