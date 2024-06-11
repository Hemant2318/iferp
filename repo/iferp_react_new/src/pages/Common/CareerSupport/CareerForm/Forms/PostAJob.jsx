import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { isEqual } from "lodash";
import Button from "components/form/Button";
import TextArea from "components/form/TextArea";
import TextInput from "components/form/TextInput";
import InfoField from "./InfoFiled";

const PostAJob = ({ handelSaveCareer, btnLoading, reset, setReset }) => {
  const formRef = useRef();

  const handelSave = (values) => {
    handelSaveCareer(values);
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
    designation: Yup.string().required("Designation is Required."),
    employment_type: Yup.string().required("Employment type is Required."),
    job_description: Yup.string()
      .required("Description is Required.")
      .max(100, "Maximum 100 character allow for this field."),
    roles_responsibilities: Yup.string()
      .required("Roles responsibilities is Required.")
      .max(100, "Maximum 100 character allow for this field."),
    requirements: Yup.string()
      .required("Requirements is Required.")
      .max(100, "Maximum 100 character allow for this field."),
    perks_and_benefits: Yup.string().max(
      100,
      "Maximum 100 character allow for this field."
    ),
    key_skills: Yup.string()
      .required("Key skills is Required.")
      .max(100, "Maximum 100 character allow for this field."),
    industry: Yup.string().required("Industry is Required."),
    number_of_vacancies: Yup.string()
      .required("Number of vacancies is Required.")
      .matches(/^[0-9\s]+$/, "Valid number only.")
      .matches(/^\S*$/, "Whitespace is not allowed."),
    educational_qualification: Yup.string().required(
      "Educational qualification is Required."
    ),
    work_location: Yup.string().required("Work location is Required."),
  });
  const initialValues = {
    designation: "",
    employment_type: "",
    job_description: "",
    roles_responsibilities: "",
    requirements: "",
    perks_and_benefits: "",
    key_skills: "",
    work_experience_min_years: "",
    work_experience_max_years: "",
    annual_min_salary: "",
    annual_max_salary: "",
    industry: "",
    functional_area: "",
    reference_code: "",
    number_of_vacancies: "",
    educational_qualification: "",
    work_location: "",
  };

  return (
    <>
      <div className="text-center text-15-400 color-black-olive cps-20 cpe-20 cmt-26">
        Reach professionals with just the right skills and experience. Get great
        applicants fast. <br />
        Post your and make a great hire fast!
      </div>

      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handelSave}
      >
        {(props) => {
          const { values, errors, handleSubmit, resetForm, handleChange } =
            props;
          return (
            <form className="row cmt-40">
              <InfoField isInstitution />

              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Job Title/Designation*"
                  id="designation"
                  onChange={handleChange}
                  value={values.designation}
                  error={errors.designation}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Select Employment Type*"
                  id="employment_type"
                  onChange={handleChange}
                  value={values.employment_type}
                  error={errors.employment_type}
                />
              </div>
              <div className="cmb-22">
                <TextArea
                  placeholder="Job Description*"
                  id="job_description"
                  onChange={handleChange}
                  value={values.job_description}
                  error={errors.job_description}
                  rows={3}
                />
              </div>
              <div className="mb-2">
                <b>Specify the Roles & Responsibilities*</b> (Outline the
                activities a person in this role will perform on regular basis)
              </div>
              <div className="cmb-22">
                <TextArea
                  placeholder="Roles & Responsibilities"
                  id="roles_responsibilities"
                  onChange={handleChange}
                  value={values.roles_responsibilities}
                  error={errors.roles_responsibilities}
                  rows={3}
                />
              </div>
              <div className="mb-2">
                <b>Requirements*</b>(Specify required technical expertise,
                previous job experience or certification)
              </div>
              <div className="cmb-22">
                <TextArea
                  placeholder="Requirements"
                  id="requirements"
                  onChange={handleChange}
                  value={values.requirements}
                  error={errors.requirements}
                  rows={3}
                />
              </div>
              <div className="mb-2">
                <b>Specify the Perks and Benefits</b>
              </div>
              <div className="cmb-22">
                <TextArea
                  placeholder="Perks and benefits"
                  id="perks_and_benefits"
                  onChange={handleChange}
                  value={values.perks_and_benefits}
                  error={errors.perks_and_benefits}
                  rows={3}
                />
              </div>
              <div className="mb-2">
                <b>Specify the key skills required for this Job*</b>
              </div>
              <div className="cmb-22">
                <TextArea
                  placeholder="Key Skills"
                  id="key_skills"
                  onChange={handleChange}
                  value={values.key_skills}
                  error={errors.key_skills}
                  rows={3}
                />
              </div>
              <div className="mb-2">
                <b>Work Experience</b>
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Minimum years"
                  id="work_experience_min_years"
                  onChange={handleChange}
                  value={values.work_experience_min_years}
                  error={errors.work_experience_min_years}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Maximum years"
                  id="work_experience_max_years"
                  onChange={handleChange}
                  value={values.work_experience_max_years}
                  error={errors.work_experience_max_years}
                />
              </div>
              <div className="mb-2">
                <b>Annual Salary Range</b>
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Minimum salary"
                  id="annual_min_salary"
                  onChange={handleChange}
                  value={values.annual_min_salary}
                  error={errors.annual_min_salary}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Maximum salary"
                  id="annual_max_salary"
                  onChange={handleChange}
                  value={values.annual_max_salary}
                  error={errors.annual_max_salary}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <div className="mb-2">
                  <b>Industry*</b>
                </div>
                <TextInput
                  placeholder="Maximum salary"
                  id="industry"
                  onChange={handleChange}
                  value={values.industry}
                  error={errors.industry}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <div className="mb-2">
                  <b>Functional Area</b>
                </div>
                <TextInput
                  placeholder="Functional Area"
                  id="functional_area"
                  onChange={handleChange}
                  value={values.functional_area}
                  error={errors.functional_area}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <div className="mb-2">
                  <b>Reference Code</b>
                </div>
                <TextInput
                  placeholder="Reference Code"
                  id="reference_code"
                  onChange={handleChange}
                  value={values.reference_code}
                  error={errors.reference_code}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <div className="mb-2">
                  <b>Number of Vacancies*</b>
                </div>
                <TextInput
                  placeholder="Number of Vacancies"
                  id="number_of_vacancies"
                  onChange={handleChange}
                  value={values.number_of_vacancies}
                  error={errors.number_of_vacancies}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <div className="mb-2">
                  <b>Educational Qualification*</b>
                </div>
                <TextInput
                  placeholder="Educational Qualification"
                  id="educational_qualification"
                  onChange={handleChange}
                  value={values.educational_qualification}
                  error={errors.educational_qualification}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <div className="mb-2">
                  <b>Work Location*</b>
                </div>
                <TextInput
                  placeholder="Work Location*"
                  id="work_location"
                  onChange={handleChange}
                  value={values.work_location}
                  error={errors.work_location}
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
    </>
  );
};
export default PostAJob;
