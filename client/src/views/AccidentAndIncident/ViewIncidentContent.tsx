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
import { Incident } from "../../api/accidentAndIncidentApi";
import WarningIcon from "@mui/icons-material/Warning";
import { format, formatDate } from "date-fns";

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

function ViewIncidentContent({ incident }: { incident: Incident }) {
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
            value={incident.referenceNumber}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Reported Date"
            value={format(incident.incidentDate, "yyyy-MM-dd")}
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
                    Incident Details
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
                value={incident.division}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Location"
                value={incident.location}
                sx={{ flex: 1 }}
              />

              <DrawerContentItem
                label="Circumstances"
                value={incident.circumstances}
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
                  {incident?.witnesses?.length > 0 ? (
                    incident?.witnesses.map((row) => (
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
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <DrawerContentItem
              label="Type of Near Miss"
              value={incident.typeOfNearMiss}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Type of Concern"
              value={incident.typeOfConcern}
              sx={{ flex: 1 }}
            />

            <DrawerContentItem
              label="Factors"
              value={incident.factors}
              sx={{ flex: 1 }}
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
              label="Causes"
              value={incident.causes}
              sx={{ flex: 1 }}
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
              label="Incident Details"
              value={incident.incidentDetails}
              sx={{ flex: 1 }}
              isRichText={true}
            />
          </Box>
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
              {incident?.effectedIndividuals?.length > 0 ? (
                incident?.effectedIndividuals.map((row) => (
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
        <DrawerContentItem label="Reported By" value={incident.reporter} />
        <DrawerContentItem
          label="Incident Date"
          value={formatDate(incident.incidentDate, "dd/MM/yyyy")}
        />
        <DrawerContentItem
          label="Incident Time"
          value={format(incident.incidentTime, "HH-mm")}
        />
        <DrawerContentItem label="Severity" value={incident.severity} />
      </Box>
    </Stack>
  );
}

export default ViewIncidentContent;
