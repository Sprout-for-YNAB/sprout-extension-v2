import { TransactionAction } from "@shared/types/app";
import { todaysDate } from "utils/date";
import { Transaction } from "@shared/types/ynab";

export const initialTransaction: Transaction = {
  account_id: null,
  amount: -0,
  payee_id: null,
  category_id: null,
  memo: null,
  date: todaysDate,
  flag_color: null,
  cleared: false
};

export function transactionReducer(
  transaction: Transaction,
  action: TransactionAction
): Transaction {
  switch (action.type) {
    case "amount": {
      return {
        ...transaction,
        amount: action.amount ? action.amount : 0
      };
    }
    case "account": {
      return {
        ...transaction,
        account_id: action.account_id ?? null
      };
    }
    case "payee": {
      return {
        ...transaction,
        payee_id: action.payee_id ?? "",
        payee_name: action.payee_id ? undefined : action.payee_name
      };
    }
    case "category": {
      return {
        ...transaction,
        category_id: action.category_id ?? null
      };
    }
    case "memo": {
      return {
        ...transaction,
        memo: action.memo ?? null
      };
    }
    case "date": {
      return {
        ...transaction,
        date: action.date ?? todaysDate
      };
    }
    case "flag": {
      return {
        ...transaction,
        flag_color: action.flag_color ?? null
      };
    }
    case "cleared": {
      return {
        ...transaction,
        cleared: action.cleared ?? false
      };
    }
    case "subtransactions": {
      return {
        ...transaction,
        category_id: null,
        subtransactions: action.subtransactions ?? undefined
      };
    }
    case "reset": {
      return initialTransaction;
    }
    default: {
      throw Error("Unknown action");
    }
  }
}
