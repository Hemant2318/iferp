import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import DatePicker from "components/form/DatePicker";
import Dropdown from "components/form/Dropdown";
import Location from "components/form/Location";
import FileUpload from "components/form/FileUpload";
import {
  convertString,
  getDataFromLocalStorage,
  getFilenameFromUrl,
  getUserType,
  numberOnlyFromInput,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import {
  editMembership,
  fetchUserDetails,
  speakerRegistration,
} from "store/slices";
import { useDispatch, useSelector } from "react-redux";
import Modal from "components/Layout/Modal";
import CreatableCityDropDown from "components/form/CreatableCityDropDown";
import CreatableDropdown from "components/form/CreatableDropdown";
import { forEach, unionBy } from "lodash";
import { useNavigate } from "react-router-dom";
function ProfessionalMemberReg(props) {
  // const { country_code, email, first_name, last_name, phone_number } =
  //   speakeRegisterData;

  const dispatch = useDispatch();
  const userType = getUserType();

  const [btnLoading, setBtnLoading] = useState(false);
  const [speakerUserDetails, setSpeakerUserDetails] = useState({});
  const details = getDataFromLocalStorage();
  const { departmentList } = useSelector((state) => ({
    departmentList: state.global.departmentList,
  }));
  const [areaOfInterest, setAreaOfInterest] = useState({
    existing: [],
    custom: [],
  });
  const navigate = useNavigate();
  const [categoryList, setCategoryList] = useState({
    existing: [],
    custom: [],
  });
  const fetchUserData = async () => {
    const response = await dispatch(fetchUserDetails());
    let newData = {};
    if (response?.data) {
      newData = response?.data;
    }
    setSpeakerUserDetails(newData);
    return response;
  };
  const {
    id,
    country_code,
    email_id,
    first_name,
    last_name,
    phone_number,
    area_of_interest,
    category,
    spekaer_id,
  } = speakerUserDetails;
  const isNational = details?.country === "India";
  const initialValues = {
    first_name: first_name || "",
    last_name: last_name || "",
    email: email_id || "",
    phone_number: phone_number || "",
    date_of_birth: "",
    gender: "",
    country: country_code || "",
    state: "",
    city: "",
    other_city: "",
    profile_photo: "",
    profilePhotoPathName: "",
    institution_name: "",
    institution_departments: "",
    country_code: "IN",
    area_interest: "",
    category: "",
    order_id: "",
    payment_id: "",
    payment_method: isNational ? "INR" : "USD",
    amount: 0,
    membership_plan_id: "2",
    id: details?.id,
  };
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required."),
    last_name: Yup.string().required("Last name is required."),
    institution_name: Yup.string().required("Organization Name is required."),
    institution_departments: Yup.string().required("Departments is required."),
    email: Yup.string()
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
    city: Yup.string().required("City is required."),
    profile_photo: Yup.string().required("profile photo is required."),
  });

  const handelSave = async (values) => {
    setBtnLoading(true);
    let formData = objectToFormData({
      ...values,
      type: "2",
      user_id: id,
      membership_plan_id: "2",
    });
    const response = await dispatch(speakerRegistration(formData));
    if (response?.status === 200) {
      handelPay(values);
    }
    // if (formRef.current) {
    //     formRef.current.resetForm();
    //   }
    setBtnLoading(false);
  };
  useEffect(() => {
    if (departmentList?.length > 0) {
      setAreaOfInterest({
        existing: unionBy([...departmentList], "name")?.map((elm) => {
          return {
            id: elm?.name,
            label: elm?.name,
          };
        }),
        custom: [],
      });
      setCategoryList({
        existing: unionBy(departmentList, "name")?.map((elm) => {
          return {
            id: elm?.name,
            label: elm?.name,
          };
        }),
        custom: [],
      });
    }
  }, [departmentList]);
  useEffect(() => {
    if (area_of_interest) {
      const customList = [];
      forEach(area_of_interest?.split(","), (elm) => {
        if (!areaOfInterest?.existing?.find((o) => o.id === elm)) {
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
      forEach(category?.split(","), (elm) => {
        if (!categoryList.existing?.find((o) => o.id === elm)) {
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
  }, [area_of_interest, category]);

  const handelPay = async (paymentData) => {
    let formData = objectToFormData(paymentData);
    const response = await dispatch(editMembership(formData));
    if (response?.status === 200) {
      navigate(
        `/${userType}/career-support/applied-career-support/keynote-speaker/invitation-received/${spekaer_id}`
      );
      window.location.reload();
    }
    setBtnLoading(false);
  };
  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <Modal size="lg" width="1000px" className="register-popup" hideClose>
        <div id="popup-register-container">
          <div className="text-24-600 color-raisin-black text-center mb-3">
            Professional Member Registration
          </div>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              handelSave(values);
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
                <form className="row mx-4">
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="First Name*"
                      id="first_name"
                      value={values.first_name}
                      error={errors.first_name}
                      // disabled={isEdit}
                      onChange={(e) => {
                        setFieldValue(
                          "first_name",
                          titleCaseString(e.target.value)
                        );
                      }}
                      disabled
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
                        setFieldValue(
                          "last_name",
                          titleCaseString(e.target.value)
                        );
                      }}
                    />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      isPhoneNumber
                      placeholder="Phone Number*"
                      id="phone_number"
                      disabled
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
                      id="email"
                      disabled
                      value={values.email}
                      onChange={(e) => {
                        handleChange(convertString(1, e));
                      }}
                      error={errors.email}
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
                        onChange: handleChange,
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
                        onChange: handleChange,
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
                      countryId={values?.country}
                      stateId={values?.state}
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
                      id="profile_photo"
                      onChange={(e) => {
                        const id = e.target.id;
                        const value = e.target.value;
                        const fileName = e.target.fileName;
                        setFieldValue("profilePhotoPathName", fileName);
                        setFieldValue(id, value);
                      }}
                      fileText={
                        getFilenameFromUrl(
                          values.profilePhotoPathName || values.profile_photo
                        ) || "Profile Photo*"
                      }
                      fileType="image"
                      error={errors.profile_photo}
                    />
                  </div>
                  <p className="fw-bold">
                    Current Profession Details (Note: This information will be
                    Referred for Your Certification Purpose)
                  </p>
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="Institution/Organization Name*"
                      id="institution_name"
                      value={values.institution_name}
                      error={errors.institution_name}
                      // disabled={isEdit}
                      onChange={(e) => {
                        setFieldValue(
                          "institution_name",
                          titleCaseString(e.target.value)
                        );
                      }}
                    />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <TextInput
                      placeholder="Department*"
                      id="institution_departments"
                      value={values.institution_departments}
                      // disabled={isEdit}
                      error={errors.institution_departments}
                      onChange={(e) => {
                        setFieldValue(
                          "institution_departments",
                          titleCaseString(e.target.value)
                        );
                      }}
                    />
                  </div>
                  <p className="fw-bold">Research Interests</p>
                  {/* <div className="col-md-12 cmb-22">
                    <Dropdown
                      placeholder="Select area of interest"
                      options={[{ id: "computer", label: "Computer" }]}
                      id="area_interest"
                      value={values.area_interest}
                      onChange={handleChange}
                      error={errors.area_interest}
                    />
                  </div> */}
                  <div className="col-md-12 cmb-22">
                    <CreatableDropdown
                      placeholder="Select area of interest"
                      options={[
                        ...areaOfInterest?.existing,
                        ...areaOfInterest?.custom,
                      ]}
                      id="area_interest"
                      value={values.area_interest}
                      error={errors.area_interest}
                      onChange={handleChange}
                      onCreateOption={(e) => {
                        let strToArray = values.area_interest
                          ? values.area_interest.split(",")
                          : [];
                        strToArray.push(e);
                        setAreaOfInterest({
                          ...areaOfInterest,
                          custom: [
                            ...areaOfInterest?.custom,
                            { id: e, label: e },
                          ],
                        });
                        handleChange({
                          target: {
                            id: "area_interest",
                            value: strToArray.join(","),
                          },
                        });
                      }}
                    />
                  </div>
                  {/* <div className="col-md-12 cmb-22">
                    <Dropdown
                      placeholder="Select Category"
                      options={[
                        {
                          id: "actuarial science",
                          label: "Actuarial Science",
                        },
                      ]}
                      id="category"
                      value={values.category}
                      onChange={handleChange}
                      error={errors.category}
                    />
                  </div> */}
                  <div className="cmb-22">
                    <CreatableDropdown
                      placeholder="Select category"
                      options={[
                        ...categoryList?.existing,
                        ...categoryList?.custom,
                      ]}
                      id="category"
                      value={values.category}
                      error={errors.category}
                      onChange={handleChange}
                      onCreateOption={(e) => {
                        let strToArray = values.category
                          ? values.category?.split(",")
                          : [];
                        strToArray.push(e);
                        setCategoryList({
                          ...categoryList,
                          custom: [
                            ...categoryList?.custom,
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
                  <div className="d-flex justify-content-center mt-3">
                    <Button
                      isRounded
                      type="submit"
                      text="Submit"
                      btnStyle="primary-dark mb-3"
                      className="cps-40 cpe-40"
                      onClick={handleSubmit}
                      btnLoading={btnLoading}
                    />
                  </div>
                </form>
              );
            }}
          </Formik>
        </div>
      </Modal>
    </div>
  );
}
export default ProfessionalMemberReg;
