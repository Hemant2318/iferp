import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import googleLogo from "assets/icons/google-logo.svg";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import PasswordInput from "components/form/PasswordInput";
import Card from "components/Layout/Card";
// import HeaderLayout from "components/Layout/HeaderLayout";
import LineTextLabel from "components/Layout/LineTextLabel";
import { handelRegister } from "store/slices";
import { membershipType } from "utils/constants";
import SliderLayout from "pages/Auth/SliderLayout";
import {
  convertString,
  numberOnlyFromInput,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
// import "./Register.scss";

const Register = () => {
  const dispatch = useDispatch();
  const nevigate = useNavigate();
  const params = useParams();
  const [loadButton, setLoadButton] = useState(false);
  const { apiError } = useSelector((state) => ({
    apiError: state.global.apiError,
  }));

  const [isGoggleBtnLoad, setIsGoggleBtnLoad] = useState(false);
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
        const { given_name, family_name, email, sub, picture } =
          data?.data || {};
        handelSave({
          profile_photo_path: picture,
          first_name: given_name,
          last_name: family_name,
          email_id: email,
          google_id: sub,
          country_code: "IN",
        });
      }
      setIsGoggleBtnLoad(false);
    },
  });
  const handelSave = async (values) => {
    setLoadButton(true);
    const findType = membershipType.find((o) => o.type === params.type);
    if (findType) {
      let forData = objectToFormData({
        ...values,
        user_type: findType.id,
      });
      const response = await dispatch(handelRegister(forData));
      if (response?.status === 200) {
        // nevigate(commonRoute.verifyEmail, {
        //   replace: true,
        //   state: {
        //     email: values.email,
        //   },
        // });
        nevigate("/professional/dashboard");
        // findType?.id === "3"
        //   ? nevigate(
        //       `/${findType?.type}/register/${params.userId}/institution-details`
        //     )
        //   : nevigate(
        //       `/${findType?.type}/register/${response?.data?.id}/personal-details`
        //     );
      }
    }
    setLoadButton(false);
  };
  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .required("First name is required.")
      .matches(/^\S*$/, "Whitespace is not allowed."),
    last_name: Yup.string()
      .required("Last name is required.")
      .matches(/^\S*$/, "Whitespace is not allowed."),
    email_id: Yup.string()
      .required("Email is required.")
      .matches(/^\S*$/, "Whitespace is not allowed.")
      .email("Email must be a valid email"),
    phone_number: Yup.string()
      .required("Phone number is required.")
      .min(4, "Phone number must be minimum 4 digit.")
      .max(13, "Phone number must be maximum 13 digit."),
    password: Yup.string()
      .required("Password is required.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/,
        "Password was not strong."
      ),
    confirm_password: Yup.string()
      .required("Confirm password is required.")
      .oneOf([Yup.ref("password"), null], "Password not matched."),
  });
  const initialValues = {
    first_name: "",
    last_name: "",
    email_id: "",
    phone_number: "",
    country_code: "IN",
    password: "",
    confirm_password: "",
  };
  return (
    <SliderLayout>
      <Card className="m-auto card-padding h-100 overflow-auto iferp-scroll">
        <div className="m-auto text-center">
          <div className="text-center text-24-500 color-raisin-black cmb-20 font-poppins">
            Welcome!
          </div>
          <div className="text-center text-16-400 color-raisin-black mb-5">
            Stay updated on your professional world
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handelSave}
        >
          {(props) => {
            const {
              values,
              errors,
              handleChange,
              setFieldValue,
              handleSubmit,
            } = props;
            return (
              <form
                onSubmit={handleSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(values);
                  }
                }}
              >
                <div className="mb-4">
                  <TextInput
                    id="first_name"
                    placeholder="First Name*"
                    value={values.first_name}
                    onChange={(e) => {
                      setFieldValue(
                        "first_name",
                        titleCaseString(e.target.value)
                      );
                    }}
                    error={errors.first_name}
                  />
                </div>
                <div className="mb-4">
                  <TextInput
                    id="last_name"
                    placeholder="Last Name*"
                    value={values.last_name}
                    onChange={(e) => {
                      setFieldValue(
                        "last_name",
                        titleCaseString(e.target.value)
                      );
                    }}
                    error={errors.last_name}
                  />
                </div>
                <div className="mb-4">
                  <TextInput
                    id="email_id"
                    placeholder="Email ID*"
                    value={values.email_id}
                    error={
                      apiError?.message?.includes("Email ID") ? (
                        <p className="text-danger">
                          Email Id already exists!{" "}
                          <span
                            className="text-14-500 color-new-car underline ps-1 pointer"
                            onClick={() => {
                              nevigate("/member/login");
                            }}
                          >
                            <u>Login Now</u>
                          </span>
                        </p>
                      ) : (
                        errors.email_id
                      )
                    }
                    // error={errors.email_id}
                    onChange={(e) => {
                      handleChange(convertString(1, e));
                    }}
                  />
                </div>
                <div className="mb-4">
                  <TextInput
                    isPhoneNumber
                    id="phone_number"
                    placeholder="Phone Number*"
                    value={values.phone_number}
                    // error={errors.phone_number}
                    error={
                      apiError?.message?.includes("phone number") ? (
                        <p className="text-danger">
                          Phone number already exists!{" "}
                          <span
                            className="text-14-500 color-new-car underline ps-1 pointer"
                            onClick={() => {
                              nevigate("/member/login");
                            }}
                          >
                            <u>Login Now</u>
                          </span>
                        </p>
                      ) : (
                        errors.phone_number
                      )
                    }
                    phoneNumberData={{
                      id: "country_code",
                      value: values.country_code,
                    }}
                    onChange={(e) => {
                      if (e.target.id === "phone_number") {
                        handleChange(numberOnlyFromInput(e));
                      } else {
                        handleChange(e);
                        handleChange({
                          target: { id: "phone_number", value: "" },
                        });
                      }
                    }}
                  />
                </div>
                <div className="mb-4">
                  <PasswordInput
                    id="password"
                    placeholder="Password*"
                    value={values.password}
                    onChange={handleChange}
                    error={errors.password}
                    isShowSuggetion
                  />
                </div>
                <div className="mb-4">
                  <PasswordInput
                    id="confirm_password"
                    placeholder="Confirm Password*"
                    value={values.confirm_password}
                    onChange={handleChange}
                    error={errors.confirm_password}
                  />
                </div>

                <div className="mb-3 pt-3">
                  <Button
                    text="Register"
                    btnStyle="primary-dark"
                    isRounded
                    onClick={handleSubmit}
                    disabled={loadButton}
                    btnLoading={loadButton}
                  />
                </div>

                <div className="text-center mb-3">
                  <span className="text-14-400">Already on IFERP? </span>
                  <span
                    className="text-14-500 color-new-car underline ps-2 pointer"
                    onClick={() => {
                      nevigate("/member/login");
                    }}
                  >
                    <u>Login</u>
                  </span>
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
                          <img src={googleLogo} alt="google" className="pe-2" />
                        }
                      />
                    </div>
                  </>
                )}
              </form>
            );
          }}
        </Formik>
      </Card>
    </SliderLayout>
  );
};
export default Register;
