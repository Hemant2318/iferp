import { useEffect } from "react";
import { Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setErrorData } from "store/globalSlice";
import "./Promptalert.scss";

const Promptalert = () => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  // eslint-disable-next-line no-unused-vars
  const { errorData } = reduxData || {};
  const { show, type, message } = errorData || {};
  const resetError = () => {
    dispatch(setErrorData({}));
  };
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        resetError();
      }, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);
  return (
    <div id="promptalert-container">
      {show && (
        <Alert variant={type} onClose={resetError} dismissible>
          <span className="text-16-500">{message}</span>
        </Alert>
      )}
    </div>
  );
};

export default Promptalert;
