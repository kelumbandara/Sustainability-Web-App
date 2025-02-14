import { Box, Stack } from "@mui/material";
import { format } from "date-fns";
import { MedicineRequest } from "../../../../api/medicineRequestApi";
import useIsMobile from "../../../../customHooks/useIsMobile";
import { DrawerContentItem } from "../../../../components/ViewDataDrawer";

function ViewMedicineRequestContent({
  medicalRequest,
}: {
  medicalRequest: MedicineRequest;
}) {
  const { isTablet } = useIsMobile();
  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: isTablet ? "column" : "row",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
        }}
      >
        <DrawerContentItem
          label="Reference Number"
          value={medicalRequest?.referenceNumber}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Requested Date"
          value={
            medicalRequest.created_at
              ? format(medicalRequest.created_at, "dd/MM/yyyy hh:mm a")
              : "--"
          }
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Medicine Name"
          value={medicalRequest?.medicineName}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Generic Name"
          value={medicalRequest?.genericName}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Division"
          value={medicalRequest?.division}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Approver"
          value={medicalRequest?.approver}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Status"
          value={medicalRequest?.status}
          sx={{ flex: 1 }}
        />
      </Box>
    </Stack>
  );
}

export default ViewMedicineRequestContent;
