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
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { MaternityRegister } from "../../../api/OccupationalHealth/maternityRegisterApi";
import useIsMobile from "../../../customHooks/useIsMobile";
import { DrawerContentItem } from "../../../components/ViewDataDrawer";
import theme from "../../../theme";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { format } from "date-fns";

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

function ViewMaternityRegisterContent({
  maternityRegister,
}: {
  maternityRegister: MaternityRegister;
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
            label="Employee ID"
            value={maternityRegister.employeeId}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Created Date"
            value={new Date(maternityRegister?.createdDate).toDateString()}
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
                  <AccountBoxIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Employee Information
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
                  <DescriptionIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Maternity Leave Application
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
                    Benefit and Entitlements
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
                  <AssignmentReturnIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Return to Work Plan
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
                  <MedicalServicesIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Medical Documentation
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
            <Box sx={{ flex: 1, flexDirection: isTablet ? "column" : "row" }}>
              <DrawerContentItem
                label="Employee Id"
                value={maternityRegister.employeeId}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Name"
                value={maternityRegister.employeeName}
                sx={{ flex: 1 }}
              />

              <DrawerContentItem
                label="Age"
                value={maternityRegister.age}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box sx={{ flex: 1, flexDirection: isTablet ? "column" : "row" }}>
              <DrawerContentItem
                label="Contact Number"
                value={maternityRegister.contactNumber}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Designation"
                value={maternityRegister.designation}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Department"
                value={maternityRegister.department}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box sx={{ flex: 1, flexDirection: isTablet ? "column" : "row" }}>
              <DrawerContentItem
                label="Supervisor/Manager"
                value={maternityRegister.supervisorOrManager}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Date of Join"
                value={format(maternityRegister.dateOfJoin, "dd/MM/yyyy")}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Average Wages"
                value={maternityRegister.averageWages}
                sx={{ flex: 1 }}
              />
            </Box>
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
            <Box sx={{ flex: 1, flexDirection: isTablet ? "column" : "row" }}>
              <DrawerContentItem
                label="Application ID"
                value={maternityRegister.applicationId}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Application Date"
                value={format(maternityRegister.applicationDate, "dd/MM/yyyy")}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Expected Delivery Date"
                value={format(maternityRegister.expectedDeliveryDate, "dd/MM/yyyy")} 
                sx={{ flex: 1 }}
              />
            </Box>
            <Box sx={{ flex: 1, flexDirection: isTablet ? "column" : "row" }}>
              <DrawerContentItem
                label="Leave Start Date"
                value={format(maternityRegister.leaveStartDate, "dd/MM/yyyy")}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Leave End Date"
                value={format(maternityRegister.leaveEndDate, "dd/MM/yyyy")}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Actual Delivery Date"
                value={format(maternityRegister.actualDeliveryDate, "dd/MM/yyyy")}
                sx={{ flex: 1 }}
              />
            </Box>
            <DrawerContentItem
              label="Leave Status"
              value={maternityRegister.leaveStatus}
              sx={{ flex: 1 }}
            />
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={2} dir={theme.direction}>
          <Table aria-label="activity stream table">
            <TableHead
              sx={{
                backgroundColor: "var(--pallet-lighter-grey)",
              }}
            >
              <TableRow>
                <TableCell align="center">Benefit Type</TableCell>
                <TableCell align="center">Amount/Value</TableCell>
                <TableCell align="center">Total Days Paid</TableCell>
                <TableCell align="center">Beneficiary Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {maternityRegister?.benefitsAndEntitlements?.length > 0 ? (
                maternityRegister?.benefitsAndEntitlements?.map((row) => (
                  <TableRow
                    key={`${row.id}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      {row.benefitType}
                    </TableCell>
                    <TableCell align="center">{row.amountValue}</TableCell>
                    <TableCell align="center">{row.totalDaysPaid}</TableCell>
                    <TableCell align="center">{row.beneficiaryAddress}</TableCell>
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
              label="Notice Date After Delivery"
              value={format(maternityRegister.noticeDateAfterDelivery, "dd/MM/yyyy")} //maternityRegister.noticeDateAfterDelivery?.toDateString()}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Rejoining Date"
              value={new Date(maternityRegister.reJoinDate).toDateString()}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Support Provided"
              value={maternityRegister.supportProvider}
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
                <TableCell align="center">Document Type</TableCell>
                <TableCell align="center">Upload Date</TableCell>
                <TableCell align="center">Document</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {maternityRegister?.medicalDocuments?.length > 0 ? (
                maternityRegister?.medicalDocuments?.map((row) => (
                  <TableRow
                    key={`${row.id}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      {row.documentType}
                    </TableCell>
                    <TableCell align="center">
                      {row.uploadDate?.toDateString()}
                    </TableCell>
                    <TableCell align="center">{row.document}</TableCell>
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
          label="Division"
          value={maternityRegister.division}
        />
        <DrawerContentItem label="Remarks" value={maternityRegister.remarks} />
      </Box>
    </Stack>
  );
}

export default ViewMaternityRegisterContent;
