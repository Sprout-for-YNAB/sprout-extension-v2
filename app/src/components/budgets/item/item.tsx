import styles from "./item.module.css";
import { Link } from "react-router-dom";
import useSettings from "@shared/hooks/useSettings";
import { getNamespace } from "@shared/utils/extensionApi";
import { reportError } from "@shared/utils/error";

type Props = {
  name: string;
  id: string;
  skeleton: boolean;
};

export default function BudgetItem({ name, id, skeleton }: Props) {
  const settings = useSettings();

  const saveLastBudget = () => {
    if (settings.lastBudget) {
      getNamespace()
        .storage.sync.set({
          settings: {
            ...settings,
            defaultBudget: { id, name }
          }
        })
        .catch(reportError);
    }
  };

  return (
    <li className={styles.item}>
      {skeleton ? (
        <div className={`${styles.link} ${styles["skeleton-text"]}`}>
          <div className="skeleton skeleton-animation" />
        </div>
      ) : (
        <Link
          to={`/budgets/${id}?name=${encodeURIComponent(name)}`}
          className={styles.link}
          data-testid="budget-item"
          onClick={() => saveLastBudget()}
        >
          <span>{name}</span>
        </Link>
      )}
    </li>
  );
}
