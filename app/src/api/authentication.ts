import env from "utils/env";
import { getNamespace } from "@shared/utils/extensionApi";
import { redirectUri } from "@shared/utils/auth";

export const prepareAuthenticationTab = () => {
  const state = generateRandomString();
  const authorizeParams = new URLSearchParams({
    client_id: env.CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    state
  });
  const url = new URL(`/oauth/authorize?${authorizeParams.toString()}`, "https://app.ynab.com");
  getNamespace()
    .storage.session.set({ authState: state })
    .catch((error) => {
      throw error;
    });
  getNamespace()
    .tabs.create({ url: url.toString() })
    .catch((error) => {
      throw error;
    });
};

const generateRandomString = () => {
  const decToHex = (dec: number) => {
    return dec.toString(16).padStart(2, "0");
  };
  const arr = new Uint8Array(20);
  crypto.getRandomValues(arr);
  return Array.from(arr, decToHex).join("");
};
