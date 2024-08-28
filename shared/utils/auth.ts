import { getNamespace } from "./extensionApi";

export const redirectUri = getNamespace().runtime.getURL("authenticate/index.html");
