import { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { isEqual } from "lodash";
import Location from "components/form/Location";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import {
  getFilenameFromUrl,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import { fetchProfile, handelUserRegisterDetails } from "store/slices";
import FileUpload from "components/form/FileUpload";
import CreatableCityDropDown from "components/form/CreatableCityDropDown";

const CompanyDetails = ({
  userDetails,
  // fetchUserData,
  handelSuccess,
  isEdit,
}) => {
  const dispatch = useDispatch();
  const { id, profile_photo_path, company_details = {} } = userDetails;

  const {
    company_name,
    company_email_id,
    company_contact_number,
    company_state,
    company_country,
    company_city,
    strength_of_company,
    no_of_premium_professional_members,
  } = company_details;
  const [btnLoading, setBtnLoading] = useState(false);
  const handelSave = async (values) => {
    setBtnLoading(true);
    let forData = objectToFormData({
      ...values,
      company_city:
        values?.company_city === "586"
          ? values?.other_city
          : +values?.company_city,
      company_country: +values?.company_country,
      company_state: +values?.company_state,
      type: "1",
      id: id,
    });

    const response = await dispatch(handelUserRegisterDetails(forData));
    if (response?.status === 200) {
      // const fetchData = await fetchUserData();
      const response = await dispatch(fetchProfile());
      if (response?.status === 200) {
        handelSuccess();
      }
    }
    setBtnLoading(false);
  };

  const initialValues = {
    company_name: company_name || "",
    company_email_id: company_email_id || "",
    company_contact_number: company_contact_number || "",
    company_country: company_country || "",
    company_state: company_state || "",
    company_city: company_city || "",
    strength_of_company: strength_of_company || "",
    no_of_premium_professional_members:
      no_of_premium_professional_members || "",
    profile_photo_path: profile_photo_path || "",
    profilePhotoPathName: "",
    country_name: "",
    state_name: "",
    other_city: "",
  };
  const validationSchema = Yup.object().shape({
    company_name: Yup.string().required("Company name is required."),
    company_email_id: Yup.string()
      .required("Email is required.")
      .email("Email must be a valid email"),
    company_contact_number: Yup.string()
      .required("Phone number is required.")
      .min(10, "Phone number must be 10 digit.")
      .max(10, "Phone number must be 10 digit."),
    company_country: Yup.string().required("Country is required."),
    company_state: Yup.string().required("State/Province is required."),
    company_city: Yup.string().required("City is required."),
    other_city: Yup.lazy((_, o) => {
      const { company_city } = o?.parent;
      if (company_city === "586") {
        return Yup.string().required("Please enter Other city name.");
      } else {
        return Yup.string();
      }
    }),
    profile_photo_path: Yup.string().required("profile photo is required."),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        if (isEqual(values, initialValues)) {
          handelSuccess();
        } else {
          handelSave(values);
        }
      }}
    >
      {(props) => {
        const {
          values,
          errors,
          handleChange,
          setFieldValue,
          handleSubmit,
          resetForm,
        } = props;
        return (
          <form>
            <div className="row">
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Company Name*"
                  id="company_name"
                  value={values?.company_name}
                  onChange={(e) => {
                    setFieldValue(
                      "company_name",
                      titleCaseString(e.target.value)
                    );
                  }}
                  error={errors.company_name}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Company Email Id*"
                  id="company_email_id"
                  value={values?.company_email_id}
                  onChange={handleChange}
                  error={errors.company_email_id}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Company Contact Number*"
                  id="company_contact_number"
                  value={values?.company_contact_number}
                  onChange={handleChange}
                  error={errors.company_contact_number}
                />
              </div>

              <div className="col-md-6 cmb-22">
                <Location
                  type="country"
                  data={{
                    id: "company_country",
                    placeholder: "Country*",
                    value: values?.company_country,
                    error: errors.company_country,
                    onChange: (e) => {
                      setFieldValue("country_name", e?.target?.data?.country);
                      handleChange(e);
                    },
                  }}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <Location
                  type="state"
                  data={{
                    id: "company_state",
                    placeholder: "State/Province*",
                    value: values?.company_state,
                    error: errors.company_state,
                    countryId: values?.company_country,
                    disabled: !values?.company_country,
                    onChange: (e) => {
                      setFieldValue("state_name", e?.target?.data?.state);
                      handleChange(e);
                    },
                  }}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <CreatableCityDropDown
                  id="company_city"
                  disabled={!values?.company_state}
                  onChange={handleChange}
                  value={values?.company_city}
                  error={errors?.company_city}
                  countryId={values?.country_name}
                  stateId={values?.state_name}
                  isClearable
                />
              </div>
              {+values?.company_city === 586 && (
                <div className="col-md-6 cmb-22">
                  <TextInput
                    placeholder="Add Other City"
                    id="other_city"
                    value={values?.other_city}
                    error={errors.other_city}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Strength of the Company"
                  id="strength_of_company"
                  value={values?.strength_of_company}
                  onChange={handleChange}
                  error={errors.strength_of_company}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="No. of IFERP Premium Professional Members"
                  id="no_of_premium_professional_members"
                  value={values?.no_of_premium_professional_members}
                  onChange={handleChange}
                  error={errors.no_of_premium_professional_members}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <FileUpload
                  id="profile_photo_path"
                  onChange={(e) => {
                    const id = e.target.id;
                    const value = e.target.value;
                    const fileName = e.target.fileName;
                    setFieldValue("profilePhotoPathName", fileName);
                    setFieldValue(id, value);
                  }}
                  fileText={
                    getFilenameFromUrl(
                      values?.profilePhotoPathName || values?.profile_photo_path
                    ) || "Profile Photo"
                  }
                  fileType="image"
                  error={errors.profile_photo_path}
                />
              </div>

              <div className="d-flex justify-content-center gap-4 mt-2">
                <Button
                  isRounded
                  text="Cancel"
                  btnStyle="light-outline"
                  className="cps-50 cpe-50"
                  onClick={resetForm}
                />
                <Button
                  isRounded
                  text={isEdit ? "Submit" : "Continue"}
                  btnStyle="primary-dark"
                  className="cps-40 cpe-40"
                  onClick={handleSubmit}
                  btnLoading={btnLoading}
                />
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};
export default CompanyDetails;
