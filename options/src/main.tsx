import React from "react";
import ReactDOM from "react-dom/client";
import "the-new-css-reset/css/reset.css";
import "@fontsource-variable/inter";
import "@shared/styles/variables.css";
import "@shared/styles/styles.css";
import "@shared/styles/options.css";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import Behavior from "./routes/behavior/behavior";
import Data from "./routes/data/data";
import Display from "./routes/display/display";
import Root from "./routes/root/root";
import { loader } from "loaders/loader";
import { budgetsLoader } from "loaders/budgetsLoader";
import Disconnect from "routes/disconnect/disconnect";
import About from "./routes/about/about";

export const router = createMemoryRouter(
  [
    {
      path: "/",
      element: <Root />,
      loader: loader,
      children: [
        {
          path: "/behavior",
          element: <Behavior />,
          loader: budgetsLoader
        },
        {
          path: "/data",
          element: <Data />
        },
        {
          path: "/display",
          element: <Display />
        },
        {
          path: "/disconnect",
          element: <Disconnect />
        },
        {
          path: "/about",
          element: <About />
        }
      ]
    }
  ],
  { initialEntries: ["/display"] }
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
