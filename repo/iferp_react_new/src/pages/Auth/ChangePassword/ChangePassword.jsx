import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { Formik } from "formik";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import { objectToFormData } from "utils/helpers";
import { changePassword, handelLogout } from "store/slices";
import PasswordInput from "components/form/PasswordInput";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const [btnLoading, setBtnLoading] = useState(false);
  const handelSave = async (values) => {
    setBtnLoading(true);
    const response = await dispatch(changePassword(objectToFormData(values)));
    if (response?.status === 200) {
      dispatch(handelLogout());
    }
    setBtnLoading(false);
  };
  const validationSchema = Yup.object().shape({
    old_password: Yup.string().required("Old password is required."),
    new_password: Yup.string()
      .required("New password is required.")
      .when(["old_password"], (old_password, schema) => {
        return schema.notOneOf([old_password], "You entered old password.");
      })
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/,
        "Password was not strong."
      ),
    confirm_password: Yup.string()
      .required("Confirm password is required.")
      .oneOf([Yup.ref("new_password"), null], "Password not matched."),
  });

  const initialValues = {
    old_password: "",
    new_password: "",
    confirm_password: "",
  };
  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card className="col-md-10 d-flex justify-content-center align-items-center cps-80 cpe-80 cpt-56 cpb-56 cmt-80">
        <div className="w-100">
          <div className="text-24-500 color-black-olive cmb-42 text-center">
            Change Password
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handelSave}
          >
            {(props) => {
              const { values, errors, handleChange, handleSubmit, resetForm } =
                props;
              return (
                <form
                  onSubmit={handleSubmit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                >
                  <div>
                    <div className="cmb-22">
                      <PasswordInput
                        label="Old Password"
                        placeholder="Enter old password"
                        type="password"
                        id="old_password"
                        onChange={handleChange}
                        value={values.old_password}
                        error={errors.old_password}
                      />
                    </div>

                    <div className="cmb-22">
                      <PasswordInput
                        label="New Password"
                        placeholder="Enter new password"
                        type="password"
                        id="new_password"
                        onChange={handleChange}
                        value={values.new_password}
                        error={errors.new_password}
                        isShowSuggetion
                      />
                    </div>

                    <div className="cmb-22">
                      <PasswordInput
                        label="Confirm New Password"
                        placeholder="Re - Enter new password"
                        type="password"
                        id="confirm_password"
                        onChange={handleChange}
                        value={values.confirm_password}
                        error={errors.confirm_password}
                      />
                    </div>

                    <div className="d-flex justify-content-center gap-4 pt-3">
                      <Button
                        text="Cancel"
                        isRounded
                        btnStyle="light-outline"
                        className="cps-40 cpe-40"
                        onClick={resetForm}
                      />
                      <Button
                        text="Submit"
                        isRounded
                        btnStyle="primary-dark"
                        className="cps-40 cpe-40"
                        onClick={handleSubmit}
                        btnLoading={btnLoading}
                        disabled={isEqual(values, initialValues)}
                      />
                    </div>
                  </div>
                </form>
              );
            }}
          </Formik>
        </div>
      </Card>
    </div>
  );
};
export default ChangePassword;
