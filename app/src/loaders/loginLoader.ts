import { V1Settings } from "@shared/types/app";
import { getNamespace } from "@shared/utils/extensionApi";

export const loginLoader = async () => {
  const previous = (await getNamespace().storage.local.get([
    "setting-balance",
    "setting-cache",
    "setting-last-budget",
    "setting-theme",
    "last-extension-version"
  ])) as V1Settings;
  if (previous["last-extension-version"]) {
    await getNamespace().storage.sync.set({
      settings: {
        accountBalances:
          previous["setting-balance"] === "show-account" || !previous["setting-balance"],
        categoryBalances:
          previous["setting-balance"] === "show-category" || !previous["setting-balance"],
        dataCaching: Boolean(previous["setting-cache"]),
        expandAutocomplete: false,
        lastBudget: previous["setting-last-budget"],
        theme: previous["setting-theme"] ?? "system"
      }
    });
    await getNamespace().storage.local.clear();
    return true;
  }
  return false;
};
