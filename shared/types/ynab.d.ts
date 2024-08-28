export type BudgetSettings = {
  id: string;
  name: string;
  last_modified_on: string;
  first_month: string;
  last_month: string;
  date_format: DateFormat;
  currency_format: CurrencyFormat;
};

export type DateFormat = {
  format: string;
};

export type CurrencyFormat = {
  iso_code: string;
  example_format: string;
  decimal_digits: number;
  decimal_separator: string;
  symbol_first: boolean;
  group_separator: string;
  currency_symbol: string;
  display_symbol: boolean;
};

export type Budget = {
  accounts: Group[];
  payees: Group[];
  categoryGroups: Group[];
  settings: BudgetSettings;
};

export type Group = {
  id?: string;
  name?: string;
  items: Item[];
};

export type Item = {
  id: string;
  name: string;
  balance?: string;
  transfer_account_id?: string;
};

export type Transaction = {
  account_id: string | null;
  date: string;
  amount: number;
  payee_id: string | null;
  payee_name?: string;
  category_id: string | null;
  memo: string | null;
  cleared: boolean;
  flag_color: FlagColor;
  subtransactions?: Subtransaction[];
};

export type FlagColor = "red" | "orange" | "yellow" | "green" | "blue" | "purple" | null;

export type Subtransaction = {
  amount: number;
  category_id: string;
  category_name: string;
  payee_id?: string;
  payee_name?: string;
  memo: string | null;
};

export type YnabError = {
  error: string;
  error_description: string;
};
