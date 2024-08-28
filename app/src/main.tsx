import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "the-new-css-reset/css/reset.css";
import "@fontsource-variable/inter";
import "@shared/styles/variables.css";
import "@shared/styles/styles.css";
import "styles/styles.css";
import Login from "routes/login/login";
import Splash from "routes/splash/splash";
import Budgets from "routes/budgets/budgets";
import Transaction from "routes/transaction/transaction";
import { redirectLoader } from "loaders/redirectLoader";
import { budgetsLoader } from "loaders/budgetsLoader";
import { budgetLoader } from "loaders/budgetLoader";
import { loginLoader } from "loaders/loginLoader";

const router = createHashRouter([
  {
    path: "/",
    element: <Splash />,
    loader: redirectLoader
  },
  {
    path: "/login",
    element: <Login />,
    loader: loginLoader
  },
  {
    path: "/budgets",
    element: <Budgets />,
    loader: budgetsLoader
  },
  {
    path: "/budgets/:budgetId",
    element: <Transaction />,
    loader: budgetLoader
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
