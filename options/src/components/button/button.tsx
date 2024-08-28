type Props = {
  title: string;
  description: string;
  id: string;
  label: string;
  disabled: boolean;
  onClick: () => void;
  className?: string;
};

export default function Button({
  title,
  description,
  id,
  label,
  disabled,
  onClick,
  className
}: Props) {
  return (
    <div className="row">
      <div className="description">
        <label htmlFor={id}>{title}</label>
        <small>{description}</small>
      </div>
      <input
        type="button"
        id={id}
        value={label}
        onClick={() => onClick()}
        disabled={disabled}
        className={className}
      />
    </div>
  );
}
