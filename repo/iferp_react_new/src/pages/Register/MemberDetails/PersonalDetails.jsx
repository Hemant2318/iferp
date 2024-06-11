import { useState } from "react";
import {
  useDispatch,
  // useSelector
} from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { isEqual } from "lodash";
import TextInput from "components/form/TextInput";
import DatePicker from "components/form/DatePicker";
import Dropdown from "components/form/Dropdown";
import Location from "components/form/Location";
import FileUpload from "components/form/FileUpload";
import Button from "components/form/Button";
import { handelUserRegisterDetails } from "store/slices";
import {
  convertString,
  getFilenameFromUrl,
  numberOnlyFromInput,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import RequestChange from "components/Layout/RequestChange";
import CreatableCityDropDown from "components/form/CreatableCityDropDown";

const PersonalDetails = ({
  userDetails,
  fetchUserData,
  handelSuccess,
  isEdit,
  afterRedirect,
}) => {
  const dispatch = useDispatch();
  const [btnLoading, setBtnLoading] = useState(false);
  const {
    id,
    first_name,
    last_name,
    email_id,
    phone_number,
    country_code = "IN",
    profile_photo_path,
    personal_details = {},
    registration_status,
  } = userDetails;

  const {
    date_of_birth,
    gender,
    city,
    address,
    country_name,
    // city_name,
    state_name,
    country,
    state,
  } = personal_details;
  // console.log(personal_details);
  // const { cityList } = useSelector((state) => ({
  //   cityList: state.global.cityList,
  // }));
  // const cityList = [];
  const handelSave = async (values) => {
    setBtnLoading(true);
    let forData = objectToFormData({
      ...values,
      city: values?.city === "586" ? values?.other_city : +values?.city,
      type: "1",
      id: id,
      country: +values?.country,
      state: +values?.state,
    });
    const response = await dispatch(handelUserRegisterDetails(forData));
    if (response?.status === 200) {
      const fetchData = await fetchUserData();
      if (fetchData?.status === 200) {
        handelSuccess();
      }
    }
    setBtnLoading(false);
  };
  // const selectOther = cityList.some((item) => item.city === city_name);
  // console.log(city);
  const initialValues = {
    first_name: first_name || "",
    last_name: last_name || "",
    email_id: email_id || "",
    phone_number: phone_number || "",
    date_of_birth: date_of_birth || "",
    gender: gender || "",
    country: country || "",
    state: state || "",
    country_name: country_name || "",
    state_name: state_name || "",
    address: address || "",
    city: city || "",
    other_city: "",
    profile_photo_path: profile_photo_path || "",
    profilePhotoPathName: "",
    country_code: country_code || "IN",
  };
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required."),
    last_name: Yup.string().required("Last name is required."),
    email_id: Yup.string()
      .required("Email is required.")
      .email("Email must be a valid email"),
    phone_number: Yup.string()
      .required("Phone number is required.")
      .min(4, "Phone number must be minimum 4 digit.")
      .max(13, "Phone number must be maximum 13 digit."),
    date_of_birth: Yup.string().required("Date of birth is required."),
    gender: Yup.string().required("Gender is required."),
    country: Yup.string().required("Country is required."),
    state: Yup.string().required("State/Province is required."),
    address: Yup.string()
      .required("Door no. and street name is required.")
      .max(50, "Address is too long, it must be under 50 character."),
    city: Yup.string().required("City is required."),
    other_city: Yup.lazy((_, o) => {
      const { city } = o?.parent;
      if (city === "586") {
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
        if (isEqual(values, initialValues) && +registration_status > 0) {
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
              {isEdit && (
                <div className="cmb-22 d-flex justify-content-end">
                  <RequestChange afterRedirect={afterRedirect} />
                </div>
              )}
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="First Name*"
                  id="first_name"
                  value={values.first_name}
                  error={errors.first_name}
                  disabled={isEdit}
                  onChange={(e) => {
                    setFieldValue(
                      "first_name",
                      titleCaseString(e.target.value)
                    );
                  }}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Last Name*"
                  id="last_name"
                  value={values.last_name}
                  disabled={isEdit}
                  error={errors.last_name}
                  onChange={(e) => {
                    setFieldValue("last_name", titleCaseString(e.target.value));
                  }}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  isPhoneNumber
                  placeholder="Phone Number*"
                  id="phone_number"
                  value={values.phone_number}
                  error={errors.phone_number}
                  phoneNumberData={{
                    id: "country_code",
                    value: values.country_code,
                  }}
                  onChange={(e) => {
                    if (e.target.id === "phone_number") {
                      handleChange(numberOnlyFromInput(e));
                    } else {
                      handleChange(e);
                      handleChange({
                        target: { id: "phone_number", value: "" },
                      });
                    }
                  }}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Email ID*"
                  id="email_id"
                  value={values.email_id}
                  onChange={(e) => {
                    handleChange(convertString(1, e));
                  }}
                  error={errors.email_id}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <DatePicker
                  placeholder="Date of Birth*"
                  id="date_of_birth"
                  value={values.date_of_birth}
                  onChange={handleChange}
                  error={errors.date_of_birth}
                  maxDate={new Date()}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <Dropdown
                  placeholder="Gender*"
                  options={[
                    { id: "Male", label: "Male" },
                    { id: "Female", label: "Female" },
                  ]}
                  id="gender"
                  value={values.gender}
                  onChange={handleChange}
                  error={errors.gender}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <Location
                  type="country"
                  data={{
                    id: "country",
                    placeholder: "Country*",
                    value: values.country,
                    error: errors.country,
                    onChange: (e) => {
                      setFieldValue("state", "");
                      setFieldValue("city", "");
                      setFieldValue("other_city", "");
                      setFieldValue("address", "");
                      handleChange(e);
                    },
                  }}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <Location
                  type="state"
                  data={{
                    id: "state",
                    placeholder: "State/Province*",
                    value: values.state,
                    error: errors.state,
                    countryId: values.country,
                    onChange: (e) => {
                      setFieldValue("city", "");
                      setFieldValue("other_city", "");
                      setFieldValue("address", "");
                      setFieldValue(
                        "country_name",
                        e?.target?.data?.country_name || ""
                      );
                      setFieldValue("state_name", e?.target?.data?.state || "");
                      handleChange(e);
                    },
                    disabled: !values.country,
                  }}
                />
              </div>

              {/* <div className="col-md-6 cmb-22">
                <Location
                  type="city"
                  data={{
                    id: "city",
                    placeholder: "City",
                    value: values.city,
                    error: errors.city,
                    countryId: values.country,
                    stateId: values.state,
                    onChange: handleChange,
                    disabled: !values.state,
                  }}
                />
              </div> */}
              <div className="col-md-6 cmb-22">
                <CreatableCityDropDown
                  id="city"
                  disabled={!values.state}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  value={values.city}
                  error={errors.city}
                  countryId={values?.country_name}
                  stateId={values?.state_name}
                  isClearable
                />
              </div>
              {+values?.city === 586 && (
                <div className="col-md-6 cmb-22">
                  <TextInput
                    placeholder="Add Other City"
                    id="other_city"
                    value={values.other_city}
                    error={errors.other_city}
                    onChange={handleChange}
                  />
                </div>
              )}
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Door No. , Street Name*"
                  id="address"
                  value={values.address}
                  onChange={handleChange}
                  error={errors.address}
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
                      values.profilePhotoPathName || values.profile_photo_path
                    ) || "Profile Photo"
                  }
                  fileType="image"
                  error={errors.profile_photo_path}
                />
              </div>
              <div className="d-flex justify-content-center gap-4 mt-2">
                <Button
                  isRounded
                  text="Reset"
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
export default PersonalDetails;
