import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import { cloneDeep, isEqual, lowerCase, omit, unionBy } from "lodash";
import TextInput from "components/form/TextInput";
import Dropdown from "components/form/Dropdown";
import FileUpload from "components/form/FileUpload";
import Button from "components/form/Button";
import Location from "components/form/Location";
import Modal from "../Modal";
import {
  getDataFromLocalStorage,
  titleCaseString,
  getFilenameFromUrl,
  objectToFormData,
} from "utils/helpers";
import { editProfile, fetchProfile, getInstitutions } from "store/slices";
import { limit } from "utils/constants";
import RequestChange from "../RequestChange";

const EditProfile = ({ onHide }) => {
  const dispatch = useDispatch();

  const [btnLoading, setBtnLoading] = useState(false);

  const handelSave = async (values) => {
    setBtnLoading(true);
    let object = {
      0: {
        profile_photo_path: values?.profile_photo_path,
        user_type: values?.user_type,
      },
      2: omit(values, ["profilePhotoPathName"]),
      5: omit(values, ["profilePhotoPathName", "professional_designation"]),
    };
    let userPayload = object[values?.user_type];
    let payload = objectToFormData(userPayload);
    const response = await dispatch(editProfile(payload));
    if (response?.status === 200) {
      await dispatch(fetchProfile());
      onHide();
    }
    setBtnLoading(false);
  };

  const [timer, setTimer] = useState("");
  const [instituteData, setInstituteData] = useState({
    list: [],
    name: "",
    total: 0,
    offset: 0,
    limit: limit,
    isLoading: true,
    only_unassigned: 1,
  });
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

  let userData = getDataFromLocalStorage();

  let {
    last_name,
    user_type,
    first_name,
    profile_photo_path,
    personal_details = {},
    educational_details = {},
    professional_details = {},
  } = userData;

  let { designation } = professional_details;
  let { city, country } = personal_details;
  let {
    ug_institution,
    ug_institution_name,
    pg_institution,
    pg_institution_name,
    phd_institution,
    phd_institution_name,
  } = educational_details;
  let oldArray = phd_institution
    ? [
        {
          id: phd_institution,
          name: phd_institution_name,
        },
      ]
    : pg_institution
    ? [
        {
          id: pg_institution,
          name: pg_institution_name,
        },
      ]
    : [
        {
          id: ug_institution,
          name: ug_institution_name,
        },
      ];
  let instituteKey = phd_institution
    ? "phd_institution"
    : pg_institution
    ? "pg_institution"
    : "ug_institution";

  let instituteValue = phd_institution || pg_institution || ug_institution;
  const initialValues = {
    first_name: first_name || "",
    last_name: last_name || "",
    professional_designation: designation || "",
    [instituteKey]: instituteValue || "",
    city: city || "",
    profile_photo_path: profile_photo_path || "",
    profilePhotoPathName: "",
    user_type: user_type,
  };
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().when("user_type", {
      is: "2" || "5",
      then: Yup.string().required("First name is required."),
    }),
    last_name: Yup.string().when("user_type", {
      is: "2" || "5",
      then: Yup.string().required("Last name is required."),
    }),
    ug_institution: Yup.lazy((value, obj) => {
      const { user_type } = obj?.parent;
      if (instituteKey === "ug_institution" && ["2", "5"].includes(user_type)) {
        return Yup.string().required("UG institution is required.");
      } else {
        return Yup.string();
      }
    }),
    pg_institution: Yup.lazy((value, obj) => {
      const { user_type } = obj?.parent;
      if (instituteKey === "pg_institution" && ["2", "5"].includes(user_type)) {
        return Yup.string().required("PG institution is required.");
      } else {
        return Yup.string();
      }
    }),
    phd_institution: Yup.lazy((value, obj) => {
      const { user_type } = obj?.parent;
      if (
        instituteKey === "phd_institution" &&
        ["2", "5"].includes(user_type)
      ) {
        return Yup.string().required("PHD institution is required.");
      } else {
        return Yup.string();
      }
    }),
    // city: Yup.string().when("user_type", {
    //   is: "2" || "5",
    //   then: Yup.string().required("City is required."),
    // }),
    // professional_designation: Yup.string().when("user_type", {
    //   is: "2",
    //   then: Yup.string().required("Designation is required"),
    // }),
    profile_photo_path: Yup.string().required("profile photo is required."),
  });

  return (
    <Modal onHide={onHide} title="Edit Details" size="md">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handelSave}
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
              <div className="row cmt-30 cps-30 cpe-30">
                {["2", "5"].includes(user_type) && (
                  <div className="cmb-22 d-flex justify-content-end">
                    <RequestChange afterRedirect={onHide} />
                  </div>
                )}
                {["2", "5"].includes(user_type) && (
                  <div className="cmb-22">
                    <TextInput
                      disabled
                      label="First Name*"
                      placeholder="First Name"
                      id="first_name"
                      value={values.first_name}
                      error={errors.first_name}
                      onChange={(e) => {
                        handleChange({
                          target: {
                            id: "first_name",
                            value: titleCaseString(e.target.value),
                          },
                        });
                      }}
                    />
                  </div>
                )}
                {["2", "5"].includes(user_type) && (
                  <div className="cmb-22">
                    <TextInput
                      disabled
                      label="Last Name*"
                      placeholder="Last Name"
                      id="last_name"
                      value={values.last_name}
                      error={errors.last_name}
                      onChange={(e) => {
                        handleChange({
                          target: {
                            id: "last_name",
                            value: titleCaseString(e.target.value),
                          },
                        });
                      }}
                    />
                  </div>
                )}
                {["2"].includes(user_type) && (
                  <div className="cmb-22">
                    <TextInput
                      label="Designation"
                      placeholder="Designation"
                      id="professional_designation"
                      value={values.professional_designation}
                      error={errors.professional_designation}
                      onChange={handleChange}
                    />
                  </div>
                )}
                {["2", "5"].includes(user_type) && (
                  <div className="cmb-22">
                    <Dropdown
                      label="Institution*"
                      placeholder="Select Institution’s"
                      options={unionBy(instituteData?.list, oldArray, "id")}
                      optionValue="name"
                      optionKey="id"
                      id={instituteKey}
                      value={values?.[instituteKey]}
                      error={errors?.[instituteKey]}
                      isLoading={instituteData.isLoading}
                      onChange={handleChange}
                      onInputChange={handleSearchInstitution}
                      onMenuScrollToBottom={handelInstitutionScroll}
                    />
                  </div>
                )}

                {["2", "5"].includes(user_type) && (
                  <div className="cmb-22">
                    <Location
                      type="city"
                      data={{
                        id: "city",
                        label: "City",
                        placeholder: "City",
                        value: values.city,
                        error: errors.city,
                        countryId: country,
                        stateId: null,
                        onChange: handleChange,
                        disabled: !country,
                      }}
                    />
                  </div>
                )}

                <div className="cmb-22">
                  <FileUpload
                    label="Profile Photo*"
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
                <div className="d-flex justify-content-center gap-4 mt-2 pb-3">
                  <Button
                    isRounded
                    text="Cancel"
                    btnStyle="primary-gray"
                    className="cps-50 cpe-50"
                    onClick={resetForm}
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
    </Modal>
  );
};
export default EditProfile;
