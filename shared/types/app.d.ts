import { BudgetSettings, FlagColor } from "@shared/types/ynab";

export type TransactionAction = {
  type:
    | "amount"
    | "account"
    | "payee"
    | "category"
    | "memo"
    | "date"
    | "flag"
    | "cleared"
    | "subtransactions"
    | "reset";
  account_id?: string;
  date?: string;
  amount?: number;
  payee_id?: string;
  payee_name?: string;
  category_id?: string;
  memo?: string;
  cleared?: boolean;
  flag_color?: FlagColor;
  subtransactions?: Subtransaction[];
};

export type SubtransactionAction = {
  type: "amount" | "payee" | "memo";
  amount?: number;
  payee_id?: string;
  payee_name?: string;
  memo?: string;
};

export type Settings = {
  accountBalances?: boolean;
  categoryBalances?: boolean;
  dataCaching?: boolean;
  defaultBudget?: BudgetSettings;
  expandAutocomplete?: boolean;
  lastBudget?: boolean;
  theme?: ThemeSetting;
};

export type SettingsContext = {
  settings: Settings;
  updateSetting: (updatedSetting: Settings) => void;
  isLoggedIn: boolean;
};

export type ThemeSetting = "system" | "light" | "dark";

export type Selection = {
  id?: string;
  name: string;
  index?: Index;
};

export type SubtransactionSelection = {
  id: string;
  name: string;
  subtransaction?: Subtransaction;
};

export type Index = {
  groupIndex: number;
  itemIndex: number;
};

export type ErrorResponse = {
  error: string;
  error_description: string;
};

export type AppError = {
  status: number;
  statusText: string;
  message: string;
};

export type V1Settings = {
  "setting-balance": "show-account" | "show-category" | "hide-all" | null;
  "setting-cache": number;
  "setting-last-budget": boolean;
  "setting-theme": "light" | "dark" | null;
  "last-extension-version": string;
};
