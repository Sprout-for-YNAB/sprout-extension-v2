import { expect, test, describe } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import Behavior from "routes/behavior/behavior";
import Data from "routes/data/data";
import Display from "routes/display/display";
import Root from "routes/root/root";
import About from "routes/about/about";
import Disconnect from "routes/disconnect/disconnect";
import { loader } from "loaders/loader";

export const router = createMemoryRouter([
  {
    path: "/",
    element: <Root />,
    loader: loader,
    children: [
      {
        path: "/behavior",
        element: <Behavior />
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
]);

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<RouterProvider router={router} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test.each([["Display"], ["Behavior"], ["Data"], ["Disconnect"], ["About"]])(
    "should have %s nav link",
    (linkName) => {
      render(<RouterProvider router={router} />);
      const link = screen.getByRole("link", { name: linkName });
      expect(link).toBeInTheDocument();
    }
  );
});
