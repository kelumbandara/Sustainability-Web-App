import {
  IncidentSeverity,
  Incident,
  IncidentTypeOfConcern,
  IncidentTypeOfNearMiss,
  IncidentFactors,
} from "../accidentAndIncidentApi";

export const circumstancesOptions = [
  "Illness",
  "Injury",
  "Non-Injury",
  "Non-Property Damage",
  "Property Damage",
];

export const sampleIncidentData: Incident[] = [
  {
    id: "1",
    referenceNumber: "ACD-8",
    incidentDate: new Date("2024-11-18"),
    incidentTime: new Date("2024-11-26T09:20:00.000Z"),
    severity: IncidentSeverity.LOW,
    division: "Vintage Denim Studio Ltd.",
    location: "Finishing",
    supervisorName: "Md. Atiyar",
    reportedDate: "2024-11-26",
    orgId: "428cba75",
    evidenceType: "",
    evidenceName: "",
    evidenceId: null,
    status: "Completed",
    createdAt: "2024-11-26T10:52:40.245Z",
    updatedAt: "2024-11-27T03:49:03.510Z",
    publishedAt: "2024-11-26T10:52:40.222Z",
    circumstances: "Fell off the ladder",
    typeOfConcern: IncidentTypeOfConcern.OTHER,
    typeOfNearMiss: IncidentTypeOfNearMiss.SAFETY_IDEA_SUGGESTION,
    factors: IncidentFactors.EQUIPMENT_TOOLS,
  },
  {
    id: "2",
    referenceNumber: "ACD-9",
    incidentDate: new Date("2024-11-18"),
    incidentTime: new Date("2024-11-26T09:20:00.000Z"),
    severity: IncidentSeverity.LOW,
    division: "Vintage Denim Studio Ltd.",
    location: "Finishing",
    supervisorName: "Md. Atiyar",
    reportedDate: "2024-11-26",
    orgId: "428cba75",
    evidenceType: "",
    evidenceName: "",
    evidenceId: null,
    status: "Completed",
    createdAt: "2024-11-26T10:52:40.245Z",
    updatedAt: "2024-11-27T03:49:03.510Z",
    publishedAt: "2024-11-26T10:52:40.222Z",
    circumstances: "Fell off the ladder",
    typeOfConcern: IncidentTypeOfConcern.OTHER,
    typeOfNearMiss: IncidentTypeOfNearMiss.SAFETY_IDEA_SUGGESTION,
    factors: IncidentFactors.EQUIPMENT_TOOLS,
  },
];
