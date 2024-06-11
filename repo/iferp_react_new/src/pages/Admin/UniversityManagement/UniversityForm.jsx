import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { isEqual, unionBy } from "lodash";
import { Formik } from "formik";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import Modal from "components/Layout/Modal";
import { addEditUniversity, fetchState } from "store/slices";
import {
  objectToFormData,
  titleCaseString,
  trimLeftSpace,
} from "utils/helpers";

const UniversityForm = ({ onHide, handelSuccess, editData }) => {
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
    const response = await dispatch(addEditUniversity(forData));
    if (response?.status === 200) {
      handelSuccess();
    } else {
      setBtnLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("University name is required."),
    country: Yup.string().required("Country is required."),
    state_province: Yup.string().required("State/Province is required."),
  });
  const initialValues = {
    name: editData?.name || "",
    country: editData?.country || "",
    state_province: editData?.state_province || "",
    domains: editData?.domains || "",
    web_pages: editData?.web_pages || "",
    id: editData?.id || "",
  };
  return (
    <Modal
      onHide={onHide}
      title={editData ? "Edit University" : "Add University"}
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
              handleChange,
              handleSubmit,
              setFieldValue,
            } = props;
            let newList = [];
            if (values?.state_province) {
              newList = [{ state: values.state_province }];
            }
            return (
              <form>
                <div className="row d-flex justify-conent-between align-items-center cmb-20">
                  <div className="col-md-12 cmb-22">
                    <TextInput
                      label="University Name"
                      placeholder="Enter University Name"
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
                            setFieldValue("state_province", "");
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
                          id="state_province"
                          value={values.state_province}
                          error={errors.state_province}
                          isLoading={stateLoading}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="cmb-22">
                    <TextInput
                      label="Web Page"
                      placeholder="Enter Web Page"
                      id="web_pages"
                      onChange={handleChange}
                      value={values.web_pages}
                      error={errors.web_pages}
                    />
                  </div>

                  <div className="col-md-12 d-flex justify-content-center gap-4 cmt-20">
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
export default UniversityForm;
