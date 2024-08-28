import styles from "./budgets.module.css";
import { BudgetSettings } from "@shared/types/ynab";
import { getNamespace } from "@shared/utils/extensionApi";
import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import Radio from "@shared/components/radio/radio";

export default function Budgets() {
  const { name } = getNamespace().runtime.getManifest();
  const budgets = useLoaderData() as BudgetSettings[];
  const [defaultBudget, setDefaultBudget] = useState("none");

  const updateDefaultBudget = (newValue: string) => {
    console.log("default budget", newValue);
    setDefaultBudget(newValue);
  };

  return (
    <>
      <h1>Access all your budgets</h1>
      <p>
        {name} allows you to access all your YNAB budgets and switch between them to add
        transactions to.
      </p>
      <form>
        <fieldset>
          <legend>
            Would you like to set a specific budget as your default when you open the extension?
          </legend>
          <div className={styles.radios}>
            <Radio
              label="Don't set default budget"
              value="none"
              id="no-budget"
              name="defaultBudget"
              checked={defaultBudget === "none"}
              updateFn={updateDefaultBudget}
            />
            <Radio
              label="Use last opened budget"
              value="last"
              id="last-budget"
              name="defaultBudget"
              checked={defaultBudget === "last"}
              updateFn={updateDefaultBudget}
            />
            {budgets.map((budget) => (
              <Radio
                key={budget.id}
                label={budget.name}
                value={budget.id}
                id={budget.id}
                name="defaultBudget"
                checked={defaultBudget === budget.id}
                updateFn={updateDefaultBudget}
              />
            ))}
          </div>
        </fieldset>
        <button>Continue</button>
      </form>
    </>
  );
}
