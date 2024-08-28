import Budgets from "./budgets";
import { expect, test, describe } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { budgetsLoader } from "loaders/budgetsLoader";

const routes = [
  {
    path: "/",
    element: <Budgets />,
    loader: budgetsLoader
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
    const result = screen.getByRole("heading", { name: /Access all your budgets/i });
    expect(result).toBeInTheDocument();
  });

  test.each([
    ["Don't set default budget"],
    ["Use last opened budget"],
    ["My budget"],
    ["My other budget"]
  ])("should have %s option on page", (budgetName) => {
    render(<RouterProvider router={router} />);
    const budget = screen.getByText(budgetName);
    expect(budget).toBeInTheDocument();
  });
});
