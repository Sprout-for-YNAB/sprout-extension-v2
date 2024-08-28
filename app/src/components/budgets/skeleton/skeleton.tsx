import styles from "routes/budgets/budgets.module.css";
import BudgetItem from "components/budgets/item/item";

export default function BudgetsSkeleton() {
  return (
    <ul className={styles.list} aria-busy={true}>
      <BudgetItem key={1} name="" id="" skeleton={true} />
      <BudgetItem key={2} name="" id="" skeleton={true} />
      <BudgetItem key={3} name="" id="" skeleton={true} />
      <BudgetItem key={4} name="" id="" skeleton={true} />
    </ul>
  );
}
