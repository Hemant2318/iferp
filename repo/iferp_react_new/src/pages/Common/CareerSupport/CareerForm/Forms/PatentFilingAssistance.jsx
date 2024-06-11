import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { isEqual, omit } from "lodash";
import Label from "components/form/Label";
import Button from "components/form/Button";
import TextArea from "components/form/TextArea";
import MultipleSelect from "components/form/MultipleSelect";
import UploadButton from "components/Layout/UploadButton";
import { titleCaseString } from "utils/helpers";
import InfoField from "./InfoFiled";

const PatentFilingAssistance = ({
  handelSaveCareer,
  btnLoading,
  reset,
  setReset,
}) => {
  const formRef = useRef();
  const handelSave = (values) => {
    handelSaveCareer(omit(values, ["inventionFileName", "attachmentFileName"]));
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
    organization_type: Yup.string().required("Organization type is required."),
    comments: Yup.string()
      .required("Comments is required.")
      .max(100, "Maximum 100 character allow for this field."),
    invention_disclosure_form: Yup.string().required(
      "Invention disclosure form file is required"
    ),
    attachment_file: Yup.string().required("Attachment file is required"),
  });
  const initialValues = {
    organization_type: "",
    comments: "",
    invention_disclosure_form: "",
    inventionFileName: "",
    attachment_file: "",
    attachmentFileName: "",
  };
  return (
    <Formik
      initialValues={initialValues}
      innerRef={formRef}
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
            <InfoField />

            <div className="cmb-22 col-md-6">
              <MultipleSelect
                placeholder="Select patent services"
                id="organization_type"
                onChange={handleChange}
                value={values.organization_type}
                error={errors.organization_type}
                options={[
                  { id: "Patent Searching", label: "Patent Searching" },
                  { id: "Patent Drafting", label: "Patent Drafting" },
                  {
                    id: "Patent Filling & Prosecution",
                    label: "Patent Filling & Prosecution",
                  },
                ]}
              />
            </div>
            <div className="cmb-22">
              <TextArea
                placeholder="Comments"
                id="comments"
                onChange={(e) => {
                  const id = e.target.id;
                  const value = e.target.value;
                  setFieldValue(id, titleCaseString(value));
                }}
                value={values.comments}
                error={errors.comments}
                rows={3}
              />
            </div>

            <div className="col-md-6 d-flex align-items-center cmb-22">
              <Label label="Download Invention Disclosure Form for Patent Filing" />
            </div>
            <div className="col-md-6 cmb-22 d-flex">
              <Button
                icon={<i className="bi bi-cloud-arrow-down text-24-500 me-2" />}
                text="Download"
                btnStyle="primary-outline"
                onClick={() => {}}
                className=""
                isSquare
              />
            </div>
            <div className="col-md-6 d-flex align-items-center cmb-22">
              <Label label="Upload Invention Disclosure Form for Patent Filing" />
            </div>
            <div className="col-md-6 cmb-22 d-flex">
              <UploadButton
                id="invention_disclosure_form"
                error={errors.invention_disclosure_form}
                fileText={values.inventionFileName || ""}
                onChange={(e) => {
                  const fileName = e.target.fileName;
                  setFieldValue("inventionFileName", fileName);
                  handleChange(e);
                }}
              />
            </div>
            <div className="col-md-6 d-flex align-items-center cmb-22">
              <Label label="Attachment" />
            </div>
            <div className="col-md-6 cmb-22 d-flex">
              <UploadButton
                id="attachment_file"
                error={errors.attachment_file}
                fileText={values.attachmentFileName || ""}
                onChange={(e) => {
                  const fileName = e.target.fileName;
                  setFieldValue("attachmentFileName", fileName);
                  handleChange(e);
                }}
              />
            </div>

            <div className="d-flex justify-content-center gap-4 mt-3">
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
export default PatentFilingAssistance;
