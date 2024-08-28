import Memo from "./memo";
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
    const { container } = render(<Memo />, { wrapper });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have label", () => {
    render(<Memo />, { wrapper });
    const label = screen.getByLabelText(/Memo/i);
    expect(label).toBeInTheDocument();
  });
});

describe("Interaction", () => {
  test("should accept user input", async () => {
    const user = userEvent.setup();
    render(<Memo />, { wrapper });
    const memoInput = screen.getByLabelText(/Memo/i);
    await waitFor(async () => {
      await user.type(memoInput, "Hello memo");
    });
    expect(memoInput).toHaveValue("Hello memo");
  });
});
