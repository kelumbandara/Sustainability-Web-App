import { z } from "zod";
import axios from "axios";
import { userSchema } from "../userApi";

export enum Announcement {
    ANNOUNCED = "Announced",
    SEMI_ANNOUNCED = "Semi Announced",
    UN_ANNOUNCED = "Un Announced",
}

export const ExternalAuditSchema = z.object({
    id: z.string(),
    referenceNumber: z.string(),
    auditType: z.string(),
    auditCategory: z.string(),
    customer: z.string(),
    auditStandard: z.string(),
    auditFirm: z.string(),
    division: z.string(),
    auditDate: z.date(),
    approvalDate: z.date(),
    approver: userSchema,
    approverId: z.string(),
    representer: userSchema,
    created_At: z.date(),
    createdBy: z.string(),
    status: z.string(),
    expiryDate: z.date(),
    announcement: z.nativeEnum(Announcement)
});

export type ExternalAudit = z.infer<typeof ExternalAuditSchema>;

export async function createExternalAudit(data: ExternalAudit) {
    const res = await axios.post("/api/external-audit", data)
}
export async function updateExternalAudit(data: ExternalAudit) {
    const res = await axios.post("/api/external-audit", data)
}
export async function deleteExternalAudit(id: string) {
    const res = await axios.post(`/api/external-audit/${id}/delete`)
}
export async function getExternalAuditData() {
    const res = await axios.get("/api/external-audit");
    return res.data;
}
export async function getExternalAssignedAudit() {
    const res = await axios.get("/api/external-audit-assigned-audit");
    return res.data;
}


