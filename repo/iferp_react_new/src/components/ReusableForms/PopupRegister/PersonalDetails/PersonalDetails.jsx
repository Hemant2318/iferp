import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEqual, unionBy } from "lodash";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import DatePicker from "components/form/DatePicker";
import Dropdown from "components/form/Dropdown";
import Location from "components/form/Location";
import FileUpload from "components/form/FileUpload";
import {
  convertString,
  getFilenameFromUrl,
  numberOnlyFromInput,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import { handelUserRegisterDetails } from "store/slices";
import CreatableCityDropDown from "components/form/CreatableCityDropDown";
import moment from "moment";
import InstitutionDropdown from "components/form/InstitutionDropdown";
import UniversityDropdown from "components/form/UniversityDropdown";
import CourseDropdown from "components/form/CourseDropdown";

const PersonalDetails = ({ setType, userDetails, fetchUserData }) => {
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
    professional_details = {},
    educational_details = {},
    registration_status,
  } = userDetails;
  const {
    date_of_birth,
    gender,
    state,
    country,
    // country_name,
    // state_name,
    // city_name,
    city,
  } = personal_details;
  const {
    ug_course,
    ug_department,
    ug_university,
    ug_institution,
    ug_year_of_completion,
    other_ug_university,
    other_ug_institution,
    ug_university_name,
    ug_institution_name,
  } = educational_details;
  const handelSave = async (values) => {
    setBtnLoading(true);
    let forData = objectToFormData({
      ...values,
      city: values?.city === "586" ? values?.other_city : +values?.city,
      country: +values?.country,
      state: +values?.state,
      type: "1",
      id: id,
    });
    const response = await dispatch(handelUserRegisterDetails(forData));
    if (response?.status === 200) {
      fetchUserData();
      setType("education-details");
    }
    setBtnLoading(false);
  };
  const initialValues = {
    first_name: first_name || "",
    last_name: last_name || "",
    email_id: email_id || "",
    phone_number: phone_number || "",
    date_of_birth: date_of_birth || "",
    gender: gender || "",
    // country: country_name || "",
    // state: state_name || "",
    country: country || "",
    state: state || "",
    country_name: "",
    state_name: "",

    // address: address || "no address add",
    city: city || "",
    other_city: "",
    profile_photo_path: profile_photo_path || "",
    profilePhotoPathName: "",
    professional_institution_name: professional_details?.institution_name || "",
    professional_department: professional_details?.department || "",
    country_code: country_code || "IN",
    ug_course: ug_course || "",
    ug_department: ug_department || "",
    ug_university: ug_university || "",
    ug_institution: ug_institution || "",
    ug_year_of_completion: ug_year_of_completion || "",
    other_ug_university: other_ug_university || "",
    other_ug_institution: other_ug_institution || "",
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
    professional_institution_name: Yup.string().required(
      "Institution Name is required."
    ),
    professional_department: Yup.string().required(
      "Institution Departments is required."
    ),
    // address: Yup.string()
    //   .required("Door no. and street name is required.")
    //   .max(50, "Address is too long, it must be under 50 character."),
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
    ug_course: Yup.string().required("UG course is required."),
    ug_department: Yup.string().required("UG department is required."),
    ug_university: Yup.string().required("UG university is required."),
    ug_institution: Yup.string().required("UG institution is required."),
    ug_year_of_completion: Yup.string().required(
      "UG year of completion is required"
    ),
    other_ug_university: Yup.lazy((_, o) => {
      const { ug_university } = o?.parent;
      if (ug_university === "581") {
        return Yup.string().required("Please enter other university name.");
      } else {
        return Yup.string();
      }
    }),
    other_ug_institution: Yup.lazy((_, o) => {
      const { ug_institution } = o?.parent;
      if (ug_institution === "1772") {
        return Yup.string().required("Please enter other institution name.");
      } else {
        return Yup.string();
      }
    }),
  });

  const { departmentList } = useSelector((state) => ({
    departmentList: state.global.departmentList,
  }));
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        if (isEqual(values, initialValues) && +registration_status > 0) {
          setType("education-details");
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
          // resetForm,
        } = props;
        return (
          <form className="row">
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="First Name*"
                id="first_name"
                value={values.first_name}
                error={errors.first_name}
                disabled
                onChange={(e) => {
                  setFieldValue("first_name", titleCaseString(e.target.value));
                }}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Last Name*"
                id="last_name"
                value={values.last_name}
                disabled
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
                disabled={phone_number}
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
                disabled
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
                  id: "state",
                  placeholder: "State/Province*",
                  value: values.state,
                  error: errors.state,
                  countryId: values.country,
                  disabled: !values.country,
                  onChange: (e) => {
                    setFieldValue("state_name", e?.target?.data?.state);
                    handleChange(e);
                  },
                }}
              />
            </div>
            {/* <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Door No. , Street Name*"
                id="address"
                value={values.address}
                onChange={handleChange}
                error={errors.address}
              />
            </div> */}
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
                disabled={!values?.state}
                onChange={(e) => {
                  handleChange(e);
                }}
                value={values?.city}
                error={errors?.city}
                countryId={values?.country_name}
                stateId={values?.state_name}
                isClearable
                // existingList={
                //   city
                //     ? [
                //         {
                //           id: city,
                //           city: +city,
                //         },
                //       ]
                //     : []
                // }
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
            <div className="mt-2 mb-2">Bachelor Degree/UG Details</div>
            <div className="col-md-6 cmb-22">
              <CourseDropdown
                isClearable
                id="ug_course"
                courseType="ug"
                value={values.ug_course}
                error={errors.ug_course}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <Dropdown
                optionValue="name"
                id="ug_department"
                onChange={handleChange}
                options={unionBy(departmentList, "name")}
                value={values.ug_department}
                error={errors.ug_department}
                placeholder="Select Department"
              />
            </div>
            <div className="col-md-6 cmb-22">
              <UniversityDropdown
                id="ug_university"
                onChange={handleChange}
                value={values.ug_university}
                error={errors.ug_university}
                existingList={
                  ug_university
                    ? [
                        {
                          id: +ug_university,
                          name: ug_university_name,
                        },
                      ]
                    : []
                }
              />
            </div>
            {+values?.ug_university === 581 && (
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="ie. Example University, Country"
                  id="other_ug_university"
                  value={values.other_ug_university}
                  error={errors.other_ug_university}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="col-md-6 cmb-22">
              <InstitutionDropdown
                id="ug_institution"
                onChange={handleChange}
                value={values.ug_institution}
                error={errors.ug_institution}
                existingList={
                  ug_institution
                    ? [
                        {
                          id: +ug_institution,
                          name: ug_institution_name,
                        },
                      ]
                    : []
                }
              />
            </div>
            {+values?.ug_institution === 1772 && (
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="ie. Example Institution, Country"
                  id="other_ug_institution"
                  value={values.other_ug_institution}
                  error={errors.other_ug_institution}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="col-md-6 cmb-22">
              <DatePicker
                placeholder="Year of Completion"
                id="ug_year_of_completion"
                onChange={handleChange}
                value={values.ug_year_of_completion}
                error={errors.ug_year_of_completion}
                maxDate={moment()}
              />
            </div>
            <p className="fw-bold">
              Current Profession Details (Note: This information will be
              Referred for Your Certification Purpose)
            </p>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Institution/Organization Name"
                id="professional_institution_name"
                value={values.professional_institution_name}
                error={errors.professional_institution_name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Department"
                id="professional_department"
                value={values.professional_department}
                onChange={handleChange}
                error={errors.professional_department}
              />
            </div>
            <div className="d-flex justify-content-center mt-3">
              <Button
                isRounded
                text="Continue"
                btnStyle="primary-dark"
                className="cps-40 cpe-40"
                onClick={handleSubmit}
                btnLoading={btnLoading}
              />
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default PersonalDetails;
