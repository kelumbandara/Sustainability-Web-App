import {
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { DrawerContentItem } from "../../components/ViewDataDrawer";
import useIsMobile from "../../customHooks/useIsMobile";
import { updateUserProfileImage, User } from "../../api/userApi";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import { enqueueSnackbar } from "notistack";
import {
  DrawerProfileHeader,
  DrawerUpdateButtons,
} from "../../components/ViewProfileDataDrawer";
import UpdateUserProfile from "./UpdateUserProfileDialog";
import useCurrentUser from "../../hooks/useCurrentUser";
import { StorageFile } from "../../utils/StorageFiles.util";
import ProfileImage from "../../components/ProfileImageComponent";
import PasswordResetDialog from "./OpenPasswordResetDiaolg";
import ResetEmailDialog from "./OpenEmailResetDialog";
import CustomButton from "../../components/CustomButton";

function ViewUserContent({ selectedUser }: { selectedUser: User }) {
  const { isTablet } = useIsMobile();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { user } = useCurrentUser();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const statusColor = selectedUser?.availability ? "#44b700" : "#f44336";

  const { mutate: profileUpdateMutation, isPending } = useMutation({
    mutationFn: updateUserProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      enqueueSnackbar("Profile updated successfully!", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Profile update failed", { variant: "error" });
    },
  });

  const saveImage = () => {
    if (imageFile) {
      profileUpdateMutation({ id: selectedUser.id, imageFile });
    }
  };
  const [openViewProfileDrawer, setOpenViewProfileDrawer] = useState(false);
  const [openEditUserRoleDialog, setOpenEditUserRoleDialog] = useState(false);
  const [openEditUserPasswordResetDialog, setOpenEditUserPasswordResetDialog] =
    useState(false);
  const [openEditUserEmailResetDialog, setOpenEditUserEmailResetDialog] =
    useState(false);

  return (
    <Stack
      sx={{
        display: "flex",
        marginY: 10,
        flexDirection: isTablet ? "column" : "row",
        p: "3rem",
      }}
      gap={4}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          p: "3rem",
          boxShadow: 3,
        }}
        gap={2}
      >
        <Typography
          variant="h4"
          textAlign={"center"}
          sx={{
            fontSize: "1.5rem",
            color: "var(--pallet-dark-blue)",
            marginTop: 2,
          }}
        >
          {selectedUser?.name}
        </Typography>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: statusColor,
              color: statusColor,
              boxShadow: "0 0 0 2px white",
              height: "16px",
              width: "16px",
              borderRadius: "50%",
            },
          }}
        >
          <ProfileImage
            name={selectedUser?.name}
            files={imageFile ? [imageFile] : selectedUser?.profileImage}
            fontSize="5rem"
          />
        </Badge>

        <Box
          sx={{
            display: "flex",
            flexDirection: isTablet ? "column" : "row",
          }}
          gap={2}
        >
          <CustomButton variant="outlined" component="label" sx={{ mt: 2 }}>
            Change Profile Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </CustomButton>

          {imageFile && (
            <CustomButton
              variant="contained"
              onClick={saveImage}
              sx={{ mt: 2, backgroundColor: "var(--pallet-blue)" }}
              disabled={isPending}
              endIcon={
                isPending && (
                  <CircularProgress size={20} sx={{ color: "gray" }} />
                )
              }
            >
              Save
            </CustomButton>
          )}
        </Box>
      </Box>

      <Stack
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          flex: 2,
          boxShadow: 3,
          p: "3rem",
        }}
      >
        <Stack direction={isTablet ? "column" : "row"}>
          <DrawerContentItem
            label="Employee Id"
            value={selectedUser?.id}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Email"
            value={selectedUser?.email}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack direction={isTablet ? "column" : "row"}>
          <DrawerContentItem
            label="Full Name"
            value={selectedUser?.name}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Mobile Number"
            value={selectedUser?.mobile}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack direction={isTablet ? "column" : "row"}>
          <DrawerContentItem
            label="Designation"
            value={selectedUser?.jobPosition}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Gender"
            value={selectedUser?.gender}
            sx={{ flex: 1 }}
          />
        </Stack>
        <Stack mt={isTablet ? 3 : 15}>
          <Box>
            <DrawerUpdateButtons
              onEdit={() => {
                setOpenEditUserRoleDialog(true);
              }}
              onResetEmail={() => {
                setOpenEditUserEmailResetDialog(true);
              }}
              onResetPassword={() => {
                setOpenEditUserPasswordResetDialog(true);
              }}
            />
          </Box>
        </Stack>
      </Stack>

      {openEditUserRoleDialog && (
        <UpdateUserProfile
          open={openEditUserRoleDialog}
          handleClose={() => {
            setOpenViewProfileDrawer(true);
            setOpenEditUserRoleDialog(false);
          }}
          defaultValues={user}
        />
      )}
      {openEditUserPasswordResetDialog && (
        <PasswordResetDialog
          open={openEditUserPasswordResetDialog}
          handleClose={() => {
            setOpenEditUserPasswordResetDialog(false);
            setOpenEditUserRoleDialog(false);
          }}
          onSubmit={(data) => {}}
          defaultValues={user}
        />
      )}
      {openEditUserEmailResetDialog && (
        <ResetEmailDialog
          open={openEditUserEmailResetDialog}
          handleClose={() => {
            setOpenEditUserEmailResetDialog(false);
            setOpenEditUserRoleDialog(false);
          }}
          defaultValues={user}
        />
      )}
    </Stack>
  );
}

export default ViewUserContent;
