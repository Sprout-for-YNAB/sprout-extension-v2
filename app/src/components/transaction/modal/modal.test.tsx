import TransactionModal from "./modal";
import { expect, test, describe, vi } from "vitest";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { WrapperProps } from "vite-env";
import TransactionFormContext from "contexts/transactionFormContext";
import { Transaction } from "@shared/types/ynab";

const mockProps = {
  status: "loading",
  setStatus: vi.fn(),
  ynabViewUrl: "https://app.ynab.com/",
  reloadPage: vi.fn(),
  errorMessage: ""
};

const mockProviderProps = {
  transaction: {} as Transaction,
  dispatch: vi.fn()
};

const wrapper = ({ children }: WrapperProps) => {
  return (
    <TransactionFormContext.Provider value={{ ...mockProviderProps }}>
      {children}
    </TransactionFormContext.Provider>
  );
};

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<TransactionModal {...mockProps} />, { wrapper });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should display loading modal", () => {
    render(<TransactionModal {...mockProps} />, { wrapper });
    const text = screen.getByText(/Saving/i);
    expect(text).toBeInTheDocument();
  });

  test("should display error modal", () => {
    mockProps.status = "error";
    render(<TransactionModal {...mockProps} />, { wrapper });
    const text = screen.getByText(/Error/i);
    expect(text).toBeInTheDocument();
  });

  test("should display success modal", () => {
    mockProps.status = "success";
    render(<TransactionModal {...mockProps} />, { wrapper });
    const text = screen.getByText(/Saved!/i);
    expect(text).toBeInTheDocument();
  });
});
