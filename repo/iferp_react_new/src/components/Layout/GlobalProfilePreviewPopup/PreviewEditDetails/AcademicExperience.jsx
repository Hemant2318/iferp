import React, { useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  addAffiliations,
  fetchProfile,
  handelUserRegisterDetails,
} from "store/slices";
import { objectToFormData, titleCaseString } from "utils/helpers";
import { isEqual } from "lodash";
import TextInput from "components/form/TextInput";
import DatePicker from "components/form/DatePicker";
import TextArea from "components/form/TextArea";
import Button from "components/form/Button";
import Location from "components/form/Location";

const AcademicExperience = ({ fetchDetails, onHide }) => {
  const dispatch = useDispatch();
  const { userDetails, researchProfile } = useSelector((state) => ({
    userDetails: state.student.userDetails,
    researchProfile: state.student.researchProfile,
  }));
  const { affiliations } = researchProfile || {};
  const { id, professional_details = {} } = userDetails;

  const {
    institution_name,
    department,
    designation,
    address,
    professional_experience,
    industry_experience,
    country,
    state,
  } = professional_details;
  const [btnLoading, setBtnLoading] = useState(false);
  const memberTypeId = userDetails?.user_type;

  const handelSave = async (values) => {
    setBtnLoading(true);
    const payloadOne = {
      id: affiliations?.[0]?.id,
      user_id: affiliations?.[0]?.user_id,
    };
    const payloadTwo = { type: "2", id: id };
    let successOne = false;
    let successTwo = false;

    for (const key in values) {
      if (
        [
          "professional_address",
          "professional_country",
          "professional_department",
          "professional_designation",
          "professional_experience",
          "professional_institution_name",
          "professional_state",
          "industry_experience",
        ].includes(key)
      ) {
        payloadTwo[key] = values[key];
      } else {
        payloadOne[key] = values[key];
      }
    }
    if (payloadOne && payloadTwo) {
      const newPayloadOne = objectToFormData(payloadOne);
      const responseOne = await dispatch(addAffiliations(newPayloadOne));
      if (responseOne?.status === 200) {
        successOne = true;
      }

      const newPayloadTwo = objectToFormData(payloadTwo);
      const responseTwo = await dispatch(
        handelUserRegisterDetails(newPayloadTwo)
      );
      if (responseTwo?.status === 200) {
        successTwo = true;
      }

      if (successOne && successTwo) {
        dispatch(fetchProfile());
        fetchDetails();
        onHide();
      }
    }
    setBtnLoading(false);
  };

  let editData = {};
  editData = affiliations?.find((o) => o?.user_id === userDetails?.id);

  const handelValue = (value) => {
    return value && value !== "--Not Applicable--" ? value : "";
  };

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
    professional_institution_name: handelValue(institution_name) || "",
    professional_department: handelValue(department) || "",
    professional_designation: handelValue(designation) || "",
    professional_address: handelValue(address) || "",
    professional_country: handelValue(country) || "",
    professional_state: handelValue(state) || "",
    professional_experience: handelValue(professional_experience) || "",
    industry_experience: handelValue(industry_experience) || "",
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handelSave}
      validationSchema={validationSchema}
    >
      {(props) => {
        const { values, errors, handleChange, handleSubmit, setFieldValue } =
          props;

        return (
          <form className="">
            <div className="row">
              {memberTypeId === "2" && (
                <>
                  <div className="text-18-500 color-5068 ">
                    Current Experience
                  </div>
                  <div className="text-18-500 color-raisin-black cmb-22 mt-2">
                    Current Profession Details (Note: This information will be
                    Referred for Your Certification Purpose)
                  </div>

                  <>
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
                  </>

                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="Designation"
                      id="professional_designation"
                      value={values.professional_designation}
                      onChange={handleChange}
                      error={errors.professional_designation}
                    />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="Address"
                      id="professional_address"
                      value={values.professional_address}
                      onChange={handleChange}
                      error={errors.professional_address}
                    />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <Location
                      type="country"
                      data={{
                        id: "professional_country",
                        placeholder: "Country/Province",
                        value: values.professional_country,
                        error: errors.professional_country,
                        onChange: handleChange,
                      }}
                    />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <Location
                      type="state"
                      data={{
                        id: "professional_state",
                        placeholder: "State",
                        value: values.professional_state,
                        error: errors.professional_state,
                        countryId: values.professional_country,
                        onChange: handleChange,
                        disabled: !values.professional_country,
                      }}
                    />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="Professional Experience"
                      id="professional_experience"
                      value={values.professional_experience}
                      onChange={(e) => {
                        setFieldValue(
                          "professional_experience",
                          titleCaseString(e.target.value)
                        );
                      }}
                      error={errors.professional_experience}
                    />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="Industry Experience"
                      id="industry_experience"
                      value={values.industry_experience}
                      onChange={(e) => {
                        setFieldValue(
                          "industry_experience",
                          titleCaseString(e.target.value)
                        );
                      }}
                      error={errors.industry_experience}
                    />
                  </div>
                </>
              )}

              <div className="text-18-500 color-5068 mt-2">Past Experience</div>
              <div className="cmb-22 col-md-6">
                <TextInput
                  label="Institution*"
                  placeholder="Enter Institution"
                  id="institution"
                  value={values.institution}
                  error={errors.institution}
                  onChange={handleChange}
                />
              </div>
              <div className="cmb-22 col-md-6">
                <TextInput
                  label="Department*"
                  placeholder="Enter Department"
                  id="department"
                  value={values.department}
                  error={errors.department}
                  onChange={handleChange}
                />
              </div>
              <div className="cmb-22 col-md-6">
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
              <div className="cmb-22">
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

export default AcademicExperience;
