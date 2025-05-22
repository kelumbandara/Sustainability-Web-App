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

export async function fetchChemicalMonthlyLatestRecord(
  startDate: String,
  endDate: String,
  division: String
) {
  const res = await axios.get(
    `api/chemical-dashboard/${startDate}/${endDate}/${division}/letest-record`
  );
  return res.data;
}
