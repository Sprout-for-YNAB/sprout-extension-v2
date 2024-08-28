import { useTransactionFormContext } from "contexts/transactionFormContext";
import styles from "./clear.module.css";
import { useState } from "react";

export default function Clear() {
  const [checked, setChecked] = useState(false);
  const { dispatch } = useTransactionFormContext();

  const updateValue = () => {
    dispatch({
      type: "cleared",
      cleared: !checked
    });
    setChecked(!checked);
  };

  return (
    <label className={styles.clear}>
      <span>Clear</span>
      <input type="checkbox" name="clear" checked={checked} onChange={() => updateValue()} />
      <span className={`toggle-slider ${styles.slider}`} aria-hidden="true"></span>
    </label>
  );
}
