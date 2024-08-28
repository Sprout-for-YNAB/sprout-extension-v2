import { postToYnab } from "@shared/api/fetch";
import { Transaction } from "@shared/types/ynab";

export const sendTransaction = async (id: string, transaction: Transaction) => {
  const body = JSON.stringify({ id, transaction });
  const response = await postToYnab("transaction", body);

  return response;
};
