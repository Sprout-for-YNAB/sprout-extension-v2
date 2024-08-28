import { Group } from "@shared/types/ynab";
import styles from "./suggestions.module.css";
import { ForwardedRef, forwardRef, memo, useEffect, useState } from "react";
import { Index, Selection } from "@shared/types/app";
import useSettings from "@shared/hooks/useSettings";
import { PlusIcon, QueueListIcon } from "@heroicons/react/16/solid";

type Props = {
  label: string;
  items: Group[];
  highlighted: Selection | null;
  setHighlighted: (selection: Selection | null) => void;
  selectedId: string;
  selectItem: () => void;
  showAddItem: boolean;
  value: string;
  fullscreen: boolean;
  showSubtransactionModal: () => void;
};

const Suggestions = memo(
  forwardRef(function Suggestion(
    {
      label,
      items,
      highlighted,
      setHighlighted,
      selectedId,
      selectItem,
      showAddItem,
      value,
      fullscreen,
      showSubtransactionModal
    }: Props,
    ref: ForwardedRef<HTMLUListElement>
  ) {
    const { accountBalances, categoryBalances } = useSettings();
    const isHighlighted = (id: string, index: Index) => {
      return (highlighted && highlighted.id === id) || highlighted?.index === index;
    };
    const [showBalances, setShowBalances] = useState(false);
    const splitString = "Split (Multiple Categories)";

    useEffect(() => {
      setShowBalances(
        (Boolean(accountBalances) && label === "Account") ||
          (Boolean(categoryBalances) && label === "Category")
      );
    }, [accountBalances, categoryBalances, label]);

    return (
      <ul
        id={`${label.toLowerCase()}-input-list`}
        className={`${styles["suggestion-box"]} ${fullscreen ? styles.fullscreen : ""}`}
        role="listbox"
        ref={ref}
        tabIndex={-1}
      >
        {label === "Category" && (value.length === 0 || value === splitString) && (
          <li
            key={0}
            className={styles.suggestion}
            role="option"
            onMouseEnter={() => setHighlighted(null)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              showSubtransactionModal();
            }}
          >
            <span>{splitString}</span>
            <QueueListIcon className={styles.icon} />
          </li>
        )}
        {items.map((group, groupIndex) => (
          <>
            <div key={group.id} className={styles["suggestion-group__header"]}>
              {group.name}
            </div>
            {group.items.map((item, itemIndex) => (
              <li
                key={item.id}
                className={`${styles.suggestion} ${
                  isHighlighted(item.id, {
                    groupIndex,
                    itemIndex
                  })
                    ? styles["suggestion__highlighted"]
                    : ""
                }`}
                role="option"
                id={item.id}
                onMouseEnter={() =>
                  setHighlighted({
                    id: item.id,
                    name: item.name,
                    index: { groupIndex, itemIndex }
                  })
                }
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectItem()}
                onMouseLeave={() => setHighlighted(null)}
                aria-selected={item.id === selectedId}
                data-highlighted={isHighlighted(item.id, {
                  groupIndex,
                  itemIndex
                })}
              >
                <span>{item.name}</span>
                <span className={item.balance?.charAt(0) === "-" ? "danger" : ""}>
                  {showBalances && item.balance ? item.balance : ""}
                </span>
              </li>
            ))}
          </>
        ))}
        {showAddItem && value && (
          <li key={-1} className={styles.suggestion} onMouseEnter={() => setHighlighted(null)}>
            <span>
              Create new {label.toLowerCase()} {value.trim()}
            </span>
            <PlusIcon className={styles.icon} />
          </li>
        )}
        {items.length === 0 && !showAddItem && value !== splitString && (
          <li key={-1} className={`${styles.suggestion} ${styles["suggestion__no-highlight"]}`}>
            No matching {label.toLowerCase()} found
          </li>
        )}
      </ul>
    );
  })
);

export default Suggestions;
