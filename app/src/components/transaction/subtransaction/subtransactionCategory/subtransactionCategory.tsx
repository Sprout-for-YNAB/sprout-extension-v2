import { SubtransactionSelection } from "@shared/types/app";
import styles from "./subtransactionCategory.module.css";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { subtransactionReducer } from "reducers/subtransactionReducer";
import { Subtransaction } from "@shared/types/ynab";
import { useTransactionViewContext } from "contexts/transactionViewContext";
import Autocomplete from "components/transaction/autocomplete/autocomplete";
import { formatAmount } from "utils/format";

type Props = {
  selection: SubtransactionSelection;
  updateRemainingSum: (oldAmount: number, newAmount: number) => void;
};

export default function SubtransactionCategory({ selection, updateRemainingSum }: Props) {
  const { currencyFormat } = useTransactionViewContext();
  const { decimal_digits } = currencyFormat;
  const [subtransaction, dispatch] = useReducer(
    subtransactionReducer,
    (selection.subtransaction as Subtransaction) ?? {
      amount: 0,
      category_id: selection.id,
      category_name: selection.name,
      memo: null
    }
  );
  const [isInflow, setIsInflow] = useState(false);
  const [amountValue, setAmountValue] = useState(
    subtransaction.amount !== 0 ? Math.abs(subtransaction.amount).toFixed(decimal_digits) : ""
  );
  const [memoValue, setMemoValue] = useState(subtransaction.memo ?? "");
  const placeholder = formatAmount(0, currencyFormat);

  useEffect(() => {
    console.log(selection);
    selection.subtransaction = subtransaction;
  }, [selection, subtransaction]);

  const updateFlow = (newIsInflow: boolean) => {
    const amount = newIsInflow
      ? Math.abs(Number(subtransaction.amount))
      : -Math.abs(Number(subtransaction.amount));
    updateRemainingSum(subtransaction.amount, amount);
    dispatch({
      type: "amount",
      amount
    });
    setIsInflow(newIsInflow);
  };

  const updateAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const amountStr = Number(event.target.value).toFixed(decimal_digits);
    const amount = isInflow ? Math.abs(Number(amountStr)) : -Math.abs(Number(amountStr));
    updateRemainingSum(subtransaction.amount, amount);
    if (event.target.value.trim().length > 0) {
      dispatch({
        type: "amount",
        amount
      });
    }
    setAmountValue(amountStr);
  };

  const updateMemo = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "memo",
      memo: event.target.value.trim()
    });
  };

  return (
    <div className={styles["item__input"]}>
      <div className={styles["item__input-row"]}>
        <h3>{selection.name}</h3>
        <label>
          <span>Amount</span>
          <div className={styles.amount}>
            <input
              className={`${styles.input} ${isInflow ? styles.inflow : ""}`}
              type="number"
              min={0}
              step={0.01}
              value={amountValue}
              onChange={(event) => setAmountValue(event.target.value)}
              onBlur={updateAmount}
              placeholder={placeholder}
              aria-label={`${selection.name} Amount`}
            />
            <label className={styles["flow-switch"]}>
              <input
                type="checkbox"
                name="expand-autocomplete"
                id="expand-autocomplete"
                checked={isInflow}
                onChange={() => updateFlow(!isInflow)}
                aria-label={`${selection.name} Outflow/Inflow`}
              />
              <span className="toggle-slider" aria-hidden="true"></span>
            </label>
          </div>
        </label>
      </div>
      <Autocomplete
        label={"Payee"}
        showAddItem
        subtransactionDispatch={dispatch}
        initialValue={
          selection.subtransaction ? (selection.subtransaction as Subtransaction).payee_name : ""
        }
        ariaLabel={`${selection.name} Payee`}
      />
      <label className={styles["input-full"]}>
        <span>Memo</span>
        <input
          type="text"
          value={memoValue}
          onChange={(event) => setMemoValue(event.target.value)}
          onBlur={updateMemo}
          aria-label={`${selection.name} Memo`}
        ></input>
      </label>
    </div>
  );
}
