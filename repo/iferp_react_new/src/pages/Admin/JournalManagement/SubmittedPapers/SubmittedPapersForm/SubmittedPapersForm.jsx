import { useState } from "react";
import { useDispatch } from "react-redux";
import { isEqual } from "lodash";
import { Formik } from "formik";
import Label from "components/form/Label";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import FileUpload from "components/form/FileUpload";
import Modal from "components/Layout/Modal";
import { editJournalPaper } from "store/slices";
import { getFilenameFromUrl, objectToFormData } from "utils/helpers";

const SubmittedPapersForm = ({ onHide, editData, handelSuccess }) => {
  const dispatch = useDispatch();
  const initialValues = {
    userEmail: editData?.userEmail || "",
    userPhone: editData?.userPhone || "",
    userCountry: editData?.userCountry || "",
    userState: editData?.userState || "",
    userInstitutionName: editData?.userInstitutionName || "",
    journalName: editData?.journalName || "",
    userDesignation: editData?.userDesignation || "",
    userDepartment: editData?.userDepartment || "",
    authorName: editData?.authorName || "",
    coAuthorName: editData?.coAuthorName || "",
    title: editData?.title || "",
    paperFile: editData?.paperFile || "",
  };
  const [btnLoading, setBtnLoading] = useState(false);
  const handelSave = (values) => {
    setBtnLoading(true);
    if (isEqual(initialValues, values)) {
      onHide();
    } else {
      handelEditData({ ...values, id: editData.id });
    }
  };
  const handelEditData = async (values) => {
    const { id, authorName, coAuthorName, title, paperFile } = values;
    const payloadObject = {
      papers_id: id,
      author_name: authorName,
      co_author_name: coAuthorName,
      paper_title: title,
      paper_file: paperFile,
    };
    let forData = objectToFormData(payloadObject);
    const response = await dispatch(editJournalPaper(forData));
    if (response?.status === 200) {
      handelSuccess(true);
    }
    setBtnLoading(false);
  };
  return (
    <Modal onHide={onHide} title="Edit Submitted Papers">
      <div className="cmt-34 cms-34 cme-34 cmb-34">
        <Formik initialValues={initialValues} onSubmit={handelSave}>
          {(props) => {
            const { values, handleChange, handleSubmit, setFieldValue } = props;
            return (
              <form>
                <div className="row">
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="Email"
                      id="userEmail"
                      onChange={handleChange}
                      value={values.userEmail}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="Phone"
                      id="userPhone"
                      onChange={handleChange}
                      value={values.userPhone}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="Country"
                      id="userCountry"
                      onChange={handleChange}
                      value={values.userCountry}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="State/Province"
                      id="userState"
                      onChange={handleChange}
                      value={values.userState}
                      disabled
                    />
                  </div>
                  <div className="cmb-22">
                    <TextInput
                      placeholder="Organisation"
                      id="userInstitutionName"
                      onChange={handleChange}
                      value={values.userInstitutionName}
                      disabled
                    />
                  </div>
                  <div className="cmb-22">
                    <TextInput
                      placeholder="Event"
                      id="journalName"
                      onChange={handleChange}
                      value={values.journalName}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="Designation"
                      id="userDesignation"
                      onChange={handleChange}
                      value={values.userDesignation}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="Type"
                      id="userDepartment"
                      onChange={handleChange}
                      value={values.userDepartment}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="Author"
                      id="authorName"
                      onChange={handleChange}
                      value={values.authorName}
                    />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="Co Author"
                      id="coAuthorName"
                      onChange={handleChange}
                      value={values.coAuthorName}
                    />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="Paper Title"
                      id="title"
                      onChange={handleChange}
                      value={values.title}
                    />
                  </div>
                  <div className="col-md-6 cmb-22 d-flex justify-conent-between align-items-center ">
                    <div className="col-md-2">
                      <Label label="Paper" />
                    </div>
                    <div className="col-md-10">
                      <FileUpload
                        fileText={getFilenameFromUrl(values.paperFile || "")}
                        id="paperFile"
                        onChange={(e) => {
                          const id = e.target.id;
                          const value = e.target.value;
                          setFieldValue(id, value);
                        }}
                        value={values.paperFile}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-4 cmt-30">
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
export default SubmittedPapersForm;
