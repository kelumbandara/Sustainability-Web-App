export const sampleExternalAuditData = [
    {
        id: "1",
        referenceNumber: "EUD-8",
        auditDate: new Date("Thu Jan 23 2025 00:00:00 GMT+0530"),
        dateApproval: new Date("2024-11-26T09:20:00.000Z"),
        expiryDate: new Date("2024-11-26T09:20:00.000Z"),
        division: "Vintage Denim Studio Ltd.",
        auditType: "Company",
        auditCategory: "Security",
        auditStandard: "European Flax",
        customer: "Leon S Kennady",
        auditFirm: "Intertek Bangladesh",
        auditStatus: 75,
        lapsedStatus: "",
        status: "scheduled",
        announcement: "Announced",
        approver: "John Cena",     
        representative: "John Keells"
    },
];

export enum Announcement {
    ANNOUNCED = "Announced",
    UNANNOUNCED = "Unannounced",
    SEMI_ANNOUNCED = "Semi-Announced",
}

export const sampleAuditFirm = [
{
    id: "1",
    name: "Audit Company 01",
},
{
    id: "2",
    name: "Audit Company 02",
}
];