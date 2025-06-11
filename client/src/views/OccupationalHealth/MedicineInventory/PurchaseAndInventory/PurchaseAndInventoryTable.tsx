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
  Chip,
  LinearProgress,
  Stack,
  TableFooter,
  TablePagination,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import theme from "../../../../theme";
import PageTitle from "../../../../components/PageTitle";
import Breadcrumb from "../../../../components/BreadCrumb";
import ViewDataDrawer, {
  DrawerHeader,
} from "../../../../components/ViewDataDrawer";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import {
  createMedicineInventory,
  deleteMedicineInventory,
  getMedicineInventoriesList,
  MedicineInventory,
  updateMedicineInventory,
} from "../../../../api/OccupationalHealth/medicineInventoryApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../../../state/queryClient";
import ViewPurchaseAndInventoryContent from "./ViewPurchaseAndInventoryContent";
import AddOrEditPurchaseAndInventoryDialog from "./AddOrEditPurchaseAndInventoryDialog";
import useCurrentUserHaveAccess from "../../../../hooks/useCurrentUserHaveAccess";
import { PermissionKeys } from "../../../Administration/SectionList";

function PurchaseAndInventoryTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<MedicineInventory>(null);
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
    { title: "Medicine Inventory Management" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: medicineInventory, isLoading } = useQuery({
    queryKey: ["medicine-inventory"],
    queryFn: getMedicineInventoriesList,
  });

  const { mutate: createMedicineInventoryMutation } = useMutation({
    mutationFn: createMedicineInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicine-inventory"] });
      enqueueSnackbar("Medicine Inventory Report Created Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Medicine Inventory Creation Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: updateMedicineInventoryMutation } = useMutation({
    mutationFn: updateMedicineInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicine-inventory"] });
      enqueueSnackbar("Medicine Inventory Report Updated Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Medicine Inventory Update Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: deleteMedicineInventoryMutation } = useMutation({
    mutationFn: deleteMedicineInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicine-inventory"] });
      enqueueSnackbar("Medicine Inventory Report Deleted Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Medicine Inventory Delete Failed`, {
        variant: "error",
      });
    },
  });

  const paginatedMedicineInventoryData = useMemo(() => {
    if (!medicineInventory) return [];
    if (rowsPerPage === -1) {
      return medicineInventory; // If 'All' is selected, return all data
    }
    return medicineInventory.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [medicineInventory, page, rowsPerPage]);

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
        <PageTitle title="Medicine Inventory Management" />
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
          {/* <Box
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
                  PermissionKeys.OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_PURCHASE_INVENTORY_CREATE
                )
              }
            >
              Add New Medicine Inventory Item
            </Button>
          </Box> */}
          {isLoading && <LinearProgress sx={{ width: "100%" }} />}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Reference Number</TableCell>
                <TableCell align="right">Requested Date</TableCell>
                <TableCell align="right">Medicine Name</TableCell>
                <TableCell align="right">Medicine Type</TableCell>
                <TableCell align="right">Reported</TableCell>
                <TableCell align="right">Approver</TableCell>
                <TableCell align="right">Delivered Quantity</TableCell>
                <TableCell align="right">Issued</TableCell>
                <TableCell align="right">Disposed</TableCell>
                <TableCell align="right">Balance</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMedicineInventoryData?.length > 0 ? (
                paginatedMedicineInventoryData.map((row) => (
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
                    <TableCell align="right">
                      {row?.requestedDate
                        ? format(new Date(row.request_date), "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">{row?.medicineName}</TableCell>
                    <TableCell align="right">
                      {row?.medicineType ?? "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.requestedBy ?? "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.approvedBy ?? "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.deliveryQuantity ?? "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.issuedQuantity ?? "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.disposalQuantity ?? "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.balanceQuantity ?? "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row.status === "approved" ? (
                        <Chip label="Request Approved" />
                      ) : row.status === "published" ? (
                        <Chip
                          label="Published"
                          sx={{
                            backgroundColor: "var(--pallet-blue)",
                            color: "white",
                          }}
                        />
                      ) : (
                        "--"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">
                      No Medical Inventory Items found
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
                  count={medicineInventory?.length}
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
              title="Medicine Inventory Details"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              disableEdit={
                !useCurrentUserHaveAccess(
                  PermissionKeys.OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_PURCHASE_INVENTORY_EDIT
                ) || selectedRow?.status === "published"
              }
              onDelete={() => setDeleteDialogOpen(true)}
              disableDelete={
                !useCurrentUserHaveAccess(
                  PermissionKeys.OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_PURCHASE_INVENTORY_DELETE
                )
              }
            />

            {selectedRow && (
              <Stack>
                <ViewPurchaseAndInventoryContent
                  purchaseAndInventory={selectedRow}
                />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditPurchaseAndInventoryDialog
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          onSubmit={(data) => {
            if (selectedRow) {
              updateMedicineInventoryMutation(data);
            } else {
              createMedicineInventoryMutation(data);
            }
          }}
          defaultValues={selectedRow}
        />
      )}
      {deleteDialogOpen && (
        <DeleteConfirmationModal
          open={deleteDialogOpen}
          title="Remove Medicine Inventory Confirmation"
          content={
            <>
              Are you sure you want to remove this medicine inventory?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            if (selectedRow) {
              deleteMedicineInventoryMutation(selectedRow.id);
            }
          }}
          onSuccess={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
            enqueueSnackbar("Medicine Inventory Deleted Successfully!", {
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

export default PurchaseAndInventoryTable;
