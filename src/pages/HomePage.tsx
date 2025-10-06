import React from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  PhotoLibrary,
  AutoAwesome,
  CloudUpload,
  Tune,
  PlayArrow,
  Login,
} from "@mui/icons-material";
import { useTheme } from "../contexts/useTheme.tsx";
import { useAuth } from "../contexts/useAuth";
import ImageCarousel from "../components/ImageCarousel.tsx";

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleUserClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const features = [
    {
      icon: <PhotoLibrary sx={{ fontSize: { xs: 40, sm: 48 } }} />,
      title: "Google Drive Integration",
      description:
        "Connect your Google Drive and access all your images seamlessly",
    },
    {
      icon: <AutoAwesome sx={{ fontSize: { xs: 40, sm: 48 } }} />,
      title: "AI-Powered Optimization",
      description:
        "Smart compression that maintains quality while reducing file size",
    },
    {
      icon: <Tune sx={{ fontSize: { xs: 40, sm: 48 } }} />,
      title: "Custom Thumbnails",
      description: "Create eye-catching thumbnails with AI-generated designs",
    },
    {
      icon: <CloudUpload sx={{ fontSize: { xs: 40, sm: 48 } }} />,
      title: "Batch Processing",
      description: "Process multiple images at once to save time",
    },
    {
      icon: <PhotoLibrary sx={{ fontSize: { xs: 40, sm: 48 } }} />,
      title: "Multiple Formats",
      description: "Support for JPEG, PNG, WebP, and more formats",
    },
    {
      icon: <CloudUpload sx={{ fontSize: { xs: 40, sm: 48 } }} />,
      title: "Cloud Storage",
      description: "Save your optimized images directly to Google Drive",
    },
  ];

  // Sample images for carousel
  const sampleImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Professional Photography",
      description:
        "Transform your high-resolution photos with AI-powered optimization",
      beforeSize: "5.2 MB",
      afterSize: "1.1 MB",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Web Development Assets",
      description:
        "Optimize web images for faster loading times and better performance",
      beforeSize: "3.8 MB",
      afterSize: "680 KB",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Marketing Materials",
      description:
        "Create stunning thumbnails and marketing visuals with AI assistance",
      beforeSize: "4.5 MB",
      afterSize: "890 KB",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "E-commerce Products",
      description: "Optimize product images for online stores and catalogs",
      beforeSize: "6.1 MB",
      afterSize: "1.3 MB",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Social Media Content",
      description:
        "Perfect your social media images with smart compression and resizing",
      beforeSize: "2.9 MB",
      afterSize: "520 KB",
    },
  ];

  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>
      {/* Navigation Bar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: "transparent" }}
      >
        <Toolbar
          sx={{ justifyContent: "space-between", py: 1, px: { xs: 2, sm: 3 } }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              color: theme.palette.mode === "dark" ? "#FFFFFF" : "#8B5CF6",
              background:
                theme.palette.mode === "dark"
                  ? "none"
                  : "linear-gradient(45deg, #8B5CF6 30%, #7C3AED 90%)",
              WebkitBackgroundClip:
                theme.palette.mode === "dark" ? "unset" : "text",
              WebkitTextFillColor:
                theme.palette.mode === "dark" ? "#FFFFFF" : "transparent",
              backgroundClip: theme.palette.mode === "dark" ? "unset" : "text",
            }}
          >
            Snappixy
          </Typography>

          {/* User Avatar or Login Button */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isAuthenticated && user ? (
              <IconButton
                onClick={handleUserClick}
                sx={{
                  p: 0.5,
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <Avatar
                  src={user.picture}
                  alt={user.name}
                  sx={{
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    border: "2px solid",
                    borderColor: "primary.main",
                  }}
                >
                  {user.name?.charAt(0) || "U"}
                </Avatar>
              </IconButton>
            ) : (
              <Button
                onClick={handleUserClick}
                variant="outlined"
                startIcon={<Login />}
                size={window.innerWidth < 600 ? "small" : "medium"}
                sx={{
                  borderColor: "primary.main",
                  color: "primary.main",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  px: { xs: 1.5, sm: 2 },
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  },
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)"
              : "linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 50%, #C4B5FD 100%)",
          color: theme.palette.mode === "dark" ? "white" : "#6D28D9",
          py: { xs: 6, sm: 8, md: 12 },
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              theme.palette.mode === "dark"
                ? "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.3) 0%, transparent 70%)"
                : "radial-gradient(ellipse at center, rgba(196, 181, 253, 0.2) 0%, transparent 70%)",
            animation: "pulse 4s ease-in-out infinite",
          },
          "@keyframes pulse": {
            "0%, 100%": { opacity: 0.7 },
            "50%": { opacity: 1 },
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <img
            src="/snapaxxy.png"
            style={{ height: "100px", borderRadius: "20px" ,marginBottom: "20px"}}
          />

          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 400,
              mb: 4,
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
              opacity: 0.9,
            }}
          >
            Optimize images and create stunning thumbnails with
            <br />
            AI-powered tools
          </Typography>
          <Button
            onClick={handleUserClick}
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
            sx={{
              bgcolor: theme.palette.mode === "dark" ? "#FFFFFF" : "#8B5CF6",
              color: theme.palette.mode === "dark" ? "#8B5CF6" : "#FFFFFF",
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: "50px",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 8px 32px rgba(255, 255, 255, 0.2)"
                  : "0 8px 32px rgba(139, 92, 246, 0.3)",
              "&:hover": {
                color: theme.palette.mode === "dark" ? "#8B5CF6" : "#FFFFFF",
                bgcolor: theme.palette.mode === "dark" ? "#EDE9FE" : "#7C3AED",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 12px 48px rgba(255, 255, 255, 0.3)"
                    : "0 12px 48px rgba(139, 92, 246, 0.4)",
              },
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started"}
          </Button>
        </Container>
      </Box>

      {/* Image Showcase Carousel */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h2"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            background: "linear-gradient(45deg, #8B5CF6 30%, #7C3AED 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          See The Magic In Action
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: "700px", mx: "auto" }}
        >
          Watch how Snappixy transforms your images with intelligent
          optimization and stunning results
        </Typography>

        <ImageCarousel
          images={sampleImages}
          autoPlay={true}
          autoPlayInterval={5000}
        />
      </Container>

      {/* Features Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography
          variant="h2"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            background: "linear-gradient(45deg, #8B5CF6 30%, #7C3AED 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Powerful Features
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 8, maxWidth: "600px", mx: "auto" }}
        >
          Everything you need to optimize images and create professional
          thumbnails
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  p: 3,
                  borderRadius: 3,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                      : "0 8px 32px rgba(0, 0, 0, 0.08)",
                  border:
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(139, 92, 246, 0.2)"
                      : "1px solid rgba(0, 0, 0, 0.05)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 20px 64px rgba(139, 92, 246, 0.2)"
                        : "0 20px 64px rgba(139, 92, 246, 0.15)",
                  },
                }}
              >
                <Box
                  sx={{
                    color: "#8B5CF6",
                    mb: 3,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {feature.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 0 }}>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #2C2C2C 0%, #1E1E1E 100%)"
              : "linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%)",
          py: { xs: 8, md: 12 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
              background: "linear-gradient(45deg, #8B5CF6 30%, #7C3AED 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Ready to transform your images?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: "500px", mx: "auto" }}
          >
            Join thousands of creators who trust Snappixy for their image
            optimization needs
          </Typography>
          <Button
            onClick={handleUserClick}
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
            sx={{
              bgcolor: "#8B5CF6",
              color: "#FFFFFF",
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: "50px",
              boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)",
              "&:hover": {
                bgcolor: "#7C3AED",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 48px rgba(139, 92, 246, 0.4)",
              },
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {isAuthenticated ? "Go to Dashboard" : "Start Now - It's Free"}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
