import Transaction from "./transaction";
import { expect, test, describe } from "vitest";
import { axe } from "jest-axe";
import { render, screen, waitFor } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { budgetLoader } from "loaders/budgetLoader";

const routes = [
  {
    path: "/budgets/budget-1",
    element: <Transaction />,
    loader: budgetLoader
  }
];

const router = createMemoryRouter(routes, {
  initialEntries: ["/budgets/budget-1?name=My%20budget"]
});

afterEach(() => {
  const { unmount } = render(<RouterProvider router={router} />);
  unmount();
});

describe("Accessibility", () => {
  test("should have no accessibility violations", async () => {
    const { container } = render(<RouterProvider router={router} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Content", () => {
  test("should have budget name", () => {
    render(<RouterProvider router={router} />);
    const result = screen.getByText("My budget");
    expect(result).toBeInTheDocument();
  });

  test("should have labels for header buttons", () => {
    render(<RouterProvider router={router} />);
    const backLink = screen.getByLabelText(/Switch budget/i);
    const settingsLink = screen.getByLabelText(/Settings/i);
    expect(backLink).toBeInTheDocument();
    expect(settingsLink).toBeInTheDocument();
  });

  test("should have currency symbol", () => {
    render(<RouterProvider router={router} />);
    const result = screen.getByPlaceholderText("$0.00");
    expect(result).toBeInTheDocument();
  });

  test("should have inputs", () => {
    render(<RouterProvider router={router} />);
    const amountInput = screen.getByLabelText("Amount");
    const accountInput = screen.getByLabelText("Account");
    const payeeInput = screen.getByLabelText("Payee");
    const categoryInput = screen.getByLabelText("Category");
    expect(amountInput).toBeInTheDocument();
    expect(accountInput).toBeInTheDocument();
    expect(payeeInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
  });

  test("should have submit button", () => {
    render(<RouterProvider router={router} />);
    const button = screen.getByText("Save Transaction");
    expect(button).toBeInTheDocument();
  });
});

describe("Interaction", () => {
  test("should populate amount input", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const amountInput = screen.getByLabelText("Amount");
    const outflowSwitch = screen.getByLabelText(/Outflow/i);
    const inflowSwitch = screen.getByLabelText(/Inflow/i);
    await waitFor(async () => {
      await user.type(amountInput, "123.45");
    });
    expect(amountInput).toHaveValue(123.45);
    expect(outflowSwitch).toBeChecked();
    expect(inflowSwitch).not.toBeChecked();
  });

  test("should populate account input", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const accountInput = screen.getByLabelText(/Account/i);
    await waitFor(async () => {
      await user.type(accountInput, "budget");
      const item = await screen.findByText("Budget Account 1");
      await user.click(item);
    });
    expect(accountInput).toHaveValue("Budget Account 1");
  });

  test("should populate payee input", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const payeeInput = screen.getByLabelText(/Payee/i);
    await waitFor(async () => {
      await user.type(payeeInput, "abc");
      const item = await screen.findByText("Payee ABC");
      await user.click(item);
    });
    expect(payeeInput).toHaveValue("Payee ABC");
  });

  test("should populate category input", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const categoryInput = screen.getByLabelText(/Category/i);
    await waitFor(async () => {
      await user.type(categoryInput, "category");
      const item = await screen.findByText("Category 1");
      await user.click(item);
    });
    expect(categoryInput).toHaveValue("Category 1");
  });

  test("should populate memo input", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const memoInput = screen.getByLabelText(/Memo/i);
    await waitFor(async () => {
      await user.type(memoInput, "Hello memo");
    });
    expect(memoInput).toHaveValue("Hello memo");
  });

  test("should populate date input", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const dateInput = screen.getByLabelText(/Date/i);
    await waitFor(async () => {
      await userEvent.clear(dateInput);
      await user.type(dateInput, "2023-01-01");
    });
    expect(dateInput).toHaveValue("2023-01-01");
  });

  test("should select flag colour", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const noneInput = screen.getByLabelText(/None/i);
    const flagInput = screen.getByLabelText(/Blue/i);
    await waitFor(async () => {
      await user.click(flagInput);
    });
    expect(noneInput).not.toBeChecked();
    expect(flagInput).toBeChecked();
  });

  test("should select clear toggle", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const clearInput = screen.getByLabelText(/Clear/i);
    expect(clearInput).not.toBeChecked();
    await waitFor(async () => {
      await user.click(clearInput);
    });
    expect(clearInput).toBeChecked();
  });

  test("should populate whole form", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);

    const amountInput = screen.getByLabelText(/Amount/i);
    const outflowSwitch = screen.getByLabelText(/Outflow/i);
    const inflowSwitch = screen.getByLabelText(/Inflow/i);
    const accountInput = screen.getByLabelText(/Account/i);
    const payeeInput = screen.getByLabelText(/Payee/i);
    const categoryInput = screen.getByLabelText(/Category/i);
    const memoInput = screen.getByLabelText(/Memo/i);
    const dateInput = screen.getByLabelText(/Date/i);
    const noneInput = screen.getByLabelText(/None/i);
    const flagInput = screen.getByLabelText(/Blue/i);
    const clearInput = screen.getByLabelText(/Clear/i);

    await waitFor(async () => {
      await user.type(amountInput, "123.45");

      await user.type(accountInput, "budget");
      const accountItem = await screen.findByText("Budget Account 1");
      await user.click(accountItem);

      await user.type(payeeInput, "abc");
      const payeeItem = await screen.findByText("Payee ABC");
      await user.click(payeeItem);

      await user.type(categoryInput, "category");
      const categoryItem = await screen.findByText("Category 1");
      await user.click(categoryItem);

      await user.type(memoInput, "Hello memo");

      await userEvent.clear(dateInput);
      await user.type(dateInput, "2023-01-01");
      await user.click(flagInput);

      await user.click(clearInput);
    });

    expect(amountInput).toHaveValue(123.45);
    expect(outflowSwitch).toBeChecked();
    expect(inflowSwitch).not.toBeChecked();
    expect(accountInput).toHaveValue("Budget Account 1");
    expect(payeeInput).toHaveValue("Payee ABC");
    expect(categoryInput).toHaveValue("Category 1");
    expect(memoInput).toHaveValue("Hello memo");
    expect(dateInput).toHaveValue("2023-01-01");
    expect(noneInput).not.toBeChecked();
    expect(flagInput).toBeChecked();
    expect(clearInput).toBeChecked();
  });

  test("should create split category transaction", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const amountInput = screen.getByLabelText(/Amount/i);
    const categoryInput = screen.getByLabelText(/Category/i);

    await waitFor(async () => {
      await user.type(amountInput, "1000");
    });
    categoryInput.focus();

    await waitFor(async () => {
      const splitText = screen.getByText(/Split/i);
      await user.click(splitText);
    });

    const subtransactionHeader = screen.getByText(/Split Categories/i);
    expect(subtransactionHeader).toBeInTheDocument();

    const categoryOne = screen.getByLabelText(/Category 1/i);
    const categoryTwo = screen.getByLabelText(/Category 2/i);
    const continueButton = screen.getByText(/Continue/i);

    await waitFor(async () => {
      await user.click(categoryOne);
      await user.click(categoryTwo);
      await user.click(continueButton);
    });

    expect(categoryOne).toBeChecked();
    expect(categoryTwo).toBeChecked();

    const categoryOneAmount = screen.getByLabelText(/Category 1 Amount/i);
    const categoryTwoAmount = screen.getByLabelText(/Category 2 Amount/i);
    await waitFor(async () => {
      await user.type(categoryOneAmount, "250");
      await user.type(categoryTwoAmount, "750");
    });

    const saveButton = screen.getByText("Save");
    await waitFor(async () => {
      await user.click(saveButton);
    });
    expect(subtransactionHeader).not.toBeInTheDocument();
    expect(categoryInput).toHaveValue("Split (Multiple Categories)");
  });
});
