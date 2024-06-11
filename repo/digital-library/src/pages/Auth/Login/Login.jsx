import SliderLayout from "../SliderLayout/SliderLayout";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import {
  Button,
  Checkbox,
  InputText,
  Card,
  LineTextLabel,
  PasswordInput,
} from "components";
import { useNavigate } from "react-router-dom";
import GoogleButton from "./GoogleButton/GoogleButton";
import FacebookButton from "./FacebookButton/FacebookButton";
import TwitterSocialLogin from "./TwitterSocialLogin/TwitterSocialLogin";
import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const [isCheck, setIsCheck] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required.")
      .email("Email must be a valid email"),
    password: Yup.string().required("Password is required."),
  });

  // const APIKey = "YWN7yNS6Mbx140Xi1gW2FDfnB";
  // const APISecret = "atnYZYivIXa6KEntAIxTa4dnTsDNTknP6CZUScTCAUOOOOOenZ";
  // const handleLogin = async () => {
  //   try {
  //     const response = await LoginSocialTwitter.login({
  //       client_id: APIKey,
  //       client_secret: APISecret,
  //     });
  //     console.log("User logged in:", response);
  //   } catch (error) {
  //     console.log("Error during login:", error);
  //   }
  // };

  return (
    <div id="login-container" className="bg-skyBlue">
      <SliderLayout>
        <Card className="m-auto bg-ffff card-padding">
          <div className="text-28-500 color-2d2d text-center mb-4">Sign in</div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
          >
            {(props) => {
              const { values, errors, handleChange } = props;
              const { email, password } = values;
              return (
                <form>
                  <div className="mb-4">
                    <InputText
                      label="Email ID or Contact Number*"
                      labelClass="color-2d2d text-14-400"
                      placeholder="Enter email id or contact number"
                      id="email"
                      value={email}
                      error={errors?.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <PasswordInput
                      label="Password*"
                      labelClass="color-2d2d text-14-400"
                      placeholder="Enter password"
                      id="password"
                      value={password}
                      error={errors?.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <Checkbox
                        label="Remember me"
                        checked={isCheck}
                        onClick={() => {
                          setIsCheck(!isCheck);
                        }}
                      />
                    </div>
                    <div className="color-2d2d text-14-400 pointer">
                      Forgot Password?
                    </div>
                  </div>
                  <div className="mb-4">
                    <Button
                      btnText="Sign In"
                      btnStyle="SD"
                      className="w-100"
                      text
                      disabled={!isCheck}
                    />
                  </div>

                  <div className="mb-4">
                    <LineTextLabel text="Or Sign In with" />
                  </div>
                  <div className="d-flex justify-content-center gap-4 mb-4">
                    <div>
                      <GoogleButton />
                    </div>
                    <div>
                      <TwitterSocialLogin />
                    </div>
                    <div>
                      <FacebookButton />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-14-400">New to Research Pedia?</span>
                    <span
                      className="text-14-500 color-b176 underline ps-2 pointer"
                      onClick={() => {
                        navigate("/signup");
                      }}
                    >
                      <u>Register Now</u>
                    </span>
                  </div>
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
