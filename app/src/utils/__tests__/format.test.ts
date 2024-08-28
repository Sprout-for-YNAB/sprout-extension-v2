import {
  mockJpyBudgetCurrencyFormat,
  mockUsdBudgetCurrencyFormat
} from "@tests/mocks/budgetSettings";
import { formatAmount } from "utils/format";
import { test } from "vitest";

test.each([
  [mockUsdBudgetCurrencyFormat, "$0.00"],
  [mockJpyBudgetCurrencyFormat, "¥0"]
])("should show correct %s amount", (currencyFormat, expected) => {
  const result = formatAmount(0, currencyFormat);
  expect(result).toBe(expected);
});

test.each([
  [true, "$0.00"],
  [false, "0.00"]
])("should correctly show/hide currency display", (display, expected) => {
  const currencyFormat = {
    ...mockUsdBudgetCurrencyFormat,
    display_symbol: display
  };
  const result = formatAmount(0, currencyFormat);
  expect(result).toBe(expected);
});

test.each([
  [0, "0"],
  [1, "0.0"],
  [2, "0.00"],
  [3, "0.000"]
])("should show %i decimal places", (digits, expected) => {
  const currencyFormat = {
    ...mockUsdBudgetCurrencyFormat,
    decimal_digits: digits,
    display_symbol: false
  };
  const result = formatAmount(0, currencyFormat);
  expect(result).toBe(expected);
});

test.each([
  [5, "$5.00"],
  [15, "$15.00"],
  [25.2, "$25.20"],
  [35.67, "$35.67"],
  [-45.99, "-$45.99"]
])("should format %d amount correctly", (num, expected) => {
  const result = formatAmount(num, mockUsdBudgetCurrencyFormat);
  expect(result).toBe(expected);
});
