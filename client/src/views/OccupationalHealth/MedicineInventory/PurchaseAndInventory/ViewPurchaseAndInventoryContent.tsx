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
            value={purchaseAndInventory.reference_number}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Reported Date"
            value={new Date(purchaseAndInventory?.request_date).toDateString()}
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
              value={purchaseAndInventory.medicine_name}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Generic Name"
              value={purchaseAndInventory.generic_name}
              sx={{ flex: 1 }}
            />

            <DrawerContentItem
              label="Dosage Strength"
              value={purchaseAndInventory.dosage_strength}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Form"
              value={purchaseAndInventory.form}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Medicine Type"
              value={purchaseAndInventory.medicine_type}
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
              value={purchaseAndInventory.supplier_name}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Contact Number"
              value={purchaseAndInventory.supplier_contact_number}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Email ID"
              value={purchaseAndInventory.supplier_email_id}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Type"
              value={purchaseAndInventory.supplier_type}
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
                purchaseAndInventory.manufacturing_date
              ).toDateString()}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Expiry Date"
              value={new Date(purchaseAndInventory.expiry_date).toDateString()}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Delivery Date"
              value={new Date(
                purchaseAndInventory.delivery_date
              ).toDateString()}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Delivered Quantity"
              value={new Date(
                purchaseAndInventory.delivered_quantity
              ).toDateString()}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Delivered Unit"
              value={purchaseAndInventory.delivered_unit}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Purchased Amount"
              value={purchaseAndInventory.purchased_amount}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Threshold Limit"
              value={purchaseAndInventory.threshold_limit}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Invoice Date"
              value={new Date(purchaseAndInventory.invoice_date).toDateString()}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Manufacturer Name"
              value={purchaseAndInventory.manufacturer_name}
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
              value={purchaseAndInventory.batch_number}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Reader Threshold"
              value={new Date(purchaseAndInventory.expiry_date).toDateString()}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Usage Instructions"
              value={purchaseAndInventory.usage_instructions}
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
              {purchaseAndInventory?.medicine_disposals?.length > 0 ? (
                purchaseAndInventory?.medicine_disposals.map((row) => (
                  <TableRow
                    key={`${row.id}${row.disposal_date}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      {row.disposal_date}
                    </TableCell>
                    <TableCell align="center">
                      {row.availability_quantity}
                    </TableCell>
                    <TableCell align="center">
                      {row.disposed_quantity}
                    </TableCell>
                    <TableCell align="center">{row.contractor}</TableCell>
                    <TableCell align="center">{row.cost}</TableCell>
                    <TableCell align="center">{row.balance_quantity}</TableCell>
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
          value={purchaseAndInventory.requested_by}
        />
        <DrawerContentItem
          label="Approved By"
          value={purchaseAndInventory.approved_by}
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
