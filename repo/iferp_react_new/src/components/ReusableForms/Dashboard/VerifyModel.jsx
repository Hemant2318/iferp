import Button from "components/form/Button";
import InputOTP from "components/form/InputOTP";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { icons } from "utils/constants";
import { getDataFromLocalStorage } from "utils/helpers";

export default function VerifyModel(props) {
  const { showEmailModel } = props;
  const [counter, setCounter] = useState(30);
  const [isOTPSent, setIsOTPSent] = useState(true);
  // const [loadButton, setLoadButton] = useState(false);
  const [resetOTP, setResetOTP] = useState(true);
  const [otp, setOTP] = useState("");
  // const handleResendOTP = async () => {
  //   setResendLoader(true);
  //   const response = await dispatch(
  //     handelSendOTP(objectToFormData({ email: email }))
  //   );
  //   if (response?.status === 200) {
  //     setIsOTPSent(true);
  //     setCounter(30);
  //   }
  //   setResendLoader(false);
  // };
  const handleOtp = (newOtp) => {
    if (newOtp) {
      setOTP(newOtp);
    }
  };
  const handelVerifyOTP = async () => {
    // setLoadButton(true);
    // const formData = objectToFormData({
    //   user_id: getDataFromLocalStorage("id"),
    //   otp: otp,
    // });
    // const response = await dispatch(verifyOTP(formData));
    // if (response?.status === 200) {
    //   await dispatch(fetchProfile());
    //   dispatch(
    //     setApiError({
    //       show: true,
    //       message: "Email Verified Successfully.",
    //       type: "success",
    //     })
    //   );
    //   window.location.reload();
    // }
    // setLoadButton(false);
  };
  const getUserData = getDataFromLocalStorage();
  const { modalShow, setModalShow } = props;
  const { phone_number, email_id } = getUserData;
  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    if (counter === 0) {
      setIsOTPSent(false);
    }
    setResetOTP(true);
  }, [counter]);
  return (
    <>
      {showEmailModel ? (
        <Modal
          // {...props}
          //   size="lg"
          onHide={() => setModalShow(false)}
          show={modalShow}
          // dialogClassName="w-584"
          // aria-labelledby="example-custom-modal-styling-title"
          centered
          backdrop="static"
          keyboard={false}
        >
          <div id="forgot-password-container color-title-navy">
            <Modal.Header className="border-0" closeButton></Modal.Header>
            <Card className="card-padding align-items-center ps-5 pe-5 pb-5 text-center border-top-0">
              <img
                src={icons?.verifyEmailLogo}
                alt="verifyEmailLogo"
                width={200}
                className="fill"
              />
              <div className="position-relative my-3">
                <div className="text-20-500 color-black-olive color-title-navy">
                  Verify your Email Address
                </div>
              </div>
              <div className="text-15-400 color-black-olive mb-5 color-title-navy">
                You ve entered
                <span className="text-15-500 color-raisin-black color-title-navy">
                  {" "}
                  {email_id}{" "}
                </span>
                as your email address during sign up Please check your inbox and
                verify your Email Id
              </div>
              <div className="ps-5 pe-5">
                <Button
                  text="Done"
                  btnStyle="primary-dark rounded-pill mw-135"
                  // onClick={props.onHide}
                  onClick={props?.VerifyEmail}
                />
              </div>
            </Card>
          </div>
        </Modal>
      ) : (
        <Modal
          {...props}
          //   size="md"
          dialogClassName="w-584"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <div id="forgot-password-container ">
            <Modal.Header className="border-0" closeButton></Modal.Header>
            <Card className="card-padding ps-5 pe-5 pb-5 text-center border-top-0">
              <div className="position-relative mb-3">
                <div className="text-20-500 color-title-navy">
                  Verify Phone Number
                </div>
              </div>
              <div className="text-15-400 color-title-navy mb-5 ">
                Enter Verification Code sent to your registered mobile number{" "}
                <span className="text-15-500 color-title-navy">
                  {phone_number}
                </span>
              </div>
              <Formik
                initialValues={{}}
                // onSubmit={() => {
                //   handelVerifyOTP();
                // }}
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
                          // isDisableTyping={loadButton}
                        />
                      </div>
                      <div className="mt-5 mb-4">
                        {isOTPSent && (
                          <div className="text-center text-14-400">
                            OTP sent!
                          </div>
                        )}
                        {counter === 0 ? (
                          <div className="d-flex justify-content-center">
                            If you didn't receive a code!
                            <span
                              className="text-decoration-underline ps-1"
                              role="button"
                              style={{ color: "#264cbf" }}
                              //   onClick={() => {
                              //     setShowEmailModel(false);
                              //     setModalShow(true);
                              //   }}
                            >
                              Resend
                            </span>
                            {/* <Button
                              className="ps-3 pe-3 h-35 text-14-400"
                              text="Resend OTP"
                              btnStyle="primary-outline"
                              onClick={handleResendOTP}
                              btnLoading={resendLoader}
                              disabled={resendLoader}
                            /> */}
                          </div>
                        ) : (
                          <div className="text-center text-16-400 mt-2">
                            You can resend the OTP in
                            <span className="color-new-car text-16-500">{` ${counter}`}</span>
                          </div>
                        )}
                      </div>

                      <div className="ps-5 pe-5">
                        <Button
                          text="Verify"
                          btnStyle="primary-dark rounded-pill mw-135"
                          onClick={handelVerifyOTP}
                          disabled={!otp || (otp && otp.length !== 4)}
                          // btnLoading={loadButton}
                        />
                      </div>
                    </form>
                  );
                }}
              </Formik>

              {/* <div className="mt-4">
                <LineTextLabel text="OR" />
                <div className="text-center mt-3">
                  <span
                    className="text-14-500 color-new-car underline ps-2 pointer"
                    // onClick={() => {
                    //   dispatch(handelLogout());
                    // }}
                  >
                    <u>Move back</u> ?
                  </span>
                </div>
              </div> */}
            </Card>
          </div>
        </Modal>
      )}
    </>
  );
}
