import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import Button from "components/form/Button";
import InputOTP from "components/form/InputOTP";
import Card from "components/Layout/Card";
import HeaderLayout from "components/Layout/HeaderLayout";
import LineTextLabel from "components/Layout/LineTextLabel";
import {
  verifyOTP,
  handelLogout,
  setApiError,
  fetchProfile,
  handelSendOTP,
} from "store/slices";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { email } = state;
  const [counter, setCounter] = useState(30);
  const [isOTPSent, setIsOTPSent] = useState(true);
  const [loadButton, setLoadButton] = useState(false);
  const [resendLoader, setResendLoader] = useState(false);
  const [resetOTP, setResetOTP] = useState(true);
  const [otp, setOTP] = useState("");

  const handelVerifyOTP = async () => {
    setLoadButton(true);
    const formData = objectToFormData({
      user_id: getDataFromLocalStorage("id"),
      otp: otp,
    });
    const response = await dispatch(verifyOTP(formData));
    if (response?.status === 200) {
      await dispatch(fetchProfile());
      dispatch(
        setApiError({
          show: true,
          message: "Email Verified Successfully.",
          type: "success",
        })
      );
      window.location.reload();
    }
    setLoadButton(false);
  };

  const handleOtp = (newOtp) => {
    if (newOtp) {
      setOTP(newOtp);
    }
  };
  const handleResendOTP = async () => {
    setResendLoader(true);
    const response = await dispatch(
      handelSendOTP(objectToFormData({ email: email }))
    );
    if (response?.status === 200) {
      setIsOTPSent(true);
      setCounter(30);
    }
    setResendLoader(false);
  };
  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    if (counter === 0) {
      setIsOTPSent(false);
    }
  }, [counter]);
  useEffect(() => {
    if (getDataFromLocalStorage("registration_email_otp_status") === "1") {
      navigate("/");
    }
    setResetOTP(true);
    setOTP("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <HeaderLayout>
      <div id="forgot-password-container">
        <Card className="card-padding ps-5 pe-5 pt-5 pb-5">
          <div className="d-flex position-relative mb-3">
            <div className="text-28-500 color-black-olive">
              Email Verification
            </div>
          </div>
          <div className="text-15-400 color-black-olive mb-5">
            A One-Time Passcode has been sent your registered email{" "}
            <span className="text-15-500 color-raisin-black">{email}</span>
            {/* OTP password has been sent to your email. Please check your spam
            folder in case you've not received. */}
          </div>
          {/* <div className="cmb-30 text-14-500 color-raisin-black text-center mt-2">
            {email}
          </div> */}
          <div className="mb-4 text-14-500 color-raisin-black text-center">
            Enter One-time Passcode
          </div>
          <Formik
            initialValues={{}}
            onSubmit={() => {
              handelVerifyOTP();
            }}
          >
            {(props) => {
              const { handleSubmit } = props;
              return (
                <form
                  onSubmit={handleSubmit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                >
                  <div className="center-flex flex-column">
                    <InputOTP
                      blockSize={4}
                      resetOTP={resetOTP}
                      onSubmit={handleOtp}
                      setResetOTP={setResetOTP}
                      isDisableTyping={loadButton}
                    />
                  </div>
                  <div className="mt-5 mb-4">
                    {isOTPSent && (
                      <div className="text-center text-14-400">OTP sent!</div>
                    )}
                    {counter === 0 ? (
                      <div className="d-flex justify-content-center">
                        <Button
                          className="ps-3 pe-3 h-35 text-14-400"
                          text="Resend OTP"
                          btnStyle="primary-outline"
                          onClick={handleResendOTP}
                          btnLoading={resendLoader}
                          disabled={resendLoader}
                        />
                      </div>
                    ) : (
                      <div className="text-center text-16-400 mt-2">
                        You can resend the OTP in
                        <span className="color-new-car text-16-500">{` ${counter}`}</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-3 ps-5 pe-5">
                    <Button
                      text="Verify Email"
                      btnStyle="primary-dark"
                      onClick={handelVerifyOTP}
                      disabled={loadButton || !otp || (otp && otp.length !== 4)}
                      btnLoading={loadButton}
                    />
                  </div>
                </form>
              );
            }}
          </Formik>

          <div className="mt-4">
            <LineTextLabel text="OR" />

            <div className="text-center mt-3">
              <span
                className="text-14-500 color-new-car underline ps-2 pointer"
                onClick={() => {
                  dispatch(handelLogout());
                }}
              >
                <u>Move back</u> ?
              </span>
            </div>
          </div>
        </Card>
      </div>
    </HeaderLayout>
  );
};
export default VerifyEmail;
