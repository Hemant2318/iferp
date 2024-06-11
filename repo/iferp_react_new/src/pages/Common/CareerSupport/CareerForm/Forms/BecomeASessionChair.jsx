import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { isEqual, omit } from "lodash";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import FileUpload from "components/form/FileUpload";
import { getFilenameFromUrl } from "utils/helpers";
import InfoField from "./InfoFiled";

const BecomeASessionChair = ({
  handelSaveCareer,
  btnLoading,
  reset,
  setReset,
}) => {
  const formRef = useRef();
  const handelSave = (values) => {
    handelSaveCareer(omit(values, ["cvFileName"]));
  };

  useEffect(() => {
    if (reset) {
      if (formRef.current) {
        formRef.current.resetForm();
      }
    }
    setReset(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  const validationSchema = Yup.object().shape({
    specialization: Yup.string().required("Specialization is required."),
    experience_session_chair: Yup.string()
      .required("Experience session chair is required.")
      .matches(/^[0-9\s]+$/, "Invalid value.")
      .matches(/^\S*$/, "Whitespace is not allowed."),
    cv_file: Yup.string().required("CV file is required."),
  });
  const initialValues = {
    specialization: "",
    experience_session_chair: "",
    cv_file: "",
    cvFileName: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      innerRef={formRef}
      onSubmit={handelSave}
    >
      {(props) => {
        const {
          values,
          errors,
          handleSubmit,
          setFieldValue,
          resetForm,
          handleChange,
        } = props;
        return (
          <form className="row cmt-40">
            <InfoField />
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Specialization*"
                id="specialization"
                onChange={handleChange}
                value={values.specialization}
                error={errors.specialization}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Experience as a session chair*"
                id="experience_session_chair"
                onChange={handleChange}
                value={values.experience_session_chair}
                error={errors.experience_session_chair}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <FileUpload
                id="cv_file"
                onChange={(e) => {
                  const id = e.target.id;
                  const value = e.target.value;
                  const fileName = e.target.fileName;
                  setFieldValue("cvFileName", fileName);
                  setFieldValue(id, value);
                }}
                fileText={getFilenameFromUrl(
                  values?.cvFileName || values.cv_file || "CV*"
                )}
                error={errors?.cv_file}
              />
            </div>
            <div className="d-flex justify-content-center gap-4">
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
          </form>
        );
      }}
    </Formik>
  );
};
export default BecomeASessionChair;
