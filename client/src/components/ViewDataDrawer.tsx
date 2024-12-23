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

function ViewDataDrawer({
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

export function DrawerHeader({
  title,
  handleClose,
  onEdit,
  onDelete,
}: {
  title: string;
  handleClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <Box
      sx={{
        marginX: 2,
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
        <DrawerEditAndDeleteButtons onEdit={onEdit} onDelete={onDelete} />
      </Box>
    </Box>
  );
}

export function DrawerEditAndDeleteButtons({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {onEdit && (
        <IconButton aria-label="edit" onClick={onEdit} sx={{ marginX: 1 }}>
          <EditIcon
            sx={{
              color: "var(--pallet-blue)",
            }}
          />
        </IconButton>
      )}
      {onDelete && (
        <IconButton aria-label="delete" onClick={onDelete}>
          <DeleteIcon sx={{ color: "var(--pallet-red)" }} />
        </IconButton>
      )}
    </Box>
  );
}

export function DrawerContentItem({
  label,
  value,
  sx,
}: {
  label: string;
  value?: string | number;
  sx?: SxProps;
}) {
  return (
    <Box
      sx={{
        ...sx,
        paddingY: "0.3rem",
      }}
    >
      <Typography
        variant="caption"
        sx={{ paddingBottom: 0, color: "var(--pallet-grey)" }}
      >
        {label}
      </Typography>
      <Typography variant="body2">{value ?? "--"}</Typography>
    </Box>
  );
}

export default ViewDataDrawer;
