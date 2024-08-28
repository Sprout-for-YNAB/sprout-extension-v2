import Autocomplete from "./autocomplete";
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
    const { container } = render(<Autocomplete label="Category" />, { wrapper });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test.each([["Account"], ["Payee"], ["Category"]])("should have correct label", (label) => {
    render(<Autocomplete label={label} />, { wrapper });
    const result = screen.getByLabelText(label);
    expect(result).toBeInTheDocument();
  });

  test("should have prefilled value", () => {
    render(<Autocomplete label="Payee" initialValue="First" />, { wrapper });
    const input = screen.getByLabelText(/Payee/i);
    expect(input).toHaveValue("First");
  });
});

describe("Interaction", () => {
  test("should show suggestion box on focus", async () => {
    render(<Autocomplete label="Category" />, { wrapper });
    const input = screen.getByLabelText(/Category/i);
    await waitFor(() => {
      input.focus();
    });
    const suggestionBox = screen.getByRole("listbox");
    expect(suggestionBox).toBeInTheDocument();
  });

  test("should hide suggestion box after losing focus", async () => {
    render(<Autocomplete label="Category" />, { wrapper });
    const input = screen.getByLabelText(/Category/i);
    await waitFor(() => {
      input.focus();
    });
    const suggestionBox = screen.getByRole("listbox");
    expect(suggestionBox).toBeInTheDocument();
    await waitFor(() => {
      input.blur();
    });
    expect(suggestionBox).not.toBeInTheDocument();
  });

  test("should select item from dropdown with no query", async () => {
    const user = userEvent.setup();
    render(<Autocomplete label="Category" />, { wrapper });
    const input: HTMLInputElement = screen.getByLabelText(/Category/i);
    await waitFor(() => {
      input.focus();
    });
    const suggestionBox = screen.getByRole("listbox");
    expect(suggestionBox).toBeInTheDocument();
    const suggestion = screen.getByText(/Category 1/i);
    expect(suggestion).toBeInTheDocument();
    await waitFor(async () => {
      await user.click(suggestion);
    });
    expect(input.value).toBe("Category 1");
    expect(suggestionBox).not.toBeInTheDocument();
  });

  test("should filter results based on query", async () => {
    const user = userEvent.setup();
    render(<Autocomplete label="Category" />, { wrapper });
    const input: HTMLInputElement = screen.getByLabelText(/Category/i);
    await waitFor(() => {
      input.focus();
    });
    const hiddenSuggestion = screen.getByText(/Category 1/i);
    await waitFor(async () => {
      await user.type(input, "test");
    });
    const suggestion = screen.getByText(/Test Item/i);
    expect(suggestion).toBeInTheDocument();
    expect(hiddenSuggestion).not.toBeInTheDocument();
  });

  test("should select item when clicked", async () => {
    const user = userEvent.setup();
    render(<Autocomplete label="Category" />, { wrapper });
    const input: HTMLInputElement = screen.getByLabelText(/Category/i);
    await waitFor(async () => {
      await user.type(input, "test");
    });
    const suggestion = screen.getByText(/Test Item/i);
    await waitFor(async () => {
      await user.click(suggestion);
    });
    expect(input.value).toBe("Test Item");
  });

  test("should show no results for invalid query", async () => {
    const user = userEvent.setup();
    render(<Autocomplete label="Category" />, { wrapper });
    const input: HTMLInputElement = screen.getByLabelText(/Category/i);
    await waitFor(() => {
      input.focus();
    });
    const suggestion = screen.getByText(/Test Item/i);
    await waitFor(async () => {
      await user.type(input, "zzz");
    });
    const noMatching = screen.getByText(/No matching /i);
    expect(suggestion).not.toBeInTheDocument();
    expect(noMatching).toBeInTheDocument();
  });

  test("should show Create new option", async () => {
    const user = userEvent.setup();
    render(<Autocomplete label="Payee" showAddItem />, { wrapper });
    const input: HTMLInputElement = screen.getByLabelText(/Payee/i);
    await waitFor(() => {
      input.focus();
    });
    const suggestion = screen.getByText(/Payee ABC/i);
    await waitFor(async () => {
      await user.type(input, "lll");
    });
    const addItem = screen.getByText(/Create new /i);
    expect(suggestion).not.toBeInTheDocument();
    expect(addItem).toBeInTheDocument();
  });

  test("should create new item when Create new option is selected", async () => {
    const user = userEvent.setup();
    render(<Autocomplete label="Payee" showAddItem />, { wrapper });
    const input: HTMLInputElement = screen.getByLabelText(/Payee/i);
    await waitFor(async () => {
      await user.type(input, "123");
    });
    const addItem = screen.getByText(/Create new /i);
    await waitFor(async () => {
      await user.click(addItem);
    });
    expect(input.value).toBe("123");
  });
});
