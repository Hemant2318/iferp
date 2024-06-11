import Modal from "components/Layout/Modal";
import Button from "components/form/Button";
import FileUpload from "components/form/FileUpload";
import { Formik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { bulkAddTopics, throwError, throwSuccess } from "store/slices";
import { objectToFormData } from "utils/helpers";
import * as Yup from "yup";

const BulkUpload = ({ onHide, handleSuccess }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleUploading = async (values) => {
    setIsLoading(true);
    console.log("values", values);

    const response = await dispatch(bulkAddTopics(objectToFormData(values)));
    console.log("response", response);
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      handleSuccess();
    } else {
      dispatch(throwError(response?.message));
    }
    setIsLoading(false);
  };

  const initialValues = {
    department_excel: "",
  };
  const validationSchema = Yup.object().shape({
    department_excel: Yup.mixed().required("File is required."),
  });
  return (
    <Modal onHide={onHide} title={`Topics Bulk Upload`} size="md">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleUploading}
      >
        {(props) => {
          const { values, errors, handleChange, setFieldValue, handleSubmit } =
            props;
          return (
            <form>
              <div className="row cmt-34 cms-10 cme-10 cmb-24">
                <div className="col-md-12 cmb-22">
                  <FileUpload
                    acceptType={[
                      "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    ]}
                    label="Upload File*"
                    id="department_excel"
                    onChange={(e) => {
                      console.log("e?.target?.file", e?.target?.file);
                      handleChange(e);
                      setFieldValue("department_excel", e?.target?.file);
                    }}
                    value={values?.department_excel}
                    error={errors?.department_excel}
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
                  btnLoading={isLoading}
                  onClick={handleSubmit}
                />
              </div>
            </form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default BulkUpload;
