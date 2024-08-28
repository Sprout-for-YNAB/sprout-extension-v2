import { ChangeEvent, useState } from "react";
import { useTransactionFormContext } from "contexts/transactionFormContext";
import { todaysDate } from "utils/date";

export default function Date() {
  const [value, setValue] = useState(todaysDate);
  const { dispatch } = useTransactionFormContext();

  const saveDate = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "date",
      date: event.target.value
    });
  };

  return (
    <label>
      <span>Date</span>
      <input
        id="date"
        type="date"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={saveDate}
        min="2000-01-01"
        max={todaysDate}
      />
    </label>
  );
}
