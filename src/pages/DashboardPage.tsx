import React from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
 
import { useAuth } from "../contexts/useAuth.ts";
import SimpleImageViewer from "../components/SimpleImageViewer.tsx";
import QuickActionsSection from "./QuickActionsSection.tsx";
import RecentActivity from "./RecentActivity.tsx";
import DashboardMiniCards from "./DashboardMiniCards.tsx";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div style={{ 
      padding: "24px", 
      width: "100%",
      minHeight: "100vh",  
    }}>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Avatar
            src={user?.picture}
            alt={user?.name}
            sx={{ width: 64, height: 64, mr: 3 }}
          />
          <Box>
            <Typography variant="h4" gutterBottom>
              Welcome back, {user?.name?.split(" ")[0] || "User"}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's your image optimization dashboard
            </Typography>
          </Box>
        </Box>

        <Box sx={{ minHeight: 140, mb: 4 }}> {/* Fixed height to prevent shifts */}
          <DashboardMiniCards/>
        </Box>
        
        <Box sx={{ minHeight: 160 }}> {/* Fixed height to prevent shifts */}
          <QuickActionsSection />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
            mt: 4,
            minHeight: 400, // Prevent layout shift when content loads
          }}
        >
          <Box sx={{ flex: { xs: 1, md: "0 0 30%" }, minWidth: 0 }}>
            <RecentActivity />
          </Box>
          <Box sx={{ flex: { xs: 1, md: "100%" }, minWidth: 0 }}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: 3, 
              height: "fit-content",
              minHeight: 400, // Ensure consistent minimum height
            }}>
              <CardContent>
                <SimpleImageViewer />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default DashboardPage;
