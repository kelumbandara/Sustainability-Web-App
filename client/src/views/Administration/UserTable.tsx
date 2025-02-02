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
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import { useState } from "react";
import ViewDataDrawer, { DrawerHeader } from "../../components/ViewDataDrawer";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";
import { User } from "../../api/userApi";
import { sampleUsers } from "../../api/sampleData/usersSampleData";
import ViewUserContent from "./ViewUserContent";
import EditUserRoleDialog from "./EditUserRoleDialog";
import { defaultViewerPermissions, PermissionKeys } from "./SectionList";

function UserTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<User>(null);
  const [openEditUserRoleDialog, setOpenEditUserRoleDialog] = useState(false);
  const [userData, setUserData] = useState<User[]>(sampleUsers);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const userPermissionObject = defaultViewerPermissions;

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: "Users" },
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
        <PageTitle title="Users" />
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
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="right">Job Position</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData?.length > 0 ? (
                userData?.map((row) => (
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
                    <TableCell align="left">{row.id}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="center">{row.email}</TableCell>
                    <TableCell align="center">{row.role}</TableCell>
                    <TableCell align="right">{row.jobPosition}</TableCell>
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
        fullScreen={false}
        drawerContent={
          <Stack spacing={1} sx={{ paddingX: theme.spacing(1) }}>
            <DrawerHeader
              title="User Details"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={
                userPermissionObject[PermissionKeys.ADMIN_USERS_EDIT]
                  ? () => {
                      setSelectedRow(selectedRow);
                      setOpenEditUserRoleDialog(true);
                    }
                  : undefined
              }
              onDelete={
                userPermissionObject[PermissionKeys.ADMIN_USERS_DELETE]
                  ? () => setDeleteDialogOpen(true)
                  : undefined
              }
            />

            {selectedRow && (
              <Stack>
                <ViewUserContent selectedUser={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openEditUserRoleDialog && (
        <EditUserRoleDialog
          open={openEditUserRoleDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenEditUserRoleDialog(false);
          }}
          onSubmit={(data) => {
            if (selectedRow) {
              setUserData(
                userData.map((user) => (user.id === data.id ? data : user))
              ); // Update the user in the list if it already exists
              enqueueSnackbar("User Details Updated Successfully!", {
                variant: "success",
              });
            } else {
              setUserData([...userData, data]); // Add new document to the list
              enqueueSnackbar("User Created Successfully!", {
                variant: "success",
              });
            }
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenEditUserRoleDialog(false);
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
          deleteFunc={async () => {
            setUserData(userData.filter((doc) => doc.id !== selectedRow.id));
          }}
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

export default UserTable;
