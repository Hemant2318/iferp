import CalendarLayout from "components/Layout/CalendarLayout";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Profile from "components/Layout/Profile";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSessionDetails } from "store/slices";
import { icons } from "utils/constants";
import { objectToFormData, titleCaseString } from "utils/helpers";

const MentorSessionDetails = () => {
  const params = useParams();
  const { vId } = params;

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [sessionData, setSessionData] = useState({});
  const [reviewShowMore, setReviewShowMore] = useState(3);

  const { mentorSessionID } = useSelector((state) => ({
    mentorSessionID: state.mentorshipManagement.mentorSessionID,
  }));

  const fetchSingleSessionDetails = async () => {
    setIsLoading(true);
    const response = await dispatch(
      getSessionDetails(
        objectToFormData({
          session_id: vId ? vId : mentorSessionID,
        })
      )
    );
    if (response?.status === 200) {
      setSessionData(response?.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // if (mentorSessionID) {
    fetchSingleSessionDetails();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vId ? vId : mentorSessionID]);

  const handleRedirect = (link) => {
    window.open(link, "_blank");
  };

  const {
    amount,
    session_name,
    meeting_link,
    meeting_duration,
    rating_star,
    rating_reveiw,
    skill,
    session_overview,
    requirements,
    rating,
    data_description,
    status,
  } = sessionData || {};

  const minDate = moment().format("YYYY-MM-DD");

  return (
    <div id="mentor-session-detail-container" className="row g-0 ">
      {isLoading ? (
        <Card className="cpt-50 cpb-50">
          <Loader size="sm" />
        </Card>
      ) : (
        <>
          <div className="col-md-8">
            <Card className="cps-20 cpt-20 cpe-20 cpb-20 session-info cme-10 cmb-15">
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
                    meeting_link && status === "Accepted" && "pointer"
                  } d-flex gap-2 align-items-center`}
                  onClick={() => {
                    status === "Accepted" && handleRedirect(meeting_link);
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
                    Skills They will Learn
                  </div>
                  <div className="d-flex gap-3 flex-wrap cmb-15">
                    {skill?.map((o, i) => {
                      return (
                        <div
                          className="text-15-400 key-points color-5068 cps-5 cpt-6 cpe-5 cpb-6 rounded bg-f6fc"
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
                <div className="cmb-15">
                  <div className="text-15-500-26 color-dark-navy-blue">
                    Session Overview
                  </div>
                  <p className="text-14-400 color-dark-navy-blues text-justify">
                    {titleCaseString(session_overview)}
                  </p>
                </div>
              )}

              {data_description?.length > 0 && (
                <div className="cmb-15">
                  <div className="text-15-500-26 color-dark-navy-blue">
                    What you will learn?
                  </div>
                  <div className="text-14-400-26 color-dark-blue">
                    {data_description}
                  </div>
                </div>
              )}

              {requirements && (
                <div className="cmb-15">
                  <div className="text-15-500-26 color-dark-navy-blue">
                    Requirements
                  </div>
                  <div className="text-14-400-26 color-dark-blue">
                    <li>{titleCaseString(requirements)}</li>
                  </div>
                </div>
              )}
            </Card>

            {rating?.length > 0 && (
              <Card className="cps-20 cpt-20 cpe-20 cpb-20 session-info cme-10 cmb-15">
                <div className="text-15-500-26 color-dark-navy-blue cmb-10">
                  What Mentees Say
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

                {rating?.length > 0 && (
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
            {/* display data is pending */}
            <Card className="cps-20 cpt-20 cpe-20 cpb-20 session-info cms-10">
              <CalendarLayout
                isView
                sessionCustomizeTime={sessionData?.customize_time}
                sessionUnAvailableTime={sessionData?.unavalible_time}
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

export default MentorSessionDetails;
