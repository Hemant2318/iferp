import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import { Formik } from "formik";
import * as Yup from "yup";
import Dropdown from "components/form/Dropdown";
import Location from "components/form/Location";
import { cloneDeep, isEqual, lowerCase, omit, some } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { limit, researchType } from "utils/constants";
import {
  addResearchId,
  editResearchProfile,
  fetchProfile,
  getUniversity,
} from "store/slices";
import { getFilenameFromUrl, objectToFormData } from "utils/helpers";
import FileUpload from "components/form/FileUpload";

const PreviewProfileInfoPopup = ({
  onHide,
  fetchDetails,
  isFieldEmpty,
  setIsFieldEmpty,
}) => {
  const dispatch = useDispatch();
  const { userDetails, researchProfile } = useSelector((state) => ({
    userDetails: state.student.userDetails,
    researchProfile: state.student.researchProfile,
  }));
  console.log("userDetails", userDetails);
  console.log("researchProfile", researchProfile);

  const {
    first_name,
    last_name,
    user_type,
    profile_photo_path,
    personal_details = {},
    educational_details = {},
    professional_details = {},
  } = userDetails;
  const { research_id } = researchProfile || {};
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
    const payloadOne = {};
    const payloadTwo = {};
    let successOne = false;
    let successTwo = false;

    for (const key in values) {
      if (key === "researchIds") {
        payloadTwo[key] = values[key];
      } else {
        payloadOne[key] = values[key];
      }
    }
    if (payloadOne && payloadTwo) {
      const newPayloadOne = objectToFormData(payloadOne);
      const responseOne = await dispatch(editResearchProfile(newPayloadOne));
      if (responseOne?.status === 200) {
        successOne = true;
      }

      const newPayloadTwo = {
        research_id: JSON.stringify(payloadTwo.researchIds),
      };
      const responseTwo = await dispatch(addResearchId(newPayloadTwo));
      if (responseTwo?.status === 200) {
        successTwo = true;
      }
    }

    if (successOne && successTwo) {
      dispatch(fetchProfile());
      fetchDetails();
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

  const initialValues = {
    first_name: first_name || "",
    last_name: last_name || "",
    designation: designation || "",
    university_id: universityID || "",
    country_id: country || "",
    state_id: state || "",
    professional_institution_name: institution_name || "",
    profile_photo_path: profile_photo_path || "",
    profilePhotoPathName: "",
    researchIds: isFieldEmpty
      ? [
          {
            id: "",
            name: "",
            number: "",
          },
        ]
      : research_id,
  };

  const validationSchema = Yup.object().shape({
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
    researchIds: Yup.array(
      Yup.object({
        name: Yup.string().required("ID name is required."),
        number: Yup.string().required("ID number/link is required."),
      })
    ),
  });

  return (
    <Modal onHide={onHide} title={"Profile Details"} width={"100%"}>
      <Formik
        initialValues={initialValues}
        onSubmit={handelSave}
        validationSchema={validationSchema}
      >
        {(props) => {
          const { values, errors, handleChange, handleSubmit, setFieldValue } =
            props;
          const isAddMore = some(
            values.researchIds,
            (o) => !o.name || !o.number
          );

          return (
            <form
              className="cmt-22 overflow-x-hidden overflow-y-auto cmb-22 cpe-5"
              style={{ maxHeight: "600px" }}
            >
              <div className="row">
                <div className="text-18-500 color-5068 cmb-10">
                  Headline Info
                </div>
                {/* {user_type === "2" && (
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
                )} */}
                <div className="col-md-6 cmb-22">
                  <Dropdown
                    isClearable
                    label="University*"
                    placeholder="Select University"
                    options={universityData?.list}
                    optionValue="name"
                    // optionKey="id"
                    id="university_id"
                    value={+values.university_id}
                    error={errors.university_id}
                    isLoading={universityData.isLoading}
                    onChange={handleChange}
                    onInputChange={handleSearchUniversity}
                    onMenuScrollToBottom={handelUniversityScroll}
                  />
                </div>
                <div className="col-md-6 cmb-22">
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
                <div className="col-md-6 cmb-30">
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
                <div className="col-md-6 cmb-22">
                  <FileUpload
                    label="Profile Image"
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

                {values?.researchIds?.length > 0 && (
                  <div className="text-18-500 color-5068 cmb-10">
                    My Research ID’s
                  </div>
                )}
                {values?.researchIds?.map((elem, index) => {
                  const { name, number } = elem;
                  const { name: errName, number: errNumber } =
                    errors?.researchIds?.[index] || {};
                  let newID = name ? [{ id: name, label: name }] : [];
                  researchType.forEach((elm) => {
                    let thisExist = values.researchIds?.find(
                      (o) => o.name === elm?.id
                    );
                    if (!thisExist) {
                      newID.push(elm);
                    }
                  });

                  return (
                    <React.Fragment key={index}>
                      <div className="col-md-6 cmb-22">
                        <Dropdown
                          label={`ID Name ${index + 1}*`}
                          placeholder="Select id name"
                          options={newID}
                          id={`researchIds[${index}][name]`}
                          value={name}
                          error={errName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 cmb-22">
                        <TextInput
                          label={`ID Number/Link ${index + 1}*`}
                          placeholder="Enter ID Number/Link"
                          onChange={handleChange}
                          value={number}
                          error={errNumber}
                          id={`researchIds[${index}][number]`}
                        />
                      </div>
                      <div
                        className={`d-flex gap-3 ${
                          values.researchIds.length - 1 === index
                            ? ""
                            : " cmb-22"
                        }`}
                      >
                        {values.researchIds.length - 1 === index && (
                          <Button
                            isSquare
                            text="+ Add Another ID"
                            btnStyle="primary-light"
                            className="h-35 text-14-500"
                            disabled={isAddMore}
                            onClick={() => {
                              setFieldValue("researchIds", [
                                ...values.researchIds,
                                {
                                  id: "",
                                  name: "",
                                  number: "",
                                },
                              ]);
                            }}
                          />
                        )}
                        {values?.researchIds.length > 1 && (
                          <Button
                            isSquare
                            text="Delete"
                            btnStyle="primary-gray"
                            icon={<i className="bi bi-trash me-2" />}
                            className="cpt-5 cpb-5 cps-10 cpe-10 h-35"
                            onClick={() => {
                              const listArray = cloneDeep(values?.researchIds);
                              listArray.splice(index, 1);
                              setFieldValue("researchIds", listArray);
                            }}
                          />
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}

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
                    disabled={isEqual(values, initialValues) || isAddMore}
                  />
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default PreviewProfileInfoPopup;
