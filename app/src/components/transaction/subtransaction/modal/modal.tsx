import { useTransactionViewContext } from "contexts/transactionViewContext";
import styles from "./modal.module.css";
import { Subtransaction } from "@shared/types/ynab";
import { KeyboardEvent, useEffect, useState } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useTransactionFormContext } from "contexts/transactionFormContext";
import SubtransactionCategory from "components/transaction/subtransaction/subtransactionCategory/subtransactionCategory";
import { SubtransactionSelection } from "@shared/types/app";
import { formatAmount } from "utils/format";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "@shared/components/modal/modal";

export default function SubtransactionModal() {
  const { categoryGroups, currencyFormat } = useTransactionViewContext();
  const [selected, setSelected] = useState<SubtransactionSelection[]>([]);
  const [showInputScreen, setShowInputScreen] = useState(false);
  const { setShowSubtransactionModal } = useTransactionViewContext();
  const { transaction, dispatch } = useTransactionFormContext();
  const [remainingSum, setRemainingSum] = useState(transaction.amount);

  useEffect(() => {
    const savedSubtransactions = transaction.subtransactions?.map((subtransaction) => {
      return {
        id: subtransaction.category_id,
        name: subtransaction.category_name,
        subtransaction
      } as SubtransactionSelection;
    });
    setSelected(savedSubtransactions ?? []);
  }, [transaction.subtransactions]);

  const onChange = (id: string, name: string) => {
    const item = { id, name } as SubtransactionSelection;
    if (isItemSelected(id)) {
      removeFromSelected(id);
    } else {
      setSelected([...selected, item]);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const updateRemainingSum = (oldAmount: number, newAmount: number) => {
    setRemainingSum(remainingSum + oldAmount - newAmount);
  };

  const isItemSelected = (id: string) => {
    return selected.findIndex((savedItem) => savedItem.id === id) !== -1;
  };

  const removeFromSelected = (id: string) => {
    setSelected(selected.filter((savedItem) => savedItem.id !== id));
  };

  const prepareSubtransactionArray = () => {
    let savedSum = 0;
    for (const category of selected) {
      if (!category.subtransaction) {
        category.subtransaction = {
          amount: 0,
          category_id: category.id ?? "",
          category_name: category.name
        } as Subtransaction;
      } else {
        savedSum += (category.subtransaction as Subtransaction).amount;
      }
    }
    setRemainingSum(remainingSum - savedSum);
    setShowInputScreen(true);
  };

  const saveSubtransactions = () => {
    dispatch({
      type: "subtransactions",
      subtransactions: selected.map((category) => category.subtransaction as Subtransaction)
    });
    setShowSubtransactionModal(false);
  };

  return (
    <Modal ariaLabelledBy="split-modal">
      <ModalHeader id="split-modal">Split Categories</ModalHeader>
      {!showInputScreen ? (
        <form
          onSubmit={(event) => event.preventDefault()}
          onKeyDown={onKeyDown}
          autoComplete="off"
          data-testid="select-view"
        >
          <ModalBody>
            <p>Select categories to split</p>
            <dl className={styles["select-list"]}>
              {categoryGroups.map((group) => (
                <>
                  <dt key={group.id} className={styles["item-group__header"]}>
                    {group.name}
                  </dt>
                  {group.items.map((item) => (
                    <dd key={item.id} className={styles.item}>
                      <label className={styles["item__label"]} htmlFor={`${item.id}-item`}>
                        <span className={styles["item__checkbox"]}>
                          <input
                            onChange={() => onChange(item.id, item.name)}
                            id={`${item.id}-item`}
                            type="checkbox"
                            checked={isItemSelected(item.id)}
                          />
                          <span className="toggle-checkbox" aria-hidden="true">
                            <CheckIcon />
                          </span>
                        </span>
                        <span className={styles["item__label-text"]}>
                          <span>{item.name}</span>
                          <span className={item.balance?.charAt(0) === "-" ? "danger" : ""}>
                            {item.balance ?? ""}
                          </span>
                        </span>
                      </label>
                    </dd>
                  ))}
                </>
              ))}
            </dl>
          </ModalBody>
          <ModalFooter>
            <button className="secondary" onClick={() => setShowSubtransactionModal(false)}>
              Close
            </button>
            <button
              className="secondary"
              disabled={selected.length < 2}
              onClick={() => prepareSubtransactionArray()}
            >
              Continue
            </button>
          </ModalFooter>
        </form>
      ) : (
        <form
          onSubmit={(event) => event.preventDefault()}
          onKeyDown={onKeyDown}
          autoComplete="off"
          data-testid="input-view"
        >
          <ModalBody>
            <p>Enter the amounts for the selected categories</p>
            <div className={styles["input-list"]}>
              {selected.map((item) => (
                <SubtransactionCategory selection={item} updateRemainingSum={updateRemainingSum} />
              ))}
            </div>
            <span className={styles.remaining}>
              Remaining: {formatAmount(remainingSum, currencyFormat)}
            </span>
          </ModalBody>
          <ModalFooter>
            <button onClick={() => setShowInputScreen(false)}>Back</button>
            <button disabled={remainingSum !== 0} onClick={() => saveSubtransactions()}>
              Save
            </button>
          </ModalFooter>
        </form>
      )}
    </Modal>
  );
}
