import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { isEqual, omit } from "lodash";
import Label from "components/form/Label";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import UploadButton from "components/Layout/UploadButton";
import InfoField from "./InfoFiled";

const ProposalWritingAssistanceForDSTOrSERBOrAICTE = ({
  handelSaveCareer,
  btnLoading,
  reset,
  setReset,
}) => {
  const formRef = useRef();

  const handelSave = (values) => {
    handelSaveCareer(omit(values, ["proposalAssistanceFileName"]));
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
    proposal_assistance_form: Yup.string().required(
      "Proposal assistance form is required."
    ),
  });
  const initialValues = {
    specialization: "",
    proposal_assistance_form: "",
    proposalAssistanceFileName: "",
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
          resetForm,
          handleChange,
          setFieldValue,
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

            <div className="col-md-5 d-flex align-items-center cmb-22">
              <Label label="Download Proposal Writing Assistance Form" />
            </div>
            <div className="col-md-7 cmb-22 d-flex">
              <Button
                icon={<i className="bi bi-cloud-arrow-down text-24-500 me-2" />}
                text="Download"
                btnStyle="primary-outline"
                onClick={() => {}}
                className=""
                isSquare
              />
            </div>
            <div className="col-md-5 d-flex align-items-center cmb-22">
              <Label label="Upload Proposal Writing Assistance Form" />
            </div>
            <div className="col-md-7 cmb-22 d-flex">
              <UploadButton
                id="proposal_assistance_form"
                error={errors.proposal_assistance_form}
                fileText={values.proposalAssistanceFileName || ""}
                onChange={(e) => {
                  const fileName = e.target.fileName;
                  setFieldValue("proposalAssistanceFileName", fileName);
                  handleChange(e);
                }}
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
export default ProposalWritingAssistanceForDSTOrSERBOrAICTE;
