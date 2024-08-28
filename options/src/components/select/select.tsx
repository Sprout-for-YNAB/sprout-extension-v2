import { ChangeEvent, useState } from "react";

type Props = {
  title: string;
  description: string;
  id: string;
  initialValue: string;
  options: { name: string; value: string }[];
  hideDefault?: boolean;
  updateFn: (newValue: string) => void;
};

export default function Select({
  title,
  description,
  id,
  initialValue,
  options,
  hideDefault,
  updateFn
}: Props) {
  const [selected, setSelected] = useState(initialValue);

  const updateSelected = (event: ChangeEvent<HTMLSelectElement>) => {
    updateFn(event.target.value);
    setSelected(event.target.value);
  };

  return (
    <div className="row">
      <div className="description">
        <label htmlFor={id}>{title}</label>
        <small>{description}</small>
      </div>
      <select id={id} onChange={updateSelected} value={selected}>
        {!hideDefault && <option value="">None</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
