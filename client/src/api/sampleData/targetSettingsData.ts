export const targetSettingsData = [
    {
        id: "doc_1",
        division: "Cutting",
        category: "Energy",
        department: "Production",
        source: "Electricity",
        baseLineConsumption: "15000 kWh",
        ghcEmmision: "12 tons",
        problems: "High energy usage during idle time",
        documents: "report1.pdf",
        action: "Install motion sensors",
        possibilityCategory: "High",
        opportunity: "Reduce idle energy usage",
        implementationCost: "2000 USD",
        expectedSavings: "3000 USD/year",
        targetGhcRedution: "3 tons",
        costSaving: "1000 USD/year",
        implementationTimeline: new Date("2025-05-01"),
        paybackPeriod: "2 years",
        projectLifespan: "5 years",
        approver: {
            id: "user456",
            name: "John Approver",
            email: "john.approver@example.com"
        },
        responsible: {
            id: "user456",
            name: "John Approver",
            email: "john.approver@example.com"
        },
        status: "complete",
        document: [
            {
                fileName: "water_saving_plan.pdf",
                imageUrl: "https://example.com/water_saving_plan.pdf"
            }
        ],
    },
    {
        id: "doc_2",
        division: "Packaging",
        category: "Waste",
        department: "Logistics",
        source: "Plastic waste",
        baseLineConsumption: "500 kg/month",
        ghcEmmision: "2.5 tons",
        problems: "Excessive packaging material",
        documents: "analysis_packaging.pdf",
        action: "Switch to recyclable materials",
        possibilityCategory: "Medium",
        opportunity: "Reduce waste volume",
        implementationCost: "1500 USD",
        expectedSavings: "800 USD/year",
        targetGhcRedution: "1 ton",
        costSaving: "300 USD/year",
        implementationTimeline: new Date("2025-06-15"),
        paybackPeriod: "3 years",
        projectLifespan: "6 years",
        approver: {
            id: "user456",
            name: "John Approver",
            email: "john.approver@example.com"
        },
        responsible: {
            id: "user456",
            name: "John Approver",
            email: "john.approver@example.com"
        },
    },
    {
        id: "doc_3",
        division: "Sewing",
        category: "Energy",
        department: "Operations",
        source: "Diesel Generator",
        baseLineConsumption: "2000 liters/month",
        ghcEmmision: "18 tons",
        problems: "Generator overuse",
        documents: "diesel_usage.csv",
        action: "Optimize scheduling",
        possibilityCategory: "Low",
        opportunity: "Use grid power during low tariff hours",
        implementationCost: "500 USD",
        expectedSavings: "1200 USD/year",
        targetGhcRedution: "2.5 tons",
        costSaving: "700 USD/year",
        implementationTimeline: new Date("2025-07-01"),
        paybackPeriod: "6 months",
        projectLifespan: "3 years",
        approver: {
            id: "user456",
            name: "John Approver",
            email: "john.approver@example.com"
        },
        responsible: {
            id: "user456",
            name: "John Approver",
            email: "john.approver@example.com"
        },
    },
    {
        id: "doc_4",
        division: "Washing",
        category: "Water",
        department: "Maintenance",
        source: "Water Usage",
        baseLineConsumption: "100000 liters/month",
        ghcEmmision: "0.5 tons",
        problems: "Leaking pipes",
        documents: "leakage_report.docx",
        action: "Pipe replacement",
        possibilityCategory: "High",
        opportunity: "Save water & reduce emissions",
        implementationCost: "1000 USD",
        expectedSavings: "2000 USD/year",
        targetGhcRedution: "0.3 tons",
        costSaving: "1000 USD/year",
        implementationTimeline: new Date("2025-04-25"),
        paybackPeriod: "1 year",
        projectLifespan: "10 years",
        approver: {
            id: "user456",
            name: "John Approver",
            email: "john.approver@example.com"
        },
        responsible: {
            id: "user456",
            name: "John Approver",
            email: "john.approver@example.com"
        },
    },
    {
        id: "doc_5",
        division: "Finishing",
        category: "Energy",
        department: "Production",
        source: "Lighting",
        baseLineConsumption: "8000 kWh/month",
        ghcEmmision: "6 tons",
        problems: "Old fluorescent lights",
        documents: "lighting_audit.xlsx",
        action: "Replace with LED lights",
        possibilityCategory: "High",
        opportunity: "Reduce lighting energy",
        implementationCost: "2500 USD",
        expectedSavings: "3500 USD/year",
        targetGhcRedution: "4 tons",
        costSaving: "1000 USD/year",
        implementationTimeline: new Date("2025-05-10"),
        paybackPeriod: "8 months",
        projectLifespan: "7 years",
        approver: {
            id: "user456",
            name: "John Approver",
            email: "john.approver@example.com"
        },
        responsible: {
            id: "user456",
            name: "John Approver",
            email: "john.approver@example.com"
        },
        status: "complete",
        document: [
            {
                fileName: "water_saving_plan.pdf",
                imageUrl: "https://example.com/water_saving_plan.pdf"
            }
        ],
    }
];
