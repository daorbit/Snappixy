import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import {
  Crop,
  FormatColorFill,
  BlurOn,
  Settings,
  Refresh,
  Filter,
  Tune,
  TextFields,
  Palette,
  Compress,
  Star,
  Layers,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { StyledIconButton } from "../../components/cloudinary/ImageTransformModal.styled";

interface ControlsPanelProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
  onReset: () => void;
  children: React.ReactNode;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  activeTab,
  onTabChange,
  onReset,
  children,
}) => {
  const theme = useTheme();
  const tabLabels = [
    "Crop & Resize",
    "Format",
    "Effects",
    "Filters",
    "Adjust",
    "Text",
    "Overlay",
    "Artistic",
    "Optimize",
    "Advanced",
    "Presets",
  ];

  const icons = [
    Crop,
    FormatColorFill,
    BlurOn,
    Filter,
    Tune,
    TextFields,
    Layers,
    Palette,
    Compress,
    Settings,
    Star,
  ];

  return (
    <Box
      sx={{
        flex: "0 0 320px",
        maxWidth: 400,
        minWidth: 400,
        // height: "calc(100vh - 240px)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        p: 0,
        bgcolor: theme.palette.background.paper,
        "@media (max-width: 1200px)": {
          flex: "none",
          width: "100%",
          maxWidth: "none",
          minWidth: "auto",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6">Edit Tools</Typography>
      </Box>
      <Box sx={{ display: "flex", height: "100%" }}>
        {/* Narrow icon rail */}
        <Box
          sx={{
            width: 72,
            bgcolor: theme.palette.background.default,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 2,
            gap: 1,
            borderRight: "1px solid",
            borderColor: "divider",
            overflow: "auto",
            height: "100%",
          }}
        >
          {icons.map((Icon, index) => (
            <Tooltip key={index} placement="left" title={tabLabels[index]}>
              <StyledIconButton
                onClick={() => onTabChange(index)}
                theme={theme}
                sx={{
                  bgcolor:
                    activeTab === index
                      ? theme.palette.primary.main
                      : "transparent",
                  color:
                    activeTab === index ? "white" : "inherit",
                }}
              >
                <Icon />
              </StyledIconButton>
            </Tooltip>
          ))}
          <Box sx={{ flex: 1 }} />
          <Tooltip title="Reset">
            <StyledIconButton onClick={onReset} theme={theme}>
              <Refresh />
            </StyledIconButton>
          </Tooltip>
        </Box>

        {/* Tools area (scrollable) */}
        <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            {tabLabels[activeTab]}
          </Typography>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default ControlsPanel;