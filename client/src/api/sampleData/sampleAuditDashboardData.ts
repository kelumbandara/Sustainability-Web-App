export const dataset = [
  {
    month: "Jan",
    totalEnergy: 59, // MWh
    wasteWater: 57, // m³
    waste: 86, // kg
    water: 21, // m³
    ghgEmission: 60, // tCO₂e
    compliant: true,
  },
  {
    month: "Feb",
    totalEnergy: 62,
    wasteWater: 54,
    waste: 79,
    water: 25,
    ghgEmission: 58,
    compliant: true,
  },
  {
    month: "Mar",
    totalEnergy: 65,
    wasteWater: 60,
    waste: 88,
    water: 23,
    ghgEmission: 62,
    compliant: true,
  },
  // ... etc. for other months
];

export const transformedAuditScores = [
  { month: "Jan", Safety: 85, Quality: 78, Environmental: 91 },
  { month: "Feb", Safety: 88, Quality: 75, Environmental: 89 },
  { month: "Mar", Safety: 82, Quality: 80, Environmental: 93 },
  { month: "Apr", Safety: 87, Quality: 76, Environmental: 88 },
];

export const lineData = [
  { name: "1", energy: 4, water: 7, waste: 3, ghgEmission: 9 },
  { name: "2", energy: 6, water: 2, waste: 8, ghgEmission: 5 },
  { name: "3", energy: 1, water: 9, waste: 6, ghgEmission: 4 },
  { name: "4", energy: 8, water: 3, waste: 7, ghgEmission: 2 },
  { name: "5", energy: 5, water: 6, waste: 2, ghgEmission: 7 },
  { name: "6", energy: 3, water: 1, waste: 5, ghgEmission: 6 },
  { name: "7", energy: 9, water: 4, waste: 1, ghgEmission: 3 },
  { name: "8", energy: 7, water: 8, waste: 9, ghgEmission: 1 },
];

export const pieChartDataWaterTreatment = [
  { name: "Water Waste", value: 40 },
  { name: "Water Emission", value: 60 },
];

export const pieChartData = [
  { name: "Hazardous Waste", value: 400 },
  { name: "Non Hazardous", value: 300 },
];

export const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const fabricCutData = [
  {
    label: "Fabric Cut Piece",
    unit: "In KG",
    progress: 10,
    quantity: "63,892 KG",
  },
  {
    label: "Lining Material",
    unit: "In KG",
    progress: 25,
    quantity: "42,376 KG",
  },
  {
    label: "Sleeve Fabric",
    unit: "In KG",
    progress: 50,
    quantity: "89,540 KG",
  },
  {
    label: "Collar Material",
    unit: "In KG",
    progress: 75,
    quantity: "124,010 KG",
  },
  {
    label: "Pocket Cloth",
    unit: "In KG",
    progress: 90,
    quantity: "158,732 KG",
  },
];

export const wasteWaterData = [
  {
    label: "Waste Water",
    description: "In Environment Category",
    quantity: "9,874 m2",
  },
  {
    label: "Chemical Discharge",
    description: "In Environment Category",
    quantity: "5,320 m2",
  },
  {
    label: "Treated Water",
    description: "In Environment Category",
    quantity: "12,450 m2",
  },
  {
    label: "Air Emission",
    description: "In Environment Category",
    quantity: "3,678 m2",
  },
  {
    label: "Solid Waste",
    description: "In Environment Category",
    quantity: "8,991 m2",
  },
];

export const energyConsumptionData = [
  {
    label: "Electricity Usage",
    description: "In Energy Category",
    quantity: "24,580 kWh",
  },
  {
    label: "Diesel Consumption",
    description: "In Energy Category",
    quantity: "1,750 Liters",
  },
  {
    label: "Solar Energy Used",
    description: "In Energy Category",
    quantity: "5,320 kWh",
  },
  {
    label: "Generator Fuel",
    description: "In Energy Category",
    quantity: "2,100 Liters",
  },
  {
    label: "Gas Usage",
    description: "In Energy Category",
    quantity: "8,640 m3",
  },
];

export const waterUsageData = [
  {
    label: "Process Water",
    description: "In Water Usage Category",
    quantity: "18,230 m3",
  },
  {
    label: "Cooling Water",
    description: "In Water Usage Category",
    quantity: "6,120 m3",
  },
  {
    label: "Boiler Water",
    description: "In Water Usage Category",
    quantity: "3,980 m3",
  },
  {
    label: "Domestic Water",
    description: "In Water Usage Category",
    quantity: "4,540 m3",
  },
  {
    label: "Irrigation Water",
    description: "In Water Usage Category",
    quantity: "2,750 m3",
  },
];

export const waterWasteData = [
  {
    label: "Untreated Discharge",
    description: "In Water Waste Category",
    quantity: "4,120 m³",
  },
  {
    label: "Treated Discharge",
    description: "In Water Waste Category",
    quantity: "6,875 m³",
  },
  {
    label: "Process Reject Water",
    description: "In Water Waste Category",
    quantity: "2,490 m³",
  },
  {
    label: "Cooling Tower Blow down",
    description: "In Water Waste Category",
    quantity: "1,800 m³",
  },
  {
    label: "Sanitary Discharge",
    description: "In Water Waste Category",
    quantity: "3,250 m³",
  },
];

export const airEmissionData = [
  {
    label: "CO₂ Emission",
    description: "In Air Emission Category",
    quantity: "12,450 kg",
  },
  {
    label: "NOx Emission",
    description: "In Air Emission Category",
    quantity: "3,210 kg",
  },
  {
    label: "SO₂ Emission",
    description: "In Air Emission Category",
    quantity: "2,800 kg",
  },
  {
    label: "Particulate Matter",
    description: "In Air Emission Category",
    quantity: "1,560 kg",
  },
  {
    label: "Volatile Organic Compounds",
    description: "In Air Emission Category",
    quantity: "980 kg",
  },
];

export const ghgDataset = [
  {
    scope1: 2547210,
    scope2: 8715123,
    scope3: 3217002,
    scope4: 588996,
    month: "Jan",
  },
  {
    scope1: 2789431,
    scope2: 8921342,
    scope3: 3401821,
    scope4: 0,
    month: "Feb",
  },
  {
    scope1: 2618002,
    scope2: 8654120,
    scope3: 3279001,
    scope4: 33845,
    month: "Mar",
  },
  {
    scope1: 2450103,
    scope2: 8500732,
    scope3: 3158000,
    scope4: 0,
    month: "Apr",
  },
  {
    scope1: 2684900,
    scope2: 8730021,
    scope3: 3380003,
    scope4: 0,
    month: "May",
  },
  {
    scope1: 2767304,
    scope2: 8901130,
    scope3: 3421102,
    scope4: 0,
    month: "Jun",
  },
];

export const scopeColors = {
  scope1: "#4f46e5",
  scope2: "#10b981",
  scope3: "#f59e0b",
  scope4: "#ef4444",
};

export const pieChartEmissionBreakDownData = [
  { name: "Electricity", value: 35 },
  { name: "Natural Gas", value: 25 },
  { name: "Transportation", value: 20 },
  { name: "Waste", value: 10 },
  { name: "Water Treatment", value: 10 },
];

export const pieChartRecycledWaterDownData = [
  { name: "Total", value: 40 },
  { name: "Recycled", value: 25 },
  { name: "Reused", value: 10 },
  { name: "Others", value: 15 },
];

export const myData = [
  { name: "Audit Completion Rate", uv: 100, fill: "#4f46e5" }, // DarkRed
  { name: "Timely Audit Completion", uv: 125, fill: "#10b981" }, // DarkBlue
  { name: "Zero Tolerance Issue Resolution Time", uv: 100, fill: "#f59e0b" }, // DarkGreen
  { name: "Medium Resolution Time", uv: 300, fill: "#ef4444" }, // DarkIndigo (bonus)
];
