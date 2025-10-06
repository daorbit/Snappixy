import { ImageIcon, Plus, FileImage } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  styled,
} from "@mui/material";
import { Badge as MuiBadge } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Styled Badge
const Badge = styled(MuiBadge)({
  fontWeight: 500,
  fontSize: "0.75rem",
  padding: "2px 8px",
  borderRadius: 6,
  border: "1px solid",
  display: "inline-flex",
  alignItems: "center",
});

const activities = [
  {
    id: 1,
    icon: <FileImage size={18} />,
    label: "Optimized",
    labelColor: {
      background: "rgba(5, 150, 105, 0.8)",
      color: "#fff",
      borderColor: "rgba(16, 185, 129, 0.3)",
    },
    title: "vacation-photo.jpg",
    subtitle: "Reduced by 65%",
    time: "2 hours ago",
  },
  {
    id: 2,
    icon: <Plus size={18} />,
    label: "Created",
    labelColor: {
      background: "rgba(37, 99, 235, 0.8)",
      color: "#fff",
      borderColor: "rgba(59, 130, 246, 0.3)",
    },
    title: "Tech Tutorial Thumbnail - YouTube format",
    subtitle: "",
    time: "1 day ago",
  },
  {
    id: 3,
    icon: <ImageIcon size={18} />,
    label: "Optimized",
    labelColor: {
      background: "rgba(147, 51, 234, 0.8)",
      color: "#fff",
      borderColor: "rgba(168, 85, 247, 0.3)",
    },
    title: "product-image.png",
    subtitle: "Converted to WebP",
    time: "2 days ago",
  },
];

const StyledCard = styled(Card)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, rgba(24,24,27,0.5), rgba(39,39,42,0.3))"
      : "#fff",
  border:
    theme.palette.mode === "dark"
      ? "1px solid rgba(63,63,70,0.5)"
      : "1px solid #fff",
  backdropFilter: "blur(6px)",
  borderRadius: 16,
}));

const ActivityItem = styled(Box)(({ theme, borderColor }) => ({
  padding: theme.spacing(2),
  borderRadius: 16,
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(to right, rgba(39,39,42,0.4), rgba(63,63,70,0.2))"
      : "#fff",
  border:
    theme.palette.mode === "dark"
      ? `1px solid ${borderColor}`
      : `1px solid ${borderColor}`,
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor:
      theme.palette.mode === "dark"
        ? "rgba(82,82,91,0.5)"
        : "rgba(100,100,100,0.5)",
    boxShadow: "0 4px 12px rgba(24,24,27,0.2)",
  },
}));

const RecentActivity = () => {
  const theme = useTheme();
  return (
    <StyledCard>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(to right, #3b82f6, #9333ea)", // blue → purple
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ImageIcon size={16} color="#fff" />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.mode === "dark" ? "#f4f4f5" : "#000000",
                fontWeight: 600,
              }}
            >
              Recent Activity
            </Typography>
          </Box>
        }
        sx={{ pb: 1 }}
      />

      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {activities.map((item) => (
          <ActivityItem key={item.id} borderColor={item.labelColor.borderColor}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              gap={2}
            >
              <Box
                display="flex"
                alignItems="center"
                gap={1.5}
                flex={1}
                minWidth={0}
              >
                <Badge
                  sx={{
                    background: item.labelColor.background,
                    color: item.labelColor.color,
                    borderColor: item.labelColor.borderColor,
                  }}
                >
                  {item.label}
                </Badge>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    fontWeight: 500,
                    color:
                      theme.palette.mode === "dark" ? "#e4e4e7" : "#333333",
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
              <Box
                sx={{
                  color: theme.palette.mode === "dark" ? "#a1a1aa" : "#666666",
                  "&:hover": {
                    color:
                      theme.palette.mode === "dark" ? "#d4d4d8" : "#999999",
                  },
                }}
              >
                {item.icon}
              </Box>
            </Box>

            {item.subtitle && (
              <Typography
                variant="body2"
                sx={{ mt: 1, color: "#34d399", fontWeight: 500 }}
              >
                {item.subtitle}
              </Typography>
            )}

            <Typography
              variant="caption"
              sx={{
                mt: 1,
                color: theme.palette.mode === "dark" ? "#71717a" : "#888888",
              }}
            >
              {item.time}
            </Typography>
          </ActivityItem>
        ))}
      </CardContent>
    </StyledCard>
  );
};

export default RecentActivity;
