import CalendarLayout from "components/Layout/CalendarLayout";
import Card from "components/Layout/Card";
import Profile from "components/Layout/Profile";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { icons } from "utils/constants";
import { getSessionDetails } from "store/slices";
import { objectToFormData, titleCaseString } from "utils/helpers";
import { useDispatch } from "react-redux";
import Loader from "components/Layout/Loader";
import "./MenteeSettlementsDetails.scss";
import moment from "moment";

const MenteeSettlementsDetails = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const dispatch = useDispatch();
  const [menteeSettlementsData, setMenteeSettlements] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [reviewShowMore, setReviewShowMore] = useState(3);
  const fetchMenteeSettlementsDetails = async () => {
    setIsLoading(true);
    // const response = await dispatch(
    //   mentessSessionDetails(
    //     objectToFormData({
    //       book_session_id: id,
    //     })
    //   )
    // );
    const response = await dispatch(
      getSessionDetails(
        objectToFormData({
          session_id: id,
        })
      )
    );
    if (response?.status === 200) {
      // console.log("response?.data", response?.data);
      setMenteeSettlements(response?.data || {});
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMenteeSettlementsDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    name,
    amount,
    session_name,
    meeting_link,
    meeting_duration,
    rating_star,
    rating_reveiw,
    skill,
    session_overview,
    rating,
    profile,
    unavalible_time,
    customize_time,
  } = menteeSettlementsData || {};
  const handleRedirect = (link) => {
    window.open(link, "_blank");
  };

  const minDate = moment().format("YYYY-MM-DD");

  return (
    <div id="m-details-container" className="row g-0">
      {isLoading ? (
        <Card className="cpt-50 cpb-50">
          <Loader size="sm" />
        </Card>
      ) : (
        <>
          <div className="col-md-8">
            <Card className="cps-20 cpt-20 cpe-20 cpb-20 session-info cme-10 cmb-15">
              <span
                className="d-flex mb-2"
                onClick={() => {
                  navigate(-1);
                }}
              >
                <img
                  src={icons.leftArrow}
                  alt="back"
                  className="h-21 me-3 pointer color-dark-blue"
                />
              </span>
              <div className="d-flex justify-content-between align-items-center cmb-10">
                <div className="d-flex align-items-center gap-2">
                  {!profile ? (
                    <img src={profile} alt="" />
                  ) : (
                    <Profile
                      text={name}
                      isS3UserURL
                      size="s-34"
                      url={profile}
                      isRounded
                    />
                  )}
                  <div>{name}</div>
                </div>
                {/* <div className="d-flex gap-2 align-items-center">
                      <div
                        className={`status-completed ${
                          status === "Completed" ? "bg-95ab" : "bg-a74d"
                        }`}
                      />
                      <div className="dark-blue text-13-400">{status}</div>
                    </div> */}
              </div>
              <div className="d-flex justify-content-between align-items-center cmb-15">
                <div className="text-15-500 color-4453">Session Details</div>
                {amount && (
                  <div className="text-20-500 color-dark-navy-blue">{`₹ ${amount}`}</div>
                )}
              </div>
              {session_name && (
                <div className="text-15-500-26 color-dark-navy-blue cmb-15">
                  {titleCaseString(session_name)}
                </div>
              )}
              <div className="d-flex align-items-center gap-4 cmb-15">
                <div
                  className={`${
                    meeting_link && "pointer"
                  } d-flex gap-2 align-items-center`}
                  onClick={() => {
                    handleRedirect(meeting_link);
                  }}
                >
                  <img src={icons.videoMeet} alt="meet" />
                  <div className="text-14-400-26 color-dark-blue cpt-2">
                    1:1 Video Meet
                  </div>
                </div>
                {meeting_duration && (
                  <div className="d-flex gap-2 align-items-center">
                    <img src={icons.clockTime} alt="clock" />
                    <div className="text-14-400-26 color-dark-blue">
                      {meeting_duration}
                    </div>
                  </div>
                )}

                {rating_star && (
                  <div className="d-flex gap-2 align-items-center">
                    <img src={icons.star} alt="star" />
                    <div className="text-14-500 color-dark-blue">
                      <span>{rating_star}</span> (
                      <span className="text-14-400 underline">
                        {`${rating_reveiw} Reviews`}
                      </span>
                      )
                    </div>
                  </div>
                )}
              </div>

              {skill?.length > 0 && (
                <>
                  <div className="text-15-500-26 color-dark-navy-blue cmb-10">
                    Mentee wants to learn
                  </div>
                  <div className="d-flex gap-3 flex-wrap cmb-15">
                    {skill?.map((o, i) => {
                      return (
                        <div
                          className="text-15-400 key-points color-dark-blue bg-f6fc cps-5 cpt-6 cpe-5 cpb-6 rounded"
                          key={i}
                        >
                          {titleCaseString(o)}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {session_overview && (
                <div className="cmb-15 d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-15-500-26 color-dark-navy-blue">
                      Session Overview
                    </div>
                    <p className="text-14-400 color-dark-navy-blues text-justify">
                      {titleCaseString(session_overview)}
                    </p>
                  </div>
                  {/* <div>
                    <Button
                      text="Edit"
                      icon={<img src={icons.primaryEditPen} alt="edit" />}
                      className="d-flex gap-2 color-text-blue"
                      onClick={() => {
                        dispatch(setMySessionData(menteeSettlementsData));
                        navigate(
                          `/professional/mentorship/mentor/edit-new-session`
                        );
                      }}
                    />
                  </div> */}
                </div>
              )}
              {meeting_link && (
                <div className="cmb-15 d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-15-500-26 color-dark-navy-blue">
                      Meeting link
                    </div>
                    <p
                      className="text-14-400 color-new-car text-justify pointer text-decoration-underline"
                      onClick={() => {
                        handleRedirect(meeting_link);
                      }}
                    >
                      {meeting_link}
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {rating?.length > 0 && (
              <Card className="cps-20 cpt-20 cpe-20 cpb-20 session-info cme-10 cmb-15">
                <div className="text-15-500-26 color-dark-navy-blue cmb-10">
                  What Mentees Say ({rating?.length})
                </div>
                {rating?.slice(0, reviewShowMore)?.map((rData, rIndex) => {
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
                    Math.min(reviewShowMore, rating?.length) - 1;

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
                                <img src={icons.star} alt="star" key={i} />
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

                {rating?.length > 3 && (
                  <div className="d-flex">
                    <div
                      className="text-12-400 color-text-blue d-flex gap-2 pointer"
                      onClick={() => {
                        if (rating?.length > 0) {
                          if (reviewShowMore === 3) {
                            setReviewShowMore(rating?.length);
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
          <div className="col-md-4">
            <Card className="cps-20 cpt-20 cpe-20 cpb-20 session-info cms-10">
              <CalendarLayout
                isView
                sessionCustomizeTime={customize_time}
                sessionUnAvailableTime={unavalible_time}
                isBookingSession={false}
                minDate={minDate}
              />
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default MenteeSettlementsDetails;
