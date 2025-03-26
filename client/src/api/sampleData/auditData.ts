export const sampleAuditData = [
    {
      id: "1",
      referenceNumber: "AUD-001",
      auditDate: new Date("2025-02-15T09:30:00Z"),
      created_At: new Date("2024-03-01T10:00:00Z"),
      approvalDate: new Date("2024-03-01T10:00:00Z"),
      expiryDate: new Date("2025-03-01T10:00:00Z"),
      auditType: "Internal",
      auditCategory: "Quality",
      auditStandard: "ISO 9001",
      customer: "ABC Corp",
      auditFirm: "XYZ Auditors",
      division: "Manufacturing",
      auditStatus: "Completed",
      lapsedStatus: "Active",
      status: "Approved",
      createdBy: "Mama Thama",
      announcement: "Announced",
      approver:{
        name: "Akila"
      },
      representer:{
        name: "Akila"
      }
    },
    {
      id: "2",
      referenceNumber: "AUD-002",
      created_At: new Date("2024-02-15T09:30:00Z"),
      expiryDate: new Date("2025-02-15T09:30:00Z"),
      approvalDate: new Date("2024-03-01T10:00:00Z"),
      auditDate: new Date("2025-02-15T09:30:00Z"),
      auditType: "External",
      auditCategory: "Safety",
      auditStandard: "OSHA",
      customer: "XYZ Ltd",
      auditFirm: "DEF Compliance",
      division: "Operations",
      auditStatus: "In Progress",
      lapsedStatus: "Pending",
      status: "Under Review",
      createdBy: "Mama Newe",
      announcement: "Semi Announced",
      approver:{
        name: "Akila"
      },
      representer:{
        name: "Akila"
      }
    },
    {
      id: "3",
      referenceNumber: "AUD-003",
      auditDate: new Date("2025-02-15T09:30:00Z"),
      created_At: new Date("2024-01-20T08:45:00Z"),
      approvalDate: new Date("2024-03-01T10:00:00Z"),
      expiryDate: new Date("2025-01-20T08:45:00Z"),
      auditType: "Supplier",
      auditCategory: "Environmental",
      auditStandard: "ISO 14001",
      customer: "LMN Industries",
      auditFirm: "GHI Assessors",
      division: "Logistics",
      auditStatus: "Scheduled",
      lapsedStatus: "Upcoming",
      status: "Pending Approval",
      createdBy: "Mama Newe Thama",
      announcement: "Un Announced",
      approver:{
        name: "Akila"
      },
      representer:{
        name: "Akila"
      }
    },
  ];
  