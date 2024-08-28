export const mockUsdBudgetCurrencyFormat = {
  iso_code: "USD",
  example_format: "123,456.78",
  decimal_digits: 2,
  decimal_separator: ".",
  symbol_first: true,
  group_separator: ",",
  currency_symbol: "$",
  display_symbol: true
};

export const mockJpyBudgetCurrencyFormat = {
  iso_code: "JPY",
  example_format: "123,456",
  decimal_digits: 0,
  decimal_separator: ".",
  symbol_first: true,
  group_separator: ",",
  currency_symbol: "¥",
  display_symbol: true
};

export const mockUsdBudgetSettings = {
  id: "budget-1",
  name: "My budget",
  last_modified_on: "2021-03-17T12:26:54+00:00",
  first_month: "2020-03-01",
  last_month: "2021-03-01",
  date_format: {
    format: "MM/DD/YYYY"
  },
  currency_format: mockUsdBudgetCurrencyFormat
};

const mockJpyBudgetSettings = {
  id: "budget-2",
  name: "My other budget",
  last_modified_on: "2021-03-26T01:53:21+00:00",
  first_month: "2020-04-01",
  last_month: "2021-04-01",
  date_format: {
    format: "MM/DD/YYYY"
  },
  currency_format: mockJpyBudgetCurrencyFormat
};

export const budgetsLoader = () => [mockUsdBudgetSettings, mockJpyBudgetSettings];
