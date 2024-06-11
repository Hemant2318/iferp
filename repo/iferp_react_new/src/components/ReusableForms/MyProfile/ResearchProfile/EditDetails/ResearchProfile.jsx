import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import { cloneDeep, isEqual, lowerCase, omit } from "lodash";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import Location from "components/form/Location";
import Dropdown from "components/form/Dropdown";
import { getUniversity, editResearchProfile, fetchProfile } from "store/slices";
import { objectToFormData } from "utils/helpers";
import RequestChange from "components/Layout/RequestChange";
import { limit } from "utils/constants";

const ResearchProfile = ({ onHide, getProfileData }) => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => ({
    userDetails: state.student.userDetails,
  }));
  const {
    first_name,
    last_name,
    user_type,
    personal_details = {},
    educational_details = {},
    professional_details = {},
  } = userDetails;
  const { country, state } = personal_details;
  const { designation, institution_name } = professional_details;
  const { ug_university, pg_university, phd_university } = educational_details;
  const [btnLoading, setBtnLoading] = useState(false);
  const [universityData, setUniversityData] = useState({
    list: [],
    newList: [],
    name: "",
    total: 0,
    offset: 0,
    limit: limit,
    isLoading: true,
  });
  const [uTimer, setUTimer] = useState("");
  const handelSave = async (values) => {
    setBtnLoading(true);
    const payload = objectToFormData(values);
    const response = await dispatch(editResearchProfile(payload));
    if (response?.status === 200) {
      dispatch(fetchProfile());
      getProfileData();
      onHide();
    }
    setBtnLoading(false);
  };
  const handleSearchUniversity = (e) => {
    let time = uTimer;
    clearTimeout(time);
    time = setTimeout(() => {
      let oldData = cloneDeep({
        ...universityData,
        offset: 0,
        name: lowerCase(e),
        isLoading: true,
      });
      setUniversityData(oldData);
      fetchUniversityList(oldData, true);
    }, 800);
    setUTimer(time);
  };
  const handelUniversityScroll = () => {
    if (universityData.list.length < universityData.total) {
      let oldData = cloneDeep({
        ...universityData,
        offset: universityData.offset + limit,
        isLoading: true,
      });
      setUniversityData(oldData);
      fetchUniversityList(oldData);
    }
  };
  const fetchUniversityList = async (obj, isReset) => {
    const queryParams = new URLSearchParams(
      omit(obj, ["list", "newList", "total", "isLoading"])
    ).toString();
    let response = await dispatch(getUniversity(queryParams));
    setUniversityData((prev) => {
      let resData = response?.data?.universities || [];
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
    fetchUniversityList(universityData, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const universityID = phd_university || pg_university || ug_university;
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required."),
    last_name: Yup.string().required("Last name is required."),
    university_id: Yup.string().required("University is required."),
    country_id: Yup.string().required("Country is required."),
    state_id: Yup.string().required("State/Province is required."),
    professional_institution_name: Yup.lazy(() => {
      if (user_type === "2") {
        return Yup.string().required(
          "Institution/Organization name is required."
        );
      } else {
        return Yup.string();
      }
    }),
    // designation: Yup.lazy(() => {
    //   if (user_type === "2") {
    //     return Yup.string().required("Designation is required.");
    //   } else {
    //     return Yup.string();
    //   }
    // }),
  });
  const initialValues = {
    first_name: first_name || "",
    last_name: last_name || "",
    designation: designation || "",
    university_id: universityID || "",
    country_id: country || "",
    state_id: state || "",
    professional_institution_name: institution_name || "",
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
            <div className="cmb-22 d-flex justify-content-end">
              <RequestChange afterRedirect={onHide} />
            </div>
            <div className="row">
              <div className="cmb-22">
                <TextInput
                  label="First Name*"
                  placeholder="Enter First Name"
                  onChange={handleChange}
                  value={values.first_name}
                  error={errors.first_name}
                  id="first_name"
                  disabled
                />
              </div>
              <div className="cmb-22">
                <TextInput
                  label="Last Name*"
                  placeholder="Enter Last Name"
                  id="last_name"
                  value={values.last_name}
                  error={errors.last_name}
                  onChange={handleChange}
                  disabled
                />
              </div>
              {user_type === "2" && (
                <div className="cmb-22">
                  <TextInput
                    label="Institution/Organization Name*"
                    placeholder="Enter institution or Organization"
                    id="professional_institution_name"
                    value={values.professional_institution_name}
                    onChange={handleChange}
                    error={errors.professional_institution_name}
                  />
                </div>
              )}
              {user_type === "2" && (
                <div className="cmb-22">
                  <TextInput
                    label="Designation"
                    placeholder="Enter Designation"
                    id="designation"
                    value={values.designation}
                    error={errors.designation}
                    onChange={handleChange}
                  />
                </div>
              )}
              <div className="cmb-22">
                <Dropdown
                  isClearable
                  label="University*"
                  placeholder="Select University"
                  options={universityData?.list}
                  optionValue="name"
                  id="university_id"
                  value={values.university_id}
                  error={errors.university_id}
                  isLoading={universityData.isLoading}
                  onChange={handleChange}
                  onInputChange={handleSearchUniversity}
                  onMenuScrollToBottom={handelUniversityScroll}
                />
              </div>
              <div className="cmb-22">
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
              <div>
                <Location
                  type="state"
                  data={{
                    id: "state_id",
                    label: "State/Province*",
                    placeholder: "Select State/Province",
                    value: values.state_id,
                    error: errors.state_id,
                    countryId: +values.country_id,
                    disabled: !values.country_id,
                    onChange: handleChange,
                  }}
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
export default ResearchProfile;
