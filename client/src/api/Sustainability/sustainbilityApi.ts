import { z } from "zod";

export const Sustainability = z.object({
    id: z.string(),
    referenceNumber: z.string(),
    location: z.string(),
    division: z.string(),
    sdgDetails: z.string(),
    pillars: z.record(z.string()),
    timeLine: z.date(),
    status: z.string(),
    actions: z.string(),
    title: z.string(),
    additionalSdg: z.record(z.string()),
    alignment: z.string(),
    griStandards: z.string(),
    materiality: z.record(z.string()),
    materialIssue: z.string(),
    organizer: z.string(),
    volunteer: z.string(),
    priorityDescription: z.string(),
    contributeDescription: z.string(),
    
});

export type Sustainability = z.infer<typeof Sustainability>;
