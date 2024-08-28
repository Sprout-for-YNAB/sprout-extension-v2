import { Dispatch, createContext, useContext } from "react";
import { TransactionAction } from "@shared/types/app";
import { Transaction } from "@shared/types/ynab";

type TransactionFormContextProps = {
  transaction: Transaction;
  dispatch: Dispatch<TransactionAction>;
};

const TransactionFormContext = createContext({} as TransactionFormContextProps);

export function useTransactionFormContext() {
  return useContext(TransactionFormContext);
}

export default TransactionFormContext;
