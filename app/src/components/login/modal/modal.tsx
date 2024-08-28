import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { EXTENSION_NAME, WEBSITE_URL } from "utils/constants";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "@shared/components/modal/modal";

type Props = {
  setShowModal: (show: boolean) => void;
};

export default function UpdateNoticeModal({ setShowModal }: Props) {
  return (
    <Modal ariaLabelledBy="update-modal">
      <ModalHeader id="update-modal">Version 2.0 is here!</ModalHeader>
      <ModalBody>
        <InformationCircleIcon className="icon__big" />
        <p>Thank you for continuing to use {EXTENSION_NAME}!</p>
        <p>
          The extension has been rewritten from the ground up with Version 2.0. As a result, you'll
          have to reauthorize your YNAB account to continue using the extension.
        </p>
        <p>Your existing settings have carried over. Your cached data has been cleared.</p>
        <p>I apologize for the inconvenience and hope you continue to use Sprout for YNAB!</p>
        <p>
          You can read more about Version 2.0{" "}
          <a href={`${WEBSITE_URL}/updates/2.0.0`} target="_blank">
            here
          </a>
          .
        </p>
      </ModalBody>
      <ModalFooter>
        <button className="secondary" onClick={() => setShowModal(false)}>
          Continue
        </button>
      </ModalFooter>
    </Modal>
  );
}
