import Spinner from "@shared/components/spinner/spinner";
import { getNamespace } from "@shared/utils/extensionApi";
import { Suspense } from "react";
import { Await, Link, useLoaderData } from "react-router-dom";

export default function Welcome() {
  const { authenticated } = useLoaderData() as { authenticated: boolean };
  const { name } = getNamespace().runtime.getManifest();

  return (
    <>
      <Suspense fallback={<Spinner big>Finishing up...</Spinner>}>
        <Await resolve={authenticated}>
          <picture>
            <img src="assets/logos/logo-128.png" alt="" />
          </picture>
          <h1>Welcome!</h1>
          <p>Thank you for installing {name}!</p>
          <p>You're now on your way to speeding up your YNAB budgeting.</p>
          <p>
            You may close this tab and hop right into the extension, or we can walk through a little
            bit of configuration to set up the extension to your liking.
          </p>
          <p>(You can always open the Settings to configure these options later!)</p>
          <Link className="button" to="/budgets">
            Let's configure
          </Link>
        </Await>
      </Suspense>
    </>
  );
}
