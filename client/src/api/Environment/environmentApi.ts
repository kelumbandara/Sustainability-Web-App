import axios from "axios";
import { z } from "zod";
import { StorageFileSchema } from "../../utils/StorageFiles.util";
import { userSchema } from "../userApi";

export const SustainabilitySchema = z.object({
    id: z.string(),
    referenceNumber: z.string(),
    division: z.string(),
    workForce: z.number(),
    daysWorked: z.number(),
    area: z.number(),
    reviewerId:
    reviewer: userSchema
    approverId:z.string(),
    approver:
    status:z.string(),
});