import styles from "./modal.module.css";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ModalFooter({ children }: Props) {
  return <footer className={styles.footer}>{children}</footer>;
}
