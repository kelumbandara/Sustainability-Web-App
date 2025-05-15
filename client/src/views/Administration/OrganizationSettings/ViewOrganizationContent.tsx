import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { DrawerContentItem } from "../../../components/ViewDataDrawer";
import { useMemo, useState } from "react";
import theme from "../../../theme";
import useIsMobile from "../../../customHooks/useIsMobile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import StairsOutlinedIcon from "@mui/icons-material/StairsOutlined";

import { ColorPallet, ColorPalletSchema, Organization } from "../../../api/OrganizationSettings/organizationSettingsApi";

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

// Type guard for objects with signedUrl
const hasSignedUrl = (file: unknown): file is { signedUrl: string } => {
  return (
    typeof file === "object" &&
    file !== null &&
    "signedUrl" in file &&
    typeof (file as any).signedUrl === "string"
  );
};

function ViewOrganizationContent({
  organizationSettings,
}: {
  organizationSettings: Organization;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const { isTablet } = useIsMobile();

  const parsedColorPallet = useMemo<ColorPallet[]>(() => {
    if (!organizationSettings?.colorPallet) return [];
    if (typeof organizationSettings.colorPallet === 'string') {
      try {
        const palletArrayString = JSON.parse(organizationSettings.colorPallet);
        const palletArray = Array.isArray(palletArrayString) ? palletArrayString : [palletArrayString];
        
        return palletArray.map(pallet => {
          const parsed = typeof pallet === 'string' ? JSON.parse(pallet) : pallet;
          const result = ColorPalletSchema.safeParse(parsed);
          return result.success ? result.data : null;
        }).filter((pallet): pallet is ColorPallet => pallet !== null);
      } catch (error) {
        console.error("Error parsing color pallet:", error);
        return [];
      }
    }
    return organizationSettings.colorPallet.map(pallet => {
      const result = ColorPalletSchema.safeParse(pallet);
      return result.success ? result.data : null;
    }).filter((pallet): pallet is ColorPallet => pallet !== null);
  }, [organizationSettings]);
  
  console.log(parsedColorPallet);

  const logo = Array.isArray(organizationSettings.logoUrl)
    ? organizationSettings.logoUrl[0]
    : organizationSettings.logoUrl;

  const insightImage = Array.isArray(organizationSettings.insightImage)
    ? organizationSettings.insightImage[0]
    : organizationSettings.insightImage;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
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
                  <HomeOutlinedIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Insight View
                  </Typography>
                </Box>
              }
              {...a11yProps(1)}
            />
            {/* <Tab
              label={
                <Box
                  sx={{
                    color: "var(--pallet-blue)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <WarehouseOutlinedIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Departments
                  </Typography>
                </Box>
              }
              {...a11yProps(2)}
            /> */}
            {/* <Tab
              label={
                <Box
                  sx={{
                    color: "var(--pallet-blue)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <StairsOutlinedIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    User Level
                  </Typography>
                </Box>
              }
              {...a11yProps(3)}
            /> */}
          </Tabs>
        </AppBar>
        <TabPanel value={activeTab} index={0} dir={theme.direction}>
          <Stack gap={3} mt={3}>
            {hasSignedUrl(logo) && (
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <IconButton>
                      <DownloadOutlinedIcon
                        fontSize="medium"
                        sx={{ color: "var(--pallet-blue)" }}
                      />
                    </IconButton>
                  }
                >
                  <img
                    src={logo.signedUrl}
                    alt="Organization Logo"
                    style={{
                      width: 300,
                      height: 300,
                      border: "1px solid #ccc",
                    }}
                  />
                </Badge>
              </Box>
            )}

            <Box>
              <DrawerContentItem
                label="Organization Name"
                value={organizationSettings?.organizationName}
              />
            </Box>
            <Box
              m={"0.5rem"}
            >
              <Typography
                variant="caption"
                sx={{ paddingBottom: 0, color: "var(--pallet-grey)" }}
              >
                Color Pallet
              </Typography>

              {parsedColorPallet?.map((palette, index) => (
                <Box key={index} display="flex" flexDirection="column" gap={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      width={20}
                      height={20}
                      borderRadius="50%"
                      bgcolor={palette.primaryColor}
                      border="1px solid #ccc"
                    />
                    <Typography variant="body2">Primary Color</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      width={20}
                      height={20}
                      borderRadius="50%"
                      bgcolor={palette.secondaryColor}
                      border="1px solid #ccc"
                    />
                    <Typography variant="body2">Secondary Color</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      width={20}
                      height={20}
                      borderRadius="50%"
                      bgcolor={palette.buttonColor}
                      border="1px solid #ccc"
                    />
                    <Typography variant="body2">Button Color</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Stack>
        </TabPanel>
        <TabPanel value={activeTab} index={1} dir={theme.direction}>
          <Stack gap={2}>
            <DrawerContentItem
              label="Insight View Description"
              value={organizationSettings?.insightDescription}
            />
            {hasSignedUrl(insightImage) && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={insightImage.signedUrl}
                  alt="Insight View"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 300,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />
              </Box>
            )}
          </Stack>
        </TabPanel>
        <TabPanel value={activeTab} index={2} dir={theme.direction}>
          <Stack gap={2}>
            <DrawerContentItem
              label="Insight View Description"
              value={organizationSettings?.organizationName}
            />
          </Stack>
        </TabPanel>
        <TabPanel value={activeTab} index={3} dir={theme.direction}>
          <Stack gap={2}>
            <DrawerContentItem
              label="Insight View Description"
              value={organizationSettings?.organizationName}
            />
          </Stack>
        </TabPanel>
      </Box>
    </Stack>
  );
}

export default ViewOrganizationContent;
