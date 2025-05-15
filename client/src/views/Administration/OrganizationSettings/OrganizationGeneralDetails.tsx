import { Stack, Box, Badge, IconButton, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import CustomButton from "../../../components/CustomButton";
import { DrawerContentItem } from "../../../components/ViewDataDrawer";
import {
  ColorPallet,
  ColorPalletSchema,
  Organization,
  updateOrganization,
} from "../../../api/OrganizationSettings/organizationSettingsApi";
import useIsMobile from "../../../customHooks/useIsMobile";
import { hasSignedUrl } from "./orgUtils";
import EditOrganizationDialog from "./EditOrganizationDialog";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation } from "@tanstack/react-query";
import queryClient from "../../../state/queryClient";
import { useSnackbar } from "notistack";

function OrganizationGeneralDetails({
  organizationSettings,
}: {
  organizationSettings: Organization;
}) {
  const { isTablet } = useIsMobile();
  const { enqueueSnackbar } = useSnackbar();
  const [openEditOrganizationDialog, setOpenEditOrganizationDialog] =
    useState(false);

  const parsedColorPallet = useMemo<ColorPallet[]>(() => {
    if (!organizationSettings?.colorPallet) return [];
    if (typeof organizationSettings.colorPallet === "string") {
      try {
        const palletArrayString = JSON.parse(organizationSettings.colorPallet);
        const palletArray = Array.isArray(palletArrayString)
          ? palletArrayString
          : [palletArrayString];

        return palletArray
          .map((pallet) => {
            const parsed =
              typeof pallet === "string" ? JSON.parse(pallet) : pallet;
            const result = ColorPalletSchema.safeParse(parsed);
            return result.success ? result.data : null;
          })
          .filter((pallet): pallet is ColorPallet => pallet !== null);
      } catch (error) {
        console.error("Error parsing color pallet:", error);
        return [];
      }
    }
    return organizationSettings.colorPallet
      .map((pallet) => {
        const result = ColorPalletSchema.safeParse(pallet);
        return result.success ? result.data : null;
      })
      .filter((pallet): pallet is ColorPallet => pallet !== null);
  }, [organizationSettings]);

  const logo = Array.isArray(organizationSettings.logoUrl)
    ? organizationSettings.logoUrl[0]
    : organizationSettings.logoUrl;

  return (
    <Stack
      gap={3}
      mt={3}
      sx={{
        display: "flex",
        flexDirection: isTablet ? "column" : "row",
        justifyContent: "space-between",
      }}
    >
      {hasSignedUrl(logo) && (
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <IconButton
                sx={{
                  backgroundColor: "var(--pallet-light-blue)",
                  borderRadius: "50%",
                }}
              >
                <DownloadOutlinedIcon
                  fontSize="medium"
                  sx={{
                    color: "#fff",
                  }}
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
                borderRadius: "50%",
                objectFit: "contain",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                padding: "1rem",
              }}
            />
          </Badge>
        </Box>
      )}

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <CustomButton
            variant="contained"
            sx={{
              backgroundColor: "var(--pallet-blue)",
            }}
            size="medium"
            startIcon={<EditIcon />}
            onClick={() => setOpenEditOrganizationDialog(true)}
          >
            Edit General Details
          </CustomButton>
        </Box>
        <DrawerContentItem
          label="Organization Name"
          value={organizationSettings?.organizationName}
        />
        <Box m={"0.5rem"}>
          <Box
            sx={{
              marginBottom: "0.4rem",
            }}
          >
            <Typography variant="caption" sx={{ color: "var(--pallet-grey)" }}>
              Color Pallet
            </Typography>
          </Box>

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
      </Box>
      {openEditOrganizationDialog && (
        <EditOrganizationDialog
          open={openEditOrganizationDialog}
          handleClose={() => setOpenEditOrganizationDialog(false)}
          defaultValues={organizationSettings}
        />
      )}
    </Stack>
  );
}

export default OrganizationGeneralDetails;
