import styles from "./skeleton.module.css";
import transactionStyles from "routes/transaction/transaction.module.css";

export default function TransactionSkeleton() {
  return (
    <main className={transactionStyles.main} aria-busy={true}>
      <div className={`${styles.header} skeleton skeleton-animation`}></div>
      <div className={`${styles.amount} skeleton skeleton-animation`}></div>
      <div className={`${styles.row} skeleton skeleton-animation`}></div>
      <div className={`${styles.row} skeleton skeleton-animation`}></div>
      <div className={`${styles.row} skeleton skeleton-animation`}></div>
      <div className={`${styles.row} skeleton skeleton-animation`}></div>
      <div className={`${styles.row} skeleton skeleton-animation`}></div>
      <div className={`${styles.button} skeleton skeleton-animation`}></div>
    </main>
  );
}
