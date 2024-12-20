import { Box } from "@mui/material";
import { Document } from "../../api/documentApi";
import { DrawerContentItem } from "../../components/ViewDataDrawer";

function ViewDocumentContent({ document }: { document: Document }) {
  return (
    <Box>
      <DrawerContentItem
        label="Document Number"
        value={document.documentNumber}
      />
      <DrawerContentItem
        label="Version Number"
        value={document.versionNumber}
      />
      <DrawerContentItem label="Document Type" value={document.documentType} />
      <DrawerContentItem label="Title" value={document.title} />
      <DrawerContentItem label="Division" value={document.division} />
      <DrawerContentItem
        label="Issuing Authority"
        value={document.issuingAuthority}
      />
      <DrawerContentItem
        label="Document Owner"
        value={document.documentOwner}
      />
      <DrawerContentItem
        label="Document Reviewer"
        value={document.documentReviewer}
      />
      <DrawerContentItem
        label="Physical Location"
        value={document.physicalLocation}
      />
      <DrawerContentItem label="Remarks" value={document.remarks} />
      <DrawerContentItem
        label="Issued Date"
        value={document.issuedDate.toDateString()}
      />
      <DrawerContentItem
        label="Is No Expiry"
        value={document.isNoExpiry.toString()}
      />
      <DrawerContentItem
        label="Expiry Date"
        value={document.expiryDate?.toDateString()}
      />
      <DrawerContentItem
        label="Notify Date"
        value={document.notifyDate?.toDateString()}
      />
    </Box>
  );
}

export default ViewDocumentContent;
