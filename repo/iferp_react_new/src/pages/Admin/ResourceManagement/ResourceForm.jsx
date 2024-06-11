import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { Formik } from "formik";
import Dropdown from "components/form/Dropdown";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import { icons, resourceType } from "utils/constants";
import {
  convertString,
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import {
  addResource,
  editResource,
  fetchResourceDetails,
  fetchState,
} from "store/slices";
import MultipleSelect from "components/form/MultipleSelect";
import CheckBox from "components/form/CheckBox";
import Card from "components/Layout/Card";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "components/Layout/Loader";

const ResourceForm = ({ onHide }) => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const { resourceId } = params;
  const isEdit = resourceId !== "add-resource";
  const { countryList } = useSelector((state) => ({
    countryList: state.global.countryList,
  }));
  const [stateList, setStateList] = useState({});
  const [stateLoading, setStateLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [resourceData, setResourceData] = useState({});
  const handelSave = (values) => {
    let cState = values?.state?.split(",");
    let newStateList = [];
    cState.forEach((sElem) => {
      let find = null;
      Object.entries(stateList).forEach((elem) => {
        if (!find) {
          find = elem[1].find((o) => `${o.id}` === sElem);
        }
      });
      if (find) {
        newStateList.push(sElem);
      }
    });
    let newStateString = newStateList.toString();
    let newValues = { ...values, state: newStateString };
    setBtnLoading(true);
    if (isEdit) {
      handelEditData({ ...newValues, id: resourceId });
    } else {
      handelAddData(newValues);
    }
  };
  const handelAddData = async (values) => {
    let forData = objectToFormData(values);
    const response = await dispatch(addResource(forData));
    if (response?.status === 200) {
      navigate(-1);
    }
    setBtnLoading(false);
  };
  const handelEditData = async (values) => {
    let forData = objectToFormData(values);
    const response = await dispatch(editResource(forData));
    if (response?.status === 200) {
      getResourceDetails();
    }
    setBtnLoading(false);
  };
  const getStateFromCountry = async (countryIds) => {
    setStateLoading(true);
    const response = await dispatch(
      fetchState({ country_id: countryIds, is_resource: "1" })
    );
    setStateList(response?.data || {});
    setStateLoading(false);
  };
  const getResourceDetails = async () => {
    let forData = objectToFormData({ id: params.resourceId });
    const response = await dispatch(fetchResourceDetails(forData));
    const data = response?.data || {};
    setResourceData(data);
    setLoading(false);
  };
  useEffect(() => {
    if (resourceData?.resource_additional_countries_id) {
      getStateFromCountry(resourceData?.resource_additional_countries_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceData]);

  useEffect(() => {
    if (["0"].includes(getDataFromLocalStorage("user_type"))) {
      if (isEdit) {
        setLoading(true);
        getResourceDetails();
      }
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required."),
    last_name: Yup.string().required("Last name is required."),
    email: Yup.string()
      .email("Email must be a valid email")
      .required("Email is required."),
    phone: Yup.string()
      .required("Phone number is required.")
      .min(10, "Phone number must be 10 digit.")
      .max(10, "Phone number must be 10 digit."),
    state: Yup.string().required("State/Province is required."),
    country: Yup.string().required("Country is required."),
  });
  const initialValues = {
    first_name: resourceData?.first_name || "",
    last_name: resourceData?.last_name || "",
    email: resourceData?.email || "",
    phone: resourceData?.phone_number || "",
    state: resourceData?.resource_additional_states_id || "",
    country: resourceData?.resource_additional_countries_id || "",
    role: resourceData?.role || "1",
  };
  return (
    <div>
      <div className="cpt-12 cpb-12 d-flex align-items-center justify-content-between cmb-12">
        <div className="d-flex align-items-center">
          <span
            className="d-flex"
            onClick={() => {
              navigate(-1);
            }}
          >
            <img
              src={icons.leftArrow}
              alt="back"
              className="h-21 me-3 pointer"
            />
          </span>
          <span className="text-18-500 color-black-olive">
            {isEdit ? "Edit" : "Add"} Resource
          </span>
        </div>
      </div>
      <Card className="cps-30 cpe-30 cpt-30 cpb-30">
        {isLoading ? (
          <div className="cpt-125 cpb-125">
            <Loader size="md" />
          </div>
        ) : (
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handelSave}
            validationSchema={validationSchema}
          >
            {(props) => {
              const {
                values,
                errors,
                handleChange,
                handleSubmit,
                setFieldValue,
                setFieldError,
              } = props;

              let viewCountryList =
                countryList?.filter((o) =>
                  values?.country?.split(",").includes(o.id)
                ) || [];

              return (
                <form>
                  <div className="row">
                    <div className="col-md-6 cmb-22">
                      <TextInput
                        placeholder="First Name"
                        id="first_name"
                        onChange={(e) => {
                          setFieldValue(
                            "first_name",
                            titleCaseString(e.target.value)
                          );
                        }}
                        value={values.first_name}
                        error={errors.first_name}
                      />
                    </div>
                    <div className="col-md-6 cmb-22">
                      <TextInput
                        placeholder="Last Name"
                        id="last_name"
                        onChange={(e) => {
                          setFieldValue(
                            "last_name",
                            titleCaseString(e.target.value)
                          );
                        }}
                        value={values.last_name}
                        error={errors.last_name}
                      />
                    </div>
                    <div className="col-md-6 cmb-22">
                      <TextInput
                        placeholder="Email Id"
                        id="email"
                        onChange={(e) => {
                          handleChange(convertString(1, e));
                        }}
                        value={values.email}
                        error={errors.email}
                      />
                    </div>
                    <div className="col-md-6 cmb-22">
                      <TextInput
                        placeholder="Contact Number"
                        id="phone"
                        onChange={handleChange}
                        value={values.phone}
                        error={errors.phone}
                      />
                    </div>
                    <div className="col-md-12 cmb-22">
                      <Dropdown
                        placeholder="Select Role"
                        options={resourceType}
                        id="role"
                        onChange={handleChange}
                        value={values.role}
                        error={errors.role}
                        disabled={isEdit}
                      />
                    </div>
                    <div className="col-md-12 cmb-22">
                      <MultipleSelect
                        placeholder="Select Allocated Country"
                        id="country"
                        value={values.country}
                        error={errors.country}
                        onChange={(e) => {
                          if (e?.target?.value) {
                            getStateFromCountry(e?.target?.value);
                          }
                          handleChange(e);
                        }}
                        optionValue="country"
                        options={countryList}
                      />
                    </div>
                    <div className="col-md-12 cmb-22">
                      {viewCountryList?.length > 0 && !stateLoading ? (
                        <div className="border ps-3 pt-2 pe-3">
                          {viewCountryList?.map((cElem, cIndex) => {
                            let dStateList = stateList[cElem?.id] || [];
                            let tState = values?.state
                              ? values?.state?.split(",")
                              : [];
                            // console.log("STATE", tState);
                            let currentCountryState = tState?.filter((o) =>
                              dStateList.find((x) => x.id === +o)
                            );
                            return (
                              <div key={cIndex} className="mb-2">
                                <div className="d-flex gap-2 align-items-center">
                                  <span>
                                    <CheckBox
                                      type="ACTIVE"
                                      onClick={() => {
                                        if (
                                          currentCountryState.length ===
                                          dStateList.length
                                        ) {
                                          let newS = tState;
                                          dStateList.forEach((x) => {
                                            newS = newS.filter(
                                              (o) => o !== `${x?.id}`
                                            );
                                          });

                                          setFieldValue(
                                            "state",
                                            newS?.toString()
                                          );
                                        } else {
                                          let newS = tState;
                                          dStateList.forEach((x) => {
                                            newS = newS.filter(
                                              (o) => o !== `${x?.id}`
                                            );
                                          });
                                          let allState = [
                                            ...newS,
                                            ...dStateList.map((o) => `${o.id}`),
                                          ];

                                          setFieldValue(
                                            "state",
                                            allState?.toString()
                                          );
                                        }
                                      }}
                                      isChecked={
                                        currentCountryState.length ===
                                        dStateList.length
                                      }
                                    />
                                  </span>
                                  <span className="text-15-400">
                                    {cElem.country}
                                  </span>
                                </div>
                                <div className="cms-20 mt-1 d-flex gap-3 flex-wrap">
                                  {dStateList?.map((sElem, sIndex) => {
                                    const { id: sID, name } = sElem;
                                    let isCheck = false;
                                    if (values.state) {
                                      isCheck = values?.state
                                        ?.split(",")
                                        ?.includes(`${sID}`);
                                    }
                                    return (
                                      <div
                                        className="d-flex gap-2 align-items-center"
                                        key={sIndex}
                                      >
                                        <span>
                                          <CheckBox
                                            type="ACTIVE"
                                            isChecked={isCheck}
                                            onClick={() => {
                                              let tempArray = [];
                                              if (values.state) {
                                                tempArray =
                                                  values.state?.split(",");

                                                if (
                                                  tempArray?.includes(`${sID}`)
                                                ) {
                                                  tempArray = tempArray.filter(
                                                    (o) => o !== `${sID}`
                                                  );
                                                } else {
                                                  tempArray.push(`${sID}`);
                                                }
                                                let stateStr =
                                                  tempArray.length > 0
                                                    ? tempArray.toString()
                                                    : "";
                                                setFieldValue(
                                                  "state",
                                                  stateStr
                                                );
                                              } else {
                                                tempArray = [`${sElem.id}`];
                                                setFieldValue(
                                                  "state",
                                                  tempArray.toString()
                                                );
                                              }
                                            }}
                                          />
                                        </span>
                                        <span className="text-15-400">
                                          {name}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div
                          className={`fake-input color-dark-silver bg-american-silver ${
                            stateLoading
                              ? "justify-content-center bg-white"
                              : ""
                          }`}
                        >
                          {stateLoading ? (
                            <Loader size="sm" />
                          ) : (
                            "Select State/Province"
                          )}
                        </div>
                      )}
                      {errors.state && (
                        <span className="text-13-400 pt-1">
                          <span style={{ color: "red" }}>{errors.state}</span>
                        </span>
                      )}
                    </div>

                    <div className="d-flex justify-content-center gap-4 cmt-30">
                      <Button
                        text="Cancel"
                        isRounded
                        btnStyle="light-outline"
                        className="cps-40 cpe-40"
                        onClick={onHide}
                      />
                      <Button
                        isRounded
                        text="Submit"
                        btnStyle="primary-dark"
                        className="cps-40 cpe-40"
                        btnLoading={btnLoading}
                        disabled={isEqual(values, initialValues)}
                        onClick={(e) => {
                          let isStateMissing = false;
                          if (values.state) {
                            let selectedStateID = values.state?.split(",");
                            Object.entries(stateList).forEach((elem) => {
                              if (!isStateMissing) {
                                let ids = elem[1]?.map((o) => {
                                  return `${o.id}`;
                                });
                                var foundIds = selectedStateID.filter(
                                  (x) => ids.indexOf(x) !== -1
                                );
                                isStateMissing = foundIds.length === 0;
                              }
                            });
                          }
                          if (isStateMissing) {
                            setFieldError(
                              "state",
                              "Atleast one state should be select for country"
                            );
                          } else {
                            handleSubmit(e);
                          }
                        }}
                      />
                    </div>
                  </div>
                </form>
              );
            }}
          </Formik>
        )}
      </Card>
    </div>
  );
};
export default ResourceForm;
