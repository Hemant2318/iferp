import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import Card from "components/Layout/Card";
import LineTextLabel from "components/Layout/LineTextLabel";
import { convertString, objectToFormData } from "utils/helpers";
import logo from "assets/icons/logo.svg";
import googleLogo from "assets/icons/google-logo.svg";
import { handelLogin, handelMemberLogin } from "store/slices";
import { getToken } from "services/firebase.services";
import "./Login.scss";

const Login = () => {
  const params = useParams();
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
    // email: Yup.lazy((value) => {
    //   if (params?.type === "admin") {
    // return Yup.string()
    //   .required("Email is required.")
    //   .email("Email must be a valid email");
    //   } else {
    //     let isnum = /^\d+$/.test(value);
    //     if (value && value.indexOf("@") === -1 && isnum) {
    //       return Yup.string()
    //         .required("Email or phone number is required.")
    //         .min(10, "Phone number must be 10 digit.")
    //         .max(10, "Phone number must be 10 digit.");
    //     } else {
    //       return Yup.string()
    //         .required("Email or phone number is required.")
    //         .email("Email must be a valid email");
    //     }
    //   }
    // }),
    email: Yup.string()
      .required("Email is required.")
      .email("Email must be a valid email"),
    password: Yup.string().required("Password is required."),
  });
  const login = useGoogleLogin({
    onSuccess: async (response) => {
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
      }
      setIsGoggleBtnLoad(false);
    },
  });
  const saveLogin = async (values) => {
    setLoadButton(true);
    // const token = await getToken();
    const token = "";
    if (params?.type === "admin") {
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
      await dispatch(handelMemberLogin(forData));
    }

    setLoadButton(false);
  };
  return (
    <div id="Login-container">
      <img className="img-logo1" src={logo} alt="img" />
      <div className="row mt-4 box-height">
        <Card className="col-md-5 col-md-3 m-auto card-padding">
          <div className="text-center text-28-500">Sign In</div>
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
                    <TextInput
                      id="password"
                      placeholder="Enter Password"
                      value={values.password}
                      onChange={handleChange}
                      error={errors.password}
                      type="password"
                      isPassword
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
                  {params?.type !== "admin" && (
                    <>
                      <LineTextLabel text="OR" />
                      <div className="mt-4 mb-4">
                        <Button
                          isRounded
                          text="Continue with Google"
                          btnStyle="light-outline"
                          onClick={() => {
                            setIsGoggleBtnLoad(true);
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
      </div>
    </div>
  );
};
export default Login;
