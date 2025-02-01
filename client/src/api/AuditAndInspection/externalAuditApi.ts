import { z } from "zod";
import axios from "axios";

export const ExternalAudit = z.object({
  id: z.string(),
  referenceNumber: z.string(),
  auditDate: z.date(),
  dateApproval: z.date(),
  expiryDate: z.date(),
  division: z.string(),
  auditCategory: z.string(),
  customer: z.string(),
  auditStandard: z.string(),
  auditFirm: z.string(),
  approver: z.string(),
  representative: z.string(),
  announcement: z.string(),
  auditType: z.string(),
  auditStatus: z.number(),
  status: z.string(),
  lapsedStatus: z.string(),
});

export type ExternalAudit = z.infer<typeof ExternalAudit>;

export async function createExternalAudit(data: ExternalAudit) {
  const res = await axios.post("/api/external-audits", data);
  return res.data;
}

export async function fetchAuditAllExternalData() {
  const res = await axios.get("/api/external-audits");
  return res.data;
}