import { postToYnab } from "@shared/api/fetch";
import { redirectUri } from "@shared/utils/auth";
import { initSettings } from "@shared/utils/settings";
import { LoaderFunctionArgs, defer } from "react-router-dom";

export const authLoader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const authenticated = await postToYnab(
    "oauth",
    JSON.stringify({
      code,
      redirect_uri: redirectUri
    })
  );
  const newUser = await initSettings();
  return defer({ authenticated, newUser });
};
