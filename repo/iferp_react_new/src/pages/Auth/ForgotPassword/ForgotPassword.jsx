import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import Label from "components/form/Label";
import Button from "components/form/Button";
import InputOTP from "components/form/InputOTP";
import TextInput from "components/form/TextInput";
import PasswordInput from "components/form/PasswordInput";
import Card from "components/Layout/Card";
// import Loader from "components/Layout/Loader";
import HeaderLayout from "components/Layout/HeaderLayout";
import LineTextLabel from "components/Layout/LineTextLabel";
import { forgotPassword, handelMemberLogin, setApiError } from "store/slices";
import { convertString, getUserType, objectToFormData } from "utils/helpers";
import { icons } from "utils/constants";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import "./ForgotPassword.scss";

const ForgotPassword = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [counter, setCounter] = useState(30);
  const [otpLoader, setOtpLoader] = useState(false);
  const [loadButton, setLoadButton] = useState(false);
  const [resetOTP, setResetOTP] = useState(true);
  const [formType, setFormType] = useState(0);
  const [emailId, setEmailId] = useState("");
  const [userID, setUserID] = useState("");
  const [otp, setOTP] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isGoggleBtnLoad, setIsGoggleBtnLoad] = useState(false);

  const initialValues = {
    email: "",
    new_password: "",
    confirm_password: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.lazy(() => {
      if (formType === 2) {
        return Yup.string();
      } else {
        return Yup.string()
          .required("Email is required.")
          .email("Email must be a valid email");
      }
    }),
    new_password: Yup.lazy(() => {
      if (formType === 2) {
        return Yup.string()
          .required("New password is required.")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/,
            "Password was not strong."
          );
      } else {
        return Yup.string();
      }
    }),
    confirm_password: Yup.lazy(() => {
      if (formType === 2) {
        return Yup.string()
          .required("Confirm password is required.")
          .oneOf([Yup.ref("new_password"), null], "Password not matched.");
      } else {
        return Yup.string();
      }
    }),
  });
  const handelVerifyOTP = async () => {
    setLoadButton(true);
    const formData = objectToFormData({
      type: 2,
      id: userID,
      otp: otp,
    });
    const response = await dispatch(forgotPassword(formData));
    if (response?.status === 200) {
      dispatch(
        setApiError({
          show: true,
          message: "OTP Verified Successfully.",
          type: "success",
        })
      );
      setFormType(2);
    }
    setLoadButton(false);
  };
  const handelSendOTP = async (values) => {
    setOtpLoader(true);
    const formData = objectToFormData({
      type: 1,
      email_or_phone: values?.email,
    });
    const response = await dispatch(forgotPassword(formData));
    if (response?.status === 200) {
      setEmailId(values?.email);
      setIsOTPSent(true);
      setCounter(30);
      dispatch(
        setApiError({
          show: true,
          message: "OTP Send Successfully.",
          type: "success",
        })
      );
      setResetOTP(true);
      setUserID(response.data.id);
      setFormType(1);
    }
    setOtpLoader(false);
  };
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      setIsGoggleBtnLoad(true);
      const data = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        }
      );
      if (data?.status === 200) {
        // const token = await getToken();
        const token = "";
        let forData = objectToFormData({
          email_or_phone: data?.data?.email,
          google_id: data?.data?.sub,
          profile_photo_path: data?.data?.picture,
          firebase_token: token,
        });
        await dispatch(handelMemberLogin(forData));
        if (state?.redirectRoute && state?.redirectRoute !== "/") {
          let splitedData = state?.redirectRoute?.split("/");
          if (
            splitedData?.[2] === "dashboard" &&
            splitedData?.[3] === undefined
          ) {
            navigate("/", {
              replace: true,
              state: {
                redirectRoute: "",
              },
            });
          } else {
            const findType = getUserType(response?.data?.user_type);
            let redirectURL = state?.redirectRoute;
            if (splitedData[1] !== findType) {
              redirectURL = redirectURL.replace(splitedData[1], findType);
            }
            navigate(redirectURL, {
              state: {
                redirectRoute: "",
              },
            });
            window.location.reload();
          }
        }
      }
      setIsGoggleBtnLoad(false);
    },
  });
  const handleOtp = (newOtp) => {
    if (newOtp) {
      setOTP(newOtp);
    }
  };
  const handelChangePassword = async (values) => {
    setLoadButton(true);
    const formData = objectToFormData({
      type: 3,
      id: userID,
      ...values,
    });
    const response = await dispatch(forgotPassword(formData));
    if (response?.status === 200) {
      dispatch(
        setApiError({
          show: true,
          message: "Password changed Successfully.",
          type: "success",
        })
      );
      setTimeout(() => {
        navigate(`/${params.type}/login`);
      }, 2000);
    }
    setLoadButton(false);
  };
  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    if (counter === 0) {
      setIsOTPSent(false);
    }
  }, [counter]);
  useEffect(() => {
    setResetOTP(true);
    if (formType === 1) {
      setOTP("");
    }
  }, [formType]);

  return (
    <HeaderLayout>
      <div id="forgot-password-container">
        <Card className="card-padding ps-5 pe-5 pt-5 pb-5">
          <div className="d-flex center-flex position-relative mb-5">
            <span
              className="d-flex position-absolute start-0"
              onClick={() => {
                formType === 0
                  ? navigate(-1)
                  : formType === 1
                  ? setFormType(0)
                  : setFormType(1);
              }}
            >
              <img
                src={icons.leftArrow}
                alt="back"
                className="h-21 me-3 pointer"
              />
            </span>
            <div className="text-28-500 color-black-olive">
              {formType === 0
                ? "Forgot Password"
                : formType === 1
                ? "Email Verification"
                : "New Password"}
            </div>
          </div>
          {formType === 0 && (
            <Formik
              enableReinitialize
              initialValues={initialValues}
              onSubmit={async (values) => {
                handelSendOTP(values);
              }}
              validationSchema={validationSchema}
            >
              {(props) => {
                const { values, errors, handleChange, handleSubmit } = props;
                return (
                  <form
                    onSubmit={handleSubmit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                  >
                    <div className="mb-4">
                      <TextInput
                        id="email"
                        label="Email ID"
                        labelClass="mb-2"
                        placeholder="Enter email"
                        value={values.email}
                        error={errors.email}
                        onChange={(e) => {
                          handleChange(convertString(1, e));
                        }}
                      />
                    </div>

                    <div className="mb-5">
                      <Button
                        isRounded
                        text="Send OTP"
                        btnStyle="primary-dark"
                        onClick={handleSubmit}
                        disabled={otpLoader}
                        btnLoading={otpLoader}
                      />
                    </div>
                    {params?.type !== "admin" && (
                      <>
                        <LineTextLabel text="OR" />
                        <div className="mt-4 mb-4">
                          <Button
                            isRounded
                            text="Continue with Google"
                            btnStyle="light-outline"
                            onClick={() => {
                              login();
                            }}
                            btnLoading={isGoggleBtnLoad}
                            icon={
                              <img
                                src={icons.googleLogo}
                                alt="google"
                                className="pe-2"
                              />
                            }
                          />
                        </div>
                        <div className="text-center">
                          <span className="text-14-400">New to IFERP?</span>
                          <span
                            className="text-14-500 color-new-car underline ps-2 pointer"
                            onClick={() => {
                              navigate("/member/register");
                            }}
                          >
                            <u>Register Now</u>
                          </span>
                        </div>
                      </>
                    )}
                  </form>
                );
              }}
            </Formik>
          )}
          {formType === 1 && (
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
                    <div className="text-15-400 color-black-olive mb-5">
                      A One-Time Passcode has been sent your registered email{" "}
                      <span className="text-15-500 color-raisin-black">
                        {emailId}
                      </span>
                    </div>
                    <div className="center-flex flex-column">
                      <Label
                        label="Enter One-time Passcode"
                        className="cmb-24"
                      />
                      <InputOTP
                        blockSize={4}
                        resetOTP={resetOTP}
                        onSubmit={handleOtp}
                        setResetOTP={setResetOTP}
                        isDisableTyping={loadButton || otpLoader}
                      />
                      {/* <div className="text-14-400 color-black-olive mt-3 mb-5 d-flex align-items-center">
                        If you didn’t receive a code!{" "}
                        <span
                          className="text-16-400 color-new-car pointer ms-2"
                          onClick={() => {
                            handelSendOTP({ email: emailId });
                          }}
                        >
                          {otpLoader ? <Loader size="sm" /> : "Resend"}
                        </span>
                      </div> */}
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
                            onClick={() => {
                              handelSendOTP({ email: emailId });
                            }}
                            btnLoading={otpLoader}
                            disabled={otpLoader}
                          />
                        </div>
                      ) : (
                        <div className="text-center text-16-400 mt-2">
                          You can resend the OTP in
                          <span className="color-new-car text-16-500">{` ${counter}`}</span>
                        </div>
                      )}
                    </div>
                    <div className="mb-2 pt-3">
                      <Button
                        isRounded
                        text="Verify Email"
                        btnStyle="primary-dark"
                        onClick={handelVerifyOTP}
                        disabled={
                          loadButton ||
                          otpLoader ||
                          !otp ||
                          (otp && otp.length !== 4)
                        }
                        btnLoading={loadButton}
                      />
                    </div>
                  </form>
                );
              }}
            </Formik>
          )}
          {formType === 2 && (
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                handelChangePassword(values);
              }}
            >
              {(props) => {
                const { values, errors, handleChange, handleSubmit } = props;
                return (
                  <form
                    onSubmit={handleSubmit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                  >
                    <div className="cmb-30 pt-3">
                      <PasswordInput
                        labelClass="mb-2"
                        id="new_password"
                        label="New Password"
                        placeholder="Enter New Password"
                        onChange={handleChange}
                        value={values.new_password}
                        error={errors.new_password}
                        isShowSuggetion
                      />
                    </div>
                    <div>
                      <PasswordInput
                        labelClass="mb-2"
                        id="confirm_password"
                        label="Confirm New Password"
                        placeholder="Confirm New Password"
                        onChange={handleChange}
                        value={values.confirm_password}
                        error={errors.confirm_password}
                      />
                    </div>

                    <div className="mt-5">
                      <Button
                        isRounded
                        text="Submit"
                        btnStyle="primary-dark"
                        onClick={handleSubmit}
                        disabled={loadButton}
                        btnLoading={loadButton}
                      />
                    </div>
                  </form>
                );
              }}
            </Formik>
          )}
        </Card>
      </div>
    </HeaderLayout>
  );
};
export default ForgotPassword;
