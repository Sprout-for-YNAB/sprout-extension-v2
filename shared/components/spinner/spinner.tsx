import {
  CurrencyBangladeshiIcon,
  CurrencyDollarIcon,
  CurrencyEuroIcon,
  CurrencyPoundIcon,
  CurrencyRupeeIcon,
  CurrencyYenIcon
} from "@heroicons/react/24/outline";
import styles from "./spinner.module.css";
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  big?: boolean;
  children?: ReactNode;
};

export default function Spinner({ big, children }: Props) {
  const className = `${styles.symbol} ${big ? styles.big : ""}`;
  const iconArray = useMemo(
    () => [
      <CurrencyBangladeshiIcon className={className} />,
      <CurrencyDollarIcon className={className} />,
      <CurrencyEuroIcon className={className} />,
      <CurrencyPoundIcon className={className} />,
      <CurrencyRupeeIcon className={className} />,
      <CurrencyYenIcon className={className} />
    ],
    [className]
  );

  const getRandomIndex = () => Math.floor(Math.random() * 6);
  const spinnerContainer = useRef<HTMLDivElement>(null);
  const currentIconIndex = useRef(getRandomIndex());
  const lastIntervalTimestamp = useRef(0);
  const [currentIcon, setCurrentIcon] = useState<JSX.Element>(iconArray[0]);

  const switchIcon = useCallback(
    (currentTime: number) => {
      if (!lastIntervalTimestamp.current || currentTime - lastIntervalTimestamp.current >= 1000) {
        lastIntervalTimestamp.current = currentTime;
        let newIndex;
        do {
          newIndex = getRandomIndex();
        } while (newIndex === currentIconIndex.current);
        currentIconIndex.current = newIndex;
        setCurrentIcon(iconArray[currentIconIndex.current]);
      }
      requestAnimationFrame(switchIcon);
    },
    [iconArray]
  );

  useEffect(() => {
    requestAnimationFrame(switchIcon);
  }, [switchIcon]);

  return (
    <div data-testid="spinner" className={styles.spinner} aria-busy={true}>
      <div ref={spinnerContainer} aria-hidden={true}>
        {currentIcon}
      </div>
      <p className={styles.message}>{children}</p>
    </div>
  );
}
