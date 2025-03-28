import { Box, Stack, Typography } from "@mui/material";
import welcome from "../../assets/welcomeInsight.png";
import useCurrentUser from "../../hooks/useCurrentUser";

function Insight() {
  const { user } = useCurrentUser();
  return (
    <Stack>
      <Typography
        variant="h3"
        align="center"
        sx={{ mt: 2, mb: 2, fontWeight: "bold", color: "var(--pallet-orange)" }}
      >
        {`Welcome ${user?.name}!`}
      </Typography>
      <Box
        component="img"
        src={welcome}
        alt="Under Development"
        sx={{
          height: "auto",
          width: "60vw",
          maxHeight: "50vh",
          objectFit: "contain",
          justifySelf: "center",
          alignSelf: "center",
        }}
      />
      <Typography
        variant="body1"
        align="center"
        sx={{ mt: 2, color: "var(--pallet-main-blue)" }}
      >
        We are glad to have you here. Explore the insights and make informed
      </Typography>
    </Stack>
  );
}

export default Insight;
