import { z } from "zod";
import axios from "axios";
import { userSchema } from "../userApi";
import { StorageFileSchema } from "../../utils/StorageFiles.util";

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
    announcement: z.nativeEnum(Announcement),
    remarks: z.string(),
    auditStatus: z.string(),
    auditScore: z.string(),
    numberOfNonCom: z.string(),
    gracePeriod: z.string(),
    auditFee: z.string(),
    auditGrade: z.string(),
    documents: z
        .union([z.array(StorageFileSchema), z.array(z.instanceof(File))])
        .optional(),
    responsibleSection: z.string(),
    assigneeLevel: z.string(),
    assessmentDate: z.date(),
    auditExpiryDate: z.date(),
    assesmentDate: z.date(),
    auditorName: z.string(),

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


