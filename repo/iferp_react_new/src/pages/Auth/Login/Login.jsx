import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import PasswordInput from "components/form/PasswordInput";
import Card from "components/Layout/Card";
import LineTextLabel from "components/Layout/LineTextLabel";
import { convertString, getUserType, objectToFormData } from "utils/helpers";
import googleLogo from "assets/icons/google-logo.svg";
import { handelLogin, handelMemberLogin } from "store/slices";
import SliderLayout from "../SliderLayout";

const Login = () => {
  const params = useParams();
  const { state } = useLocation();
  const isAdmin = params?.type === "admin";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadButton, setLoadButton] = useState(false);
  const [isGoggleBtnLoad, setIsGoggleBtnLoad] = useState(false);
  const initialValues = {
    email: "",
    password: "",
    type: params?.type,
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required.")
      .email("Email must be a valid email"),
    password: Yup.string().required("Password is required."),
  });
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
  const saveLogin = async (values) => {
    setLoadButton(true);
    // const token = await getToken();
    const token = "";
    if (isAdmin) {
      let forData = objectToFormData({
        user_type: "0",
        email: values.email,
        password: values.password,
        firebase_token: token,
      });
      await dispatch(handelLogin(forData));
    } else {
      let forData = objectToFormData({
        email_or_phone: values.email,
        password: values.password,
        firebase_token: token,
      });
      const response = await dispatch(handelMemberLogin(forData));

      if (
        response?.status === 200 &&
        response?.data?.user_type !== "1" &&
        state?.redirectRoute &&
        state?.redirectRoute !== "/"
      ) {
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

    setLoadButton(false);
  };

  return (
    <div id="Login-container">
      <SliderLayout isAdmin={isAdmin}>
        <Card className="m-auto card-padding">
          <div className="text-center text-28-500 font-poppins">Sign In</div>
          <div className="text-center text-16-400 mt-3 mb-4">
            Stay updated on your professional world
          </div>

          <Formik
            initialValues={initialValues}
            onSubmit={async (values) => {
              saveLogin(values);
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
                      placeholder="Enter Email"
                      value={values.email}
                      error={errors.email}
                      onChange={(e) => {
                        handleChange(convertString(1, e));
                      }}
                    />
                  </div>
                  <div>
                    <PasswordInput
                      id="password"
                      placeholder="Enter Password"
                      value={values.password}
                      onChange={handleChange}
                      error={errors.password}
                    />
                  </div>
                  <div
                    className="mt-3 mb-4 color-new-car text-16-400 pointer"
                    onClick={() => {
                      navigate(`/${params.type}/forgot-password`);
                    }}
                  >
                    Forgot Password?
                  </div>
                  <div className="mb-3">
                    <Button
                      text="Sign In"
                      btnStyle="primary-dark"
                      isRounded
                      onClick={handleSubmit}
                      disabled={loadButton}
                      btnLoading={loadButton}
                    />
                  </div>
                  {!isAdmin && (
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
                              src={googleLogo}
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
        </Card>
      </SliderLayout>
    </div>
  );
};
export default Login;
