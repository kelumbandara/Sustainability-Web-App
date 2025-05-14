import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Alert,
  Box,
  Chip,
  LinearProgress,
  Stack,
  TableFooter,
  TablePagination,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import theme from "../../../theme";
import PageTitle from "../../../components/PageTitle";
import Breadcrumb from "../../../components/BreadCrumb";
import { useMemo, useState } from "react";
import ViewDataDrawer, { DrawerHeader } from "../../../components/ViewDataDrawer";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";
import { fetchAllUsers, updateUserType, User } from "../../../api/userApi";
import ViewUserContent from "../ViewUserContent";
import { PermissionKeys } from "../SectionList";
import useCurrentUserHaveAccess from "../../../hooks/useCurrentUserHaveAccess";
import { useMutation, useQuery } from "@tanstack/react-query";
import { green, grey } from "@mui/material/colors";
import queryClient from "../../../state/queryClient";
import { sampleOrganization } from "../../../api/sampleData/usersSampleData";
import ProfileImage from "../../../components/ProfileImageComponent";
import { Organization } from "../../../api/OrganizationSettings/organizationSettingsApi";
import ViewOrganizationContent from "./ViewOrganizationContent";
import EditOrganizationDialog from "./EditOrganizationDialog";

function organizationSettings() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Organization>(null);
  const [openEditOrganizationDialog, setOpenEditOrganizationDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: "Organization Settings" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  )

  const { mutate: updateUserRoleMutation, isPending } = useMutation({
    mutationFn: updateUserType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setOpenEditOrganizationDialog(false);
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
      <Stack sx={{ alignItems: "center" }}>
        <TableContainer
          component={Paper}
          elevation={2}
          sx={{
            overflowX: "auto",
            maxWidth: isMobile ? "88vw" : "100%",
          }}
        >
          {/* {isUserDataFetching && <LinearProgress sx={{ width: "100%" }} />} */}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell align="left">Logo</TableCell>
                <TableCell align="left">Organization</TableCell>
                <TableCell align="left">Color Pallet</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleOrganization?.length > 0 ? (
                sampleOrganization?.map((row) => (
                  <TableRow
                    key={`${row.id}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedRow(row);
                      setOpenViewDrawer(true);
                    }}
                  >
                    <TableCell align="left">
                      <ProfileImage
                        name={row?.organizationName}
                        files={row.logoUrl}
                        size="3.5rem"
                      />
                    </TableCell>
                    <TableCell align="left">{row.organizationName}</TableCell>
                    <TableCell align="left">
                      {row.colorPallet.map((palette, index) => (
                        <Box
                          key={index}
                          display="flex"
                          flexDirection="column"
                          gap={1}
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box
                              width={20}
                              height={20}
                              borderRadius="50%"
                              bgcolor={palette.primaryColor}
                              border="1px solid #ccc"
                            />
                            <Typography variant="body2">
                              Primary Color
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box
                              width={20}
                              height={20}
                              borderRadius="50%"
                              bgcolor={palette.secondaryColor}
                              border="1px solid #ccc"
                            />
                            <Typography variant="body2">
                              Secondary Color
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box
                              width={20}
                              height={20}
                              borderRadius="50%"
                              bgcolor={palette.buttonColor}
                              border="1px solid #ccc"
                            />
                            <Typography variant="body2">
                              Button Color
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">No Users found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
      <ViewDataDrawer
        open={openViewDrawer}
        handleClose={() => setOpenViewDrawer(false)}
        fullScreen={true}
        drawerContent={
          <Stack spacing={1} sx={{ paddingX: theme.spacing(1) }}>
            <DrawerHeader
              title="User Details"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenEditOrganizationDialog(true);
              }}
              disableEdit={
                !useCurrentUserHaveAccess(PermissionKeys.ADMIN_USERS_EDIT)
              }
            />

            {selectedRow && (
              <Stack>
                <ViewOrganizationContent organizationSettings={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openEditOrganizationDialog && (
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
      )}
      {deleteDialogOpen && (
        <DeleteConfirmationModal
          open={deleteDialogOpen}
          title="Remove User Confirmation"
          content={
            <>
              Are you sure you want to remove this user?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {}}
          onSuccess={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
            enqueueSnackbar("User Deleted Successfully!", {
              variant: "success",
            });
          }}
          handleReject={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
          }}
        />
      )}
    </Stack>
  );
}

export default organizationSettings;
