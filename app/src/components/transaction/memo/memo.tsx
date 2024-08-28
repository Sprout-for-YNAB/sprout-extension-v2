import { ChangeEvent, useState } from "react";
import { useTransactionFormContext } from "contexts/transactionFormContext";

export default function Memo() {
  const [value, setValue] = useState("");
  const { dispatch } = useTransactionFormContext();

  const updateValue = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const saveMemo = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "memo",
      memo: event.target.value.trim()
    });
  };

  return (
    <div className="form__row">
      <label htmlFor="memo">Memo</label>
      <input id="memo" type="text" value={value} onChange={updateValue} onBlur={saveMemo} />
    </div>
  );
}
