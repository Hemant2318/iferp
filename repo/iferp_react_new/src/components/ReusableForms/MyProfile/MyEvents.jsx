import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { includes, intersection, orderBy, replace } from "lodash";
import moment from "moment";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import FilterDropdown from "components/Layout/FilterDropdown";
import { icons } from "utils/constants";
import { getEventDate, titleCaseString } from "utils/helpers";
import { fetchInstitutionalEvents, fetchUserEvents } from "store/slices";
import ExploreLayout from "components/Layout/ExploreLayout";

const MyEvents = ({ userType }) => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { eventTypeList } = useSelector((state) => ({
    eventTypeList: state.global.eventTypeList,
  }));
  const [eventList, setEventList] = useState([]);
  const [eventDisplayList, setEventDisplayList] = useState([]);
  const getMyEvents = async () => {
    let data = [];
    if (userType === "3" || userType === "4") {
      const response = await dispatch(fetchInstitutionalEvents());
      data = response?.data || [];
    } else {
      const response = await dispatch(fetchUserEvents());
      data = response?.data?.event_details || [];
    }
    setEventList(orderBy(data, "event_start_date", "desc"));
    handelFilter("", orderBy(data, "event_start_date", "desc"));
  };
  const handelFilter = (filter, data = eventList) => {
    let newList = [];
    data?.forEach((elem) => {
      let diff = intersection(
        elem?.role?.split(",").map((o) => titleCaseString(o)),
        filter?.split(",").map((o) => titleCaseString(o))
      );
      if (
        (userType === "3" || userType === "4") &&
        includes(filter, elem?.event_type_id)
      ) {
        newList.push(elem);
      } else if (diff.length > 0) {
        newList.push(elem);
      } else {
        // Nothing
      }
    });
    if (!filter) {
      newList = data;
    }
    setEventDisplayList(newList);
  };
  useEffect(() => {
    getMyEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let exploreURL = "";
  if (userType === "3") {
    exploreURL = `/${params.memberType}/conferences-and-events/iferp-events/event-list/conference`;
  } else if (userType === "4") {
    exploreURL = `/${params.memberType}/events/event-list/conference`;
  } else {
    exploreURL = `/${params.memberType}/conferences-and-events/event-list/conference`;
  }

  return (
    <>
      {eventDisplayList.length === 0 ? (
        <Card className="cps-18 cpe-18 cpt-29 cpb-29">
          <ExploreLayout
            redirect={exploreURL}
            info="Whoops...You haven’t registered in any event"
          />
        </Card>
      ) : (
        <Card className="cps-18 cpe-18 cpt-29 cpb-29">
          <div className="d-flex align-items-center justify-content-between">
            <div className="text-18-500 color-blac-olive">
              {userType === "3" ? "Our Institutional Events" : "My Events"}
            </div>
            <div className="d-flex">
              <FilterDropdown
                list={
                  userType === "3" || userType === "4"
                    ? eventTypeList
                    : [
                        {
                          id: "presenter",
                          name: "Presenter",
                        },
                        {
                          id: "listener",
                          name: "Listener",
                        },
                        {
                          id: "keynote speaker",
                          name: "Keynote Speaker",
                        },
                        {
                          id: "session chair",
                          name: "Session Chair",
                        },
                        {
                          id: "committee member",
                          name: "Organizing Committee Member",
                        },
                      ]
                }
                handelChangeFilter={(e) => {
                  handelFilter(e);
                }}
                isHideAll
              />
            </div>
          </div>

          <div className="user-event-list">
            {eventDisplayList.map((elem, index) => {
              let roleValue = elem?.role;
              roleValue = replace(roleValue, ",", ", ");
              roleValue = replace(roleValue, "listener", "Listener");
              roleValue = replace(roleValue, "presenter", "Presenter");
              const isUpcoming =
                moment().diff(elem.event_start_date, "days") < 0 ? true : false;
              return (
                <div
                  className="user-list-block d-flex justify-content-between align-items-center flex-wrap"
                  key={index}
                >
                  {isUpcoming && (
                    <img
                      src={icons.primaryUpcommingLabel}
                      alt="upcomming"
                      className="upcomming-image"
                    />
                  )}
                  <div className="col-md-10 col-12">
                    <div
                      className={`text-16-500 color-raisin-black ${
                        isUpcoming ? "ps-5" : ""
                      }`}
                    >
                      {elem.event_name}{" "}
                      {userType === "3" && (
                        <span className="text-14-500 color-new-car ms-2">
                          {elem.registered_by}
                        </span>
                      )}
                    </div>
                    <div className="d-flex flex-wrap gap-3 mt-3">
                      <div className="text-15-500 color-silver-gray me-5 text-nowrap">
                        <i className="bi bi-calendar3-event me-2" />
                        {getEventDate(
                          elem.event_start_date,
                          elem.event_end_date
                        )}
                      </div>
                      {elem?.country_name && (
                        <div className="text-15-500 color-silver-gray me-5 text-nowrap">
                          <i className="bi bi-geo-alt me-2" />
                          {`${elem?.city_name ? `${elem?.city_name},` : ""} ${
                            elem.country_name
                          }`}
                        </div>
                      )}
                      <div className="text-15-500 color-silver-gray text-nowrap">
                        <i className="bi bi-person me-2 text-18-400" />
                        {userType === "3" || userType === "4"
                          ? `${
                              elem.strength_of_students +
                              elem.strength_of_faculties
                            } Members Registered`
                          : `Applied as ${roleValue}`}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2 d-flex justify-content-end pt-2">
                    <Button
                      isRounded
                      text="View More"
                      btnStyle="primary-outline"
                      className="cps-16 cpe-16 text-13-500 h-35 text-nowrap"
                      onClick={() => {
                        navigate(
                          `/${params.memberType}/my-profile/my-events/${elem.id}`
                        );
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </>
  );
};
export default MyEvents;
