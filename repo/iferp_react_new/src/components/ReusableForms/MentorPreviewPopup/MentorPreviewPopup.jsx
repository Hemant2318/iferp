import CalendarLayout from "components/Layout/CalendarLayout";
import React from "react";
import Card from "components/Layout/Card";
import Modal from "react-bootstrap/Modal";
import { icons } from "utils/constants";
import { titleCaseString } from "utils/helpers";
import moment from "moment";
function MentorPreviewPopup(props) {
  const {
    userDetails,
    sessionCustomizeTime,
    sessionUnAvailableTime,
    isBookingSession,
  } = props;
  const { startTimes, endTimes, meeting_duration, duration_unit, timizone } =
    userDetails;
  const tz = timizone?.split("(");
  const tzValue = tz?.[tz?.length - 1]?.replace(")", "");

  const meetingDurationInMinutes =
    duration_unit === "H" ? meeting_duration * 60 : meeting_duration; // Convert meeting duration to minutes if unit is 'H'

  const meetingTimes = [];

  for (let key in startTimes) {
    const startTime = startTimes[key];
    const endTime = endTimes[key];
    const dayOfWeek = moment().day(parseInt(key)).format("ddd");
    if (startTime && endTime && duration_unit) {
      const startMoment = moment(startTime, "HH:mm");
      const endMoment = moment(endTime, "HH:mm");
      const intervals = Math.floor(
        endMoment.diff(startMoment, "minutes") / meetingDurationInMinutes
      );
      for (let i = 0; i < intervals; i++) {
        const meetingStartTime = moment(startMoment)
          .add(i * meetingDurationInMinutes, "minutes")
          .format("HH:mm");
        const meetingEndTime = moment(meetingStartTime, "HH:mm")
          .add(meetingDurationInMinutes, "minutes")
          .format("HH:mm");
        meetingTimes.push({
          day: titleCaseString(dayOfWeek),
          startTime: meetingStartTime,
          endTime: meetingEndTime,
          timeZone: tzValue,
        });
      }
    }
  }

  const minDate = moment().format("YYYY-MM-DD");

  return (
    <div>
      <Modal
        {...props}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Session Overview
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-0">
            <div className="col-md-8">
              <Card className="cps-20 cpt-20 cpe-20 cpb-20 session-info cme-10 cmb-15">
                {/* <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex gap-2 align-items-center cmb-15">
                    <Profile
                      text={userDetails?.user_name}
                      isRounded
                      isS3UserURL
                      url={userDetails?.profile}
                    />
                    <div className="text-15-500 color-4453">
                      {titleCaseString(userDetails?.user_name)}
                    </div>
                  </div>
                  {userDetails?.status && (
                    <div className="d-flex gap-2 align-items-center">
                      <div
                        className={`status-completed ${
                          userDetails?.status === "Completed"
                            ? "bg-95ab"
                            : userDetails?.status === "Rejected"
                            ? "bg-1515"
                            : "bg-a74d"
                        }`}
                      />
                      <div className="dark-blue text-13-400">
                        {(userDetails?.status === "Pending" &&
                          "Upcoming Pending") ||
                          (userDetails?.status === "Accepted" &&
                            "Upcoming Accepted") ||
                          userDetails?.status}
                      </div>
                    </div>
                  )}
                </div> */}
                <div className="d-flex gap-2 align-items-center cmb-15">
                  <div className="text-15-500-26 color-dark-navy-blue">
                    {titleCaseString(userDetails?.session_name)}
                  </div>
                  <div className="text-15-500-26 color-dark-navy-blue">
                    {userDetails?.amount && (
                      <div>{`- ₹ ${userDetails?.amount}`}</div>
                    )}
                  </div>
                </div>
                {userDetails?.meeting_duration && (
                  <div className="d-flex align-items-center gap-4 cmb-15">
                    <div
                      className={`${
                        userDetails?.meeting_link && "pointer"
                      } d-flex gap-2 align-items-center`}
                    >
                      <img src={icons.videoMeet} alt="meet" />
                      <div className="text-14-400-26 color-dark-blue cpt-2">
                        1:1 Video Meet
                      </div>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      <img src={icons.clockTime} alt="clock" />
                      <div className="text-14-400-26 color-dark-blue">
                        {userDetails?.meeting_duration}{" "}
                        {userDetails?.duration_unit === "H" ? "H" : "Mins"}
                      </div>
                    </div>
                  </div>
                )}
                {userDetails?.data_description && (
                  <div>
                    <div className="text-15-500-26 color-dark-navy-blue">
                      What will they learn?
                    </div>
                    <div className="text-14-400 color-dark-navy-blues text-justify cmb-10">
                      {titleCaseString(userDetails?.data_description)}
                    </div>
                  </div>
                )}

                {userDetails?.skills_group && (
                  <div>
                    <div className="text-15-500-26 color-dark-navy-blue">
                      Skills
                    </div>
                    <div className="text-14-400 color-dark-navy-blues text-justify cmb-10">
                      {titleCaseString(userDetails?.skills_group)}
                    </div>
                  </div>
                )}
                {userDetails?.requirements && (
                  <div>
                    <div className="text-15-500-26 color-dark-navy-blue">
                      Requirements
                    </div>
                    <div className="text-14-400 color-dark-navy-blues text-justify cmb-10">
                      {titleCaseString(userDetails?.requirements)}
                    </div>
                  </div>
                )}
                {userDetails?.overview && (
                  <div>
                    <div className="text-15-500-26 color-dark-navy-blue">
                      Overview
                    </div>
                    <div className="text-14-400 color-dark-navy-blues text-justify cmb-10">
                      {titleCaseString(userDetails?.overview)}
                    </div>
                  </div>
                )}

                {userDetails?.meeting_link && (
                  <div>
                    <div className="text-15-500-26 color-dark-navy-blue">
                      Meeting Link
                    </div>
                    <div
                      className="text-14-400 color-new-car text-justify cmb-10 pointer text-decoration-underline"
                      onClick={() => {
                        window.open(userDetails?.meeting_link);
                      }}
                    >
                      {titleCaseString(userDetails?.meeting_link)}
                    </div>
                  </div>
                )}
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="cps-20 cpt-20 cpe-20 cpb-20 session-info cms-10">
                <CalendarLayout
                  preview
                  previewTimeSlot={meetingTimes}
                  isSelectTime
                  sessionCustomizeTime={sessionCustomizeTime}
                  sessionUnAvailableTime={sessionUnAvailableTime}
                  isBookingSession={isBookingSession}
                  minDate={minDate}
                  //   isAPIFunction
                  //     isReschedule={isRescheduleSession}
                  //   reschedule_Session_iD={userDetails?.session_id}
                  //     isRescheduleNavigate
                  //     handleReschedulNavigate={() => {
                  //       setIsRescheduleSession(false);
                  //     }}
                />
              </Card>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default MentorPreviewPopup;
