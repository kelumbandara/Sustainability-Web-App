import { z } from "zod";
import axios from "axios";

export enum InternalAuditStatus {
  OPEN = "Open",
  DRAFT = "Draft",
}

export const InternalAudit = z.object({
  id: z.string(),
  referenceNumber: z.string(),
  auditDate: z.date(),
  dateApproval: z.date(),
  division: z.string(),
  department: z.string(),
  auditLocation: z.string(),
  auditTitle: z.string(),
  auditType: z.string(),
  factoryName: z.string(),
  factoryAddress: z.string(),
  factoryContact: z.string(),
  designation: z.string(),
  email: z.string().email(),
  contactNumber: z.string(),
  description: z.string(),
  auditee: z.string(),
  approver: z.string(),
  auditStatus: z.number(),
  status: z.string(),
  isNotSupplier: z.boolean(),
  supplierType: z.string(),
  factoryLiNo: z.string(),
  higgId: z.string(),
  zdhcId: z.string(),
  processType: z.string(),
});

export type InternalAudit = z.infer<typeof InternalAudit>;

export async function createAudit(data: InternalAudit) {
  const res = await axios.post("/api/internal-audits", data);
  return res.data;
}

export async function fetchAuditAllData() {
  const res = await axios.get("/api/internal-audits");
  return res.data;
}
