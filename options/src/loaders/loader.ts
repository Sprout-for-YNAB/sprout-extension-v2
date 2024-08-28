import { getNamespace } from "@shared/utils/extensionApi";
import env from "@shared/utils/env";
import { Settings, SettingsContext } from "@shared/types/app";
import { setTheme } from "@shared/utils/theme";

export const loader = async () => {
  const [settingsRes, isLoggedIn] = await Promise.all([
    getNamespace().storage.sync.get("settings"),
    getNamespace().cookies.get({
      name: "refreshToken",
      url: env.WORKER_URL
    })
  ]);
  const { settings } = settingsRes as { settings: Settings };
  setTheme(settings ? settings.theme : undefined);
  const response = {
    settings,
    isLoggedIn: Boolean(isLoggedIn)
  } as SettingsContext;
  return response;
};
