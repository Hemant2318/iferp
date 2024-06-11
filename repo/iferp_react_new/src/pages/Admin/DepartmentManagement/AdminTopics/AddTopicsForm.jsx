import Modal from "components/Layout/Modal";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import TextInput from "components/form/TextInput";
import { Formik } from "formik";
import { isEqual } from "lodash";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  addTopics,
  commonFunctionalityTopic,
  throwError,
  throwSuccess,
} from "store/slices";
import { objectToFormData } from "utils/helpers";
import * as Yup from "yup";

const AddTopicsForm = ({ onHide, editData, list, handleSuccess }) => {
  const params = useParams();
  const { type } = params;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (values) => {
    setIsLoading(true);
    let newPayload = { topic_id: editData?.id, topics: values?.topic };
    if (editData) {
      if (type === "unassign-topics") {
        newPayload = {
          topic_id: editData?.id,
          department_id: +values?.parent_id,
        };
      }
      handleUpdate(newPayload);
    } else {
      handleAdd(values);
    }
  };

  const handleUpdate = async (data) => {
    setIsLoading(true);
    const response = await dispatch(
      commonFunctionalityTopic(objectToFormData(data))
    );
    // const response = await dispatch(updateTopic(objectToFormData(data)));
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      handleSuccess();
    } else {
      dispatch(throwError(response?.message));
    }
    setIsLoading(false);
  };

  const handleAdd = async (values) => {
    setIsLoading(true);
    const response = await dispatch(addTopics(objectToFormData(values)));
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      handleSuccess();
    } else {
      dispatch(throwError(response?.message));
    }
    setIsLoading(false);
  };

  const initialValues = {
    parent_id: editData?.parent_id || "",
    topic: editData?.topics || "",
  };
  const validationSchema = Yup.object().shape({
    parent_id: Yup.string().required("Department Name is required."),
    topic: Yup.string().required("Topic Name is required."),
  });
  return (
    <Modal
      onHide={onHide}
      title={editData ? `Edit Topics` : `Add Topics`}
      size="md"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {(props) => {
          const { values, errors, handleChange, handleSubmit } = props;
          return (
            <form>
              <div className="row cmt-34 cms-10 cme-10 cmb-24">
                <div className="col-md-12 cmb-22">
                  <Dropdown
                    label="Department Name*"
                    id="parent_id"
                    placeholder="Select Department"
                    value={values?.parent_id}
                    error={errors?.parent_id}
                    options={list}
                    optionValue="department"
                    optionKey="id"
                    onChange={handleChange}
                    disabled={type !== "unassign-topics" && editData}
                  />
                </div>
                <div className="col-md-12 cmb-22">
                  <TextInput
                    label="Topic Name*"
                    placeholder="Topic Name"
                    id="topic"
                    onChange={handleChange}
                    value={values?.topic}
                    error={errors?.topic}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-center gap-4 cmt-30">
                <Button
                  text="Cancel"
                  isRounded
                  btnStyle="light-outline"
                  className="cps-30 cpe-30"
                  onClick={onHide}
                />
                <Button
                  text="Submit"
                  isRounded
                  btnStyle="primary-dark"
                  className="cps-30 cpe-30"
                  onClick={handleSubmit}
                  disabled={isEqual(initialValues, values)}
                  btnLoading={isLoading}
                />
              </div>
            </form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default AddTopicsForm;
