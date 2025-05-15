import { Box, Button, Stack, Theme, useMediaQuery } from "@mui/material";
import theme from "../../../theme";
import PageTitle from "../../../components/PageTitle";
import Breadcrumb from "../../../components/BreadCrumb";
import { useSnackbar } from "notistack";
import { updateUserType } from "../../../api/userApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../../state/queryClient";
import ViewOrganizationContent from "./ViewOrganizationContent";
import {
  getOrganization,
  updateOrganization,
} from "../../../api/OrganizationSettings/organizationSettingsApi";
import { useMemo, useState } from "react";
import EditOrganizationDialog from "./EditOrganizationDialog";
import { error } from "console";
import CustomButton from "../../../components/CustomButton";
import { DrawerHeader } from "../../../components/ViewDataDrawer";

function OrganizationSettings() {
  const { enqueueSnackbar } = useSnackbar();

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: "Organization Settings" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: organizationData } = useQuery({
    queryKey: ["organization"],
    queryFn: getOrganization,
  });

  const firstOrganization = useMemo(() => {
    return organizationData ? organizationData[0] : [];
  }, [organizationData]);

  const [openEditOrganizationDialog, setOpenEditOrganizationDialog] =
    useState(false);

  console.log("org", firstOrganization);

  const { mutate: updateOrganizationMutation, isPending } = useMutation({
    mutationFn: updateOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization"] });
      enqueueSnackbar("Organization Updated Successfully!", {
        variant: "success",
      });
      setOpenEditOrganizationDialog(false); // Close the dialog on success
    },
    onError: (error) => {
      enqueueSnackbar(`Error updating organization: ${error.message}`, {
        variant: "error",
      });
    },
  });
  const handleEditClick = () => {
    setOpenEditOrganizationDialog(true);
  };

  return (
    <Stack>
      <Box
        sx={{
          padding: theme.spacing(2),
          boxShadow: 2,
          marginY: 2,
          borderRadius: 1,
          overflowX: "hidden",
        }}
      >
        <PageTitle title="Organization Settings" />
        <Breadcrumb breadcrumbs={breadcrumbItems} />
      </Box>

      <Stack>
        <DrawerHeader
          title="Organization Details"
          handleClose={() => {}}
          disableEdit={false}
          onEdit={() => {
            handleEditClick();
          }}
        />
        <ViewOrganizationContent organizationSettings={firstOrganization} />
      </Stack>

      {openEditOrganizationDialog && (
        <EditOrganizationDialog
          open={openEditOrganizationDialog}
          handleClose={() => setOpenEditOrganizationDialog(false)}
          onSubmit={(data) => {
            updateOrganizationMutation(data);
          }}
          defaultValues={firstOrganization}
        />
      )}
    </Stack>
  );
}

export default OrganizationSettings;
