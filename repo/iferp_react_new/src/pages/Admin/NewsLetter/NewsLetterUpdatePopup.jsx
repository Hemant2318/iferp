import Modal from "components/Layout/Modal";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import { Formik } from "formik";
import { isEqual } from "lodash";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { throwError, throwSuccess, updateNewsLetter } from "store/slices";
import { objectToFormData } from "utils/helpers";
import * as Yup from "yup";

const NewsLetterUpdatePopup = ({ onHide, editData, handelSuccess }) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required.")
      .email("Email must be a valid email"),
  });
  const initialValues = {
    email: editData?.email || "",
  };

  const handelUpdateData = async (values) => {
    setBtnLoading(true);
    const payload = { ...editData, email: values?.email };
    const response = await dispatch(
      updateNewsLetter(objectToFormData(payload))
    );
    if (response?.status === 200) {
      setBtnLoading(false);
      handelSuccess();
      dispatch(throwSuccess(response?.message));
    } else {
      setBtnLoading(false);
      dispatch(throwError(response?.message));
    }
  };
  return (
    <Modal onHide={onHide} title="Update Newsletter" size="md">
      <div className="cmt-34 cms-20 cme-20 cmb-34">
        <Formik
          initialValues={initialValues}
          onSubmit={handelUpdateData}
          validationSchema={validationSchema}
        >
          {(props) => {
            const { values, errors, handleSubmit, handleChange } = props;
            return (
              <form
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
              >
                <div className="row d-flex justify-conent-between align-items-center cmb-26">
                  <div className="col-md-12 cmb-22">
                    <TextInput
                      label="Email*"
                      placeholder="Enter email"
                      id="email"
                      onChange={handleChange}
                      value={values.email}
                      error={errors.email}
                    />
                  </div>

                  <div className="col-md-12 d-flex justify-content-center gap-4">
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

export default NewsLetterUpdatePopup;
