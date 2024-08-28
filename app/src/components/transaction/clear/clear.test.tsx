import Clear from "./clear";
import { expect, test, describe, vi } from "vitest";
import { axe } from "jest-axe";
import { render, screen, waitFor } from "@testing-library/react";
import { WrapperProps } from "vite-env";
import TransactionFormContext from "contexts/transactionFormContext";
import userEvent from "@testing-library/user-event";
import { Transaction } from "@shared/types/ynab";

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
    const { container } = render(<Clear />, { wrapper });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have label", () => {
    render(<Clear />, { wrapper });
    const label = screen.getByLabelText(/Clear/i);
    expect(label).toBeInTheDocument();
  });
});

describe("Interaction", () => {
  test("should toggle clear setting", async () => {
    const user = userEvent.setup();
    render(<Clear />, { wrapper });
    const clearInput = screen.getByLabelText(/Clear/i);
    expect(clearInput).not.toBeChecked();
    await waitFor(async () => {
      await user.click(clearInput);
    });
    expect(clearInput).toBeChecked();
  });
});
