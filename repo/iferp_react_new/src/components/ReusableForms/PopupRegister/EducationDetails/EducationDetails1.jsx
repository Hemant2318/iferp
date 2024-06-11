import * as Yup from "yup";
import moment from "moment";
import { Formik } from "formik";
import DatePicker from "components/form/DatePicker";
import TextInput from "components/form/TextInput";
import InstitutionDropdown from "components/form/InstitutionDropdown";
import UniversityDropdown from "components/form/UniversityDropdown";
import { isEqual, unionBy } from "lodash";
import CourseDropdown from "components/form/CourseDropdown";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "components/form/Dropdown";
import Button from "components/form/Button";
import { useState } from "react";
import { objectToFormData } from "utils/helpers";
import { handelUserRegisterDetails } from "store/slices";

const EducationDetails1 = ({
  setType,
  setFormType,
  userDetails,
  fetchUserData,
}) => {
  const dispatch = useDispatch();
  const {
    id,
    educational_details = {},
    professional_details = {},
    registration_status,
    // is_migrated,
  } = userDetails;
  const {
    ug_course,
    ug_department,
    ug_university,
    ug_university_name,
    ug_institution,
    ug_institution_name,
    ug_year_of_completion,
    other_ug_university,
    other_ug_institution,
  } = educational_details;
  const { institution_name, department } = professional_details;
  const { departmentList } = useSelector((state) => ({
    departmentList: state.global.departmentList,
  }));
  const [btnLoading, setBtnLoading] = useState(false);
  const handelSave = async (values) => {
    setBtnLoading(true);
    let forData = objectToFormData({
      ...values,
      type: "2",
      id: id,
    });
    const response = await dispatch(handelUserRegisterDetails(forData));
    if (response?.status === 200) {
      fetchUserData();
      setFormType("1");
    }
    setBtnLoading(false);
  };
  const initialValues = {
    ug_course: ug_course || "",
    ug_department: ug_department || "",
    ug_university: ug_university || "",
    ug_institution: ug_institution || "",
    ug_year_of_completion: ug_year_of_completion || "",
    other_ug_university: other_ug_university || "",
    other_ug_institution: other_ug_institution || "",
    professional_institution_name: institution_name || "",
    professional_department: department || "",
  };
  const validationSchema = Yup.object().shape({
    ug_course: Yup.string().required("UG course is required."),
    ug_department: Yup.string().required("UG Department is required."),
    ug_university: Yup.string().required("UG University is required."),
    ug_institution: Yup.string().required("UG Institution is required."),
    ug_year_of_completion: Yup.string().required(
      "UG year of completion is required."
    ),
    other_ug_university: Yup.lazy((_, obj) => {
      const { ug_university } = obj?.parent;
      if (+ug_university === 581) {
        return Yup.string().required("UG University is required.");
      } else {
        return Yup.string();
      }
    }),
    other_ug_institution: Yup.lazy((_, obj) => {
      const { ug_institution } = obj?.parent;
      if (+ug_institution === 1772) {
        return Yup.string().required("UG Institution is required.");
      } else {
        return Yup.string();
      }
    }),
    // professional_institution_name: Yup.string().required(
    //   "Institution/Organization name is required"
    // ),
    // professional_department: Yup.string().required("Department is required"),
  });
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        if (isEqual(values, initialValues) && +registration_status > 1) {
          setFormType("1");
        } else {
          handelSave(values);
        }
      }}
    >
      {(props) => {
        const { values, errors, handleChange, handleSubmit } = props;
        return (
          <form className="row">
            <div className="text-18-500 color-raisin-black cmb-22 mt-3">
              Academic Details
            </div>
            <div className="mt-2 mb-2">Bachelor Degree/UG Details</div>
            <div className="col-md-6 cmb-22">
              <CourseDropdown
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

            {userDetails?.user_type !== "5" && (
              <>
                <div className="text-18-500 color-raisin-black cmb-30 mt-3">
                  Current Profession Details (Note: This information will be
                  Referred for Your Certification Purpose)
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    placeholder="Institution/Organization Name"
                    id="professional_institution_name"
                    value={values.professional_institution_name}
                    // error={errors.professional_institution_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    placeholder="Department"
                    id="professional_department"
                    value={values.professional_department}
                    onChange={handleChange}
                    // error={errors.professional_department}
                  />
                </div>
              </>
            )}
            <div className="d-flex justify-content-center gap-4 mt-3">
              <Button
                isRounded
                text="Previous"
                btnStyle="light-outline"
                className="cps-30 cpe-34"
                icon={<i className="bi bi-chevron-left me-3" />}
                onClick={() => {
                  setType("personal-details");
                }}
              />
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

export default EducationDetails1;
