import { AppBar, Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { DrawerContentItem } from "../../../components/ViewDataDrawer";
import { useState } from "react";
import theme from "../../../theme";
import useIsMobile from "../../../customHooks/useIsMobile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { format } from "date-fns";
import { FileItemsViewer } from "../../../components/FileItemsViewer";
import { StorageFile } from "../../../utils/StorageFiles.util";
import { TargetSettings } from "../../../api/TargetSettings/targetSettingsApi";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AdsClickIcon from "@mui/icons-material/AdsClick";
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

function ViewTargetSettingsContent({
  targetSettings,
}: {
  targetSettings: TargetSettings;
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
            value={targetSettings.id}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Reported Date"
            value={format(targetSettings.created_at, "yyyy-MM-dd")}
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
                  <DateRangeIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Improvements Details
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
                  <AdsClickIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Target Settings
                  </Typography>
                </Box>
              }
              {...a11yProps(2)}
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
                value={targetSettings.division}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Department"
                value={targetSettings.department}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Category"
                value={targetSettings.category}
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
                label="Source"
                value={targetSettings.source}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="Baseline Consumption"
                value={targetSettings.baselineConsumption}
                sx={{ flex: 1 }}
              />
              <DrawerContentItem
                label="GHC Emission"
                value={targetSettings.ghgEmission}
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
                label="Findings or Problems"
                value={targetSettings.problem}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box>
              <FileItemsViewer
                label="Evidence"
                files={targetSettings.documents as StorageFile[]}
                sx={{ marginY: "1rem" }}
              />
            </Box>
          </Stack>
        </TabPanel>
        <TabPanel value={activeTab} index={1} dir={theme.direction}>
          <DrawerContentItem
            label="Action"
            value={targetSettings.action}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Possibility Category"
            value={targetSettings.possibilityCategory}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Opportunity"
            value={targetSettings.opportunity}
            sx={{ flex: 1 }}
          />
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
              label="Implementation Cost"
              value={targetSettings.implementationCost}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Expected Savings"
              value={targetSettings.expectedSavings}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Target GHC Reduction"
              value={targetSettings.targetGHGReduction}
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
              label="Cost Saving"
              value={targetSettings.costSavings}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Payback Period"
              value={targetSettings.paybackPeriod}
              sx={{ flex: 1 }}
            />
            <DrawerContentItem
              label="Project Lifespan"
              value={targetSettings.projectLifespan}
              sx={{ flex: 1 }}
            />
          </Box>
          <DrawerContentItem
            label="Project TimeLine"
            value={format(targetSettings.implementationTime, "yyyy-MM-dd")}
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
        <DrawerContentItem
          label="Responsible"
          value={targetSettings.responsible?.name}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Approver"
          value={targetSettings.approver?.name}
          sx={{ flex: 1 }}
        />
      </Box>
    </Stack>
  );
}

export default ViewTargetSettingsContent;
