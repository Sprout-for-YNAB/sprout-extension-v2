import { ReactNode } from "react";

type Props = {
  id: string;
  children: ReactNode;
};

export default function ModalHeader({ id, children }: Props) {
  return (
    <header>
      <h2 id={`${id}-title`}>{children}</h2>
    </header>
  );
}
