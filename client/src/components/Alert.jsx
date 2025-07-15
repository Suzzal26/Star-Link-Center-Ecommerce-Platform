import { Alert } from "react-bootstrap";
import "./Alert.css";

const Notify = ({ variant = "danger", msg }) => {
  return (
    <>
      <Alert variant={variant} className="notify-alert">
        {msg}
      </Alert>
    </>
  );
};

export default Notify;
