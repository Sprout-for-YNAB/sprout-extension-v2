import React from "react";
import ReactDOM from "react-dom/client";
import "the-new-css-reset/css/reset.css";
import "@fontsource-variable/inter";
import "@shared/styles/variables.css";
import "@shared/styles/styles.css";
import "styles/styles.css";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { initLoader } from "loaders/initLoader";
import Error from "routes/error/error";
import Welcome from "routes/welcome/welcome";
import { authLoader } from "loaders/authLoader";
import Onborading from "routes/onboarding/onboarding";
import Budgets from "routes/budgets/budgets";
import { budgetsLoader } from "loaders/budgetsLoader";

export const router = createMemoryRouter([
  {
    path: "/",
    errorElement: <Error />,
    loader: initLoader
  },
  {
    element: <Onborading />,
    errorElement: <Error />,
    children: [
      {
        path: "/welcome",
        element: <Welcome />,
        loader: authLoader
      },
      {
        path: "/budgets",
        element: <Budgets />,
        loader: budgetsLoader
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
