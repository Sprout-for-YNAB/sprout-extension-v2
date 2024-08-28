import BudgetsSkeleton from "components/budgets/skeleton/skeleton";
import styles from "./budgets.module.css";
import BudgetItem from "components/budgets/item/item";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import { BudgetSettings } from "@shared/types/ynab";
import ErrorModal from "components/shared/errorModal/errorModal";

export default function Budgets() {
  const { budgets } = useLoaderData() as { budgets: BudgetSettings[] };

  return (
    <main className={styles.main}>
      <h1>Select Budget</h1>
      <p>Select the budget you would like to add transactions to.</p>
      <Suspense fallback={<BudgetsSkeleton />}>
        <Await resolve={budgets} errorElement={budgetsErrorElement}>
          {(budgets: BudgetSettings[]) => (
            <ul className={styles.list} aria-busy={false}>
              {budgets.map((budget) => (
                <BudgetItem key={budget.id} name={budget.name} id={budget.id} skeleton={false} />
              ))}
            </ul>
          )}
        </Await>
      </Suspense>
    </main>
  );
}

const budgetsErrorElement = (
  <ErrorModal>
    <BudgetsSkeleton />
  </ErrorModal>
);
