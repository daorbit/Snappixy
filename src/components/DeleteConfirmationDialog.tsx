import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Delete } from "@mui/icons-material";
import type { CloudinaryResource } from "../services/cloudinary/cloudinaryService";
import type { DriveFile } from "../services/googleDriveService";

interface DeleteConfirmationDialogProps {
  open: boolean;
  file: CloudinaryResource | DriveFile | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  file,
  deleting,
  onClose,
  onConfirm,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Get display name from file
  const getFileName = (file: CloudinaryResource | DriveFile | null): string => {
    if (!file) return "";
    if ("public_id" in file) {
      // CloudinaryResource
      return file.public_id.split("/").pop() || file.public_id;
    } else {
      // DriveFile
      return file.name;
    }
  };

  const fileName = getFileName(file);

  // Theme-based colors
  const colors = {
    background: isDark
      ? "linear-gradient(135deg, #1c1c1c 0%, #2a2a2a 100%)"
      : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
    surface: isDark ? "#1c1c1c" : "#ffffff",
    textPrimary: isDark ? "#ffffff" : "#1a1a1a",
    textSecondary: isDark ? "#e0e0e0" : "#666666",
    textMuted: isDark ? "#cccccc" : "#888888",
    warningBg: isDark ? "rgba(255, 68, 68, 0.08)" : "rgba(244, 67, 54, 0.08)",
    warningBorder: isDark ? "rgba(255, 68, 68, 0.2)" : "rgba(244, 67, 54, 0.2)",
    warningText: isDark ? "#ffcccc" : "#d32f2f",
    buttonBorder: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.23)",
    buttonHoverBg: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.04)",
    shadow: isDark
      ? "0 25px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 68, 68, 0.1)"
      : "0 25px 80px rgba(0, 0, 0, 0.1), 0 0 40px rgba(244, 67, 54, 0.05)",
  };
  return (
    <Dialog
      open={open}
      onClose={deleting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: colors.background,
          backgroundImage: colors.background,
          borderRadius: 3,
          boxShadow: colors.shadow,
          backdropFilter: "blur(20px)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #ff4444, #ff8e8e, #ff4444)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2s ease-in-out infinite",
          },
        },
      }}
    >
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            50% { background-position: 0% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.9; }
          }
        `}
      </style>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          bgcolor: "transparent",
          color: colors.textPrimary,
          pb: 3,
          pt: 4,
          px: 4,
          textAlign: "center",
          justifyContent: "center",
          "& .MuiTypography-root": {
            fontWeight: 800,
            fontSize: "1.5rem",
            background: isDark
              ? "linear-gradient(45deg, #ff6b6b, #ff9999, #ff6b6b)"
              : "linear-gradient(45deg, #d32f2f, #f44336, #d32f2f)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: isDark
              ? "0 2px 8px rgba(255, 107, 107, 0.3)"
              : "0 2px 8px rgba(211, 47, 47, 0.2)",
            letterSpacing: "0.5px",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Delete
            sx={{
              fontSize: 36,
              background: isDark
                ? "linear-gradient(45deg, #ff4444, #ff7777)"
                : "linear-gradient(45deg, #f44336, #e53935)",
              borderRadius: "50%",
              p: 1,
              color: "#fff",
              filter: isDark
                ? "drop-shadow(0 4px 12px rgba(255, 68, 68, 0.5))"
                : "drop-shadow(0 4px 12px rgba(244, 67, 54, 0.3))",
              animation: "pulse 2s ease-in-out infinite",
              mr: 1,
            }}
          />
        </Box>
        Confirm Delete
      </DialogTitle>
      <DialogContent
        sx={{
          bgcolor: "transparent",
          color: colors.textSecondary,
          py: 2,
          px: 4,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            color: colors.textPrimary,
            fontWeight: 600,
            fontSize: "1.2rem",
            lineHeight: 1.4,
          }}
        >
          Delete "{fileName}"?
        </Typography>
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: colors.warningBg,
            border: `1px solid ${colors.warningBorder}`,
            backdropFilter: "blur(10px)",
            boxShadow: isDark
              ? "inset 0 1px 3px rgba(255, 68, 68, 0.1)"
              : "inset 0 1px 3px rgba(244, 67, 54, 0.08)",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: colors.warningText,
              lineHeight: 1.6,
              fontWeight: 500,
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            ⚠️ This action cannot be undone!
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.textMuted,
              lineHeight: 1.5,
              fontSize: "0.95rem",
            }}
          >
            The image will be permanently removed from Cloudinary. Consider
            creating a backup if you might need this file later.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          bgcolor: "transparent",
          px: 4,
          py: 3,
          gap: 2,
          justifyContent: "end",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Button
          onClick={onClose}
          disabled={deleting}
          variant="outlined"
          sx={{
            borderColor: colors.buttonBorder,
            color: isDark ? "#e8e8e8" : theme.palette.text.primary,
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            fontSize: "1rem",
            backdropFilter: "blur(10px)",
            minWidth: { xs: "100%", sm: "140px" },

            "&:disabled": {
              borderColor: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.12)",
              color: theme.palette.action.disabled,
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={deleting}
          startIcon={
            deleting ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : (
              <Delete />
            )
          }
          sx={{
            bgcolor: isDark
              ? "linear-gradient(45deg, #ff4444, #ff6b6b)"
              : "linear-gradient(45deg, #f44336, #d32f2f)",
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontWeight: 700,
            fontSize: "1rem",
            textTransform: "none",
            boxShadow: isDark
              ? "0 6px 20px rgba(255, 68, 68, 0.4)"
              : "0 6px 20px rgba(244, 67, 54, 0.25)",
            minWidth: { xs: "100%", sm: "180px" },

            "&:disabled": {
              bgcolor: theme.palette.action.disabledBackground,
              transform: "none",
              boxShadow: "none",
            },
            "&:active": {
              transform: "translateY(-1px)",
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {deleting ? "Deleting..." : "Delete Permanently"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
