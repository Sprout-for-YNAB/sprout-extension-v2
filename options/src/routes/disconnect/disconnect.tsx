import Button from "components/button/button";
import { strings } from "./disconnect.strings";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "@shared/components/modal/modal";
import { useState } from "react";
import { getNamespace } from "@shared/utils/extensionApi";
import env from "@shared/utils/env";
import { reportError } from "@shared/utils/error";

export default function Disconnect() {
  const [showModal, setShowModal] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(false);

  const logout = () => {
    Promise.all([
      getNamespace().cookies.remove({
        name: "accessToken",
        url: env.WORKER_URL
      }),
      getNamespace().cookies.remove({
        name: "refreshToken",
        url: env.WORKER_URL
      })
    ])
      .then(() => {
        setIsDisconnected(true);
      })
      .catch(reportError);
    setIsDisconnected(true);
  };

  return (
    <>
      <section>
        <h2>Disconnect</h2>
        <Button
          title={strings.setting.title}
          description={strings.setting.description}
          id={strings.setting.id}
          label={strings.setting.label}
          disabled={false}
          onClick={() => setShowModal(true)}
          className="danger"
        />
      </section>
      {showModal && (
        <Modal ariaLabelledBy="disconnect">
          {isDisconnected ? (
            <>
              <ModalHeader id="disconnect-modal">{strings.modal.disconnected.title}</ModalHeader>
              <ModalBody>
                <p>{strings.modal.disconnected.body}</p>
                <p>{strings.modal.disconnected.deauthorize}</p>
              </ModalBody>
              <ModalFooter>
                <a
                  className="button secondary"
                  href="https://app.ynab.com/settings#:~:text=Authorized%20Applications"
                >
                  {strings.modal.disconnected.button}
                </a>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalHeader id="disconnect">{strings.modal.confirm.title}</ModalHeader>
              <ModalBody>
                <p>{strings.modal.confirm.body}</p>
              </ModalBody>
              <ModalFooter>
                <button className="secondary" onClick={() => setShowModal(false)}>
                  {strings.modal.confirm.no}
                </button>
                <button className="secondary" onClick={() => logout()}>
                  {strings.modal.confirm.yes}
                </button>
              </ModalFooter>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
