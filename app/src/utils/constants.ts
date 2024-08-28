import { getNamespace } from "@shared/utils/extensionApi";

export const EXTENSION_NAME = getNamespace().runtime.getManifest().name;
export const WEBSITE_URL = getNamespace().runtime.getManifest().homepage_url;
export const YNAB_URL = "https://app.ynab.com";

export const FLAGS = {
  red: "red",
  orange: "orange",
  yellow: "yellow",
  green: "green",
  blue: "blue",
  purple: "purple"
};
