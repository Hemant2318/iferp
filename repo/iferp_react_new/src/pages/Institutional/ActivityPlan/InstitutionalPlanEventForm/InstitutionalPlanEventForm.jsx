import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { cloneDeep, isEqual, map, omit } from "lodash";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import Location from "components/form/Location";
import TextInput from "components/form/TextInput";
import DatePicker from "components/form/DatePicker/DatePicker";
import FileUpload from "components/form/FileUpload";
import Card from "components/Layout/Card";
import ToggleContainer from "components/Layout/ToggleContainer";
import { icons, institutionalRoute } from "utils/constants";
import {
  addInstitutionalEvents,
  getInstitutionalMembers,
  setApiError,
} from "store/slices";
import {
  getDataFromLocalStorage,
  getFilenameFromUrl,
  objectToFormData,
} from "utils/helpers";

const defaultSpeaker = [
  {
    id: "",
    user_id: "",
    designation: "",
    institution: "",
    country: "",
    photo: "",
    photoFileName: "",
  },
];
const defaultData = [
  {
    event_name: "",
    start_date: "",
    end_date: "",
    country: "",
    city: "",
    early_bird_registration: "",
    abstract_submission: "",
    full_paper_submission: "",
    registration_deadline: "",
    brochure_image: "",
    brochureFileName: "",
    poster_image: "",
    posterFileName: "",
    speaker_details: defaultSpeaker,
  },
];

const InstitutionalPlanEventForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formRef = useRef();
  const { eventTypeList } = useSelector((state) => ({
    eventTypeList: state.global.eventTypeList,
  }));
  const { institution_details = {} } = getDataFromLocalStorage();
  const [btnLoading, setBtnLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(true);
  const [userList, setUserList] = useState([]);
  const [qType, setQType] = useState("1");
  const [eType, setEType] = useState(1);

  const getProfiles = async () => {
    const response = await dispatch(
      getInstitutionalMembers(objectToFormData({ type: "faculty" }))
    );

    setUserList(response?.data?.members || []);
    setMemberLoading(false);
  };
  useEffect(() => {
    getProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handelSave = async (values) => {
    setBtnLoading(true);
    const payload = {
      event_details: map(values.event_details, (elm) => {
        return omit({ ...elm, event_type: eType }, [
          "posterFileName",
          "brochureFileName",
        ]);
      }),
    };
    const response = await dispatch(addInstitutionalEvents(payload));
    if (response?.status === 200) {
      if (formRef.current) {
        formRef.current.resetForm();
      }
      dispatch(
        setApiError({
          show: true,
          message: "Event add successfully.",
          type: "success",
        })
      );
    }
    setBtnLoading(false);
  };
  const validationSchema = Yup.object().shape({
    event_details: Yup.array(
      Yup.object({
        event_name: Yup.string().required("Event name is required."),
        start_date: Yup.string().required("Start date is required."),
        end_date: Yup.string().required("End date is required."),
        country: Yup.string().required("Country is required."),
        // city: Yup.string().required("locations is required."),
        early_bird_registration: Yup.string().required(
          "Early bird registration date is required."
        ),
        abstract_submission: Yup.string().required(
          "Abstract submission date is required."
        ),
        full_paper_submission: Yup.string().required(
          "Full paper submission date is required."
        ),
        registration_deadline: Yup.string().required(
          "Registration deadline date is required."
        ),
        brochure_image: Yup.string().required("Brochure image is required."),
        poster_image: Yup.string().required("Poster image is required."),
        speaker_details: Yup.array(
          Yup.object({
            user_id: Yup.string().required("Member is required."),
            designation: Yup.string().required("Designation is required."),
            institution: Yup.string().required("Institution is required."),
            country: Yup.string().required("Country is required."),
            photo: Yup.string().required("Photo is required."),
          })
        ),
      })
    ),
  });
  const initialValues = {
    event_details: defaultData,
  };
  const pActiveClass = "p-2 bg-new-car color-white text-16-500 me-4";
  const pInActiveClass = "p-2 color-black-olive text-16-500 me-4 pointer";

  return (
    <>
      <Card className="d-flex align-items-center p-1 unset-br mb-4">
        <div
          className={pInActiveClass}
          onClick={() => {
            navigate(`${institutionalRoute.activityPlan}/iferp-plan`);
          }}
        >
          IFERP Plan
        </div>
        <div className={pActiveClass} onClick={() => {}}>
          Institutional Plan
        </div>
        <div
          className={pInActiveClass}
          onClick={() => {
            navigate(`${institutionalRoute.activityPlan}/activity-reports`);
          }}
        >
          Activity Reports
        </div>
      </Card>
      <div className="d-flex gap-3">
        <div
          className="d-flex mt-1"
          onClick={() => {
            navigate("/institutional/activity-plan/institutional-plan");
          }}
        >
          <img src={icons.leftArrow} alt="back" className="h-21 me-3 pointer" />
        </div>
        <Tabs
          defaultActiveKey={qType}
          id="uncontrolled-tab-example"
          className="cmb-30 gap-4"
        >
          <Tab
            eventKey="1"
            title="Quarter Plan 1"
            onEnter={() => {
              setQType("1");
            }}
          />
          <Tab
            eventKey="2"
            title="Quarter Plan 2"
            onEnter={() => {
              setQType("2");
            }}
          />
          <Tab
            eventKey="3"
            title="Quarter Plan 3"
            onEnter={() => {
              setQType("3");
            }}
          />
          <Tab
            eventKey="4"
            title="Quarter Plan 4"
            onEnter={() => {
              setQType("4");
            }}
          />
        </Tabs>
      </div>
      {eventTypeList.map((et, etindex) => {
        return (
          <ToggleContainer
            title={`${et.name} Details`}
            defaultOpen={eType === et.id ? true : false}
            key={etindex}
            onClick={() => {
              setEType(et.id);
            }}
          >
            <div className="">
              <Formik
                enableReinitialize
                innerRef={formRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handelSave}
              >
                {(props) => {
                  const {
                    values,
                    errors,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                    resetForm,
                  } = props;
                  return (
                    <form className="row">
                      {values.event_details.map((eElem, eIndex) => {
                        const kID = `event_details[${eIndex}]`;
                        const eError = errors?.event_details?.[eIndex] || {};
                        const {
                          event_name,
                          start_date,
                          end_date,
                          country,
                          city,
                          early_bird_registration,
                          abstract_submission,
                          full_paper_submission,
                          registration_deadline,
                          brochure_image,
                          brochureFileName,
                          poster_image,
                          posterFileName,
                          speaker_details,
                        } = eElem;
                        const isSpeakerData = speaker_details.every(
                          (o) =>
                            o.user_id &&
                            o.designation &&
                            o.institution &&
                            o.country &&
                            o.photoFileName
                        );
                        const isAddEvent =
                          values.event_details.length - 1 === eIndex;
                        const isAddMore =
                          event_name &&
                          start_date &&
                          end_date &&
                          country &&
                          city &&
                          early_bird_registration &&
                          abstract_submission &&
                          full_paper_submission &&
                          registration_deadline &&
                          brochureFileName &&
                          posterFileName &&
                          isSpeakerData;

                        return (
                          <React.Fragment key={eIndex}>
                            <div className="cmb-24 cmt-30">
                              <TextInput
                                label={`${et.name} Name*`}
                                placeholder={`Enter your ${et.name} Name`}
                                id={`${kID}[event_name]`}
                                onChange={handleChange}
                                value={event_name}
                                error={eError.event_name}
                              />
                            </div>
                            <div className="col-md-6 cmb-24">
                              <DatePicker
                                placeholder="Start Date*"
                                id={`${kID}[start_date]`}
                                onChange={(e) => {
                                  handleChange(e);
                                  setFieldValue(`${kID}[end_date]`, "");
                                }}
                                value={start_date}
                                error={eError.start_date}
                                minDate={moment()}
                              />
                            </div>
                            <div className="col-md-6 cmb-24">
                              <DatePicker
                                placeholder="End Date*"
                                id={`${kID}[end_date]`}
                                onChange={handleChange}
                                value={end_date}
                                error={eError.end_date}
                                minDate={start_date}
                                disabled={!start_date}
                              />
                            </div>
                            <div className="col-md-6 cmb-24">
                              <Location
                                type="country"
                                data={{
                                  id: `${kID}[country]`,
                                  placeholder: "Select Country*",
                                  value: country,
                                  error: eError.country,
                                  onChange: handleChange,
                                }}
                              />
                            </div>
                            <div className="col-md-6 cmb-24">
                              <Location
                                type="city"
                                data={{
                                  id: `${kID}[city]`,
                                  placeholder: "Select City",
                                  value: city,
                                  error: eError.city,
                                  countryId: country,
                                  onChange: handleChange,
                                  disabled: !country,
                                }}
                              />
                            </div>
                            <div className="col-md-6 cmb-24">
                              <DatePicker
                                placeholder="Early Bird Registration Date*"
                                id={`${kID}[early_bird_registration]`}
                                minDate={moment().format("YYYY-MM-DD")}
                                maxDate={start_date}
                                onChange={handleChange}
                                value={early_bird_registration}
                                error={eError.early_bird_registration}
                              />
                            </div>
                            <div className="col-md-6 cmb-24">
                              <DatePicker
                                placeholder="Abstract Submission Date*"
                                id={`${kID}[abstract_submission]`}
                                minDate={moment().format("YYYY-MM-DD")}
                                maxDate={start_date}
                                onChange={handleChange}
                                value={abstract_submission}
                                error={eError.abstract_submission}
                              />
                            </div>
                            <div className="col-md-6 cmb-24">
                              <DatePicker
                                placeholder="Full Paper Submission*"
                                id={`${kID}[full_paper_submission]`}
                                minDate={moment().format("YYYY-MM-DD")}
                                maxDate={start_date}
                                onChange={handleChange}
                                value={full_paper_submission}
                                error={eError.full_paper_submission}
                              />
                            </div>
                            <div className="col-md-6 cmb-24">
                              <DatePicker
                                placeholder="Registration Deadline* "
                                id={`${kID}[registration_deadline]`}
                                minDate={moment().format("YYYY-MM-DD")}
                                maxDate={start_date}
                                onChange={handleChange}
                                value={registration_deadline}
                                error={eError.registration_deadline}
                              />
                            </div>

                            <div className="col-md-6 cmb-24">
                              <FileUpload
                                label="Upload Brochure*"
                                fileType="image"
                                fileText={getFilenameFromUrl(brochureFileName)}
                                id={`${kID}[brochure_image]`}
                                onChange={(e) => {
                                  const fileName = e.target.fileName;
                                  setFieldValue(
                                    `${kID}[brochureFileName]`,
                                    fileName
                                  );
                                  handleChange(e);
                                }}
                                value={brochure_image}
                                error={eError.brochure_image}
                              />
                            </div>

                            <div className="col-md-6 cmb-24">
                              <FileUpload
                                label="Upload Poster*"
                                fileType="image"
                                fileText={getFilenameFromUrl(posterFileName)}
                                id={`${kID}[poster_image]`}
                                onChange={(e) => {
                                  const fileName = e.target.fileName;
                                  setFieldValue(
                                    `${kID}[posterFileName]`,
                                    fileName
                                  );
                                  handleChange(e);
                                }}
                                value={poster_image}
                                error={eError.poster_image}
                              />
                            </div>
                            {speaker_details.map((elem, index) => {
                              const {
                                user_id,
                                designation,
                                institution,
                                country: sCountry,
                                photoFileName,
                                photo,
                              } = elem;
                              const {
                                user_id: errUserID,
                                designation: errDesignation,
                                institution: errInstitution,
                                country: errCountry,
                                photo: errPhoto,
                              } = eError?.speaker_details?.[index] || {};
                              const isAddBtn =
                                speaker_details.length - 1 === index;
                              const sID = `${kID}[speaker_details][${index}]`;
                              const existingList = map(
                                values?.event_details[eIndex]?.speaker_details,
                                "user_id"
                              );
                              const newUserList = userList.filter(
                                (o) =>
                                  !existingList.includes(o.id) ||
                                  user_id === o.id
                              );

                              return (
                                <React.Fragment key={index}>
                                  <div className="text-16-400 cmb-12">
                                    Speaker {index + 1}
                                  </div>
                                  <div className="col-md-6 cmb-24">
                                    <Dropdown
                                      placeholder="Select Speaker"
                                      id={`${sID}[user_id]`}
                                      options={newUserList}
                                      optionKey="id"
                                      optionValue="first_name"
                                      extraDisplayKey="last_name"
                                      isLoading={memberLoading}
                                      onChange={(e) => {
                                        const {
                                          designation,
                                          profile_photo_path,
                                          country_id,
                                        } = e.target?.data || {};
                                        const newObj = {
                                          ...elem,
                                          user_id: e.target.value,
                                          designation: designation || "",
                                          institution:
                                            institution_details?.institution_name ||
                                            "",
                                          country: country_id || "",
                                          photo: profile_photo_path,
                                          photoFileName:
                                            getFilenameFromUrl(
                                              profile_photo_path
                                            ),
                                        };
                                        handleChange({
                                          target: {
                                            id: sID,
                                            value: newObj,
                                          },
                                        });
                                      }}
                                      value={user_id}
                                      error={errUserID}
                                    />
                                  </div>
                                  <div className="col-md-6 cmb-24">
                                    <TextInput
                                      placeholder="Designation"
                                      id={`${sID}[designation]`}
                                      onChange={handleChange}
                                      value={designation}
                                      error={errDesignation}
                                    />
                                  </div>
                                  <div className="col-md-6 cmb-24">
                                    <TextInput
                                      placeholder="Institution/Organization Name"
                                      id={`${sID}[institution]`}
                                      onChange={handleChange}
                                      value={institution}
                                      error={errInstitution}
                                    />
                                  </div>
                                  <div className="col-md-6 cmb-24">
                                    <Location
                                      type="country"
                                      data={{
                                        id: `${sID}[country]`,
                                        placeholder: "Country",
                                        value: sCountry,
                                        error: errCountry,
                                        onChange: handleChange,
                                      }}
                                    />
                                  </div>
                                  <div className="col-md-6 cmb-24 d-flex align-items-center">
                                    <FileUpload
                                      label="Upload photo*"
                                      id={`${sID}[photo]`}
                                      acceptType={["png", "jpg", "jpeg"]}
                                      error={errPhoto}
                                      onChange={(e) => {
                                        const fileName = e.target.fileName;
                                        setFieldValue(
                                          `${sID}[photoFileName]`,
                                          fileName
                                        );
                                        handleChange(e);
                                      }}
                                      fileText={getFilenameFromUrl(
                                        photoFileName || photo
                                      )}
                                    />
                                  </div>
                                  <div
                                    className={`col-md-6 cmb-24 d-flex ${
                                      errPhoto
                                        ? "align-items-center"
                                        : "align-items-end"
                                    }`}
                                  >
                                    {isAddBtn ? (
                                      <Button
                                        onClick={() => {
                                          setFieldValue(
                                            `${kID}[speaker_details]`,
                                            [
                                              ...speaker_details,
                                              ...defaultSpeaker,
                                            ]
                                          );
                                        }}
                                        text="+ Add Speaker"
                                        btnStyle="primary-light"
                                        className="text-15-500"
                                        disabled={!isSpeakerData}
                                        isSquare
                                      />
                                    ) : (
                                      <Button
                                        onClick={() => {
                                          const listArray =
                                            cloneDeep(speaker_details);
                                          listArray.splice(index, 1);
                                          setFieldValue(
                                            `${kID}[speaker_details]`,
                                            listArray
                                          );
                                        }}
                                        btnStyle="delete-outline"
                                        icon={
                                          <i className="bi bi-trash me-2 d-flex align-items-center" />
                                        }
                                        text="Delete"
                                        isSquare
                                      />
                                    )}
                                  </div>
                                </React.Fragment>
                              );
                            })}
                            <div className="d-flex cmt-24">
                              {isAddEvent ? (
                                <Button
                                  isSquare
                                  text={`+ Add Another ${et.name}`}
                                  btnStyle="primary-outline"
                                  className="text-15-500"
                                  disabled={!isAddMore}
                                  onClick={() => {
                                    setFieldValue("event_details", [
                                      ...values.event_details,
                                      ...defaultData,
                                    ]);
                                  }}
                                />
                              ) : (
                                <Button
                                  onClick={() => {
                                    const listArray = cloneDeep(
                                      values.event_details
                                    );
                                    listArray.splice(eIndex, 1);
                                    setFieldValue("event_details", listArray);
                                  }}
                                  btnStyle="delete-outline"
                                  text="- Delete Event"
                                  isSquare
                                />
                              )}
                            </div>
                          </React.Fragment>
                        );
                      })}

                      <div className="d-flex justify-content-center gap-4 cpb-30 cmt-12">
                        <Button
                          isRounded
                          text="Submit"
                          btnStyle="primary-dark"
                          className="cps-40 cpe-40"
                          onClick={handleSubmit}
                          btnLoading={btnLoading}
                          disabled={isEqual(initialValues, values)}
                        />
                        <Button
                          isRounded
                          text="Cancel"
                          btnStyle="light-outline"
                          className="cps-40 cpe-40"
                          onClick={resetForm}
                        />
                      </div>
                    </form>
                  );
                }}
              </Formik>
            </div>
          </ToggleContainer>
        );
      })}
    </>
  );
};
export default InstitutionalPlanEventForm;
