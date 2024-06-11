import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep, isEqual } from "lodash";
import { Formik } from "formik";
import Label from "components/form/Label";
import Button from "components/form/Button";
import TextArea from "components/form/TextArea";
import TextInput from "components/form/TextInput";
import TimePicker from "components/form/TimePicker";
import FileUpload from "components/form/FileUpload";
import MultipleSelect from "components/form/MultipleSelect";
import Card from "components/Layout/Card";
import ToggleContainer from "components/Layout/ToggleContainer";
import { icons } from "utils/constants";
import { addAgenda, getEvent, storeEventData } from "store/slices";
import {
  formatDate,
  getEventDate,
  getFilenameFromUrl,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";

const AgendaForm = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { eventData } = useSelector((state) => ({
    eventData: state.global.eventData,
  }));
  const [btnLoading, setBtnLoading] = useState("");
  const [initialValues, setInitialValues] = useState([]);
  const [toggleIndex, setToggleIndex] = useState(0);

  const fetchEventDetails = async () => {
    await dispatch(getEvent(params?.eventId));
  };
  const handelSave = async (elem, index) => {
    setBtnLoading(elem.date);
    const payloadData = {
      ...elem,
      agenda_sessions: JSON.stringify(elem.agenda_sessions),
      event_id: params?.eventId,
    };
    const payload = objectToFormData(payloadData);
    const response = await dispatch(addAgenda(payload));
    if (response?.status === 200) {
      let newList = cloneDeep(initialValues);
      newList[index] = response.data;
      setInitialValues(newList);
    }
    setBtnLoading("");
  };

  useEffect(() => {
    fetchEventDetails();
    return () => {
      dispatch(storeEventData({}));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const agendasList = [];
    if (eventData?.event_agendas) {
      eventData?.event_agendas.forEach((elem) => {
        agendasList.push({
          ...elem,
          agenda_sessions:
            elem.agenda_sessions.length > 0
              ? elem.agenda_sessions
              : [
                  {
                    id: "",
                    session_time: "",
                    name: "",
                    description: "",
                    speaker_id: "",
                    transcription: "",
                    transcriptionFileName: "",
                  },
                ],
        });
      });
    }
    setInitialValues(agendasList);
  }, [eventData]);

  return (
    <div className="">
      <Card className="d-flex align-items-center unset-br cpe-26 cps-26 pt-2 pb-2">
        <div className="w-100 d-flex align-items-center justify-content-between">
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
            <div>{`${
              params.agandaId === "edit-agenda" ? "Edit" : "Add"
            } Agenda`}</div>
          </div>
          <div className="d-flex gap-3">
            <div>
              Event Date:{" "}
              {getEventDate(eventData?.start_date, eventData?.end_date)}
            </div>
          </div>
        </div>
      </Card>

      <Formik initialValues={initialValues} enableReinitialize>
        {(props) => {
          const { values, setFieldValue, handleChange } = props;
          return (
            <div className="fadeInUp">
              {values.map((elem, index) => {
                return (
                  <div className="mt-3" key={index}>
                    <ToggleContainer
                      title={`Add Day ${index + 1} Sessions`}
                      onSubmit={() => {}}
                      defaultOpen={index === toggleIndex}
                      onClick={() => {
                        setToggleIndex(index);
                      }}
                    >
                      <div className="row pt-3">
                        <div className="col-md-2 col-12 d-flex align-items-center cmb-22">
                          <Label label="Event Name" />
                        </div>
                        <div className="col-md-10 col-12 cmb-22">
                          <TextInput
                            placeholder="Event Name"
                            onChange={() => {}}
                            value={eventData?.event_name}
                            disabled
                          />
                        </div>
                        <div className="col-md-12">
                          {elem.agenda_sessions.map((childElem, childIndex) => {
                            const lastElem =
                              elem.agenda_sessions.length - 1 === childIndex;
                            const isButton =
                              !childElem?.session_time ||
                              !childElem?.name ||
                              !childElem?.description ||
                              !childElem?.speaker_id ||
                              !childElem?.transcription;
                            return (
                              <div className="row mb-3" key={childIndex}>
                                {elem.agenda_sessions.length > 1 && (
                                  <div className="d-flex justify-content-end mb-2">
                                    <Button
                                      onClick={() => {
                                        const listArray = cloneDeep(
                                          elem.agenda_sessions
                                        );
                                        listArray.splice(childIndex, 1);
                                        setFieldValue([index], {
                                          ...elem,
                                          agenda_sessions: listArray,
                                        });
                                      }}
                                      btnStyle="delete-outline"
                                      icon={
                                        <i className="bi bi-trash me-2 d-flex align-items-center" />
                                      }
                                      text="Delete"
                                      className="cpt-5 cpb-5 cps-10 cpe-10"
                                      isSquare
                                    />
                                  </div>
                                )}
                                <div className="col-md-2 col-12 d-flex align-items-center cmb-22">
                                  <Label label={`Day ${index + 1}`} />
                                </div>
                                <div className="col-md-5 col-12 cmb-22">
                                  <TextInput
                                    placeholder="Select Date"
                                    onChange={() => {}}
                                    value={formatDate(
                                      elem?.date,
                                      "DD MMM YYYY"
                                    )}
                                    disabled
                                  />
                                </div>
                                <div className="col-md-5 col-12 cmb-22">
                                  <TimePicker
                                    placeholder="Enter Session Time"
                                    id={`[${index}][agenda_sessions][${childIndex}][session_time]`}
                                    onChange={(e) => {
                                      const id = e.target.id;
                                      const value = titleCaseString(
                                        e.target.value
                                      );
                                      setFieldValue(id, value);
                                    }}
                                    value={childElem?.session_time}
                                  />
                                </div>
                                <div className="col-md-2 d-flex align-items-center cmb-22">
                                  <Label label="Session Name" />
                                </div>
                                <div className="col-md-10 cmb-22">
                                  <TextInput
                                    placeholder="name"
                                    id={`[${index}][agenda_sessions][${childIndex}][name]`}
                                    onChange={(e) => {
                                      const id = e.target.id;
                                      const value = titleCaseString(
                                        e.target.value
                                      );
                                      setFieldValue(id, value);
                                    }}
                                    value={childElem.name}
                                  />
                                </div>
                                <div className="col-md-2 d-flex align-items-center cmb-22">
                                  <Label label="Description" />
                                </div>
                                <div className="col-md-10 cmb-22">
                                  <TextArea
                                    placeholder="Description"
                                    rows={3}
                                    id={`[${index}][agenda_sessions][${childIndex}][description]`}
                                    onChange={(e) => {
                                      const id = e.target.id;
                                      const value = titleCaseString(
                                        e.target.value
                                      );
                                      setFieldValue(id, value);
                                    }}
                                    value={childElem.description}
                                  />
                                </div>
                                <div className="col-md-2 d-flex align-items-center cmb-22">
                                  <Label label="Speaker" />
                                </div>
                                <div className="col-md-10 cmb-22">
                                  <MultipleSelect
                                    placeholder="Select Speakers"
                                    id={`[${index}][agenda_sessions][${childIndex}][speaker_id]`}
                                    value={childElem.speaker_id}
                                    options={eventData?.speaker_details || []}
                                    optionKey="id"
                                    optionValue="name"
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="col-md-2 d-flex align-items-center cmb-22">
                                  <Label label="Transcription" />
                                </div>
                                <div className="col-md-10 cmb-22">
                                  <FileUpload
                                    id={`[${index}][agenda_sessions][${childIndex}][transcription]`}
                                    onChange={(e) => {
                                      const id = e.target.id;
                                      const value = e.target.value;
                                      const fileName = e.target.fileName;
                                      setFieldValue(
                                        `[${index}][agenda_sessions][${childIndex}][transcriptionFileName]`,
                                        fileName
                                      );
                                      setFieldValue(id, value);
                                    }}
                                    fileText={getFilenameFromUrl(
                                      childElem?.transcriptionFileName ||
                                        childElem.transcription
                                    )}
                                  />
                                </div>
                                {lastElem && (
                                  <div className="d-flex">
                                    <Button
                                      onClick={() => {
                                        let newArray = elem.agenda_sessions;
                                        newArray.push({
                                          id: "",
                                          session_time: "",
                                          name: "",
                                          description: "",
                                          speaker_id: "",
                                          transcription: "",
                                        });
                                        setFieldValue([index], {
                                          ...elem,
                                          agenda_sessions: newArray,
                                        });
                                      }}
                                      text="+ Add Next Session"
                                      btnStyle="primary-light"
                                      className="text-14-500 cps-20 cpe-20"
                                      disabled={isButton}
                                      isSquare
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="d-flex justify-content-center gap-4 cmt-30 cpb-20">
                          <Button
                            text="Cancel"
                            isRounded
                            btnStyle="light-outline"
                            className="cps-40 cpe-40"
                            onClick={() => {}}
                          />
                          <Button
                            isRounded
                            text="Done"
                            btnStyle="primary-dark"
                            className="cps-40 cpe-40"
                            btnLoading={btnLoading === `${elem.date}`}
                            disabled={isEqual(elem, initialValues[index])}
                            onClick={() => {
                              handelSave(elem, index);
                            }}
                          />
                        </div>
                      </div>
                    </ToggleContainer>
                  </div>
                );
              })}
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default AgendaForm;
