import { mockUsdBudgetSettings, mockJpyBudgetSettings } from "@tests/mocks/budgetSettings";
import { defer } from "react-router-dom";

export const budgetsLoader = () =>
  defer({ budgets: [mockUsdBudgetSettings, mockJpyBudgetSettings] });
