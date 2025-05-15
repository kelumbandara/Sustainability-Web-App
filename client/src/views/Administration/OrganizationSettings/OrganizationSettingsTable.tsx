import { Box, Stack, Theme, useMediaQuery } from "@mui/material";
import theme from "../../../theme";
import PageTitle from "../../../components/PageTitle";
import Breadcrumb from "../../../components/BreadCrumb";
import { useSnackbar } from "notistack";
import { updateUserType } from "../../../api/userApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../../state/queryClient";
import ViewOrganizationContent from "./ViewOrganizationContent";
import { getOrganization } from "../../../api/OrganizationSettings/organizationSettingsApi";

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

  const { mutate: updateUserRoleMutation, isPending } = useMutation({
    mutationFn: updateUserType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      enqueueSnackbar("User Role Updated Successfully!", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar(`User Role Update Failed`, {
        variant: "error",
      });
    },
  });

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
        <ViewOrganizationContent organizationSettings={organizationData} />
      </Stack>

      {/* {openEditOrganizationDialog && (
        <EditOrganizationDialog
          open={openEditOrganizationDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenEditOrganizationDialog(false);
          }}
          onSubmit={(data) => {
            updateUserRoleMutation(data);
          }}
          defaultValues={selectedRow}
        />
      )} */}
    </Stack>
  );
}

export default OrganizationSettings;
