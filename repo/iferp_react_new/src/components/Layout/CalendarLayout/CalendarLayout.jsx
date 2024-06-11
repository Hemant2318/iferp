import React, { useEffect, useState } from "react";
import moment from "moment";
import Button from "components/form/Button";
import CheckBox from "components/form/CheckBox";
import { useDispatch, useSelector } from "react-redux";
import {
  getTimeDetails,
  setCustomizeDateTime,
  setCustomizedDate,
  setIsRescheduleTIme,
  throwError,
  throwSuccess,
  setUnavailableDateTime,
  deleteUnavailableDateTime,
  deleteParticularCustomizeDateTime,
} from "store/slices";
import { isEmpty } from "lodash";
import "./CalendarLayout.scss";
import { useNavigate, useParams } from "react-router-dom";
import { objectToFormData } from "utils/helpers";

const headBar = [
  {
    title: "Su",
    blank: 0,
  },
  {
    title: "Mo",
    blank: 1,
  },
  {
    title: "Tu",
    blank: 2,
  },
  {
    title: "We",
    blank: 3,
  },
  {
    title: "Th",
    blank: 4,
  },
  {
    title: "Fr",
    blank: 5,
  },
  {
    title: "Sa",
    blank: 6,
  },
];

// const timeList = [
//   {
//     time: "10:00 AM",
//     timeZone: "IST",
//     isActive: false,
//     TIME: "10:00",
//     endTIME: "10:45",
//   },
//   {
//     time: "11:00 AM",
//     timeZone: "IST",
//     isActive: false,
//     TIME: "11:00",
//     endTIME: "11:45",
//   },
//   {
//     time: "12:00 PM",
//     timeZone: "IST",
//     isActive: true,
//     TIME: "12:00",
//     endTIME: "12:45",
//   },
//   {
//     time: "01:00 PM",
//     timeZone: "IST",
//     isActive: false,
//     TIME: "13:00",
//     endTIME: "13:45",
//   },
//   {
//     time: "04:00 PM",
//     timeZone: "IST",
//     isActive: false,
//     TIME: "16:00",
//     endTIME: "16:45",
//   },
//   {
//     time: "05:00 PM",
//     timeZone: "IST",
//     isActive: false,
//     TIME: "17:00",
//     endTIME: "17:45",
//   },
//   {
//     time: "07:00 PM",
//     timeZone: "IST",
//     isActive: false,
//     TIME: "19:00",
//     endTIME: "19:45",
//   },
//   {
//     time: "08:00 PM",
//     timeZone: "IST",
//     isActive: false,
//     TIME: "20:00",
//     endTIME: "20:45",
//   },
// ];
const CalendarLayout = ({
  preview,
  previewTimeSlot,
  isScheduleDataAvailable,
  displayScheduleData,
  reschedule_Session_iD,
  isSelectTime,
  isSchedule,
  isReschedule,
  isView,
  isCustomizeTime,
  customizeOnClick,
  isAPIFunction,
  handelAPI,
  handelSuccess,
  payload,
  handleReschedulNavigate,
  isRescheduleNavigate,
  isRescheduleAPIFunction,
  handleRescheduleAPI,
  reSchedulePayload,
  minDate,
  isBookingSession,
  sessionCustomizeTime,
  sessionUnAvailableTime,
  mySessionData,
  sessionWeekDays,
  unavalible_time,
  customize_time,
}) => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const { sId, memberType, formType: type } = params;
  const upDateViewStatus = type === "update-session-details" ? true : false;
  const { customizeDateTime, unavailableDateTime } = useSelector((state) => ({
    customizeDateTime: state.mentorship.customizeDateTime,
    unavailableDateTime: state.mentorship.unavailableDateTime,
  }));
  const [timeSlot, setTimeSlot] = useState([]);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [unAvailableDate, setUnAvailableDate] = useState([]);
  const [customizeDate, setCustomizeDate] = useState([]);
  const [currentDate, setCurrentDate] = useState(moment());
  const [btnLoading, setBtnLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reScheduleDate, setReScheduleDate] = useState(null);
  const [reScheduleTime, setReScheduleTime] = useState(null);
  // const [selectisBeforeMonth, setSelectisBeforeMonth] = useState(true);
  const handleScheduleMeeting = async () => {
    const response = await handelAPI();
    localStorage.setItem("session_data", JSON.stringify(response));
    navigate(`/${memberType}/mentorship/mentee/cardInformation/${sId}`);
  };

  const handleReScheduleMeeting = async () => {
    setBtnLoading(true);
    const response = await handleRescheduleAPI();
    if (response?.status === 200) {
      handelSuccess();
      reSchedulePayload({
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
      dispatch(setIsRescheduleTIme(false));
      dispatch(throwSuccess(response?.message));
      handleReschedulNavigate();
    } else {
      dispatch(throwError(response?.message));
    }
    setBtnLoading(false);
  };

  const getTimeSlot = async (timeData) => {
    const response = await dispatch(getTimeDetails(objectToFormData(timeData)));
    if (response?.status === 200) {
      let fetchTime = [];
      response?.data?.forEach((elem) => {
        const tz = elem?.time_zone?.split("(");
        const tzValue = tz?.[tz?.length - 1]?.replace(")", "");
        fetchTime.push({
          time: elem?.time,
          timeZone: tzValue,
        });
      });
      setTimeSlot(fetchTime || []);
    } else {
      setTimeSlot([]);
    }
  };

  const handleMonth = (monthType) => {
    var month = +currentDate?.format("M");
    var year = +currentDate?.format("YYYY");
    let date = +currentDate?.format("DD");
    const monthOfYear = moment()?.format("M");
    const currentYear = moment()?.format("YYYY");
    if (month === 1 && monthType === "PREV") {
      month = 12;
      year = year - 1;
      if (+currentYear === year) {
        date = moment()?.format("DD");
      } else {
        date = "01";
      }
    } else if (month === 12 && monthType === "NEXT") {
      month = 1;
      year = year + 1;
      date = "01";
    } else if (month === 12 && monthType === "PREV") {
      month = month - 1;
      date = "01";
    } else if (month === 1 && monthType === "NEXT") {
      month = month + 1;
      date = "01";
    } else if (monthType === "PREV") {
      month = month - 1;
      date = "01";
    } else if (monthType === "NEXT") {
      month = month + 1;
      if (+monthOfYear === month && +currentYear === year) {
        date = moment()?.format("DD");
      } else {
        date = "01";
      }
    } else {
      //   Nothing
    }

    let finalDate = `${date}-${month}-${year}`;
    setCurrentDate(moment(finalDate, "DD-MM-YYYY"));
  };

  const startOfMonth = moment(currentDate)?.startOf("month");
  const endOfMonth = moment(currentDate)?.endOf("month");
  const monthStartWeek = startOfMonth?.format("dd");

  const monthName = currentDate?.format("MMM");
  const monthYear = currentDate?.format("YYYY");
  const monthDay = +currentDate?.format("DD");
  const monthLastDay = +endOfMonth?.format("DD");

  const blankBoxes = headBar?.find((o) => o?.title === monthStartWeek)?.blank;
  // let reseduleDate = isReschedule ? 28 : "";
  // let reseduleTime = isReschedule ? "12:00 PM" : "";
  let reseduleDate = isReschedule ? reScheduleDate : "";
  let reseduleTime = isReschedule ? reScheduleTime : "";
  // const unavailable = isView ? 27 : "";
  // const customizeTime = isView ? 29 : "";
  // const unavailable =
  //   isView && mySessionData?.customize?.[0]?.time_zone !== ""
  //     ? unAvailableDate
  //     : Number(
  //         moment(mySessionData?.customize?.[0]?.date, "DD-MM-YYYY").format("DD")
  //       );
  // const customizeTime =
  //   isView && customizeDate
  //     ? customizeDate
  //     : Number(
  //         moment(mySessionData?.customize?.[0]?.date, "DD-MM-YYYY").format("DD")
  //       );

  let customizeTime = [];
  if (isView) {
    if (customizeDate) {
      customizeTime.push(customizeDate);
    }

    if (customizeDateTime?.length > 0) {
      // eslint-disable-next-line array-callback-return
      customizeDateTime?.map((dateTime) => {
        if (
          !customizeTime?.includes(
            parseInt(moment(dateTime?.date, "DD/MM/YYYY").format("YYYY-MMM-DD"))
          )
        ) {
          customizeTime.push(
            Number(moment(dateTime?.date, "DD/MM/YYYY").format("YYYY-MMM-DD"))
          );
        }
      });
    }
  }

  useEffect(() => {
    if (isScheduleDataAvailable) {
      const tz = displayScheduleData?.time_zone?.[0]?.time_zone?.split("(");
      const tzValue = tz?.[tz?.length - 1]?.replace(")", "");

      if (Object.keys(displayScheduleData)?.length > 0) {
        setSelectedDate(
          parseInt(moment(displayScheduleData?.scheduled_on)?.format("DD"))
        );
        setTimeSlot([
          {
            time: moment(displayScheduleData?.scheduled_on)?.format("hh:mm"),
            timeZone: tzValue,
          },
        ]);
      } else {
        setSelectedDate(null);
        setTimeSlot([null]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayScheduleData]);

  //after time
  // var currentTime = moment();
  // var isAfterTimes = timeSlot?.filter((item) => {
  //   var currentDate = moment(currentTime).format("YYYY-MM-DD");
  //   console.log("🚀 ~ isAfterTimes ~ currentDate:", currentDate);
  //   var futureDate = moment(item?.time, "hh:mm A").format("YYYY-MM-DD");
  //   console.log("🚀 ~ isAfterTimes ~ futureDate:", futureDate);
  //   return moment(futureDate).isSame(currentDate, "day");
  // });

  useEffect(() => {
    if (!isUnavailable) {
      setUnAvailableDate([]);
    }
  }, [isUnavailable]);

  useEffect(() => {
    if (mySessionData) {
      let dates;
      if (customizeDateTime?.length > 0) {
        dates = customizeDateTime?.map((dateTime) => {
          return moment(dateTime?.date, "DD/MM/YYYY").format("YYYY-MMM-DD");
        });
      } else {
        dates = [];
      }
      setCustomizeDate(dates);

      let date;
      if (unavailableDateTime?.length > 0) {
        date = unavailableDateTime?.map((dateTime) => {
          return moment(dateTime?.date, "DD/MM/YYYY").format("YYYY-MMM-DD");
        });
      } else {
        date = [];
      }

      setUnAvailableDate(date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mySessionData, customizeDateTime]);

  useEffect(() => {
    let dates;
    if (customize_time?.length > 0) {
      dates = customize_time?.map((dateTime) => {
        return moment(dateTime?.date, "DD/MM/YYYY").format("YYYY-MMM-DD");
      });
    } else {
      dates = [];
    }
    setCustomizeDate(dates);

    let date;
    if (unavalible_time?.length > 0) {
      date = unavalible_time?.map((dateTime) => {
        return moment(dateTime?.date, "DD/MM/YYYY").format("YYYY-MMM-DD");
      });
    } else {
      date = [];
    }

    setUnAvailableDate(date);
  }, [unavalible_time, customize_time]);
  const formattedDate = moment(
    `${selectedDate} ${monthName} ${monthYear}`,
    "DD MMM YYYY"
  ).format("YYYY-MM-DD");
  const dayOfWeek = moment(formattedDate).format("ddd");
  const match = sessionWeekDays?.find((item) => item?.day === dayOfWeek);
  const userAvilableDays = sessionWeekDays
    ?.map((item) => item?.day)
    ?.join(", ");

  return (
    <div id="calendar-layout-container">
      <div className="text-14-500 color-5261 mb-2 ps-3">Select Date</div>
      <div
        className={
          upDateViewStatus || (reschedule_Session_iD && !isReschedule)
            ? "disabled-block"
            : ""
        }
      >
        <div className="d-flex justify-content-between align-items-center ps-3">
          <div className="text-14-500 color-5068 text-uppercase">
            {monthName} {monthYear}
          </div>
          <div className="d-flex gap-2 cmb-10">
            {/* <span className="d-flex">
            <i className="bi bi-chevron-left text-14-600 color-subtitle-navy opacity-50" />
          </span> */}
            <span
              className="d-flex pointer"
              onClick={() => {
                // let selectcurrentDate =
                //   moment(currentDate).format("YYYY-MM-DD");
                // let isBeforeMonth = moment().isBefore(selectcurrentDate);
                // setSelectisBeforeMonth(isBeforeMonth);
                handleMonth("PREV");
              }}
            >
              <i className="bi bi-chevron-left text-14-600 color-subtitle-navy" />
            </span>
            <span
              className="d-flex pointer"
              onClick={() => {
                // setSelectisBeforeMonth(true);
                handleMonth("NEXT");
              }}
            >
              <i className="bi bi-chevron-right text-14-600 color-subtitle-navy" />
            </span>
          </div>
        </div>
        <div className="d-flex w-100">
          {headBar?.map((elm, index) => {
            return (
              <div key={index} className="week-title">
                {elm?.title}
              </div>
            );
          })}
        </div>
        <div className="d-flex flex-wrap w-100 cmb-26">
          {Array.from(Array(blankBoxes)?.keys())?.map((_, index) => {
            return <div key={index} className="month-day" />;
          })}
          {Array.from(Array(monthLastDay)?.keys())?.map((_, index) => {
            const renderDay = index + 1;
            const userSelectDate = `${monthYear}-${monthName}-${renderDay}`;
            let momentOne = moment(userSelectDate).format("YYYY-MM-DD");
            let isBefore = moment(momentOne).isBefore(minDate);
            let currentMonth = moment().month() + 1;
            let currentYear = moment().year();
            let selectcurrentMonth =
              moment.monthsShort().indexOf(monthName) + 1;
            /* let currentDate = moment().format("YYYY-MMM-DD"); */

            /* let targetDate = moment(userSelectDate, "YYYY-MM-DD"); */

            /* let isBefore = currentDate.isBefore(userSelectDate, "day"); */

            let baseClass = "";
            if (renderDay === reseduleDate) {
              baseClass = "reschedule-day";
            } else if (renderDay === selectedDate) {
              /* } else if (renderDay === 20) { */
              baseClass = "active-day";
            } else if (
              monthDay > renderDay ||
              selectcurrentMonth < currentMonth ||
              monthYear < currentYear
            ) {
              baseClass = "inactive-day";
            } else if (monthDay < renderDay) {
              baseClass = "future-day";
            } else if (monthDay === renderDay) {
              baseClass = "inactive-day-select";
            }
            // else if(monthYear === moment().year()) {
            //   console.log('PQR');
            //   if(parseInt(moment(monthName, 'MMM').format('MM')) < moment().month()) {
            //     baseClass = "inactive-day";
            //   } else {
            //     if (monthDay < renderDay) {
            //       baseClass = "future-day";
            //     }
            //     // // else if (monthDay === renderDay) {
            //     // //   baseClass = "inactive-day-select";
            //     // // }
            //   }
            // }
            else {
              baseClass = "";
            }

            return (
              <div
                key={index}
                className={`month-day ${baseClass} ${
                  minDate && isBefore && "disabled-block"
                }`}
              >
                <span
                  className="day-block pointer"
                  onClick={() => {
                    if (sessionCustomizeTime?.length > 0 && !isBookingSession) {
                    } else {
                      if (renderDay >= monthDay) {
                        if (preview) {
                          setSelectedDate(renderDay);
                          const previewSlot = previewTimeSlot
                            ?.filter(
                              (d) =>
                                d?.day ===
                                moment(
                                  `${renderDay} ${monthName} ${monthYear}`
                                ).format("ddd")
                            )
                            ?.map((slot) => ({
                              time: moment(slot?.startTime, "hh:mm").format(
                                "hh:mm A"
                              ),
                              timeZone: slot?.timeZone,
                            }));
                          setTimeSlot(previewSlot);
                        }
                        if (
                          isUnavailable &&
                          !isReschedule &&
                          !isBookingSession
                        ) {
                          let dataToDelete = null;
                          // const newData = customizeDateTime?.map((o, i) => {
                          //   if (
                          //     o?.date ===
                          //     moment(userSelectDate).format("DD/MM/YYYY")
                          //   ) {
                          //     dataToDelete = i;
                          //     return i;
                          //   } else {
                          //     return [];
                          //   }
                          // });
                          if (dataToDelete !== null) {
                            dispatch(
                              deleteParticularCustomizeDateTime(dataToDelete)
                            );
                          }
                          let deleteFromDate = null;
                          // let data = customizeDate?.map((date, i) => {
                          //   if (
                          //     date ===
                          //     moment(userSelectDate).format("YYYY-MMM-DD")
                          //   ) {
                          //     deleteFromDate = i;
                          //     return i;
                          //   } else {
                          //     return [];
                          //   }
                          // });
                          setCustomizeDate(
                            customizeDate?.filter(
                              (item, index) => index !== deleteFromDate
                            )
                          );
                          if (
                            !unAvailableDate?.includes(
                              `${monthYear}-${monthName}-${renderDay}`
                            )
                          ) {
                            dispatch(
                              setUnavailableDateTime({
                                date: moment(userSelectDate).format(
                                  "DD/MM/YYYY"
                                ),
                                timezone: null,
                                start_time: null,
                                end_time: null,
                              })
                            );
                            let unavailable = [...unAvailableDate];
                            unavailable.push(
                              `${monthYear}-${monthName}-${renderDay}`
                            );
                            setUnAvailableDate(unavailable);
                          }
                        } else if (!isReschedule && !isBookingSession) {
                          setUnAvailableDate([]);
                          dispatch(deleteUnavailableDateTime());
                          if (
                            !customizeDate?.includes(
                              `${monthYear}-${monthName}-${renderDay}`
                            ) &&
                            (customizeDate?.length ===
                              customizeDateTime?.length ||
                              customizeDate?.length === 0)
                          ) {
                            let customDate = [...customizeDate];
                            customDate?.push(
                              `${monthYear}-${monthName}-${renderDay}`
                            );
                            setCustomizeDate(customDate);
                            setCustomizeDateTime({
                              date: moment(
                                `${monthYear}-${monthName}-${renderDay}`,
                                "YYYY-MMM-DD"
                              ).format("DD/MM/YYYY"),
                              timezone: null,
                              start_time: null,
                              end_time: null,
                            });
                            dispatch(
                              setCustomizedDate(
                                `${renderDay} ${monthName} ${monthYear}`
                              )
                            );
                          }
                        }
                        //for book session
                        if (isSchedule) {
                          //for dynamic time slot
                          let sessionTimeDate = `${renderDay}-${monthName}-${monthYear}`;
                          const timeSlotPayload = {
                            // date: moment(sessionTimeDate).format("DD-MM-YYYY"),
                            date: moment(sessionTimeDate).format("YYYY-MM-DD"),
                            session_id: sId,
                            day: moment(sessionTimeDate).format("ddd"),
                          };
                          getTimeSlot(timeSlotPayload);
                          setSelectedDate(renderDay);
                          setSelectedTime(null);
                          payload((prev) => {
                            return {
                              ...prev,
                              session_date: `${renderDay}-${monthName}-${monthYear}`,
                            };
                          });
                        }
                        //for reschedule session
                        if (isReschedule) {
                          let sessionTimeDate = `${renderDay}-${monthName}-${monthYear}`;
                          const timeSlotPayload = {
                            date: moment(sessionTimeDate).format("YYYY-MM-DD"),
                            session_id: reschedule_Session_iD,
                            day: moment(sessionTimeDate).format("ddd"),
                          };
                          getTimeSlot(timeSlotPayload);
                          setReScheduleDate(renderDay);
                          setReScheduleTime(null);
                          reSchedulePayload((prev) => {
                            return {
                              ...prev,
                              session_date: `${renderDay}-${monthName}-${monthYear}`,
                            };
                          });
                        }
                      }
                    }
                  }}
                >
                  {customizeDate?.includes(
                    moment(`${monthYear}-${monthName}-${renderDay}`).format(
                      "YYYY-MMM-DD"
                    )
                  ) && <span className={`view-pointer bg-7598`} />}
                  {unAvailableDate?.includes(
                    moment(`${monthYear}-${monthName}-${renderDay}`).format(
                      "YYYY-MMM-DD"
                    )
                  ) && <span className={`view-pointer bg-736a`} />}
                  {sessionCustomizeTime?.length > 0 &&
                    // eslint-disable-next-line array-callback-return
                    sessionCustomizeTime?.map((dateTime, i) => {
                      if (
                        dateTime?.date ===
                        `${moment(renderDay, "DD").format("DD")}/${moment(
                          monthName,
                          "MMM"
                        ).format("MM")}/${monthYear}`
                      ) {
                        return (
                          <span key={i} className={`view-pointer bg-7598`} />
                        );
                      }
                    })}
                  {sessionUnAvailableTime?.length > 0 &&
                    // eslint-disable-next-line array-callback-return
                    sessionUnAvailableTime?.map((dateTime, i) => {
                      if (
                        dateTime?.date ===
                        `${moment(renderDay, "DD").format("DD")}/${moment(
                          monthName,
                          "MMM"
                        ).format("MM")}/${monthYear}`
                      ) {
                        return (
                          <span key={i} className={`view-pointer bg-736a`} />
                        );
                      }
                    })}
                  {renderDay}
                </span>
              </div>
            );
          })}
        </div>
        <div className="ps-3 d-flex align-items-center gap-4 cmb-10">
          <div className="d-flex align-items-center gap-2">
            <span className="p-1 bg-736a border rounded-circle" />
            <span className="text-13-500 color-5261">Unavailable</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="p-1 bg-7598 border rounded-circle" />
            <span className="text-13-500 color-5261">Customized Time</span>
          </div>
        </div>
        {isSelectTime && (
          <div className="ps-3">
            {timeSlot?.length > 0 ? (
              <>
                <div className="text-14-500 color-5261 mb-2">Select Time</div>
                <div className="row">
                  {timeSlot?.map((elm, index) => {
                    let isRe = reseduleTime === elm?.time;
                    let isSelectTime = selectedTime === elm?.time;
                    let isDisable =
                      moment(
                        `${selectedDate}-${monthName}-${monthYear} ${elm?.time}`,
                        "DD-MMM-YYYY HH:mm A"
                      ) < moment(new Date(), "DD-MMM-YYYY HH:mm A");
                    return (
                      <div className="col-md-3 cmb-15" key={index}>
                        <div
                          className={`pointer rounded pt-2 pb-2 ${
                            isDisable
                              ? "b-95ab"
                              : isRe
                              ? "b-a32d"
                              : isSelectTime
                              ? "b-new-car"
                              : "b-2e44"
                          }`}
                          onClick={() => {
                            if (!isDisable) {
                              if (preview) {
                                setSelectedTime(elm?.time);
                              }
                              //For Schedule
                              if (isSchedule) {
                                setSelectedTime(elm?.time);
                                payload((prev) => {
                                  return {
                                    ...prev,
                                    start_time: moment(
                                      elm?.time,
                                      "hh:mm A"
                                    ).format("HH:mm"),
                                  };
                                });
                              }
                              //For ReSchedule
                              if (isReschedule) {
                                setReScheduleTime(elm?.time);
                                reSchedulePayload((prev) => {
                                  return {
                                    ...prev,
                                    start_time: moment(
                                      elm?.time,
                                      "hh:mm A"
                                    ).format("HH:mm"),
                                  };
                                });
                              }
                            }
                          }}
                        >
                          <div
                            className={`text-center text-14-400 ${
                              isDisable
                                ? "color-95ab"
                                : isRe
                                ? "color-a32d"
                                : isSelectTime
                                ? "color-new-car"
                                : "color-5261"
                            }`}
                          >
                            {elm?.time}
                          </div>
                          <div
                            className={`text-center text-13-400 ${
                              isDisable
                                ? "color-95ab"
                                : isRe
                                ? "color-a32d"
                                : isSelectTime
                                ? "color-new-car"
                                : "color-5261"
                            }`}
                          >
                            {elm?.timeZone}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-12-500 color-danger-light text-center">
                {/* {selectedDate
                  ? "No Slots Available"
                  : match === undefined
                  ? `Only on ${userAvilableDays} days Slots are Available`
                  : ""} */}
                {match === undefined
                  ? `Only on ${userAvilableDays} days Slots are Available`
                  : ""}
              </p>
            )}
          </div>
        )}
        {!isReschedule && isSchedule && selectedTime && (
          <div className="ps-3 cmt-20">
            <Button
              text="Schedule Meeting"
              btnStyle="primary-dark"
              btnLoading={btnLoading}
              onClick={() => {
                if (isAPIFunction) {
                  // navigate(`/${memberType}/mentorship/mentee/cardInformation/${sId}`);
                  handleScheduleMeeting();
                }
              }}
            />
          </div>
        )}
        {isReschedule && reScheduleTime && (
          <div className="ps-3 cmt-20">
            <Button
              text="Reschedule Now"
              btnStyle="primary-dark"
              onClick={() => {
                if (isRescheduleAPIFunction) {
                  handleReScheduleMeeting();
                }
              }}
              btnLoading={btnLoading}
            />
            <div
              className="text-center pt-3 pb-3 pointer text-14-500 color-5261"
              onClick={() => {
                if (isRescheduleNavigate) {
                  handleReschedulNavigate();
                  setReScheduleDate(null);
                  setReScheduleTime(null);
                  // let sessionTimeDate = selectedDate;
                  if (isScheduleDataAvailable) {
                    if (Object.keys(displayScheduleData)?.length > 0) {
                      const tz =
                        displayScheduleData?.time_zone?.[0]?.time_zone?.split(
                          "("
                        );
                      const tzValue = tz?.[tz?.length - 1]?.replace(")", "");
                      setSelectedDate(
                        parseInt(
                          moment(displayScheduleData?.scheduled_on)?.format(
                            "DD"
                          )
                        )
                      );
                      setTimeSlot([
                        {
                          time: moment(
                            displayScheduleData?.scheduled_on
                          )?.format("hh:mm"),
                          timeZone: tzValue,
                        },
                      ]);
                    } else {
                      setSelectedDate(null);
                      setTimeSlot([null]);
                    }
                  }
                }
              }}
            >
              Cancel
            </div>
          </div>
        )}
        {/* {isView && (
          <div className="ps-3 d-flex align-items-center gap-4">
            <div className="d-flex align-items-center gap-2">
              <span className="p-1 bg-736a border rounded-circle" />
              <span className="text-13-500 color-5261">Unavailable</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="p-1 bg-7598 border rounded-circle" />
              <span className="text-13-500 color-5261">Customized Time</span>
            </div>
          </div>
        )} */}
        {sessionCustomizeTime?.length > 0 &&
          !isBookingSession &&
          sessionCustomizeTime?.map((dateTime, i) => {
            return (
              <React.Fragment key={i}>
                <div className="text-15-500 color-5261 cmt-10">
                  Schedule time on{" "}
                  {`${moment(dateTime?.date, "DD/MM/YYYY").format("DD MMM")}`}
                </div>
                <div className="text-13-400 color-5261 cmb-5">{`(${dateTime?.start_time} - ${dateTime?.end_time})`}</div>
              </React.Fragment>
            );
          })}

        {isCustomizeTime && (
          <div className="ps-3 mt-2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                {customizeDateTime?.length > 0 &&
                  customizeDateTime?.map((customDateTime, i) => {
                    return (
                      <React.Fragment key={i}>
                        <div className="text-15-500 color-5261">
                          Schedule time on{" "}
                          {`${moment(customDateTime?.date, "DD/MM/YYYY").format(
                            "DD"
                          )} ${moment(
                            customDateTime?.date,
                            "DD/MM/YYYY"
                          ).format("MMM")}`}
                        </div>
                        {!isEmpty(customizeDateTime) && (
                          <div className="text-13-400 color-5261">
                            (
                            {`${customDateTime?.start_time} - ${customDateTime?.end_time}`}
                            )
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                {(customizeDateTime?.length === 0 ||
                  customizeDate?.length > customizeDateTime?.length) && (
                  <>
                    <div className="text-15-500 color-5261">
                      Schedule time on{" "}
                      {customizeDate?.length > 0 &&
                        `${moment(
                          customizeDate?.[customizeDate?.length - 1],
                          "YYYY-MMM-DD"
                        ).format("DD MMM")}`}
                    </div>
                    {!isEmpty(customizeDateTime) &&
                    customizeDate?.length === customizeDateTime?.length ? (
                      <div className="text-13-400 color-5261">
                        (
                        {`${customizeTime?.[0]?.start_time} - ${customizeTime?.[0]?.end_time}`}
                        )
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                )}
              </div>
              <Button
                text="Customize Time"
                btnStyle="primary-outline"
                className="h-35 text-12-500"
                onClick={() => {
                  if (customizeDate) {
                    customizeOnClick();
                  }
                }}
                disabled={isUnavailable}
              />
            </div>
            <div className="mt-2 d-flex align-items-center gap-2">
              <div className="text-15-500 color-5261">
                Unavailable on{" "}
                {isUnavailable &&
                  unAvailableDate &&
                  unAvailableDate?.map((unAvailable, i) => {
                    return `${moment(unAvailable, "YYYY-MMM-DD").format(
                      "MMM DD"
                    )}${i !== unAvailableDate?.length - 1 ? ", " : ""}`;
                  })}
              </div>
              <CheckBox
                type="PRIMARY-ACTIVE"
                isChecked={isUnavailable}
                onClick={() => {
                  setIsUnavailable(!isUnavailable);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarLayout;
