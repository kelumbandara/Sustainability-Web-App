export const sampleSustainabilityData = [
    {
        id: "1",
        referenceNumber: "REF-001",
        location: "New York",
        division: "Division 1",
        sdgDetails: "Ensure sustainable energy access for all",
        pillars: {
            economic: "Sustainable Economic Growth",
            environmental: "Climate Action",
            social: "Equality and Diversity"
        },
        timeLine: new Date("2022-01-01"),
        status: "Active",
        actions: "Conduct energy",
        title: "Sustainable Energy Initiative",
        additionalSdg: {
            sdg1: "No Poverty",
            sdg2: "Zero Hunger",
            sdg7: "Affordable and Clean Energy"
        },
        alignment: "Aligned with SDG Goals 1, 2, and 7",
        griStandards: "GRI 302: Energy",
        materiality: {
            energyEfficiency: "High",
            carbonReduction: "Medium"
        },
        materialIssue: "critical",
        organizer: "Green Future Org",
        volunteer: "John Doe",
        priorityDescription: "Focus on clean and affordable energy for marginalized communities",
        contributeDescription: "Providing solar panels and energy-efficient lighting to low-income households"
    },
    {
        id: "2",
        referenceNumber: "REF-002",
        location: "London",
        division: "Division 2",
        sdgDetails: "Promote sustainable agriculture and food security",
        pillars: {
            economic: "Fair Trade Practices",
            environmental: "Sustainable Farming",
            social: "Food Security for All"
        },
        timeLine: new Date("2022-02-01"),
        status: "Inactive",
        actions: "Educate farmers",
        title: "Sustainable Agriculture Program",
        additionalSdg: {
            sdg2: "Zero Hunger",
            sdg12: "Responsible Consumption and Production",
            sdg15: "Life on Land"
        },
        alignment: "Aligned with SDG Goals 2, 12, and 15",
        griStandards: "GRI 304: Biodiversity",
        materiality: {
            soilHealth: "High",
            waterManagement: "Medium"
        },
        materialIssue: "critical",
        organizer: "SustainAgri Foundation",
        volunteer: "Jane Smith",
        priorityDescription: "Enhancing food security through sustainable practices",
        contributeDescription: "Training programs for local farmers and introducing organic fertilizers"
    }
];

export const materialityType = [
    {
        id: "1",
        name: "High",
    },
    {
        id: "2",
        name: "Medium",
    },
    {
        id: "3",
        name: "Low",
    },
    {
        id: "4",
        name: "Critical",
    }
]
