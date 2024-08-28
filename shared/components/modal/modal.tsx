import styles from "./modal.module.css";
import { ReactNode } from "react";
import ModalHeader from "./modalHeader";
import ModalBody from "./modalBody";
import ModalFooter from "./modalFooter";

type Props = {
  ariaLabelledBy: string;
  children: ReactNode;
};

export default function Modal({ ariaLabelledBy, children }: Props) {
  return (
    <aside className={styles.backdrop}>
      <div className={styles.modal} role="dialog" aria-labelledby={`${ariaLabelledBy}-title`}>
        {children}
      </div>
    </aside>
  );
}

export { ModalHeader, ModalBody, ModalFooter };
