import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Card from "../Card";
import Dropdown from "../../form/Dropdown";
import { monthNames } from "utils/constants";
import { getDataFromLocalStorage } from "utils/helpers";
import { getIFERPCalender, setIsCalendar } from "store/slices";
import Modal from "../Modal";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.scss";

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const dispatch = useDispatch();
  const { isCalendar } = useSelector((state) => ({
    isCalendar: state.global.isCalendar,
  }));
  const navigate = useNavigate();
  const params = useParams();
  const { memberType } = params;
  const disptach = useDispatch();
  const { myEvents } = useSelector((state) => ({
    myEvents: state.global.myEvents,
  }));
  const [date, setDate] = useState(moment());
  const [iferpEventList, setIFERPEventList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [type, setType] = useState("ALL");

  const handelFilterChange = (e) => {
    const val = e?.target?.value;
    setType(val);
    // changeEventsRes(newList);
  };
  const changeEventsRes = (list) => {
    list = list.map((elm) => {
      const {
        event_name,
        event_start_date,
        event_end_date,
        isIFERP,
        is_registered,
      } = elm;
      let nsd = `${event_start_date} 00:00`;
      let ned = `${event_end_date} 23:00`;
      return {
        title: event_name.substring(0, 100),
        allDay: nsd === ned,
        start: moment(nsd, "YYYY-MM-DD hh:mm"),
        end: moment(ned, "YYYY-MM-DD hh:mm"),
        bgColor:
          `${is_registered}` === "1"
            ? "#FF9478"
            : isIFERP
            ? "#2148c0e6"
            : "#7236f0bf",
        ...elm,
      };
    });
    setEventList(list);
  };
  const getCalenderEvents = async () => {
    const response = await disptach(getIFERPCalender());
    let listData = response?.data || [];
    listData = listData.map((e) => {
      return { ...e, isIFERP: true };
    });
    setIFERPEventList(listData);
  };
  useEffect(() => {
    getCalenderEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    let newList = [];
    if (type === "ALL") {
      newList = [...iferpEventList, ...myEvents];
    } else if (type === "IFERP Calendar") {
      newList = iferpEventList;
    } else if (type === "My Calendar") {
      newList = myEvents;
    } else {
      // Nothing
    }
    changeEventsRes(newList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, iferpEventList]);

  const access = {
    isCalenderFilter: getDataFromLocalStorage("user_type") !== "0",
  };

  return (
    <>
      {isCalendar && (
        <Modal
          largeClose
          fullscreen
          onHide={() => {
            dispatch(setIsCalendar(false));
          }}
        >
          <div id="calendar-view-container">
            <div className="text-center text-26-500 mb-5 title-text">
              Calendar
            </div>
            <Card className="ps-3 pe-3 pt-3 pb-3">
              <Calendar
                popup={true}
                step={15}
                timeslots={5}
                date={date}
                defaultDate={moment()}
                views={["month"]}
                defaultView="month"
                localizer={localizer}
                events={eventList}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100vh" }}
                // style={{ height: "calc(100vh - 260px)" }}
                onSelectEvent={(e) => {
                  localStorage.prevRoute = window.location.pathname;
                  navigate(
                    `/${memberType}/conferences-and-events/event-details/${e.id}/conference-details`
                  );
                  dispatch(setIsCalendar(false));
                }}
                onNavigate={(e) => {}}
                components={{
                  toolbar: (toolbar) => {
                    const { date: tDate } = toolbar;
                    const goToBack = () => {
                      setDate(moment(tDate).subtract(1, "months"));
                      toolbar.onNavigate("PREV");
                    };
                    const goToNext = () => {
                      setDate(moment(tDate).add(1, "months"));
                      toolbar.onNavigate("NEXT");
                    };
                    const year = moment(tDate).format("YYYY");
                    const month = moment(tDate).format("MMM");
                    return (
                      <div className="rbc-toolbar mb-4 mt-3 d-flex gap-2">
                        <span className="rbc-btn-group d-flex align-items-center gap-5">
                          <div className="text-22-500 color-raisin-black">
                            {`${month} ${year}`}
                          </div>
                          <span className="rbc-btn-group d-flex gap-3">
                            <div className="icon-button" onClick={goToBack}>
                              <i className="bi bi-chevron-left" />
                            </div>
                            <div className="icon-button" onClick={goToNext}>
                              <i className="bi bi-chevron-right" />
                            </div>
                          </span>
                        </span>
                        <span className="rbc-toolbar-label" />
                        <span className="rbc-btn-group d-flex gap-3 flex-wrap">
                          {access.isCalenderFilter && (
                            <div
                              style={{
                                width: "190px",
                              }}
                            >
                              <Dropdown
                                options={[
                                  {
                                    id: "ALL",
                                  },
                                  {
                                    id: "IFERP Calendar",
                                  },
                                  {
                                    id: "My Calendar",
                                  },
                                ]}
                                optionValue="id"
                                placeholder="Select Calendar Type"
                                value={type}
                                onChange={handelFilterChange}
                              />
                            </div>
                          )}
                          <div
                            style={{
                              width: "190px",
                            }}
                          >
                            <Dropdown
                              options={monthNames}
                              placeholder="Month"
                              value={moment(tDate).format("MM")}
                              onChange={(e) => {
                                setDate(
                                  moment(
                                    `01-${e.target.value}-${year}`,
                                    "DD-MM-YYYY"
                                  )
                                );
                              }}
                            />
                          </div>
                        </span>
                      </div>
                    );
                  },
                }}
                eventPropGetter={(event) => {
                  var backgroundColor = event.bgColor;
                  var style = {
                    backgroundColor: backgroundColor,
                    color: "#fff",
                  };
                  return {
                    style: style,
                  };
                }}
              />
            </Card>
          </div>
        </Modal>
      )}
    </>
  );
};
export default CalendarView;
