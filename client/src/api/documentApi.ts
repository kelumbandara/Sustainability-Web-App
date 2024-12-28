import { z } from "zod";

export enum DocumentType {
  CERTIFICATE_AND_AUDIT = "Certificate and Audit",
  GENERAL = "General",
  RISK_ASSESSMENT = "Risk Assessment",
  POLICY_AND_PROCEDURES = "Policy and Procedures",
  LEGAL_AND_STATUTORY = "Legal and Statutory",
}

export const DocumentHistoryItemSchema = z.object({
  documentNumber: z.string(),
  issuedDate: z.date(),
  expiryDate: z.date(),
  notifyDate: z.date(),
});

export type DocumentHistoryItem = z.infer<typeof DocumentHistoryItemSchema>;

export const ActivityStreamSchema = z.object({
  action: z.string(),
  date: z.date(),
  user: z.string(),
});

export const DocumentSchema = z
  .object({
    id: z.string().optional(),
    documentNumber: z.number(),
    versionNumber: z.number(),
    documentType: z.nativeEnum(DocumentType),
    title: z.string(),
    division: z.string(),
    issuingAuthority: z.string(),
    documentOwner: z.string().optional(),
    documentReviewer: z.string(),
    physicalLocation: z.string().optional(),
    remarks: z.string().optional(),
    document: z
      .array(z.union([z.string().url(), z.instanceof(File)]))
      .optional(),
    issuedDate: z.date(),
    isNoExpiry: z.boolean(),
    expiryDate: z.date().optional(),
    notifyDate: z.date().optional(),
    createdDate: z.date().optional(),
    createdBy: z.string().optional(),
    documentHistory: z.array(DocumentHistoryItemSchema).optional(),
    activityStream: z.array(ActivityStreamSchema).optional(),
  })
  .refine((data) => data.isNoExpiry || (data.expiryDate && data.notifyDate), {
    message: "expiryDate and notifyDate are required when isNoExpiry is false",
    path: ["expiryDate", "notifyDate"], // Set the path of the error
  });

export type Document = z.infer<typeof DocumentSchema>;
