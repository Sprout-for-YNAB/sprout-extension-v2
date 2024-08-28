import SubtransactionCategory from "./subtransactionCategory";
import { expect, test, describe, vi } from "vitest";
import { axe } from "jest-axe";
import { render, screen, waitFor } from "@testing-library/react";
import { mockAccounts, mockCategories, mockPayees, mockSubtransaction } from "@tests/mocks/budget";
import { mockUsdBudgetCurrencyFormat } from "@tests/mocks/budgetSettings";
import TransactionFormContext from "contexts/transactionFormContext";
import TransactionViewContext from "contexts/transactionViewContext";
import { WrapperProps } from "vite-env";
import { Transaction } from "@shared/types/ynab";
import userEvent from "@testing-library/user-event";

const mockProps = {
  selection: {
    id: "category-1",
    name: "Category 1"
  },
  updateRemainingSum: vi.fn()
};

const mockTransactionViewContext = {
  accounts: mockAccounts,
  payees: mockPayees,
  categoryGroups: mockCategories,
  setShowSubtransactionModal: vi.fn(),
  currencyFormat: mockUsdBudgetCurrencyFormat
};

const mockTransactionContext = {
  transaction: {
    amount: 1000
  } as Transaction,
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
    const { container } = render(<SubtransactionCategory {...mockProps} />, { wrapper });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have category", () => {
    render(<SubtransactionCategory {...mockProps} />, { wrapper });
    const result = screen.getByText(/Category 1/i);
    expect(result).toBeInTheDocument();
  });

  test("should prefill form with already saved subtransaction", () => {
    const testMockProps = {
      ...mockProps,
      selection: {
        ...mockProps.selection,
        subtransaction: mockSubtransaction
      }
    };
    render(<SubtransactionCategory {...testMockProps} />, { wrapper });
    const category = screen.getByText(/Category 1/i);
    const amount = screen.getByLabelText(/Amount/i);
    const payee = screen.getByLabelText(/Payee/i);
    const memo = screen.getByLabelText(/Memo/i);
    expect(category).toBeInTheDocument();
    expect(amount).toHaveValue(50);
    expect(payee).toHaveValue("Payee ABC");
    expect(memo).toHaveValue("Memo");
  });
});

describe("Interaction", () => {
  test("should enter amount", async () => {
    const user = userEvent.setup();
    render(<SubtransactionCategory {...mockProps} />, { wrapper });
    const amount = screen.getByLabelText(/Amount/i);
    await waitFor(async () => {
      await user.type(amount, "50");
    });
    expect(amount).toHaveValue(50);
  });

  test("should toggle flow", async () => {
    const user = userEvent.setup();
    render(<SubtransactionCategory {...mockProps} />, { wrapper });
    const flow = screen.getByLabelText(/Outflow\/Inflow/i);
    expect(flow).not.toBeChecked();
    await waitFor(async () => {
      await user.click(flow);
    });
    expect(flow).toBeChecked();
  });

  test("should enter payee", async () => {
    const user = userEvent.setup();
    render(<SubtransactionCategory {...mockProps} />, { wrapper });
    const payee = screen.getByLabelText(/Payee/i);
    await waitFor(async () => {
      await user.type(payee, "abc");
    });
    const result = screen.getByText("Payee ABC");
    await waitFor(async () => {
      await user.click(result);
    });
    expect(payee).toHaveValue("Payee ABC");
  });

  test("should enter memo", async () => {
    const user = userEvent.setup();
    render(<SubtransactionCategory {...mockProps} />, { wrapper });
    const memo = screen.getByLabelText(/Memo/i);
    await waitFor(async () => {
      await user.type(memo, "Test memo");
    });
    expect(memo).toHaveValue("Test memo");
  });

  test("should fill out form", async () => {
    const user = userEvent.setup();
    render(<SubtransactionCategory {...mockProps} />, { wrapper });
    const amount = screen.getByLabelText(/Amount/i);
    const flow = screen.getByLabelText(/Outflow\/Inflow/i);
    const payee = screen.getByLabelText(/Payee/i);
    const memo = screen.getByLabelText(/Memo/i);
    await waitFor(async () => {
      await user.type(amount, "50");
      await user.click(flow);
      await user.type(payee, "abc");
      const result = screen.getByText("Payee ABC");
      await user.click(result);
      await user.type(memo, "Test memo");
    });
    expect(amount).toHaveValue(50);
    expect(flow).toBeChecked();
    expect(memo).toHaveValue("Test memo");
  });
});
