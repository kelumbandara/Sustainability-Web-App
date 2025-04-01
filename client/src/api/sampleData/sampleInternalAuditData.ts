import {
  Auditee,
  Factory,
  InternalAudit,
  InternalAuditQuestionAnswersStatus,
  InternalAuditQuestionGroup,
  InternalAuditType,
  ScheduledInternalAudit,
  ScheduledInternalAuditStatus,
  SupplierType,
} from "../AuditAndInspection/internalAudit";
import { sampleUsers } from "./usersSampleData";

export const sampleInternalAuditQuestions: InternalAuditQuestionGroup[] = [
  {
    id: "1",
    auditId: "1",
    name: "Health and Safety",
    questions: [
      {
        id: "1",
        question: "Is the factory following the health and safety guidelines?",
        colorCode: "red",
        allocatedScore: 10,
      },
      {
        id: "2",
        question: "Is the factory following the health and safety guidelines?",
        colorCode: "green",
        allocatedScore: 10,
      },
      {
        id: "3",
        question: "Is the factory following the health and safety guidelines?",
        colorCode: "yellow",
        allocatedScore: 10,
      },
      {
        id: "4",
        question: "Is the factory following the health and safety guidelines?",
        colorCode: "red",
        allocatedScore: 10,
      },
      {
        id: "5",
        question: "Is the factory following the health and safety guidelines?",
        colorCode: "green",
        allocatedScore: 10,
      },
    ],
  },
  {
    id: "2",
    auditId: "1",
    name: "Environmental Management",
    questions: [
      {
        id: "1",
        question:
          "Is the factory following the environmental management guidelines?",
        colorCode: "red",
        allocatedScore: 10,
      },
      {
        id: "2",
        question:
          "Is the factory following the environmental management guidelines?",
        colorCode: "green",
        allocatedScore: 15,
      },
      {
        id: "3",
        question:
          "Is the factory following the environmental management guidelines?",
        colorCode: "yellow",
        allocatedScore: 15,
      },
    ],
  },
];

export const sampleInternalAudits: InternalAudit[] = [
  {
    id: "1",
    name: "Internal Audit 1",
    createdAt: new Date(),
    createdBy: sampleUsers[0],
    questionGroups: sampleInternalAuditQuestions,
    totalNumberOfQuestions: 8,
    achievableScore: 90,
    description:
      "This is a sample internal audit description. This is a sample internal audit description. This is a sample internal audit description.",
  },
  {
    id: "2",
    name: "Internal Audit 2",
    createdAt: new Date(),
    createdBy: sampleUsers[0],
    questionGroups: sampleInternalAuditQuestions,
    totalNumberOfQuestions: 8,
    achievableScore: 90,
    description:
      "This is a sample internal audit description. This is a sample internal audit description. This is a sample internal audit description.",
  },
  {
    id: "3",
    name: "Internal Audit 3",
    createdAt: new Date(),
    createdBy: sampleUsers[0],
    questionGroups: sampleInternalAuditQuestions,
    totalNumberOfQuestions: 8,
    achievableScore: 90,
    description:
      "This is a sample internal audit description. This is a sample internal audit description. This is a sample internal audit description.",
  },
];

export const sampleFactories: Factory[] = [
  {
    id: "1",
    name: "Factory 1",
    email: "samplefac@gg.cc",
  },
  {
    id: "2",
    name: "Factory 2",
    email: "smaple2fac@gg.cc",
  },
];

export const sampleAuditees: Auditee[] = [
  {
    id: "1",
    name: "Auditee 1",
    email: "auditee1@gg.cc",
  },
  {
    id: "2",
    name: "Auditee 2",
    email: "auditee2@gg.cc",
  },
];

export const sampleScheduledInternalAudits: ScheduledInternalAudit[] = [
  {
    id: "1",
    auditDate: new Date("2024-01-20"),
    division: "div1",
    department: ["dep1", "dep2"],
    audit: sampleInternalAudits[0],
    auditId: "1",
    auditType: InternalAuditType.COMPANY,
    isAuditScheduledForSupplier: true,
    factoryName: sampleFactories[0].name,
    factoryId: sampleFactories[0].id,
    factoryEmail: sampleFactories[0].email,
    factoryContactNumber: sampleFactories[0].contactNumber,
    factory: sampleFactories[0],
    supplierType: SupplierType.TIER_1,
    factoryLicenseNo: "111",
    higgId: "222",
    zdhcId: "3c2",
    processType: "sample process",
    description: "sample description",
    auditee: sampleAuditees[0],
    auditeeId: sampleAuditees[0].id,
    approver: sampleUsers[0],
    approverId: sampleUsers[0].id,
    dateForApproval: new Date(),
    createdBy: sampleUsers[1],
    auditStatus: "10%",
    status: ScheduledInternalAuditStatus.DRAFT,
  },

  {
    id: "2",
    auditDate: new Date("2024-01-20"),
    division: "div1",
    department: ["dep1", "dep2"],
    audit: sampleInternalAudits[0],
    auditId: "1",
    auditType: InternalAuditType.COMPANY,
    isAuditScheduledForSupplier: true,
    factoryName: sampleFactories[0].name,
    factoryId: sampleFactories[0].id,
    factoryEmail: sampleFactories[0].email,
    factoryContactNumber: sampleFactories[0].contactNumber,
    factory: sampleFactories[0],
    supplierType: SupplierType.TIER_1,
    factoryLicenseNo: "111",
    higgId: "222",
    zdhcId: "3c2",
    processType: "sample process",
    description: "sample description",
    auditee: sampleAuditees[0],
    auditeeId: sampleAuditees[0].id,
    approver: sampleUsers[0],
    approverId: sampleUsers[0].id,
    dateForApproval: new Date(),
    createdBy: sampleUsers[1],
    auditStatus: "10%",
    status: ScheduledInternalAuditStatus.SCHEDULED,
  },
  {
    id: "3",
    auditDate: new Date("2024-01-20"),
    division: "div1",
    department: ["dep1", "dep2"],
    audit: sampleInternalAudits[0],
    auditId: "1",
    auditType: InternalAuditType.COMPANY,
    isAuditScheduledForSupplier: true,
    factoryName: sampleFactories[0].name,
    factoryId: sampleFactories[0].id,
    factoryEmail: sampleFactories[0].email,
    factoryContactNumber: sampleFactories[0].contactNumber,
    factory: sampleFactories[0],
    supplierType: SupplierType.TIER_1,
    factoryLicenseNo: "111",
    higgId: "222",
    zdhcId: "3c2",
    processType: "sample process",
    description: "sample description",
    auditee: sampleAuditees[0],
    auditeeId: sampleAuditees[0].id,
    approver: sampleUsers[0],
    approverId: sampleUsers[0].id,
    dateForApproval: new Date(),
    createdBy: sampleUsers[1],
    auditStatus: "10%",
    status: ScheduledInternalAuditStatus.COMPLETED,
    answeredQuestionCount: 5,
    earnedScore: 50,
    earnedScorePercentage: 50,
    auditAnswers: [
      {
        id: "1",
        auditId: "1",
        questionGroupId: "1",
        answers: [
          {
            id: "1",
            questionId: "1",
            score: 5,
            status: InternalAuditQuestionAnswersStatus.YES,
          },
          {
            id: "2",
            questionId: "2",
            score: 5,
            status: InternalAuditQuestionAnswersStatus.YES,
          },
          {
            id: "3",
            questionId: "3",
            score: 5,
            status: InternalAuditQuestionAnswersStatus.PARTIAL_YES,
          },
        ],
      },
      {
        id: "2",
        auditId: "1",
        questionGroupId: "2",
        answers: [
          {
            id: "4",
            questionId: "1",
            score: 5,
            status: InternalAuditQuestionAnswersStatus.YES,
          },
          {
            id: "5",
            questionId: "2",
            score: 5,
            status: InternalAuditQuestionAnswersStatus.NO,
          },
        ],
      },
    ],
  },
];
