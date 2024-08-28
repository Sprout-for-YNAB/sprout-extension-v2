import { SubtransactionAction } from "@shared/types/app";
import { Subtransaction } from "@shared/types/ynab";

export function subtransactionReducer(
  subtransaction: Subtransaction,
  action: SubtransactionAction
): Subtransaction {
  switch (action.type) {
    case "amount": {
      return {
        ...subtransaction,
        amount: action.amount ? action.amount : 0
      };
    }
    case "payee": {
      return {
        ...subtransaction,
        payee_id: action.payee_id ?? "",
        payee_name: action.payee_name ?? ""
      };
    }
    case "memo": {
      return {
        ...subtransaction,
        memo: action.memo ?? null
      };
    }
    default: {
      throw Error("Unknown action");
    }
  }
}
