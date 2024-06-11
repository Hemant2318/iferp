import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { forEach, isEqual } from "lodash";
import { Formik } from "formik";
import { omit } from "lodash";
import Label from "components/form/Label";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import TextInput from "components/form/TextInput";
import FileUpload from "components/form/FileUpload";
import {
  getDataFromLocalStorage,
  getEventDate,
  getFilenameFromUrl,
  objectToFormData,
} from "utils/helpers";
import { fetchAllEvents } from "store/slices";
import InfoField from "./InfoFiled";
import { speechCategory } from "utils/constants";
import SpeakerPoster from "pages/Admin/CareerManagement/BecomeKeynoteSpeaker/AllApplications/SentInvitationForm/SpeakerPoster";

const BecomeAKeynoteSpeaker = ({
  handelSaveCareer,
  btnLoading,
  reset,
  setReset,
}) => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const [eventList, setEventList] = useState([]);
  const fetchEventDetails = async () => {
    const formData = objectToFormData({ status: "Upcoming" });
    const response = await dispatch(fetchAllEvents(formData));
    let newList = [];
    forEach(response?.data?.events, (elm) => {
      newList.push({
        id: elm.id,
        label: `${elm.event_name} - ${getEventDate(
          elm.start_date,
          elm.end_date
        )}`,
      });
    });

    setEventList(newList);
  };

  useEffect(() => {
    if (reset) {
      if (formRef.current) {
        formRef.current.resetForm();
      }
    }
    setReset(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  useEffect(() => {
    fetchEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handelSave = (values) => {
    handelSaveCareer(omit(values, ["recentPresentationFileName"]));
  };

  const validationSchema = Yup.object().shape({
    specialization: Yup.string().required("Specialization is required."),
    event_id: Yup.string().required("Event is required."),
    url_latest_lecture_video: Yup.string().required(
      "Latest lecture video url is required."
    ),
    recent_presentation: Yup.string().required(
      "Recent presentation is required."
    ),
    session_name: Yup.string().required("Session Name is required."),
    speech_category: Yup.string().required("Speech Category is required."),
  });
  const initialValues = {
    specialization: "",
    event_id: "",
    url_latest_lecture_video: "",
    recent_presentation: "",
    recentPresentationFileName: "",
    session_name: "",
    speech_category: "",
    event_name: "",
    speaker_poster: "",
  };
  const {
    first_name,
    last_name,
    profile_photo_path,
    professional_details = {},
    user_type,
  } = getDataFromLocalStorage() || {};
  const { designation, institution_name } = professional_details;

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handelSave}
    >
      {(props) => {
        const {
          values,
          errors,
          handleSubmit,
          setFieldValue,
          resetForm,
          handleChange,
        } = props;
        const { event_name } = values;

        return (
          <form className="row cmt-40">
            {/* {show && (
              <Modal
                onHide={() => {
                  setShow(false);
                }}
              >
                <SpeakerPoster
                  isVisible
                  data={{
                    name: `${first_name} ${last_name}`,
                    profile_photo_path,
                    designation,
                    institution_name,
                    event_name,
                  }}
                  onChange={(e) => {
                    console.log(e);
                  }}
                />
              </Modal>
            )} */}
            <InfoField />
            <div className="col-md-6 cmb-22">
              <TextInput
                id="specialization"
                value={values.specialization}
                placeholder="Specialization"
                onChange={handleChange}
                error={errors?.specialization}
              />
            </div>
            <div className="cmb-22 d-flex align-items-center">
              <div className="me-3">
                <Label label="Conference Name" required />
              </div>
              <div className="flex-grow-1">
                <Dropdown
                  options={eventList}
                  placeholder="Select Conference"
                  id="event_id"
                  onChange={(e) => {
                    setFieldValue("event_name", e.target.data.label);
                    handleChange(e);
                  }}
                  value={values.event_id}
                  error={errors?.event_id}
                />
              </div>
            </div>
            <div className="col-md-6 cmb-22">
              <FileUpload
                id="recent_presentation"
                onChange={(e) => {
                  const id = e.target.id;
                  const value = e.target.value;
                  const fileName = e.target.fileName;
                  setFieldValue("recentPresentationFileName", fileName);
                  setFieldValue(id, value);
                }}
                fileText={getFilenameFromUrl(
                  values?.recentPresentationFileName ||
                    values.recent_presentation ||
                    "Recent Presentation*"
                )}
                error={errors?.recent_presentation}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                id="url_latest_lecture_video"
                value={values.url_latest_lecture_video}
                placeholder="URL of latest lecture video"
                onChange={handleChange}
                error={errors?.url_latest_lecture_video}
              />
            </div>

            <div className="col-md-6 cmb-22">
              <TextInput
                id="session_name"
                value={values.session_name}
                placeholder="Enter Session Name (Research Topic)*"
                onChange={handleChange}
                error={errors?.session_name}
              />
            </div>

            <div className="col-md-6 cmb-22">
              <Dropdown
                options={speechCategory}
                optionKey="value"
                optionValue="value"
                placeholder="Select Speech Category*"
                id="speech_category"
                onChange={handleChange}
                value={values.speech_category}
                error={errors?.speech_category}
              />
            </div>
            {user_type === "2" ? (
              <>
                <div
                  className={`d-flex justify-content-center align-items-center ${
                    event_name ? "col-md-6 cmb-22" : ""
                  }`}
                >
                  <div className="d-flex justify-content-center align-items-center gap-4">
                    <Button
                      isRounded
                      text="Cancel"
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
                      disabled={isEqual(values, initialValues)}
                    />
                  </div>
                </div>
                {event_name && (
                  <div className="col-md-6 cmb-22">
                    <SpeakerPoster
                      isVisible
                      data={{
                        name: `${first_name} ${last_name}`,
                        profile_photo_path,
                        designation,
                        institution_name,
                        event_name,
                      }}
                      onChange={(e) => {
                        setFieldValue("speaker_poster", e);
                      }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="d-flex justify-content-center gap-4 mt-3">
                <Button
                  isRounded
                  text="Cancel"
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
                  disabled={isEqual(values, initialValues)}
                />
              </div>
            )}
          </form>
        );
      }}
    </Formik>
  );
};
export default BecomeAKeynoteSpeaker;
