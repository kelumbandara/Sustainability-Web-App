import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  IconButton,
  Typography,
  AppBar,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import {
  Organization,
  ColorPallet,
  ColorPalletSchema,
} from "../../../api/OrganizationSettings/organizationSettingsApi";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import { ChromePicker } from "react-color";
import theme from "../../../theme";
import RichTextComponent from "../../../components/RichTextComponent";
import useIsMobile from "../../../customHooks/useIsMobile";
import DropzoneComponent from "../../../components/DropzoneComponent";
import { StorageFile } from "../../../utils/StorageFiles.util";
import { ExistingFileItemsEdit } from "../../../components/ExistingFileItemsEdit";
import ImagePreview from "../../../components/OrganizationImagePreview";
import OrganizationSettings from "./OrganizationSettingsTable";
import CustomButton from "../../../components/CustomButton";
import SingleImagePreview from "../../../components/SingleImagePreview";

interface Props {
  open: boolean;
  handleClose: () => void;
  onSubmit: (data: Organization) => void;
  defaultValues: Organization;
}

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

const EditOrganizationDialog = ({
  open,
  handleClose,
  onSubmit,
  defaultValues,
}: Props) => {
  const initialColors: ColorPallet[] = defaultValues.colorPallet?.length
    ? defaultValues.colorPallet
    : [
        {
          palletId: 1,
          primaryColor: "#000000",
          secondaryColor: "#ffffff",
          buttonColor: "#0000ff",
        },
      ];
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Organization>({
    defaultValues: {
      logoUrl: [],
      // insightImage: [],
      ...defaultValues,
    },
    reValidateMode: "onChange",
    mode: "onChange",
  });
  const resetForm = () => {
    reset();
    setFiles([]);
  };
  const parsedColorPallet = useMemo<ColorPallet[]>(() => {
    if (!defaultValues?.colorPallet) return [];

    // Default empty palette if nothing exists
    const defaultPalette: ColorPallet = {
      palletId: 0,
      primaryColor: "#000000",
      secondaryColor: "#ffffff",
      buttonColor: "#0000ff",
    };

    try {
      if (typeof defaultValues.colorPallet === "string") {
        const palletArrayString = JSON.parse(defaultValues.colorPallet);
        const palletArray = Array.isArray(palletArrayString)
          ? palletArrayString
          : [palletArrayString];

        const result = palletArray
          .map((pallet) => {
            const parsed =
              typeof pallet === "string" ? JSON.parse(pallet) : pallet;
            return ColorPalletSchema.safeParse(parsed);
          })
          .filter((result) => result.success)
          .map((result) => result.data);

        return result.length > 0 ? result : [defaultPalette];
      }

      // Handle already parsed array case
      const result = defaultValues.colorPallet
        .map((pallet) => ColorPalletSchema.safeParse(pallet))
        .filter((result) => result.success)
        .map((result) => result.data);

      return result.length > 0 ? result : [defaultPalette];
    } catch (error) {
      console.error("Error parsing color pallet:", error);
      return [defaultPalette];
    }
  }, [defaultValues]);

  const [formData, setFormData] = useState<Organization>(() => ({
    ...defaultValues,
    colorPallet:
      parsedColorPallet.length > 0
        ? parsedColorPallet
        : [
            {
              palletId: 0,
              primaryColor: "#000000",
              secondaryColor: "#ffffff",
              buttonColor: "#0000ff",
            },
          ],
  }));

  useEffect(() => {
    setFormData((prev) => ({
      ...defaultValues,
      colorPallet:
        parsedColorPallet.length > 0 ? parsedColorPallet : prev.colorPallet,
    }));
  }, [defaultValues, parsedColorPallet]);

  const handleSubmitOrganization = (data: Organization) => {
    const submitData: Organization = {
      ...data,
      logoUrl: logoUrls ? [logoUrls[0]] : [],
      insightImage: insightUrl ? [insightUrl[0]] : [],
      colorPallet: formData.colorPallet,
      id: defaultValues.id,
    };

    console.log("logo", logoUrls);
    onSubmit(submitData);
    resetForm();
  };

  const handleColorChange = (
    index: number,
    field: keyof ColorPallet,
    value: string
  ) => {
    setFormData((prev) => {
      const newColorPallet = [...prev.colorPallet];
      newColorPallet[index] = {
        ...newColorPallet[index],
        [field]: value,
      };
      return {
        ...prev,
        colorPallet: newColorPallet,
      };
    });
  };

  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  const { isMobile, isTablet } = useIsMobile();
  const [files, setFiles] = useState<File[]>([]);

  const [logoUrls, setLogoUrls] = useState<(StorageFile | File)[]>(() => {
    const logos = defaultValues.logoUrl;
    if (Array.isArray(logos)) return logos;
    if (logos) return [logos];
    return [];
  });

  const [insightUrl, setInsightUrl] = useState<(StorageFile | File)[]>(() => {
    const insight = defaultValues.insightImage;
    if (Array.isArray(insight)) return insight;
    if (insight) return [insight];
    return [];
  });

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      <DialogTitle
        sx={{
          paddingY: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" component="div">
          {defaultValues ? "Edit an Organization" : "Create an Organization"}
        </Typography>
        <IconButton
          onClick={handleClose}
          edge="start"
          sx={{ color: "#024271" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
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
                  {/* <TextSnippetIcon fontSize="small" /> */}
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
                  {/* <HomeOutlinedIcon fontSize="small" /> */}
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
          <Stack
            display="flex"
            justifyContent="center"
            alignItems="center"
            alignContent="center"
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              alignContent="center"
            >
              <ImagePreview
                image={logoUrls}
                onRemove={(fileToRemove) => {
                  setLogoUrls((prev) =>
                    prev.filter(
                      (file) =>
                        !(
                          (file instanceof File && file === fileToRemove) ||
                          ("gsutil_uri" in file &&
                            file.gsutil_uri ===
                              (fileToRemove as any).gsutil_uri) ||
                          ("fileName" in file &&
                            file.fileName === (fileToRemove as any).fileName)
                        )
                    )
                  );
                }}
              />
            </Box>
            <CustomButton variant="outlined" component="label" sx={{ mt: 2 }}>
              Change Logo Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    setLogoUrls([files[0]]);
                  }
                }}
              />
            </CustomButton>
          </Stack>

          <Stack m={4}>
            <TextField
              required
              id="organizationName"
              label="Organization Name"
              error={!!errors.organizationName}
              helperText={errors.organizationName && "Required"}
              size="small"
              sx={{ flex: 1 }}
              {...register("organizationName", { required: true })}
            />

            <Box mt={4}>
              {formData.colorPallet.map((palette, index) => (
                <div key={`palette-${index}`}>
                  {" "}
                  {/* Added proper key */}
                  <Typography
                    variant="caption"
                    sx={{ paddingBottom: 0, color: "var(--pallet-grey)" }}
                  >
                    Color Palette
                  </Typography>
                  <Stack
                    mt={1}
                    gap={6}
                    flexDirection={isMobile ? "column" : "row"}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography>Primary Color</Typography>
                      <ChromePicker
                        color={palette.primaryColor}
                        onChangeComplete={(color) =>
                          handleColorChange(index, "primaryColor", color.hex)
                        }
                        disableAlpha // Optional: if you don't need alpha channel
                      />
                    </Box>

                    <Box>
                      <Typography>Secondary Color</Typography>
                      <ChromePicker
                        color={palette.secondaryColor}
                        onChangeComplete={(color) =>
                          handleColorChange(index, "secondaryColor", color.hex)
                        }
                        disableAlpha
                      />
                    </Box>

                    <Box>
                      <Typography>Button Color</Typography>
                      <ChromePicker
                        color={palette.buttonColor}
                        onChangeComplete={(color) =>
                          handleColorChange(index, "buttonColor", color.hex)
                        }
                        disableAlpha
                      />
                    </Box>
                  </Stack>
                </div>
              ))}
            </Box>
          </Stack>
        </TabPanel>
        <TabPanel value={activeTab} index={1} dir={theme.direction}>
          <Stack
            display="flex"
            justifyContent="center"
            alignItems="center"
            alignContent="center"
          >
            <Box>
              <SingleImagePreview
                image={insightUrl}
                onRemove={(fileToRemove) => {
                  setInsightUrl((prev) =>
                    prev.filter(
                      (file) =>
                        !(
                          (file instanceof File && file === fileToRemove) ||
                          ("gsutil_uri" in file &&
                            file.gsutil_uri ===
                              (fileToRemove as any).gsutil_uri) ||
                          ("fileName" in file &&
                            file.fileName === (fileToRemove as any).fileName)
                        )
                    )
                  );
                }}
              />
            </Box>
            <CustomButton variant="outlined" component="label" sx={{ mt: 2 }}>
              Change Insight Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    setInsightUrl([files[0]]);
                  }
                }}
              />
            </CustomButton>
          </Stack>
          <Stack>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                margin: "0.5rem",
              }}
            >
              <Controller
                control={control}
                name={"insightDescription"}
                render={({ field }) => {
                  return (
                    <RichTextComponent
                      onChange={(e) => field.onChange(e)}
                      placeholder={field.value ?? "insightDescription"}
                    />
                  );
                }}
              />
            </Box>
          </Stack>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit((data) => {
            handleSubmitOrganization(data);
          })}
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditOrganizationDialog;
