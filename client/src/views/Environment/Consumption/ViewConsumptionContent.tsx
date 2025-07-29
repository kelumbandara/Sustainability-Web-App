import {
  Alert,
  Box,
  CircularProgress,
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
import {
  approveConsumptinReport,
  Environment,
  Status,
} from "../../../api/Environment/environmentApi";
import useCurrentUser from "../../../hooks/useCurrentUser";
import CustomButton from "../../../components/CustomButton";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import queryClient from "../../../state/queryClient";
import { enqueueSnackbar } from "notistack";
import ApproveConfirmationModal from "../../OccupationalHealth/MedicineInventory/MedicineRequest/ApproveConfirmationModal";

function ViewConsumptionContent({
  consumption,
  handleCloseDrawer,
}: {
  consumption: Environment;
  handleCloseDrawer: () => void;
}) {
  const { isTablet } = useIsMobile();
  const { user } = useCurrentUser();
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);

  const {
    mutate: approveConsumptionMutation,
    isPending: isConsumptionApproving,
  } = useMutation({
    mutationFn: approveConsumptinReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consumptionRecords"] });
      queryClient.invalidateQueries({
        queryKey: ["assigned-consumptionRecords"],
      });
      queryClient.invalidateQueries({ queryKey: ["consumption-approved"] });
      enqueueSnackbar("Consumption Report Approved Successfully!", {
        variant: "success",
      });
      setApproveDialogOpen(false);
      handleCloseDrawer();
    },
    onError: () => {
      enqueueSnackbar(`Consumption Report Approval Failed`, {
        variant: "error",
      });
    },
  });

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
        {consumption.status === Status.DRAFT &&
          user.userLevel.id === 5 &&
          consumption.reviewer.id === user.id && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: "1rem",
                objectFit: "contain",
              }}
            >
              <CustomButton
                variant="contained"
                sx={{
                  backgroundColor: "var(--pallet-blue)",
                  marginTop: "1rem",
                  marginX: "0.5rem",
                }}
                size="medium"
                disabled={isConsumptionApproving}
                endIcon={
                  isConsumptionApproving ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
                onClick={() => setApproveDialogOpen(true)}
              >
                Approve Consumption Report
              </CustomButton>
            </Box>
          )}
      </Box>
      {approveDialogOpen && (
        <ApproveConfirmationModal
          open={approveDialogOpen}
          title="Approve Consumption Report Confirmation"
          content={
            <>
              Are you sure you want to approve this Consumption Report?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setApproveDialogOpen(false)}
          approveFunc={async () => {
            await approveConsumptionMutation(consumption.id);
          }}
          onSuccess={() => {}}
          handleReject={() => {}}
        />
      )}
    </Stack>
  );
}

export default ViewConsumptionContent;
