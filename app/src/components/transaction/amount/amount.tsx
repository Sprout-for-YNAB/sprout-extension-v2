import styles from "./amount.module.css";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useTransactionFormContext } from "contexts/transactionFormContext";
import { formatAmount } from "utils/format";
import { useTransactionViewContext } from "contexts/transactionViewContext";

export default function Amount() {
  const { currencyFormat } = useTransactionViewContext();
  const { decimal_digits } = currencyFormat;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInflow, setIsInflow] = useState(false);
  const [value, setValue] = useState("");
  const placeholder = formatAmount(0, currencyFormat);
  const { dispatch } = useTransactionFormContext();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // const detectKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
  //   const validCharsRegex = new RegExp(`[\\d${decimal_separator}]`);
  //   if (!event.key.match(validCharsRegex)) {
  //     if (event.code === "Equal") {
  //       setIsInflow(!isInflow);
  //     } else if (!(event.code === "Backspace" || event.code === "Tab")) {
  //       event.preventDefault();
  //     }
  //   }
  // }

  const saveAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const number = Number(event.target.value).toFixed(decimal_digits);
    if (event.target.value.trim().length > 0) {
      dispatch({
        type: "amount",
        amount: isInflow ? Math.abs(Number(number)) : -Math.abs(Number(number))
      });
      setValue(number);
    }
  };

  const updateFlow = (newIsInflow: boolean) => {
    dispatch({
      type: "amount",
      amount: newIsInflow ? Math.abs(Number(value)) : -Math.abs(Number(value))
    });
    setIsInflow(newIsInflow);
  };

  return (
    <div className={`${styles.container} ${isInflow && styles.inflow}`}>
      <input
        aria-label="Amount"
        className={styles.input}
        placeholder={placeholder}
        type="number"
        min="0"
        step="0.01"
        ref={inputRef}
        value={value}
        // onKeyDown={detectKeyDown}
        onChange={(event) => setValue(event.target.value)}
        onBlur={saveAmount}
      />
      <div className={`${styles["flow-switch"]}`}>
        <label>
          <span>&minus; Outflow</span>
          <input
            name="flow"
            type="radio"
            value="outflow"
            onChange={() => updateFlow(false)}
            checked={!isInflow}
          />
        </label>
        <label>
          <span>+ Inflow</span>
          <input
            name="flow"
            type="radio"
            value="inflow"
            onChange={() => updateFlow(true)}
            checked={isInflow}
          />
        </label>
      </div>
    </div>
  );
}
