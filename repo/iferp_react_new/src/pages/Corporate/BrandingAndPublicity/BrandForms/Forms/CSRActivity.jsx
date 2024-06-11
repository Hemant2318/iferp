import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { Formik } from "formik";
import { omit } from "lodash";
import Button from "components/form/Button";
import TextArea from "components/form/TextArea";
import TextInput from "components/form/TextInput";
import InfoField from "./InfoFiled";
import { convertString } from "utils/helpers";

const CSRActivity = ({ handelSaveBrand, btnLoading, reset, setReset }) => {
  const formRef = useRef();
  useEffect(() => {
    if (reset) {
      if (formRef.current) {
        formRef.current.resetForm();
      }
    }
    setReset(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);
  const handelSave = (values) => {
    handelSaveBrand(omit(values, ["recentPresentationFileName"]));
  };
  const validationSchema = Yup.object().shape({
    name_of_contact_person: Yup.string().required("Name is Required."),
    email_id: Yup.string()
      .required("Email is Required.")
      .email("Email must be a valid email"),
    contact_number: Yup.string()
      .required("Number is Required.")
      .matches(/^[0-9\s]+$/, "Valid number only.")
      .matches(/^\S*$/, "Whitespace is not allowed.")
      .min(10, "Number must be 10 digit.")
      .max(10, "Number must be 10 digit."),
    designation: Yup.string().required("Designation is required."),
    title_of_project: Yup.string().required("Title is required."),
    current_socio_economic_status: Yup.string()
      .required("Current socio economic status is required.")
      .max(100, "Maximum 100 character allow for this field."),
    objectives_of_project: Yup.string()
      .required("Objectives of project is required.")
      .max(100, "Maximum 100 character allow for this field."),
    targeted_groups_of_project: Yup.string().max(
      100,
      "Maximum 100 character allow for this field."
    ),
    area_of_execution_of_project: Yup.string().max(
      100,
      "Maximum 100 character allow for this field."
    ),
    outcome_benefits_of_project: Yup.string().max(
      100,
      "Maximum 100 character allow for this field."
    ),
    purpose_of_csr_project: Yup.string().max(
      100,
      "Maximum 100 character allow for this field."
    ),
    comments: Yup.string().max(
      100,
      "Maximum 100 character allow for this field."
    ),
    estimated_cost_of_project: Yup.string().required(
      "Estimated cost of project is required."
    ),
    estimated_period_of_completion_of_project: Yup.string().required(
      "Estimated period of project is required."
    ),
  });
  const initialValues = {
    name_of_contact_person: "",
    email_id: "",
    contact_number: "",
    designation: "",
    title_of_project: "",
    current_socio_economic_status: "",
    objectives_of_project: "",
    targeted_groups_of_project: "",
    area_of_execution_of_project: "",
    outcome_benefits_of_project: "",
    estimated_cost_of_project: "",
    estimated_period_of_completion_of_project: "",
    purpose_of_csr_project: "",
    comments: "",
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handelSave}
    >
      {(props) => {
        const { values, errors, handleSubmit, resetForm, handleChange } = props;
        return (
          <form className="row cmt-40">
            <InfoField />
            <div className="cmb-16 text-16-500">Contact Person Details</div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Name of the Contact Person*"
                id="name_of_contact_person"
                onChange={handleChange}
                value={values.name_of_contact_person}
                error={errors.name_of_contact_person}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Email ID*"
                id="email_id"
                onChange={(e) => {
                  handleChange(convertString(1, e));
                }}
                value={values.email_id}
                error={errors.email_id}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Contact Number*"
                id="contact_number"
                onChange={handleChange}
                value={values.contact_number}
                error={errors.contact_number}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Designation"
                id="designation"
                onChange={handleChange}
                value={values.designation}
                error={errors.designation}
              />
            </div>
            <div className="text-16-500 cmb-22">CSR Activity Requirements</div>

            <div className="cmb-22">
              <TextInput
                isRequired
                label="Title of the project"
                placeholder="Enter your likes about our prodct"
                id="title_of_project"
                onChange={handleChange}
                value={values.title_of_project}
                error={errors.title_of_project}
              />
            </div>
            <div className="cmb-16 text-16-500">
              <b>
                Current Socio-economic status of the Area and Target group *
              </b>
              (It should contain your preliminary assessment of the choice of
              beneficiaries in various trades, their skill level (Skilled, Semi-
              Skilled, and Unskilled), their current income level & Gender
              details etc)
            </div>
            <TextArea
              placeholder="Enter Current Socio-economic status"
              id="current_socio_economic_status"
              onChange={handleChange}
              value={values.current_socio_economic_status}
              error={errors.current_socio_economic_status}
              rows={3}
            />
            <div className="cmb-16 text-16-500 cmt-22">
              Objectives of the Project*
            </div>
            <TextArea
              placeholder="Enter objectives of the project"
              id="objectives_of_project"
              onChange={handleChange}
              value={values.objectives_of_project}
              error={errors.objectives_of_project}
              rows={3}
            />
            <div className="cmb-16 text-16-500 cmt-22">
              Targeted groups of the project proposal
            </div>
            <TextArea
              placeholder="Enter the targeted groups"
              id="targeted_groups_of_project"
              onChange={handleChange}
              value={values.targeted_groups_of_project}
              error={errors.targeted_groups_of_project}
              rows={3}
            />
            <div className="cmb-16 text-16-500 cmt-22">
              Geographical area of execution of project and reason for selecting
              that area :
            </div>
            <TextArea
              placeholder="Enter the targeted groups"
              id="area_of_execution_of_project"
              onChange={handleChange}
              value={values.area_of_execution_of_project}
              error={errors.area_of_execution_of_project}
              rows={3}
            />
            <div className="cmb-16 text-16-500 cmt-22">
              <b>Expected outcome/benefits of the project</b> (It should clearly
              bring out the outcomes expected on completion of the CSR project
              in terms of Skill, income level etc)
            </div>
            <div className="cmb-22">
              <TextArea
                placeholder="Enter the outcome/benefits of the project"
                id="outcome_benefits_of_project"
                onChange={handleChange}
                value={values.outcome_benefits_of_project}
                error={errors.outcome_benefits_of_project}
                rows={3}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Estimated cost of the project*"
                id="estimated_cost_of_project"
                onChange={handleChange}
                value={values.estimated_cost_of_project}
                error={errors.estimated_cost_of_project}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Estimated period of completion*"
                id="estimated_period_of_completion_of_project"
                onChange={handleChange}
                value={values.estimated_period_of_completion_of_project}
                error={errors.estimated_period_of_completion_of_project}
              />
            </div>
            <div className="cmb-16 text-16-500">Purpose of CSR Project</div>
            <div className="cmb-22">
              <TextArea
                placeholder="Enter the outcome/benefits of the project"
                id="purpose_of_csr_project"
                onChange={handleChange}
                value={values.purpose_of_csr_project}
                error={errors.purpose_of_csr_project}
                rows={3}
              />
            </div>

            <TextArea
              placeholder="Comments if any"
              id="comments"
              onChange={handleChange}
              value={values.comments}
              error={errors.comments}
              rows={3}
            />

            <div className="d-flex justify-content-center gap-4 mt-5">
              <Button
                isRounded
                text="Cancel"
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
                disabled={isEqual(values, initialValues)}
              />
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default CSRActivity;
