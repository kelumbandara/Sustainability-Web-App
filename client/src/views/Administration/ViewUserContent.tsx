import { Avatar, Box, Stack, Typography } from "@mui/material";
import { DrawerContentItem } from "../../components/ViewDataDrawer";
import useIsMobile from "../../customHooks/useIsMobile";
import { User } from "../../api/userApi";

function ViewUserContent({ selectedUser }: { selectedUser: User }) {
  const { isTablet } = useIsMobile();
  return (
    <Stack
      sx={{
        display: "flex",
        marginY: 4,
        flexDirection: isTablet ? "column" : "row",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "var(--pallet-light-blue)",
            height: "12rem",
            width: "12rem",
            display: "flex",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: "6rem",
              color: "#fff",
            }}
          >
            {selectedUser?.name?.charAt(0).toUpperCase()}
          </Typography>
        </Avatar>
        <Typography
          variant="h4"
          sx={{
            fontSize: "1.5rem",
            color: "var(--pallet-dark-blue)",
            marginTop: 2,
          }}
        >
          {selectedUser?.name}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          flex: 1,
        }}
      >
        <DrawerContentItem
          label="Id"
          value={selectedUser?.id}
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
          value={selectedUser?.userType?.userType}
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
