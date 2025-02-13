import {
  AppBar,
  Box,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { MedicineInventory } from "../../../../api/OccupationalHealth/medicineInventoryApi";
import useIsMobile from "../../../../customHooks/useIsMobile";
import { DrawerContentItem } from "../../../../components/ViewDataDrawer";
import theme from "../../../../theme";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ApartmentIcon from "@mui/icons-material/Apartment";
import DeleteIcon from "@mui/icons-material/Delete";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function ViewPurchaseAndInventoryContent({
  purchaseAndInventory,
}: {
  purchaseAndInventory: MedicineInventory;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const { isTablet } = useIsMobile();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log("event", event);
    setActiveTab(newValue);
  };
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
            value={purchaseAndInventory.referenceNumber}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Reported Date"
            value={new Date(purchaseAndInventory?.requestedDate).toDateString()}
            sx={{ flex: 1 }}
          />
        </Box>
        <AppBar position="static">
          <Tabs
            value={activeTab}
            onChange={handleChange}
            indicatorColor="secondary"
            TabIndicatorProps={{
              style: { backgroundColor: "var(--pallet-blue)", height: "3px" },
            }}
            sx={{
              backgroundColor: "var(--pallet-lighter-grey)",
              color: "var(--pallet-blue)",
              width: "100%",
            }}
            textColor="inherit"
            variant="scrollable"
            scrollButtons={true}
          >
            <Tab
              label={
                <Box
                  sx={{
                    color: "var(--pallet-blue)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <TextSnippetIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Medicine Details
                  </Typography>
                </Box>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Box
                  sx={{
                    color: "var(--pallet-blue)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LocalShippingIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Supplier Details
                  </Typography>
                </Box>
              }
              {...a11yProps(1)}
            />
            <Tab
              label={
                <Box
                  sx={{
                    color: "var(--pallet-blue)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ReceiptLongIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Purchase Details
                  </Typography>
                </Box>
              }
              {...a11yProps(2)}
            />
            <Tab
              label={
                <Box
                  sx={{
                    color: "var(--pallet-blue)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ApartmentIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Storage & Usage
                  </Typography>
                </Box>
              }
              {...a11yProps(3)}
            />
            <Tab
              label={
                <Box
                  sx={{
                    color: "var(--pallet-blue)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <DeleteIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Disposals
                  </Typography>
                </Box>
              }
              {...a11yProps(4)}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={activeTab} index={0} dir={theme.direction}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <DrawerContentItem
              label="Medicine Name"
              value={purchaseAndInventory.medicineName}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Generic Name"
              value={purchaseAndInventory.genericName}
              sx={{ flex: 1 }}
            />

            <DrawerContentItem
              label="Dosage Strength"
              value={purchaseAndInventory.dosageStrength}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Form"
              value={purchaseAndInventory.form}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Medicine Type"
              value={purchaseAndInventory.medicineType}
              sx={{ flex: 1 }}
            />
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={1} dir={theme.direction}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <DrawerContentItem
              label="Supplier Name"
              value={purchaseAndInventory.supplierName}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Contact Number"
              value={purchaseAndInventory.supplierContactNumber}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Email ID"
              value={purchaseAndInventory.supplierEmail}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Type"
              value={purchaseAndInventory.supplierType}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Location/Country"
              value={purchaseAndInventory.location}
              sx={{ flex: 1 }}
            />
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={2} dir={theme.direction}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <DrawerContentItem
              label="Manufacturing Date"
              value={new Date(
                purchaseAndInventory.manufacturingDate
              ).toDateString()}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Expiry Date"
              value={new Date(purchaseAndInventory.expiryDate).toDateString()}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Delivery Date"
              value={new Date(
                purchaseAndInventory.deliveryDate
              ).toDateString()}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Delivered Quantity"
              value={new Date(
                purchaseAndInventory.deliveryQuantity
              ).toDateString()}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Delivered Unit"
              value={purchaseAndInventory.deliveryUnit}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Purchased Amount"
              value={purchaseAndInventory.purchaseAmount}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Threshold Limit"
              value={purchaseAndInventory.thresholdLimit}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Invoice Date"
              value={new Date(purchaseAndInventory.invoiceDate).toDateString()}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Manufacturer Name"
              value={purchaseAndInventory.manufacturerName}
              sx={{ flex: 1 }}
            />
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={3} dir={theme.direction}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <DrawerContentItem
              label="Batch Number"
              value={purchaseAndInventory.batchNumber}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Reader Threshold"
              value={new Date(purchaseAndInventory.expiryDate).toDateString()}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Usage Instructions"
              value={purchaseAndInventory.usageInstruction}
              sx={{ flex: 1 }}
            />
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={4} dir={theme.direction}>
          <Table aria-label="activity stream table">
            <TableHead
              sx={{
                backgroundColor: "var(--pallet-lighter-grey)",
              }}
            >
              <TableRow>
                <TableCell align="center">Disposal Date</TableCell>
                <TableCell align="center">Available Quantity</TableCell>
                <TableCell align="center">Disposed Quantity</TableCell>
                <TableCell align="center">Contractor</TableCell>
                <TableCell align="center">Cost</TableCell>
                <TableCell align="center">Balance Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchaseAndInventory?.medicineDisposals?.length > 0 ? (
                purchaseAndInventory?.medicineDisposals.map((row) => (
                  <TableRow
                    key={`${row.id}${row.disposalDate}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      {row.disposalDate}
                    </TableCell>
                    <TableCell align="center">
                      {row.disposalQuantity}
                    </TableCell>
                    <TableCell align="center">
                      {row.disposalQuantity}
                    </TableCell>
                    <TableCell align="center">{row.contractor}</TableCell>
                    <TableCell align="center">{row.cost}</TableCell>
                    <TableCell align="center">{row.balanceQuantity}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">No Disposals found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabPanel>
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
          label="Requested By"
          value={purchaseAndInventory.requestedBy}
        />
        <DrawerContentItem
          label="Approved By"
          value={purchaseAndInventory.approvedBy}
        />
        <DrawerContentItem
          label="Division"
          value={purchaseAndInventory.division}
        />
      </Box>
    </Stack>
  );
}

export default ViewPurchaseAndInventoryContent;
