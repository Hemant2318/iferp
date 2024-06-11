import * as Yup from "yup";
import moment from "moment";
import { Formik } from "formik";
import { forEach, isEqual } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/form/Button";
import Location from "components/form/Location";
import Dropdown from "components/form/Dropdown";
import CourseDropdown from "components/form/CourseDropdown";
import InstitutionDropdown from "components/form/InstitutionDropdown";
import UniversityDropdown from "components/form/UniversityDropdown";
import TextArea from "components/form/TextArea";
import TextInput from "components/form/TextInput";
import DatePicker from "components/form/DatePicker";
import { handelUserRegisterDetails, editMembership } from "store/slices";
import { objectToFormData, titleCaseString } from "utils/helpers";
import CreatableDropdown from "components/form/CreatableDropdown";
import { unionBy } from "lodash";

const EducationDetails = ({
  userDetails,
  fetchUserData,
  handelSuccess,
  isEdit,
  isReasearchProfile,
  isDirectRegister,
  handleDirectRegister,
  hideReqField,
}) => {
  const memberTypeId = userDetails.user_type;
  const memberType = memberTypeId === "2" ? "professional" : "student";
  const nevigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  // const { departmentList } = useSelector((state) => ({
  //   departmentList: state.global.departmentList,
  // }));

  const reduxData = useSelector((state) => state.global);
  const { allNewTopicList, departmentList } = reduxData || {};

  const {
    id,
    educational_details = {},
    professional_details = {},
    registration_status,
    is_migrated,
  } = userDetails;
  const {
    ug_course,
    ug_department,
    ug_university,
    ug_university_name,
    ug_institution,
    ug_institution_name,
    ug_year_of_completion,
    pg_course,
    pg_department,
    pg_university,
    pg_university_name,
    pg_institution,
    pg_institution_name,
    pg_year_of_completion,
    phd_course,
    phd_department,
    phd_university,
    phd_university_name,
    phd_institution,
    phd_institution_name,
    phd_year_of_completion,
    area_of_interest,
    category,
    comments,
    other_ug_university,
    other_pg_university,
    other_phd_university,
    other_ug_institution,
    other_pg_institution,
    other_phd_institution,
  } = educational_details;
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
  const [areaOfInterest, setAreaOfInterest] = useState({
    existing: unionBy(allNewTopicList, "topics").map((elm) => {
      return {
        id: elm?.topics,
        label: elm?.topics,
      };
    }),
    custom: [],
  });
  const [categoryList, setCategoryList] = useState({
    existing: unionBy(departmentList, "name").map((elm) => {
      return {
        id: elm?.name,
        label: elm?.name,
      };
    }),
    custom: [],
  });

  const handelValue = (value) => {
    return value && value !== "--Not Applicable--" ? value : "";
  };
  const handelSave = async (values) => {
    setBtnLoading(true);
    let forData = objectToFormData({
      ...values,
      type: "2",
      id: id,
    });
    const response = await dispatch(handelUserRegisterDetails(forData));
    if (response?.status === 200) {
      if (is_migrated === "1" && registration_status !== "4") {
        const response = await dispatch(
          editMembership({ id: id, amount: "0" })
        );
        if (response?.status === 200) {
          nevigate(`/${memberType}/dashboard`);
        }
      } else if (isDirectRegister) {
        handleDirectRegister();
      } else {
        const fetchData = await fetchUserData();
        if (fetchData?.status === 200) {
          handelSuccess();
        }
      }
    }
    setBtnLoading(false);
  };
  useEffect(() => {
    if (area_of_interest) {
      const customList = [];
      forEach(area_of_interest.split(","), (elm) => {
        if (!areaOfInterest.existing.find((o) => o.id === elm)) {
          customList.push({
            id: elm,
            label: elm,
          });
        }
      });
      setAreaOfInterest({
        ...areaOfInterest,
        custom: customList,
      });
    }
    if (category) {
      const customList = [];
      forEach(category.split(","), (elm) => {
        if (!categoryList.existing.find((o) => o.id === elm)) {
          customList.push({
            id: elm,
            label: elm,
          });
        }
      });
      setCategoryList({
        ...categoryList,
        custom: customList,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [educational_details]);

  const initialValues = {
    ug_course: handelValue(ug_course) || "",
    ug_department: handelValue(ug_department) || "",
    ug_university: handelValue(ug_university) || "",
    ug_institution: handelValue(ug_institution) || "",
    ug_year_of_completion: handelValue(ug_year_of_completion) || "",
    pg_course: handelValue(pg_course) || "",
    pg_department: handelValue(pg_department) || "",
    pg_university: handelValue(pg_university) || "",
    pg_institution: handelValue(pg_institution) || "",
    pg_year_of_completion: handelValue(pg_year_of_completion) || "",
    phd_course: handelValue(phd_course) || "",
    phd_department: handelValue(phd_department) || "",
    phd_university: handelValue(phd_university) || "",
    phd_institution: handelValue(phd_institution) || "",
    phd_year_of_completion: handelValue(phd_year_of_completion) || "",
    area_of_interest: handelValue(area_of_interest) || "",
    category: handelValue(category) || "",
    comments: handelValue(comments) || "",
    is_volunteer: "0",
    memberTypeId: memberTypeId,
    professional_institution_name: handelValue(institution_name) || "",
    professional_department: handelValue(department) || "",
    professional_designation: handelValue(designation) || "",
    professional_address: handelValue(address) || "",
    professional_country: handelValue(country) || "",
    professional_state: handelValue(state) || "",
    professional_experience: handelValue(professional_experience) || "",
    industry_experience: handelValue(industry_experience) || "",
    other_ug_university: other_ug_university || "",
    other_pg_university: other_pg_university || "",
    other_phd_university: other_phd_university || "",
    other_ug_institution: other_ug_institution || "",
    other_pg_institution: other_pg_institution || "",
    other_phd_institution: other_phd_institution || "",
  };
  const validationSchema = Yup.object().shape({
    // ug_course: Yup.string().required("UG course is required."),
    // ug_department: Yup.string().required("UG Department is required."),
    // ug_university: Yup.string().required("UG University is required."),
    // ug_institution: Yup.string().required("UG Institution is required."),
    // ug_year_of_completion: Yup.string().required(
    //   "UG year of completion is required."
    // ),

    ug_course: Yup.lazy((_, obj) => {
      const {
        ug_university,
        ug_department,
        ug_institution,
        ug_year_of_completion,
      } = obj?.parent;
      if (
        ug_university ||
        ug_department ||
        ug_institution ||
        ug_year_of_completion
      ) {
        return Yup.string().required("UG course is required.");
      } else {
        return Yup.string();
      }
    }),
    ug_department: Yup.lazy((_, obj) => {
      const {
        ug_course,
        ug_university,
        ug_institution,
        ug_year_of_completion,
      } = obj?.parent;
      if (
        ug_course ||
        ug_university ||
        ug_institution ||
        ug_year_of_completion
      ) {
        return Yup.string().required("UG department is required.");
      } else {
        return Yup.string();
      }
    }),
    ug_university: Yup.lazy((_, obj) => {
      const {
        ug_course,
        ug_department,
        ug_institution,
        ug_year_of_completion,
      } = obj?.parent;
      if (
        ug_course ||
        ug_department ||
        ug_institution ||
        ug_year_of_completion
      ) {
        return Yup.string().required("UG university is required.");
      } else {
        return Yup.string();
      }
    }),
    ug_institution: Yup.lazy((_, obj) => {
      const { ug_course, ug_department, ug_university, ug_year_of_completion } =
        obj?.parent;
      if (
        ug_course ||
        ug_department ||
        ug_university ||
        ug_year_of_completion
      ) {
        return Yup.string().required("UG institution is required.");
      } else {
        return Yup.string();
      }
    }),
    ug_year_of_completion: Yup.lazy((_, obj) => {
      const { ug_course, ug_department, ug_university, ug_institution } =
        obj?.parent;
      if (ug_course || ug_department || ug_university || ug_institution) {
        return Yup.string().required("UG year of completion is required");
      } else {
        return Yup.string();
      }
    }),

    pg_course: Yup.lazy((_, obj) => {
      const {
        pg_department,
        pg_university,
        pg_year_of_completion,
        pg_institution,
        phd_course,
        phd_department,
        phd_university,
        phd_year_of_completion,
        phd_institution,
      } = obj?.parent;
      if (
        pg_department ||
        pg_university ||
        pg_year_of_completion ||
        pg_institution ||
        phd_course ||
        phd_department ||
        phd_university ||
        phd_year_of_completion ||
        phd_institution
      ) {
        return Yup.string().required("PG course is required.");
      } else {
        return Yup.string();
      }
    }),
    pg_department: Yup.lazy((_, obj) => {
      const {
        pg_course,
        pg_university,
        pg_year_of_completion,
        pg_institution,
        phd_course,
        phd_department,
        phd_university,
        phd_year_of_completion,
        phd_institution,
      } = obj?.parent;
      if (
        pg_course ||
        pg_university ||
        pg_year_of_completion ||
        pg_institution ||
        phd_course ||
        phd_department ||
        phd_university ||
        phd_year_of_completion ||
        phd_institution
      ) {
        return Yup.string().required("PG department is required.");
      } else {
        return Yup.string();
      }
    }),
    pg_university: Yup.lazy((_, obj) => {
      const {
        pg_department,
        pg_course,
        pg_year_of_completion,
        phd_course,
        phd_department,
        phd_university,
        phd_year_of_completion,
        phd_institution,
      } = obj?.parent;
      if (
        pg_department ||
        pg_course ||
        pg_year_of_completion ||
        phd_course ||
        phd_department ||
        phd_university ||
        phd_year_of_completion ||
        phd_institution
      ) {
        return Yup.string().required("PG university is required.");
      } else {
        return Yup.string();
      }
    }),
    pg_institution: Yup.lazy((_, obj) => {
      const {
        pg_department,
        pg_course,
        pg_year_of_completion,
        pg_university,
        phd_course,
        phd_department,
        phd_university,
        phd_year_of_completion,
        phd_institution,
      } = obj?.parent;
      if (
        pg_department ||
        pg_course ||
        pg_year_of_completion ||
        pg_university ||
        phd_course ||
        phd_department ||
        phd_university ||
        phd_year_of_completion ||
        phd_institution
      ) {
        return Yup.string().required("PG institution is required.");
      } else {
        return Yup.string();
      }
    }),
    pg_year_of_completion: Yup.lazy((_, obj) => {
      const {
        pg_course,
        pg_university,
        pg_department,
        pg_institution,
        phd_course,
        phd_department,
        phd_university,
        phd_year_of_completion,
        phd_institution,
      } = obj?.parent;
      if (
        pg_course ||
        pg_university ||
        pg_department ||
        pg_institution ||
        phd_course ||
        phd_department ||
        phd_university ||
        phd_year_of_completion ||
        phd_institution
      ) {
        return Yup.string().required("PG year of completion is required.");
      } else {
        return Yup.string();
      }
    }),

    phd_course: Yup.lazy((_, obj) => {
      const {
        phd_department,
        phd_university,
        phd_year_of_completion,
        phd_institution,
      } = obj?.parent;
      if (
        phd_department ||
        phd_university ||
        phd_year_of_completion ||
        phd_institution
      ) {
        return Yup.string().required("PHD course is required.");
      } else {
        return Yup.string();
      }
    }),
    phd_department: Yup.lazy((_, obj) => {
      const {
        phd_course,
        phd_university,
        phd_year_of_completion,
        phd_institution,
      } = obj?.parent;
      if (
        phd_course ||
        phd_university ||
        phd_year_of_completion ||
        phd_institution
      ) {
        return Yup.string().required("PHD department is required.");
      } else {
        return Yup.string();
      }
    }),
    phd_university: Yup.lazy((_, obj) => {
      const {
        phd_department,
        phd_course,
        phd_year_of_completion,
        phd_institution,
      } = obj?.parent;
      if (
        phd_department ||
        phd_course ||
        phd_year_of_completion ||
        phd_institution
      ) {
        return Yup.string().required("PHD university is required.");
      } else {
        return Yup.string();
      }
    }),
    phd_institution: Yup.lazy((_, obj) => {
      const {
        phd_department,
        phd_course,
        phd_year_of_completion,
        phd_university,
      } = obj?.parent;
      if (
        phd_department ||
        phd_course ||
        phd_year_of_completion ||
        phd_university
      ) {
        return Yup.string().required("PHD institution is required.");
      } else {
        return Yup.string();
      }
    }),
    phd_year_of_completion: Yup.lazy((_, obj) => {
      const { phd_course, phd_university, phd_department, phd_institution } =
        obj?.parent;
      if (phd_course || phd_university || phd_department || phd_institution) {
        return Yup.string().required("PHD year of completion is required.");
      } else {
        return Yup.string();
      }
    }),
    memberTypeId: Yup.string("2"),
    // professional_institution_name: Yup.string().when("memberTypeId", {
    //   is: "2",
    //   then: Yup.string().required("Institution/Organization name is required"),
    // }),
    // professional_designation: Yup.string().when("memberTypeId", {
    //   is: "2",
    //   then: Yup.string().required("Designation is required"),
    // }),
    // professional_address: Yup.string().when("memberTypeId", {
    //   is: "2",
    //   then: Yup.string().required("Address is required"),
    // }),
    comments: Yup.string().max(
      100,
      "Maximum 100 character allow for this field."
    ),
    other_ug_university: Yup.lazy((_, obj) => {
      const { ug_university } = obj?.parent;
      if (+ug_university === 581) {
        return Yup.string().required("UG University is required.");
      } else {
        return Yup.string();
      }
    }),
    other_pg_university: Yup.lazy((_, obj) => {
      const { pg_university } = obj?.parent;
      if (+pg_university === 581) {
        return Yup.string().required("PG University is required.");
      } else {
        return Yup.string();
      }
    }),
    other_phd_university: Yup.lazy((_, obj) => {
      const { phd_university } = obj?.parent;
      if (+phd_university === 581) {
        return Yup.string().required("PHD University is required.");
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
    other_pg_institution: Yup.lazy((_, obj) => {
      const { pg_institution } = obj?.parent;
      if (+pg_institution === 1772) {
        return Yup.string().required("PG Institution is required.");
      } else {
        return Yup.string();
      }
    }),
    other_phd_institution: Yup.lazy((_, obj) => {
      const { phd_institution } = obj?.parent;
      if (+phd_institution === 1772) {
        return Yup.string().required("PHD Institution is required.");
      } else {
        return Yup.string();
      }
    }),
  });
  return (
    <>
      <div className="text-18-500 color-raisin-black cmb-22">
        Academic Details
      </div>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          if (isEqual(values, initialValues) && +registration_status > 1) {
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
                {!hideReqField && (
                  <>
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
                    <div className="col-md-6" />
                  </>
                )}
                <div className="mb-2 mt-2">Master Degree/PG Details</div>
                <div className="col-md-6 cmb-22">
                  <CourseDropdown
                    isClearable
                    id="pg_course"
                    courseType="pg"
                    value={values.pg_course}
                    error={errors.pg_course}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <Dropdown
                    isClearable
                    id="pg_department"
                    optionValue="name"
                    onChange={handleChange}
                    options={unionBy(departmentList, "name")}
                    value={values.pg_department}
                    error={errors.pg_department}
                    disabled={!values.pg_course}
                    placeholder="Select Department"
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <UniversityDropdown
                    isClearable
                    id="pg_university"
                    onChange={handleChange}
                    value={values.pg_university}
                    error={errors.pg_university}
                    existingList={
                      pg_university
                        ? [
                            {
                              id: +pg_university,
                              name: pg_university_name,
                            },
                          ]
                        : []
                    }
                  />
                </div>
                {+values?.pg_university === 581 && (
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="ie. Example University, Country"
                      id="other_pg_university"
                      value={values.other_pg_university}
                      error={errors.other_pg_university}
                      onChange={handleChange}
                    />
                  </div>
                )}
                <div className="col-md-6 cmb-22">
                  <InstitutionDropdown
                    isClearable
                    id="pg_institution"
                    onChange={handleChange}
                    value={values.pg_institution}
                    error={errors.pg_institution}
                    existingList={
                      pg_institution
                        ? [
                            {
                              id: +pg_institution,
                              name: pg_institution_name,
                            },
                          ]
                        : []
                    }
                  />
                </div>
                {+values?.pg_institution === 1772 && (
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="ie. Example Institution, Country"
                      id="other_pg_institution"
                      value={values.other_pg_institution}
                      error={errors.other_pg_institution}
                      onChange={handleChange}
                    />
                  </div>
                )}
                <div className="col-md-6 cmb-22">
                  <DatePicker
                    isClearable
                    placeholder="Year of Completion"
                    id="pg_year_of_completion"
                    onChange={handleChange}
                    value={values.pg_year_of_completion}
                    error={errors.pg_year_of_completion}
                    maxDate={moment()}
                  />
                </div>
                <div className="col-md-6" />
                <div className="mb-2 mt-2">
                  Doctorate/Ph.D Programme Details
                </div>
                <div className="col-md-6 cmb-22">
                  <CourseDropdown
                    isClearable
                    id="phd_course"
                    courseType="phd"
                    value={values.phd_course}
                    error={errors.phd_course}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <Dropdown
                    isClearable
                    optionValue="name"
                    id="phd_department"
                    onChange={handleChange}
                    options={unionBy(departmentList, "name")}
                    value={values.phd_department}
                    error={errors.phd_department}
                    placeholder="Select Department"
                    disabled={!values.phd_course}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <UniversityDropdown
                    isClearable
                    id="phd_university"
                    onChange={handleChange}
                    value={values.phd_university}
                    error={errors.phd_university}
                    existingList={
                      phd_university
                        ? [
                            {
                              id: +phd_university,
                              name: phd_university_name,
                            },
                          ]
                        : []
                    }
                  />
                </div>
                {+values?.phd_university === 581 && (
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="ie. Example University, Country"
                      id="other_phd_university"
                      value={values.other_phd_university}
                      error={errors.other_phd_university}
                      onChange={handleChange}
                    />
                  </div>
                )}
                <div className="col-md-6 cmb-22">
                  <InstitutionDropdown
                    isClearable
                    id="phd_institution"
                    onChange={handleChange}
                    value={values.phd_institution}
                    error={errors.phd_institution}
                    existingList={
                      phd_institution
                        ? [
                            {
                              id: +phd_institution,
                              name: phd_institution_name,
                            },
                          ]
                        : []
                    }
                  />
                </div>
                {+values?.phd_institution === 1772 && (
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="ie. Example Institution, Country"
                      id="other_phd_institution"
                      value={values.other_phd_institution}
                      error={errors.other_phd_institution}
                      onChange={handleChange}
                    />
                  </div>
                )}
                <div className="col-md-6 cmb-22">
                  <DatePicker
                    isClearable
                    placeholder="Year of Completion"
                    id="phd_year_of_completion"
                    onChange={handleChange}
                    value={values.phd_year_of_completion}
                    error={errors.phd_year_of_completion}
                    maxDate={moment()}
                  />
                </div>
                {!isReasearchProfile && (
                  <>
                    <div className="col-md-6" />
                    {memberTypeId === "2" && (
                      <>
                        <div className="text-18-500 color-raisin-black cmb-22 mt-3">
                          Current Profession Details (Note: This information
                          will be Referred for Your Certification Purpose)
                        </div>
                        {!hideReqField && (
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
                        )}

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

                    <div className="text-18-500 color-raisin-black cmb-22 mt-3">
                      Research Interests
                    </div>
                    <div className="cmb-22">
                      <CreatableDropdown
                        placeholder="Select area of interest"
                        options={[
                          ...areaOfInterest.existing,
                          ...areaOfInterest.custom,
                        ]}
                        id="area_of_interest"
                        value={values.area_of_interest}
                        error={errors.area_of_interest}
                        onChange={handleChange}
                        onCreateOption={(e) => {
                          let strToArray = values.area_of_interest
                            ? values.area_of_interest.split(",")
                            : [];
                          strToArray.push(e);
                          setAreaOfInterest({
                            ...areaOfInterest,
                            custom: [
                              ...areaOfInterest.custom,
                              { id: e, label: e },
                            ],
                          });
                          handleChange({
                            target: {
                              id: "area_of_interest",
                              value: strToArray.join(","),
                            },
                          });
                        }}
                      />
                    </div>
                    {!isEdit && (
                      <div className="cmb-22">
                        <CreatableDropdown
                          placeholder="Select category"
                          options={[
                            ...categoryList.existing,
                            ...categoryList.custom,
                          ]}
                          id="category"
                          value={values.category}
                          error={errors.category}
                          onChange={handleChange}
                          onCreateOption={(e) => {
                            let strToArray = values.category
                              ? values.category.split(",")
                              : [];
                            strToArray.push(e);
                            setCategoryList({
                              ...categoryList,
                              custom: [
                                ...categoryList.custom,
                                { id: e, label: e },
                              ],
                            });
                            handleChange({
                              target: {
                                id: "category",
                                value: strToArray.join(","),
                              },
                            });
                          }}
                        />
                      </div>
                    )}
                    <div className="cmb-22">
                      <TextArea
                        rows={3}
                        placeholder="Comments if any"
                        id="comments"
                        onChange={handleChange}
                        value={values.comments}
                        error={errors.comments}
                      />
                    </div>
                  </>
                )}

                {isEdit ? (
                  <div className="d-flex justify-content-center gap-4 mt-3">
                    <Button
                      isRounded
                      text="Reset"
                      btnStyle="light-outline"
                      className="cps-40 cpe-40"
                      onClick={resetForm}
                    />
                    <Button
                      isRounded
                      text="Submit"
                      btnStyle="primary-dark"
                      className="cps-40 cpe-40"
                      onClick={handleSubmit}
                      btnLoading={btnLoading}
                    />
                  </div>
                ) : (
                  <div className="d-flex justify-content-center gap-4 mt-3">
                    <Button
                      isRounded
                      text="Previous"
                      btnStyle="light-outline"
                      className="cps-30 cpe-34"
                      icon={<i className="bi bi-chevron-left me-3" />}
                      onClick={() => {
                        nevigate(
                          `/${memberType}/register/${params.userId}/personal-details`
                        );
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
                )}
              </div>
            </form>
          );
        }}
      </Formik>
    </>
  );
};
export default EducationDetails;
