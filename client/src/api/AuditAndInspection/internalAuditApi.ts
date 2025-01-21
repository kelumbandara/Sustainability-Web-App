import { z } from "zod";

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
  email: z.string(),
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

