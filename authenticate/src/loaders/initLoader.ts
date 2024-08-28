import { getNamespace } from "@shared/utils/extensionApi";
import { redirect } from "react-router-dom";
import { reportError } from "@shared/utils/error";

export const initLoader = async () => {
  const params = new URLSearchParams(window.location.search);
  const state = params.get("state");
  const code = params.get("code");
  const { authState } = await getNamespace().storage.session.get("authState");
  getNamespace().storage.session.clear().catch(reportError);
  window.history.replaceState({}, document.title, "/");
  if (!authState || authState !== state || !code) {
    throw {
      error: "invalid_params",
      error_description: "Invalid params"
    };
  }
  return redirect(`/welcome?code=${code}`);
};
