import { SettingsContext } from "@shared/types/app";
import Toggle from "@shared/components/toggle/toggle";
import { useState } from "react";
import { useLoaderData, useOutletContext } from "react-router-dom";
import { BudgetSettings } from "@shared/types/ynab";
import strings from "./behavior.strings";
import Select from "components/select/select";

export default function Behavior() {
  const budgets = useLoaderData() as BudgetSettings[];
  const { settings, updateSetting, isLoggedIn } = useOutletContext<SettingsContext>();
  const [showDefaultBudget, setShowDefaultBudget] = useState(!settings.lastBudget && isLoggedIn);

  const updateExpand = (newValue: boolean) => {
    updateSetting({ expandAutocomplete: newValue });
  };

  const updateLastBudget = (newValue: boolean) => {
    updateSetting({ lastBudget: newValue });
    setShowDefaultBudget(!newValue && isLoggedIn);
  };

  const updateDefaultBudget = (id: string) => {
    const budgetName = budgets.find((budget) => budget.id === id)?.name;
    const defaultBudget = {
      id,
      name: budgetName
    } as BudgetSettings;
    updateSetting({ defaultBudget });
  };

  return (
    <section>
      <h2>Behavior</h2>
      <Toggle
        title={strings.expand.title}
        description={strings.expand.description}
        id={strings.expand.id}
        initialState={settings.expandAutocomplete}
        updateFn={updateExpand}
      />
      <Toggle
        title={strings.lastBudget.title}
        description={strings.lastBudget.description}
        id={strings.lastBudget.id}
        initialState={settings.lastBudget}
        updateFn={updateLastBudget}
      />
      {showDefaultBudget && (
        <Select
          title={strings.defaultBudget.title}
          description={strings.defaultBudget.description}
          id={strings.defaultBudget.id}
          initialValue={settings?.defaultBudget ? settings.defaultBudget.id : ""}
          options={budgets.map((budget) => ({ name: budget.name, value: budget.id }))}
          updateFn={updateDefaultBudget}
        />
      )}
    </section>
  );
}
