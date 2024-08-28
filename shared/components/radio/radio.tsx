import styles from "./radio.module.css";
import { ChangeEvent } from "react";

type Props = {
  label: string;
  value: string;
  id: string;
  name: string;
  checked: boolean;
  updateFn: (newValue: string) => void;
};

export default function Radio({ label, value, id, name, checked, updateFn }: Props) {
  // const [checked, isChecked] = useState(isDefault);

  const updateChecked = (event: ChangeEvent<HTMLInputElement>) => {
    updateFn(event.target.value);
    // isChecked(event.target.value === value);
  };

  return (
    <label className={styles.container}>
      <input
        className={styles.radio}
        type="radio"
        value={value}
        id={id}
        name={name}
        defaultChecked={checked}
        onChange={updateChecked}
      />
      <span className={styles.label}>{label}</span>
    </label>
  );
}
