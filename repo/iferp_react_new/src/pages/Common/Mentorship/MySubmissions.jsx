import Card from "components/Layout/Card";
import FeedbackPopup from "components/Layout/FeedbackPopup/FeedbackPopup";
import Loader from "components/Layout/Loader";
import Profile from "components/Layout/Profile";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import { omit } from "lodash";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchScheduledSession,
  sessionRequest,
  setBookingSessionId,
  setIsRescheduleTIme,
  setReScheduleSessionData,
  throwError,
  throwSuccess,
  createGroup,
  checkGroup,
} from "store/slices";
import { icons, limit, myseduleStatus } from "utils/constants";
import {
  INRtoUSD,
  getDataFromLocalStorage,
  getUserType,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import "./MySubmissions.scss";
import { cloneDeep } from "lodash";

const MySubmissions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const memberType = getUserType();
  const userData = getDataFromLocalStorage();
  const { personal_details, exchange_rate } = userData;
  const isNational = personal_details?.country_name === "India";
  const [statusText, setStatusText] = useState(null);
  const [isFeedback, setIsFeedback] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [scrollLoader, setScrollLoader] = useState(false);
  const [sessionsList, setSessionsList] = useState({
    status: "",
    is_approve: "",
    // reschedule_approve: "",
    data: [],
    loading: true,
    total: 0,
    offset: 0,
    limit: 10,
  });
  const [ratingData, setRatingData] = useState(null);
  const listRef = useRef();
  const offSetRef = useRef(0);
  const totalDocRef = useRef(0);

  const redirectToChat = (groupID, sessionId) => {
    navigate(
      `/professional/mentorship/mentee/my-submissions/chat/${groupID}/${sessionId}`
    );
  };

  const handelCreateGroup = async (elem) => {
    const userData = getDataFromLocalStorage();
    const mentorId = elem?.mentor_id;
    const sessionId = elem?.book_session_id;

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

  const getSessionsList = async (obj, isReset) => {
    setScrollLoader(true);
    let payload = {};
    payload = omit({ ...obj, offset: offSetRef.current }, [
      "data",
      "loading",
      "total",
    ]);

    const formData = objectToFormData(payload);
    const response = await dispatch(fetchScheduledSession(formData));
    if (response?.status === 200) {
      offSetRef.current = offSetRef.current + obj?.limit;
      totalDocRef.current = response?.data?.result_count;
      setSessionsList((prev) => {
        let resData = response?.data?.result_data || [];

        let listData = isReset ? resData : [...prev?.data, ...resData];
        return {
          ...prev,
          data: listData,
          total: response?.data?.result_count,
          loading: false,
        };
      });
    } else {
      dispatch(throwError(response?.message));
    }
    setScrollLoader(false);
  };
  const handleRequestSession = async (data) => {
    setBtnLoading(true);
    const response = await dispatch(sessionRequest(objectToFormData(data)));
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      offSetRef.current = 0;
      getSessionsList(sessionsList, true);
    }
    setBtnLoading(false);
  };

  useEffect(() => {
    offSetRef.current = 0;
    getSessionsList(sessionsList, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRedirect = (link) => {
    window.open(link, "_blank");
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - Math.ceil(e.target.scrollTop) ===
      e.target.clientHeight;
    if (bottom) {
      let oldData = cloneDeep({
        ...sessionsList,
        offset: sessionsList.offset + limit,
      });
      setSessionsList(oldData);
      getSessionsList(oldData);
    }
  };

  const { data, total } = sessionsList;
  return (
    <div id="all-my-submission-container">
      {isFeedback && (
        <FeedbackPopup
          setIsFeedback={setIsFeedback}
          ratingData={ratingData}
          setRatingData={setRatingData}
          handleSuccess={() => {
            let newData = {
              ...sessionsList,
              offset: 0,
              loading: true,
            };
            getSessionsList(newData, true);
          }}
        />
      )}
      <div className="d-flex justify-content-between align-items-center cmb-20">
        <div className="text-16-500 color-text-navy">
          All Submissions ({sessionsList?.total})
        </div>
        <div className="d-flex gap-3">
          {/* <div className="d-flex gap-2 align-items-center text-14-500-26 color-text-navy">
            <img src={icons.filterIcon} alt="filter" />
            Filter Status
          </div> */}
          <Dropdown
            value={statusText}
            options={myseduleStatus}
            placeholder="Filter Status"
            optionValue="value"
            optionKey="value"
            onChange={(e) => {
              setStatusText(e?.target?.value);
              const { status, is_approve } = e?.target?.data?.id || {};
              let newData = {
                ...sessionsList,
                status: status,
                // offset: 0,
                is_approve: is_approve,
                loading: true,
              };
              offSetRef.current = 0;
              listRef?.current?.scrollTo({
                top: 0,
                behavior: "smooth",
              });
              totalDocRef.current = 0;
              setSessionsList(newData);
              getSessionsList(newData, true);
            }}
            isRounded
          />
        </div>
      </div>
      <div
        className="row g-0 testing my-submission-card-container"
        ref={listRef}
        onScroll={(e) => {
          if (data?.length < total) {
            handleScroll(e);
          }
        }}
      >
        {sessionsList?.loading && (
          <Card className="cpt-50 cpb-50">
            <Loader size="sm" />
          </Card>
        )}
        {!sessionsList?.loading &&
          (data?.length === 0 ? (
            <Card className="unset-br cps-10 cpt-50 cpe-10 cpb-50 text-center">
              No Records Found.
            </Card>
          ) : (
            data?.map((elem, index) => {
              const {
                id,
                book_session_id,
                name,
                status,
                session_name,
                session_price,
                mentor_id,
                meeting_link,
                meeting_duration,
                profile,
                reschedule_data,
                isReviewDone,
                session_date,
                start_time,
                end_time,
                reject_resonse,
                time_zone,
              } = elem;

              const isAccept =
                reschedule_data?.length > 0 &&
                reschedule_data?.find((o) => o?.reschedule_by !== userData?.id);
              const tz = time_zone?.split("(");
              const tzValue = tz?.[tz?.length - 1]?.replace(")", "");

              const price = INRtoUSD(session_price, exchange_rate);
              const newPrice = parseFloat(price?.toFixed(2));
              return (
                <div className="col-md-6 cmb-10" key={index}>
                  <div className="cpe-10">
                    <Card className="unset-br cps-10 cpt-10 cpe-10 cpb-10">
                      <div className="d-flex justify-content-between align-items-center cmb-10">
                        <div className="d-flex align-items-center gap-2">
                          <Profile
                            text={name}
                            isRounded
                            isS3UserURL
                            url={profile}
                            size="s-48"
                          />
                          <div className="text-15-500-26 color-3146">
                            {titleCaseString(name)}
                          </div>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                          <div
                            className={`status-completed ${
                              status === "Completed"
                                ? "bg-95ab"
                                : status === "Rejected"
                                ? "bg-1515"
                                : "bg-a74d"
                            }`}
                          />
                          <div className="dark-blue text-13-400">{status}</div>
                        </div>
                      </div>

                      <div className="text-15-500-26 color-dark-navy-blue cmb-10">
                        {`${titleCaseString(session_name)} - ${
                          isNational ? `₹${session_price}` : `$${newPrice}`
                        }`}
                      </div>

                      <div className="d-flex align-items-center gap-5 cmb-10">
                        {meeting_link && (
                          <div
                            className={`${
                              meeting_link && "pointer"
                            } d-flex gap-2 align-items-center`}
                            onClick={() => {
                              status === "Upcoming - Session Approved" &&
                                handleRedirect(meeting_link);
                            }}
                          >
                            <img src={icons.videoMeet} alt="meet" />
                            <div className="text-14-400 color-dark-blue cpt-2">
                              1:1 Video Meet
                            </div>
                          </div>
                        )}
                        {meeting_duration && (
                          <div className="d-flex gap-2 align-items-center">
                            <img src={icons.clockTime} alt="clock" />
                            <div className="text-14-400 color-dark-blue">
                              {meeting_duration}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="row">
                        <div className="text-15-500-26 color-dark-navy-blue col-md-4 cmb-15">
                          Schedule On
                        </div>
                        <div className="text-14-400 color-dark-navy-blues text-justify col-md-4 cmb-15">
                          {`${session_date}, ${start_time} ${tzValue}`}
                        </div>
                      </div>

                      {reschedule_data?.length === 0 && (
                        <>
                          <div className="row">
                            <div className="text-15-500-26 color-dark-navy-blue col-md-4 cmb-15">
                              Speaker's Confirmation
                            </div>
                            <div className="text-14-400 color-dark-navy-blues text-justify col-md-4 cmb-15">
                              {status === "Upcoming - Session Pending"
                                ? "Pending"
                                : status === "Upcoming - Session Approved"
                                ? "Accepted"
                                : status === "Completed"
                                ? "Completed"
                                : status === "Rejected"
                                ? "Rejected"
                                : ""}
                            </div>
                          </div>

                          {status === "Upcoming - Session Approved" && (
                            <div className="row">
                              <div className="text-15-500-26 color-dark-navy-blue col-md-4 cmb-15">
                                Meeting Link
                              </div>
                              <div
                                className="text-14-400 color-new-car text-justify col-md-4 cmb-15 pointer text-decoration-underline"
                                onClick={() => {
                                  handleRedirect(meeting_link);
                                }}
                              >
                                {meeting_link}
                              </div>
                            </div>
                          )}

                          {status === "Rejected" && (
                            <div className="row">
                              <div className="text-15-500-26 color-dark-navy-blue col-md-4 cmb-15">
                                Rejection Reason
                              </div>
                              <div className="text-14-400 color-dark-navy-blues text-justify col-md-4 cmb-15">
                                {reject_resonse}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {reschedule_data?.length > 0 &&
                        reschedule_data?.map((elem, cIndex) => {
                          const { schedule_on, reschedule_by } = elem;
                          return (
                            <React.Fragment key={cIndex}>
                              <div className="row">
                                <div className="text-15-500-26 color-dark-navy-blue col-md-4 cmb-15">
                                  {reschedule_by === userData?.id
                                    ? "Your Confirmation"
                                    : "Speaker's Confirmation"}
                                </div>
                                <div className="text-14-400 color-dark-navy-blues text-justify col-md-4 cmb-15">
                                  Rescheduled
                                </div>
                                <div className="col-md-4" />
                              </div>
                              <div className="row">
                                <div className="text-15-500-26 color-dark-navy-blue col-md-4 cmb-15">
                                  {reschedule_by === userData?.id
                                    ? "Request Sent On"
                                    : "Requested On"}
                                </div>
                                <div className="text-14-400 color-dark-navy-blues text-justify col-md-4 cmb-15">
                                  {`${schedule_on} ${tzValue}`}
                                </div>
                                <div className="col-md-4" />
                              </div>
                              {cIndex + 1 === reschedule_data?.length && (
                                <>
                                  <div className="row">
                                    <div className="text-15-500-26 color-dark-navy-blue col-md-4 cmb-15">
                                      {reschedule_by === userData?.id
                                        ? "Speaker's Confirmation"
                                        : "Your Confirmation"}
                                    </div>
                                    <div className="text-14-400 color-dark-navy-blues text-justify col-md-4 cmb-15">
                                      {status === "Upcoming - Session Pending"
                                        ? "Pending"
                                        : status ===
                                          "Upcoming - Session Approved"
                                        ? "Accepted"
                                        : status === "Completed"
                                        ? "Completed"
                                        : reschedule_by === userData?.id &&
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
                                        {reject_resonse}
                                      </div>
                                    </div>
                                  )}

                                  {cIndex + 1 === reschedule_data?.length &&
                                    status ===
                                      "Upcoming - Session Approved" && (
                                      <div className="row">
                                        <div className="text-15-500-26 color-dark-navy-blue col-md-4 cmb-15">
                                          Meeting Link
                                        </div>
                                        <div
                                          className="text-14-400 color-new-car text-justify col-md-4 cmb-15 pointer text-decoration-underline"
                                          onClick={() => {
                                            handleRedirect(meeting_link);
                                          }}
                                        >
                                          {meeting_link}
                                        </div>
                                        {/* <div className="col-md-3 cmb-15">
                                          <div
                                            className="d-flex color-new-car text-15-700 pointer"
                                            onClick={() => {
                                              handleRedirect(meeting_link);
                                            }}
                                          >
                                            Join
                                          </div>
                                        </div> */}
                                      </div>
                                    )}
                                </>
                              )}
                            </React.Fragment>
                          );
                        })}
                      <div
                        className={`${
                          status === "Upcoming - Session Pending"
                            ? "justify-content-between"
                            : status === "Completed" &&
                              "justify-content-between"
                          //  "justify-content-end"
                        } d-flex align-items-center cmt-20`}
                      >
                        {status === "Upcoming - Session Pending" && (
                          <div className="d-flex gap-3 align-items-center">
                            {reschedule_data?.length > 0 && isAccept && (
                              <Button
                                btnStyle="primary-dark"
                                text="Accept Request"
                                onClick={() => {
                                  setSessionId(book_session_id);
                                  let payload = {
                                    book_session_id: book_session_id,
                                    status: 1,
                                    reschedule_user_id: mentor_id,
                                    session_date: session_date,
                                    start_time: start_time,
                                    end_time: end_time,
                                    reschedule_session_id: mentor_id,
                                  };
                                  handleRequestSession(payload);
                                }}
                                btnLoading={
                                  book_session_id === sessionId && btnLoading
                                }
                              />
                            )}

                            <div
                              className="text-15-400-26 color-text-blue pointer"
                              onClick={() => {
                                dispatch(setBookingSessionId(book_session_id));
                                dispatch(
                                  setReScheduleSessionData(reschedule_data)
                                );
                                dispatch(setIsRescheduleTIme(true));
                                navigate(
                                  `/${memberType}/mentorship/mentee/book-session/${id}`
                                );
                              }}
                            >
                              Reschedule Meeting{" "}
                            </div>
                          </div>
                        )}

                        {status === "Completed" && (
                          <div className="d-flex">
                            <Button
                              className={`d-flex gap-2 ${
                                isReviewDone && "disabled-block"
                              }`}
                              btnStyle="primary-outline "
                              text="Add Review"
                              icon={<img src={icons.addSquare} alt="add" />}
                              onClick={() => {
                                setRatingData(elem);
                                setIsFeedback(true);
                              }}
                            />
                          </div>
                        )}

                        <div className="d-flex chat-section position-relative">
                          {elem?.badge !== 0 && (
                            <div className="position-absolute unread-msg d-flex text-14-400">
                              {elem?.badge}
                            </div>
                          )}
                          <Button
                            isRounded
                            text="Chat"
                            icon={<img src={icons.messageChat} alt="chat" />}
                            className="d-flex gap-2 bg-ebff color-new-car text-14-500"
                            onClick={() => handelCreateGroup(elem)}
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })
          ))}
        {!sessionsList?.loading && scrollLoader && (
          <div className="cpt-30 cpb-30">
            <Loader size="sm" />
          </div>
        )}
      </div>
      {/* </>
      )} */}
    </div>
  );
};

export default MySubmissions;
