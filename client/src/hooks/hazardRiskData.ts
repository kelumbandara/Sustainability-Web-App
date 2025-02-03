import { useQuery } from "@tanstack/react-query";
import { HazardAndRisk, fetchHazardRiskData } from "../api/hazardRiskApi"; // Ensure this import is correct

interface HazardAndRiskResult {
  HazardAndRisk: HazardAndRisk;
  status: "idle" | "loading" | "error" | "success" | "pending";
}

function hazardAndRiskData(): HazardAndRiskResult {
  const { data, status } = useQuery<HazardAndRisk>({
    queryKey: ["hazardAndRiskData"],
    queryFn: fetchHazardRiskData,
  });

  return { HazardAndRisk: data, status };
}

export default hazardAndRiskData;
