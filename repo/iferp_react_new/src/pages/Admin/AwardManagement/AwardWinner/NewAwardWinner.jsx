import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { cloneDeep, isEqual, map, omit } from "lodash";
import * as Yup from "yup";
import Dropdown from "components/form/Dropdown";
import Button from "components/form/Button/Button";
import { awardTypeOptions, icons } from "utils/constants";
import TextInput from "components/form/TextInput";
import FileUpload from "components/form/FileUpload";
import { getFilenameFromUrl, objectToFormData } from "utils/helpers";
import {
  addAwardWinners,
  editAwardWinners,
  fetchAllEvents,
  fetchUserByEvents,
} from "store/slices";

const NewAwardWinner = ({ editData, fileAcceptTypes }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isEventLoading, setEventLoading] = useState(true);
  const [isMemberLoading, setMemberLoading] = useState(false);
  const handelSave = (values) => {
    setBtnLoading(true);
    values = {
      ...values,
      award_winner_details: map(values.award_winner_details, (o) => {
        o.user_id = o.userid;
        return omit(o, ["paperFileName", "fileName"]);
      }),
    };

    if (isEdit) {
      handelUpdate({
        ...values.award_winner_details[0],
        id: editData.id,
        event_id: values.eventid,
      });
    } else {
      handelAdd({
        ...values,
        award_winner_details: JSON.stringify(values.award_winner_details),
        route: "navigate/demo",
      });
    }
  };
  const getEventUsers = async (id) => {
    const response = await dispatch(fetchUserByEvents(id));
    let userDataList = [];
    if (response?.data?.users) {
      userDataList = response?.data?.users;
    }
    setUserList(userDataList);
    setMemberLoading(false);
  };
  const getAllEvents = async () => {
    const response = await dispatch(fetchAllEvents());
    let eventData = [];
    if (response.data?.events) {
      eventData = response.data?.events;
    }
    setEventList(eventData);
    setEventLoading(false);
  };
  const handelAdd = async (data) => {
    let forData = objectToFormData(data);
    const response = await dispatch(addAwardWinners(forData));
    if (response?.status === 200) {
      navigate(-1);
    } else {
      setBtnLoading(false);
    }
  };
  const handelUpdate = async (data) => {
    let forData = objectToFormData(data);
    const response = await dispatch(editAwardWinners(forData));
    if (response?.status === 200) {
      navigate(-1);
    } else {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    getAllEvents();
    if (params?.awardWinnerId !== "add-award-winners") {
      setIsEdit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (editData?.eventId) {
      getEventUsers(editData?.eventId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData]);

  const validationSchema = Yup.object().shape({
    eventid: Yup.string().required("Event is required."),
    award_winner_details: Yup.array(
      Yup.object({
        userid: Yup.string().required("Name is required."),
        award_type: Yup.string().required("Award type is required."),
        certificate: Yup.string().required("Certificate is required."),
        paper_file: Yup.string().required("Paper is required."),
      })
    ),
  });
  const initialValues = {
    eventid: editData?.eventId || "",
    award_winner_details: [
      {
        userid: editData?.userId || "",
        memberId: editData?.userMemberId || "",
        award_type: editData?.awardType || "",
        certificate: editData?.certificate || "",
        fileName: getFilenameFromUrl(editData?.certificate || "") || "",
        paper_file: editData?.paper_file || "",
        paperFileName: getFilenameFromUrl(editData?.paper_file || "") || "",
      },
    ],
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handelSave}
      validationSchema={validationSchema}
      enableReinitialize
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
        return (
          <form>
            <div className="row">
              <div className="col-md-12 col-12 cmb-22">
                <Dropdown
                  isRequired
                  id="eventid"
                  label="Event Name"
                  placeholder="Select Event Name"
                  value={values.eventid}
                  options={eventList}
                  optionValue="event_name"
                  isLoading={isEventLoading}
                  error={errors?.eventid}
                  onChange={(e) => {
                    resetForm();
                    setMemberLoading(true);
                    getEventUsers(e.target.value);
                    handleChange(e);
                  }}
                />
              </div>
              {values?.award_winner_details.map((elem, index) => {
                const {
                  userid,
                  award_type,
                  fileName,
                  paperFileName,
                  memberId,
                } = elem;
                const currentError =
                  errors?.award_winner_details?.[index] || {};
                const {
                  userid: errUserid,
                  award_type: errawardType,
                  certificate: errCertificate,
                  paper_file: errPaperFile,
                } = currentError;
                return (
                  <React.Fragment key={index}>
                    {values?.award_winner_details.length > 1 && (
                      <div className="col-md-12 col-12 cmb-12 d-flex align-items-end justify-content-end">
                        <Button
                          isSquare
                          btnStyle="light-outline"
                          icon={<img src={icons.deleteIcon} alt="delete" />}
                          onClick={() => {
                            const listArray = cloneDeep(
                              values?.award_winner_details
                            );
                            listArray.splice(index, 1);
                            setFieldValue("award_winner_details", listArray);
                          }}
                        />
                      </div>
                    )}

                    <div className="col-md-6 col-12 cmb-22">
                      <Dropdown
                        isRequired
                        label="Award Winner Name"
                        id={`award_winner_details[${index}][userid]`}
                        placeholder="Select Award Winner Name"
                        value={userid}
                        options={userList}
                        optionValue="name"
                        error={errUserid}
                        isLoading={isMemberLoading}
                        onChange={(e) => {
                          const data = e.target.data;
                          handleChange({
                            target: {
                              id: `award_winner_details[${index}][memberId]`,
                              value: data.memberId,
                            },
                          });
                          handleChange(e);
                        }}
                      />
                    </div>
                    <div className="col-md-6 col-12 cmb-22">
                      <TextInput
                        label="Award Winner Member ID"
                        value={memberId}
                        placeholder="Member ID"
                        id="memberId"
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 col-12 cmb-22">
                      <Dropdown
                        isRequired
                        label="Award Type"
                        placeholder="Select Award Type"
                        value={award_type}
                        options={awardTypeOptions}
                        optionKey="value"
                        optionValue="value"
                        id={`award_winner_details[${index}][award_type]`}
                        onChange={handleChange}
                        error={errawardType}
                      />
                    </div>
                    <div className="col-md-6 col-12 cmb-22">
                      <FileUpload
                        label="Certificate"
                        isRequired
                        id={`award_winner_details[${index}][certificate]`}
                        onChange={(e) => {
                          const fileName = e.target.fileName;

                          handleChange({
                            target: {
                              id: `award_winner_details[${index}][fileName]`,
                              value: fileName,
                            },
                          });
                          handleChange(e);
                        }}
                        fileText={fileName || "Certificate"}
                        error={errCertificate}
                        acceptType={fileAcceptTypes}
                      />
                    </div>
                    <div className="col-md-6 col-12 cmb-22">
                      <FileUpload
                        label="Paper File"
                        id={`award_winner_details[${index}][paper_file]`}
                        onChange={(e) => {
                          const fileName = e.target.fileName;
                          handleChange({
                            target: {
                              id: `award_winner_details[${index}][paperFileName]`,
                              value: fileName,
                            },
                          });
                          handleChange(e);
                        }}
                        fileText={paperFileName || "Paper File"}
                        error={errPaperFile}
                        acceptType={fileAcceptTypes}
                      />
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {!isEdit && (
              <div className="col-md-6 col-12 d-flex">
                <Button
                  onClick={() => {
                    const newArray = [
                      {
                        userid: "",
                        memberId: "",
                        award_type: "",
                        certificate: "",
                        fileName: "",
                        paper_file: "",
                        paperFileName: "",
                      },
                    ];
                    setFieldValue("award_winner_details", [
                      ...values?.award_winner_details,
                      ...newArray,
                    ]);
                  }}
                  text="+ Add AwardWinner"
                  btnStyle="primary-light"
                  className="h-35 text-14-500"
                  isSquare
                />
              </div>
            )}
            <div className="d-flex justify-content-center gap-4 cmt-20">
              <Button
                text="Cancel"
                isRounded
                btnStyle="light-outline"
                className="cps-40 cpe-40"
                onClick={resetForm}
              />
              <Button
                isRounded
                text="Done"
                btnStyle="primary-dark"
                className="cps-40 cpe-40"
                onClick={handleSubmit}
                btnLoading={btnLoading}
                disabled={isEqual(values, initialValues)}
              />
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default NewAwardWinner;
