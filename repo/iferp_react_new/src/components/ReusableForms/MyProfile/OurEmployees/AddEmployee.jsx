import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { Formik } from "formik";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import Modal from "components/Layout/Modal";
import { addCorporateEmployees } from "store/slices";
import {
  convertString,
  numberOnlyFromInput,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";

const AddEmployee = ({ onHide, handelSuccess }) => {
  const dispatch = useDispatch();
  const [btnLoading, setBtnLoading] = useState(false);
  const handelSave = async (values) => {
    setBtnLoading(true);

    let forData = objectToFormData(values);
    const response = await dispatch(addCorporateEmployees(forData));
    if (response?.status === 200) {
      handelSuccess();
    } else {
      setBtnLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required."),
    last_name: Yup.string().required("Last name is required."),
    email_id: Yup.string()
      .email("Email must be a valid email")
      .required("Email is required."),
    phone_number: Yup.string()
      .required("Contact number is required.")
      .min(4, "Contact number must be minimum 4 digit.")
      .max(13, "Contact number must be maximum 13 digit."),
    designation: Yup.string().required("Designation is required."),
    department: Yup.string().required("Department is required."),
  });
  const initialValues = {
    first_name: "",
    last_name: "",
    email_id: "",
    phone_number: "",
    designation: "",
    department: "",
    country_code: "IN",
  };
  return (
    <Modal onHide={onHide} title="Add Employee" size="md">
      <div className="cmt-34 cms-20 cme-20 cmb-34">
        <Formik
          initialValues={initialValues}
          onSubmit={handelSave}
          validationSchema={validationSchema}
        >
          {(props) => {
            const {
              values,
              errors,
              handleChange,
              handleSubmit,
              setFieldValue,
            } = props;
            return (
              <form>
                <div className="row d-flex justify-conent-between align-items-center cmb-26">
                  <div className="col-md-12 col-10 cmb-22">
                    <TextInput
                      placeholder="First Name*"
                      id="first_name"
                      onChange={(e) => {
                        setFieldValue(
                          "first_name",
                          titleCaseString(e.target.value)
                        );
                      }}
                      value={values.first_name}
                      error={errors.first_name}
                    />
                  </div>
                  <div className="col-md-12 col-10 cmb-22">
                    <TextInput
                      placeholder="Last Name*"
                      id="last_name"
                      onChange={(e) => {
                        setFieldValue(
                          "last_name",
                          titleCaseString(e.target.value)
                        );
                      }}
                      value={values.last_name}
                      error={errors.last_name}
                    />
                  </div>
                  <div className="col-md-12 col-10 cmb-22">
                    <TextInput
                      placeholder="Department*"
                      id="department"
                      value={values.department}
                      error={errors.department}
                      onChange={(e) => {
                        handleChange(convertString(3, e));
                      }}
                    />
                  </div>
                  <div className="col-md-12 col-10 cmb-22">
                    <TextInput
                      placeholder="Designation*"
                      id="designation"
                      value={values.designation}
                      error={errors.designation}
                      onChange={(e) => {
                        handleChange(convertString(3, e));
                      }}
                    />
                  </div>
                  <div className="col-md-12 col-10 cmb-22">
                    <TextInput
                      isPhoneNumber
                      id="phone_number"
                      type="number"
                      placeholder="Contact Number*"
                      value={values.phone_number}
                      error={errors.phone_number}
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
                  <div className="col-md-12 col-10 cmb-22">
                    <TextInput
                      placeholder="Email ID*"
                      id="email_id"
                      value={values.email_id}
                      error={errors.email_id}
                      onChange={(e) => {
                        handleChange(convertString(1, e));
                      }}
                    />
                  </div>

                  <div className="col-md-12 col-10 d-flex justify-content-center gap-4">
                    <Button
                      text="Cancel"
                      isRounded
                      btnStyle="light-outline"
                      className="cps-40 cpe-40"
                      onClick={onHide}
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
    </Modal>
  );
};
export default AddEmployee;
