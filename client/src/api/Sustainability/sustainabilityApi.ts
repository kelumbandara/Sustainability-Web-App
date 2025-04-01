import axios from "axios";
import { z } from "zod";
import { StorageFileSchema } from "../../utils/StorageFiles.util";

export const ImpactSchema = z.object({
    id: z.string(),
    impactType: z.string(),
    unit: z.string(),
    value: z.string(),
});

export type ImpactSchema = z.infer<typeof ImpactSchema>;

export const SustainabilitySchema = z.object({
    id: z.string(),
    referenceNumber: z.string(),
    title: z.string(),
    materialityType: z.array(z.string()),
    materialityIssue: z.array(z.string()),
    pillars: z.array(z.string()),
    sdg: z.string(),
    additionalSdg: z.array(z.string()),
    alignmentSdg: z.string(),
    griStandards: z.string(),
    organizer: z.string(),
    volunteer: z.string(),
    priority: z.string(),
    impact: z.array(ImpactSchema),
    document: z.
        union([z.array(StorageFileSchema), z.array(z.instanceof(File))])
        .optional(),
    projectDate: z.date(),
    dateOfJoin: z.date(),
    projectLocation: z.string(),
    division: z.string(),
    status: z.string()

});



export type Sustainability = z.infer<typeof SustainabilitySchema>;