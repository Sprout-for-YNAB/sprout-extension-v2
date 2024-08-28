import { EXTENSION_NAME, WEBSITE_URL } from "utils/constants";
import styles from "./login.module.css";
import { useState } from "react";
import { prepareAuthenticationTab } from "api/authentication";
import { reportError } from "@shared/utils/error";
import { useLoaderData } from "react-router-dom";
import UpdateNoticeModal from "components/login/modal/modal";

export default function Login() {
  const isV1User = useLoaderData();
  const [showUpdateModal, setShowUpdateModal] = useState(isV1User);
  const [showCloseNotice, setShowCloseNotice] = useState(false);

  const openAuthenticationTab = () => {
    try {
      prepareAuthenticationTab();
      setShowCloseNotice(true);
    } catch (error) {
      reportError(error);
    }
  };

  return (
    <>
      <main className={styles.main}>
        {!showCloseNotice ? (
          <>
            <h1>{EXTENSION_NAME}</h1>
            <p>
              {EXTENSION_NAME} allows you to quickly add a transaction to your budget without having
              to leave your current tab.
            </p>
            <p>To begin, log in with your YNAB account.</p>
            <button className={styles.button} onClick={openAuthenticationTab}>
              Log in with YNAB
            </button>
            <small className={styles.notice}>
              By authorizing {EXTENSION_NAME}, you are agreeing to our{" "}
              <a href={`${WEBSITE_URL}/privacy`} target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
              .
            </small>
          </>
        ) : (
          <p>You can close this extension and log in to YNAB in the opened tab.</p>
        )}
      </main>
      {showUpdateModal && <UpdateNoticeModal setShowModal={setShowUpdateModal} />}
    </>
  );
}
