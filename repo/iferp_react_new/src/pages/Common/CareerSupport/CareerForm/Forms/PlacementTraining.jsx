import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { isEqual, omit } from "lodash";
import Label from "components/form/Label";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import FileUpload from "components/form/FileUpload";
import RadioInput from "components/form/RadioInput";
import { getFilenameFromUrl, titleCaseString } from "utils/helpers";
import InfoField from "./InfoFiled";

const PlacementTraining = ({
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
    venue: Yup.string().required("Venue is required."),
    professional_skills: Yup.string().required(
      "Professional skills is required."
    ),
    soft_skills: Yup.string().required("Soft skills is required."),
    area_of_interest: Yup.string().required("Area of interest is required."),
    strength: Yup.string().required("Strength is required."),
    weakness: Yup.string().required("Weakness is required."),
    resume_building_guidance: Yup.string().required("Select Any One."),
    cv_file: Yup.string().required("CV is required."),
  });
  const initialValues = {
    venue: "",
    professional_skills: "",
    soft_skills: "",
    area_of_interest: "",
    strength: "",
    weakness: "",
    resume_building_guidance: "",
    cv_file: "",
    cvFileName: "",
  };
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      innerRef={formRef}
      onSubmit={handelSave}
    >
      {(props) => {
        const { values, errors, handleSubmit, setFieldValue, resetForm } =
          props;
        return (
          <form className="row cmt-40">
            <InfoField isInstitution />
            <div className="col-md-3 cmb-22 d-flex align-items-center">
              <Label label="Venue" required />
            </div>
            <div className="col-md-9 cmb-22">
              <TextInput
                placeholder="Enter venue"
                id="venue"
                onChange={(e) => {
                  const id = e.target.id;
                  const value = e.target.value;
                  setFieldValue(id, titleCaseString(value));
                }}
                value={values.venue}
                error={errors.venue}
              />
            </div>
            <div className="col-md-3 cmb-22 d-flex align-items-center">
              <Label label="Professional Skills" required />
            </div>
            <div className="col-md-9 cmb-22">
              <TextInput
                placeholder="Enter your professional skills"
                id="professional_skills"
                onChange={(e) => {
                  const id = e.target.id;
                  const value = e.target.value;
                  setFieldValue(id, titleCaseString(value));
                }}
                value={values.professional_skills}
                error={errors.professional_skills}
              />
            </div>
            <div className="col-md-3 cmb-22 d-flex align-items-center">
              <Label label="Soft Skills" required />
            </div>
            <div className="col-md-9 cmb-22">
              <TextInput
                placeholder="Enter your soft skills"
                id="soft_skills"
                onChange={(e) => {
                  const id = e.target.id;
                  const value = e.target.value;
                  setFieldValue(id, titleCaseString(value));
                }}
                value={values.soft_skills}
                error={errors.soft_skills}
              />
            </div>
            <div className="col-md-3 cmb-22 d-flex align-items-center">
              <Label label="Area of Interest" required />
            </div>
            <div className="col-md-9 cmb-22">
              <TextInput
                placeholder="Enter your area of interest"
                id="area_of_interest"
                onChange={(e) => {
                  const id = e.target.id;
                  const value = e.target.value;
                  setFieldValue(id, titleCaseString(value));
                }}
                value={values.area_of_interest}
                error={errors.area_of_interest}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Enter your strength*"
                id="strength"
                onChange={(e) => {
                  const id = e.target.id;
                  const value = e.target.value;
                  setFieldValue(id, titleCaseString(value));
                }}
                value={values.strength}
                error={errors.strength}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Enter your weakness*"
                id="weakness"
                onChange={(e) => {
                  const id = e.target.id;
                  const value = e.target.value;
                  setFieldValue(id, titleCaseString(value));
                }}
                value={values.weakness}
                error={errors.weakness}
              />
            </div>
            <div className="d-flex">
              <div className="me-5">
                <Label label="Do you want Resume building Guidance?" />
              </div>
              <div className="d-flex flex-grow-1">
                <RadioInput
                  label="Yes"
                  className="pe-5"
                  value={1}
                  onChange={() => {
                    setFieldValue("resume_building_guidance", "1");
                  }}
                  checked={values.resume_building_guidance === "1"}
                />
                <RadioInput
                  label="No"
                  value={0}
                  onChange={() => {
                    setFieldValue("resume_building_guidance", "0");
                  }}
                  checked={values.resume_building_guidance === "0"}
                />
              </div>
            </div>
            <div className="text-13-400 cmb-22" style={{ color: "red" }}>
              {errors?.resume_building_guidance}
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
export default PlacementTraining;
