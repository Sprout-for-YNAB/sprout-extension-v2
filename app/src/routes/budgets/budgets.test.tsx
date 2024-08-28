import Budgets from "./budgets";
import { expect, test, describe } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { budgetsLoader } from "loaders/budgetsLoader";

const routes = [
  {
    path: "/budgets",
    element: <Budgets />,
    loader: budgetsLoader
  }
];

const router = createMemoryRouter(routes, { initialEntries: ["/budgets"] });

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<RouterProvider router={router} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have opening paragraph", () => {
    render(<RouterProvider router={router} />);
    const result = screen.getByText("Select Budget");
    expect(result).toBeInTheDocument();
  });

  test("should have budget items", async () => {
    render(<RouterProvider router={router} />);
    const firstResult = await screen.findByText("My budget");
    const secondResult = await screen.findByText("My other budget");
    expect(firstResult).toBeInTheDocument();
    expect(secondResult).toBeInTheDocument();
  });
});
