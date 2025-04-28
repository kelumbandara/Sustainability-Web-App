import {
  Box,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { DrawerContentItem } from "../../../components/ViewDataDrawer";
import { format } from "date-fns";
import useIsMobile from "../../../customHooks/useIsMobile";
import { Environment } from "../../../api/Environment/environmentApi";

function ViewConsumptionContent({ consumption }: { consumption: Environment }) {
  const { isTablet } = useIsMobile();

  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: isTablet ? "column" : "row",
        padding: "1rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          flex: { lg: 3, md: 1 },
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          padding: "0.5rem",
          borderRadius: "0.3rem",
        }}
      >
        <Box
          sx={{
            p: "0.5rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <DrawerContentItem
            label="Reference"
            value={consumption?.referenceNumber}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Reported Date"
            value={
              consumption.created_at
                ? format(new Date(consumption.created_at), "yyyy-MM-dd")
                : "N/A"
            }
            sx={{ flex: 1 }}
          />
        </Box>
        <Divider />
        <DrawerContentItem
          label="Total Workforce"
          value={consumption?.totalWorkForce}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Number of Days Worked"
          value={consumption?.numberOfDaysWorked}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Area in Square Meter (m2)"
          value={consumption?.area}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Total product produced/shipped (Pcs)"
          value={consumption?.totalProductProducedPcs}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Total product produced/shipped (Kg)"
          value={consumption?.totalProductProducedKg}
          sx={{ flex: 1 }}
        />
        <Table aria-label="activity stream table">
          <TableHead
            sx={{
              backgroundColor: "var(--pallet-lighter-grey)",
            }}
          >
            <TableRow>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Source</TableCell>
              <TableCell align="center">Unit</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Amount</TableCell>
              <TableCell align="center">GHG in Tonnes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consumption?.impactConsumption?.length > 0 ? (
              consumption?.impactConsumption?.map((row) => (
                <TableRow
                  key={`${row.consumptionId}`}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                  }}
                >
                  <TableCell align="center" component="th" scope="row">
                    {row.category}
                  </TableCell>
                  <TableCell align="center">{row.source}</TableCell>
                  <TableCell align="center">{row.unit}</TableCell>
                  <TableCell align="center">{row.quantity}</TableCell>
                  <TableCell align="center">{row.amount}</TableCell>
                  <TableCell align="center">{row.ghgInTonnes}</TableCell>
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
        </Table>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { lg: 1, md: 1 },
          flexDirection: "column",
          backgroundColor: "#fff",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          padding: "1rem",
          borderRadius: "0.3rem",
          marginY: isTablet ? "0.5rem" : 0,
          marginLeft: isTablet ? 0 : "0.5rem",
          height: "fit-content",
        }}
      >
        <DrawerContentItem
          label="Reported By"
          value={consumption.createdByUserName}
        />
        <DrawerContentItem
          label="Division"
          value={consumption?.division}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Year"
          value={consumption?.year}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Month"
          value={consumption?.month}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Reviewer"
          value={consumption?.reviewer.name}
          sx={{ flex: 1 }}
        />
      </Box>
    </Stack>
  );
}

export default ViewConsumptionContent;
