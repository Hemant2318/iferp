import Modal from "components/Layout/Modal";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import TextEditor from "components/form/TextEditor";
import TextInput from "components/form/TextInput";
import { Formik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useRef } from "react";
import { icons, speechCategory } from "utils/constants";
import {
  getEventDate,
  numberOnlyFromInput,
  objectToFormData,
} from "utils/helpers";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchAllEvents, sendInvitation } from "store/slices";
import { cloneDeep } from "lodash";
import SpeakerPoster from "./SpeakerPoster";
import ProffetionalDropdown from "components/form/ProffetionalDropdown";

const SentInvitationForm = ({ onHide }) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [isEventLoading, setEventLoading] = useState(true);
  // const [timer, setTimer] = useState("");
  // const [userDetails, setUserDetails] = useState({
  //   userList: [],
  //   offset: 0,
  //   limit: limit,
  //   isLoading: true,
  //   name: "",
  //   total: 0,
  //   user_type: "2",
  // });
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();
  const formRef = useRef();

  const handelSave = async (values) => {
    const data = {
      ...values,
      speaker_file_upload: files.length ? files[0] : "",
    };
    setBtnLoading(true);
    const formData = objectToFormData(data);
    const response = await dispatch(sendInvitation(formData));
    if (response?.status === 200) {
      if (formRef.current) {
        formRef.current.resetForm();
      }
      onHide();
    }
    setBtnLoading(false);
  };

  const getBase64 = (file, res) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      res(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  const changeFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      getBase64(file, (result) => {
        const oldData = cloneDeep(files);
        setFiles([...oldData, result]);
      });
    }
  };

  const getAllEvents = async () => {
    const response = await dispatch(fetchAllEvents());
    let eventData = response.data?.events || [];
    setEventList(
      eventData?.map((elm) => {
        return {
          id: elm.id,
          label: `${elm.event_name} - ${getEventDate(
            elm.start_date,
            elm.end_date
          )}`,
          event_name: elm.event_name,
        };
      })
    );
    setEventLoading(false);
  };

  // const getProfiles = async (obj, isReset) => {
  //   let queryParams = new URLSearchParams(
  //     omit(obj, ["userList", "total", "isLoading"])
  //   ).toString();
  //   const response = await dispatch(fetchUserType(queryParams));
  //   if (response?.status === 200) {
  //     setUserDetails((prev) => {
  //       const apiData = response?.data?.user_details || [];
  //       let newData = isReset ? apiData : [...prev.userList, ...apiData];
  //       return {
  //         ...prev,
  //         total: response?.data?.result_count,
  //         userList: newData,
  //         isLoading: false,
  //       };
  //     });
  //   }
  // };

  // const handelProfessionalScroll = () => {
  //   if (userDetails.userList.length < userDetails.total) {
  //     let oldData = cloneDeep({
  //       ...userDetails,
  //       offset: userDetails.offset + limit,
  //       isLoading: true,
  //     });
  //     setUserDetails(oldData);
  //     getProfiles(oldData);
  //   }
  // };

  // const handelSearchProfessional = (e) => {
  //   let time = timer;
  //   clearTimeout(time);
  //   time = setTimeout(() => {
  //     let oldData = cloneDeep({
  //       ...userDetails,
  //       offset: 0,
  //       name: lowerCase(e),
  //       isLoading: true,
  //     });
  //     setUserDetails(oldData);
  //     getProfiles(oldData, true);
  //   }, 800);
  //   setTimer(time);
  // };

  useEffect(() => {
    getAllEvents();
    // getProfiles(userDetails, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.lazy((_, obj) => {
      const { is_email } = obj?.parent;
      if (!is_email) {
        return Yup.string().required("Speaker name is required.");
      } else {
        return Yup.string();
      }
    }),
    invite_user_name: Yup.lazy((_, obj) => {
      const { is_email } = obj?.parent;
      if (is_email) {
        return Yup.string().required("Enter Speaker name");
      } else {
        return Yup.string();
      }
    }),
    email: Yup.string()
      .email("Email must be a valid email")
      .required("Email is required."),
  });
  const initialValues = {
    invite_user_name: "",
    name: "",
    user_id: "",
    userData: {},
    email: "",
    contact: "",
    country_code: "IN",
    event_id: "",
    event_name: "",
    session_name: "",
    speech_category: "",
    message: "",
    speaker_file_upload: "",
    speaker_poster: "",
    is_email: false,
  };
  return (
    <Modal onHide={onHide} title="Speaker Invitation" size="md">
      <div className="cmt-34 cms-20 cme-20 cmb-34">
        <Formik
          initialValues={initialValues}
          onSubmit={handelSave}
          validationSchema={validationSchema}
          innerRef={formRef}
        >
          {(props) => {
            const {
              values,
              errors,
              handleChange,
              setFieldValue,
              resetForm,
              handleSubmit,
            } = props;
            const { userData, event_name, is_email, invite_user_name } = values;

            return (
              <form>
                <div className="row d-flex justify-conent-between align-items-center cmb-26">
                  <div className="col-md-12 cmb-22">
                    {is_email ? (
                      <TextInput
                        label="Speaker Name"
                        placeholder="Enter Speaker's Name"
                        id="invite_user_name"
                        value={invite_user_name}
                        onChange={handleChange}
                        handelCancel={(e) => {
                          setFieldValue("is_email", false);
                          setFieldValue("email", "");
                          setFieldValue("contact", "");
                          setFieldValue("invite_user_name", "");
                        }}
                      />
                    ) : (
                      <ProffetionalDropdown
                        error={errors.name}
                        id="user_id"
                        placeholder="Select Speaker’s Name"
                        existingList={[]}
                        handelInvite={() => {
                          setFieldValue("is_email", true);
                          setFieldValue("email", "");
                          setFieldValue("contact", "");
                          setFieldValue("user_id", "");
                          setFieldValue("name", "");
                        }}
                        value={values.user_id}
                        onChange={(e) => {
                          setFieldValue("name", e.target?.data?.name);
                          setFieldValue("email", e.target?.data?.email_id);
                          setFieldValue(
                            "contact",
                            e.target?.data?.phone_number
                          );
                          setFieldValue(
                            "country_code",
                            e.target?.data?.country_code
                          );
                          setFieldValue("userData", e.target?.data);
                          handleChange(e);
                        }}
                      />
                    )}

                    {/* <Dropdown
                      label="Speaker Name*"
                      placeholder="Enter Speaker’s Name"
                      id="user_id"
                      value={values.user_id}
                      error={errors.name}
                      options={userDetails?.userList}
                      optionValue="name"
                      optionKey="id"
                      isLoading={userDetails?.isLoading}
                      onChange={(e) => {
                        setFieldValue("name", e.target?.data?.name);
                        setFieldValue("email", e.target?.data?.email_id);
                        setFieldValue("contact", e.target?.data?.phone_number);
                        setFieldValue(
                          "country_code",
                          e.target?.data?.country_code
                        );
                        setFieldValue("userData", e.target?.data);
                        handleChange(e);
                      }}
                      onMenuScrollToBottom={handelProfessionalScroll}
                      onInputChange={handelSearchProfessional}
                    /> */}
                  </div>
                  <div className="col-md-12 cmb-22">
                    <TextInput
                      label="Email ID*"
                      placeholder="Enter Speaker’s Email Address"
                      id="email"
                      onChange={handleChange}
                      value={values.email}
                      error={errors.email}
                      disabled={!is_email}
                    />
                  </div>
                  <div className="col-md-12 cmb-22">
                    <TextInput
                      isPhoneNumber
                      label="Contact Number"
                      id="contact"
                      type="number"
                      placeholder="Enter Contact Number"
                      value={values.contact}
                      phoneNumberData={{
                        id: "country_code",
                        value: values.country_code,
                      }}
                      onChange={(e) => {
                        if (e.target.id === "contact") {
                          handleChange(numberOnlyFromInput(e));
                        } else {
                          handleChange(e);
                          handleChange({
                            target: { id: "contact", value: "" },
                          });
                        }
                      }}
                      disabled={!is_email}
                    />
                  </div>
                  <div className="col-md-12 cmb-22">
                    <Dropdown
                      label="Event Name"
                      id="event_id"
                      placeholder="Select Event Name"
                      value={values.event_id}
                      options={eventList}
                      isLoading={isEventLoading}
                      onChange={(e) => {
                        setFieldValue(
                          "event_name",
                          e?.target?.data?.event_name
                        );
                        handleChange(e);
                      }}
                    />
                  </div>
                  <div className="col-md-12 cmb-22">
                    <TextInput
                      label="Session Name"
                      placeholder="Enter Session's Name"
                      id="session_name"
                      onChange={handleChange}
                      value={values.session_name}
                    />
                  </div>
                  <div className="col-md-12 cmb-22">
                    <Dropdown
                      label="Speech Category"
                      id="speech_category"
                      placeholder="Select Speech Category"
                      options={speechCategory}
                      value={values.speech_category}
                      optionKey="value"
                      optionValue="value"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-12 cmb-22">
                    <TextEditor
                      label="Message"
                      placeholder="Enter Comments, If any"
                      id="message"
                      value={values.message}
                      onChange={handleChange}
                      files={files}
                      onRemoveFile={(list) => {
                        setFiles(list);
                      }}
                    />
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <label id="compose-file-input">
                      <span>
                        <i className="bi bi-paperclip pointer" />
                      </span>
                      <input
                        type="file"
                        name="Select File"
                        id="speaker_file_upload"
                        onChange={(e) => {
                          // setFieldValue(
                          //   "speaker_file_upload",
                          //   e.target.files[0]
                          // );
                          changeFile(e);
                        }}
                      />
                    </label>
                    <label id="compose-file-input">
                      <span>
                        <i
                          className="bi bi-trash pointer"
                          onClick={() => {
                            setFiles([]);
                            resetForm();
                          }}
                        />
                      </span>
                    </label>
                  </div>
                  <div className="col-md-12 d-flex justify-content-center align-items-center flex-wrap gap-4">
                    <Button
                      text="Cancel"
                      isRounded
                      btnStyle="light-outline"
                      className="cps-30 cpe-30"
                      onClick={onHide}
                    />
                    <Button
                      text="Send"
                      isRounded
                      btnStyle="primary-dark"
                      className="cps-30 cpe-30 gap-2"
                      onClick={handleSubmit}
                      btnLoading={btnLoading}
                      rightIcon={<img src={icons.sendMessage} alt="logo" />}
                    />
                  </div>
                </div>

                <SpeakerPoster
                  onChange={(e) => {
                    handleChange({
                      target: {
                        id: "speaker_poster",
                        value: e,
                      },
                    });
                  }}
                  data={{
                    ...userData,
                    event_name: event_name,
                  }}
                />
              </form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};

export default SentInvitationForm;
