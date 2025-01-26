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
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
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
import { MedicineInventory } from "../../../../api/OccupationalHealth/medicineInventoryApi";
import { medicineInventorySampleData } from "../../../../api/sampleData/medicineInventorySampleData";
import ViewPurchaseAndInventoryContent from "./ViewPurchaseAndInventoryContent";
import AddOrEditPurchaseAndInventoryDialog from "./AddOrEditPurchaseAndInventoryDialog";

function PurchaseAndInventoryTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<MedicineInventory>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
  const [medicineInventory, setMedicineInventory] = useState<
    MedicineInventory[]
  >(medicineInventorySampleData);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: "Medicine Inventory Management" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
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
            >
              Add New Medicine Inventory Item
            </Button>
          </Box>
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
              {medicineInventory?.length > 0 ? (
                medicineInventory.map((row) => (
                  <TableRow
                    key={`${row.id}${row.reference_number}`}
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
                      {row.reference_number}
                    </TableCell>
                    <TableCell align="right">
                      {row?.request_date
                        ? format(new Date(row.request_date), "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">{row?.medicine_name}</TableCell>
                    <TableCell align="right">
                      {row?.medicine_type ?? "--"}
                    </TableCell>
                    <TableCell align="right">{row?.reporter ?? "--"}</TableCell>
                    <TableCell align="right">{row?.approver ?? "--"}</TableCell>
                    <TableCell align="right">
                      {row?.delivered_quantity ?? "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.issued_quantity ?? "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.disposed_of_quantity ?? "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.balance_quantity ?? "--"}
                    </TableCell>
                    <TableCell align="right">{row?.status}</TableCell>
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
              onDelete={() => setDeleteDialogOpen(true)}
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
              setMedicineInventory(
                medicineInventory.map((request) =>
                  request.id === data.id ? data : request
                )
              ); // Update the patient in the list if it already exists
              enqueueSnackbar("Medicine Request Updated Successfully!", {
                variant: "success",
              });
            } else {
              console.log("Adding new document", data);
              setMedicineInventory([...medicineInventory, data]); // Add new medicine request to the list
              enqueueSnackbar("Medicine Request Created Successfully!", {
                variant: "success",
              });
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
            setMedicineInventory(
              medicineInventory.filter((doc) => doc.id !== selectedRow.id)
            );
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
