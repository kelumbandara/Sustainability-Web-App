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
import { DrawerContentItem } from "../../components/ViewDataDrawer";
import { useState } from "react";
import theme from "../../theme";
import useIsMobile from "../../customHooks/useIsMobile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import FireExtinguisherIcon from "@mui/icons-material/FireExtinguisher";
import { Accident } from "../../api/accidentAndIncidentApi";
import WarningIcon from "@mui/icons-material/Warning";
import { formatDate } from "date-fns";

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

function ViewAccidentContent({ accident }: { accident: Accident }) {
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
            value={accident.referenceNumber}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Reported Date"
            value={accident.accidentDate.toDateString()}
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
                    General Details
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
                  <WarningIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Accident Details
                  </Typography>
                </Box>
              }
              {...a11yProps(1)}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={activeTab} index={0} dir={theme.direction}>
          <Stack>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Division"
                value={accident.division}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Location"
                value={accident.location}
                sx={{ flex: 1 }}
              />

              <DrawerContentItem
                label="Department"
                value={accident.department}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Supervisor"
                value={accident.supervisorName}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box
              sx={{
                my: "1rem",
                borderTop: "1px solid var(--pallet-lighter-grey)",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", marginY: "0.5rem" }}
              >
                Witness Details
              </Typography>
              <Table aria-label="activity stream table">
                <TableHead
                  sx={{
                    backgroundColor: "var(--pallet-lighter-grey)",
                  }}
                >
                  <TableRow>
                    <TableCell align="center">Employee Id</TableCell>
                    <TableCell align="center">Location</TableCell>
                    <TableCell align="center">Division</TableCell>
                    <TableCell align="center">Department</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accident?.witnesses?.length > 0 ? (
                    accident?.witnesses.map((row) => (
                      <TableRow
                        key={`${row.employeeId}`}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          cursor: "pointer",
                        }}
                      >
                        <TableCell align="center" component="th" scope="row">
                          {row.employeeId}
                        </TableCell>
                        <TableCell align="center">{row.name}</TableCell>
                        <TableCell align="center">{row.division}</TableCell>
                        <TableCell align="center">{row.department}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11} align="center">
                        <Typography variant="body2">
                          No witnesses found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Stack>
        </TabPanel>
        <TabPanel value={activeTab} index={1} dir={theme.direction}>
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", marginY: "0.5rem" }}
          >
            Person Details
          </Typography>
          <Table aria-label="activity stream table">
            <TableHead
              sx={{
                backgroundColor: "var(--pallet-lighter-grey)",
              }}
            >
              <TableRow>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Gender</TableCell>
                <TableCell align="center">Designation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accident?.effectedIndividuals?.length > 0 ? (
                accident?.effectedIndividuals.map((row) => (
                  <TableRow
                    key={`${row.employeeId}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      {row.personType}
                    </TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.gender}</TableCell>
                    <TableCell align="center">{row.designation}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">
                      No effected individuals found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", marginY: "0.5rem" }}
          >
            Accident Details
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <DrawerContentItem
              label="Category"
              value={accident.category}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Sub Category"
              value={accident.subCategory}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Accident Type"
              value={accident.accidentType}
              sx={{ flex: 1 }}
            />
          </Box>
          <Box>
            <DrawerContentItem
              label="Body Primary Region"
              value={accident.affectedPrimaryRegion}
            />
            <DrawerContentItem
              label="Body Secondary Region"
              value={accident.affectedSecondaryRegion}
            />
            <DrawerContentItem
              label="Body Tertiary Region"
              value={accident.affectedTertiaryRegion}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <DrawerContentItem
              label="Type"
              value={accident.accidentType}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Cause"
              value={accident.rootCause}
              sx={{ flex: 1 }}
            />
          </Box>
          <Box>
            <DrawerContentItem
              label="Employee Return of Work"
              value={accident.returnForWork}
            />
            <DrawerContentItem
              label="Description"
              value={accident.description}
              isRichText={true}
            />
            <DrawerContentItem
              label="Action Taken"
              value={accident.actionTaken}
              isRichText={true}
            />
          </Box>
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
        <DrawerContentItem label="Reported By" value={accident.reporter} />
        <DrawerContentItem
          label="Accident Date"
          value={formatDate(accident.accidentDate, "dd/MM/yyyy")}
        />
        <DrawerContentItem
          label="Accident Time"
          value={accident.accidentTime.toLocaleTimeString()}
        />
        <DrawerContentItem label="Injury Type" value={accident.injuryType} />
        <DrawerContentItem label="Severity" value={accident.severity} />
        <DrawerContentItem
          label="Investigation"
          value={accident.investigation}
        />
        <DrawerContentItem
          label="Consulted Hospital"
          value={accident.consultedHospital}
        />
        <DrawerContentItem
          label="Consulted Doctor"
          value={accident.consultedDoctor}
        />
        <DrawerContentItem
          label="Date reported to GOVT/Police"
          value={accident.govReported_date}
        />
        <DrawerContentItem
          label="Date reported to ESI"
          value={accident.esiReported_date}
        />
      </Box>
    </Stack>
  );
}

export default ViewAccidentContent;
