import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { isEqual, omit } from "lodash";
import { Formik } from "formik";
import Label from "components/form/Label";
import Button from "components/form/Button";
import TextArea from "components/form/TextArea";
import TextInput from "components/form/TextInput";
import FileUpload from "components/form/FileUpload";
import { getFilenameFromUrl } from "utils/helpers";
import InfoField from "./InfoFiled";

const FundsAndGrants = ({ handelSaveCareer, btnLoading, reset, setReset }) => {
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
    personal_linkedin_url: Yup.string().required(
      "Personal linkedin url is required."
    ),
    expected_result_of_project: Yup.string()
      .required("Expected result of project is required.")
      .max(100, "Maximum 100 character allow for this field."),
    project_methodologies: Yup.string()
      .required("Project methodologies is required.")
      .max(100, "Maximum 100 character allow for this field."),
    project_proposal: Yup.string().required("Project proposal is required."),
    cv_file: Yup.string().required("CV file is required."),
  });
  const initialValues = {
    specialization: "",
    personal_linkedin_url: "",
    expected_result_of_project: "",
    project_methodologies: "",
    project_proposal: "",
    projectProposalFileName: "",
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
            <InfoField isInstitution />

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
                placeholder="Personal LinkedIn URL"
                id="personal_linkedin_url"
                onChange={handleChange}
                value={values.personal_linkedin_url}
                error={errors.personal_linkedin_url}
              />
            </div>

            <div className="cmb-22">
              <TextArea
                placeholder="Expected Results of the Project*"
                id="expected_result_of_project"
                onChange={handleChange}
                value={values.expected_result_of_project}
                error={errors.expected_result_of_project}
                rows={3}
              />
            </div>
            <div className="cmb-22">
              <TextArea
                placeholder="Project Implementation and management methodologies*"
                id="project_methodologies"
                onChange={handleChange}
                value={values.project_methodologies}
                error={errors.project_methodologies}
                rows={3}
              />
            </div>

            <div className="d-flex align-items-center cmb-22">
              <div className="me-3">
                <Label label="Upload project proposal" required />
              </div>
              <div className="flex-grow-1">
                <FileUpload
                  id="project_proposal"
                  onChange={(e) => {
                    const id = e.target.id;
                    const value = e.target.value;
                    const fileName = e.target.fileName;
                    setFieldValue("projectProposalFileName", fileName);
                    setFieldValue(id, value);
                  }}
                  fileText={getFilenameFromUrl(
                    values?.projectProposalFileName ||
                      values.project_proposal ||
                      ""
                  )}
                  error={errors?.project_proposal}
                />
              </div>
            </div>
            <div className="d-flex align-items-center cmb-22">
              <div className="me-5 pe-2">
                <Label label="Upload CV/Biodata" required />
              </div>
              <div className="flex-grow-1">
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
                    values?.cvFileName || values.cv_file || ""
                  )}
                  error={errors?.cv_file}
                />
              </div>
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
export default FundsAndGrants;
