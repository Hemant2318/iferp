import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Profile from "components/Layout/Profile";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import { omit } from "lodash";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchScheduledSession,
  sessionRequest,
  throwError,
  throwSuccess,
} from "store/slices";
import { icons, limit, myseduleStatus } from "utils/constants";
import {
  getDataFromLocalStorage,
  getFromLocalStorage,
  objectToFormData,
  removeFromLocalStorage,
  titleCaseString,
} from "utils/helpers";
import "./DetailsMentee.scss";
import { cloneDeep } from "lodash";
const DetailsMentee = () => {
  const userData = getDataFromLocalStorage();
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const offsetRef = useRef(0);
  const totalDocRef = useRef(0);
  const listRef = useRef();
  const { singleMenteeDetails } = useSelector((state) => ({
    singleMenteeDetails: state.mentorshipManagement.singleMenteeDetails,
  }));
  const [statusText, setStatusText] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [scrollLoader, setScrollLoader] = useState(false);
  const [submissionsList, setSubmissionsList] = useState({
    status: "",
    is_approve: "",
    reschedule_approve: "",
    mentee_id: params?.id,
    data: [],
    loading: true,
    total: 0,
    offset: 0,
    limit: 10,
  });
  const handleRequestSession = async (data) => {
    setBtnLoading(true);
    const response = await dispatch(sessionRequest(objectToFormData(data)));
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      fetchMenteesSessionList(submissionsList);
    }
    setBtnLoading(false);
  };
  const handelScroll = (e) => {
    const bottom =
      e.target.scrollHeight - Math.ceil(e.target.scrollTop) ===
      e.target.clientHeight;
    if (bottom) {
      let oldData = cloneDeep({
        ...submissionsList,
        offset: submissionsList.offset + limit,
      });
      setSubmissionsList(oldData);
      fetchMenteesSessionList(oldData);
    }
  };
  const fetchMenteesSessionList = async (obj, isReset) => {
    setScrollLoader(true);
    let payload = {};
    payload = omit(
      {
        ...obj,
        offset: offsetRef.current,
      },
      ["data", "loading", "total"]
    );
    const response = await dispatch(
      fetchScheduledSession(objectToFormData(payload))
    );
    if (response?.status === 200) {
      offsetRef.current = offsetRef.current + obj?.limit;
      totalDocRef.current = response?.data?.result_count;
      setSubmissionsList((prev) => {
        let resData = response?.data?.result_data || [];
        let listData = isReset ? resData : [...prev?.data, ...resData];
        return {
          ...prev,
          data: listData,
          loading: false,
          total: response?.data?.result_count,
        };
      });
    } else {
      dispatch(throwError(response?.message));
    }
    setScrollLoader(false);
  };
  const handleRedirect = (link) => {
    window.open(link, "_blank");
  };
  useEffect(() => {
    offsetRef.current = 0;
    fetchMenteesSessionList(submissionsList, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { mentee_name } = getFromLocalStorage("setViewName");
  const { data, total } = submissionsList;
  return (
    <div id="detail-mentee-container">
      <Card className="d-flex align-items-center unset-br cps-15 cpt-15 cpe-15 cpb-15 cmb-20">
        <span
          className="d-flex"
          onClick={() => {
            removeFromLocalStorage("setViewName");
            navigate(-1);
          }}
        >
          <img
            src={icons.leftArrow}
            alt="back"
            className="h-21 me-3 pointer color-dark-blue"
          />
        </span>
        <div className="text-16-500-19 color-dark-blue">
          {titleCaseString(singleMenteeDetails?.mentee_name || mentee_name)}
        </div>
      </Card>

      <div className="d-flex justify-content-between align-items-center cmb-20">
        <div className="text-16-500 color-text-navy">
          All Submissions({submissionsList?.total})
        </div>
        <div className="d-flex gap-3">
          <div className="d-flex gap-2 align-items-center text-14-500-26 color-text-navy">
            <img src={icons.filterIcon} alt="filter" />
            FilterA
          </div>
          <Dropdown
            value={statusText}
            // options={menteesStatus}
            options={myseduleStatus}
            placeholder="Status"
            optionValue="value"
            optionKey="value"
            onChange={(e) => {
              setStatusText(e?.target?.value);
              const { status, is_approve } = e?.target?.data?.id || {};
              let newData = {
                ...submissionsList,
                status: status,
                is_approve: is_approve,
                loading: true,
              };
              offsetRef.current = 0;
              listRef?.current?.scrollTo({
                top: 0,
                behavior: "smooth",
              });
              totalDocRef.current = 0;
              setSubmissionsList(newData);
              fetchMenteesSessionList(newData, true);
            }}
            isRounded
          />
        </div>
      </div>

      <div
        className="row g-0 detail-mentee-card-container"
        ref={listRef}
        onScroll={(e) => {
          if (data?.length < total) {
            handelScroll(e);
          }
        }}
      >
        {submissionsList?.loading && (
          <Card className="cpt-50 cpb-50">
            <Loader size="sm" />
          </Card>
        )}
        {!submissionsList?.loading && data?.length === 0 ? (
          <Card className="unset-br cpt-50 cpb-50 text-center">
            No data found.
          </Card>
        ) : (
          data?.map((elem, index) => {
            const {
              profile,
              name,
              book_session_id,
              status,
              session_name,
              meeting_link,
              reschedule_data,
              meeting_duration,
              mentor_id,
              session_date,
              start_time,
              end_time,
              session_price,
              reject_resonse,
              time_zone,
            } = elem;
            const tz = time_zone?.split("(");
            const tzValue = tz?.[tz?.length - 1]?.replace(")", "");
            return (
              <div className="col-md-6 cmb-10" key={index}>
                <div className="cpe-10">
                  <Card className="unset-br cps-10 cpt-10 cpe-10 cpb-10">
                    <div className="d-flex justify-content-between align-items-center cmb-10">
                      <div className="d-flex align-items-center gap-2">
                        <Profile
                          text={name}
                          isRounded
                          size="s-48"
                          isS3UserURL
                          url={profile}
                        />
                        <div className="text-15-500-26 color-3146">{name}</div>
                      </div>
                      <div className="d-flex gap-2 align-items-center">
                        <div
                          className={`status-completed ${
                            status === "Completed" ? "bg-95ab" : "bg-a74d"
                          }`}
                        />
                        <div className="dark-blue text-13-400">{status}</div>
                      </div>
                    </div>
                    <div className="text-15-500-26 color-dark-navy-blue cmb-10">
                      {`${titleCaseString(session_name)} - ₹${session_price}`}
                    </div>
                    <div className="d-flex align-items-center gap-5 cmb-10">
                      <div
                        className={`${
                          meeting_link &&
                          status === "Upcoming - Session Approved" &&
                          "pointer"
                        } d-flex gap-2 align-items-center`}
                        onClick={() => {
                          status === "Upcoming - Session Approved" &&
                            handleRedirect(meeting_link);
                        }}
                      >
                        <img src={icons.videoMeet} alt="meet" />
                        <div className="text-14-400-26 color-dark-blue cpt-2">
                          1:1 Video Meet
                        </div>
                      </div>
                      <div className="d-flex gap-2 align-items-center">
                        <img src={icons.clockTime} alt="clock" />
                        <div className="text-14-400 color-dark-blue">
                          {meeting_duration}
                        </div>
                      </div>
                    </div>
                    {reschedule_data?.length === 0 && (
                      <div className="row">
                        <div className="text-15-500-26 color-dark-navy-blue col-md-3 cmb-15">
                          Schedule On
                        </div>
                        <div className="text-14-400 color-dark-navy-blues text-justify col-md-4 cmb-15">
                          {moment(session_date).format("DD MMM YYYY")},
                          {moment(start_time, "HH:mm:ss")?.format("h:mm A")}{" "}
                          {tzValue}
                        </div>
                      </div>
                    )}
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
                      reschedule_data?.map((elem, index) => {
                        const { schedule_on, reschedule_by } = elem;
                        return (
                          <>
                            <div className="row" key={index}>
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
                            <div className="row" key={index}>
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
                            {index + 1 === reschedule_data?.length && (
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
                                      : status === "Upcoming - Session Approved"
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

                                {index + 1 === reschedule_data?.length &&
                                  status === "Upcoming - Session Approved" && (
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
                              </>
                            )}
                          </>
                        );
                      })}
                    {status === "Upcoming Pending" && (
                      <div className="d-flex gap-3 align-items-center">
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
                        <div className="text-15-400-26 color-text-blue">
                          Reschedule Meeting{" "}
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            );
          })
        )}
        {!submissionsList?.loading && scrollLoader && (
          <div className="cpt-30 cpb-30">
            <Loader size="sm" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsMentee;
