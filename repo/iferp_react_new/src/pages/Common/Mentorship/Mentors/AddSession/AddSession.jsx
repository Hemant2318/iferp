import Card from "components/Layout/Card";
import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { icons, timeDurations, timeZoneList } from "utils/constants";
import * as Yup from "yup";
import { Formik } from "formik";
import TextInput from "components/form/TextInput";
import TextArea from "components/form/TextArea";
import Dropdown from "components/form/Dropdown";
import { useState } from "react";
import CreatableDropdown from "components/form/CreatableDropdown";
import TimeSelector from "components/form/TimeSelector";
import { forEach, omit } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  createAddSession,
  createEditSession,
  sessionStatusEdit,
  setCustomizeDateTime,
  setCustomizedDate,
  setMySessionData,
  throwSuccess,
  deleteCustomizeDateTime,
  deleteUnavailableDateTime,
  setTabTypeAddedBankAccount,
} from "store/slices";
import moment from "moment";
import {
  INRtoUSD,
  USDtoINR,
  calculateRows,
  getDataFromLocalStorage,
  objectToFormData,
} from "utils/helpers";
import "./AddSession.scss";

const AddSession = () => {
  const params = useParams();
  const ref = useRef();
  const authUserDetails = getDataFromLocalStorage();
  const { personal_details, exchange_rate } = authUserDetails;
  const isNational = personal_details?.country_name === "India";
  const { formType: type } = params;
  const upDateViewStatus = type === "update-session-details" ? true : false;
  const dispatch = useDispatch();
  const { customizeDateTime, mySessionData, unavailableDateTime } = useSelector(
    (state) => ({
      customizeDateTime: state.mentorship.customizeDateTime,
      mySessionData: state.mentorship.mySessionData,
      unavailableDateTime: state.mentorship.unavailableDateTime,
    })
  );
  const {
    session_name,
    skill,
    session_overview,
    amount,
    id,
    meeting_duration,
    meeting_link,
    requirements,
    daily,
    daily_session,
    data_description,
    status,
  } = mySessionData || {};
  const editPrice = isNational ? amount : INRtoUSD(amount, exchange_rate);
  const newEditPrice = parseFloat(editPrice?.toFixed(2));

  const [isLoading, setIsLoading] = useState(false);
  const [skillsList, setSkillsList] = useState({
    existing: [
      {
        id: "CV Review & Guidance",
        label: "CV Review & Guidance",
      },
      {
        id: "Interview Preparation",
        label: "Interview Preparation",
      },
      {
        id: "Job Guidance",
        label: "Job Guidance",
      },
    ],
    custom: [],
  });

  useEffect(() => {
    if (skill) {
      const customList = [];
      forEach(skill, (elm) => {
        if (!skillsList?.existing?.find((o) => o?.id === elm)) {
          customList?.push({
            id: elm,
            label: elm,
          });
        }
      });
      setSkillsList({
        ...skillsList,
        custom: customList,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skill]);

  const dummyData = [
    {
      id: 1,
      dayName: "Monday",
      startTime: "10:00 AM IST",
      endTime: "06:00 PM IST",
    },
    {
      id: 2,
      dayName: "Tuesday",
      startTime: "10:00 AM IST",
      endTime: "06:00 PM IST",
    },
    {
      id: 3,
      dayName: "Wednesday",
      startTime: "10:00 AM IST",
      endTime: "06:00 PM IST",
    },
    {
      id: 4,
      dayName: "Thursday",
      startTime: "10:00 AM IST",
      endTime: "06:00 PM IST",
    },
    {
      id: 5,
      dayName: "Friday",
      startTime: "10:00 AM IST",
      endTime: "06:00 PM IST",
    },
    {
      id: 6,
      dayName: "Saturday",
      startTime: "10:00 AM IST",
      endTime: "06:00 PM IST",
    },
    {
      id: 7,
      dayName: "Sunday",
      startTime: "10:00 AM IST",
      endTime: "06:00 PM IST",
    },
  ];
  const navigate = useNavigate();
  const [isCustomizeTime, setIsCustomizeTime] = useState(false);

  const checkedDaysValues = {};
  const filterTimeDate = daily ? daily : daily_session;
  dummyData.forEach((dummyItem) => {
    const foundDay = filterTimeDate?.find(
      (dayItem) =>
        dayItem?.day?.toLowerCase() ===
        dummyItem?.dayName?.slice(0, 3).toLowerCase()
    );
    checkedDaysValues[dummyItem.id] = foundDay ? true : false;
  });

  const startTimeValues = {};
  dummyData.forEach((dummyItem, i) => {
    const foundDay = filterTimeDate?.find(
      (dayItem) =>
        dayItem?.day?.toLowerCase() ===
        dummyItem?.dayName?.slice(0, 3).toLowerCase()
    );
    startTimeValues[dummyItem.id] =
      foundDay !== undefined
        ? moment(foundDay?.start_time, "hh:mm A").format("HH:mm")
        : "";
  });

  const endTimeValues = {};
  dummyData.forEach((dummyItem) => {
    const foundDay = filterTimeDate?.find(
      (dayItem) =>
        dayItem?.day?.toLowerCase() ===
        dummyItem?.dayName?.slice(0, 3).toLowerCase()
    );
    endTimeValues[dummyItem.id] =
      foundDay !== undefined
        ? moment(foundDay?.end_time, "hh:mm A").format("HH:mm")
        : "";
  });
  const statusDataType = [
    { id: "0", label: "Pending" },
    { id: "1", label: "Approved" },
    { id: "2", label: "Rejected" },
  ];
  const matchingStatus = statusDataType.find((item) => item?.label === status);
  const generateInitialValues = () => {
    const initialValues = {
      session_name: session_name || "",
      skills_group: skill?.join(",") || "",
      skills: "",
      overview: session_overview || "",
      data_description: data_description || "",
      requirements: requirements || "",
      meeting_duration: meeting_duration?.split(" ")[0] || "",
      duration_unit: meeting_duration?.split(" ")[1] || "",
      amount: newEditPrice || "",
      meeting_link: meeting_link || "",
      timizone:
        daily?.[0]?.time_zone ||
        daily_session?.[0]?.time_zone ||
        timeZoneList?.[70]?.label,
      startTimes: startTimeValues || {},
      endTimes: endTimeValues || {},
      checkedDays: checkedDaysValues || {},
      status: matchingStatus?.id || "",
    };
    return initialValues;
  };
  const initialValues = generateInitialValues();
  const validationSchema = Yup.object().shape({
    session_name: Yup.string().required("Session Name is required."),
    skills_group: Yup.string().required("Skills are required."),
    overview: Yup.lazy((value) => {
      const wordCount = value ? value?.length : 0;
      return Yup.string()
        .required("Session Overview is required.")
        .test(
          "word-count",
          `You entered ${wordCount} words. Maximum 500 words allowed for this field.`,
          (value) => {
            if (value) {
              return wordCount <= 500;
            }
            return true;
          }
        );
    }),
    data_description: Yup.lazy((value) => {
      const wordCount = value ? value?.length : 0;
      return Yup.string()
        .required("Please enter what will they learn.")
        .test(
          "word-count",
          `You entered ${wordCount} words. Maximum 1100 words allowed for this field.`,
          (value) => {
            if (value) {
              return wordCount <= 1100;
            }
            return true;
          }
        );
    }),
    requirements: Yup.lazy((value) => {
      const wordCount = value ? value?.length : 0;
      return Yup.string().test(
        "word-count",
        `You entered ${wordCount} words. Maximum 600 words allowed for this field.`,
        (value) => {
          if (value) {
            return wordCount <= 600;
          }
          return true;
        }
      );
    }),
    meeting_duration: Yup.string().required("Meeting Duration is required."),
    amount: Yup.number()
      .required("Amount is required.")
      .positive("Amount must be positive."),
    meeting_link: Yup.string()
      .required("Meeting link is required.")
      .test(
        "no-numbers",
        "Numbers are not allowed in Business Link",
        function (value) {
          if (/\d/.test(value)) {
            return false;
          }
          return true;
        }
      ),
    timizone: Yup.string().required("Timezone is required."),
  });
  const handleSave = async (values) => {
    if (upDateViewStatus) {
      return sessionStatusUpdate(values);
    }
    if (mySessionData && id) {
      sessionEdit(values);
      dispatch(setMySessionData(null));
    } else {
      sessionAdd(values);
      dispatch(setMySessionData(null));
    }
    resetCustomizeAndUnavailableDate();
  };
  const sessionAdd = async (values) => {
    setIsLoading(true);
    const price = isNational
      ? values?.amount
      : USDtoINR(values?.amount, exchange_rate);
    const newPrice = parseFloat(price?.toFixed(2));
    const daySchedule = Object.entries(values?.startTimes)
      ?.filter(([dId, _]) => values.checkedDays[dId])
      ?.map(([dId, _]) => {
        const day = dummyData?.find((d) => d.id === parseInt(dId));
        return {
          day: day?.dayName?.slice(0, 3),
          start_time: values?.startTimes[dId],
          end_time: values?.endTimes[dId],
        };
      });

    const payload = {
      ...omit(values, [
        "checkedDays",
        "endTimes",
        "startTimes",
        "skills_group",
      ]),
      // skills: skillsData,
      amount: newPrice,
      skills: values?.skills_group?.split(","),
      daily_schedule: daySchedule,
      customize_time_zone: [...customizeDateTime, ...unavailableDateTime],
    };
    let formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "skills") {
        formData.append("skills", JSON.stringify(value));
      } else if (key === "daily_schedule") {
        formData.append("daily_schedule", JSON.stringify(value));
      } else if (key === "customize_time_zone") {
        formData.append("customize_time_zone", JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });
    const response = await dispatch(createAddSession(formData));
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      if (ref?.current) {
        ref?.current?.resetForm();
        navigate("/professional/mentorship/mentor");
        dispatch(setTabTypeAddedBankAccount("my-session"));
      }
      dispatch(setCustomizeDateTime({}));
      dispatch(setCustomizedDate(null));
    }
    setIsLoading(false);
  };

  const sessionEdit = async (editData) => {
    setIsLoading(true);
    const price = isNational
      ? editData?.amount
      : USDtoINR(editData?.amount, exchange_rate);
    const newPrice = parseFloat(price?.toFixed(2));
    const daySchedule = Object.entries(editData?.startTimes)
      ?.filter(([dId, _]) => editData.checkedDays[dId])
      ?.map(([dId, _]) => {
        const day = dummyData?.find((d) => d.id === parseInt(dId));
        return {
          day: day?.dayName?.slice(0, 3),
          start_time: editData?.startTimes[dId],
          end_time: editData?.endTimes[dId],
        };
      });

    const payload = {
      ...omit(editData, [
        "checkedDays",
        "endTimes",
        "startTimes",
        "skills_group",
      ]),
      id: id,
      // skills: skillsData,
      amount: newPrice,
      skills: editData?.skills_group.split(","),
      daily_schedule: daySchedule,
      customize_time_zone: [...customizeDateTime, ...unavailableDateTime],
    };
    let formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "skills") {
        formData.append("skills", JSON.stringify(value));
      } else if (key === "daily_schedule") {
        formData.append("daily_schedule", JSON.stringify(value));
      } else if (key === "customize_time_zone") {
        formData.append("customize_time_zone", JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });
    const response = await dispatch(createEditSession(formData));
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      if (ref?.current) {
        ref?.current?.resetForm();
      }
      dispatch(setCustomizeDateTime({}));
      dispatch(setCustomizedDate(null));
      navigate(-1);
    }
    setIsLoading(false);
  };

  const sessionStatusUpdate = async (values) => {
    const { status } = values;
    const payload = {
      session_id: id,
      status: status,
    };
    const response = await dispatch(
      sessionStatusEdit(objectToFormData(payload))
    );
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      if (ref?.current) {
        ref?.current?.resetForm();
        navigate(-1);
      }
    }
  };

  const resetCustomizeAndUnavailableDate = () => {
    dispatch(deleteCustomizeDateTime());
    dispatch(deleteUnavailableDateTime());
  };

  return (
    <div id="add-new-session">
      <Card className="d-flex align-items-center cps-10 cpt-10 cpe-10 cpb-10 unset-br mb-3">
        <span
          className="d-flex"
          onClick={() => {
            navigate(-1);
            if (mySessionData) {
              dispatch(setMySessionData(null));
            }
          }}
        >
          <img
            src={icons.leftArrow}
            alt="back"
            className="h-21 me-3 pointer"
            onClick={() => {
              resetCustomizeAndUnavailableDate();
            }}
          />
        </span>
        <div className="text-16-500 color-dark-blue">
          {upDateViewStatus
            ? "Session Details"
            : type === "add-new-session"
            ? "Add New Session"
            : "Edit New Session"}
        </div>
      </Card>

      <div className="cps-10 cpt-10 cpe-10 cpb-10">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSave}
          innerRef={ref}
        >
          {(props) => {
            const {
              values,
              handleChange,
              handleSubmit,
              setFieldValue,
              errors,
            } = props;
            const {
              session_name,
              skills_group,
              overview,
              data_description,
              requirements,
              meeting_duration,
              amount,
              meeting_link,
            } = values;

            return (
              <form>
                <Card className="row cpt-15 cpb-15 cmb-24">
                  <div className="cmb-24">
                    <TextInput
                      label="Session Name*"
                      id="session_name"
                      value={session_name}
                      placeholder="Enter Session Name"
                      onChange={handleChange}
                      error={errors?.session_name}
                      disabled={upDateViewStatus ? true : false}
                    />
                  </div>

                  <div className="cmb-24">
                    <CreatableDropdown
                      label="Skills they’ll learn*"
                      placeholder="Select Skills or Enter they’ll learn"
                      id="skills_group"
                      options={[...skillsList?.existing, ...skillsList?.custom]}
                      value={skills_group}
                      onCreateOption={(e) => {
                        let strToArray = skills_group
                          ? skills_group?.split(",")
                          : [];

                        if (e.includes(",")) {
                          const customSkills = e
                            ?.split(",")
                            ?.map((o) => o?.trim());
                          strToArray.push(...customSkills);
                          const newCustomSkills = customSkills?.map((s) => ({
                            id: s,
                            label: s,
                          }));
                          setSkillsList({
                            ...skillsList,
                            custom: [...skillsList?.custom, ...newCustomSkills],
                          });
                        } else {
                          strToArray?.push(e);

                          setSkillsList({
                            ...skillsList,
                            custom: [
                              ...skillsList?.custom,
                              { id: e, label: e },
                            ],
                          });
                        }

                        handleChange({
                          target: {
                            id: "skills_group",
                            value: strToArray?.join(","),
                          },
                        });
                      }}
                      onChange={handleChange}
                      error={errors?.skills_group}
                      disabled={upDateViewStatus ? true : false}
                    />
                  </div>
                  <div className="cmb-24">
                    <TextArea
                      label="Session Overview*"
                      value={overview}
                      rows={calculateRows(overview)}
                      id="overview"
                      placeholder="Enter Session Overview"
                      onChange={handleChange}
                      error={errors?.overview}
                      disabled={upDateViewStatus ? true : false}
                    />
                  </div>
                  <div className="cmb-24">
                    <TextArea
                      label="What will they learn?*"
                      value={data_description}
                      rows={calculateRows(data_description)}
                      id="data_description"
                      placeholder="Enter What will they learn"
                      onChange={handleChange}
                      error={errors?.data_description}
                      disabled={upDateViewStatus ? true : false}
                    />
                  </div>
                  <div className="cmb-24">
                    <TextArea
                      label="Requirements"
                      value={requirements}
                      error={errors?.requirements}
                      rows={calculateRows(requirements)}
                      id="requirements"
                      placeholder="Enter Requirements (Ex: Photoshop Tool)"
                      onChange={handleChange}
                      disabled={upDateViewStatus ? true : false}
                    />
                  </div>
                  <div className="cmb-24 col-md-6">
                    <Dropdown
                      label="Meeting Duration*"
                      value={meeting_duration}
                      id="meeting_duration"
                      placeholder="Select Meeting Duration"
                      options={timeDurations}
                      optionKey="id"
                      optionValue="label"
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue("duration_unit", e?.target?.data?.unit);
                      }}
                      error={errors?.meeting_duration}
                      disabled={upDateViewStatus ? true : false}
                    />
                  </div>
                  <div className="cmb-24 col-md-1">
                    <TextInput
                      label="Amount*"
                      value={isNational ? "₹ INR" : "$ USD"}
                      onChange={() => {}}
                      disabled
                    />
                  </div>
                  <div className="cmb-24 col-md-5">
                    <TextInput
                      label=" "
                      value={amount}
                      id="amount"
                      placeholder="Enter the amount"
                      onChange={handleChange}
                      error={errors?.amount}
                      disabled={upDateViewStatus ? true : false}
                    />
                  </div>
                  <div>
                    <TextInput
                      label="Meeting Link"
                      value={meeting_link}
                      id="meeting_link"
                      placeholder="Enter Meeting Link"
                      onChange={handleChange}
                      error={errors?.meeting_link}
                      disabled={upDateViewStatus ? true : false}
                    />
                  </div>
                </Card>

                <TimeSelector
                  values={values}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  setFieldValue={setFieldValue}
                  isCustomizeTime={isCustomizeTime}
                  setIsCustomizeTime={setIsCustomizeTime}
                  errors={errors}
                  isLoading={isLoading}
                  mySessionData={mySessionData}
                  initialValues={initialValues}
                />
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AddSession;
