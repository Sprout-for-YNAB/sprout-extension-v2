import { BudgetSettings } from "@shared/types/ynab";
import { mockUsdBudgetSettings, mockJpyBudgetSettings } from "@tests/mocks/budgetSettings";

export const budgetsLoader = () =>
  [mockUsdBudgetSettings, mockJpyBudgetSettings] as BudgetSettings[];
