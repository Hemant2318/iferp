import Modal from "components/Layout/Modal";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import { Formik } from "formik";
import { isEqual } from "lodash";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addingDepartments, throwError, throwSuccess } from "store/slices";
import { objectToFormData } from "utils/helpers";
import * as Yup from "yup";

const AddDepartmentForm = ({ onHide, editData, handleSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSave = async (values) => {
    setIsLoading(true);
    let payload = values;
    if (editData) {
      payload = { ...values, id: editData?.id };
    }
    const response = await dispatch(
      addingDepartments(objectToFormData(payload))
    );
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      handleSuccess();
    } else {
      dispatch(throwError(response?.message));
    }
    setIsLoading(false);
  };

  const initialValues = {
    department: editData?.department || "",
  };
  const validationSchema = Yup.object().shape({
    department: Yup.string().required("Department Name is required."),
  });
  return (
    <Modal
      onHide={onHide}
      title={editData ? `Edit Department` : `Add Department`}
      size="md"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {(props) => {
          const { values, errors, handleChange, handleSubmit } = props;
          return (
            <form>
              <div className="row cmt-34 cms-20 cme-20 cmb-24">
                <div className="col-md-12 cmb-22">
                  <TextInput
                    label="Department Name*"
                    placeholder="Department Name"
                    id="department"
                    onChange={handleChange}
                    value={values?.department}
                    error={errors?.department}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-center gap-4 cmt-30">
                <Button
                  text="Cancel"
                  isRounded
                  btnStyle="light-outline"
                  className="cps-30 cpe-30"
                  onClick={onHide}
                />
                <Button
                  text="Submit"
                  isRounded
                  btnStyle="primary-dark"
                  className="cps-30 cpe-30"
                  onClick={handleSubmit}
                  btnLoading={isLoading}
                  disabled={isEqual(initialValues, values)}
                />
              </div>
            </form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default AddDepartmentForm;
