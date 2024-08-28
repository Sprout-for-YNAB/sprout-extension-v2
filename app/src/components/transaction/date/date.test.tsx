import Date from "./date";
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
    const { container } = render(<Date />, { wrapper });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have label", () => {
    render(<Date />, { wrapper });
    const label = screen.getByLabelText(/Date/i);
    expect(label).toBeInTheDocument();
  });
});

describe("Interaction", () => {
  test("should accept user input", async () => {
    const user = userEvent.setup();
    render(<Date />, { wrapper });
    const dateInput = screen.getByLabelText(/Date/i);
    await waitFor(async () => {
      await userEvent.clear(dateInput);
      await user.type(dateInput, "2023-01-01");
    });
    expect(dateInput).toHaveValue("2023-01-01");
  });
});
