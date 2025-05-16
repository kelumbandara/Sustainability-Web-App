import { Box, Stack, Typography } from "@mui/material";
import welcome from "../../assets/welcomeInsight.png";
import useCurrentUser from "../../hooks/useCurrentUser";
import { getOrganization } from "../../api/OrganizationSettings/organizationSettingsApi";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

function Insight() {
  const { user } = useCurrentUser();

  const { data: organizationData } = useQuery({
    queryKey: ["organization"],
    queryFn: getOrganization,
  });

  console.log("yoo", organizationData?.[0].insightImage);
  const insightImage = useMemo(() => {
    if (organizationData && organizationData[0]?.insightImage) {
      return Array.isArray(organizationData[0].insightImage)
        ? organizationData[0].insightImage[0]
        : organizationData[0].insightImage;
    }
  }, [organizationData]);

  const insightDescription = useMemo(() => {
    if (organizationData && organizationData[0]?.insightDescription) {
      return Array.isArray(organizationData[0].insightDescription)
        ? organizationData[0].insightDescription[0]
        : organizationData[0].insightDescription;
    }
  }, [organizationData]);

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
        src={insightImage?.signedUrl}
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
        {insightDescription}
      </Typography>
    </Stack>
  );
}

export default Insight;
