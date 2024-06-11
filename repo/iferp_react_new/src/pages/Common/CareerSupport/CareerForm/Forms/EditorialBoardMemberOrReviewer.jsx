import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { Formik } from "formik";
import Label from "components/form/Label";
import Button from "components/form/Button";
import DropDown from "components/form/Dropdown";
import TextArea from "components/form/TextArea";
import TextInput from "components/form/TextInput";
import RadioInput from "components/form/RadioInput";
import { fetchJournals } from "store/slices";
import { titleCaseString } from "utils/helpers";
import InfoField from "./InfoFiled";

const EditorialBoardMemberOrReviewer = ({
  handelSaveCareer,
  btnLoading,
  reset,
  setReset,
}) => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const handelSave = (values) => {
    handelSaveCareer(values);
  };
  const [journalList, setList] = useState([]);
  const getJournals = async () => {
    const response = await dispatch(fetchJournals());
    let resList = [];
    if (response?.data?.users) {
      resList = response?.data?.users;
    }
    setList(resList);
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
    getJournals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const validationSchema = Yup.object().shape({
    journal_id: Yup.string().required("Journal is required."),
    register_as: Yup.string().required("Select Any One."),
    research_area: Yup.string()
      .required("Research area is required.")
      .max(100, "Maximum 100 character allow for this field."),
    no_of_article_published: Yup.string()
      .required("No. of article published is required.")
      .matches(/^[0-9\s]+$/, "Invalid value.")
      .matches(/^\S*$/, "Whitespace is not allowed."),
    peer_review_experience: Yup.string()
      .required("Peer review experience is required.")
      .matches(/^[0-9\s]+$/, "Invalid value.")
      .matches(/^\S*$/, "Whitespace is not allowed.")
      .max(100, "Maximum 100 character allow for this field."),
    editorial_board_experience: Yup.string()
      .required("Editorial board experience is required.")
      .matches(/^[0-9\s]+$/, "Invalid value.")
      .matches(/^\S*$/, "Whitespace is not allowed.")
      .max(100, "Maximum 100 character allow for this field."),
  });
  const initialValues = {
    journal_id: "",
    register_as: "",
    research_area: "",
    no_of_article_published: "",
    peer_review_experience: "",
    editorial_board_experience: "",
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
            <div className="cmb-22">
              <DropDown
                placeholder="Select Journal"
                value={values.journal_id}
                error={errors.journal_id}
                id="journal_id"
                onChange={handleChange}
                options={journalList}
                optionValue="name"
              />
            </div>
            <div className="d-flex align-items-center">
              <div className="me-5">
                <Label
                  label="Register As"
                  className="text-16-600 color-raisin-black"
                  required
                />
              </div>
              <div className="flex-grow-1 d-flex">
                <RadioInput
                  label="Reviewer"
                  className="pe-4"
                  onChange={() => {
                    setFieldValue("register_as", "Reviewer");
                  }}
                  checked={values.register_as === "Reviewer"}
                />
                <RadioInput
                  label="Editorial Board Member"
                  onChange={() => {
                    setFieldValue("register_as", "Editorial Board Member");
                  }}
                  checked={values.register_as === "Editorial Board Member"}
                />
              </div>
            </div>
            <div className="text-13-400 pt-1 cmb-22">
              <span style={{ color: "red" }}>{errors?.register_as}</span>
            </div>

            <div className="cmb-22">
              <TextArea
                placeholder="Enter Research Area"
                id="research_area"
                onChange={(e) => {
                  const id = e.target.id;
                  const value = e.target.value;
                  setFieldValue(id, titleCaseString(value));
                }}
                value={values.research_area}
                error={errors.research_area}
                rows={4}
              />
            </div>
            <div className="cmb-22">
              <TextInput
                placeholder="No. of Articles Published*"
                id="no_of_article_published"
                value={values.no_of_article_published}
                error={errors.no_of_article_published}
                onChange={handleChange}
              />
            </div>
            <div className="cmb-22">
              <TextArea
                placeholder="Peer review Experience* ( Write last 3 review activity)"
                id="peer_review_experience"
                onChange={(e) => {
                  const id = e.target.id;
                  const value = e.target.value;
                  setFieldValue(id, titleCaseString(value));
                }}
                value={values.peer_review_experience}
                error={errors.peer_review_experience}
                rows={4}
              />
              <div className="text-13-400 color-black-olive mt-1">
                * Write Journal Name, Position & years of service
              </div>
            </div>
            <div className="cmb-22">
              <TextArea
                placeholder="Editorial Board Experience* ( Write recent 3 experience)"
                id="editorial_board_experience"
                onChange={(e) => {
                  const id = e.target.id;
                  const value = e.target.value;
                  setFieldValue(id, titleCaseString(value));
                }}
                value={values.editorial_board_experience}
                error={errors.editorial_board_experience}
                rows={4}
              />
              <div className="text-13-400 color-black-olive mt-1">
                * Write Journal Name, Position & years of service
              </div>
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
export default EditorialBoardMemberOrReviewer;
