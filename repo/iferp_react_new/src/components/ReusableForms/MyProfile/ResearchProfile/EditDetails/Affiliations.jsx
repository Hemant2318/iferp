import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import { isEqual } from "lodash";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import Location from "components/form/Location";
import DatePicker from "components/form/DatePicker";
import TextArea from "components/form/TextArea";
import { objectToFormData } from "utils/helpers";
import { addAffiliations } from "store/slices";

const Affiliations = ({ onHide, isEdit, getProfileData }) => {
  const dispatch = useDispatch();
  const { researchProfile } = useSelector((state) => ({
    researchProfile: state.student.researchProfile,
  }));
  const { affiliations } = researchProfile || {};

  const [btnLoading, setBtnLoading] = useState(false);
  const handelSave = async (values) => {
    setBtnLoading(true);
    const payload = objectToFormData({ ...values, id: isEdit || "" });
    const response = await dispatch(addAffiliations(payload));
    if (response?.status === 200) {
      getProfileData();
      onHide();
    }
    setBtnLoading(false);
  };
  let editData = {};
  if (isEdit) {
    editData = affiliations.find((o) => o.id === isEdit);
  }
  const validationSchema = Yup.object().shape({
    institution: Yup.string().required("Institution is required."),
    department: Yup.string().required("Department is required."),
    position: Yup.string().required("Position is required."),
    start_date: Yup.string().required("Start date is required."),
    end_date: Yup.string().required("End date is required."),
    country_id: Yup.string().required("Country is required."),
    // city_id: Yup.string().required("City is required."),
    description: Yup.string()
      .required("Description is required.")
      .max(100, "Maximum 100 character allow for this field."),
  });
  const initialValues = {
    institution: editData?.institution || "",
    department: editData?.department || "",
    position: editData?.position || "",
    start_date: editData?.start_date || "",
    end_date: editData?.end_date || "",
    country_id: editData?.country_id || "",
    city_id: editData?.city_id || "",
    description: editData?.description || "",
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
              <div className="cmb-22">
                <TextInput
                  label="Department*"
                  placeholder="Enter Department"
                  id="department"
                  value={values.department}
                  error={errors.department}
                  onChange={handleChange}
                />
              </div>
              <div className="cmb-22">
                <TextInput
                  label="Position*"
                  placeholder="Enter Position"
                  id="position"
                  value={values.position}
                  error={errors.position}
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
              <div className="col-md-6 cmb-22">
                <Location
                  type="country"
                  data={{
                    id: "country_id",
                    label: "Country*",
                    optionKey: "id",
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
                <TextArea
                  label="Description*"
                  placeholder="Enter your roles & responsibilities"
                  id="description"
                  value={values.description}
                  error={errors.description}
                  onChange={handleChange}
                  rows={3}
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
export default Affiliations;
