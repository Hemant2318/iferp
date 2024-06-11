import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { map } from "lodash";
import moment from "moment";
import { Chart } from "react-google-charts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Dropdown from "components/form/Dropdown";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import PostList from "components/Layout/PostList";
import CreatePost from "components/Layout/CreatePost";
import MyGroups from "components/ReusableForms/Dashboard/MyGroups";
import Journals from "components/ReusableForms/Dashboard/Journals";
import MyActivity from "components/ReusableForms/Dashboard/MyActivity";
import MyMembership from "components/ReusableForms/Dashboard/MyMembership";
import UpcomingEvents from "components/ReusableForms/Dashboard/UpcomingEvents";
import PeopleYouMayKnow from "components/ReusableForms/Dashboard/PeopleYouMayKnow";
import Welcome from "components/ReusableForms/Dashboard/Welcome";
import { getDataFromLocalStorage, getYearList } from "utils/helpers";
import { icons, membershipType } from "utils/constants";
import { getDashboard } from "store/slices";
import "react-circular-progressbar/dist/styles.css";
import "./Dashboard.scss";
import Loader from "components/Layout/Loader";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({});
  const [pageLoading, setPageLoading] = useState(true);

  const [year, setYear] = useState({
    event_analytic_year: moment().format("YYYY"),
    overview_year: moment().format("YYYY"),
    our_activity_year: moment().format("YYYY"),
  });
  const navigateToPost = (postType) => {
    const userFlag = membershipType.find(
      (o) => o.id === getDataFromLocalStorage("user_type")
    )?.type;
    navigate(`/${userFlag}/network-management/network/posts/${postType}`);
  };
  const fetchDashboardData = async (yearData) => {
    let queryParams = new URLSearchParams(yearData).toString();
    const response = await dispatch(getDashboard(`?${queryParams}`));
    setDashboardData(response?.data || {});
    setPageLoading(false);
  };
  useEffect(() => {
    fetchDashboardData(year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const data = [["", "IFERP Event", "Self Driven Event"]];

  const { event_analytics, our_activity, overview, activities } = dashboardData;
  map(event_analytics, (val, key) => {
    data.push([
      `${moment().month(key).format("MMM")}`,
      val?.iferp_event,
      val?.self_driven_events,
    ]);
  });
  let { membership_plan_id } = getDataFromLocalStorage();
  const access = {
    isPelopleYouKnow: membership_plan_id === 7,
    isMyGroups: membership_plan_id === 7,
  };

  return (
    <div id="institutional-dashboard" className="row">
      <div>
        <Card className="cpt-18 cpb-18 ps-3 col-md-12">
          <div className="row d-flex flex-wrap">
            <Welcome info="We are thrilled to have you back on the IFERP Dashboard, where you can continue to explore a world of knowledge, opportunities, and innovation in your field of expertise." />
          </div>
        </Card>
      </div>
      <div className="mb-3 mt-3">
        {pageLoading ? (
          <Card className="cps-30 cpe-30 cpt-125 cpb-125">
            <Loader size="md" />
          </Card>
        ) : (
          <Card className="cps-30 cpe-30 cpt-30 cpb-30">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="text-18-600 title-text">Event Analytics</div>
              <div className="d-flex">
                <Dropdown
                  options={getYearList(10).map((o) => {
                    return { ...o, name: o.id };
                  })}
                  optionValue="name"
                  onChange={(e) => {
                    let oldData = {
                      ...year,
                      event_analytic_year: e.target.value,
                    };
                    setYear(oldData);
                    fetchDashboardData(oldData);
                  }}
                  value={year?.event_analytic_year}
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
                colors: ["#FF9478", "#8992e0"],
                legend: { position: "bottom" },
                curveType: "function",
                chartArea: {
                  width: "94%",
                },
                width: "100%",
              }}
            />
          </Card>
        )}
      </div>

      <div className="col-md-7 mb-3">
        <Card className="cps-30 cpe-30 cpt-30">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="text-18-600 title-text">Our Activity</div>
            <div>
              <Dropdown
                options={getYearList(10).map((o) => {
                  return { ...o, name: o.id };
                })}
                optionValue="name"
                onChange={(e) => {
                  let oldData = {
                    ...year,
                    our_activity_year: e.target.value,
                  };
                  setYear(oldData);
                  fetchDashboardData(oldData);
                }}
                value={year?.our_activity_year}
                placeholder="Year"
              />
            </div>
          </div>

          <div className="row countr-list">
            <div className="col-md-6 col-sm-6 col-6 h-100">
              <div className="counter-block">
                <div className="progress-block">
                  <CircularProgressbar
                    value={our_activity?.conference?.percentage.replace(
                      "%",
                      ""
                    )}
                    text={our_activity?.conference?.percentage}
                    styles={buildStyles({
                      pathColor: "#199BD4",
                      textColor: "#000",
                      trailColor: "#C2EDFF",
                    })}
                  />
                </div>
                <div>
                  <div className="title-block text-16-600">Conference</div>
                  <div className="title-count text-14-400 mt-2 mb-1">
                    {`${our_activity?.conference?.students} Students`}
                  </div>
                  <div className="title-count text-14-400">
                    {`${our_activity?.conference?.faculties} Faculties`}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-6 h-100">
              <div className="counter-block">
                <div className="progress-block">
                  <CircularProgressbar
                    value={our_activity?.webinar?.percentage.replace("%", "")}
                    text={our_activity?.webinar?.percentage}
                    styles={buildStyles({
                      pathColor: "#7661E2",
                      textColor: "#000",
                      trailColor: "#D3CBFF",
                    })}
                  />
                </div>
                <div>
                  <div className="title-block text-16-600">Webinar</div>
                  <div className="title-count text-14-400 mt-2 mb-1">
                    {`${our_activity?.webinar?.students} Students`}
                  </div>
                  <div className="title-count text-14-400">
                    {`${our_activity?.webinar?.faculties} Faculties`}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-6 h-100">
              <div className="counter-block">
                <div className="progress-block">
                  <CircularProgressbar
                    value={our_activity?.workshop?.percentage.replace("%", "")}
                    text={our_activity?.workshop?.percentage}
                    styles={buildStyles({
                      pathColor: "#B77233",
                      textColor: "#000",
                      trailColor: "#FFE8D2",
                    })}
                  />
                </div>
                <div>
                  <div className="title-block text-16-600">Workshop</div>
                  <div className="title-count text-14-400 mt-2 mb-1">
                    {`${our_activity?.workshop?.students} Students`}
                  </div>
                  <div className="title-count text-14-400">
                    {`${our_activity?.workshop?.faculties} Faculties`}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-6 h-100">
              <div className="counter-block">
                <div className="progress-block">
                  <CircularProgressbar
                    value={our_activity?.publication?.percentage.replace(
                      "%",
                      ""
                    )}
                    text={our_activity?.publication?.percentage}
                    styles={buildStyles({
                      pathColor: "#3F65DD",
                      textColor: "#000",
                      trailColor: "#C5D3FF",
                    })}
                  />
                </div>
                <div>
                  <div className="title-block text-16-600">Publication</div>
                  <div className="title-count text-14-400 mt-2 mb-1">
                    {`${our_activity?.publication?.students} Students`}
                  </div>
                  <div className="title-count text-14-400">
                    {`${our_activity?.publication?.faculties} Faculties`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="col-md-5 mb-3">
        <Card className="cps-30 cpe-30 cpt-30 cpb-30 h-100">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="text-18-600 title-text">Institution’s Overview</div>
            <div>
              <Dropdown
                options={getYearList(10).map((o) => {
                  return { ...o, name: o.id };
                })}
                optionValue="name"
                onChange={(e) => {
                  let oldData = {
                    ...year,
                    overview_year: e.target.value,
                  };
                  setYear(oldData);
                  fetchDashboardData(oldData);
                }}
                value={year?.overview_year}
                placeholder="Year"
              />
            </div>
          </div>
          <Chart
            chartType="PieChart"
            width="100%"
            height="255px"
            data={[
              ["Task", "Hours per Day"],
              ["Faculty Members", overview?.faculties],
              ["Student Members", overview?.students],
            ]}
            options={{
              tooltip: { isHtml: true },
              colors: ["#FF9478", "#8992e0"],
              legend: { position: "bottom" },
              curveType: "function",
              chartArea: {
                width: "94%",
              },
              width: "100%",
              pieHole: 0.4,
            }}
          />
        </Card>
      </div>
      <CreatePost />
      <Card className="mt-3 mb-3 cps-24 cpe-24 cpt-24 cpb-40">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="text-18-600 title-text">Recent Feeds</div>
          <div
            className="text-15-400 color-new-car pointer"
            onClick={() => {
              navigateToPost("our-institutional-posts");
            }}
          >
            <u className="hover-effect">View Institutional Posts</u>
          </div>
        </div>
        <PostList isDashboard />
        <div className="d-flex justify-content-center cpt-24 gap-3">
          <Button
            isRounded
            text="View All Posts"
            btnStyle="primary-dark"
            className="cps-40 cpe-40"
            onClick={() => {
              navigateToPost("discover-posts");
            }}
          />
          <Button
            isRounded
            text="Institutional Posts"
            btnStyle="primary-light"
            className="cps-40 cpe-40"
            onClick={() => {
              navigateToPost("our-institutional-posts");
            }}
          />
        </div>
      </Card>
      <div className="col-md-12">
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
      <div className="col-md-8 mt-3">
        <UpcomingEvents />
      </div>

      <div className="col-md-4 mt-3">
        <MyMembership />
      </div>
      <div className="col-md-12">
        <div className="row">
          {access?.isPelopleYouKnow && (
            <div className="col-md-8">
              <PeopleYouMayKnow />
            </div>
          )}
          {access.isMyGroups && (
            <div className="col-md-4">
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
