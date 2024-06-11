import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { find, lowerCase, result, orderBy } from "lodash";
import moment from "moment";
// import Tab from "react-bootstrap/Tab";
// import Tabs from "react-bootstrap/Tabs";
import Button from "components/form/Button";
import Location from "components/form/Location";
import DatePicker from "components/form/DatePicker";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import SaveDate from "components/Layout/SaveDate";
import { fetchEventByType } from "store/slices";
import {
  getDataFromLocalStorage,
  getEventDateData,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import "./ConferencesAndEvents.scss";

const ConferencesAndEvents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const {
    eventType = "conference",
    memberType,
    moduleType,
    groupId,
    eventUserType,
  } = params;
  const isInstituionalEvent = params?.eventUserType === "institutional-events";
  const { eventTypeList } = useSelector((state) => ({
    eventTypeList: state.global.eventTypeList,
  }));
  const [filterData, setFilterData] = useState({
    country: "",
    city: "",
    date: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [eventList, setEventList] = useState([]);
  const [filterEventList, setFilterEventList] = useState([]);
  const handleRedirect = (type) => {
    const pathArray = window.location.pathname.split("/");
    pathArray.pop();
    const newPath = `${pathArray.join("/")}/${lowerCase(type).replace(
      /\s/g,
      "-"
    )}`;
    navigate(newPath);
  };
  const getProfiles = async () => {
    const formData = objectToFormData({
      group_id: groupId || "",
      user_id: getDataFromLocalStorage("id"),
      iferp_or_my_plan: isInstituionalEvent ? "MY" : "iferp-plan",
      is_institution: isInstituionalEvent ? 1 : "",
      event_type:
        result(
          find(
            eventTypeList,
            (o) => eventType === lowerCase(o.name).replace(/\s/g, "-")
          ),
          "id"
        ) || "1",
    });
    const response = await dispatch(fetchEventByType(formData));
    let data = [];
    if (response?.data?.event_details) {
      data = orderBy(response.data.event_details, "event_start_date");
    }
    setEventList(data);
    setFilterEventList(data);
    setIsLoading(false);
  };
  const handelChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setFilterData({ ...filterData, [id]: value });
    handelFilter({ ...filterData, [id]: value });
  };
  const handelFilter = (filterData) => {
    let newList = [];
    const { country, city, date } = filterData;
    if (!country && !city && !date) {
      newList = eventList;
    } else {
      eventList.forEach((e) => {
        let isMatched = false;
        var compareDate = moment(date, "YYYY-MM-DD");
        var startDate = moment(e.event_start_date, "YYYY-MM-DD");
        var endDate = moment(e.event_end_date, "YYYY-MM-DD");

        if (country && e?.country === country) {
          if (city) {
            if (e?.city === city) {
              if (date) {
                if (compareDate.isBetween(startDate, endDate, null, "[]")) {
                  isMatched = true;
                } else {
                  isMatched = false;
                }
              } else {
                isMatched = true;
              }
            } else {
              isMatched = false;
            }
          } else {
            if (date) {
              if (compareDate.isBetween(startDate, endDate, null, "[]")) {
                isMatched = true;
              } else {
                isMatched = false;
              }
            } else {
              isMatched = true;
            }
          }
        }
        if (
          !country &&
          date &&
          compareDate.isBetween(startDate, endDate, null, "[]")
        ) {
          isMatched = true;
        }

        if (isMatched) {
          newList.push(e);
        }
      });
    }
    setFilterEventList(newList);
  };

  useEffect(() => {
    setFilterData({ country: "", city: "", date: "" });
    setFilterEventList([]);
    setIsLoading(true);
    if (eventType) {
      getProfiles();
    }
    return () => {
      localStorage.removeItem("eventName");
      localStorage.removeItem("prevRoute");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventType, eventTypeList, eventUserType]);

  let displayList = filterEventList;
  displayList = displayList.filter(
    (o) => !moment().isAfter(o.event_start_date)
  );
  const activeClass = "p-2 bg-new-car color-white text-16-500 me-4";
  const inActiveClass = "p-2 color-black-olive text-16-500 me-4 pointer";
  const subActiveClass = "text-16-500 color-new-car pointer";
  const subInactiveClass = "text-16-500 color-black-olive pointer";
  const userType = getDataFromLocalStorage("user_type");
  const access = {
    // isIFERPANDInstitutionalTab:
    //   ["3"].includes(userType) && moduleType !== "chapters-groups",
    isApplyForCommitteeMember: userType === "2",
    isSubmittedAbstracts:
      (userType === "3" || userType === "4") &&
      moduleType !== "chapters-groups",
    isSponsorBtn: userType === "4",
    isNominateSpeakerBtn: userType === "4",
    isSubmitAbstract: userType === "5" || userType === "2",
    isRegister: !["0", "3", "6"].includes(userType) && !isInstituionalEvent,
    isView: ["6"].includes(userType),
    isCollaboration: ["3"].includes(userType),
    isIFERPANDInstitutionalTab:
      ["2", "3", "5"].includes(userType) && moduleType !== "chapters-groups",
  };
  return (
    <>
      {access.isIFERPANDInstitutionalTab && (
        <Card className="d-flex align-items-center p-1 unset-br mb-3">
          <div
            className={
              eventUserType === "iferp-events" ? activeClass : inActiveClass
            }
            onClick={() => {
              if (eventUserType !== "iferp-events") {
                navigate(
                  `/${memberType}/${moduleType}/iferp-events/event-list/conference`
                );
              }
            }}
          >
            IFERP Events
          </div>
          <div
            className={
              eventUserType === "institutional-events"
                ? activeClass
                : inActiveClass
            }
            onClick={() => {
              if (eventUserType !== "institutional-events") {
                navigate(
                  `/${memberType}/${moduleType}/institutional-events/event-list/conference`
                );
              }
            }}
          >
            Institutional Events
          </div>
        </Card>
      )}
      <Card className="cpt-30 cpe-24 cpb-24 cps-24 conferences-and-events-container">
        <div className="d-flex justify-content-between align-items-center flex-wrap flex-sm-nowrap">
          <div className="d-flex flex-wrap gap-3">
            {eventTypeList?.map((elem, index) => {
              const isActiveOption =
                params?.eventType === lowerCase(elem?.name).replace(/\s/g, "-");
              return (
                <div key={index}>
                  <div
                    id={elem.id === 1 ? "conference-id" : ""}
                    className={
                      isActiveOption ? subActiveClass : subInactiveClass
                    }
                    onClick={() => {
                      if (!isActiveOption) {
                        handleRedirect(elem?.name);
                      }
                    }}
                  >
                    {titleCaseString(elem?.name)}
                  </div>
                  <div
                    className={
                      isActiveOption
                        ? "primary-underline pt-1"
                        : "border-bottom border-white pt-1"
                    }
                  />
                </div>
              );
            })}
            {/* <Tabs
              defaultActiveKey={eventType}
              id="uncontrolled-tab-example"
              className="gap-3"
            >
              {eventTypeList.map((elem, index) => {
                return (
                  <Tab
                    key={index}
                    eventKey={lowerCase(elem?.name).replace(/\s/g, "-")}
                    title={
                      elem.id === 1 ? (
                        <span id="conference-id">{elem?.name}</span>
                      ) : (
                        elem?.name
                      )
                    }
                    onEnter={() => {
                      handleRedirect(elem?.name);
                    }}
                  />
                );
              })}
            </Tabs> */}
          </div>

          {access.isApplyForCommitteeMember && (
            <div id="committee-member-id">
              <Button
                isSquare
                btnStyle="primary-outline"
                className="text-14-500 cps-16 cpe-16 mt-3 mt-sm-0"
                text={
                  <div>
                    <div>Apply For</div>
                    <div className="text-nowrap">Committee Member</div>
                  </div>
                }
                onClick={() => {
                  navigate(
                    `/${memberType}/${moduleType}/apply-for-committee-member`
                  );
                }}
              />
            </div>
          )}
          {access.isSubmittedAbstracts && (
            <Button
              isSquare
              btnStyle="primary-outline"
              className="text-14-500 cps-10 cpe-10 text-nowrap h-35 mt-sm-0 mt-3"
              text="Submitted Abstracts"
              onClick={() => {
                navigate(`/${memberType}/${moduleType}/submitted-abstract`);
              }}
            />
          )}
        </div>
        {eventType === lowerCase(eventType).replace(/\s/g, "-") && (
          <div className="w-100 d-flex align-items-center justify-content-between flex-wrap mb-3 mt-5 gap-3">
            <div className="text-18-600 color-title-navy font-poppins text-wrap">{`Upcoming ${titleCaseString(
              eventType
            ).replace(/-/g, " ")}`}</div>
            <div className="d-flex align-items-center gap-3">
              <Location
                type="country"
                data={{
                  id: "country",
                  placeholder: "Country",
                  value: filterData.country,
                  onChange: handelChange,
                  isClearable: true,
                }}
              />
              <Location
                type="city"
                data={{
                  id: "city",
                  placeholder: "City",
                  value: filterData.city,
                  countryId: filterData.country,
                  onChange: handelChange,
                  isClearable: true,
                  disabled: !filterData.country,
                }}
              />

              <DatePicker
                isClearable
                value={filterData?.date}
                placeholder="Date"
                id="date"
                onChange={handelChange}
              />
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="d-flex align-items-center justify-content-center cpt-50 cpb-50">
            <Loader size="md" />
          </div>
        ) : displayList.length > 0 ? (
          displayList.map((elem, index) => {
            const formatedDate = getEventDateData(
              elem?.event_start_date,
              elem?.event_end_date
            );
            return (
              <div className="event-list-card-block row cmb-20" key={index}>
                <div className="col-md-2 date-time-block">
                  <div className="d-inline-block text-truncate text-center">
                    {formatedDate?.display}
                  </div>
                  <div className="mt-3">{formatedDate?.year}</div>
                </div>
                <div className="col-md-10 right-block">
                  <div
                    className="text-18-500 color-raisin-black lh-28 hover-effect"
                    onClick={() => {
                      localStorage.prevRoute = window.location.pathname;
                      navigate(
                        `/${memberType}/${moduleType}/event-details/${elem.id}/conference-details`
                      );
                    }}
                  >
                    {elem.event_name}
                    {/* <u
                      className="ms-2 color-new-car text-14-400 pointer"
                    
                    >
                      View More
                    </u> */}
                  </div>
                  <div className="location-button-block">
                    <div className="d-flex flex-wrap gap-3">
                      {elem?.country_name && (
                        <span className="text-15-500 color-davys-gray text-nowrap">
                          <i className="bi bi-geo-alt me-2" />
                          {`${elem?.city_name ? `${elem?.city_name},` : ""} ${
                            elem.country_name
                          }`}
                        </span>
                      )}

                      <SaveDate eventID={elem.id} />
                    </div>
                    <div className="d-flex align-items-center gap-3 flex-sm-nowrap flex-wrap justify-content-center">
                      {access.isSponsorBtn && (
                        <Button
                          isRounded
                          btnStyle="primary-outline"
                          className="text-14-500 cps-16 cpe-16"
                          text="Sponsor"
                          onClick={() => {
                            navigate(
                              `/${memberType}/${moduleType}/${eventType}/${elem.id}/sponsorship`
                            );
                          }}
                        />
                      )}
                      {access.isNominateSpeakerBtn && (
                        <Button
                          isRounded
                          btnStyle="primary-outline"
                          className="text-14-500 cps-16 cpe-16 pt-2 pb-2 h-46"
                          text={
                            <div className="text-12-500">
                              <div className="text-nowrap mt-2">
                                Nominate as speaker
                              </div>
                              <div className="mb-2">{"& chief guest"}</div>
                            </div>
                          }
                          onClick={() => {
                            localStorage.eventName = elem.event_name;
                            navigate(
                              `/${memberType}/${moduleType}/${eventType}/${elem.id}/nominate`
                            );
                          }}
                        />
                      )}
                      {access.isSubmitAbstract && (
                        <Button
                          isRounded
                          btnStyle="primary-dark"
                          className="text-14-500 cps-12 cpe-12 text-nowrap"
                          text="Submit Abstract/Paper"
                          onClick={() => {
                            navigate(
                              `/${memberType}/${moduleType}/${eventType}/${elem.id}/abstract-submission/add-abstract-submission`
                            );
                          }}
                        />
                      )}
                      {access.isRegister && (
                        <Button
                          onClick={() => {
                            localStorage.isRedirectToRegister = 1;
                            localStorage.prevRoute = window.location.pathname;
                            navigate(
                              `/${memberType}/${moduleType}/event-details/${elem.id}/conference-details`
                            );
                          }}
                          text={elem?.is_registered ? "Registered" : "Register"}
                          btnStyle="primary-dark"
                          className={`text-14-500 ${
                            elem?.is_registered
                              ? "cps-24 cpe-24"
                              : "cps-32 cpe-32"
                          }`}
                          disabled={elem?.is_registered}
                          isRounded
                        />
                      )}
                      {access.isView && (
                        <Button
                          onClick={() => {
                            localStorage.prevRoute = window.location.pathname;
                            navigate(
                              `/${memberType}/${moduleType}/event-details/${elem.id}/conference-details`
                            );
                          }}
                          text="View"
                          btnStyle="primary-dark"
                          className="text-14-500 cps-40 cpe-40"
                          isRounded
                        />
                      )}
                      {access.isCollaboration && (
                        <Button
                          onClick={() => {
                            let eventTypeId = eventTypeList?.find(
                              (o) => o.name === elem?.event_type
                            )?.id;
                            navigate(
                              `/${memberType}/help/collaboration/${eventTypeId}/${elem.id}`
                            );
                          }}
                          text="Apply as an academic partner"
                          btnStyle="primary-dark"
                          className="text-14-500"
                          isRounded
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="d-flex align-items-center justify-content-center cpt-50 cpb-50">
            {`No ${titleCaseString(eventType).replace(/-/g, " ")} Found`}
          </div>
        )}
      </Card>
    </>
  );
};
export default ConferencesAndEvents;
