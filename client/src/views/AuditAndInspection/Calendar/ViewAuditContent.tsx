import { Box, Chip, colors, Stack } from "@mui/material";
import useIsMobile from "../../../customHooks/useIsMobile";
import { DrawerContentItem } from "../../../components/ViewDataDrawer";
import { AuditEvents } from "../../../api/calendarApi";

function ViewAuditContent({ selectedAudit }) {
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
        <Box>
          {selectedAudit?.audit?.type === "internal" ? (
            <Chip
              label="Internal Audit"
              sx={{
                color: "var(--pallet-orange)",
                backgroundColor: colors.orange[50],
              }}
            />
          ) : (
            <Chip
              label="External Audit"
              sx={{
                color: "var(--pallet-blue)",
                backgroundColor: colors.blue[50],
              }}
            />
          )}
        </Box>
        <DrawerContentItem
          label="Reference Id"
          value={selectedAudit.title}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Audit Title"
          value={selectedAudit.audit?.audit?.name}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Audit Date"
          value={selectedAudit.audit?.Date}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Auditee"
          value={selectedAudit.auditee?.name}
          sx={{ flex: 1 }}
        />
      </Box>
    </Stack>
  );
}

export default ViewAuditContent;
