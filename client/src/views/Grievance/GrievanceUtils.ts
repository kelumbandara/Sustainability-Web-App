import {
  Frequency,
  HumanRightViolation,
  Scale,
  SeverityLevel,
} from "../../api/Grievance/grievanceApi";

const violationWeights: Record<HumanRightViolation, number> = {
  [HumanRightViolation.ExtrajudicialKilling]: 100,
  [HumanRightViolation.UnlawfulDetention]: 20,
  [HumanRightViolation.Torture]: 9,
  [HumanRightViolation.EnforcedDisappearance]: 10,
  [HumanRightViolation.Censorship]: 4,
  [HumanRightViolation.Intimidation]: 5,
  [HumanRightViolation.Discrimination]: 6,
  [HumanRightViolation.GenderBasedViolence]: 7,
  [HumanRightViolation.ChildLabor]: 8,
  [HumanRightViolation.ForcedLabor]: 9,
  [HumanRightViolation.UnsafeWorkingConditions]: 6,
  [HumanRightViolation.DeniedEducation]: 5,
  [HumanRightViolation.DeniedHealth]: 6,
  [HumanRightViolation.ForcedEviction]: 6,
  [HumanRightViolation.Surveillance]: 4,
  [HumanRightViolation.DataPrivacy]: 3,
};

const scaleWeights: Record<Scale, number> = {
  [Scale.Minor]: 1,
  [Scale.Moderate]: 2,
  [Scale.Severe]: 3,
  [Scale.Critical]: 4,
};

const frequencyWeights: Record<Frequency, number> = {
  [Frequency.OneTime]: 1,
  [Frequency.Occasionally]: 2,
  [Frequency.Frequently]: 3,
  [Frequency.Ongoing]: 4,
  [Frequency.Unknown]: 2,
};

// 2. Calculate weighted severity level
export function getSeverityLevel(
  violation: HumanRightViolation,
  scale: Scale,
  frequency: Frequency
): SeverityLevel {
  const base = violationWeights[violation] || 5;
  const scaleWeight = scaleWeights[scale] || 1;
  const frequencyWeight = frequencyWeights[frequency] || 1;

  const averageWeight = (base + scaleWeight + frequencyWeight) / 3;

  // 3. Map average score to severity level
  if (averageWeight <= 3) return SeverityLevel.Minimal;
  if (averageWeight <= 5) return SeverityLevel.Minor;
  if (averageWeight <= 7) return SeverityLevel.Moderate;
  if (averageWeight <= 8.5) return SeverityLevel.Severe;
  return SeverityLevel.Critical;
}
