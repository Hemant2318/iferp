import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { isEqual, unionBy } from "lodash";
import { Formik } from "formik";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import Modal from "components/Layout/Modal";
import {
  objectToFormData,
  titleCaseString,
  trimLeftSpace,
} from "utils/helpers";
import { addEditInstitution, fetchState } from "store/slices";
import Dropdown from "components/form/Dropdown";

const InstitutionForm = ({ onHide, handelSuccess, editData }) => {
  const dispatch = useDispatch();
  const { countryList, stateList } = useSelector((state) => ({
    countryList: state.global.countryList,
    stateList: state.global.stateList,
  }));
  const [btnLoading, setBtnLoading] = useState(false);
  const [stateLoading, setStateLoading] = useState(false);

  const fetchStateList = async (countryId) => {
    setStateLoading(true);
    await dispatch(fetchState({ country_id: countryId }));
    setStateLoading(false);
  };
  const handelSave = async (values) => {
    setBtnLoading(true);
    let forData = objectToFormData(values);
    const response = await dispatch(addEditInstitution(forData));
    if (response?.status === 200) {
      handelSuccess();
    } else {
      setBtnLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Institution name is required."),
    country: Yup.string().required("Country is required."),
    state: Yup.string().required("State/Province is required."),
  });
  const initialValues = {
    name: editData?.name || "",
    country: editData?.country || "",
    state: editData?.state || "",
    id: editData?.id || "",
  };

  return (
    <Modal
      onHide={onHide}
      title={editData ? "Edit Institution" : "Add Institution"}
    >
      <div className="cmt-34 cms-20 cme-20">
        <Formik
          initialValues={initialValues}
          onSubmit={handelSave}
          validationSchema={validationSchema}
        >
          {(props) => {
            const {
              values,
              errors,
              handleSubmit,
              handleChange,
              setFieldValue,
            } = props;
            let newList = [];
            if (values?.state_province) {
              newList = [{ state: values.state_province }];
            }
            return (
              <form>
                <div className="cmb-22">
                  <TextInput
                    label="Institution Name"
                    placeholder="Enter Institution Name"
                    id="name"
                    onChange={(e) => {
                      setFieldValue(
                        "name",
                        trimLeftSpace(titleCaseString(e.target.value))
                      );
                    }}
                    value={values.name}
                    error={errors.name}
                  />
                </div>
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-6 cmb-22">
                      <Dropdown
                        label="Country*"
                        options={countryList}
                        optionKey="country"
                        optionValue="country"
                        placeholder="Select Country"
                        id="country"
                        value={values.country}
                        error={errors.country}
                        onChange={(e) => {
                          fetchStateList(e?.target?.data?.id);
                          setFieldValue("state", "");
                          handleChange(e);
                        }}
                      />
                    </div>
                    <div className="col-md-6 cmb-22">
                      <Dropdown
                        label="State/Province*"
                        options={unionBy(stateList, newList, "state")}
                        optionKey="state"
                        optionValue="state"
                        placeholder="Select State/Province"
                        id="state"
                        value={values.state}
                        error={errors.state}
                        isLoading={stateLoading}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-4 cmt-20 cmb-20">
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
export default InstitutionForm;
