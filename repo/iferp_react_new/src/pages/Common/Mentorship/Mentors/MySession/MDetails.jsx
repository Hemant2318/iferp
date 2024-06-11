import CalendarLayout from "components/Layout/CalendarLayout";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Profile from "components/Layout/Profile";
import React, { useEffect, useState } from "react";
import Button from "components/form/Button";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSessionDetails, setMySessionData } from "store/slices";
import { icons } from "utils/constants";
import {
  INRtoUSD,
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import moment from "moment";

const MDetails = () => {
  const navigate = useNavigate();
  const authUser = getDataFromLocalStorage();
  const { personal_details = {}, exchange_rate } = authUser;
  const isNational = personal_details?.country_name === "India";
  const params = useParams();
  const { sId } = params;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [reviewShowMore, setReviewShowMore] = useState(3);
  const [sessionDetailData, setSessionDetailData] = useState({});
  const fetchDetails = async () => {
    setIsLoading(true);
    const response = await dispatch(
      getSessionDetails(
        objectToFormData({
          session_id: sId,
        })
      )
    );
    if (response?.status === 200) {
      setSessionDetailData(response?.data || {});
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRedirect = (link) => {
    window.open(link, "_blank");
  };
  const minDate = moment().format("YYYY-MM-DD");
  const {
    amount,
    session_name,
    meeting_link,
    meeting_duration,
    rating_star,
    rating_reveiw,
    skill,
    session_overview,
    rating,
  } = sessionDetailData || {};
  const price = INRtoUSD(amount, exchange_rate);
  const newPrice = parseFloat(price?.toFixed(2));
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
              <div className="d-flex justify-content-between align-items-center cmb-15">
                <div className="text-15-500 color-4453">Session Details</div>
                {amount && (
                  <div className="text-20-500 color-dark-navy-blue">
                    {isNational ? `₹ ${amount}` : `$ ${newPrice}`}
                  </div>
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
                    Skills They will Learn
                  </div>
                  <div className="d-flex gap-3 flex-wrap cmb-15">
                    {skill?.map((o, i) => {
                      return (
                        <div
                          className="text-15-400 key-points color-5068"
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
                  <div>
                    <Button
                      text="Edit"
                      icon={<img src={icons.primaryEditPen} alt="edit" />}
                      className="d-flex gap-2 color-text-blue"
                      onClick={() => {
                        dispatch(setMySessionData(sessionDetailData));
                        navigate(
                          `/professional/mentorship/mentor/edit-new-session`
                        );
                      }}
                    />
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
                sessionCustomizeTime={sessionDetailData?.customize_time}
                sessionUnAvailableTime={sessionDetailData?.unavalible_time}
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

export default MDetails;
