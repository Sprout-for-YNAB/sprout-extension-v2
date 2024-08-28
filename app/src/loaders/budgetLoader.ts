import { getFromYnab } from "@shared/api/fetch";
import { Settings } from "@shared/types/app";
import { LoaderFunctionArgs, defer, redirect } from "react-router-dom";
import { getNamespace } from "@shared/utils/extensionApi";
import { Budget } from "@shared/types/ynab";

export const budgetLoader = async ({ params }: LoaderFunctionArgs) => {
  const { budgetId } = params;
  if (!budgetId) {
    return redirect("/budgets");
  }
  const cache = await getNamespace().storage.session.get(budgetId);
  if (cache[budgetId]) {
    return defer({ budget: cache[budgetId] });
  }
  const searchParams = new URLSearchParams();
  searchParams.append("id", budgetId);
  const response = getFromYnab("budget", searchParams).then((budget: Budget) =>
    cacheBudget(budget, budgetId)
  );
  return defer({ budget: response });
};

const cacheBudget = async (budget: Budget, budgetId: string) => {
  const { settings } = await getNamespace().storage.sync.get("settings");
  const dataCaching = (settings as Settings).dataCaching;
  if (dataCaching) {
    await getNamespace().storage.session.set({
      [budgetId]: budget
    });
  }
  return budget;
};
