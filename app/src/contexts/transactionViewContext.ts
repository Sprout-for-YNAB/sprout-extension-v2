import { createContext, useContext } from "react";
import { CurrencyFormat, Group } from "@shared/types/ynab";

type TransactionViewContextProps = {
  accounts: Group[];
  payees: Group[];
  categoryGroups: Group[];
  currencyFormat: CurrencyFormat;
  setShowSubtransactionModal: (show: boolean) => void;
};

const TransactionViewContext = createContext({} as TransactionViewContextProps);

export function useTransactionViewContext() {
  return useContext(TransactionViewContext);
}

export default TransactionViewContext;
