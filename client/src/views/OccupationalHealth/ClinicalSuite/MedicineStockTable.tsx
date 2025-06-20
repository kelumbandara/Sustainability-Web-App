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
import { getMedicineInventoriesList } from "../../../api/OccupationalHealth/medicineInventoryApi";
import Breadcrumb from "../../../components/BreadCrumb";
import PageTitle from "../../../components/PageTitle";
import theme from "../../../theme";

function MedicineStockTable() {
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
    { title: "Medicine Stock" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: medicineInventory, isLoading } = useQuery({
    queryKey: ["medicine-inventory"],
    queryFn: getMedicineInventoriesList,
  });

  const paginatedMedicineInventoryData = useMemo(() => {
    if (!medicineInventory) return [];
    if (rowsPerPage === -1) {
      return medicineInventory;
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
        <PageTitle title="Medicine Stock" />
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
                <TableCell>Reference Id</TableCell>
                <TableCell align="left">Medicine Name</TableCell>
                <TableCell align="left">Division</TableCell>
                <TableCell align="left">Delivery Quantity</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="right">Last Updated</TableCell>
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
                  >
                    <TableCell component="th" scope="row">
                      {row.referenceNumber}
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      {row.medicineName}
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      {row.division}
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      {row.deliveryQuantity || "--"}
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      {row.status}
                    </TableCell>
                    <TableCell align="right">
                      {row?.publishedAt
                        ? format(new Date(row?.publishedAt), "yyyy-MM-dd")
                        : "--"}
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
    </Stack>
  );
}

export default MedicineStockTable;
