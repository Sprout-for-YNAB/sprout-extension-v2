import { getFromYnab } from "@shared/api/fetch";
import { Settings } from "@shared/types/app";
import { defer } from "react-router-dom";
import { getNamespace } from "@shared/utils/extensionApi";
import { BudgetSettings } from "@shared/types/ynab";

export const budgetsLoader = async () => {
  const { budgets } = await getNamespace().storage.session.get("budgets");
  if (budgets) {
    return { budgets: budgets as BudgetSettings[] };
  }
  const response = getFromYnab("budgets").then(cacheBudgets);
  return defer({ budgets: response });
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
