import Flag from "./flag";
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
    const { container } = render(<Flag />, { wrapper });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test.each([["None"], ["Red"], ["Orange"], ["Yellow"], ["Green"], ["Blue"], ["Purple"]])(
    "should have %s label",
    (flag) => {
      render(<Flag />, { wrapper });
      const label = screen.getByLabelText(flag);
      expect(label).toBeInTheDocument();
    }
  );
});

describe("Interaction", () => {
  test.each([["Red"], ["Orange"], ["Yellow"], ["Green"], ["Blue"], ["Purple"]])(
    "should toggle %s flag",
    async (flag) => {
      const user = userEvent.setup();
      render(<Flag />, { wrapper });
      const noneInput = screen.getByLabelText(/None/i);
      expect(noneInput).toBeChecked();
      const flagInput = screen.getByLabelText(flag);
      await waitFor(async () => {
        await user.click(flagInput);
      });
      expect(noneInput).not.toBeChecked();
      expect(flagInput).toBeChecked();
    }
  );

  test("should set flag then set back to none", async () => {
    const user = userEvent.setup();
    render(<Flag />, { wrapper });
    const noneInput = screen.getByLabelText(/None/i);
    expect(noneInput).toBeChecked();
    const flagInput = screen.getByLabelText(/Red/i);
    await waitFor(async () => {
      await user.click(flagInput);
    });
    expect(noneInput).not.toBeChecked();
    expect(flagInput).toBeChecked();
    await waitFor(async () => {
      await user.click(noneInput);
    });
    expect(flagInput).not.toBeChecked();
    expect(noneInput).toBeChecked();
  });
});
