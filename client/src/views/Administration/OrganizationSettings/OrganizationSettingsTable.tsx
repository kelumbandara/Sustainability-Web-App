import theme from "../../../theme";
import PageTitle from "../../../components/PageTitle";
import Breadcrumb from "../../../components/BreadCrumb";
import { useSnackbar } from "notistack";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../../state/queryClient";
import ViewOrganizationContent from "./ViewOrganizationContent";
import {
  getOrganization,
  updateOrganization,
} from "../../../api/OrganizationSettings/organizationSettingsApi";
import { useMemo, useState } from "react";
import EditOrganizationDialog from "./EditOrganizationDialog";
import { DrawerHeader } from "../../../components/ViewDataDrawer";
import { Box, Stack } from "@mui/material";

function OrganizationSettings() {
  const { enqueueSnackbar } = useSnackbar();

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: "Organization Settings" },
  ];

  const { data: organizationData } = useQuery({
    queryKey: ["organization"],
    queryFn: getOrganization,
  });

  const firstOrganization = useMemo(() => {
    return organizationData ? organizationData[0] : [];
  }, [organizationData]);

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
        <ViewOrganizationContent organizationSettings={firstOrganization} />
      </Stack>
    </Stack>
  );
}

export default OrganizationSettings;
