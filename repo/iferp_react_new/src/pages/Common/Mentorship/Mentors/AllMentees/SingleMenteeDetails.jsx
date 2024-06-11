import CalendarLayout from "components/Layout/CalendarLayout";
import Card from "components/Layout/Card";
import Profile from "components/Layout/Profile";
import RemarkPopup from "components/Layout/RemarkPopup/RemarkPopup";
import Button from "components/form/Button";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { icons } from "utils/constants";
import { useDispatch } from "react-redux";
import {
  checkGroup,
  createGroup,
  handleReScheduledSession,
  mentessSessionDetails,
  sessionRequest,
  throwSuccess,
} from "store/slices";
import {
  INRtoUSD,
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import moment from "moment";
import "./SingleMenteeDetails.scss";

const SingleMenteeDetails = () => {
  const params = useParams();
  const { id } = params;
  const authUserDetails = getDataFromLocalStorage();
  const { personal_details = {}, exchange_rate } = authUserDetails;
  const isNational = personal_details?.country_name === "India";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [btnLoading, setBtnLoading] = useState(false);
  const [isRescheduleSession, setIsRescheduleSession] = useState(false);
  const [isRemarkPopup, setIsRemarkPopup] = useState(false);
  const [sessionData, setSessionData] = useState({});
  const [payloadData, setPayloadData] = useState({});
  const [payload, setPayload] = useState({
    book_session_id: "",
    mentor_id: "",
    mentee_id: "",
    session_id: "",
    session_date: "",
    start_time: "",
    end_time: "",
    reschedule_user_id: "",
    reschedule_session_id: "",
  });
  // const status = "completed";
  const userData = getDataFromLocalStorage();

  const fetchSessionData = async () => {
    const response = await dispatch(
      mentessSessionDetails(objectToFormData({ book_session_id: id }))
    );
    if (response?.status === 200) {
      setSessionData(response?.data || {});
    }
  };

  const handleRequestSession = async (obj) => {
    setBtnLoading(true);
    const response = await dispatch(sessionRequest(objectToFormData(obj)));
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      fetchSessionData();
    }
    setBtnLoading(false);
  };

  const handleRedirect = (link) => {
    window.open(link, "_blank");
  };

  useEffect(() => {
    fetchSessionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let UpdatedReSchedule =
    sessionData?.scheduled?.length > 1 &&
    sessionData?.scheduled[sessionData?.scheduled?.length - 1];

  const redirectToChat = (groupID, sessionId) => {
    navigate(
      `/professional/mentorship/mentor/my-submissions/chat/${groupID}/${sessionId}`
    );
  };

  const handelCreateGroup = async (sessionData) => {
    const userData = getDataFromLocalStorage();
    const mentorId = sessionData?.mentee_id;
    const sessionId = sessionData?.id;
    const response = await dispatch(
      checkGroup({
        userID: userData?.id,
        recieverID: mentorId,
      })
    );
    if (typeof response?.data === "number") {
      redirectToChat(response?.data, sessionId);
    } else {
      const response1 = await dispatch(
        createGroup({
          userID: userData?.id,
          recieverID: mentorId,
        })
      );
      if (response1?.status === 200) {
        redirectToChat(response1?.data[0]?.groupID, sessionId);
      }
    }
  };

  const minDate = moment().format("YYYY-MM-DD");
  const tz = sessionData?.time_zone?.[0]?.time_zone?.split("(");
  const tzValue = tz?.[tz?.length - 1]?.replace(")", "");

  const getLatestScheduleData = Array.isArray(sessionData?.scheduled)
    ? sessionData?.scheduled
    : [];

  const latestEntries =
    getLatestScheduleData?.length > 1
      ? getLatestScheduleData?.slice(getLatestScheduleData?.length - 1)
      : getLatestScheduleData;

  const price =
    sessionData?.session_id &&
    INRtoUSD(sessionData?.session_price, exchange_rate);
  const newPrice = parseFloat(price?.toFixed(2));

  return (
    <div className="details-m">
      <Card className="d-flex align-items-center cps-10 cpt-10 cpe-10 cpb-10 unset-br mb-3">
        <span
          className="d-flex"
          onClick={() => {
            navigate(-1);
            setIsRescheduleSession(false);
          }}
        >
          <img src={icons.leftArrow} alt="back" className="h-21 me-3 pointer" />
        </span>
        <div>{titleCaseString(sessionData?.user_name)}</div>
      </Card>

      <div className="row g-0">
        {isRemarkPopup && (
          <RemarkPopup
            setIsRemarkPopup={setIsRemarkPopup}
            data={payloadData}
            setData={setPayloadData}
            handleSuccess={() => {
              fetchSessionData();
            }}
          />
        )}
        <div className="col-md-8">
          <Card className="cps-20 cpt-20 cpe-20 cpb-20 session-info cme-10 cmb-15">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex gap-2 align-items-center cmb-15">
                <Profile
                  text={sessionData?.user_name}
                  isRounded
                  isS3UserURL
                  url={sessionData?.profile}
                />
                <div className="text-15-500 color-4453">
                  {titleCaseString(sessionData?.user_name)}
                </div>
              </div>
              {sessionData?.status && (
                <div className="d-flex gap-2 align-items-center">
                  <div
                    className={`status-completed ${
                      sessionData?.status === "Completed"
                        ? "bg-95ab"
                        : sessionData?.status === "Rejected"
                        ? "bg-1515"
                        : "bg-a74d"
                    }`}
                  />
                  <div className="dark-blue text-13-400">
                    {(sessionData?.status === "Pending" &&
                      "Upcoming Pending") ||
                      (sessionData?.status === "Accepted" &&
                        "Upcoming - Session Approved") ||
                      sessionData?.status}
                  </div>
                </div>
              )}
            </div>
            <div className="d-flex gap-2 align-items-center cmb-15">
              <div className="text-15-500-26 color-dark-navy-blue">
                {titleCaseString(sessionData?.session_name)}
              </div>
              {sessionData?.session_price && (
                <div>
                  {isNational
                    ? `₹ ${sessionData?.session_price}`
                    : `$ ${newPrice}`}
                </div>
              )}
            </div>
            <div className="d-flex align-items-center gap-4 cmb-15">
              <div
                className={`${
                  sessionData?.meeting_link &&
                  sessionData?.status === "Accepted" &&
                  "pointer"
                } d-flex gap-2 align-items-center`}
                onClick={() => {
                  sessionData?.status === "Accepted" &&
                    handleRedirect(sessionData?.meeting_link);
                }}
              >
                <img src={icons.videoMeet} alt="meet" />
                <div className="text-14-400-26 color-dark-blue cpt-2">
                  1:1 Video Meet
                </div>
              </div>
              {sessionData?.meeting_duration && (
                <div className="d-flex gap-2 align-items-center">
                  <img src={icons.clockTime} alt="clock" />
                  <div className="text-14-400-26 color-dark-blue">
                    {sessionData?.meeting_duration}
                  </div>
                </div>
              )}

              {sessionData?.rating_star && (
                <div className="d-flex gap-2 align-items-center">
                  <img src={icons.star} alt="star" />
                  <div className="text-14-500 color-dark-blue">
                    <span>{sessionData?.rating_star}</span> (
                    <span className="text-14-400 underline">
                      {`${sessionData?.rating_reveiw} Reviews`}
                    </span>
                    )
                  </div>
                </div>
              )}
            </div>

            {sessionData?.scheduled_on && (
              <div className="cmb-15 row">
                <div className="text-15-500-26 color-dark-navy-blue col-md-3">
                  Scheduled on
                </div>

                <div className="text-14-400 color-dark-navy-blues text-justify col-md-4">
                  {`${sessionData?.scheduled_on} ${tzValue}`}
                </div>
                <div className="col-md-6" />
              </div>
            )}

            <div className="cmb-15">
              {sessionData?.mentee_learn?.length > 0 && (
                <>
                  <div className="text-15-500-26 color-dark-navy-blue">
                    Mentee wants to learn
                  </div>
                  {sessionData?.mentee_learn && (
                    <div className="text-14-400 color-dark-navy-blues text-justify cmb-15">
                      {titleCaseString(sessionData?.mentee_learn)}
                    </div>
                  )}
                </>
              )}

              {sessionData?.scheduled?.length === 0 && (
                <>
                  <div className="row">
                    <div className="text-15-500-26 color-dark-navy-blue col-md-4 cmb-15">
                      Your's Confirmation
                    </div>
                    <div className="text-14-400 color-dark-navy-blues text-justify col-md-4 cmb-15">
                      {sessionData?.status === "Pending"
                        ? "Pending"
                        : sessionData?.status === "Accepted"
                        ? "Accepted"
                        : sessionData?.status === "Completed"
                        ? "Completed"
                        : sessionData?.status === "Rejected"
                        ? "Rejected"
                        : ""}
                    </div>
                  </div>

                  {sessionData?.status === "Accepted" && (
                    <div className="row">
                      <div className="text-15-500-26 color-dark-navy-blue col-md-4 cmb-15">
                        Meeting Link
                      </div>
                      <div
                        className="text-14-400 color-new-car text-justify col-md-4 cmb-15 pointer text-decoration-underline"
                        onClick={() => {
                          handleRedirect(sessionData?.meeting_link);
                        }}
                      >
                        {sessionData?.meeting_link}
                      </div>
                    </div>
                  )}

                  {sessionData?.status === "Rejected" && (
                    <div className="row">
                      <div className="text-15-500-26 color-dark-navy-blue col-md-4 cmb-15">
                        Rejection Reason
                      </div>
                      <div className="text-14-400 color-dark-navy-blues text-justify col-md-4 cmb-15">
                        {sessionData?.reject_resonse}
                      </div>
                    </div>
                  )}
                </>
              )}

              {sessionData?.scheduled?.length > 0 &&
                sessionData?.scheduled?.map((elem, index) => {
                  const { status, date, reschedule_by } = elem;
                  return (
                    <React.Fragment key={index}>
                      <div className="row">
                        <div className="text-15-500-26 color-dark-navy-blue col-md-3 cmb-15">
                          {reschedule_by === userData?.id
                            ? "Your Confirmation"
                            : "Mentee's Confirmation"}
                        </div>

                        <div className="text-14-400 color-dark-navy-blues text-justify col-md-3 cmb-15">
                          Rescheduled
                        </div>
                        <div className="col-md-6" />
                      </div>

                      <div className="row">
                        <div className="text-15-500-26 color-dark-navy-blue col-md-3 cmb-15">
                          {reschedule_by === userData?.id
                            ? "Request Sent On"
                            : "Requested On"}
                        </div>
                        <div className="text-14-400 color-dark-navy-blues text-justify col-md-3 cmb-15">
                          {`${date} ${tzValue}`}
                        </div>
                        <div className="col-md-6" />
                      </div>

                      {index + 1 === sessionData?.scheduled?.length && (
                        <>
                          <div className="row">
                            <div className="text-15-500-26 color-dark-navy-blue col-md-4 cmb-15">
                              {reschedule_by === userData?.id
                                ? "Mentee's Confirmation"
                                : "Your Confirmation"}
                            </div>
                            <div className="text-14-400 color-dark-navy-blues text-justify col-md-4 cmb-15">
                              {status === "Pending"
                                ? "Pending"
                                : status === "Accepted"
                                ? "Accepted"
                                : status === "Completed"
                                ? "Completed"
                                : reschedule_by !== userData?.id &&
                                  status === "Rejected"
                                ? "Rejected"
                                : "-"}
                            </div>
                          </div>

                          {status === "Rejected" && (
                            <div className="row">
                              <div className="text-15-500-26 color-dark-navy-blue col-md-4 cmb-15">
                                Rejection Reason
                              </div>
                              <div className="text-14-400 color-dark-navy-blues text-justify col-md-4 cmb-15">
                                {sessionData?.reject_resonse}
                              </div>
                            </div>
                          )}
                          {index + 1 === sessionData?.scheduled?.length &&
                            status === "Accepted" && (
                              <div className="row">
                                <div className="text-15-500-26 color-dark-navy-blue col-md-4 cmb-15">
                                  Meeting Link
                                </div>
                                <div
                                  className="text-14-400 color-new-car text-justify col-md-4 cmb-15 pointer text-decoration-underline"
                                  onClick={() => {
                                    handleRedirect(sessionData?.meeting_link);
                                  }}
                                >
                                  {sessionData?.meeting_link}
                                </div>
                              </div>
                            )}
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
            </div>
            <div
              className={
                sessionData?.status === "Pending"
                  ? "d-flex justify-content-between align-items-center"
                  : "d-flex justify-content-end"
              }
            >
              {sessionData?.status === "Pending" && (
                <div className="d-flex gap-3 align-items-center flex-wrap">
                  <Button
                    text="Accept Request"
                    btnStyle="primary-dark"
                    onClick={() => {
                      handleRequestSession({
                        book_session_id: id,
                        status: 1,
                        reschedule_user_id: sessionData?.mentee_id,
                        session_date: sessionData?.session_date,
                        start_time: sessionData?.start_date,
                        end_time: sessionData?.end_date,
                        reschedule_session_id: sessionData?.mentee_id,
                      });
                    }}
                    btnLoading={btnLoading}
                    disabled={
                      latestEntries?.[0]?.reschedule_by === userData?.id
                    }
                  />
                  <Button
                    text="Reschedule"
                    btnStyle="primary-outline"
                    onClick={() => {
                      setIsRescheduleSession(true);
                    }}
                  />
                  <div
                    className="pointer"
                    onClick={() => {
                      setPayloadData({
                        book_session_id: id,
                        status: 2,
                        reschedule_user_id: sessionData?.mentee_id,
                        session_date: sessionData?.session_date,
                        start_time: sessionData?.start_date,
                        end_time: sessionData?.end_date,
                        reschedule_session_id: sessionData?.mentee_id,
                      });
                      setIsRemarkPopup(true);
                    }}
                  >
                    Reject Request
                  </div>
                </div>
              )}
              <div className="d-flex chat-section position-relative">
                {sessionData?.badge !== 0 && (
                  <div className="position-absolute unread-msg d-flex text-14-400">
                    {sessionData?.badge}
                  </div>
                )}
                <Button
                  isRounded
                  text="Chat"
                  icon={<img src={icons.messageChat} alt="chat" />}
                  className="d-flex gap-2 bg-ebff color-new-car text-14-500"
                  onClick={() => handelCreateGroup(sessionData)}
                />
              </div>
            </div>
          </Card>

          {sessionData?.status === "Accepted" && (
            <Card className="cps-20 cpt-20 cpe-20 cpb-20 session-info cme-10 cmb-15">
              {/* static data */}

              <div className="text-15-500-26 color-dark-navy-blue cmb-15">
                Payment Overview
              </div>

              <div className="cmb-15 d-flex gap-4 align-items-center">
                <div className="text-15-500-26 color-dark-navy-blue">
                  Paid on
                </div>
                <div className="text-14-400 color-dark-navy-blues text-justify">
                  {sessionData?.payment_overview &&
                    moment(sessionData?.payment_overview).format("DD MMM YYYY")}
                </div>
              </div>

              {/* <div className="cmb-15 d-flex gap-3 align-items-center flex-wrap">
                <Button
                  text="Invoice"
                  btnStyle="primary-dark"
                  icon={<img src={icons.download} alt="download" />}
                  className="gap-2"
                />
              </div> */}
            </Card>
          )}
        </div>
        <div className="col-md-4">
          <Card className="cps-20 cpt-20 cpe-20 cpb-20 session-info cms-10">
            <CalendarLayout
              isScheduleDataAvailable
              displayScheduleData={sessionData}
              isSelectTime
              isReschedule={isRescheduleSession}
              reschedule_Session_iD={sessionData?.session_id}
              isRescheduleNavigate
              handleReschedulNavigate={() => {
                setIsRescheduleSession(false);
              }}
              isRescheduleAPIFunction
              reSchedulePayload={setPayload}
              handleRescheduleAPI={async () => {
                let newData = {
                  ...payload,
                  book_session_id: id,
                  mentor_id: sessionData?.mentee_id,
                  mentee_id: authUserDetails?.id,
                  session_id: sessionData?.session_id,
                  reschedule_user_id: authUserDetails?.id,
                  reschedule_session_id: UpdatedReSchedule?.id,
                };
                const formData = objectToFormData(newData);
                const response = await dispatch(
                  handleReScheduledSession(formData)
                );
                return response;
              }}
              handelSuccess={() => {
                fetchSessionData();
              }}
              sessionCustomizeTime={sessionData?.customize_time}
              sessionUnAvailableTime={sessionData?.unavalible_time}
              isBookingSession={true}
              minDate={minDate}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SingleMenteeDetails;
