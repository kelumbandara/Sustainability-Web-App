import axios from "axios";

export async function fetchChemicalStockAmount(
  startDate: String,
  endDate: String,
  division: String
) {
  const res = await axios.get(
    `api/chemical-dashboard/${startDate}/${endDate}/${division}/stock-amount`
  );
  return res.data;
}

export async function fetchChemicalMonthlyDelivery(
  startDate: String,
  endDate: String,
  division: String
) {
  const res = await axios.get(
    `api/chemical-dashboard/${startDate}/${endDate}/${division}/monthly-delivery`
  );
  return res.data;
}

export async function fetchChemicalTransactionLatestRecord(
  startDate: String,
  endDate: String,
  division: String
) {
  const res = await axios.get(
    `api/chemical-dashboard/${startDate}/${endDate}/${division}/latest-record`
  );
  return res.data;
}

export async function fetchChemicalMonthlyLatestRecord(
  startDate: String,
  endDate: String,
  division: String
) {
  const res = await axios.get(
    `api/chemical-dashboard/${startDate}/${endDate}/${division}/transaction-latest-record`
  );
  return res.data;
}

export async function fetchChemicalThreshold(
  startDate: String,
  endDate: String,
  division: String
) {
  const res = await axios.get(
    `api/chemical-dashboard/${startDate}/${endDate}/${division}/stock-threshold`
  );
  return res.data;
}

export async function fetchChemicalHighestStock(
  startDate: String,
  endDate: String,
  division: String
) {
  const res = await axios.get(
    `api/chemical-dashboard/${startDate}/${endDate}/${division}/highest-stock`
  );
  return res.data;
}

export async function fetchChemicalStatusSummery(
  startDate: String,
  endDate: String,
  division: String
) {
  const res = await axios.get(
    `api/chemical-dashboard/${startDate}/${endDate}/${division}/status-summary`
  );
  return res.data;
}

export async function fetchChemicalDashboardAllSummary(year: string) {
  const res = await axios.get(`api/chemical-dashboard/${year}/All-summary`);
  return res.data;
}

