import { Sparkles, Rocket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Box, Grid, Typography, Button, styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface ActionCardProps {
  iconBg: string;
  hoverbg?: string;
  iconColor?: string;
}

const ActionCard = styled(Box)<ActionCardProps>(
  ({ theme, iconBg, iconColor }) => ({
    position: "relative",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(23,23,23,0.5)"
        : "rgba(255,255,255,0.5)",
    backdropFilter: "blur(8px)",
    border: `1px solid ${iconBg}`,
    borderRadius: 16,
    padding: theme.spacing(4),
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark" ? "rgba(38,38,38,0.5)" : "#fff",
      borderColor: `${iconColor}`,
      transform: "translateY(1.01)",
      boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
    },
    "& .hoverOverlay": {
      position: "absolute",
      inset: 0,
      borderRadius: 16,
      background:
        theme.palette.mode === "dark"
          ? "linear-gradient(to bottom right, rgba(38,38,38,0.1), transparent)"
          : "linear-gradient(to bottom right, rgba(200,200,200,0.1), transparent)",
      opacity: 0,
      transition: "opacity 0.3s ease",
    },
    "&:hover .hoverOverlay": {
      opacity: 1,
    },
  })
);

const IconWrapper = styled(Box)<{
  bgcolor: string;
  hoverbg: string;
  color: string;
}>(({ theme, bgcolor, hoverbg, color }) => ({
  marginRight: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: 16,
  backgroundColor: bgcolor,
  color,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
  ".MuiCard-root:hover &": {
    backgroundColor: hoverbg,
    transform: "scale(1.1)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: "100%",
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(38,38,38,0.8)" : "#fff",
  color:
    theme.palette.mode === "dark" ? "rgba(229,229,229,1)" : "rgba(0,0,0,1)",
  borderRadius: 8,
  padding: theme.spacing(1),
  fontWeight: 600,
  fontSize: "1rem",
  backdropFilter: "blur(6px)",
  border:
    theme.palette.mode === "dark"
      ? "1px solid rgba(64,64,64,0.5)"
      : "1px solid rgba(150,150,150,0.5)",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1),
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(64,64,64,0.9)" : "#fff",
    color: theme.palette.mode === "dark" ? "#fff" : "#000",
    borderColor:
      theme.palette.mode === "dark"
        ? "rgba(82,82,82,1)"
        : "1px solid rgba(150,150,150,0.5)",
    boxShadow: "none",
  },
}));

const QuickActionsSection = () => {
  const theme = useTheme();
  const quickActions = [
    {
      title: "AI Image Optimizer",
      description:
        "Compress and enhance your images with AI for faster loading speeds. Maintain top-notch quality while reducing file sizes dramatically.",
      link: "/optimizer",
      buttonText: "Start Optimizing",
      icon: <Rocket size={24} />,
      iconColor: "#60A5FA",
      iconBg: "rgba(59,130,246,0.1)",
      hoverIconBg: "rgba(59,130,246,0.2)",
    },
    {
      title: "Smart Thumbnail Creator",
      description:
        "Instantly generate engaging, professional thumbnails powered by AI. Boost your content’s reach with designs built to grab attention.",
      link: "/thumbnail-creator",
      buttonText: "Create Thumbnails",
      icon: <Sparkles size={24} />,
      iconColor: "#C084FC",
      iconBg: "rgba(168,85,247,0.1)",
      hoverIconBg: "rgba(168,85,247,0.2)",
    },
  ];

  return (
    <Box sx={{ maxWidth: "100%", mx: "auto" }}>
      <Grid container spacing={{ xs: 2, md: 3, lg: 4 }}>
        {quickActions.map((action, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={index}>
            <ActionCard
              iconBg={action.iconBg}
              hoverbg={action.hoverIconBg}
              iconColor={action.iconColor}
            >
              <Box className="hoverOverlay" />

              <Box display="flex" alignItems="flex-start" mb={3}>
                <IconWrapper
                  bgcolor={action.iconBg}
                  hoverbg={action.hoverIconBg}
                  color={action.iconColor}
                >
                  {action.icon}
                </IconWrapper>
                <Box flex={1}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color={
                      theme.palette.mode === "dark"
                        ? theme.palette.common.white
                        : theme.palette.common.black
                    }
                    sx={{ mb: 1, transition: "color 0.3s" }}
                  >
                    {action.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        theme.palette.mode === "dark"
                          ? "rgba(156,163,175,1)"
                          : "rgba(100,100,100,1)",
                      transition: "color 0.3s",
                    }}
                  >
                    {action.description}
                  </Typography>
                </Box>
              </Box>

              <Link to={action.link}>
                <StyledButton endIcon={<ArrowRight size={18} />}>
                  {action.buttonText}
                </StyledButton>
              </Link>
            </ActionCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuickActionsSection;
