import { Box, Stack } from "@mui/material";
import { DrawerContentItem } from "../../components/ViewDataDrawer";
import useIsMobile from "../../customHooks/useIsMobile";
import { User } from "../../api/userApi";

function ViewUserContent({ selectedUser }: { selectedUser: User }) {
  const { isTablet } = useIsMobile();
  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: isTablet ? "column" : "row",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
        }}
      >
        <DrawerContentItem
          label="Id"
          value={selectedUser?.id}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Name"
          value={selectedUser?.name}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Email"
          value={selectedUser?.email}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Mobile Number"
          value={selectedUser?.mobile}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Role"
          value={selectedUser?.role}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Department"
          value={selectedUser?.department}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Status"
          value={selectedUser?.status}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Job Position"
          value={selectedUser?.jobPosition}
          sx={{ flex: 1 }}
        />
      </Box>
    </Stack>
  );
}

export default ViewUserContent;
