import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import { isEqual } from "lodash";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import Location from "components/form/Location";
import DatePicker from "components/form/DatePicker";
import { addEducation } from "store/slices";
import { objectToFormData } from "utils/helpers";

const Education = ({ onHide, getProfileData }) => {
  const dispatch = useDispatch();
  const { researchProfile } = useSelector((state) => ({
    researchProfile: state.student.researchProfile,
  }));
  const { higher_qualification_details: editData } = researchProfile || {};
  const [btnLoading, setBtnLoading] = useState(false);
  const handelSave = async (values) => {
    setBtnLoading(true);
    const payload = objectToFormData(values);
    const response = await dispatch(addEducation(payload));
    if (response?.status === 200) {
      getProfileData();
      onHide();
    }
    setBtnLoading(false);
  };
  const validationSchema = Yup.object().shape({
    institution: Yup.string().required("Institution is required."),
    start_date: Yup.string().required("Start date is required."),
    end_date: Yup.string().required("End date is required."),
    field_of_study: Yup.string().required("Field of study is required."),
    country_id: Yup.string().required("Country is required."),
    // city_id: Yup.string().required("City is required."),
    degree: Yup.string().required("Degree is required."),
  });
  const initialValues = {
    institution: editData?.institution || "",
    start_date: editData?.start_date || "",
    end_date: editData?.end_date || "",
    field_of_study: editData?.field_of_study || "",
    country_id: editData?.country_id || "",
    city_id: editData?.city_id || "",
    degree: editData?.degree || "",
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handelSave}
      validationSchema={validationSchema}
    >
      {(props) => {
        const { values, errors, handleChange, handleSubmit } = props;
        return (
          <form>
            <div className="row">
              <div className="cmb-22">
                <TextInput
                  label="Institution*"
                  placeholder="Enter Institution"
                  id="institution"
                  value={values.institution}
                  error={errors.institution}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <DatePicker
                  label="Start Date*"
                  placeholder="Enter Start Date"
                  id="start_date"
                  value={values.start_date}
                  error={errors.start_date}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <DatePicker
                  label="End Date*"
                  placeholder="Enter End Date"
                  id="end_date"
                  value={values.end_date}
                  error={errors.end_date}
                  onChange={handleChange}
                />
              </div>
              <div className="cmb-22">
                <TextInput
                  label="Field Of Study*"
                  placeholder="Enter Field Of Study"
                  id="field_of_study"
                  value={values.field_of_study}
                  error={errors.field_of_study}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 cmb-22">
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
              <div className="col-md-6 cmb-22">
                <Location
                  type="city"
                  data={{
                    id: "city_id",
                    label: "City",
                    placeholder: "Select City",
                    value: values.city_id,
                    error: errors.city_id,
                    countryId: values.country_id,
                    disabled: !values.country_id,
                    onChange: handleChange,
                  }}
                />
              </div>

              <div>
                <TextInput
                  label="Degree*"
                  placeholder="Enter Degree"
                  id="degree"
                  value={values.degree}
                  error={errors.degree}
                  onChange={handleChange}
                />
              </div>
              <div className="d-flex justify-content-center gap-4 cmt-40">
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
                  btnLoading={btnLoading}
                  disabled={isEqual(values, initialValues)}
                />
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};
export default Education;
