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
  LinearProgress,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import {
  ChemicalRequest,
  ChemicalRequestStatus,
  deleteChemicalRequest,
  fetchChemicalRequests,
  fetchChemicalTransactionPublished,
} from "../../api/ChemicalManagement/ChemicalRequestApi";
import { sampleChemicalRequestData } from "../../api/sampleData/chemicalRequestSampleData";
import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import ViewDataDrawer, { DrawerHeader } from "../../components/ViewDataDrawer";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import ViewChemicalRequestContent from "./ViewChemicalRequestContent";
import AddOrEditChemicalRequestDialog from "./AddOrEditChemicalRequestDialog";
import CustomButton from "../../components/CustomButton";
import ApproveConfirmationModal from "../OccupationalHealth/MedicineInventory/MedicineRequest/ApproveConfirmationModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";

function ChemicalRequestTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ChemicalRequest>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
  // const [chemicalRequests, setChemicalRequests] = useState<ChemicalRequest[]>(
  //   sampleChemicalRequestData
  // );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: "Chemical Transaction" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: chemicalTransaction, isFetching: isChemicalDataFetching } =
    useQuery({
      queryKey: ["chemical-requests"],
      queryFn: fetchChemicalTransactionPublished,
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
        <PageTitle title="Chemical Management" />
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
          {(isChemicalDataFetching) && (
            <LinearProgress sx={{ width: "100%" }} />
          )}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
              <TableCell>Inventory</TableCell>
                <TableCell>Reference Number</TableCell>
                <TableCell align="right">Transaction Date</TableCell>
                <TableCell align="right">Division</TableCell>
                <TableCell align="right">Department</TableCell>
                <TableCell align="right">Authorized Person</TableCell>
                <TableCell align="right">Chemical</TableCell>
                <TableCell align="right">Available Quantity</TableCell>
                <TableCell align="right">Cost</TableCell>
                <TableCell align="right">Balanced</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chemicalTransaction?.length > 0 ? (
                chemicalTransaction.map((row) => (
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
                    <TableCell align="right">
                      {row?.requestDate
                        ? format(new Date(row.requestDate), "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">{row.commercialName}</TableCell>
                    <TableCell align="right">{row.substanceName}</TableCell>
                    <TableCell align="right">{row?.division ?? "--"}</TableCell>
                    <TableCell align="right">
                      {row?.requestedCustomer ?? "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.requestedMerchandiser ?? "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.deliveryQuantity ?? "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row.status === ChemicalRequestStatus.DRAFT ? (
                        <Chip label="Draft" />
                      ) : (
                        <Chip
                          label="Approved"
                          sx={{
                            backgroundColor: "var(--pallet-blue)",
                            color: "white",
                          }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">
                      No chemical Transaction found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack>
  );
}

export default ChemicalRequestTable;
