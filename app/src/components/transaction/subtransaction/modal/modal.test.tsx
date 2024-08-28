import SubtransactionModal from "./modal";
import { expect, test, describe, vi } from "vitest";
import { axe } from "jest-axe";
import { render, screen, waitFor } from "@testing-library/react";
import { mockAccounts, mockCategories, mockPayees } from "@tests/mocks/budget";
import { mockUsdBudgetCurrencyFormat } from "@tests/mocks/budgetSettings";
import userEvent from "@testing-library/user-event";
import { Transaction } from "@shared/types/ynab";
import { WrapperProps } from "vite-env";
import TransactionFormContext from "contexts/transactionFormContext";
import TransactionViewContext from "contexts/transactionViewContext";

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
    const { container } = render(<SubtransactionModal />, { wrapper });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should display categories in select view", () => {
    render(<SubtransactionModal />, { wrapper });
    const selectText = screen.getByText(/Select categories to split/i);
    const categoryOne = screen.getByLabelText(/Category 1/i);
    const categoryTwo = screen.getByLabelText(/Category 2/i);
    const categoryThree = screen.getByLabelText(/Category 3/i);
    const categoryFour = screen.getByLabelText(/Test Item/i);
    expect(selectText).toBeInTheDocument();
    expect(categoryOne).toBeInTheDocument();
    expect(categoryTwo).toBeInTheDocument();
    expect(categoryThree).toBeInTheDocument();
    expect(categoryFour).toBeInTheDocument();
  });

  test("should display selected categories in input view", async () => {
    const user = userEvent.setup();
    render(<SubtransactionModal />, { wrapper });
    const button = screen.getByText(/Continue/i);
    const categoryOne = screen.getByLabelText(/Category 1/i);
    const categoryTwo = screen.getByLabelText(/Category 2/i);
    await waitFor(async () => {
      await user.click(categoryOne);
      await user.click(categoryTwo);
      await user.click(button);
    });
    const inputText = screen.getByText(/Enter the amounts for the selected categories/i);
    const categoryOneInput = {
      amount: screen.getByLabelText(/Category 1 Amount/i),
      flow: screen.getByLabelText(/Category 1 Outflow\/Inflow/i),
      payee: screen.getByLabelText(/Category 1 Payee/i),
      memo: screen.getByLabelText(/Category 1 Memo/i)
    };
    const categoryTwoInput = {
      amount: screen.getByLabelText(/Category 2 Amount/i),
      flow: screen.getByLabelText(/Category 2 Outflow\/Inflow/i),
      payee: screen.getByLabelText(/Category 2 Payee/i),
      memo: screen.getByLabelText(/Category 2 Memo/i)
    };
    expect(inputText).toBeInTheDocument();
    expect(categoryOneInput.amount).toBeInTheDocument();
    expect(categoryOneInput.flow).toBeInTheDocument();
    expect(categoryOneInput.payee).toBeInTheDocument();
    expect(categoryOneInput.memo).toBeInTheDocument();
    expect(categoryTwoInput.amount).toBeInTheDocument();
    expect(categoryTwoInput.flow).toBeInTheDocument();
    expect(categoryTwoInput.payee).toBeInTheDocument();
    expect(categoryTwoInput.memo).toBeInTheDocument();
  });

  test.each([
    ["Category Group 1", "Category 1"],
    ["Category Group 2", "Category 2"],
    ["Other Category", "Test Item"]
  ])("should display %s group and %s category", (group, category) => {
    render(<SubtransactionModal />, { wrapper });
    const groupText = screen.getByText(group);
    const categoryText = screen.getByText(category);
    expect(groupText).toBeInTheDocument();
    expect(categoryText).toBeInTheDocument();
  });
});

describe("Interaction", () => {
  test("should select item", async () => {
    const user = userEvent.setup();
    render(<SubtransactionModal />, { wrapper });
    const categoryText = screen.getByLabelText(/Test Item/i);
    expect(categoryText).not.toBeChecked();
    await waitFor(async () => {
      await user.click(categoryText);
    });
    expect(categoryText).toBeChecked();
  });

  test("should select multiple items", async () => {
    const user = userEvent.setup();
    render(<SubtransactionModal />, { wrapper });
    const categoryOne = screen.getByLabelText(/Category 1/i);
    const categoryTwo = screen.getByLabelText(/Category 2/i);
    const uncheckedCategory = screen.getByLabelText(/Category 3/i);
    expect(categoryOne).not.toBeChecked();
    expect(categoryTwo).not.toBeChecked();
    await waitFor(async () => {
      await user.click(categoryOne);
      await user.click(categoryTwo);
    });
    expect(categoryOne).toBeChecked();
    expect(categoryTwo).toBeChecked();
    expect(uncheckedCategory).not.toBeChecked();
  });

  test("should show fill out subtransaction form", async () => {
    const user = userEvent.setup();
    render(<SubtransactionModal />, { wrapper });
    const categoryOne = screen.getByLabelText(/Category 1/i);
    const categoryTwo = screen.getByLabelText(/Category 2/i);
    const button = screen.getByText(/Continue/i);
    expect(categoryOne).not.toBeChecked();
    expect(categoryTwo).not.toBeChecked();
    await waitFor(async () => {
      await user.click(categoryOne);
      await user.click(categoryTwo);
      await user.click(button);
    });
    const categoryOneInput = {
      amount: screen.getByLabelText(/Category 1 Amount/i),
      flow: screen.getByLabelText(/Category 1 Outflow\/Inflow/i),
      payee: screen.getByLabelText(/Category 1 Payee/i),
      memo: screen.getByLabelText(/Category 1 Memo/i)
    };
    const categoryTwoInput = {
      amount: screen.getByLabelText(/Category 2 Amount/i),
      flow: screen.getByLabelText(/Category 2 Outflow\/Inflow/i),
      payee: screen.getByLabelText(/Category 2 Payee/i),
      memo: screen.getByLabelText(/Category 2 Memo/i)
    };
    await waitFor(async () => {
      await user.type(categoryOneInput.amount, "250");
      await user.type(categoryOneInput.payee, "abc");
      const payeeOneItem = await screen.findByText("Payee ABC");
      await user.click(payeeOneItem);
      await user.type(categoryOneInput.memo, "Memo One");

      await user.type(categoryTwoInput.amount, "750");
      await user.click(categoryTwoInput.flow);
      await user.type(categoryTwoInput.payee, "xyz");
      const payeeTwoItem = await screen.findByText("Payee XYZ");
      await user.click(payeeTwoItem);
      await user.type(categoryTwoInput.memo, "Memo Two");
    });
    expect(categoryOneInput.amount).toHaveValue(250);
    expect(categoryOneInput.flow).not.toBeChecked();
    expect(categoryOneInput.payee).toHaveValue("Payee ABC");
    expect(categoryOneInput.memo).toHaveValue("Memo One");

    expect(categoryTwoInput.amount).toHaveValue(750);
    expect(categoryTwoInput.flow).toBeChecked();
    expect(categoryTwoInput.payee).toHaveValue("Payee XYZ");
    expect(categoryTwoInput.memo).toHaveValue("Memo Two");
  });
});
