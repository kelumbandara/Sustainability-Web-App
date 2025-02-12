import { AppBar, Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import useIsMobile from "../../../customHooks/useIsMobile";
import { DrawerContentItem } from "../../../components/ViewDataDrawer";
import theme from "../../../theme";
import { Patient } from "../../../api/OccupationalHealth/patientApi";
import { format } from "date-fns";
import MedicationIcon from "@mui/icons-material/Medication";

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

function ViewPatientContent({ patient }: { patient: Patient }) {
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
            label="Patient ID"
            value={patient.id}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Check in Date & Time"
            value={format(patient.checkInDate, "dd/MM/yyyy hh:mm a")}
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
                    Patient Details
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
                  <MedicationIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Doctor Consultation
                  </Typography>
                </Box>
              }
              {...a11yProps(1)}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={activeTab} index={0} dir={theme.direction}>
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isTablet ? "column" : "row",
                justifyContent: "space-between",
              }}
            >
              <DrawerContentItem
                label="Employee ID"
                value={patient.employeeId}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Employee Name"
                value={patient.employeeName}
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
                label="Gender"
                value={patient.gender}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Age"
                value={patient.age}
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
                label="Designation"
                value={patient.designation}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Employee Division"
                value={patient.division}
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
                label="Department"
                value={patient.department}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Sub Department"
                value={patient.subDepartment}
                sx={{ flex: 1 }}
              />
            </Box>
            <DrawerContentItem
              label="Work Status"
              value={patient.workStatus}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Symptoms"
              value={patient.symptoms}
              isRichText={true}
              sx={{ flex: 1 }}
            />
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={1} dir={theme.direction}>
          <DrawerContentItem
            label="Disease"
            value={patient.disease}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Severity Level"
            value={patient.severityLevel}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Treatment"
            value={patient.treatment}
            sx={{ flex: 1 }}
            isRichText={true}
          />
          <DrawerContentItem
            label="Required Follow Up"
            value={patient.followUpStatus ? "Yes" : "No"}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Refer to Another Hospital"
            value={patient.referToAnotherHospital ? "Yes" : "No"}
            sx={{ flex: 1 }}
          />
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
        <DrawerContentItem label="Created By" value={patient.createdBy} />
        <DrawerContentItem
          label="Consulting Doctor"
          // value={
          //   patient.consulting_doctor?.first_name +
          //   " " +
          //   patient.consulting_doctor?.last_name
          // }
          value={patient.consultingDoctor}
        />
        <Typography variant="body1" sx={{ marginTop: "1rem" }}>
          Preliminary Checkup
        </Typography>
        <DrawerContentItem
          label="Body Temperature"
          value={patient.bodyTemperature + " °C"}
        />
        <DrawerContentItem label="Weight" value={patient.weight + " kg"} />
        <DrawerContentItem label="Height" value={patient.height + " cm"} />
        <DrawerContentItem
          label="Blood Pressure"
          value={patient.bloodPressure + " mmHg"}
        />
        <DrawerContentItem
          label="Random Blood Sugar"
          value={patient.randomBloodSugar + " mg/dL"}
        />
        <DrawerContentItem
          label="Clinical Division"
          value={patient.clinicDivision}
        />
        <DrawerContentItem
          label="Body Mass Index (BMI)"
          value={patient.weight / (patient.height / 100) ** 2}
        />
      </Box>
    </Stack>
  );
}

export default ViewPatientContent;
