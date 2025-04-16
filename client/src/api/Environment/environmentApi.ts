import axios from "axios";
import { z } from "zod";
import { StorageFileSchema } from "../../utils/StorageFiles.util";
import { userSchema } from "../userApi";

export const ConsumptionSchema = z.object({
    concumptionsId: z.string(),
    category: z.string(),
    source: z.string(),
    unit: z.string(),
    quentity: z.number(),
    amount: z.number(),
    ghgInTonnes: z.string(),
    methodeOfTracking: z.string(),
    usageType: z.string(),
    doYouHaveREC: z.string(),
    scope: z.string(),
    description: z.string(),
});

export type ConsumptionSchema = z.infer<typeof ConsumptionSchema>;

export const EnvironmentSchema = z.object({
    id: z.string(),
    concumptionsId: z.string(),
    referenceNumber: z.string(),
    division: z.string(),
    totalWorkForce: z.number(),
    numberOfDaysWorked: z.number(),
    consumption: z.array(ConsumptionSchema),
    areaInSquereMeter: z.number(),
    reviewerId:z.string(),
    reviewer: userSchema,
    approverId:z.string(),
    approver:userSchema,
    status: z.string(),
    area: z.string(),
    year: z.string(),
    month: z.string(),
    totalProuctProducedPcs: z.number(),
    totalProuctProducedkg: z.number(),
    createdBy: z.string(),
});

export type Environment = z.infer<typeof EnvironmentSchema>;

export async function createConsumption(data: Environment) {
    const res = await axios.get("/api/sdg-report");
    return res.data;
}

export async function getConsumptionList() {
    const res = await axios.get("/api/sdg-report");
    return res.data;
}

export async function updateConsumption(data: Environment) {
    const res = await axios.get("/api/sdg-report");
    return res.data;
}

export async function deleteConsumption(id: String) {
    const res = await axios.get("/api/sdg-report");
    return res.data;
}