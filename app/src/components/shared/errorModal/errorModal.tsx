import { AppError } from "@shared/types/app";
import { useAsyncError, useRevalidator } from "react-router-dom";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "@shared/components/modal/modal";

type Props = {
  children: ReactNode;
};

export default function ErrorModal({ children }: Props) {
  const { revalidate, state } = useRevalidator();
  const errorResponse = useAsyncError();
  const { message } = errorResponse as AppError;

  return state === "loading" ? (
    <>{children}</>
  ) : (
    <Modal ariaLabelledBy="error-modal">
      <ModalHeader id="error-modal">An error has occurred</ModalHeader>
      <ModalBody>
        <ExclamationCircleIcon className="icon__big" />
        <p>{message}</p>
      </ModalBody>
      <ModalFooter>
        <button className="secondary" onClick={() => revalidate()}>
          Reload
        </button>
      </ModalFooter>
    </Modal>
  );
}
