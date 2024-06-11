import { useEffect, useState } from "react";
import { map, find, forEach, isEqual, omit } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "components/form/Button";
import TextArea from "components/form/TextArea";
import Dropdown from "components/form/Dropdown";
import TextInput from "components/form/TextInput";
import TimePicker from "components/form/TimePicker";
import FileUpload from "components/form/FileUpload";
import MultipleSelect from "components/form/MultipleSelect";
import Modal from "components/Layout/Modal";
import { addAgenda, getEvent } from "store/slices";
import {
  getFilenameFromUrl,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";

const SessionForm = ({ onHide, sessionId, handelSuccess }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const { eventName, eventAgendas, speakerDetails } = useSelector((state) => ({
    eventName: state.global.eventData.event_name,
    eventAgendas: state.global.eventData.event_agendas,
    speakerDetails: state.global.eventData.speaker_details,
  }));
  const newSpeakerDetails = speakerDetails?.filter((o) => {
    return o?.name;
  });
  const [btnLoading, setBtnLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    id: "",
    session_time: "",
    name: "",
    date: "",
    description: "",
    speaker_id: "",
    transcription: "",
    transcriptionFileName: "",
  });

  const fetchEventDetails = async () => {
    await dispatch(getEvent(params?.eventId));
  };
  const handelSave = async (values) => {
    const formValue = omit(values, "transcriptionFileName");
    setBtnLoading(true);
    let findAgenda = find(eventAgendas, (o) => o.date === formValue.date);
    if (sessionId && sessionId !== "+1") {
      findAgenda = {
        event_id: params?.eventId,
        ...findAgenda,
        agenda_sessions: JSON.stringify(
          map(findAgenda.agenda_sessions, (o) => {
            if (o.id === sessionId) {
              return formValue;
            } else {
              return o;
            }
          })
        ),
      };
    } else {
      findAgenda = {
        ...findAgenda,
        event_id: params?.eventId,
        date: formValue?.date,
        agenda_sessions: JSON.stringify([
          ...findAgenda.agenda_sessions,
          { ...formValue },
        ]),
      };
    }
    const payload = objectToFormData(findAgenda);
    const response = await dispatch(addAgenda(payload));
    if (response?.status === 200) {
      fetchEventDetails();
      if (handelSuccess) {
        handelSuccess();
      }
      onHide();
    }
    setBtnLoading(false);
  };

  useEffect(() => {
    if (sessionId && sessionId !== "+1") {
      let findObject = {};
      forEach(eventAgendas, (o) =>
        forEach(o.agenda_sessions, (y) => {
          if (y.id === sessionId) {
            findObject = y;
          }
        })
      );
      setInitialValues(findObject);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, eventAgendas]);

  useEffect(() => {
    if (!eventAgendas) {
      fetchEventDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    session_time: Yup.string().required("Time is required."),
    date: Yup.string().required("Date is required."),
    description: Yup.string()
      .required("Description is required.")
      .max(100, "Maximum 100 character allow for this field."),
    speaker_id: Yup.string().required("Speakers is required."),
    transcription: Yup.string().required("Transcription is required."),
  });
  return (
    <Modal
      onHide={onHide}
      title={sessionId && sessionId !== "+1" ? "Edit Session" : "Add Session"}
      // size="md"
    >
      {/* <Card className="d-flex align-items-center unset-br cmt-20 cpe-26 cps-26 cpt-30 cpb-30"> */}
      <div className="cmt-20 cpe-26 cps-26 col-md-12 col-10">
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
              setFieldValue,
              handleChange,
              handleSubmit,
            } = props;
            return (
              <form>
                <div className="row">
                  <div className="col-md-12 col-12 cmb-22">
                    <TextInput
                      label="Event Name"
                      placeholder="Event Name"
                      onChange={() => {}}
                      value={eventName}
                      disabled
                    />
                  </div>
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-6 col-12 cmb-22">
                        <Dropdown
                          label="Date"
                          id="date"
                          placeholder="Select Date"
                          value={values.date}
                          error={errors.date}
                          options={eventAgendas || []}
                          optionKey="date"
                          optionValue="date"
                          onChange={handleChange}
                          disabled={sessionId && sessionId !== "+1"}
                        />
                      </div>
                      <div className="col-md-6 col-12 cmb-22">
                        <TimePicker
                          label="Time"
                          placeholder="Enter Session Time"
                          id="session_time"
                          onChange={(e) => {
                            const id = e.target.id;
                            const value = e.target.value;
                            setFieldValue(id, value);
                          }}
                          value={values.session_time}
                          error={errors.session_time}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12 col-12 cmb-22">
                    <TextInput
                      label="Session Name"
                      placeholder="name"
                      id="name"
                      onChange={(e) => {
                        const id = e.target.id;
                        const value = titleCaseString(e.target.value);
                        setFieldValue(id, value);
                      }}
                      value={values.name}
                      error={errors.name}
                    />
                  </div>

                  <div className="col-md-12 col-12 cmb-22">
                    <TextArea
                      label="Description"
                      placeholder="Description"
                      rows={3}
                      id="description"
                      onChange={(e) => {
                        const id = e.target.id;
                        const value = titleCaseString(e.target.value);
                        setFieldValue(id, value);
                      }}
                      value={values.description}
                      error={errors.description}
                    />
                  </div>

                  <div className="col-md-12 col-12 cmb-22">
                    <MultipleSelect
                      label="Speaker"
                      placeholder="Select Speakers"
                      id="speaker_id"
                      value={values.speaker_id}
                      error={errors.speaker_id}
                      options={newSpeakerDetails || []}
                      optionKey="id"
                      optionValue="name"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-12 col-12 cmb-22">
                    <FileUpload
                      label="Transcription"
                      id="transcription"
                      onChange={(e) => {
                        const id = e.target.id;
                        const value = e.target.value;
                        const fileName = e.target.fileName;
                        setFieldValue("transcriptionFileName", fileName);
                        setFieldValue(id, value);
                      }}
                      fileText={getFilenameFromUrl(
                        values?.transcriptionFileName || values.transcription
                      )}
                      error={errors.transcription}
                    />
                  </div>
                  <div className="d-flex justify-content-center gap-4 cmt-30 col-12">
                    <Button
                      text="Cancel"
                      isRounded
                      btnStyle="light-outline"
                      className="cps-40 cpe-40"
                      onClick={onHide}
                    />
                    <Button
                      isRounded
                      text="Done"
                      btnStyle="primary-dark"
                      className="cps-40 cpe-40"
                      btnLoading={btnLoading}
                      disabled={isEqual(values, initialValues)}
                      onClick={handleSubmit}
                    />
                  </div>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
      {/* </Card> */}
    </Modal>
  );
};
export default SessionForm;
