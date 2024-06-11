import Modal from "components/Layout/Modal";
import * as Yup from "yup";
import { Formik } from "formik";
import { useState } from "react";
import MultipleSelect from "components/form/MultipleSelect";
import Button from "components/form/Button";
import { isEqual } from "lodash";

const EditMyInterests = ({ onHide }) => {
  const [btnLoading, setBtnLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    topics: Yup.string().required("Topics is required."),
    regions: Yup.string().required("Regions is required."),
  });
  const handelSave = (values) => {
    setBtnLoading(true);
    console.log(values);
    setBtnLoading(false);
  };
  const initialValues = {
    topics: "",
    regions: "",
  };
  return (
    <Modal title="Edit My Interests" onHide={onHide}>
      <div className="cps-30 cpe-30 mt-5 cpb-30">
        <Formik
          initialValues={initialValues}
          onSubmit={handelSave}
          validationSchema={validationSchema}
        >
          {(props) => {
            const { values, errors, handleChange, handleSubmit } = props;
            return (
              <form>
                <div className="cmb-22">
                  <MultipleSelect
                    placeholder="Select Topics"
                    label="Topics*"
                    id="topics"
                    value={values.topics}
                    error={errors.topics}
                    onChange={handleChange}
                    options={[]}
                  />
                </div>
                <div className="cmb-22">
                  <MultipleSelect
                    placeholder="Select Regions"
                    label="Regions*"
                    id="regions"
                    value={values.regions}
                    error={errors.regions}
                    onChange={handleChange}
                    options={[]}
                  />
                </div>
                <div className="d-flex justify-content-center gap-4 pt-3">
                  <Button
                    isRounded
                    text="Done"
                    btnStyle="primary-dark"
                    className="cps-40 cpe-40"
                    btnLoading={btnLoading}
                    onClick={handleSubmit}
                    disabled={isEqual(values, initialValues)}
                  />
                  <Button
                    isRounded
                    text="Cancel"
                    btnStyle="light-outline"
                    className="cps-30 cpe-30"
                    onClick={onHide}
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
export default EditMyInterests;
