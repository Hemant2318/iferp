import Modal from "components/Layout/Modal";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import { Formik } from "formik";
import { isEqual } from "lodash";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUpdateCountry, fetchCountry } from "store/slices";
import { titleCaseString } from "utils/helpers";
import * as Yup from "yup";

const AddCountry = ({ onHide, handelSuccess, editData }) => {
  const dispatch = useDispatch();
  const [btnLoading, setBtnLoading] = useState(false);

  const handelSave = (values) => {
    setBtnLoading(true);
    if (editData) {
      if (isEqual(initialValues, values)) {
        onHide();
      } else {
        handelEditData({ ...values, id: editData?.id });
      }
    } else {
      handelAddData(values);
    }
  };

  const handelAddData = async (values) => {
    let queryParam = new URLSearchParams(values).toString();
    const response = await dispatch(addUpdateCountry(queryParam));
    if (response?.status === 200) {
      handelSuccess();
      await dispatch(fetchCountry());
    } else {
      setBtnLoading(false);
    }
  };
  const handelEditData = async (values) => {
    let queryParam = new URLSearchParams(values).toString();
    const response = await dispatch(addUpdateCountry(queryParam));
    if (response?.status === 200) {
      handelSuccess();
    } else {
      setBtnLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    country: Yup.string().required("Country name is required."),
  });
  const initialValues = {
    country: editData?.country || "",
  };
  return (
    <Modal
      onHide={onHide}
      title={editData ? "Edit Country" : "Add Country"}
      size="md"
    >
      <div className="cmt-34 cms-20 cme-20 cmb-34">
        <Formik
          initialValues={initialValues}
          onSubmit={handelSave}
          validationSchema={validationSchema}
        >
          {(props) => {
            const { values, errors, handleSubmit, setFieldValue } = props;
            return (
              <form
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
              >
                <div className="row d-flex justify-conent-between align-items-center cmb-26">
                  <div className="col-md-12 cmb-22">
                    <TextInput
                      label="Country Name*"
                      placeholder="Enter Country Name"
                      id="country"
                      onChange={(e) => {
                        setFieldValue(
                          "country",
                          titleCaseString(e.target.value)
                        );
                      }}
                      value={values.country}
                      error={errors.country}
                    />
                  </div>

                  <div className="col-md-12 d-flex justify-content-center gap-4">
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
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};

export default AddCountry;
