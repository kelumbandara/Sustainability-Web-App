import axios from "axios";
import { z } from "zod";
import { StorageFileSchema } from "../../utils/StorageFiles.util";

export const ImpactSchema = z.object({
    id: z.string(),
    impactType: z.string(),
    unit: z.string(),
    value: z.string(),
});

export type ImpactSchema = z.infer<typeof ImpactSchema>;

export const SustainabilitySchema = z.object({
    id: z.string(),
    referenceNumber: z.string(),
    title: z.string(),
    materialityType: z.array(z.string()),
    materialityIssue: z.array(z.string()),
    pillars: z.array(z.string()),
    sdg: z.string(),
    additionalSdg: z.array(z.string()),
    alignmentSdg: z.string(),
    griStandards: z.string(),
    organizer: z.string(),
    volunteer: z.string(),
    priority: z.string(),
    contributing: z.string(),
    impactDetails: z.array(ImpactSchema),
    documents: z
        .union([z.array(StorageFileSchema), z.array(z.instanceof(File))])
        .optional(),
    timeLines: z.date(),
    dateOfJoin: z.date(),
    location: z.string(),
    division: z.string(),
    status: z.string()

});
export type Sustainability = z.infer<typeof SustainabilitySchema>;

export const createSustainabilityReport = async (sustainability: Sustainability) => {
    const parsedMaterialityType = Array.isArray(sustainability.materialityType) ? sustainability.materialityType : JSON.parse(sustainability.materialityType || "[]");
    const parsedMaterialityIssue = Array.isArray(sustainability.materialityIssue) ? sustainability.materialityIssue : JSON.parse(sustainability.materialityIssue || "[]");
    const parsedPillars = Array.isArray(sustainability.pillars) ? sustainability.pillars : JSON.parse(sustainability.pillars || "[]");
    const parsedAdditionalSdg = Array.isArray(sustainability.additionalSdg) ? sustainability.additionalSdg : JSON.parse(sustainability.additionalSdg || "[]");

    const formData = new FormData();

    Object.keys(sustainability).forEach((key) => {
        const value = sustainability[key];

        if (key === "documents" && Array.isArray(value)) {
            value.forEach((file, index) => {
                formData.append(`documents[${index}]`, file);
            });
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                if (key === "impactDetails") {
                    Object.keys(item).forEach((nestedKey) => {
                        formData.append(
                            `${key}[${index}][${nestedKey}]`,
                            item[nestedKey]?.toString()
                        );
                    });
                } else {
                    formData.append(`${key}[${index}]`, JSON.stringify(item));
                }
            });
        } else if (value instanceof Date) {
            formData.append(key, value.toISOString());
        } else if (value !== null && value !== undefined) {
            formData.append(key, value.toString());
        }
    });

    formData.append("parsedMaterialityType", JSON.stringify(parsedMaterialityType));
    formData.append("parsedMaterialityIssue", JSON.stringify(parsedMaterialityIssue));
    formData.append("parsedPillars", JSON.stringify(parsedPillars));
    formData.append("parsedAdditionalSdg", JSON.stringify(parsedAdditionalSdg));

    try {
        const res = await axios.post("/api/sdg-report", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error creating sustainability report:", error);
        throw error;
    }
};

export const updateSustainabilityReport = async (sustainability: Sustainability) => {
    const formData = new FormData();

    Object.keys(sustainability).forEach((key) => {
        let value = sustainability[key];

        if (["pillars", "materialityType", "materialityIssue", "additionalSdg"].includes(key)) {
            try {
                value = typeof value === "string" ? JSON.parse(value) : value;
            } catch (error) {
                console.warn(`Failed to parse ${key}:`, value);
                value = [];
            }
            value = Array.isArray(value) ? value.map(item => item.replace(/^"|"$/g, "")) : [];
        }

        if (key === "documents" && Array.isArray(value)) {
            value.forEach((file, index) => {
                formData.append(`documents[${index}]`, file);
            });
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                if (typeof item === "object" && item !== null) {
                    Object.keys(item).forEach((nestedKey) => {
                        formData.append(`${key}[${index}][${nestedKey}]`, item[nestedKey]?.toString());
                    });
                } else {
                    formData.append(`${key}[]`, item);
                }
            });
        } else if (value instanceof Date) {
            formData.append(key, value.toISOString());
        } else if (value !== null && value !== undefined) {
            formData.append(key, value.toString());
        }
    });

    try {
        const res = await axios.post(`/api/sdg-report/${sustainability.id}/update`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error updating sustainability report:", error);
        throw error;
    }
};

export const deleteSustainabilityRecord = async (id: string) => {
    const res = await axios.delete(`/api/sdg-report/${id}/delete`);
    return res.data;
};


export async function getSustainabilityList() {
    const res = await axios.get("/api/sdg-report");
    return res.data;
}

export async function getAdditionalSDGList() {
    const res = await axios.get("/api/additional-SDG");
    return res.data;
}

export async function getAlignmentSDGList() {
    const res = await axios.get("/api/alignment-SDG");
    return res.data;
}

export async function getMaterialityissuesList() {
    const res = await axios.get("/api/materiality-issues");
    return res.data;
}

export async function getMaterialitytypeList() {
    const res = await axios.get("/api/materiality-type");
    return res.data;
}

export async function getPillarList() {
    const res = await axios.get("/api/pillars");
    return res.data;
}

export async function getSdgValueList() {
    const res = await axios.get("/api/sdg-value");
    return res.data;
}

export async function getImpactList() {
    const res = await axios.get("/api/impact-type");
    return res.data;
}

export async function fetchImpactUnit(impactType: string) {
    const res = await axios.get(`/api/impact-types/${impactType}/impactUnit`);
    return res.data;
}

