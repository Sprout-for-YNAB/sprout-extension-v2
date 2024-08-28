import { defer } from "react-router-dom";
import { mockSingleBudget } from "@tests/mocks/budget";

export const budgetLoader = () => defer({ budget: mockSingleBudget });
