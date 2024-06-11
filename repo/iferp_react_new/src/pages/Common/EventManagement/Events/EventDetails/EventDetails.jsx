import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { some } from "lodash";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import { icons } from "utils/constants";
import { fetchUserEventDetails, getEvent, storeEventData } from "store/slices";
import { getDataFromLocalStorage } from "utils/helpers";
import ConferenceDetails from "./ConferenceDetails";
import Agenda from "./Agenda";
import Community from "./Community";
import Participants from "./Participants";
import EventSubmittedAbstracts from "./EventSubmittedAbstracts";
import Reviewers from "../../Reviewers";
import "./EventDetails.scss";

const EventDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { memberType, moduleType, eventId } = params;
  const { eventData } = useSelector((state) => ({
    eventData: state.global.eventData,
  }));
  const [isFormLoading, setIsFormLoading] = useState(true);
  const handelRedierct = (type) => {
    navigate(`/${memberType}/${moduleType}/event-details/${eventId}/${type}`);
  };
  const fetchEventDetails = async () => {
    if (getDataFromLocalStorage("user_type") === "0") {
      await dispatch(getEvent(eventId));
    } else {
      await dispatch(
        fetchUserEventDetails({
          event_id: params?.eventId,
          user_id: getDataFromLocalStorage("id"),
        })
      );
    }
    setIsFormLoading(false);
  };
  useEffect(() => {
    fetchEventDetails();
    return () => {
      dispatch(storeEventData({}));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAgenda = some(eventData?.event_agendas, (o) =>
    some(o?.agenda_sessions, (e) => e.name)
  );

  const type = params?.formType || "conference-details";
  const activeClass = "p-2 bg-new-car color-white text-16-500";
  const inActiveClass = "p-2 color-black-olive text-16-500 pointer";

  const { resource_role, user_type: userType } = getDataFromLocalStorage();

  const access = {
    isParticipants: ["0", "6"].includes(userType),
    isEventAbstarct: ["0", "6"].includes(userType),
    isAgenda: ["0", "6"].includes(userType) || isAgenda,
    isTab: !eventData?.created_id && !isFormLoading,
    isReviewers: resource_role === "2",
  };
  useEffect(() => {
    const isNavigate = localStorage.getItem("IsGlobalProfileRoute");
    if (isNavigate) {
      localStorage.removeItem("IsGlobalProfileRoute");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="event-details-container">
      {access.isTab && (
        <Card className="d-flex align-items-center unset-br cpe-12 cps-12 pt-2 pb-2">
          <div className="w-100 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-start">
              <div
                className="d-flex pt-2"
                onClick={() => {
                  if (localStorage.prevRoute) {
                    navigate(localStorage.prevRoute);
                  } else {
                    navigate(`/${memberType}/${moduleType}/events`);
                  }
                }}
              >
                <img
                  src={icons.leftArrow}
                  alt="back"
                  className="h-21 me-3 pointer"
                />
              </div>
              <div className="d-flex align-items-center flex-wrap gap-3">
                <div
                  className={
                    type === "conference-details" ? activeClass : inActiveClass
                  }
                  onClick={() => {
                    if (type !== "conference-details") {
                      handelRedierct("conference-details");
                    }
                  }}
                >
                  Conference Details
                </div>
                {access.isAgenda && (
                  <div
                    className={type === "agenda" ? activeClass : inActiveClass}
                    onClick={() => {
                      if (type !== "agenda") {
                        isAgenda
                          ? handelRedierct("agenda")
                          : handelRedierct("agenda/add-agenda");
                      }
                    }}
                  >
                    Agenda
                  </div>
                )}
                <div
                  className={type === "community" ? activeClass : inActiveClass}
                  onClick={() => {
                    if (type !== "community") {
                      handelRedierct("community");
                    }
                  }}
                >
                  Community
                </div>
                {access.isParticipants && (
                  <div
                    className={
                      type === "participants" ? activeClass : inActiveClass
                    }
                    onClick={() => {
                      if (type !== "participants") {
                        handelRedierct("participants");
                      }
                    }}
                  >
                    Participants
                  </div>
                )}
                {access.isEventAbstarct && (
                  <div
                    className={
                      type === "submitted-abstracts"
                        ? activeClass
                        : inActiveClass
                    }
                    onClick={() => {
                      if (type !== "submitted-abstracts") {
                        handelRedierct("submitted-abstracts");
                      }
                    }}
                  >
                    Submitted Abstracts
                  </div>
                )}
                {access.isReviewers && (
                  <div
                    className={
                      type === "reviewers" ? activeClass : inActiveClass
                    }
                    onClick={() => {
                      if (type !== "reviewers") {
                        handelRedierct("reviewers");
                      }
                    }}
                  >
                    Reviewers
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {isFormLoading ? (
        <Card className="cmt-24 cmb-24 cps-30 cpe-30 cpt-40 cpb-40 d-flex align-items-center justify-content-center">
          <Loader size="md" />
        </Card>
      ) : (
        <>
          {type === "conference-details" && (
            <ConferenceDetails
              fetchEventDetails={fetchEventDetails}
              eventId={eventId}
            />
          )}
          {type === "agenda" && <Agenda />}
          {type === "community" && <Community />}
          {type === "participants" && <Participants />}
          {type === "submitted-abstracts" && (
            <EventSubmittedAbstracts eventId={eventId} />
          )}
          {type === "reviewers" && (
            <div className="mt-3">
              <Reviewers eventId={eventId} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default EventDetails;
