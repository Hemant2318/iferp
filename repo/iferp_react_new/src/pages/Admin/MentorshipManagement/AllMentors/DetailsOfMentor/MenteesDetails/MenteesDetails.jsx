import Card from "components/Layout/Card";
import Profile from "components/Layout/Profile";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { icons } from "utils/constants";
import CalendarLayout from "components/Layout/CalendarLayout";
import { useDispatch } from "react-redux";
import "./MenteesDetails.scss";
import { mentessSessionDetails } from "store/slices";
import { objectToFormData, titleCaseString } from "utils/helpers";
import Loader from "components/Layout/Loader";
import moment from "moment";

const MenteesDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState({});
  const fetchDetails = async () => {
    const response = await dispatch(
      mentessSessionDetails(objectToFormData({ book_session_id: id }))
    );
    if (response?.status === 200) {
      setDetails(response?.data || {});
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
  const {
    session_name,
    profile,
    user_name,
    status,
    meeting_link,
    meeting_duration,
    rating_start,
    rating_reveiw,
    scheduled_on,
    mentee_learn,
    scheduled,
    payment_overview,
    time_zone,
  } = details || {};

  const minDate = moment().format("YYYY-MM-DD");
  const tz = time_zone?.[0]?.time_zone?.split("(");
  const tzValue = tz?.[tz?.length - 1]?.replace(")", "");

  return (
    <div id="mentee-details-container">
      {isLoading ? (
        <Card>
          <Loader size="sm" />
        </Card>
      ) : (
        <>
          <Card className="d-flex align-items-center unset-br cps-15 cpt-15 cpe-15 cpb-15 cmb-20">
            <span
              className="d-flex"
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
            <div className="text-16-500-19 color-dark-blue">
              {titleCaseString(session_name)}
            </div>
          </Card>

          <div className="row g-0">
            <div className="col-md-8">
              <Card className="unset-br cme-10 cmb-20">
                <div className="p-2">
                  <div className="d-flex justify-content-between align-items-center cmb-10">
                    <div className="d-flex align-items-center gap-2">
                      <Profile
                        isRounded
                        size="s-48"
                        isS3UserURL
                        url={profile}
                      />
                      <div>{titleCaseString(user_name)}</div>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      <div
                        className={
                          (status === "Accepted" && "completed") ||
                          (status === "Pending" && "upcoming_pending")
                        }
                      />
                      <div className="dark-blue text-13-400">
                        {(status === "Accepted" && "Completed") ||
                          (status === "Pending" && "Upcoming - Pending")}
                      </div>
                    </div>
                  </div>

                  <div className="text-15-500-26 color-dark-navy-blue cmb-10">
                    {titleCaseString(session_name)}
                  </div>

                  <div className="d-flex align-items-center gap-4 cmb-10">
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

                    {rating_start && (
                      <div className="d-flex gap-2 align-items-center">
                        <img src={icons.star} alt="star" />
                        <div className="text-14-500 color-dark-blue">
                          <span>{rating_start}</span> (
                          <span className="text-14-400 underline">
                            {`${rating_reveiw} Reviews`}
                          </span>
                          )
                        </div>
                      </div>
                    )}
                  </div>

                  {scheduled_on && (
                    <div className="d-flex gap-5 cmb-20">
                      <div className="text-14-400-26 color-647d">
                        Scheduled on{" "}
                      </div>
                      <div className="text-14-500-26 color-dark-blue">
                        {`${scheduled_on} ${tzValue}`}
                      </div>
                    </div>
                  )}

                  {mentee_learn && (
                    <>
                      <div className="text-14-500-26 color-dark-navy-blue cmb-5">
                        Mentee wants to learn
                      </div>
                      <div className="text-14-400 color-dark-navy-blue cmb-10">
                        {titleCaseString(mentee_learn)}
                      </div>
                    </>
                  )}

                  {scheduled?.length > 0 &&
                    scheduled?.map((elem, index) => {
                      const { status, date } = elem;
                      return (
                        <div className="row" key={index}>
                          <div className="text-15-500-26 color-dark-navy-blue col-md-3 cmb-15">
                            {index === 0
                              ? "Your Confirmation"
                              : "Mentee Confirmation"}
                          </div>

                          <div className="text-14-400 color-dark-navy-blues text-justify col-md-3 cmb-15">
                            {status}
                          </div>
                          <div className="col-md-6" />

                          <div className="text-15-500-26 color-dark-navy-blue col-md-3 cmb-15">
                            {status === "Accepted"
                              ? "Meeting On"
                              : "Request Sent On"}
                          </div>

                          <div className="text-14-400 color-dark-navy-blues text-justify col-md-3 cmb-15">
                            {date}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Card>

              {status === "Accepted" && payment_overview && (
                <Card className="unset-br cme-10">
                  {/* static data */}
                  <div className="p-2">
                    <div className="text-14-500-26 color-dark-navy-blue cmb-10">
                      Payment Overview
                    </div>

                    <div className="d-flex gap-5 cmb-20">
                      <div className="text-14-400-26 color-647d">Paid on</div>
                      <div className="text-14-500-26 color-dark-blue">
                        18 SEP 2023
                      </div>
                    </div>

                    {/* <div className="d-flex">
                      <Button
                        text="Invoice"
                        btnStyle="primary-dark"
                        icon={<img src={icons.download} alt="download" />}
                        className="gap-2"
                      />
                    </div> */}
                  </div>
                </Card>
              )}
            </div>
            <div className="col-md-4">
              <Card className="unset-br cms-10">
                <div className="p-2">
                  <CalendarLayout
                    isSelectTime
                    isScheduleDataAvailable
                    displayScheduleData={details}
                    sessionCustomizeTime={details?.customize_time}
                    sessionUnAvailableTime={details?.unavalible_time}
                    isBookingSession={true}
                    minDate={minDate}
                  />
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MenteesDetails;
