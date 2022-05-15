import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Card(props: Props) {
  return (
    <div style={{ border: "1px solid black", margin: "2px", padding: "8px" }}>
      {props.children}
    </div>
  );
}
