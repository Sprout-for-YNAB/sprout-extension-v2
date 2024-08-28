import styles from "./transaction.module.css";
import AmountInput from "components/transaction/amount/amount";
import TransactionFormContext from "contexts/transactionFormContext";
import { KeyboardEvent, Suspense, useReducer, useRef, useState } from "react";
import { Await, Link, useLoaderData, useParams, useSearchParams } from "react-router-dom";
import { initialTransaction, transactionReducer } from "reducers/transactionReducer";
import { Budget, YnabError } from "@shared/types/ynab";
import { Cog8ToothIcon, FolderIcon } from "@heroicons/react/24/solid";
import Autocomplete from "components/transaction/autocomplete/autocomplete";
import { openSettings } from "@shared/utils/extensionApi";
import MemoInput from "components/transaction/memo/memo";
import DateInput from "components/transaction/date/date";
import ClearToggle from "components/transaction/clear/clear";
import FlagSelect from "components/transaction/flag/flag";
import TransactionModal from "components/transaction/modal/modal";
import { sendTransaction } from "api/budget";
import { YNAB_URL } from "utils/constants";
import TransactionViewContext from "contexts/transactionViewContext";
import SubtransactionModal from "components/transaction/subtransaction/modal/modal";
import ErrorModal from "components/shared/errorModal/errorModal";
import TransactionSkeleton from "components/transaction/skeleton/skeleton";
import { reportError } from "@shared/utils/error";

export default function Transaction() {
  const { budget } = useLoaderData() as { budget: Budget };
  const { budgetId } = useParams();
  const [searchParams] = useSearchParams();
  const ynabViewUrl = useRef(YNAB_URL);
  const [modalStatus, setModalStatus] = useState("hidden");
  const errorMessage = useRef("");
  const [transaction, dispatch] = useReducer(transactionReducer, initialTransaction);
  const [showSubtransactionModal, setShowSubtransactionModal] = useState(false);
  const [key, setKey] = useState(Date.now());

  const onKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const submit = () => {
    if (budgetId) {
      setModalStatus("loading");
      sendTransaction(budgetId, transaction)
        .then(() => {
          ynabViewUrl.current = `${YNAB_URL}/${budgetId}/accounts/${transaction.account_id}`;
          setModalStatus("success");
        })
        .catch((error) => {
          const { error_description } = error as YnabError;
          errorMessage.current = error_description;
          setModalStatus("error");
          reportError(error);
        });
    }
  };

  const reloadPage = () => {
    dispatch({
      type: "reset"
    });
    setKey(Date.now());
    setModalStatus("hidden");
  };

  return (
    <Suspense fallback={<TransactionSkeleton />}>
      <Await resolve={budget} errorElement={transactionErrorElement}>
        {(budget: Budget) => (
          <TransactionViewContext.Provider
            value={{
              accounts: budget.accounts,
              payees: budget.payees,
              categoryGroups: budget.categoryGroups,
              currencyFormat: budget.settings.currency_format,
              setShowSubtransactionModal
            }}
          >
            <TransactionFormContext.Provider value={{ transaction, dispatch }}>
              <main className={styles.main} aria-busy={false}>
                <header className={styles.header}>
                  <h1 className={styles.name}>
                    {decodeURIComponent(searchParams.get("name") ?? "Add Transaction")}
                  </h1>
                  <Link
                    aria-label="Switch budget"
                    to="/budgets"
                    className={`button secondary icon ${styles.back}`}
                  >
                    <FolderIcon />
                  </Link>
                  <button
                    aria-label="Settings"
                    className={`secondary icon ${styles.settings}`}
                    onClick={openSettings}
                  >
                    <Cog8ToothIcon />
                  </button>
                </header>
                <form
                  onSubmit={(event) => event.preventDefault()}
                  onKeyDown={onKeyDown}
                  autoComplete="off"
                  key={key}
                >
                  <AmountInput />
                  <Autocomplete label="Account" />
                  <Autocomplete label="Payee" showAddItem />
                  <Autocomplete label="Category" />
                  <MemoInput />
                  <div className="form__grid">
                    <DateInput />
                    <FlagSelect />
                    <ClearToggle />
                  </div>
                  <button onClick={() => submit()} type="submit" className={styles.submit}>
                    Save Transaction
                  </button>
                </form>
              </main>
              {modalStatus !== "hidden" && (
                <TransactionModal
                  status={modalStatus}
                  setStatus={setModalStatus}
                  ynabViewUrl={ynabViewUrl.current}
                  reloadPage={reloadPage}
                  errorMessage={errorMessage.current}
                />
              )}
              {showSubtransactionModal && <SubtransactionModal />}
            </TransactionFormContext.Provider>
          </TransactionViewContext.Provider>
        )}
      </Await>
    </Suspense>
  );
}

const transactionErrorElement = (
  <ErrorModal>
    <TransactionSkeleton />
  </ErrorModal>
);
