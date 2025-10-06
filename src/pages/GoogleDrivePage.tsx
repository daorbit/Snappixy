import React from "react";
import { Box } from "@mui/material";
import ImageGallery from "../components/ImageGallery.tsx";
import LoginComponent from "../components/LoginComponent.tsx";
import { useAuth } from "../contexts/useAuth.ts";

const GoogleDrivePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div
      style={{
        padding: "24px",
        width: "100%",
      }}
    >
      <Box>{isAuthenticated ? <ImageGallery /> : <LoginComponent />}</Box>
    </div>
  );
};

export default GoogleDrivePage;
