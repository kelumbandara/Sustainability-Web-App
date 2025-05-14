import { defaultAdminPermissions } from "../../views/Administration/SectionList";
import { User } from "../userApi";

export const sampleAssignees = [
  {
    id: "1",
    name: "John Doe",
  },
  {
    id: "2",
    name: "Jane Doe",
  },
  {
    id: "3",
    name: "John Smith",
  },
  {
    id: "4",
    name: "Jane Smith",
  },
];

export const sampleUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "johnd@gmail.com",
    mobile: "1234567890",
    emailVerifiedAt: "2021-10-10",
    status: "Active",
    isCompanyEmployee: true,
    createdAt: "2021-10-10",
    updatedAt: "2021-10-10",
    department: "IT",
    assignedFactory: ["1", "2"],
    jobPosition: "Software Engineer",
    role: "Admin",
    roleId: "1",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "janeD@gmail.com",
    mobile: "1234567890",
    role: "Manager",
    roleId: "2",
    emailVerifiedAt: "2021-10-10",
    status: "Active",
    isCompanyEmployee: true,
    createdAt: "2021-10-10",
    updatedAt: "2021-10-10",
    department: "IT",
    assignedFactory: ["1", "2"],
    jobPosition: "Associate Software Engineer",
  },
];

export const sampleRoles = [
  {
    id: "1",
    name: "Admin",
    description: "Admin role",
    accessSettings: defaultAdminPermissions,
  },
  {
    id: "2",
    name: "Manager",
    description: "Manager role",
    accessSettings: defaultAdminPermissions,
  },
];

export const sampleOrganization = [
  {
    id: 1,
    logoUrl: [
      {
        fileName: "681c9863425b5_map.png",
        imageUrl: "https://example.com/681c9863425b5_map.png",
      },
    ],
    organizationName: "ABA GROUP",
    insightImage: [
      {
        fileName: "681c9863425b5_map.png",
        imageUrl: "https://example.com/681c9863425b5_map.png",
      },
    ],
    insightDescription: "Hi",
    colorPallet: [
      {
        primaryColor: "#1E3A8A",
        secondaryColor: "#60A5FA",
        buttonColor: "#10B981",
      },
    ],
  },
];
