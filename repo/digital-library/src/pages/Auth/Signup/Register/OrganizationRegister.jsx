import { Formik } from "formik";
import * as Yup from "yup";

import SliderLayout from "pages/Auth/SliderLayout/SliderLayout";
import { icons } from "utils/constants";
import { useNavigate } from "react-router-dom";
import { PasswordInput, InputText, Card, Button } from "components";

const OrganizationRegister = () => {
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    email: "",
    number: "",
    alternateNumber: "",
    password: "",
    confirmPassword: "",
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Organization name is required."),
    email: Yup.string()
      .required("Email is required.")
      .email("Email must be a valid email"),
    number: Yup.string()
      .required("Phone number is required.")
      .min(4, "Phone number must be minimum 4 digit.")
      .max(13, "Phone number must be maximum 13 digit."),
    alternateNumber: Yup.string()
      .min(4, "Phone number must be minimum 4 digit.")
      .max(13, "Phone number must be maximum 13 digit."),
    password: Yup.string()
      .required("Password is required.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/,
        "Password was not strong."
      ),
    confirmPassword: Yup.string()
      .required("Confirm password is required.")
      .oneOf([Yup.ref("password"), null], "Password not matched."),
  });
  return (
    <div id="register-container" className="bg-skyBlue">
      <SliderLayout>
        <Card className="bg-ffff m-auto cp-50">
          <div className="text-26-500 color-2d2d text-center cmb-36">
            Organization Profile
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
          >
            {(props) => {
              const { errors, values, handleChange } = props;
              const {
                name,
                email,
                number,
                alternateNumber,
                password,
                confirmPassword,
              } = values;
              return (
                <form className="row">
                  <div className="col-md-6">
                    <InputText
                      label="Organization Name*"
                      labelClass="text-15-400 color-3d3d"
                      placeholder="Enter organization name"
                      id="name"
                      value={name}
                      error={errors?.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-4">
                    <InputText
                      label="Email iD*"
                      labelClass="text-15-400 color-3d3d"
                      placeholder="Enter email ID"
                      id="email"
                      value={email}
                      error={errors?.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <InputText
                      label="Contact Number*"
                      labelClass="text-15-400 color-3d3d"
                      placeholder="Enter contact number"
                      id="number"
                      value={number}
                      error={errors?.number}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-4">
                    <InputText
                      label="Alternate Contact Number"
                      labelClass="text-15-400 color-3d3d"
                      placeholder="Enter alternate number"
                      id="alternateNumber"
                      value={alternateNumber}
                      error={errors?.alternateNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
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

                  <div className="col-md-6 mb-5">
                    <PasswordInput
                      label="Confirm Password*"
                      labelClass="text-15-400 color-3d3d"
                      placeholder="Enter confirm password"
                      id="confirmPassword"
                      value={confirmPassword}
                      error={errors?.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="d-flex justify-content-center">
                    <Button
                      btnText="Continue"
                      btnStyle="SD"
                      rightIcon={icons.rightArrow}
                      onClick={() => {
                        navigate("/organization/detail/signup");
                      }}
                    />
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

export default OrganizationRegister;
