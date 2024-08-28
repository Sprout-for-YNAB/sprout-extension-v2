import styles from "./modal.module.css";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "@shared/components/modal/modal";
import Spinner from "@shared/components/spinner/spinner";

type Props = {
  status: string;
  setStatus: (status: string) => void;
  ynabViewUrl: string;
  reloadPage: () => void;
  errorMessage: string;
};

export default function TransactionModal({
  status,
  setStatus,
  ynabViewUrl,
  reloadPage,
  errorMessage
}: Props) {
  const closeModal = () => {
    setStatus("hidden");
  };

  return (
    <Modal ariaLabelledBy="transaction-modal">
      {status === "loading" && (
        <>
          <ModalHeader id="transaction-modal">Saving...</ModalHeader>
          <ModalBody>
            <Spinner big />
          </ModalBody>
        </>
      )}
      {status === "error" && (
        <>
          <ModalHeader id="transaction-modal">Error</ModalHeader>
          <ModalBody>
            <ExclamationCircleIcon className="icon__big" />
            <p className={styles.error}>{errorMessage}</p>
          </ModalBody>
          <ModalFooter>
            <button className="secondary" onClick={() => closeModal()}>
              Close
            </button>
          </ModalFooter>
        </>
      )}
      {status === "success" && (
        <>
          <ModalHeader id="transaction-modal">Saved!</ModalHeader>
          <ModalBody>
            <CheckCircleIcon className="icon__big" />
          </ModalBody>
          <ModalFooter>
            <button className="secondary" onClick={() => reloadPage()}>
              Add another
            </button>
            <a className="button secondary" href={ynabViewUrl} target="_blank">
              View in YNAB
            </a>
          </ModalFooter>
        </>
      )}
    </Modal>
  );
}
