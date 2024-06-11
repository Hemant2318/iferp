import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { isEqual, omit } from "lodash";
import Label from "components/form/Label";
import Button from "components/form/Button";
import DropDown from "components/form/Dropdown";
import TextArea from "components/form/TextArea";
import TextInput from "components/form/TextInput";
import FileUpload from "components/form/FileUpload";
import UploadButton from "components/Layout/UploadButton";
import { getFilenameFromUrl } from "utils/helpers";
import InfoField from "./InfoFiled";

const topicArray = [
  { id: "Artificial Intelligence in Healthcare Analytics" },
  { id: "Disease Prediction using Machine Learning" },
  { id: "Medical Imaging" },
  { id: "Predictive Analysis for Healthcare" },
  { id: "Clinical Decision Support Systems" },
  { id: "Image Processing in Disease Prognosis" },
  { id: "IoT – based Smart Healthcare Systems" },
  { id: "Smart Wearable’s for Healthcare Applications" },
  { id: "Internet of Medical Things (IoMT)" },
  { id: "Deep Learning Algorithms for Cancer Prediction" },
  { id: "Ambient Assisted Living" },
  { id: "Machine Learning based Speech Processing" },
  { id: "Nature – Inspired Algorithms for Tele healthcare" },
  { id: "M-Health and e-Health" },
  { id: "Covid – 19 and Artificial Intelligence Applications" },
  { id: "Role of Artificial Intelligence in Mental Healthcare" },
  { id: "Robotics in Healthcare" },
  { id: "Rule – Based Expert Systems in Healthcare" },
  { id: "Software as a Medical Device (SaMD)" },
];
const OpportunityForBookWriting = ({
  handelSaveCareer,
  btnLoading,
  reset,
  setReset,
}) => {
  const formRef = useRef();
  const handelSave = (values) => {
    handelSaveCareer(
      values.is_editor
        ? omit(values, [
            "book_chapter_form",
            "bookChapterFileName",
            "cvFileName",
            "note_previous_publication",
          ])
        : omit(values, [
            "bookChapterFileName",
            "cvFileName",
            "cv_file",
            "topics",
          ])
    );
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
    topics: Yup.string().when("is_editor", {
      is: 1,
      then: Yup.string().required("Topics is required."),
    }),
    cv_file: Yup.string().when("is_editor", {
      is: 1,
      then: Yup.string().required("CV is required."),
    }),
    note_previous_publication: Yup.string().when("is_editor", {
      is: 0,
      then: Yup.string()
        .required("Brief note about Editor’s previous publication is required.")
        .max(100, "Maximum 100 character allow for this field."),
    }),
    book_chapter_form: Yup.string().when("is_editor", {
      is: 0,
      then: Yup.string().required("Book chapter form is required."),
    }),
  });
  const initialValues = {
    specialization: "",
    is_editor: 1,
    topics: "",
    cv_file: "",
    cvFileName: "",
    note_previous_publication: "",
    book_chapter_form: "",
    bookChapterFileName: "",
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
          <form className="row">
            <div className="d-flex align-items-center justify-content-between cmb-26 cmt-40">
              <div className="text-24-500 color-black-olive">Registration</div>
              <Button
                text={
                  values.is_editor ? "Become An Editor" : "Become An Writer"
                }
                btnStyle="primary-outline"
                onClick={() => {
                  values.is_editor
                    ? setFieldValue("is_editor", 0)
                    : setFieldValue("is_editor", 1);
                }}
                className="cps-24 cpe-24"
                isSquare
              />
            </div>

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
            {values.is_editor ? (
              <>
                <div className="cmb-22 d-flex align-items-center">
                  <div className="me-3">
                    <Label label="Topics for book chapter" required />
                  </div>
                  <div className="flex-grow-1">
                    <DropDown
                      placeholder="Select topic for book chapter"
                      options={topicArray}
                      optionValue="id"
                      id="topics"
                      value={values.topics}
                      error={errors.topics}
                      onChange={handleChange}
                    />
                  </div>
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
              </>
            ) : (
              <>
                <div className="cmb-22">
                  <TextArea
                    placeholder="Brief note about Editor’s previous publication*"
                    id="note_previous_publication"
                    onChange={handleChange}
                    value={values.note_previous_publication}
                    error={errors.note_previous_publication}
                    rows={4}
                  />
                </div>
                <div className="col-md-5 d-flex align-items-center cmb-22">
                  <Label label="Download Book Chapter Form" />
                </div>
                <div className="col-md-7 cmb-22 d-flex">
                  <Button
                    icon={
                      <i className="bi bi-cloud-arrow-down text-24-500 me-2" />
                    }
                    text="Download"
                    btnStyle="primary-outline"
                    onClick={() => {}}
                    isSquare
                  />
                </div>
                <div className="col-md-5 d-flex align-items-center cmb-22">
                  <Label label="Upload Book Chapter Form" />
                </div>
                <div className="col-md-7 cmb-22 d-flex">
                  <UploadButton
                    id="book_chapter_form"
                    error={errors.book_chapter_form}
                    fileText={values.bookChapterFileName || ""}
                    onChange={(e) => {
                      const fileName = e.target.fileName;
                      setFieldValue("bookChapterFileName", fileName);
                      handleChange(e);
                    }}
                  />
                </div>
              </>
            )}

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
export default OpportunityForBookWriting;
