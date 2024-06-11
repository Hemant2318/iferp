import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { isEqual } from "lodash";
import Label from "components/form/Label";
import Button from "components/form/Button";
import DropDown from "components/form/Dropdown";
import TextInput from "components/form/TextInput";
import InfoField from "./InfoFiled";

const ResearchEnhancement = ({
  handelSaveCareer,
  btnLoading,
  reset,
  setReset,
}) => {
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
    specialization: Yup.string().required("Specialization is required."),
    work_for: Yup.string().required("Select any one."),
    total_experience: Yup.string().required("Total experience is required."),
    teaching_experience: Yup.string().required(
      "Teaching experience is required."
    ),
    industry_experience: Yup.string().required(
      "Industry experience is required."
    ),
  });
  const initialValues = {
    specialization: "",
    work_for: "",
    total_experience: "",
    teaching_experience: "",
    industry_experience: "",
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

            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Specialization*"
                id="specialization"
                onChange={handleChange}
                value={values.specialization}
                error={errors.specialization}
              />
            </div>

            <div className="cmb-22 d-flex align-items-center flex-wrap">
              <div className="me-3">
                <Label
                  label="Can work as a researh consultant for"
                  className="text-nowrap"
                  required
                />
              </div>
              <div className="flex-grow-1">
                <DropDown
                  placeholder="Select can work as a researh consultant for"
                  id="work_for"
                  onChange={handleChange}
                  value={values.work_for}
                  error={errors.work_for}
                  options={[
                    { id: "Research Article Writing" },
                    { id: "Ph.D Thesis Writing" },
                    { id: "Ph.D End to End Assistance" },
                  ]}
                  optionValue="id"
                />
              </div>
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Total experience*"
                id="total_experience"
                onChange={handleChange}
                value={values.total_experience}
                error={errors.total_experience}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Teaching Experience*"
                id="teaching_experience"
                onChange={handleChange}
                value={values.teaching_experience}
                error={errors.teaching_experience}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Industry Experience*"
                id="industry_experience"
                onChange={handleChange}
                value={values.industry_experience}
                error={errors.industry_experience}
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
export default ResearchEnhancement;
