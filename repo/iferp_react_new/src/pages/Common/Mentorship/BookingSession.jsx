import CalendarLayout from "components/Layout/CalendarLayout";
import Card from "components/Layout/Card";
import FeedbackPopup from "components/Layout/FeedbackPopup/FeedbackPopup";
import Loader from "components/Layout/Loader";
import Profile from "components/Layout/Profile";
import TextArea from "components/form/TextArea";
import moment from "moment";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSessionDetails,
  handleReScheduledSession,
  setIsRescheduleTIme,
} from "store/slices";
import { icons } from "utils/constants";
import {
  INRtoUSD,
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";

const BookingSession = () => {
  const params = useParams();
  const { memberType, sId } = params;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUserDetails = getDataFromLocalStorage();
  const { personal_details, exchange_rate } = authUserDetails;
  const [reviewShowMore, setReviewShowMore] = useState(3);
  const [isFeedback, setIsFeedback] = useState(false);
  const [sessionDetails, setSessionDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { isRescheduleTIme, reScheduleSessionData, bookingSessionId } =
    useSelector((state) => ({
      isRescheduleTIme: state.mentorship.isRescheduleTIme,
      reScheduleSessionData: state.mentorship.reScheduleSessionData,
      bookingSessionId: state.mentorship.bookingSessionId,
    }));
  const [scheduleMeetingPayload, setScheduleMeetingPayload] = useState({
    session_id: "",
    mentor_id: "",
    mentee_id: "",
    session_price: "",
    session_date: "",
    start_time: "",
    end_time: "",
    lear_by_mentee: "",
  });
  const [reScheduleMeetingPayload, setReScheduleMeetingPayload] = useState({
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

  const fetchSessionDetails = async () => {
    setIsLoading(true);
    const formData = objectToFormData({ session_id: sId });
    const response = await dispatch(getSessionDetails(formData));
    if (response?.status === 200) {
      setSessionDetails(response?.data || {});
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSessionDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const minDate = moment().format("YYYY-MM-DD");

  let UpdatedReScheduleData =
    reScheduleSessionData?.length > 1 &&
    reScheduleSessionData[reScheduleSessionData.length - 1];
  const isNational = personal_details?.country_name === "India";
  const price =
    sessionDetails?.amount && INRtoUSD(sessionDetails?.amount, exchange_rate);
  const newPrice = parseFloat(price?.toFixed(2));
  return (
    <div id="booking-session-container">
      {isLoading ? (
        <Card className="cpt-30 cpb-50">
          <Loader size="md" />
        </Card>
      ) : (
        <>
          <Card className="d-flex align-items-center cpt-10 cpb-10 cps-10 cpe-10 unset-br mb-3">
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
            <div>{titleCaseString(sessionDetails?.session_name)}</div>
          </Card>

          <div className="row">
            {isFeedback && <FeedbackPopup setIsFeedback={setIsFeedback} />}
            <div className="col-md-8 g-0 cps-10 cpe-10">
              <Card className="cps-10 cpt-20 cpe-10 cpb-20 cmb-8">
                <div className="d-flex align-items-center gap-2 cmb-20">
                  <Profile
                    text={sessionDetails?.name}
                    isRounded
                    size="s-100"
                    url={sessionDetails?.profile}
                    isS3UserURL
                  />
                  <div>
                    <div className="text-18-500 color-3146">
                      {titleCaseString(sessionDetails?.name)}
                    </div>
                    <div className="text-15-400-25 color-3146">
                      {sessionDetails?.designation}
                    </div>
                    <div className="text-15-400-25 color-3146 cmb-10">
                      {sessionDetails?.institution}
                      {sessionDetails?.institution && ","}{" "}
                      {sessionDetails?.country}
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-3 align-items-center">
                  <div className="d-flex gap-2 align-items-center">
                    <div>
                      <img src={icons.blackFollowers} alt="followers" />
                    </div>
                    <div className="text-15-500-26 color-3146">
                      {sessionDetails?.followers}
                    </div>
                    <div className="text-15-400-26 color-3146">Followers</div>
                  </div>
                </div>
              </Card>

              <div className="">
                <Card className="cps-10 cpt-20 cpe-10 cpb-20 session-info cmb-15">
                  <div className="d-flex justify-content-between align-items-center cmb-15">
                    <div className="text-15-500 color-4453">
                      Session Details
                    </div>
                    {sessionDetails?.amount && (
                      <div className="text-20-500 color-dark-navy-blue">
                        {sessionDetails?.amount && isNational
                          ? `₹ ${sessionDetails?.amount}`
                          : `$ ${newPrice}`}
                        {/* {`₹ ${sessionDetails?.amount}`} */}
                      </div>
                    )}
                  </div>
                  <div className="text-15-500-26 color-dark-navy-blue cmb-15">
                    {titleCaseString(sessionDetails?.session_name)}
                  </div>
                  <div className="d-flex align-items-center gap-4 cmb-15">
                    {sessionDetails?.meeting_link && (
                      <div className={`d-flex gap-2 align-items-center`}>
                        <img src={icons.videoMeet} alt="meet" />
                        <div className="text-14-400-26 color-dark-blue cpt-2">
                          1:1 Video Meet
                        </div>
                      </div>
                    )}

                    {sessionDetails?.meeting_duration && (
                      <div className="d-flex gap-2 align-items-center">
                        <img src={icons.clockTime} alt="clock" />
                        <div className="text-14-400 color-dark-blue">
                          {sessionDetails?.meeting_duration}
                        </div>
                      </div>
                    )}

                    {sessionDetails?.rating_star && (
                      <div className="d-flex gap-2 align-items-center">
                        <img src={icons.star} alt="star" />
                        <div className="text-14-500 color-dark-blue">
                          <span>{sessionDetails?.rating_star}</span> (
                          <span className="text-14-400 underline">
                            {`${sessionDetails?.rating_reveiw} Reviews`}
                          </span>
                          )
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-15-500-26 color-dark-navy-blue cmb-10">
                    Skills They will Learn
                  </div>
                  <div className="d-flex gap-3 flex-wrap align-items-center cmb-15">
                    {sessionDetails?.skill &&
                      sessionDetails?.skill?.map((elem, index) => {
                        return (
                          <div
                            className="text-15-400 key-points color-5068 color-dark-blue bg-f6fc text-nowrap cps-5 cpt-6 cpe-5 cpb-6 rounded"
                            key={index}
                          >
                            {titleCaseString(elem)}
                          </div>
                        );
                      })}
                  </div>

                  <div className="cmb-15">
                    <div className="text-15-500-26 color-dark-navy-blue">
                      Session Overview
                    </div>
                    {sessionDetails?.session_overview && (
                      <p className="text-14-400 color-dark-navy-blues text-justify">
                        {titleCaseString(sessionDetails?.session_overview)}
                      </p>
                    )}
                  </div>

                  {sessionDetails?.data_description?.length > 0 && (
                    <div className="cmb-15">
                      <div className="text-15-500-26 color-dark-navy-blue">
                        What you will learn?
                      </div>
                      <div className="text-14-400-26 color-dark-blue">
                        {sessionDetails?.data_description}
                      </div>
                    </div>
                  )}

                  {sessionDetails?.requirements?.length > 0 && (
                    <div className="cmb-15">
                      <div className="text-15-500-26 color-dark-navy-blue">
                        Requirements
                      </div>
                      {sessionDetails?.requirements && (
                        <div className="text-14-400-26 color-dark-blue">
                          <li>
                            {titleCaseString(sessionDetails?.requirements)}
                          </li>
                        </div>
                      )}
                    </div>
                  )}
                </Card>

                <Card className="cps-10 cpt-20 cpe-10 cpb-20 session-info cmb-15">
                  <TextArea
                    id="lear_by_mentee"
                    rows={5}
                    placeholder="Enter the skills you want to learn"
                    label="What do you want to learn?"
                    labelClass="text-15-400-18 color-black-olive"
                    onChange={(e) => {
                      if (e?.target?.value)
                        setScheduleMeetingPayload((prev) => {
                          return {
                            ...prev,
                            lear_by_mentee: e?.target?.value,
                          };
                        });
                    }}
                  />
                </Card>

                {sessionDetails?.rating?.length > 0 && (
                  <Card className="cps-10 cpt-20 cpe-10 cpb-20 session-info cmb-15">
                    <div className="text-15-500-26 color-dark-navy-blue cmb-10">
                      What Mentees Say
                    </div>
                    {sessionDetails?.rating?.length > 0 &&
                      sessionDetails?.rating
                        ?.slice(0, reviewShowMore)
                        ?.map((rData, rIndex) => {
                          const { profile, name, comment, rating } = rData;
                          const maxStar = 5;
                          const fillStar = Math.min(rating, maxStar);
                          const emptyStar = Math.max(0, maxStar - fillStar);
                          const fillStarArray = Array.from(
                            { length: fillStar },
                            (_, index) => index + 1
                          );
                          const emptyStarArray = Array.from(
                            { length: emptyStar },
                            (_, index) => index + 1
                          );
                          const lastIndex =
                            Math.min(
                              reviewShowMore,
                              sessionDetails?.rating?.length
                            ) - 1;

                          return (
                            <div
                              className={`${
                                lastIndex !== rIndex && "border-bottom"
                              } cmb-10`}
                              key={rIndex}
                            >
                              <div className="d-flex align-items-center gap-2">
                                <Profile
                                  text={name}
                                  isRounded
                                  isS3UserURL
                                  size="s-48"
                                  url={profile}
                                />
                                <div className="text-14-500-26 color-3146">
                                  <div>{titleCaseString(name)}</div>
                                  <div className="d-flex gap-1">
                                    {fillStarArray?.map((_, i) => {
                                      return (
                                        <img
                                          src={icons.star}
                                          alt="star"
                                          key={i}
                                        />
                                      );
                                    })}
                                    {emptyStarArray?.map((_, i) => {
                                      return (
                                        <img
                                          src={icons.unFillStar}
                                          alt="star"
                                          key={i}
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                              <p className="text-14-400-22 color-dark-blue">
                                {titleCaseString(comment)}
                              </p>
                            </div>
                          );
                        })}

                    {sessionDetails?.rating?.length > 0 && (
                      <div className="d-flex">
                        <div
                          className="text-12-400 color-text-blue d-flex gap-2 pointer"
                          onClick={() => {
                            if (sessionDetails?.rating?.length > 0) {
                              if (reviewShowMore === 3) {
                                setReviewShowMore(
                                  sessionDetails?.rating?.length
                                );
                              } else {
                                setReviewShowMore(3);
                              }
                            }
                          }}
                        >
                          {reviewShowMore === 3 ? "View more" : "View less"}
                          <div className="text-12-400 color-text-blue">
                            <img
                              src={
                                reviewShowMore === 3
                                  ? icons.downArrow
                                  : icons.upArrow
                              }
                              alt="arrow"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                )}
              </div>
            </div>

            <div className="col-md-4 g-0">
              <Card className="cpt-20 cpe-10 cme-10 cpb-20 session-info">
                <CalendarLayout
                  isSchedule
                  isSelectTime
                  payload={setScheduleMeetingPayload}
                  handelSuccess={() => {
                    fetchSessionDetails();
                    navigate(`/${memberType}/mentorship/mentee/my-submissions`);
                  }}
                  isAPIFunction
                  handelAPI={async () => {
                    // navigate(`/${memberType}/mentorship/mentee/cardInformation/${sId}`);
                    let payload = {
                      ...scheduleMeetingPayload,
                      session_price: sessionDetails?.amount,
                      session_id: sId,
                      mentor_id: sessionDetails?.mentor_id,
                      mentee_id: authUserDetails?.id,
                    };
                    // const formData = objectToFormData(payload);
                    // const response = await dispatch(scheduleMeeting(formData));
                    return payload;
                  }}
                  isReschedule={isRescheduleTIme}
                  isRescheduleNavigate
                  handleReschedulNavigate={() => {
                    navigate(`/${memberType}/mentorship/mentee/my-submissions`);
                    dispatch(setIsRescheduleTIme(false));
                  }}
                  isRescheduleAPIFunction
                  reSchedulePayload={setReScheduleMeetingPayload}
                  handleRescheduleAPI={async () => {
                    let payload = {
                      ...reScheduleMeetingPayload,
                      book_session_id: bookingSessionId,
                      mentor_id: sessionDetails?.mentor_id,
                      mentee_id: authUserDetails?.id,
                      session_id: sId,
                      reschedule_user_id: authUserDetails?.id,
                      reschedule_session_id: UpdatedReScheduleData?.id,
                    };
                    const formData = objectToFormData(payload);
                    const response = await dispatch(
                      handleReScheduledSession(formData)
                    );
                    return response;
                  }}
                  minDate={minDate}
                  isBookingSession={true}
                  sessionCustomizeTime={sessionDetails?.customize_time}
                  sessionUnAvailableTime={sessionDetails?.unavalible_time}
                  sessionWeekDays={sessionDetails?.daily}
                />
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingSession;
