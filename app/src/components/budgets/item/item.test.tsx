import BudgetItem from "./item";
import { expect, test, describe } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { WrapperProps } from "vite-env";

const mockProps = {
  name: "My budget",
  id: "budget-id",
  skeleton: false
};

const mockSkeletonProps = {
  name: "",
  id: "",
  skeleton: true
};

const wrapper = ({ children }: WrapperProps) => {
  return (
    <MemoryRouter>
      <ul>{children}</ul>
    </MemoryRouter>
  );
};

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<BudgetItem {...mockProps} />, {
      wrapper
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("skeleton should have no accessibility violations", async () => {
    const { container } = render(<BudgetItem {...mockSkeletonProps} />, {
      wrapper
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should show correct name and ID", () => {
    render(<BudgetItem {...mockProps} />, { wrapper });
    const element = screen.getByTestId("budget-item");
    expect(element).toHaveTextContent("My budget");
    expect(element).toHaveAttribute("href", "/budgets/budget-id?name=My%20budget");
  });
});
