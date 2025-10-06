import { Card, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Clock, ImageIcon, TrendingUp, Wand2 } from "lucide-react";

const StyledCard = styled(Card)<{ bordercolor: string; bggradient: string }>(
  ({ theme, bordercolor, bggradient }) => ({
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: bordercolor,
    background: `linear-gradient(135deg, ${theme.palette.background.paper}E6, ${theme.palette.background.paper}B3), ${bggradient}`,
    backdropFilter: "blur(6px)",
    transition: "all 0.3s ease-out",
    boxShadow:"none",
    "&:hover": {
      transform: "scale(1.01)",
      boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
      borderColor: bordercolor.replace("50", "400"),
    },
  })
);

const IconWrapper = styled("div")<{ color: string }>(({ theme, color }) => ({
  padding: "12px",
  borderRadius: "12px",
  background:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.05)"
      : "rgba(0,0,0,0.05)",
  border:
    theme.palette.mode === "dark"
      ? "1px solid rgba(255,255,255,0.1)"
      : "1px solid rgba(0,0,0,0.1)",
  backdropFilter: "blur(4px)",
  color: color,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const DashboardMiniCards = () => {
  const stats = [
    {
      title: "Images Optimized",
      value: "24",
      icon: ImageIcon,
      borderColor: "#3b82f680",
      iconColor: "#60a5fa",
      bgGradient:
        "linear-gradient(135deg, rgba(59,130,246,0.05), rgba(37,99,235,0.05))",
    },
    {
      title: "Thumbnails Created",
      value: "12",
      icon: Wand2,
      borderColor: "#a855f780",
      iconColor: "#a78bfa",
      bgGradient:
        "linear-gradient(135deg, rgba(168,85,247,0.05), rgba(147,51,234,0.05))",
    },
    {
      title: "Space Saved",
      value: "2.4 MB",
      icon: TrendingUp,
      borderColor: "#22c55e80",
      iconColor: "#4ade80",
      bgGradient:
        "linear-gradient(135deg, rgba(34,197,94,0.05), rgba(21,128,61,0.05))",
    },
    {
      title: "Processing Time",
      value: "3.2 min",
      icon: Clock,
      borderColor: "#f9731680",
      iconColor: "#fb923c",
      bgGradient:
        "linear-gradient(135deg, rgba(249,115,22,0.05), rgba(194,65,12,0.05))",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "24px",
        marginBottom: "32px",
      }}
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <StyledCard
            key={index}
            bordercolor={stat.borderColor}
            bggradient={stat.bgGradient}
          >
            <CardContent sx={{ position: "relative", p: 3 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                }}
              >
                <IconWrapper color={stat.iconColor}>
                  <Icon size={24} strokeWidth={2} />
                </IconWrapper>

                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "1.875rem",
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      color: "inherit",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      opacity: 0.7,
                    }}
                  >
                    {stat.title}
                  </div>
                </div>
              </div>

              <div
                style={{
                  height: "2px",
                  width: "0%",
                  background: `linear-gradient(to right, ${stat.iconColor}99, transparent)`,
                  transition: "width 0.5s ease-out",
                }}
                className="hover-line"
              />
            </CardContent>
          </StyledCard>
        );
      })}
    </div>
  );
};

export default DashboardMiniCards;
