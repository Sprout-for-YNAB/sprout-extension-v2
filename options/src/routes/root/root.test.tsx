import { expect, test, describe } from "vitest";
import { axe } from "jest-axe";
import { render, screen, waitFor } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import Behavior from "../behavior/behavior";
import Data from "../data/data";
import Display from "../display/display";
import Root from "./root";
import { loader } from "loaders/loader";
import Disconnect from "routes/disconnect/disconnect";
import About from "../about/about";
import { budgetsLoader } from "loaders/budgetsLoader";
import userEvent from "@testing-library/user-event";

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

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<RouterProvider router={router} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have heading", () => {
    render(<RouterProvider router={router} />);
    const heading = screen.getByRole("heading", { name: "Settings" });
    expect(heading).toBeInTheDocument();
  });

  test.each([["Display"], ["Behavior"], ["Data"], ["Disconnect"], ["About"]])(
    "should have %s nav link",
    (name) => {
      render(<RouterProvider router={router} />);
      const link = screen.getByRole("link", { name });
      expect(link).toBeInTheDocument();
    }
  );
});

describe("Interaction", () => {
  test.each([["Display"], ["Behavior"], ["Data"], ["Disconnect"], ["About"]])(
    "should show %s settings",
    async (name) => {
      const user = userEvent.setup();
      render(<RouterProvider router={router} />);
      const link = screen.getByRole("link", { name });
      await waitFor(async () => {
        await user.click(link);
      });
      const header = screen.getByRole("heading", { name });
      expect(header).toBeInTheDocument();
    }
  );
});
