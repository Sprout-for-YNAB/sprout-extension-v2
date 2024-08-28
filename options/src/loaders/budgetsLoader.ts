import { getFromYnab } from "@shared/api/fetch";
import { Settings } from "@shared/types/app";
import { getNamespace } from "@shared/utils/extensionApi";
import { BudgetSettings } from "@shared/types/ynab";
import env from "@shared/utils/env";

export const budgetsLoader = async () => {
  const isLoggedIn = await getNamespace().cookies.get({
    name: "refreshToken",
    url: env.WORKER_URL
  });
  if (!isLoggedIn) {
    return [];
  }
  const { budgets } = await getNamespace().storage.session.get("budgets");
  if (budgets) {
    return budgets as BudgetSettings[];
  }
  const response = getFromYnab("budgets").then(cacheBudgets);
  return response;
};

const cacheBudgets = async (budgets: BudgetSettings[]) => {
  const { settings } = await getNamespace().storage.sync.get("settings");
  const dataCaching = (settings as Settings).dataCaching;
  if (dataCaching) {
    await getNamespace().storage.session.set({
      budgets
    });
  }
  return budgets;
};
