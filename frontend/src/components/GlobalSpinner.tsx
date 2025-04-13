// components/GlobalSpinner.tsx
import { createPortal } from "react-dom";
import Spinner from "./Spinner";

type Props = {
  show: boolean;
};

const GlobalSpinner = ({ show }: Props) => {
  if (!show) return null;

  return createPortal(
    <Spinner />,
    document.body
  );
};

export default GlobalSpinner;
