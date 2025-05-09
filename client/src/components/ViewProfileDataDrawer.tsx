import {
  Box,
  Drawer,
  IconButton,
  SxProps,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useIsMobile from "../customHooks/useIsMobile";
import CustomButton from "./CustomButton";
import PasswordResetDialog from "../views/Administration/OpenPasswordResetDiaolg";
import ResetEmailDialog from "../views/Administration/OpenEmailResetDialog";
import { useState } from "react";
import { User } from "../api/userApi";
import LockIcon from "@mui/icons-material/Lock";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

function ViewProfileDataDrawer({
  open,
  handleClose,
  drawerContent,
  fullScreen,
}: {
  open: boolean;
  handleClose: () => void;
  drawerContent: React.ReactNode;
  fullScreen?: boolean;
}) {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );
  return (
    <Drawer
      anchor={"right"}
      open={open}
      onClose={handleClose}
      sx={{ zIndex: 1300 }}
      PaperProps={{
        sx: {
          width: isMobile || fullScreen ? "100vw" : "30vw",
          padding: 2,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export function DrawerProfileHeader({
  title,
  handleClose,
  onEdit,
  onDelete,
  disableEdit,
  disableDelete,
}: {
  title: string;
  handleClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  disableEdit?: boolean;
  disableDelete?: boolean;
}) {
  return (
    <Box
      sx={{
        marginX: 2,
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", my: 1 }}>
        <IconButton aria-label="delete" onClick={handleClose}>
          <CloseIcon sx={{ color: "var(--pallet-light-grey)" }} />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">{title}</Typography>
      </Box>
    </Box>
  );
}

export function DrawerUpdateButtons({
  onEdit,
  onResetEmail,
  onResetPassword,
  disableEdit,
}: {
  onEdit: () => void;
  onResetEmail: () => void;
  onResetPassword: () => void;
  disableEdit?: boolean;
  disableDelete?: boolean;
}) {
  const { isTablet } = useIsMobile();
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: isTablet ? "space-between" :"flex-end",
          gap: 3,
          flexWrap: "wrap",

        }}
      >
        {/* Edit Button */}
        {onEdit && (
          <>
            {isTablet ? (
              <IconButton
                aria-label="edit"
                onClick={onEdit}
                disabled={disableEdit}
              >
                <EditOutlinedIcon sx={{ color: "var(--pallet-blue)" }} />
              </IconButton>
            ) : (
              <CustomButton
                variant="contained"
                sx={{ backgroundColor: "var(--pallet-blue)" }}
                size="medium"
                onClick={onEdit}
                startIcon={<EditOutlinedIcon />}
                disabled={disableEdit}
              >
                Edit My Profile
              </CustomButton>
            )}
          </>
        )}

        {onResetPassword &&
          (isTablet ? (
            <IconButton
              aria-label="edit"
              onClick={onResetPassword}
              disabled={disableEdit}
            >
              <VpnKeyOutlinedIcon sx={{ color: "var(--pallet-blue)" }} />
            </IconButton>
          ) : (
            <CustomButton
              variant="contained"
              sx={{ backgroundColor: "var(--pallet-blue)" }}
              size="medium"
              startIcon={<VpnKeyOutlinedIcon />}
              onClick={onResetPassword}
            >
              Reset Password
            </CustomButton>
          ))}

        {onResetEmail &&
          (isTablet ? (
            <IconButton
              aria-label="reset-email"
              onClick={onResetEmail}
              disabled={disableEdit}
            >
              <EmailOutlinedIcon sx={{ color: "var(--pallet-blue)" }} />
            </IconButton>
          ) : (
            <CustomButton
              variant="contained"
              sx={{ backgroundColor: "var(--pallet-blue)" }}
              size="medium"
              onClick={onResetEmail}
              startIcon={<EmailOutlinedIcon />}
            >
              Reset Email
            </CustomButton>
          ))}
      </Box>
    </>
  );
}

export function DrawerContentItem({
  label,
  value,
  isRichText,
  sx,
}: {
  label: string;
  value?: string | number;
  isRichText?: boolean;
  sx?: SxProps;
}) {
  return (
    <Box
      sx={{
        ...sx,
        paddingY: "0.3rem",
        paddingX: "0.5rem",
        minWidth: "8rem",
      }}
    >
      <Typography
        variant="caption"
        sx={{ paddingBottom: 0, color: "var(--pallet-grey)" }}
      >
        {label}
      </Typography>
      {isRichText ? (
        <Typography
          variant="body2"
          dangerouslySetInnerHTML={{ __html: value ?? "--" }}
        />
      ) : (
        <Typography variant="body2">{value ?? "--"}</Typography>
      )}
    </Box>
  );
}

export default ViewProfileDataDrawer;
