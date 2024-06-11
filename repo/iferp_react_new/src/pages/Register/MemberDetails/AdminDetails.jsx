import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { isEqual } from "lodash";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import { handelUserRegisterDetails } from "store/slices";
import {
  convertString,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";

const AdminDetails = ({
  userDetails,
  fetchUserData,
  handelSuccess,
  isEdit,
  isDirectRegister,
  handleDirectRegister,
}) => {
  const memberTypeId = userDetails.user_type;
  const memberType = memberTypeId === "4" ? "corporate" : "institutional";
  const nevigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const {
    id,
    first_name,
    last_name,
    email_id,
    phone_number,
    admin_details = {},
  } = userDetails;

  const {
    // first_name,
    // last_name,
    // email_id,
    // contact_number,
    alternate_contact_number,
    alternate_email_id,
  } = admin_details;
  const [btnLoading, setBtnLoading] = useState(false);
  const handelSave = async (values) => {
    setBtnLoading(true);
    let forData = objectToFormData({
      ...values,
      type: "2",
      id: id,
    });
    const response = await dispatch(handelUserRegisterDetails(forData));
    if (response?.status === 200) {
      const fetchData = await fetchUserData();
      if (fetchData?.status === 200) {
        if (isDirectRegister) {
          handleDirectRegister();
        } else {
          handelSuccess();
        }
      }
    }
    setBtnLoading(false);
  };
  const initialValues = {
    first_name: first_name || "",
    last_name: last_name || "",
    email_id: email_id || "",
    contact_number: phone_number || "",
    alternate_contact_number: alternate_contact_number || "",
    alternate_email_id: alternate_email_id || "",
  };
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required."),
    last_name: Yup.string().required("Last name is required."),
    email_id: Yup.string()
      .required("Email is required.")
      .email("Email must be a valid email"),
    contact_number: Yup.string()
      .required("Contact number is required.")
      .min(10, "Contact number must be 10 digit.")
      .max(10, "Contact number must be 10 digit."),
    alternate_email_id: Yup.string()
      .required("Alternate email is required.")
      .email("Email must be a valid email")
      .when(["email_id"], (email_id, schema) => {
        return schema.notOneOf([email_id], "You entered same email.");
      }),
    alternate_contact_number: Yup.string()
      .required("Alternate contact number is required.")
      .min(10, "Alternate contact number must be 10 digit.")
      .max(10, "Alternate contact number must be 10 digit.")
      .when(["contact_number"], (contact_number, schema) => {
        return schema.notOneOf([contact_number], "You entered same number.");
      }),
  });
  return (
    <>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          if (isEqual(values, initialValues)) {
            handelSuccess();
          } else {
            handelSave(values);
          }
        }}
      >
        {(props) => {
          const {
            values,
            errors,
            handleChange,
            setFieldValue,
            handleSubmit,
            resetForm,
          } = props;
          return (
            <form>
              <div className="row">
                <div className="col-md-6 cmb-22">
                  <TextInput
                    placeholder="First Name*"
                    id="first_name"
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
                <div className="col-md-6 cmb-22">
                  <TextInput
                    placeholder="Last Name"
                    id="last_name"
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

                <div className="col-md-6 cmb-22">
                  <TextInput
                    placeholder="Email ID*"
                    id="email_id"
                    value={values.email_id}
                    onChange={(e) => {
                      handleChange(convertString(1, e));
                    }}
                    error={errors.email_id}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    placeholder="Alternate Email ID*"
                    id="alternate_email_id"
                    value={values.alternate_email_id}
                    error={errors.alternate_email_id}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    placeholder="Contact Number*"
                    id="contact_number"
                    value={values.contact_number}
                    error={errors.contact_number}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    placeholder="Alternate Contact Number*"
                    id="alternate_contact_number"
                    value={values.alternate_contact_number}
                    onChange={handleChange}
                    error={errors.alternate_contact_number}
                  />
                </div>

                {isEdit ? (
                  <div className="d-flex justify-content-center gap-4 mt-3">
                    <Button
                      isRounded
                      text="Reset"
                      btnStyle="light-outline"
                      className="cps-40 cpe-40"
                      onClick={resetForm}
                    />
                    <Button
                      isRounded
                      text="Submit"
                      btnStyle="primary-dark"
                      className="cps-40 cpe-40"
                      onClick={handleSubmit}
                      btnLoading={btnLoading}
                    />
                  </div>
                ) : (
                  <div className="d-flex justify-content-center gap-4 mt-3">
                    <Button
                      isRounded
                      text="Previous"
                      btnStyle="light-outline"
                      className="cps-30 cpe-34"
                      icon={<i className="bi bi-chevron-left me-3" />}
                      onClick={() => {
                        memberTypeId === "4"
                          ? nevigate(
                              `/${memberType}/register/${params.userId}/company-details`
                            )
                          : nevigate(
                              `/${memberType}/register/${params.userId}/institution-details`
                            );
                      }}
                    />
                    <Button
                      isRounded
                      text="Continue"
                      btnStyle="primary-dark"
                      className="cps-40 cpe-40"
                      onClick={handleSubmit}
                      btnLoading={btnLoading}
                    />
                  </div>
                )}
              </div>
            </form>
          );
        }}
      </Formik>
    </>
  );
};
export default AdminDetails;
