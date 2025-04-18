
export const environmentData = [
  {
    id: "env001",
    referenceNumber: "ENV-2025-001",
    division: "Manufacturing",
    totalWorkForce: 150,
    numberOfDaysWorked: 22,
    consumption: [{
        concumptionsId: "cons002",
        category: "Fuel",
        source: "Diesel Generator",
        unit: "liters",
        quentity: 300,
        amount: 75000,
        ghgInTonnes: "0.85",
        methodeOfTracking: "Fuel Invoices",
        usageType: "Backup Power",
        doYouHaveREC: "No",
        scope: "Scope 1",
        description: "Diesel consumption for power during outages."
    }],
    areaInSquereMeter: 2500,
    reviewerId: "user123",
    reviewer: {
      id: "user123",
      name: "Jane Reviewer",
      email: "jane.reviewer@example.com"
    },
    approverId: "user456",
    approver: {
      id: "user456",
      name: "John Approver",
      email: "john.approver@example.com"
    },
    status: "Approved",
    area: 5,
    year: "2025",
    month: "March",
    totalProuctProducedPcs: 50000,
    totalProuctProducedkg: 12000
  }
];
