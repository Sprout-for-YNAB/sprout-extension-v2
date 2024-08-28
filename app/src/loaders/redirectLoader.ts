import { Settings } from "@shared/types/app";
import { redirect } from "react-router-dom";
import env from "@shared/utils/env";
import { getNamespace } from "@shared/utils/extensionApi";
import { BudgetSettings } from "@shared/types/ynab";
import { setTheme } from "@shared/utils/theme";
import { initSettings } from "@shared/utils/settings";

export const redirectLoader = async () => {
  const [settingsRes, isLoggedIn] = await Promise.all([
    getNamespace().storage.sync.get("settings"),
    getNamespace().cookies.get({
      name: "refreshToken",
      url: env.WORKER_URL
    })
  ]);
  const { settings } = settingsRes as { settings: Settings };
  setTheme(settings.theme);
  if (!isLoggedIn) {
    return redirect("/login");
  }
  if (!settings) {
    await initSettings();
  } else {
    if (settings.defaultBudget) {
      const { id, name } = settings.defaultBudget as BudgetSettings;
      return redirect(`/budgets/${id}?name=${encodeURIComponent(name)}`);
    }
  }
  return redirect("/budgets");
};
