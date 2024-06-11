import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { setErrorData } from "store/globalSlice";
import "react-toastify/dist/ReactToastify.css";

const ErrorAlert = () => {
  const dispatch = useDispatch();
  const { errorData } = useSelector((state) => ({
    errorData: state.global.errorData,
  }));
  useEffect(() => {
    if (errorData?.show) {
      const option = {
        onClose: () => {
          dispatch(setErrorData({}));
        },
      };
      if (errorData?.type === "success") {
        toast.success(errorData?.message, option);
      } else {
        toast.error(errorData?.message, option);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorData]);

  return <ToastContainer autoClose={3000} pauseOnFocusLoss={false} />;
};

export default ErrorAlert;
