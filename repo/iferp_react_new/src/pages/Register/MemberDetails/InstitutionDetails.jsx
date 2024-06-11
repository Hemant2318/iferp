import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { cloneDeep, isEqual, lowerCase, omit, unionBy } from "lodash";
import Location from "components/form/Location";
import MultipleSelect from "components/form/MultipleSelect";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import {
  getDataFromLocalStorage,
  getFilenameFromUrl,
  objectToFormData,
} from "utils/helpers";
import {
  fetchProfile,
  getInstitutions,
  handelUserRegisterDetails,
} from "store/slices";
import FileUpload from "components/form/FileUpload";
import { limit } from "utils/constants";
import Dropdown from "components/form/Dropdown";
import CreatableCityDropDown from "components/form/CreatableCityDropDown";

const InstitutionDetails = ({
  userDetails,
  fetchUserData,
  handelSuccess,
  isEdit,
}) => {
  const dispatch = useDispatch();
  const { departmentList } = useSelector((state) => ({
    departmentList: state.global.departmentList,
  }));
  const { id, profile_photo_path, institution_details = {} } = userDetails;
  const {
    institution_id,
    institution_name,
    institution_email_id,
    institution_contact_number,
    premium_ug_students_strength,
    premium_professional_members_count,
    state,
    country,
    city,
    premium_student_members_count,
    premium_pg_students_strength,
    premium_research_scholars_strength,
    institution_departments,
    institution_strength,
  } = institution_details;
  const [btnLoading, setBtnLoading] = useState(false);
  const [timer, setTimer] = useState("");
  const [instituteData, setInstituteData] = useState({
    list: [],
    newList: [],
    name: "",
    total: 0,
    offset: 0,
    limit: limit,
    isLoading: true,
    only_unassigned: 1,
  });
  const handelSave = async (values) => {
    setBtnLoading(true);

    let forData = objectToFormData({
      ...values,
      institution_city:
        values?.institution_city === "586"
          ? values?.other_city
          : +values?.institution_city,
      institution_country: +values?.institution_country,
      institution_state: +values?.institution_state,
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
  const handleSearchInstitution = (e) => {
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      let oldData = cloneDeep({
        ...instituteData,
        offset: 0,
        name: lowerCase(e),
        isLoading: true,
      });
      setInstituteData(oldData);
      fetchInstitutionList(oldData, true);
    }, 800);
    setTimer(time);
  };
  const handelInstitutionScroll = () => {
    if (instituteData.list.length < instituteData.total) {
      let oldData = cloneDeep({
        ...instituteData,
        offset: instituteData.offset + limit,
        isLoading: true,
      });
      setInstituteData(oldData);
      fetchInstitutionList(oldData);
    }
  };
  const fetchInstitutionList = async (obj, isReset) => {
    let payload = objectToFormData(
      omit({ ...obj, id: getDataFromLocalStorage("id") }, [
        "list",
        "newList",
        "total",
        "isLoading",
      ])
    );
    const response = await dispatch(getInstitutions(payload));
    setInstituteData((prev) => {
      let resData = response?.data?.institutions || [];
      let listData = isReset ? resData : [...prev.list, ...resData];
      return {
        ...prev,
        list: listData,
        total: response?.data?.result_count || 0,
        isLoading: false,
      };
    });
  };

  useEffect(() => {
    fetchInstitutionList(instituteData, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialValues = {
    institution_name: institution_id || "",
    institution_email_id: institution_email_id || "",
    institution_contact_number: institution_contact_number || "",
    institution_country: country || "",
    institution_state: state || "",
    institution_city: city || "",
    country_name: "",
    state_name: "",
    other_city: "",
    premium_student_members_count: premium_student_members_count || "",
    premium_professional_members_count:
      premium_professional_members_count || "",
    premium_ug_students_strength: premium_ug_students_strength || "",
    premium_pg_students_strength: premium_pg_students_strength || "",
    premium_research_scholars_strength:
      premium_research_scholars_strength || "",
    institution_departments: institution_departments || "",
    institution_strength: institution_strength || "",
    profile_photo_path: profile_photo_path || "",
    profilePhotoPathName: "",
  };
  const validationSchema = Yup.object().shape({
    institution_name: Yup.string().required("First name is required."),
    institution_email_id: Yup.string()
      .required("Email is required.")
      .email("Email must be a valid email"),
    institution_contact_number: Yup.string()
      .required("Phone number is required.")
      .min(10, "Phone number must be 10 digit.")
      .max(10, "Phone number must be 10 digit."),
    institution_country: Yup.string().required("Country is required."),
    institution_state: Yup.string().required("State/Province is required."),
    institution_city: Yup.string().required("City is required."),
    other_city: Yup.lazy((_, o) => {
      const { institution_city } = o?.parent;
      if (institution_city === "586") {
        return Yup.string().required("Please enter Other city name.");
      } else {
        return Yup.string();
      }
    }),
    profile_photo_path: Yup.string().required("profile photo is required."),

    premium_student_members_count: Yup.string()
      .required("Premium student members count is required.")
      .matches(
        /^\d*$/,
        "Only numbers are allowed for IFERP premium student members"
      ),

    premium_professional_members_count: Yup.string()
      .required("Premium professional members count is required.")
      .matches(
        /^\d*$/,
        "Only numbers are allowed for IFERP premium professional members"
      ),

    premium_ug_students_strength: Yup.string()
      .required("Premium UG student strength is required.")
      .matches(
        /^\d*$/,
        "Only numbers are allowed for strength of premium U.G. students"
      ),

    premium_pg_students_strength: Yup.string()
      .required("Premium PG student strength is required.")
      .matches(
        /^\d*$/,
        "Only numbers are allowed for strength of premium P.G. students"
      ),

    premium_research_scholars_strength: Yup.string()
      .required("Premium research scholars strength is required.")
      .matches(
        /^\d*$/,
        "Only numbers are allowed for strength of premium research scholars"
      ),

    institution_strength: Yup.string()
      .required("Institution strength is required.")
      .matches(/^\d*$/, "Only numbers are allowed for strength of institution"),

    institution_departments: Yup.string().required(
      "Institution departments is required."
    ),
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
                <Dropdown
                  isClearable
                  placeholder="Select Institution"
                  options={unionBy(
                    institution_id && [
                      { id: institution_id, name: institution_name },
                    ],
                    instituteData?.newList,
                    instituteData?.list,
                    "id"
                  )}
                  optionValue="name"
                  optionKey="id"
                  id="institution_name"
                  value={values.institution_name}
                  error={errors.institution_name}
                  isLoading={instituteData.isLoading}
                  onChange={(e) => {
                    if (e.target.value) {
                      setInstituteData((prev) => {
                        let newDataList = prev.newList;
                        newDataList = newDataList.filter(
                          (o) => o !== e.target.id
                        );
                        newDataList.push(e?.target?.data);
                        return { ...prev, newList: newDataList };
                      });
                    }
                    handleChange(e);
                  }}
                  onInputChange={handleSearchInstitution}
                  onMenuScrollToBottom={handelInstitutionScroll}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Institution Email Id*"
                  id="institution_email_id"
                  value={values.institution_email_id}
                  onChange={handleChange}
                  error={errors.institution_email_id}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Institution Contact Number*"
                  id="institution_contact_number"
                  value={values.institution_contact_number}
                  onChange={handleChange}
                  error={errors.institution_contact_number}
                />
              </div>

              <div className="col-md-6 cmb-22">
                <Location
                  type="country"
                  data={{
                    id: "institution_country",
                    placeholder: "Country*",
                    value: values.institution_country,
                    error: errors.institution_country,
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
                    id: "institution_state",
                    placeholder: "State/Province*",
                    value: values.institution_state,
                    error: errors.institution_state,
                    countryId: values.institution_country,
                    disabled: !values.institution_country,
                    onChange: (e) => {
                      setFieldValue("state_name", e?.target?.data?.state);
                      handleChange(e);
                    },
                  }}
                />
              </div>
              <div className="col-md-6 cmb-22">
                {/* <Location
                  type="city"
                  data={{
                    id: "institution_city",
                    placeholder: "City",
                    value: values.institution_city,
                    error: errors.institution_city,
                    countryId: values.institution_country,
                    stateId: values.institution_state,
                    disabled: !values.institution_state,
                    onChange: handleChange,
                  }}
                /> */}
                <CreatableCityDropDown
                  id="institution_city"
                  disabled={!values?.institution_state}
                  onChange={handleChange}
                  value={values?.institution_city}
                  error={errors?.institution_city}
                  countryId={values?.country_name}
                  stateId={values?.state_name}
                  isClearable
                />
              </div>
              {+values?.institution_city === 586 && (
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
                  placeholder="No. of IFERP Premium Student Members"
                  id="premium_student_members_count"
                  value={values.premium_student_members_count}
                  onChange={handleChange}
                  error={errors.premium_student_members_count}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="No. of IFERP Premium Professional Members"
                  id="premium_professional_members_count"
                  value={values.premium_professional_members_count}
                  onChange={handleChange}
                  error={errors.premium_professional_members_count}
                />
              </div>

              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Strength of Premium U.G. Students"
                  id="premium_ug_students_strength"
                  value={values.premium_ug_students_strength}
                  onChange={handleChange}
                  error={errors.premium_ug_students_strength}
                />
              </div>

              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Strength of Premium P.G. Students"
                  id="premium_pg_students_strength"
                  value={values.premium_pg_students_strength}
                  onChange={handleChange}
                  error={errors.premium_pg_students_strength}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Strength of Premium Research Scholars"
                  id="premium_research_scholars_strength"
                  value={values.premium_research_scholars_strength}
                  onChange={handleChange}
                  error={errors.premium_research_scholars_strength}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Strength of Institution"
                  id="institution_strength"
                  value={values.institution_strength}
                  onChange={handleChange}
                  error={errors.institution_strength}
                />
              </div>
              <div className="cmb-22">
                <MultipleSelect
                  placeholder="Select the Departments of your organization"
                  id="institution_departments"
                  value={values.institution_departments}
                  error={errors.institution_departments}
                  onChange={handleChange}
                  optionValue="name"
                  options={departmentList}
                  // options={[
                  //   { id: "ECE" },
                  //   { id: "CSE" },
                  //   { id: "EEE" },
                  //   { id: "Mechanical" },
                  //   { id: "Bio Technology" },
                  //   { id: "IT" },
                  //   { id: "CIVIL" },
                  //   { id: "Chemical Engineering" },
                  //   { id: "Instrumentation Engineering" },
                  // ]}
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
export default InstitutionDetails;
