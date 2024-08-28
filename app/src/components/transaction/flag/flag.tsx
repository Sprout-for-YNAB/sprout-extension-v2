import styles from "./flag.module.css";
import { ChangeEvent, useState } from "react";
import { FLAGS } from "utils/constants";
import FlagIcon from "icons/flagIcon";
import { useTransactionFormContext } from "contexts/transactionFormContext";
import { FlagColor } from "@shared/types/ynab";

export default function Flag() {
  const [value, setValue] = useState("");
  const { dispatch } = useTransactionFormContext();

  const saveFlag = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "flag",
      flag_color: event.target.value ? (event.target.value as FlagColor) : null
    });
    setValue(event.target.value);
  };

  return (
    <fieldset>
      <legend>Flag</legend>
      <div className={styles.flags}>
        <label className={`${styles["flag-option"]}`}>
          <FlagIcon filled={Object.values(FLAGS).indexOf(value) === -1} showX />
          <input
            aria-label="None"
            type="radio"
            name="flag"
            value=""
            onChange={saveFlag}
            checked={Object.values(FLAGS).indexOf(value) === -1}
          />
        </label>
        <label className={`${styles["flag-option"]} ${styles["flag-red"]}`}>
          <FlagIcon color={FLAGS.red} filled={value === FLAGS.red} />
          <input
            aria-label="Red"
            type="radio"
            name="flag"
            value={FLAGS.red}
            onChange={saveFlag}
            checked={value === FLAGS.red}
          />
        </label>
        <label className={`${styles["flag-option"]} ${styles["flag-orange"]}`}>
          <FlagIcon color={FLAGS.orange} filled={value === FLAGS.orange} />
          <input
            aria-label="Orange"
            type="radio"
            name="flag"
            value={FLAGS.orange}
            onChange={saveFlag}
            checked={value === FLAGS.orange}
          />
        </label>
        <label className={`${styles["flag-option"]} ${styles["flag-yellow"]}`}>
          <FlagIcon color={FLAGS.yellow} filled={value === FLAGS.yellow} />
          <input
            aria-label="Yellow"
            type="radio"
            name="flag"
            value={FLAGS.yellow}
            onChange={saveFlag}
            checked={value === FLAGS.yellow}
          />
        </label>
        <label className={`${styles["flag-option"]} ${styles["flag-green"]}`}>
          <FlagIcon color={FLAGS.green} filled={value === FLAGS.green} />
          <input
            aria-label="Green"
            type="radio"
            name="flag"
            value={FLAGS.green}
            onChange={saveFlag}
            checked={value === FLAGS.green}
          />
        </label>
        <label className={`${styles["flag-option"]} ${styles["flag-blue"]}`}>
          <FlagIcon color={FLAGS.blue} filled={value === FLAGS.blue} />
          <input
            aria-label="Blue"
            type="radio"
            name="flag"
            value={FLAGS.blue}
            onChange={saveFlag}
            checked={value === FLAGS.blue}
          />
        </label>
        <label className={`${styles["flag-option"]} ${styles["flag-purple"]}`}>
          <FlagIcon color={FLAGS.purple} filled={value === FLAGS.purple} />
          <input
            aria-label="Purple"
            type="radio"
            name="flag"
            value={FLAGS.purple}
            onChange={saveFlag}
            checked={value === FLAGS.purple}
          />
        </label>
      </div>
    </fieldset>
  );
}
