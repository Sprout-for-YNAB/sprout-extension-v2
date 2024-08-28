import Welcome from "./welcome";
import { expect, test, describe } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { authLoader } from "loaders/authLoader";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

const routes = [
  {
    path: "/",
    element: <Welcome />,
    loader: authLoader
  }
];

const router = createMemoryRouter(routes);

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<RouterProvider router={router} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have header", () => {
    render(<RouterProvider router={router} />);
    const result = screen.getByRole("heading", { name: /Welcome/i });
    expect(result).toBeInTheDocument();
  });
});
