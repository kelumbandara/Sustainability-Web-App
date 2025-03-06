import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
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
import { useQuery } from "@tanstack/react-query";
import { getMedicineInventoriesTransaction } from "../../../api/OccupationalHealth/medicineInventoryApi";
import Breadcrumb from "../../../components/BreadCrumb";
import PageTitle from "../../../components/PageTitle";
import theme from "../../../theme";

function TransactionTable() {
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
    { title: "Inventory Transaction" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: medicineInventoryTransaction, isLoading } = useQuery({
    queryKey: ["medicine-inventory-transaction"],
    queryFn: getMedicineInventoriesTransaction,
  });

  const paginatedMedicineInventoryTransactionData = useMemo(() => {
    if (!medicineInventoryTransaction) return [];
    return medicineInventoryTransaction.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [medicineInventoryTransaction, page, rowsPerPage]);

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
        <PageTitle title="Inventory Transactions" />
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
          {isLoading && <LinearProgress sx={{ width: "100%" }} />}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Inventory</TableCell>
                <TableCell align="right">Reference Number</TableCell>
                <TableCell align="right">Transaction Date</TableCell>
                <TableCell align="right">Division</TableCell>
                <TableCell align="right">Authorized Person</TableCell>
                <TableCell align="right">Medicine</TableCell>
                <TableCell align="right">Requested Quantity</TableCell>
                <TableCell align="right">Available Quantity</TableCell>
                <TableCell align="right">Issued</TableCell>
                <TableCell align="right">Cost</TableCell>
                <TableCell align="right">Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMedicineInventoryTransactionData?.length > 0 ? (
                paginatedMedicineInventoryTransactionData.map((row) => (
                  <TableRow
                    key={`${row.id}${row.referenceNumber}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.referenceNumber}
                    </TableCell>
                    <TableCell align="right">
                      {row?.publishedAt
                        ? format(new Date(row?.publishedAt), "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">{row?.division}</TableCell>
                    <TableCell align="right">
                      {row?.approver?.name ?? "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.medicineName ?? "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.requestedQuantity ?? "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.deliveryQuantity ?? "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.issuedQuantity ?? "--"}
                    </TableCell>
                    <TableCell align="right">{row?.unitCost ?? "--"}</TableCell>
                    <TableCell align="right">
                      {row?.balanceQuantity ?? "--"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">
                      No Transactions Found
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
                  count={medicineInventoryTransaction?.length}
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
    </Stack>
  );
}

export default TransactionTable;
