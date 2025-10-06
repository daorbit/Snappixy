import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  LayoutDashboard,
  Zap,
  Scissors,
  ChevronRight,
  Menu,
  LogOut,
  User,
  Cloud,
  // Camera,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { useSidebar } from "../contexts/useSidebar";
import {
  sidebarWrapper,
  headerBox,
  toggleButton,
  navWrapper,
  navItem,
  navIcon,
  logoutItem,
  logoutIcon,
} from "./Sidebar.styles";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onMobileToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen = false,
  onMobileClose,
  onMobileToggle,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { logout } = useAuth();
  const { collapsed, toggleCollapsed } = useSidebar();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const toggleCollapse = () => {
    if (isMobile && onMobileToggle) {
      onMobileToggle();
    } else {
      toggleCollapsed();
    }
  };

  const mainNavItems = [
    {
      text: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      requireAuth: true,
    },
    {
      text: "Image Optimizer",
      path: "/optimizer",
      icon: <Zap size={20} />,
      requireAuth: true,
    },

    {
      text: "Thumbnail Creator",
      path: "/thumbnail-creator",
      icon: <Scissors size={20} />,
      requireAuth: true,
    },
    {
      text: "Google Drive",
      path: "/google-drive",
      icon: <Cloud size={20} />,
      requireAuth: true,
    },
    // {
    //   text: "Image Builder",
    //   path: "/cloudinary",
    //   icon: <Camera size={20} />,
    //   requireAuth: true,
    // },
  ];

  const sidebarContent = (
    <Box sx={sidebarWrapper(isMobile, collapsed)}>
      {/* Header Section */}
      <Box sx={headerBox(collapsed, isMobile)}>
        {!collapsed || isMobile ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <img
                src="/snapaxyMini.png"
                style={{
                  height: "30px",
                  width: "auto",
                  borderRadius: "6px",
                  marginTop: "2px",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  letterSpacing: "-0.025em",
                }}
              >
                Snappixy
              </Typography>
            </Box>
            <IconButton onClick={toggleCollapse} sx={toggleButton}>
              <Menu size={20} />
            </IconButton>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <img
              src="/snapaxyMini.png"
              style={{ height: "30px", width: "auto", borderRadius: "6px" }}
            />
            <IconButton onClick={toggleCollapse} sx={toggleButton}>
              <ChevronRight size={20} />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Navigation Section */}
      <Box sx={navWrapper(collapsed, isMobile)}>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ px: collapsed && !isMobile ? 0 : 1 }}>
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const showText = !collapsed || isMobile;

              return (
                <Tooltip
                  key={item.path}
                  title={collapsed && !isMobile ? item.text : ""}
                  placement="right"
                >
                  <Box
                    onClick={() => handleNavigation(item.path)}
                    sx={navItem(isActive, collapsed, isMobile)}
                  >
                    <Box sx={navIcon(isActive, collapsed)}>{item.icon}</Box>
                    {showText && (
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isActive ? 600 : 500,
                          fontSize: { xs: "0.95rem", sm: "0.9rem" },
                          lineHeight: 1.4,
                        }}
                      >
                        {item.text}
                      </Typography>
                    )}
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </Box>

        <Box>
          {/* Profile Settings Section */}
          <Box sx={{ px: collapsed && !isMobile ? 0 : 1, mt: 1 }}>
            <Tooltip
              title={collapsed && !isMobile ? "Profile Settings" : ""}
              placement="right"
            >
              <Box
                onClick={() => handleNavigation("/profile")}
                sx={navItem(false, collapsed, isMobile)}
              >
                <Box sx={navIcon(false, collapsed)}>
                  <User size={20} />
                </Box>
                {(!collapsed || isMobile) && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      fontSize: { xs: "0.95rem", sm: "0.9rem" },
                      lineHeight: 1.4,
                      color: "text.primary",
                    }}
                  >
                    Profile Settings
                  </Typography>
                )}
              </Box>
            </Tooltip>
          </Box>
          <Box sx={{ px: collapsed && !isMobile ? 0 : 1, mt: "1rem" }}>
            <Tooltip
              title={collapsed && !isMobile ? "Logout" : ""}
              placement="right"
            >
              <Box
                onClick={handleLogout}
                sx={{
                  ...logoutItem(collapsed, isMobile),

                  borderRadius: 1,
                }}
              >
                <Box sx={logoutIcon(collapsed)}>
                  <LogOut size={20} />
                </Box>
                {(!collapsed || isMobile) && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      fontSize: { xs: "0.95rem", sm: "0.9rem" },
                      lineHeight: 1.4,
                      color: "error.main",
                    }}
                  >
                    Logout
                  </Typography>
                )}
              </Box>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            bgcolor: "background.paper",
            backgroundImage: "none",
            border: "none",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        width: collapsed ? 64 : 280,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: collapsed ? 64 : 280,
          bgcolor: "background.paper",
          backgroundImage: "none",
          border: "none",
          boxShadow: "0 0 10px rgba(0,0,0,0.05)",
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;
