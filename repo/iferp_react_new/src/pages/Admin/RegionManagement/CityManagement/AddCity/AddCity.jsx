import Modal from "components/Layout/Modal";
import Button from "components/form/Button";
import Location from "components/form/Location";
import TextInput from "components/form/TextInput";
import { Formik } from "formik";
import { isEqual } from "lodash";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUpdateCity } from "store/slices";
import { titleCaseString } from "utils/helpers";
import * as Yup from "yup";

const AddCity = ({ onHide, handelSuccess, editData }) => {
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
    const response = await dispatch(addUpdateCity(queryParam));
    if (response?.status === 200) {
      handelSuccess();
    } else {
      setBtnLoading(false);
    }
  };
  const handelEditData = async (values) => {
    let queryParam = new URLSearchParams(values).toString();
    const response = await dispatch(addUpdateCity(queryParam));
    if (response?.status === 200) {
      handelSuccess();
    } else {
      setBtnLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    city: Yup.string().required("City name is required."),
    state_id: Yup.string().required("State name is required."),
    country_id: Yup.string().required("Country is required."),
  });

  const initialValues = {
    city: editData?.city || "",
    state_id: editData?.state || "",
    country_id: editData?.country || "",
  };
  return (
    <Modal
      onHide={onHide}
      title={editData ? "Edit City" : "Add City"}
      size="md"
    >
      <div className="cmt-34 cms-20 cme-20 cmb-34">
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
                    <Location
                      type="country"
                      data={{
                        id: "country_id",
                        label: "Country*",
                        placeholder: "Select Country",
                        value: values.country_id,
                        error: errors.country_id,
                        onChange: handleChange,
                      }}
                    />
                  </div>
                  <div className="col-md-12 cmb-22">
                    <Location
                      type="state"
                      data={{
                        id: "state_id",
                        label: "State*",
                        placeholder: "Select State",
                        value: values.state_id,
                        error: errors.state_id,
                        countryId: values.country_id,
                        disabled: !values.country_id,
                        onChange: handleChange,
                      }}
                    />
                  </div>
                  <div className="col-md-12 cmb-22">
                    <TextInput
                      label="City Name*"
                      placeholder="Enter City Name"
                      id="City"
                      onChange={(e) => {
                        setFieldValue("city", titleCaseString(e.target.value));
                      }}
                      value={values.city}
                      error={errors.city}
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

export default AddCity;
