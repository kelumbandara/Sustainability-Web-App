import { Box, Divider, Stack } from "@mui/material";
import { format } from "date-fns";
import useIsMobile from "../../customHooks/useIsMobile";
import { ChemicalRequest } from "../../api/ChemicalManagement/ChemicalRequestApi";
import { DrawerContentItem } from "../../components/ViewDataDrawer";

function ViewChemicalRequestContent({
  chemicalRequest,
}: {
  chemicalRequest: ChemicalRequest;
}) {
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
            label="Reference Number"
            value={chemicalRequest.reference_number}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Request Created Date"
            value={format(chemicalRequest.request_date, "dd/MM/yyyy hh:mm a")}
            sx={{ flex: 1 }}
          />
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: isTablet ? "column" : "row",
            justifyContent: "space-between",
          }}
        >
          <DrawerContentItem
            label="Commercial Name"
            value={chemicalRequest.commercial_name}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Substance Name"
            value={chemicalRequest.substance_name}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Molecular Formula"
            value={chemicalRequest.formula}
            sx={{ flex: 1 }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: isTablet ? "column" : "row",
            justifyContent: "space-between",
          }}
        >
          <DrawerContentItem
            label="Requested Quantity"
            value={chemicalRequest.requested_quantity}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Requested Unit"
            value={chemicalRequest.requested_unit}
            sx={{ flex: 1 }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: isTablet ? "column" : "row",
            justifyContent: "space-between",
          }}
        >
          <DrawerContentItem
            label="Reach Registration Number"
            value={chemicalRequest.reach_registration_number}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Category"
            value={chemicalRequest.category}
            sx={{ flex: 1 }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: isTablet ? "column" : "row",
            justifyContent: "space-between",
          }}
        >
          <DrawerContentItem
            label="ZDHC Use Category"
            value={chemicalRequest.ZDHC_use_category}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Chemical Form Type"
            value={chemicalRequest.chemical_form_type}
            sx={{ flex: 1 }}
          />
        </Box>
        <DrawerContentItem
          label="Where and Why it is used"
          value={chemicalRequest.usage}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Product Standard"
          value={chemicalRequest.product_standard}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="MSDS/SDS have or not"
          value={chemicalRequest.msds_sds ? "Yes" : "No"}
          sx={{ flex: 1 }}
        />
        {chemicalRequest.msds_sds && (
          <Box
            sx={{
              display: "flex",
              flexDirection: isTablet ? "column" : "row",
              justifyContent: "space-between",
            }}
          >
            <DrawerContentItem
              label="MSDS/SDS Issued Date"
              value={chemicalRequest.msds_sds_issued_date?.toDateString()}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="MSDS/SDS Expiry Date"
              value={chemicalRequest.msds_sds_expiry_date?.toDateString()}
              sx={{ flex: 1 }}
            />
          </Box>
        )}
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
        <DrawerContentItem label="Reviewer" value={chemicalRequest.reviewer} />
        <DrawerContentItem label="Approver" value={chemicalRequest.approver} />
        <DrawerContentItem
          label="Requested Date"
          value={
            chemicalRequest?.request_date
              ? chemicalRequest?.request_date?.toDateString()
              : "--"
          }
        />
        <DrawerContentItem
          label="Approval Valid Date"
          value={
            chemicalRequest?.approval_valid_date
              ? chemicalRequest.approval_valid_date?.toDateString()
              : "--"
          }
        />
        <DrawerContentItem label="Division" value={chemicalRequest.division} />
        <DrawerContentItem
          label="Requested Customer"
          value={chemicalRequest.requested_customer}
        />
        <DrawerContentItem
          label="Requested Merchandiser"
          value={chemicalRequest.requested_merchandiser}
        />
      </Box>
    </Stack>
  );
}

export default ViewChemicalRequestContent;
