import { z } from "zod";
import axios from "axios";
import { StorageFileSchema } from "../../utils/StorageFiles.util";
import { userSchema } from "../userApi";

export const targetSettingsSchema = z.object({
  id: z.string(),
  division: z.string(),
  category: z.string(),
  department: z.string(),
  source: z.string(),
  baseLineConsumption: z.string(),
  ghcEmmision: z.string(),
  problems: z.string(),
  document: z.array(z.union([z.instanceof(File), StorageFileSchema]))
    .optional(),
  action: z.string(),
  possibilityCategory: z.string(),
  opportunity: z.string(),
  implementationCost: z.string(),
  expectedSavings: z.string(),
  targetGhcRedution: z.string(),
  costSaving: z.string(),
  implementationTimeline: z.date(),
  paybackPeriod: z.string(),
  projectLifespan: z.string(),
  responsible: userSchema.optional(),
  approver: userSchema.optional(),
  responsibleId: z.string(),
  approverId: z.string(),
  status: z.string(),
  removeDoc: z.array(z.string()).optional(),

});

export type TargetSettings = z.infer<typeof targetSettingsSchema>;