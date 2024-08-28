import { useState } from "react";

type Props = {
  title: string;
  description: string;
  id: string;
  initialState: boolean | undefined;
  updateFn: (newValue: boolean) => void;
};

export default function Toggle({ title, description, id, initialState, updateFn }: Props) {
  const [checked, setChecked] = useState(Boolean(initialState));

  const updateChecked = () => {
    updateFn(!checked);
    setChecked(!checked);
  };

  return (
    <div className="row">
      <div className="description">
        <label htmlFor={id}>{title}</label>
        {description && <small>{description}</small>}
      </div>
      <input type="checkbox" name={id} id={id} checked={checked} onChange={() => updateChecked()} />
      <span className="toggle-slider" aria-hidden="true" onClick={() => updateChecked()}></span>
    </div>
  );
}
