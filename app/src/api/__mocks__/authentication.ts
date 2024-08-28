import { getNamespace } from "@shared/utils/extensionApi";

export const prepareAuthenticationTab = async () => {
  await getNamespace().tabs.create({
    url: "https://app.ynab.com/oauth/authorize?client_id=validClientId&redirect_uri=validRedirectUri&response_type=code&state=validState"
  });
};
