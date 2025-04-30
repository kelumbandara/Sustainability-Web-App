import axios from "axios";
import { z } from "zod";

export async function fetchConsumptionCategoriesSum(
  year: String,
  month: String,
  division: String
) {
  const res = await axios.get(
    `api/environment-record/${year}/${month}/${division}/category-quantity-sum`
  );
  return res.data;
}
