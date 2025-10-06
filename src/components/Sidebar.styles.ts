import type { SxProps, Theme } from "@mui/material";

export const sidebarWrapper = (
  isMobile: boolean,
  collapsed: boolean
): SxProps<Theme> => ({
  width: isMobile || collapsed ? (isMobile ? 280 : 64) : 280,
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  bgcolor: "background.paper",
  borderRight: "1px solid",
  borderColor: "divider",
  boxShadow: "0 0 10px rgba(0,0,0,0.05)",
  transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.01) 100%)",
    pointerEvents: "none",
    zIndex: 0,
  },
});

export const headerBox = (
  collapsed: boolean,
  isMobile: boolean
): SxProps<Theme> => ({
  p: collapsed && !isMobile ? 2 : 1.5,
  borderBottom: "1px solid",
  borderColor: "divider",
  background:
    "linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
    pointerEvents: "none",
  },
});

 
export const toggleButton: SxProps<Theme> = {
  color: "text.secondary",
  borderRadius: 2,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 0,
    height: 0,
    bgcolor: "primary.main",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    transition: "all 0.3s ease",
  },
  "&:hover": {
    bgcolor: "action.hover",
    color: "text.primary",
    transform: "scale(1.1)",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
    "&::before": {
      width: 40,
      height: 40,
      opacity: 0.1,
    },
  },
  "&:active": {
    transform: "scale(0.95)",
  },
};

export const navWrapper = (
  collapsed: boolean,
  isMobile: boolean
): SxProps<Theme> => ({
  flexGrow: 1,
  py: collapsed && !isMobile ? 1 : 2,
  px: collapsed && !isMobile ? 1 : 0,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

export const navItem = (
  isActive: boolean,
  collapsed: boolean,
  isMobile: boolean
): SxProps<Theme> => ({
  display: "flex",
  alignItems: "center",
  p: collapsed && !isMobile ? 1.5 : { xs: 2, sm: 1.5 },
  mx: collapsed && !isMobile ? 0 : 0.5,
  my: 0.25,
  borderRadius: 2,
  cursor: "pointer",
  bgcolor: isActive ? "primary.main" : "transparent",
  color: isActive ? "primary.contrastText" : "text.primary",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  justifyContent: collapsed && !isMobile ? "center" : "flex-start",
  minHeight: { xs: 48, sm: 44 },
  marginBottom: "10px",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: isActive ? 4 : 0,
    height: isActive ? 24 : 0,
    bgcolor: "primary.main",
    borderRadius: "0 4px 4px 0",
    transition: "all 0.3s ease",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    bgcolor: "transparent",
    borderRadius: "inherit",
    transition: "all 0.3s ease",
  },
  "&:hover": {
    bgcolor: isActive ? "primary.dark" : "action.hover",
    transform: "translateX(0px) scale(1)",
    boxShadow: isActive
      ? "0 4px 20px rgba(25, 118, 210, 0.3)"
      : "0 4px 12px rgba(0,0,0,0.08)",
    "&::after": {
      bgcolor: isActive ? "rgba(255,255,255,0.1)" : "rgba(25, 118, 210, 0.05)",
    },
  },
});

export const navIcon = (
  isActive: boolean,
  collapsed: boolean
): SxProps<Theme> => ({
  color: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  mr: collapsed ? 0 : 2,
  minWidth: 24,
  minHeight: 24,
  transition: "all 0.3s ease",
  transform: isActive ? "scale(1.1)" : "scale(1)",
  "& svg": {
    transition: "all 0.3s ease",
  },
});

export const logoutItem = (
  collapsed: boolean,
  isMobile: boolean
): SxProps<Theme> => ({
  display: "flex",
  alignItems: "center",
  p: collapsed && !isMobile ? 1.5 : { xs: 2, sm: 1.5 },
  mx: collapsed && !isMobile ? 0 : 0.5,
  my: 0.25,
  borderRadius: 2,
  cursor: "pointer",
  bgcolor: "transparent",
  color: "error.main",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  justifyContent: collapsed && !isMobile ? "center" : "flex-start",
  minHeight: { xs: 48, sm: 44 },
  marginBottom: "10px",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: 0,
    height: 0,
    bgcolor: "error.main",
    borderRadius: "0 4px 4px 0",
    transition: "all 0.3s ease",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    bgcolor: "transparent",
    borderRadius: "inherit",
    transition: "all 0.3s ease",
  },
  "&:hover": {
    // bgcolor: "error.light",
    transform: "translateX(0px) scale(1)",
    boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
    "&::before": {
      width: 4,
      height: 24,
    },
    "&::after": {
      bgcolor: "rgba(244, 67, 54, 0.05)",
    },
  },
});

export const logoutIcon = (collapsed: boolean): SxProps<Theme> => ({
  color: "error.main",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  mr: collapsed ? 0 : 2,
  minWidth: 24,
  minHeight: 24,
  transition: "all 0.3s ease",
  "& svg": {
    transition: "all 0.3s ease",
  },
});
