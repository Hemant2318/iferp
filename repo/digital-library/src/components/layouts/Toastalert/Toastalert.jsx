import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setErrorData } from "store/globalSlice";
import "react-toastify/dist/ReactToastify.css";
import "./Toastalert.scss";

const Toastalert = () => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  // eslint-disable-next-line no-unused-vars
  const { errorData } = reduxData || {};
  const { show, type, message } = errorData || {};
  const resetError = () => {
    dispatch(
      setErrorData({
        show: false,
        message: "",
        type: "",
      })
    );
  };
  useEffect(() => {
    if (show) {
      const option = {
        onClose: () => {
          resetError();
        },
      };
      if (type === "success") {
        toast.success(message, option);
      } else {
        toast.error(message, option);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);
  return (
    <div id="toastalert-container">
      <ToastContainer autoClose={3000} pauseOnFocusLoss={false} />
    </div>
  );
};

export default Toastalert;
