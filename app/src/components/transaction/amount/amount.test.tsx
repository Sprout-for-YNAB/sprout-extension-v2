import Amount from "./amount";
import { expect, test, describe, vi } from "vitest";
import { axe } from "jest-axe";
import { render, screen, waitFor } from "@testing-library/react";
import { mockAccounts, mockCategories, mockPayees } from "@tests/mocks/budget";
import { mockUsdBudgetCurrencyFormat } from "@tests/mocks/budgetSettings";
import userEvent from "@testing-library/user-event";
import TransactionFormContext from "contexts/transactionFormContext";
import { WrapperProps } from "vite-env";
import { Transaction } from "@shared/types/ynab";
import TransactionViewContext from "contexts/transactionViewContext";

const mockTransactionViewContext = {
  accounts: mockAccounts,
  payees: mockPayees,
  categoryGroups: mockCategories,
  setShowSubtransactionModal: vi.fn(),
  currencyFormat: mockUsdBudgetCurrencyFormat
};

const mockTransactionContext = {
  transaction: {} as Transaction,
  dispatch: vi.fn()
};

const wrapper = ({ children }: WrapperProps) => {
  return (
    <TransactionViewContext.Provider value={{ ...mockTransactionViewContext }}>
      <TransactionFormContext.Provider value={{ ...mockTransactionContext }}>
        {children}
      </TransactionFormContext.Provider>
    </TransactionViewContext.Provider>
  );
};

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<Amount />, { wrapper });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have Amount label", () => {
    render(<Amount />, { wrapper });
    const element = screen.getByLabelText(/Amount/i);
    expect(element).toBeInTheDocument();
  });

  test("should have correct currency symbol", () => {
    render(<Amount />, { wrapper });
    const element = screen.getByPlaceholderText(/\$0.00/i);
    expect(element).toBeInTheDocument();
  });

  test("should have Outflow and Inflow selection", () => {
    render(<Amount />, { wrapper });
    const outflow = screen.getByLabelText(/Outflow/i);
    const inflow = screen.getByLabelText(/Inflow/i);
    expect(outflow).toBeInTheDocument();
    expect(inflow).toBeInTheDocument();
  });
});

describe("Interaction", () => {
  test.each([
    ["1.23", 1.23],
    ["123.45", 123.45],
    ["50.00", 50],
    ["5", 5]
  ])("should enter %s as amount", async (userInput, numericInput) => {
    const user = userEvent.setup();
    render(<Amount />, { wrapper });
    const input: HTMLInputElement = screen.getByLabelText(/Amount/i);
    await waitFor(async () => {
      await user.type(input, userInput);
      input.blur();
    });
    expect(input).toHaveValue(numericInput);
  });

  test("should set to inflow", async () => {
    const user = userEvent.setup();
    render(<Amount />, { wrapper });
    const outflow = screen.getByLabelText(/Outflow/i);
    const inflow = screen.getByLabelText(/Inflow/i);
    await waitFor(async () => {
      await user.click(inflow);
    });
    expect(outflow).not.toBeChecked();
    expect(inflow).toBeChecked();
  });

  test("should enter value and set inflow", async () => {
    const user = userEvent.setup();
    render(<Amount />, { wrapper });
    const input = screen.getByLabelText(/Amount/i);
    const outflow = screen.getByLabelText(/Outflow/i);
    const inflow = screen.getByLabelText(/Inflow/i);
    await waitFor(async () => {
      await user.type(input, "12.34");
      await user.click(inflow);
    });
    expect(input).toHaveValue(12.34);
    expect(outflow).not.toBeChecked();
    expect(inflow).toBeChecked();
  });
});
