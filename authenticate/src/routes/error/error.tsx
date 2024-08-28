import { ErrorResponse } from "@shared/types/app";
import { getNamespace } from "@shared/utils/extensionApi";
import { useRouteError } from "react-router-dom";

export default function Error() {
  const error = useRouteError() as ErrorResponse;
  const { name } = getNamespace().runtime.getManifest();

  return (
    <main>
      <h1>Unable to authenticate</h1>
      <p>Your account couldn't be connected to {name}. Please try again.</p>
      <small>{error.error_description}</small>
    </main>
  );
}
