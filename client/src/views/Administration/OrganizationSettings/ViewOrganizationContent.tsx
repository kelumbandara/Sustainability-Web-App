import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { DrawerContentItem } from "../../../components/ViewDataDrawer";
import { HazardAndRisk } from "../../../api/hazardRiskApi";
import { differenceInDays, format } from "date-fns";
import { useState } from "react";
import theme from "../../../theme";
import useIsMobile from "../../../customHooks/useIsMobile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import FireExtinguisherIcon from "@mui/icons-material/FireExtinguisher";
import { FileItemsViewer } from "../../../components/FileItemsViewer";
import { StorageFile } from "../../../utils/StorageFiles.util";
import { Organization } from "../../../api/OrganizationSettings/organizationSettingsApi";
import ProfileImage from "../../../components/ProfileImageComponent";
import CustomButton from "../../../components/CustomButton";
import { enqueueSnackbar } from "notistack";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { Controller } from "react-hook-form";
import RichTextComponent from "../../../components/RichTextComponent";

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

function ViewOrganizationContent({
  organizationSettings,
}: {
  organizationSettings: Organization;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const { isTablet } = useIsMobile();

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
                  <FireExtinguisherIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Insight View
                  </Typography>
                </Box>
              }
              {...a11yProps(1)}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={activeTab} index={0} dir={theme.direction}>
          <Stack gap={3} mt={3}>
            <Box sx={{ position: "relative" }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <IconButton
                    onClick={async () => {
                      const file = organizationSettings.logoUrl?.[0];

                      if (file && "imageUrl" in file && file.imageUrl) {
                        try {
                          const response = await fetch(file.imageUrl);
                          const blob = await response.blob();
                          const url = URL.createObjectURL(blob);

                          const link = document.createElement("a");
                          link.href = url;
                          link.download = file.fileName || "logo.png";
                          link.click();

                          URL.revokeObjectURL(url);
                        } catch (error) {
                          enqueueSnackbar("Failed To Download Image", {
                            variant: "error",
                          });
                        }
                      } else {
                        alert("No image available to download.");
                      }
                    }}
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "50%",
                      ":hover": {
                        backgroundColor: "white",
                      },
                    }}
                  >
                    <DownloadOutlinedIcon
                      fontSize="medium"
                      sx={{ color: "var(--pallet-blue)" }}
                    />
                  </IconButton>
                }
              >
                <ProfileImage
                  name={organizationSettings?.organizationName}
                  files={organizationSettings.logoUrl}
                  size="20rem"
                />
              </Badge>
            </Box>

            <Box>
              <DrawerContentItem
                label="Organization Name"
                value={organizationSettings.organizationName}
              />
            </Box>

            <Box>
              <Typography
                variant="caption"
                sx={{ paddingBottom: 0, color: "var(--pallet-grey)" }}
              >
                Color Pallet
              </Typography>

              {organizationSettings.colorPallet.map((palette, index) => (
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
          <Box
            component="img"
            src={
              (organizationSettings.insightImage[0] as { imageUrl?: string })
                ?.imageUrl ?? ""
            }
            alt="Under Development"
            sx={{
              height: "auto",
              width: "60vw",
              maxHeight: "50vh",
              objectFit: "contain",
              justifySelf: "center",
              alignSelf: "center",
            }}
          />

          <DrawerContentItem
            label="Insight View Description"
            value={organizationSettings.insightDescription}
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
          label="Organization Name"
          value={organizationSettings.organizationName}
        />

        <DrawerContentItem
          label="Started Date"
          value={
            organizationSettings.created_at
              ? format(new Date(organizationSettings.created_at), "yyyy-MM-dd")
              : "N/A"
          }
          sx={{ flex: 1 }}
        />
      </Box>
    </Stack>
  );
}

export default ViewOrganizationContent;
