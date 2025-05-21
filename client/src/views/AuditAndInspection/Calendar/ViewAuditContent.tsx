import { Box, Stack } from "@mui/material";
import useIsMobile from "../../../customHooks/useIsMobile";
import { DrawerContentItem } from "../../../components/ViewDataDrawer";

function ViewAuditContent() {
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
          label="Audit Name"
          value={"Audit Name Data"}
          sx={{ flex: 1 }}
        />
      </Box>
    </Stack>
  );
}

export default ViewAuditContent;
