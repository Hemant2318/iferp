import { useNavigate, useParams } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { getDataFromLocalStorage } from "utils/helpers";
import Events from "./Events";
import Sponsors from "./Sponsors";
import Reviewers from "./Reviewers";
import Nominations from "./Nominations";
import ActivityReport from "./ActivityReport";
import SubmittedPapers from "./SubmittedPapers";
import CommitteeMembers from "./CommitteeMembers";
import IFERPActivityPlan from "./IFERPActivityPlan";
import { useEffect } from "react";
import NewsNotifications from "./NewsNotifications";

const EventManagement = () => {
  const params = useParams();
  const { memberType, moduleType, type } = params;
  const navigate = useNavigate();
  const handleRedirect = (optionType) => {
    navigate(`/${memberType}/${moduleType}/${optionType}`);
  };
  const { resource_role, user_type: userType } = getDataFromLocalStorage();
  const access = {
    isActivityPlan: userType === "0",
    isNominations: userType === "0",
    isSponsors: userType === "0",
    isNewsNotification: userType === "0",
    isActivityReport: userType === "0",
    isReviewers: resource_role === "2",
  };
  useEffect(() => {
    if (!["0", "6"].includes(getDataFromLocalStorage("user_type"))) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div id="event-management-container">
      <Tabs
        defaultActiveKey={type}
        id="uncontrolled-tab-example"
        className="mb-4 gap-4"
      >
        <Tab
          eventKey="events"
          title="Events"
          onEnter={() => {
            handleRedirect("events");
          }}
        >
          {type === "events" && <Events />}
        </Tab>
        <Tab
          eventKey="submitted-abstracts"
          title="Submitted Abstracts"
          onEnter={() => {
            handleRedirect("submitted-abstracts");
          }}
        >
          {type === "submitted-abstracts" && <SubmittedPapers />}
        </Tab>
        <Tab
          eventKey="committee-members"
          title="Committee Members"
          onEnter={() => {
            handleRedirect("committee-members");
          }}
        >
          {type === "committee-members" && <CommitteeMembers />}
        </Tab>
        {access.isActivityPlan && (
          <Tab
            eventKey="activity-plan"
            title="IFERP Activity Plan"
            onEnter={() => {
              handleRedirect("activity-plan");
            }}
          >
            {type === "activity-plan" && <IFERPActivityPlan />}
          </Tab>
        )}
        {access.isNominations && (
          <Tab
            eventKey="nominations"
            title="Nominations"
            onEnter={() => {
              handleRedirect("nominations");
            }}
          >
            {type === "nominations" && <Nominations />}
          </Tab>
        )}
        {access.isSponsors && (
          <Tab
            eventKey="sponsors"
            title="Sponsors"
            onEnter={() => {
              handleRedirect("sponsors");
            }}
          >
            {type === "sponsors" && <Sponsors />}
          </Tab>
        )}
        {access.isActivityReport && (
          <Tab
            eventKey="activity-report"
            title="Activity Report"
            onEnter={() => {
              handleRedirect("activity-report");
            }}
          >
            {type === "activity-report" && <ActivityReport />}
          </Tab>
        )}
        {access.isReviewers && (
          <Tab
            eventKey="reviewers"
            title="Reviewers"
            onEnter={() => {
              handleRedirect("reviewers");
            }}
          >
            {type === "reviewers" && <Reviewers />}
          </Tab>
        )}
        {access.isNewsNotification && (
          <Tab
            eventKey="news-notifications"
            title="News & Notifications"
            onEnter={() => {
              handleRedirect("news-notifications");
            }}
          >
            {type === "news-notifications" && <NewsNotifications />}
          </Tab>
        )}
      </Tabs>
    </div>
  );
};
export default EventManagement;
