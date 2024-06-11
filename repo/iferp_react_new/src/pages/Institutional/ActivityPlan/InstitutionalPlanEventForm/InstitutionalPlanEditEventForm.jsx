import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { cloneDeep, isEqual, map, omit } from "lodash";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import Location from "components/form/Location";
import TextInput from "components/form/TextInput";
import DatePicker from "components/form/DatePicker";
import FileUpload from "components/form/FileUpload";
import Card from "components/Layout/Card";
import { icons } from "utils/constants";
import {
  editInstitutionalEvents,
  getInstitutionalMembers,
  getEvent,
} from "store/slices";
import {
  getFilenameFromUrl,
  objectToFormData,
  titleCaseString,
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

const InstitutionalPlanEventForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { eventData } = useSelector((state) => ({
    eventData: state.global.eventData,
  }));
  const [btnLoading, setBtnLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(true);
  const [userList, setUserList] = useState([]);
  const [initialValues, setInitialValues] = useState({
    id: "",
    event_type: "",
    event_type_name: "",
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
  });
  const handelSave = async (values) => {
    setBtnLoading(true);
    const payload = omit(values, ["posterFileName", "brochureFileName"]);
    const response = await dispatch(editInstitutionalEvents(payload));
    if (response?.status === 200) {
      navigate("/institutional/activity-plan/institutional-plan");
    }
    setBtnLoading(false);
  };
  const fetchEventDetails = async () => {
    await dispatch(getEvent(params?.eventId));
  };
  const getProfiles = async () => {
    const response = await dispatch(
      getInstitutionalMembers(objectToFormData({ type: "faculty" }))
    );

    setUserList(response?.data?.members || []);
    setMemberLoading(false);
  };
  useEffect(() => {
    getProfiles();
    fetchEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (eventData) {
      setInitialValues({
        id: params?.eventId,
        event_type: eventData?.event_type_id,
        event_type_name: eventData?.event_type,
        event_name: eventData?.event_name,
        start_date: eventData?.start_date,
        end_date: eventData?.end_date,
        country: eventData?.country,
        city: eventData?.city,
        early_bird_registration: eventData?.dates?.early_bird_registration,
        abstract_submission: eventData?.dates?.abstract_submission,
        full_paper_submission: eventData?.dates?.full_paper_submission,
        registration_deadline: eventData?.dates?.registration_deadline,
        brochure_image: eventData?.brochure_path,
        poster_image: eventData?.poster_path,
        speaker_details: eventData?.speaker_details,
        brochureFileName: getFilenameFromUrl(eventData?.brochure_path),
        posterFileName: getFilenameFromUrl(eventData?.poster_path),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventData]);

  const validationSchema = Yup.object().shape({
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
  });

  return (
    <>
      <Card className="d-flex gap-3 unset-br cps-30 cpt-10 cpb-10 mb-3">
        <div
          onClick={() => {
            navigate("/institutional/activity-plan/institutional-plan");
          }}
        >
          <img src={icons.leftArrow} alt="back" className="h-21 me-3 pointer" />
        </div>
        <div>Edit Event Details</div>
      </Card>
      <Card className="unset-br cps-30 cpt-30 cpe-30 cpb-30">
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
              handleSubmit,
              setFieldValue,
              resetForm,
            } = props;
            const {
              event_type_name,
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
            } = values;
            const isSpeakerData = speaker_details?.every(
              (o) =>
                o.user_id &&
                o.designation &&
                o.institution &&
                o.country &&
                o.photo
            );
            const {
              event_name: errEventName,
              start_date: errStartDate,
              end_date: errEndDate,
              country: errCountry,
              city: errCity,
              early_bird_registration: errEarlyBird,
              abstract_submission: errAbstractSubmission,
              full_paper_submission: errPaperSubmission,
              registration_deadline: errRegistrationDeadline,
              brochure_image: errBrochureImage,
              poster_image: errPosterImage,
            } = errors;
            return (
              <form className="row">
                <div className="cmb-24">
                  <TextInput
                    isRequired
                    label={`${event_type_name} Name`}
                    placeholder={`Enter Your ${event_type_name} Name`}
                    id="event_name"
                    onChange={handleChange}
                    value={event_name}
                    error={errEventName}
                  />
                </div>
                <div className="col-md-6 cmb-24">
                  <DatePicker
                    placeholder="Start Date*"
                    id="start_date"
                    onChange={(e) => {
                      handleChange(e);
                      setFieldValue("end_date", "");
                    }}
                    value={start_date}
                    error={errStartDate}
                    minDate={moment()}
                  />
                </div>
                <div className="col-md-6 cmb-24">
                  <DatePicker
                    placeholder="End Date*"
                    id="end_date"
                    onChange={handleChange}
                    value={end_date}
                    error={errEndDate}
                    minDate={start_date}
                    disabled={!start_date}
                  />
                </div>
                <div className="col-md-6 cmb-24">
                  <Location
                    type="country"
                    data={{
                      id: "country",
                      placeholder: "Select Country*",
                      value: country,
                      error: errCountry,
                      onChange: handleChange,
                    }}
                  />
                </div>
                <div className="col-md-6 cmb-24">
                  <Location
                    type="city"
                    data={{
                      id: "city",
                      placeholder: "Select City*",
                      value: city,
                      error: errCity,
                      countryId: country,
                      onChange: handleChange,
                      disabled: !country,
                    }}
                  />
                </div>
                <div className="col-md-6 cmb-24">
                  <DatePicker
                    placeholder="Early Bird Registration Date*"
                    id="early_bird_registration"
                    minDate={moment().format("YYYY-MM-DD")}
                    maxDate={start_date}
                    onChange={handleChange}
                    value={early_bird_registration}
                    error={errEarlyBird}
                  />
                </div>
                <div className="col-md-6 cmb-24">
                  <DatePicker
                    placeholder="Abstract Submission Date*"
                    id="abstract_submission"
                    minDate={moment().format("YYYY-MM-DD")}
                    maxDate={start_date}
                    onChange={handleChange}
                    value={abstract_submission}
                    error={errAbstractSubmission}
                  />
                </div>
                <div className="col-md-6 cmb-24">
                  <DatePicker
                    placeholder="Full Paper Submission*"
                    id="full_paper_submission"
                    minDate={moment().format("YYYY-MM-DD")}
                    maxDate={start_date}
                    onChange={handleChange}
                    value={full_paper_submission}
                    error={errPaperSubmission}
                  />
                </div>
                <div className="col-md-6 cmb-24">
                  <DatePicker
                    placeholder="Registration Deadline* "
                    id="registration_deadline"
                    minDate={moment().format("YYYY-MM-DD")}
                    maxDate={start_date}
                    onChange={handleChange}
                    value={registration_deadline}
                    error={errRegistrationDeadline}
                  />
                </div>

                <div className="col-md-6 cmb-24">
                  <FileUpload
                    isRequired
                    label="Upload Brochure"
                    fileType="image"
                    fileText={getFilenameFromUrl(brochureFileName)}
                    id="brochure_image"
                    value={brochure_image}
                    error={errBrochureImage}
                    onChange={(e) => {
                      const fileName = e.target.fileName;
                      setFieldValue("brochureFileName", fileName);
                      handleChange(e);
                    }}
                  />
                </div>

                <div className="col-md-6 cmb-24">
                  <FileUpload
                    isRequired
                    label="Upload Poster"
                    fileType="image"
                    id="poster_image"
                    value={poster_image}
                    error={errPosterImage}
                    fileText={getFilenameFromUrl(posterFileName)}
                    onChange={(e) => {
                      const fileName = e.target.fileName;
                      setFieldValue("posterFileName", fileName);
                      handleChange(e);
                    }}
                  />
                </div>
                {speaker_details?.map((elem, index) => {
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
                  } = errors?.speaker_details?.[index] || {};
                  const isAddBtn = speaker_details.length - 1 === index;
                  const sID = `speaker_details[${index}]`;
                  const existingList = map(values?.speaker_details, "user_id");
                  const newUserList = userList.filter(
                    (o) => !existingList.includes(o.id) || user_id === o.id
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
                            setFieldValue(
                              `${sID}[designation]`,
                              e.target?.data?.department_name
                            );
                            handleChange(e);
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
                          onChange={(e) => {
                            const id = e.target.id;
                            const value = titleCaseString(e.target.value);
                            setFieldValue(id, value);
                          }}
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
                      <div className="col-md-6 cmb-24">
                        <FileUpload
                          isRequired
                          label="Upload photo"
                          id={`${sID}[photo]`}
                          onChange={(e) => {
                            const fileName = e.target.fileName;
                            setFieldValue(`${sID}[photoFileName]`, fileName);
                            handleChange(e);
                          }}
                          fileText={getFilenameFromUrl(photoFileName || photo)}
                          error={errPhoto}
                        />
                      </div>
                      <div className="col-md-6 cmb-24 d-flex align-items-end">
                        {isAddBtn ? (
                          <Button
                            onClick={() => {
                              setFieldValue("speaker_details", [
                                ...speaker_details,
                                ...defaultSpeaker,
                              ]);
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
                              const listArray = cloneDeep(speaker_details);
                              listArray.splice(index, 1);
                              setFieldValue("speaker_details", listArray);
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

                <div className="d-flex justify-content-center gap-4 cpb-30 cmt-12">
                  <Button
                    isRounded
                    text="Update"
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
      </Card>
    </>
  );
};
export default InstitutionalPlanEventForm;
