import { isEqual, omit } from "lodash";
// import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import Button from "components/inputs/Button";
import FileUpload from "components/inputs/FileUpload";
import TextInput from "components/inputs/TextInput/TextInput";
import TextEditor from "components/inputs/TextEditor/TextEditor";
import Modal from "components/layouts/Modal";
import {
  getDataFromLocalStorage,
  getFilenameFromUrl,
  objectToFormData,
} from "utils/helpers/common";
import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { createPost } from "store/globalSlice";

const QuestionDetailsPopup = ({ onHide, handleSuccess }) => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const { id: userID } = getDataFromLocalStorage() || {};
  const [btnLoading, setBtnLoading] = useState(false);
  // const { id, description, title, post } = editData || {};

  const handelUpdatePost = async (values) => {
    setBtnLoading(true);
    let objectData = omit({ ...values, user_id: userID }, ["fileName"]);
    if (values) {
      objectData = { ...objectData, ...values };
    }

    const response = await dispatch(createPost(objectToFormData(objectData)));
    if (response?.status === 200) {
      if (formRef.current) {
        formRef.current.resetForm();
      }
      handleSuccess();
    }
    setBtnLoading(false);
  };
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required."),
    description: Yup.string().required("Description is required."),
    // post: Yup.string().required("File is required."),
  });
  const initialValues = {
    category_id: 8,
    title: "",
    description: "",
    post: "",
    fileName: "",
  };
  return (
    <Modal onHide={onHide} title={"Start Discussion"}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handelUpdatePost}
        innerRef={formRef}
      >
        {(props) => {
          const { values, errors, handleChange, handleSubmit, setFieldValue } =
            props;
          return (
            <form className="cps-30 cpe-30 cpt-10 cpb-20">
              <div className="cmb-22">
                <TextInput
                  label="Question*"
                  id="title"
                  placeholder="Enter Question"
                  onChange={handleChange}
                  error={errors.title}
                  value={values.title}
                />
              </div>
              <div className="cmb-22">
                <TextEditor
                  label="Description*"
                  placeholder="Description"
                  id="description"
                  onChange={handleChange}
                  value={values.description}
                  error={errors.description}
                />
              </div>
              <div className="cmb-22">
                <FileUpload
                  id="post"
                  label="Add File"
                  error={errors?.post}
                  onChange={(e) => {
                    const fileName = e.target.fileName;
                    setFieldValue("fileName", fileName);
                    handleChange(e);
                  }}
                  fileText={getFilenameFromUrl(values?.fileName || "File")}
                />
              </div>
              <div className="d-flex justify-content-center gap-4 pt-3">
                <Button
                  btnText="Cancel"
                  btnStyle="light-outline"
                  className="cps-40 cpe-40"
                  onClick={onHide}
                />
                <Button
                  btnText="Submit"
                  btnStyle="SD"
                  className="cps-40 cpe-40"
                  onClick={handleSubmit}
                  disabled={isEqual(initialValues, values)}
                  btnLoading={btnLoading}
                />
              </div>
            </form>
          );
        }}
      </Formik>
    </Modal>
  );
};
export default QuestionDetailsPopup;
