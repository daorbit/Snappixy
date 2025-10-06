import React from "react";
import { Chip, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface PresetsTabProps {
  activePreset: string | null;
  onApplyPreset: (preset: string) => void;
  onReset: () => void;
}

const PresetsTab: React.FC<PresetsTabProps> = ({
  activePreset,
  onApplyPreset,
  onReset,
}) => {
  const theme = useTheme();

  const presets = [
    { key: "none", label: "None", icon: "❌" },
    { key: "thumbnail", label: "Thumbnail", icon: "📏" },
    { key: "square", label: "Square", icon: "⬜" },
    { key: "mobile", label: "Mobile", icon: "📱" },
    { key: "web", label: "Web", icon: "💻" },
    { key: "blur", label: "Blur", icon: "🌫️" },
    { key: "grayscale", label: "B&W", icon: "⚫" },
    { key: "sepia", label: "Sepia", icon: "🟤" },
    { key: "brightness", label: "Bright", icon: "☀️" },
    { key: "contrast", label: "Contrast", icon: "🔆" },
    { key: "saturation", label: "Vivid", icon: "🌈" },
    { key: "vintage", label: "Vintage", icon: "📜" },
    { key: "dramatic", label: "Dramatic", icon: "🎭" },
    { key: "warm", label: "Warm", icon: "🌅" },
    { key: "cool", label: "Cool", icon: "❄️" },
    { key: "high_contrast", label: "High Contrast", icon: "⚡" },
    { key: "soft_glow", label: "Soft Glow", icon: "✨" },
    { key: "cartoon", label: "Cartoon", icon: "🎨" },
    { key: "sketch", label: "Sketch", icon: "✏️" },
    { key: "pixel_art", label: "Pixel Art", icon: "🎮" },
    { key: "oil_painting", label: "Oil Paint", icon: "🎭" },
    { key: "vignette_soft", label: "Soft Vignette", icon: "🌑" },
    { key: "vignette_strong", label: "Strong Vignette", icon: "🌚" },
    { key: "sharpen_light", label: "Light Sharpen", icon: "🔍" },
    { key: "sharpen_strong", label: "Strong Sharpen", icon: "🔎" },
  ];

  return (
    <div>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1.5,
          //   maxHeight: '500px',
          overflow: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {presets.map((preset) => (
          <Chip
            key={preset.key}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <span>{preset.icon}</span>
                <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                  {preset.label}
                </Typography>
              </Box>
            }
            onClick={
              preset.key === "none" ? onReset : () => onApplyPreset(preset.key)
            }
            variant={
              activePreset === preset.key ||
              (preset.key === "none" && !activePreset)
                ? "filled"
                : "outlined"
            }
            color={
              activePreset === preset.key ||
              (preset.key === "none" && !activePreset)
                ? "primary"
                : "default"
            }
            sx={{
              cursor: "pointer",
              height: "auto",
              py: 1,
              "& .MuiChip-label": {
                display: "block",
                whiteSpace: "normal",
              },
              "&:hover": {
                boxShadow: theme.shadows[2],
              },
            }}
          />
        ))}
      </Box>
    </div>
  );
};

export default PresetsTab;
