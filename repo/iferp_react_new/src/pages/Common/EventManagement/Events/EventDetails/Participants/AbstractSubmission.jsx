import * as Yup from "yup";
import { Formik } from "formik";
import Modal from "components/Layout/Modal";
import TextInput from "components/form/TextInput/TextInput";
import CheckBox from "components/form/CheckBox/CheckBox";
import Label from "components/form/Label";
import Dropdown from "components/form/Dropdown/Dropdown";
import { eventMode } from "utils/constants";
import TextArea from "components/form/TextArea/TextArea";
import FileUpload from "components/form/FileUpload/FileUpload";
import {
  getFilenameFromUrl,
  objectToFormData,
  trimAllSpace,
} from "utils/helpers";
import Button from "components/form/Button/Button";
import { cloneDeep, isEqual } from "lodash";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addEventSubmitAbstract, showSuccess, throwError } from "store/slices";
import UserCreatable from "components/form/UserCreatable";

const AbstractSubmission = ({ eventId, onHide, data = {} }) => {
  const { user_id, name, email_id, phone_number } = data;
  const dispatch = useDispatch();
  const handelSave = async (values) => {
    setBtnLoading(true);
    let forData = objectToFormData({
      ...values,
      event_id: eventId,
      user_id: user_id,
      co_authors: JSON.stringify(values.co_authors),
    });
    const response = await dispatch(addEventSubmitAbstract(forData));
    if (response?.status === 200) {
      dispatch(showSuccess("Abstract submited successfully!"));
      onHide();
    }
    setBtnLoading(false);
  };
  const handelAddAuthor = (e, data) => {
    const { co_authors, authors_email } = data;
    let email = "";
    let name = "";
    if (e?.target?.isCreate) {
      email = trimAllSpace(e?.target?.value);
    } else {
      email = trimAllSpace(e?.target?.data?.email_id);
      name = e?.target?.data?.name;
    }
    const isValidEmail = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email);
    if (!isValidEmail) {
      dispatch(throwError({ message: "Please enter valid email" }));
      return;
    }
    if (authors_email === email) {
      dispatch(
        throwError({ message: "Author email cannot add as co-author." })
      );
      return;
    }
    if (co_authors?.find((o) => o.email === email)) {
      dispatch(throwError({ message: "This email already exist in list." }));
      return;
    }
    return { email, name };
  };
  const [btnLoading, setBtnLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    paper_title: Yup.string().required("Paper title is required."),
    submission_type: Yup.string().required("Select any submission type."),
    abstract_path: Yup.string().required("File is required."),
    presentation_type: Yup.string().required("Presentation type is required."),
    comments: Yup.string().max(
      100,
      "Maximum 100 character allow for this field."
    ),
  });
  const initialValues = {
    authors: user_id,
    authors_email: email_id,
    co_authors: [],
    email_id: email_id,
    contact_number: phone_number,
    whatsapp_number: phone_number,
    submission_type: "",
    presentation_type: "",
    source: "",
    comments: "",
    abstract_path: "",
    abstractPathFileName: "",
    paper_title: "",
  };
  return (
    <Modal title={`Submited Abstarct For ${name}`} onHide={onHide}>
      <div className="mt-3">
        <Formik
          initialValues={initialValues}
          onSubmit={handelSave}
          validationSchema={validationSchema}
        >
          {(props) => {
            const {
              values,
              errors,
              handleChange,
              handleSubmit,
              setFieldValue,
            } = props;
            const { co_authors } = values;

            return (
              <form className="row cps-20 cpe-20 cpt-20 cpb-20">
                <div className="cmb-22">
                  <TextInput
                    id="paper_title"
                    onChange={handleChange}
                    placeholder="Paper title"
                    value={values?.paper_title}
                    error={errors?.paper_title}
                  />
                </div>
                <div className="cmb-22">
                  <UserCreatable
                    showOnSearch
                    label="Co Authors"
                    placeholder="Enter co-auther email"
                    id="co_authors"
                    onChange={(e) => {
                      let res = handelAddAuthor(e, values);
                      if (res?.email) {
                        let oldData = cloneDeep(co_authors);
                        oldData.push({ ...res, id: e?.target?.data?.id || "" });
                        setFieldValue("co_authors", oldData);
                      }
                    }}
                  />
                </div>
                {co_authors?.length > 0 && (
                  <div className="cmb-22 d-flex flex-wrap gap-2">
                    {co_authors?.map((elm, cindex) => {
                      return (
                        <span
                          key={cindex}
                          className="d-flex align-items-center gap-1 border p-1 ps-2 pe-2 w-fit"
                        >
                          <span className="text-14-500">
                            {elm.name || elm.email}
                          </span>
                          <span className="ms-2">
                            <i
                              className="bi bi-trash-fill text-danger pointer"
                              onClick={() => {
                                let oldData = cloneDeep(co_authors);
                                let newArry = oldData.filter(
                                  (_, i) => i !== cindex
                                );
                                setFieldValue("co_authors", newArry);
                              }}
                            />
                          </span>
                        </span>
                      );
                    })}
                  </div>
                )}
                <div className="d-flex gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <Label label="Submission Type*" />
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center">
                      <CheckBox
                        type="ACTIVE"
                        onClick={() => {
                          setFieldValue(
                            "submission_type",
                            "Abstract Submission"
                          );
                        }}
                        isChecked={
                          values.submission_type === "Abstract Submission"
                        }
                      />
                      <div className="text-16-400 color-raisin-black ms-3">
                        Abstract Submission
                      </div>
                    </div>
                    <div className="d-flex align-items-center ms-5">
                      <CheckBox
                        type="ACTIVE"
                        onClick={() => {
                          setFieldValue(
                            "submission_type",
                            "Full Paper Submission"
                          );
                        }}
                        isChecked={
                          values.submission_type === "Full Paper Submission"
                        }
                      />
                      <div className="text-16-400 color-raisin-black ms-3">
                        Full Paper Submission
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cmb-22">
                  {errors?.submission_type && (
                    <span style={{ color: "red" }} className="text-12-400">
                      {errors?.submission_type}
                    </span>
                  )}
                </div>
                <div className="col-md-6 cmb-22">
                  <Dropdown
                    id="presentation_type"
                    placeholder="Select Presentation Type"
                    options={eventMode}
                    optionKey="value"
                    optionValue="value"
                    onChange={handleChange}
                    value={values.presentation_type}
                    error={errors?.presentation_type}
                  />
                </div>
                <div className="cmb-22 col-md-6">
                  <TextInput
                    placeholder="How did you get to know about the conference?"
                    id="source"
                    onChange={handleChange}
                    value={values.source}
                    error={errors.source}
                  />
                </div>
                <div className="cmb-22">
                  <TextArea
                    placeholder="Comments"
                    id="comments"
                    onChange={handleChange}
                    value={values.comments}
                    error={errors.comments}
                    rows={3}
                  />
                </div>
                <div className="cmb-22">
                  <FileUpload
                    id="abstract_path"
                    onChange={(e) => {
                      const id = e.target.id;
                      const value = e.target.value;
                      const fileName = e.target.fileName;
                      setFieldValue("abstractPathFileName", fileName);
                      setFieldValue(id, value);
                    }}
                    fileText={getFilenameFromUrl(
                      values?.abstractPathFileName || values.abstract_path
                    )}
                    error={errors?.abstract_path}
                  />
                </div>
                <div className="d-flex justify-content-center gap-4">
                  <Button
                    text="Cancel"
                    isRounded
                    btnStyle="light-outline"
                    className="cps-40 cpe-40"
                    onClick={onHide}
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
      </div>
    </Modal>
  );
};

export default AbstractSubmission;
