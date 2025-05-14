import axios from "axios";
import { z } from "zod";
import { StorageFileSchema } from "../../utils/StorageFiles.util";

export const ColorPalletSchema = z.object({
  palletId: z.number(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  buttonColor: z.string(),
});
export type ColorPallet = z.infer<typeof ColorPalletSchema>;

export const OrganizationSchema = z.object({
  organizationId: z.number(),
  organizationName: z.string(),
  logoUrl: z.array(z.union([z.instanceof(File), StorageFileSchema])).optional(),
  insightDescription: z.string(),
  colorPallet: ColorPalletSchema,
  insightImage: z
    .array(z.union([z.instanceof(File), StorageFileSchema]))
    .optional(),
    created_at: z.date()
});
export type Organization = z.infer<typeof OrganizationSchema>;
