import styles from "./modal.module.css";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ModalBody({ children }: Props) {
  return <section className={styles.body}>{children}</section>;
}
