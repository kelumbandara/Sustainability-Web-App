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
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import {
  ChemicalPurchaseRequest,
  ChemicalRequestStatus,
  deleteChemicalPurchaseRequest,
  deleteChemicalRequest,
  fetchChemicalPurchaceInventories,
} from "../../api/ChemicalManagement/ChemicalRequestApi";
import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import ViewDataDrawer, { DrawerHeader } from "../../components/ViewDataDrawer";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import ViewChemicalPurchaseInventoryContent from "./ViewChemicalPurchaseInventoryContent";
import AddOrEditChemicalPurchaseAndInventoryDialog from "./AddOrEditPurchaseAndInventoryDialog";
import queryClient from "../../state/queryClient";

function ChemicalPurchaseInventoryTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ChemicalPurchaseRequest>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
  // const [chemicalPurchaseRequests, setChemicalRequests] = useState<ChemicalRequest[]>(
  //   sampleChemicalRequestData
  // );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: "Chemical Purchase & Inventory" },
  ];

  const { data: chemicalPurchaseRequests, isFetching: isChemicalDataFetching } =
    useQuery({
      queryKey: ["chemical-purchase-inventory"],
      queryFn: fetchChemicalPurchaceInventories,
    });

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { mutate: deleteChemicalRequestMutation } = useMutation({
    mutationFn: deleteChemicalPurchaseRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["chemical-purchase-inventory"],
      });
      setOpenViewDrawer(false);
      setSelectedRow(null);
      setDeleteDialogOpen(false);
      enqueueSnackbar("Chemical Purchase Deleted Successfully!", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar(`Chemical Request Delete Failed`, {
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
        <PageTitle title="Chemical Purchase & Inventory" />
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
          {isChemicalDataFetching && <LinearProgress sx={{ width: "100%" }} />}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Reference Number</TableCell>
                <TableCell align="left">Request Date</TableCell>
                <TableCell align="left">Expiry Date</TableCell>
                <TableCell align="left">Commercial Name</TableCell>
                <TableCell align="left">Customer</TableCell>
                <TableCell align="left">Reviewer</TableCell>
                <TableCell align="left">Customer</TableCell>
                <TableCell align="left">Requested Quantity</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chemicalPurchaseRequests?.length > 0 ? (
                chemicalPurchaseRequests.map((row) => (
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
                      {row.referenceNumber}
                    </TableCell>
                    <TableCell align="left">
                      {row?.requestDate
                        ? format(new Date(row.requestDate), "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="left">
                      {row?.expiryDate
                        ? format(new Date(row.expiryDate), "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="left">{row.commercialName}</TableCell>
                    <TableCell align="left">
                      {row?.certificate.testName}
                    </TableCell>
                    <TableCell align="left">
                      {row?.requestedCustomer ?? "--"}
                    </TableCell>
                    <TableCell align="left">
                      {row?.requestedMerchandiser ?? "--"}
                    </TableCell>
                    <TableCell align="left">{row?.requestQuantity}</TableCell>
                    <TableCell align="center">
                      {(() => {
                        switch (row.status) {
                          case ChemicalRequestStatus.DRAFT:
                            return <Chip label="Draft" />;
                          case ChemicalRequestStatus.APPROVED:
                            return (
                              <Chip
                                label="Approved"
                                sx={{
                                  backgroundColor: "var(--pallet-light-blue)",
                                  color: "var(--pallet-blue)",
                                }}
                              />
                            );
                          case ChemicalRequestStatus.PUBLISHED:
                            return (
                              <Chip
                                label="Published"
                                sx={{
                                  backgroundColor: "var(--pallet-blue)",
                                  color: "white",
                                }}
                              />
                            );
                          default:
                            return null;
                        }
                      })()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">
                      No chemical Purchase Inventory found
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
              title="Chemical Request Details"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              disableEdit={
                selectedRow?.status !== ChemicalRequestStatus.APPROVED
              }
              onDelete={() => setDeleteDialogOpen(true)}
            />

            {selectedRow && (
              <Stack>
                <ViewChemicalPurchaseInventoryContent
                  chemicalRequest={selectedRow}
                />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditChemicalPurchaseAndInventoryDialog
          open={openAddOrEditDialog}
          handleClose={() => {
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
          title="Remove Chemical Request Confirmation"
          content={
            <>
              Are you sure you want to remove this chemical request?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
          }}
          deleteFunc={async () => {
            deleteChemicalRequestMutation(selectedRow?.id);
          }}
          onSuccess={() => {}}
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

export default ChemicalPurchaseInventoryTable;
