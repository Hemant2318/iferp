import { useState } from "react";
import { isEqual, omit } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import Modal from "components/Layout/Modal";
import Button from "components/form/Button";
import FileUpload from "components/form/FileUpload";
import TextEditor from "components/form/TextEditor";
import TextInput from "components/form/TextInput";
import {
  getDataFromLocalStorage,
  getFilenameFromUrl,
  objectToFormData,
} from "utils/helpers";

import { createPost, storePostList } from "store/slices";

const QuestionDetails = ({ onHide, handelSuccess, editData, postTitle }) => {
  const dispatch = useDispatch();
  const { postList } = useSelector((state) => ({
    postList: state.global.postList,
  }));
  const { id: userID } = getDataFromLocalStorage() || {};
  const [btnLoading, setBtnLoading] = useState(false);
  const { id, description, title, post } = editData || {};

  const handelUpdatePost = async (values) => {
    setBtnLoading(true);
    let objectData = omit({ ...values, user_id: userID }, ["fileName"]);
    if (values) {
      objectData = { ...objectData, ...values };
    }
    if (id) {
      objectData = { ...objectData, post_id: id };
    }
    const response = await dispatch(createPost(objectToFormData(objectData)));
    if (response?.status === 200) {
      if (id) {
        const newList = postList.map((elem) => {
          if (elem.id === id) {
            elem = response?.data;
          }
          return elem;
        });
        dispatch(storePostList(newList));
      }
      handelSuccess();
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
    title: postTitle || title || "",
    description: description || "",
    post: post || "",
    fileName: getFilenameFromUrl(post) || "",
  };
  return (
    <Modal onHide={onHide} title={id ? "Edit Post" : "Create New Post"}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handelUpdatePost}
      >
        {(props) => {
          const { values, errors, handleChange, handleSubmit, setFieldValue } =
            props;
          return (
            <form className="cps-30 cpe-30 cpt-10 cpb-20">
              <div className="cmb-22">
                <TextInput
                  label="Post Title*"
                  id="title"
                  placeholder="Enter Post Title"
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
                  isRounded
                  text="Cancel"
                  btnStyle="light-outline"
                  className="cps-40 cpe-40"
                  onClick={onHide}
                />
                <Button
                  isRounded
                  text="Submit"
                  btnStyle="primary-dark"
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
export default QuestionDetails;
