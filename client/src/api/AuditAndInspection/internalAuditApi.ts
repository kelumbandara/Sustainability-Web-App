import { z } from "zod";

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
});

export type InternalAudit = z.infer<typeof InternalAudit>;

