import * as Yup from "yup";
import { isEqual } from "lodash";
import { Formik } from "formik";
import { useEffect, useRef } from "react";
import Label from "components/form/Label";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import FileUpload from "components/form/FileUpload";
import RadioInput from "components/form/RadioInput";
import { getFilenameFromUrl, titleCaseString } from "utils/helpers";
import InfoField from "./InfoFiled";

const Internship = ({ handelSaveCareer, btnLoading, reset, setReset }) => {
  const formRef = useRef();
  const handelSave = (values) => {
    handelSaveCareer({
      ...values,
      career_event_id: localStorage.eventId,
    });
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
  useEffect(() => {
    return () => {
      localStorage.removeItem("eventId");
    };
  }, []);

  const validationSchema = Yup.object().shape({
    internship_type: Yup.string().required("Internship type is required."),
    is_prefer_work_hour: Yup.string().required("Select any one."),
    code_skills: Yup.string().required("Code skills is Required."),
    cv_file: Yup.string().required("CV file is Required."),
  });
  const initialValues = {
    internship_type: "",
    is_prefer_work_hour: "",
    code_skills: "",
    cv_file: "",
    cvFileName: "",
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handelSave}
    >
      {(props) => {
        const { values, errors, handleSubmit, setFieldValue, resetForm } =
          props;
        return (
          <form className="row cmt-40">
            <InfoField isInstitution />
            <div className="d-flex">
              <div className="me-5">
                <Label label="Select Internship Type" required />
              </div>
              <div className="d-flex flex-grow-1">
                <RadioInput
                  label="Physical"
                  className="pe-5"
                  value={1}
                  onChange={() => {
                    setFieldValue("internship_type", "physical");
                  }}
                  checked={values.internship_type === "physical"}
                />
                <RadioInput
                  label="Virtual"
                  value={0}
                  onChange={() => {
                    setFieldValue("internship_type", "virtual");
                  }}
                  checked={values.internship_type === "virtual"}
                />
              </div>
            </div>
            <div className="text-13-400 pt-1 cmb-22" style={{ color: "red" }}>
              {errors?.internship_type}
            </div>
            <div className="d-flex">
              <div className="me-5">
                <Label
                  label="Would you prefer to work 30 hours per week?"
                  required
                />
              </div>
              <div className="d-flex flex-grow-1">
                <RadioInput
                  label="Yes"
                  className="pe-5"
                  value={1}
                  onChange={() => {
                    setFieldValue("is_prefer_work_hour", "1");
                  }}
                  checked={values.is_prefer_work_hour === "1"}
                />
                <RadioInput
                  label="No"
                  value={0}
                  onChange={() => {
                    setFieldValue("is_prefer_work_hour", "0");
                  }}
                  checked={values.is_prefer_work_hour === "0"}
                />
              </div>
            </div>
            <div className="text-13-400 pt-1 cmb-22" style={{ color: "red" }}>
              {errors?.is_prefer_work_hour}
            </div>
            <div className="cmb-22">
              <TextInput
                placeholder="Enter the code skills you are hoping to develop*"
                id="code_skills"
                onChange={(e) => {
                  const id = e.target.id;
                  const value = e.target.value;
                  setFieldValue(id, titleCaseString(value));
                }}
                value={values.code_skills}
                error={errors.code_skills}
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
            <div className="d-flex justify-content-center gap-4 mt-3">
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
export default Internship;
