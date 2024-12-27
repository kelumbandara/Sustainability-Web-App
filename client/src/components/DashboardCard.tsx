import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

function DashboardCard({
  title,
  titleIcon,
  caption,
  value,
  subDescription,
}: {
  title?: string;
  titleIcon?: ReactNode;
  caption?: string;
  value?: string | number;
  subDescription?: string;
}) {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        width: "100%",
        padding: "1rem",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        borderRadius: "0.3rem",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              marginRight: "0.4rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            {titleIcon}
          </Box>
          {title && (
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "var(--pallet-text-primary)",
                }}
              >
                {title}
              </Typography>
            </Box>
          )}
        </Box>

        {caption && (
          <Typography
            variant="caption"
            sx={{ color: "var(--pallet-text-secondary)" }}
          >
            {caption}
          </Typography>
        )}
      </Box>
      <Box>
        {value && (
          <Typography
            variant="h5"
            sx={{
              color: "var(--pallet-blue)",
              marginX: "0.2rem",
              marginY: "0.3rem",
              fontWeight: 600,
            }}
          >
            {value}
          </Typography>
        )}
      </Box>
      <Box>
        {subDescription && (
          <Typography
            variant="body2"
            sx={{ color: "var(--pallet-text-secondary)", marginX: "0.2rem" }}
          >
            {subDescription}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default DashboardCard;
