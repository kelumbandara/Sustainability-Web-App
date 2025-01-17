import { Document, DocumentType } from "../documentApi";

export const sampleDivisions = [
  {
    id: "div_1",
    name: "Corporate",
  },
  {
    id: "div_2",
    name: "Vintage Denim Ltd",
  },
  {
    id: "div_3",
    name: "Vintage Denim Apparels Ltd.",
  },
  {
    id: "div_4",
    name: "Vintage Denim Studio Ltd.",
  },
  {
    id: "div_5",
    name: "All units",
  },
];

export const sampleDocuments: Document[] = [
  {
    id: "doc_1",
    documentNumber: 1,
    versionNumber: 1,
    documentType: DocumentType.POLICY_AND_PROCEDURES,
    title: "Policy Title",
    division: "Corporate",
    issuingAuthority: "Authority 1",
    documentReviewer: "Reviewer 1",
    issuedDate: new Date("2021-10-10"),
    isNoExpiry: false,
    expiryDate: new Date("2022-10-10"),
    notifyDate: new Date("2022-09-10"),
    createdDate: new Date("2021-10-10"),
    createdBy: "Admin",
    documentHistory: [
      {
        documentNumber: "12",
        issuedDate: new Date("2021-10-10"),
        expiryDate: new Date("2022-10-10"),
        notifyDate: new Date("2022-09-10"),
      },
      {
        documentNumber: "14",
        issuedDate: new Date("2021-10-10"),
        expiryDate: new Date("2022-10-10"),
        notifyDate: new Date("2022-09-10"),
      },
      {
        documentNumber: "15",
        issuedDate: new Date("2021-10-10"),
        expiryDate: new Date("2022-10-10"),
        notifyDate: new Date("2022-09-10"),
      },
    ],
  },
  {
    id: "doc_2",
    documentNumber: 2,
    versionNumber: 1,
    documentType: DocumentType.POLICY_AND_PROCEDURES,
    title: "Policy Title",
    division: "Vintage Denim Ltd",
    issuingAuthority: "Authority 2",
    documentReviewer: "Reviewer 2",
    issuedDate: new Date("2021-10-10"),
    isNoExpiry: false,
    expiryDate: new Date("2022-10-10"),
    notifyDate: new Date("2022-09-10"),
    createdDate: new Date("2021-10-10"),
    createdBy: "Admin",
    documentHistory: [
      {
        documentNumber: "12",
        issuedDate: new Date("2021-10-10"),
        expiryDate: new Date("2022-10-10"),
        notifyDate: new Date("2022-09-10"),
      },
      {
        documentNumber: "14",
        issuedDate: new Date("2021-10-10"),
        expiryDate: new Date("2022-10-10"),
        notifyDate: new Date("2022-09-10"),
      },
      {
        documentNumber: "15",
        issuedDate: new Date("2021-10-10"),
        expiryDate: new Date("2022-10-10"),
        notifyDate: new Date("2022-09-10"),
      },
    ],
    activityStream: [
      {
        date: new Date("2021-10-10 10:00"),
        user: "Admin",
        action: "created a new document",
      },
      {
        date: new Date("2021-10-10 10:00"),
        user: "Admin",
        action: "updated the document",
      },
      {
        date: new Date("2021-10-10 10:00"),
        user: "Admin",
        action: "deleted the document",
      },
    ],
  },
];

export const sampleDepartments = [
  {
    id: "div_1",
    name: "IE",
  },
  {
    id: "div_2",
    name: "Audit",
  },
  {
    id: "div_3",
    name: "Finance & Account",
  },
  {
    id: "div_4",
    name: "3D",
  },
  {
    id: "div_5",
    name: "Store",
  },
  {
    id: "div_6",
    name: "Sample",
  },
  {
    id: "div_7",
    name: "Sewing",
  },
];

export const sampleAsignee = [
  {
    id: "div_1",
    name: "Nafee Udden",
  },
  {
    id: "div_2",
    name: "Mirza Kauzar",
  },
  {
    id: "div_3",
    name: "Duminda Mangala",
  },
  {
    id: "div_4",
    name: "Haroon Haridas",
  },
  {
    id: "div_5",
    name: "Abdul Azeez",
  },
];

export const sampleCategory = [
  {
    id: "div_1",
    name: "Environmantal",
  },
  {
    id: "div_2",
    name: "Safty",
  },
  {
    id: "div_3",
    name: "Health",
  },
];

export const sampleAccidentTypes = [
  {
    id: "div_1",
    name: "Exposire to fire",
  },
  {
    id: "div_2",
    name: "Exposire to Explotion",
  },
  {
    id: "div_3",
    name: "Equipment Failure",
  },
];