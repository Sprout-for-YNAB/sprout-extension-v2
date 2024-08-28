import { mockUsdBudgetSettings } from "./budgetSettings";

export const mockAccounts = [
  {
    name: "Budget Accounts",
    items: [
      {
        id: "budget-account-1",
        name: "Budget Account 1",
        balance: "5,000"
      },
      {
        id: "budget-account-2",
        name: "Budget Account 2",
        balance: "-1,500"
      }
    ]
  },
  {
    name: "Tracking Accounts",
    items: [
      {
        id: "tracking-account",
        name: "Tracking Account",
        balance: "-200,000"
      }
    ]
  }
];

export const mockPayees = [
  {
    name: "Saved Payees",
    items: [
      {
        id: "payee-abc",
        name: "Payee ABC"
      },
      {
        id: "payee-xyz",
        name: "Payee XYZ"
      }
    ]
  },
  {
    name: "Payments and Transfers",
    items: [
      {
        id: "transafer-payee-1",
        name: "Budget Account 1",
        transfer_account_id: "budget-account-1"
      },
      {
        id: "transfer-payee-2",
        name: "Budget Account 2",
        transfer_account_id: "budget-account-2"
      },
      {
        id: "transfer-payee-3",
        name: "Tracking Account",
        transfer_account_id: "tracking-account"
      }
    ]
  }
];

export const mockCategories = [
  {
    id: "category-group-1",
    name: "Category Group 1",
    items: [
      {
        id: "category-1",
        name: "Category 1",
        balance: "2000"
      }
    ]
  },
  {
    id: "category-group-2",
    name: "Category Group 2",
    items: [
      {
        id: "category-2",
        name: "Category 2",
        balance: "75"
      },
      {
        id: "category-3",
        name: "Category 3",
        balance: "333"
      }
    ]
  },
  {
    id: "other",
    name: "Other Category",
    items: [
      {
        id: "test-item",
        name: "Test Item",
        balance: "250"
      }
    ]
  }
];

export const mockSubtransaction = {
  amount: -50,
  category_id: "category-1",
  category_name: "Category 1",
  memo: "Memo",
  payee_id: "payee-abc",
  payee_name: "Payee ABC"
};

export const mockSingleBudget = {
  accounts: mockAccounts,
  payees: mockPayees,
  categoryGroups: mockCategories,
  settings: mockUsdBudgetSettings
};
