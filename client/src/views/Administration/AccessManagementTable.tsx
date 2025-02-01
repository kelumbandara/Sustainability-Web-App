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
  Button,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import theme from "../../theme";
import Breadcrumb from "../../components/BreadCrumb";
import PageTitle from "../../components/PageTitle";
import { UserRole } from "../../api/userApi";
import { sampleRoles } from "../../api/sampleData/usersSampleData";
import CustomButton from "../../components/CustomButton";
import ViewDataDrawer, { DrawerHeader } from "../../components/ViewDataDrawer";
import AccessManagementDrawerContent from "./AccessManagementDrawerContent";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddOrEditAccessRoleDialog from "./AddOrEditAccessRoleDialog";

function AccessManagementTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [roles, setRoles] = useState<UserRole[]>(sampleRoles);
  const [openAccessManagementViewDrawer, setOpenAccessManagementViewDrawer] =
    useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addOrEditAccessRoleDialogOpen, setAddOrEditAccessRoleDialogOpen] =
    useState(false);

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: "User Management" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

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
        <PageTitle title="User Management" />
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
          <Box
            sx={{
              padding: theme.spacing(2),
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              sx={{ backgroundColor: "var(--pallet-blue)" }}
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedRole(null);
                setAddOrEditAccessRoleDialogOpen(true);
              }}
            >
              Create New Role
            </Button>
          </Box>
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="left">Description</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles?.length > 0 ? (
                roles.map((row) => (
                  <TableRow
                    key={`${row.id}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                    <TableCell align="center">
                      <CustomButton
                        variant="contained"
                        sx={{
                          backgroundColor: "var(--pallet-blue)",
                        }}
                        size="medium"
                        onClick={() => {
                          setSelectedRole(row);
                          setOpenAccessManagementViewDrawer(true);
                        }}
                        startIcon={<VisibilityIcon />}
                      >
                        View Role Access
                      </CustomButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">No roles found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
      <ViewDataDrawer
        open={openAccessManagementViewDrawer}
        handleClose={() => setOpenAccessManagementViewDrawer(false)}
        fullScreen={true}
        drawerContent={
          <Stack spacing={1} sx={{ paddingX: theme.spacing(1) }}>
            <DrawerHeader
              title="Role Access Management"
              handleClose={() => setOpenAccessManagementViewDrawer(false)}
              onEdit={() => {
                setSelectedRole(selectedRole);
                setAddOrEditAccessRoleDialogOpen(true);
              }}
              onDelete={() => setDeleteDialogOpen(true)}
            />
            {selectedRole && (
              <AccessManagementDrawerContent selectedRole={selectedRole} />
            )}
          </Stack>
        }
      />

      {addOrEditAccessRoleDialogOpen && (
        <AddOrEditAccessRoleDialog
          open={addOrEditAccessRoleDialogOpen}
          handleClose={() => setAddOrEditAccessRoleDialogOpen(false)}
          onSubmit={(data) => {
            if (selectedRole) {
              console.log("Updating document", data);
              setRoles(
                roles.map((role) => (role.id === data.id ? data : role))
              ); // Update the role in the list if it already exists
              enqueueSnackbar("Details Updated Successfully!", {
                variant: "success",
              });
            } else {
              setRoles([...roles, data]); // Add new role to the list
              enqueueSnackbar("Hazard/Risk Created Successfully!", {
                variant: "success",
              });
            }
            setSelectedRole(null);
            setOpenAccessManagementViewDrawer(false);
            setAddOrEditAccessRoleDialogOpen(false);
          }}
          defaultValues={selectedRole}
        />
      )}

      {deleteDialogOpen && (
        <DeleteConfirmationModal
          open={deleteDialogOpen}
          title="Remove Role Confirmation"
          content={
            <>
              Are you sure you want to remove this role?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            console.log(roles.filter((doc) => doc.id !== selectedRole.id));
            setRoles(roles.filter((doc) => doc.id !== selectedRole.id));
          }}
          onSuccess={() => {
            setOpenAccessManagementViewDrawer(false);
            setSelectedRole(null);
            setDeleteDialogOpen(false);
            enqueueSnackbar("Role Deleted Successfully!", {
              variant: "success",
            });
          }}
          handleReject={() => {
            setOpenAccessManagementViewDrawer(false);
            setSelectedRole(null);
            setDeleteDialogOpen(false);
          }}
        />
      )}
    </Stack>
  );
}

export default AccessManagementTable;
