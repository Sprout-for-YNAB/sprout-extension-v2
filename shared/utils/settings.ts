import { reportError } from "./error";
import { getNamespace } from "./extensionApi";

export const initSettings = async () => {
  const { settings } = await getNamespace().storage.sync.get("settings");
  if (!settings) {
    await getNamespace()
      .storage.sync.set({
        settings: {
          accountBalances: true,
          categoryBalances: true,
          dataCaching: false,
          expandAutocomplete: false,
          lastBudget: false,
          theme: "system"
        }
      })
      .catch(reportError);
    return true;
  }
  return false;
};
