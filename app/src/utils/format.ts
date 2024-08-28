import { CurrencyFormat } from "@shared/types/ynab";

export const formatAmount = (amount: number, currencyFormat: CurrencyFormat) => {
  const { currency_symbol, decimal_digits, symbol_first, display_symbol } = currencyFormat;
  const symbolText = display_symbol ? currency_symbol : "";
  const amountText = Math.abs(amount).toFixed(decimal_digits);
  const formattedString = symbol_first
    ? `${symbolText}${amountText}`
    : `${amountText}${symbolText}`;
  return amount < 0 ? `-${formattedString}` : formattedString;
};
