import Card from "components/Layout/Card";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { orderBy } from "lodash";
import moment from "moment";
import { fetchUserEvents } from "store/slices";
import { getEventDate } from "utils/helpers";
import { studentRoute } from "utils/constants";

const UpcomingEvents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [eventList, setEventList] = useState([]);
  const getProfiles = async () => {
    const response = await dispatch(fetchUserEvents());
    let data = [];
    if (response?.data?.event_details) {
      data = orderBy(response.data.event_details, "event_start_date")
        ?.filter((o) => !moment().isAfter(o.event_start_date))
        ?.slice(0, 2);
    }
    setEventList(data);
  };
  useEffect(() => {
    getProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="cps-24 cpe-24 cpt-24 cpb-24 h-100">
      <div className="d-flex justify-content-between flex-wrap gap-2 cmb-20">
        <div className="text-18-500-27 color-title-navy font-poppins text-nowrap">
          Upcoming Conferences
        </div>
        <div
          className={`text-15-400 color-new-car pointer text-nowrap ${
            eventList.length > 0 ? "" : "d-none"
          }`}
          onClick={() => {
            navigate(studentRoute?.conferencesAndEvents);
          }}
        >
          <u>View All</u>
        </div>
      </div>
      <div className="events-list-container">
        {eventList.length === 0 ? (
          <div className="center-flex pt-5 pb-5">No Events Found</div>
        ) : (
          eventList.map((elm, index) => {
            return (
              <React.Fragment key={index}>
                <div className="event-list-block">
                  <div className="text-15-500 color-raisin-black cmb-20">
                    {elm?.event_name}
                  </div>
                  <div className="d-flex cmb-24">
                    <div className="text-14-500 color-subtitle-navy me-5">
                      <i className="bi bi-calendar3-event me-2" />
                      {getEventDate(elm?.event_start_date, elm?.event_end_date)}
                    </div>
                    <div className="text-14-500 color-subtitle-navy">
                      <i className="bi bi-geo-alt me-2 " />
                      {`${elm?.city_name ? `${elm?.city_name},` : ""} ${
                        elm?.country_name
                      }`}
                    </div>
                  </div>
                </div>
                {eventList.length - 1 !== index && (
                  <div className="border-bottom mt-3 mb-3" />
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
    </Card>
  );
};
export default UpcomingEvents;
