import { Chart } from "react-google-charts";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import CreatePost from "components/Layout/CreatePost";
import PostList from "components/Layout/PostList";
import { icons, membershipType } from "utils/constants";
import "react-circular-progressbar/dist/styles.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import { getDataFromLocalStorage, getYearList } from "utils/helpers";
import { getDashboard } from "store/slices";
import MyActivity from "components/ReusableForms/Dashboard/MyActivity";
import Journals from "components/ReusableForms/Dashboard/Journals";
import PeopleYouMayKnow from "components/ReusableForms/Dashboard/PeopleYouMayKnow";
import MyGroups from "components/ReusableForms/Dashboard/MyGroups";
import UpcomingEvents from "components/ReusableForms/Dashboard/UpcomingEvents";
import MyMembership from "components/ReusableForms/Dashboard/MyMembership";
import Dropdown from "components/form/Dropdown";
import "./Dashboard.scss";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({});
  const [event_analytics_year, setEventAnalyticsYear] = useState(
    moment().format("YYYY")
  );
  const navigateToPost = () => {
    const userFlag = membershipType.find(
      (o) => o.id === getDataFromLocalStorage("user_type")
    )?.type;
    navigate(`/${userFlag}/network-management/network/posts/discover-posts`);
  };
  const fetchDashboardData = async (yearData) => {
    const response = await dispatch(
      getDashboard(`?event_analytics_year=${yearData}`)
    );
    setDashboardData(response?.data || {});
  };
  useEffect(() => {
    fetchDashboardData(moment().format("YYYY"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const data = [["", "Conference", "Webinar", "Workshop"]];

  const { activities, event_analytic } = dashboardData;
  Array.from({ length: 12 }).forEach((_, i) => {
    let keyIndex = i + 1;
    data.push([
      moment().month(i).format("MMM"),
      event_analytic?.data?.conference?.[keyIndex],
      event_analytic?.data?.webinar?.[keyIndex],
      event_analytic?.data?.workshop?.[keyIndex],
    ]);
  });
  let { membership_plan_id } = getDataFromLocalStorage();
  const access = {
    isPelopleYouKnow: membership_plan_id === 9,
    isMyGroups: membership_plan_id === 9,
  };
  return (
    <div id="student-dashboard" className="row">
      <Card className="cps-30 cpe-30 cpt-30 cpb-30 mb-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="text-18-600 color-black-olive">Event Analytics</div>
          <div className="d-flex">
            <Dropdown
              options={getYearList(10).map((o) => {
                return { ...o, name: o.id };
              })}
              optionValue="name"
              onChange={(e) => {
                setEventAnalyticsYear(e.target.value);
                fetchDashboardData(e.target.value);
              }}
              value={event_analytics_year}
              placeholder="Year"
            />
          </div>
        </div>
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={data}
          options={{
            tooltip: { isHtml: true },
            colors: ["#2479E0", "#7E87D9", "#55C7FA"],
            legend: { position: "bottom" },
            curveType: "function",
            chartArea: {
              width: "94%",
            },
            width: "100%",
          }}
        />
      </Card>
      <CreatePost />
      <Card className="mt-3 mb-3 cps-24 cpe-24 cpt-24 cpb-40">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="text-18-600 color-black-olive">Recent Feeds</div>
        </div>
        <PostList isDashboard />
        <div className="d-flex justify-content-center cpt-24">
          <Button
            isRounded
            text="View All Posts"
            btnStyle="primary-dark"
            className="cps-40 cpe-40"
            onClick={navigateToPost}
          />
        </div>
      </Card>
      <div className="col-md-12 mt-2">
        <div className="row">
          <div className="col-md-4 pt-3 pb-2">
            <img
              src={icons.networkWithExpert}
              alt="networkWithExpert"
              className="fill fit-image"
            />
          </div>
          <div className="col-md-4 pt-2 pb-2">
            <img
              src={icons.participantInEvent}
              alt="participantInEvent"
              className="fill fit-image"
            />
          </div>
          <div className="col-md-4 pt-2 pb-3">
            <img
              src={icons.publishPaperInJurnal}
              alt="publishPaperInJurnal"
              className="fill fit-image"
            />
          </div>
        </div>
      </div>
      <div className="col-md-6 mt-3">
        <UpcomingEvents />
      </div>
      <div className="col-md-6 mt-3">
        <MyMembership />
      </div>

      <div className="col-md-12">
        <div className="row">
          {access?.isPelopleYouKnow && (
            <div className="col-md-8 mt-3">
              <PeopleYouMayKnow />
            </div>
          )}
          {access.isMyGroups && (
            <div className="col-md-4 mt-3">
              <MyGroups />
            </div>
          )}
        </div>
      </div>
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-3 mt-3">
            <img
              src={icons.iferpConferenceNew}
              alt="conference"
              className="fit-image fill"
            />
          </div>
          <div className="col-md-3 mt-3">
            <img
              src={icons.iferpWebinarNew}
              alt="webinar"
              className="fit-image fill"
            />
          </div>

          <div className="col-md-3 mt-3">
            <img
              src={icons.iferpPublication}
              alt="publication"
              className="fit-image fill"
            />
          </div>

          <div className="col-md-3 mt-3">
            <img
              src={icons.iferpMember}
              alt="member"
              className="fit-image fill"
            />
          </div>
        </div>
      </div>
      <div className="mt-3">
        <Journals />
      </div>
      <div className="mt-3">
        <MyActivity data={activities} />
      </div>
    </div>
  );
};
export default Dashboard;
