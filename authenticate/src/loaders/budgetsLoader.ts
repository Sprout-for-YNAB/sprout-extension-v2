import { getFromYnab } from "@shared/api/fetch";

export const budgetsLoader = async () => {
  return getFromYnab("budgets");
};
