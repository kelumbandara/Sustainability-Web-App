import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import GridViewIcon from "@mui/icons-material/GridView";
import groupLogo from "../../assets/group-logo.png";
import {
  Avatar,
  Badge,
  Button,
  Collapse,
  Drawer as MobileDrawer,
  useMediaQuery,
} from "@mui/material";
import { Link, useLocation } from "react-router";
import { SidebarItem, sidebarItems } from "./SidebarItems";
import theme from "../../theme";

const drawerWidth = 265;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: 0,
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
  [theme.breakpoints.down("md")]: {
    width: "100%", // Ensure full width on mobile
    marginLeft: 0, // Reset margin on mobile
  },
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

interface Props {
  children: JSX.Element | JSX.Element[];
}

export default function MainLayout({ children }: Props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  console.log(open);

  const toggleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        open={open}
        sx={{
          backgroundColor: "#fff",
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                aria-label="open drawer"
                onClick={toggleDrawerOpen}
                edge="start"
                sx={[
                  {
                    color: "#024271",
                    marginRight: 3,
                  },
                  open && !isMobile && { display: "none" },
                ]}
              >
                <MenuIcon />
              </IconButton>
              <Box>
                <img
                  src={groupLogo}
                  alt="logo"
                  height={"35em"}
                  style={{ marginTop: "5px" }}
                />
              </Box>
            </Box>
            {!isMobile && (
              <Box>
                <Typography
                  variant="subtitle1"
                  noWrap
                  component="div"
                  sx={{ color: "#000" }}
                >
                  Monitor and Manage{" "}
                  <span style={{ fontWeight: 600 }}>Health & Safety</span>
                </Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {!isMobile && (
                <>
                  <IconButton
                    size="small"
                    sx={[
                      {
                        color: "#024271",
                        marginRight: "12px",
                      },
                    ]}
                  >
                    <GridViewIcon sx={{ fontSize: "1.6rem" }} />
                  </IconButton>

                  <IconButton
                    size="small"
                    sx={[
                      {
                        color: "#024271",
                        marginRight: "14px",
                      },
                    ]}
                  >
                    <Badge variant="dot" color="success">
                      <MailOutlineIcon sx={{ fontSize: "1.6rem" }} />
                    </Badge>
                  </IconButton>
                </>
              )}
              <Avatar
                sx={{ bgcolor: "#024271", height: "2rem", width: "2rem" }}
              >
                A
              </Avatar>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <MobileDrawer
          variant="temporary"
          open={open}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          PaperProps={{
            sx: {
              backgroundColor: "#010f24",
              color: "#fff",
              elevation: 2,
            },
          }}
        >
          <DrawerContent handleDrawerClose={handleDrawerClose} />
        </MobileDrawer>
      ) : (
        <Drawer
          variant="permanent"
          open={open}
          PaperProps={{
            sx: {
              backgroundColor: "#010f24",
              color: "#fff",
              elevation: 2,
            },
          }}
        >
          <DrawerContent handleDrawerClose={handleDrawerClose} />
        </Drawer>
      )}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}

const DrawerContent = ({
  handleDrawerClose,
}: {
  handleDrawerClose: () => void;
}) => {
  return (
    <>
      <DrawerHeader sx={{ justifyContent: "flex-start" }}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon
              sx={{
                color: "#fff",
              }}
            />
          ) : (
            <ChevronLeftIcon
              sx={{
                color: "#fff",
              }}
            />
          )}
        </IconButton>
        <Typography
          variant="subtitle1"
          noWrap
          component="div"
          sx={{ color: "#7db0ff" }}
        >
          Hello, Welcome!
        </Typography>
      </DrawerHeader>
      <Divider sx={{ marginBottom: "1rem", backgroundColor: "#7db0ff" }} />
      <Box
        sx={{
          height: "calc(100vh - 75px)",
          overflowY: "auto",
          paddingLeft: 0,
          overflowX: "hidden",
        }}
      >
        {sidebarItems.map((item, i) => {
          if (item?.headline) {
            return (
              <Typography
                key={i}
                variant="body2"
                sx={{
                  color: "#7db0ff",
                  padding: "0.5rem 1rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  marginTop: "0.5rem",
                }}
              >
                {item.headline}
              </Typography>
            );
          }

          if (item.nestedItems) {
            return (
              <Box sx={{ marginLeft: "1rem" }}>
                <NestedItem key={i} item={item} />
              </Box>
            );
          }
          return (
            <ListItem
              key={i}
              disableGutters
              sx={{ paddingY: "3px", marginLeft: "1rem" }}
            >
              <LinkButton
                to={item.href}
                icon={item.icon}
                title={item.title}
                disabled={item.disabled}
              />
            </ListItem>
          );
        })}
      </Box>
    </>
  );
};

const NestedItem = React.memo(({ item }: { item: SidebarItem }) => {
  const [open, setOpen] = React.useState(item.open);
  return (
    <>
      <Button
        onClick={() => setOpen((o) => !o)}
        endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        sx={{
          fontSize: "0.8rem",
          paddingY: "0.2rem",
          alignItems: "center",
          marginY: "0.1rem",
        }}
        disabled={item.disabled}
      >
        <div
          style={{
            marginRight: "0.5rem",
            marginBottom: -4,
            color: item.disabled ? "grey" : "#fff",
          }}
        >
          {item.icon}
        </div>
        <Typography
          variant="body2"
          sx={{
            textTransform: "capitalize",
            color: item.disabled ? "grey" : "#fff",
          }}
        >
          {item.title}
        </Typography>
      </Button>
      <Collapse in={open} unmountOnExit>
        <List>
          {item.nestedItems.map((item) => {
            if (item.nestedItems) {
              return (
                <Box key={item.href} sx={{ marginLeft: "0.5rem" }}>
                  <NestedItem item={item} />
                </Box>
              );
            }

            return (
              <ListItem
                disableGutters
                key={item.title}
                sx={{ paddingY: "3px", marginLeft: "0.5rem" }}
              >
                <LinkButton
                  to={item.href}
                  icon={item.icon}
                  title={item.title}
                  disabled={item.disabled}
                />
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </>
  );
});

interface LinkButtonProps {
  to: string;
  icon: any;
  title: string;
  disabled?: boolean;
}

export const LinkButton = React.memo(
  ({ to, icon, title, disabled }: LinkButtonProps) => {
    const { pathname } = useLocation();

    const isMatch = to === "/" ? pathname === to : pathname.startsWith(to);

    return (
      <Link to={to} style={{ width: 220 }}>
        <Button
          sx={{
            fontSize: "0.8rem",
            paddingY: "0.2rem",
            alignItems: "center",
          }}
          disabled={disabled}
        >
          <div
            style={{
              marginRight: "0.4rem",
              marginBottom: -4,
              color: disabled ? "grey" : "#fff",
            }}
          >
            {icon}
          </div>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              color: disabled ? "grey" : "#fff",
            }}
          >
            {title}
          </Typography>
        </Button>
      </Link>
    );
  }
);
