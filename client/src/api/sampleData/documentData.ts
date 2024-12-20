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
  },
  //   {
  //     id: "doc_3",
  //     documentNumber: 3,
  //     versionNumber: 1,
  //     documentType: DocumentType.POLICY_AND_PROCEDURES,
  //     title: "Policy Title",
  //     division: "Vintage Denim Apparels Ltd.",
  //     issuingAuthority: "Authority 3",
  //     documentReviewer: "Reviewer 3",
  //     issuedDate: new Date("2021-10-10"),
  //     isNoExpiry: false,
  //     expiryDate: new Date("2022-10-10"),
  //     notifyDate: new Date("2022-09-10"),
  //   },
  //   {
  //     id: "doc_4",
  //     documentNumber: 4,
  //     versionNumber: 1,
  //     documentType: DocumentType.POLICY_AND_PROCEDURES,
  //     title: "Policy Title",
  //     division: "Vintage Denim Studio Ltd.",
  //     issuingAuthority: "Authority 4",
  //     documentReviewer: "Reviewer 4",
  //     issuedDate: new Date("2021-10-10"),
  //     isNoExpiry: false,
  //     expiryDate: new Date("2022-10-10"),
  //     notifyDate: new Date("2022-09-10"),
  //   },
];
