import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { CssBaseline, Box, Typography } from "@mui/material";
import  { useState, useEffect } from "react";

import { AuthProvider } from "./contexts/AuthContext.tsx";
import ThemeContextProvider from "./contexts/ThemeProvider.tsx";
import { SidebarProvider } from "./contexts/SidebarContext.tsx";
import Header from "./components/Header.tsx";
import Sidebar from "./components/Sidebar.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import ImageOptimizerPage from "./pages/ImageOptimizerPage.tsx";
import GoogleDrivePage from "./pages/GoogleDrivePage.tsx";
import ThumbnailCreatorPage from "./pages/ThumbnailCreatorPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import CloudinaryPage from "./pages/CloudinaryPage.tsx";
import ImageEditorPage from "./pages/ImageEditor/ImageEditorPage.tsx";
import { useAuth } from "./contexts/useAuth";
import { useSidebar } from "./contexts/useSidebar";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { collapsed } = useSidebar();

  const [mobileOpen, setMobileOpen] = useState(false);

  const isHomePage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";

  // Redirect authenticated users to dashboard if they're on home or login page
  useEffect(() => {
    if (!isLoading && isAuthenticated && (isHomePage || isLoginPage)) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, isHomePage, isLoginPage, navigate]);

  const handleMobileMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileOpen(false);
  };

  if (isHomePage || isLoginPage || !isAuthenticated) {
    // Show loading spinner while checking authentication
    if (isLoading) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>Loading...</Typography>
        </Box>
      );
    }

    // Home page, login page, or unauthenticated users - layout without sidebar and header
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Redirect authenticated routes to home for unauthenticated users */}
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/profile" element={<HomePage />} />
          <Route path="/optimizer" element={<HomePage />} />
          <Route path="/google-drive" element={<HomePage />} />
          <Route path="/thumbnail-creator" element={<HomePage />} />
          <Route path="/cloudinary" element={<HomePage />} />
        </Routes>
      </Box>
    );
  }

  const isImageEditorPage = location.pathname.startsWith("/image-editor");

  // Authenticated app pages layout with sidebar and header
  return (
    <Box sx={{ minHeight: "100vh" }}>
      {!isImageEditorPage && (
        <Sidebar
          mobileOpen={mobileOpen}
          onMobileClose={handleMobileMenuClose}
          onMobileToggle={handleMobileMenuToggle}
        />
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", md: "auto" }, // Full width on mobile, auto on desktop
          marginLeft: { xs: 0, md: !isImageEditorPage ? (collapsed ? "64px" : "280px") : 0 },
        }}
      >
        {!isImageEditorPage && (
          <Header onMobileMenuToggle={handleMobileMenuToggle} />
        )}
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/optimizer" element={<ImageOptimizerPage />} />
            <Route path="/google-drive" element={<GoogleDrivePage />} />
            <Route
              path="/thumbnail-creator"
              element={<ThumbnailCreatorPage />}
            />
            <Route path="/cloudinary" element={<CloudinaryPage />} />
            <Route path="/image-editor" element={<ImageEditorPage />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <AuthProvider>
        <SidebarProvider>
          <Router>
            <AppContent />
          </Router>
        </SidebarProvider>
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;
