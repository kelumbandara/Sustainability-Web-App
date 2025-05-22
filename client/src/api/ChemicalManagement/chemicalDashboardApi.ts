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
