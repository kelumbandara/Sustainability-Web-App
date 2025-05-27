import { Box, Chip, colors, Stack, Typography } from "@mui/material";
import useIsMobile from "../../../customHooks/useIsMobile";
import { DrawerContentItem } from "../../../components/ViewDataDrawer";
import { format } from "date-fns";
import { RenderExternalAuditStatusChip } from "../ExternalAudit/AuditTable";
import { RenderInternalAuditStatusChip } from "../InternalAudit/InternalAuditTable";

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
        {selectedAudit?.audit?.type === "internal" && (
          <>
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
              value={selectedAudit.audit?.auditee?.name}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Description"
              value={selectedAudit.audit?.audit?.description}
              sx={{ flex: 1 }}
            />
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                paddingY: "0.3rem",
                paddingX: "0.5rem",
                minWidth: "8rem",
              }}
            >
              <Typography
                variant="caption"
                sx={{ paddingBottom: "0.2rem", color: "var(--pallet-grey)" }}
              >
                Status
              </Typography>
              <Box>
                {RenderInternalAuditStatusChip(selectedAudit.audit.status) ??
                  "--"}
              </Box>
            </Box>
          </>
        )}
        {selectedAudit?.audit?.type === "external" && (
          <>
            <DrawerContentItem
              label="Audit Type"
              value={selectedAudit.audit?.auditType}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Audit Category"
              value={selectedAudit.audit?.auditCategory}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Audit Firm"
              value={selectedAudit.audit?.auditFirm}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Audit Date"
              value={
                selectedAudit.audit?.auditDate
                  ? format(
                      new Date(selectedAudit.audit.auditDate),
                      "dd/MM/yyyy"
                    )
                  : "--"
              }
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Audit Customer"
              value={selectedAudit.audit?.customer}
              sx={{ flex: 1 }}
            />
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                paddingY: "0.3rem",
                paddingX: "0.5rem",
                minWidth: "8rem",
              }}
            >
              <Typography
                variant="caption"
                sx={{ paddingBottom: 0, color: "var(--pallet-grey)" }}
              >
                Status
              </Typography>
              <Box>
                {RenderExternalAuditStatusChip(selectedAudit.audit?.status) ??
                  "--"}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Stack>
  );
}

export default ViewAuditContent;
