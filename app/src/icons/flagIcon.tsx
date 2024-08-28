import styles from "./flagIcon.module.css";
import { FLAGS } from "utils/constants";

type Props = {
  color?: string;
  filled?: boolean;
  showX?: boolean;
};

export default function FlagIcon({ color, filled, showX }: Props) {
  const getClassName = () => {
    let className = filled ? `${styles.flag} ${styles.filled}` : styles.flag;

    switch (color) {
      case FLAGS.red:
        className += ` ${styles.red}`;
        break;
      case FLAGS.orange:
        className += ` ${styles.orange}`;
        break;
      case FLAGS.yellow:
        className += ` ${styles.yellow}`;
        break;
      case FLAGS.green:
        className += ` ${styles.green}`;
        break;
      case FLAGS.blue:
        className += ` ${styles.blue}`;
        break;
      case FLAGS.purple:
        className += ` ${styles.purple}`;
        break;
      default:
        className += ` ${styles.none}`;
        break;
    }
    return className;
  };

  return (
    <svg
      className={getClassName()}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
    >
      <path
        strokeWidth="2"
        d="M2.75 19.25V5.75h18.316l-5.316 5.844a1.346 1.346 0 0 0 0 1.812l5.316 5.844H2.75Z"
      />
      {showX && (
        <path d="m8.942 12.837.354-.353-.354-.354-2.371-2.372a.156.156 0 0 1 .22-.22l2.372 2.372.353.353.354-.353 2.372-2.372a.157.157 0 0 1 .22.22L10.09 12.13l-.353.354.353.353 2.38 2.38.007.006.006.006a.155.155 0 0 1 .05.112.157.157 0 0 1-.16.159.158.158 0 0 1-.11-.05l-.007-.006-.006-.006-2.38-2.38-.354-.354-.353.354-2.38 2.38-.006.006-.006.006a.158.158 0 0 1-.173.039.155.155 0 0 1-.087-.087.156.156 0 0 1 .039-.173l.006-.006.006-.006 2.38-2.38Z" />
      )}
    </svg>
  );
}
