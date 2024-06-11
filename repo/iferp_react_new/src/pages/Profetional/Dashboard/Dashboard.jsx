import { useEffect, useState } from "react";
import Chart from "react-google-charts";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "components/Layout/Card";
import CreatePost from "components/Layout/CreatePost";
import PostList from "components/Layout/PostList";
import Button from "components/form/Button";
import Journals from "components/ReusableForms/Dashboard/Journals";
import MyActivity from "components/ReusableForms/Dashboard/MyActivity";
import MyGroups from "components/ReusableForms/Dashboard/MyGroups";
import MyMembership from "components/ReusableForms/Dashboard/MyMembership";
import PeopleYouMayKnow from "components/ReusableForms/Dashboard/PeopleYouMayKnow";
import UpcomingEvents from "components/ReusableForms/Dashboard/UpcomingEvents";
import Welcome from "components/ReusableForms/Dashboard/Welcome";
import {
  fetchProfile,
  fetchResearchProfileData,
  fetchUserNetwork,
  getDashboard,
  setIsGlobalProfilePreviewPopup,
  setIsTour,
  setPostID,
  setRProfileID,
} from "store/slices";
import { icons } from "utils/constants";
import { getDataFromLocalStorage } from "utils/helpers";
import { ceil } from "lodash";
import EditEducationDetails from "components/ReusableForms/MyProfile/ProfileDetails/EditEducationDetails";
import GlobalProfilePreviewPopup from "components/Layout/GlobalProfilePreviewPopup";
import "./Dashboard.scss";

const resProfileFieldList = [
  "research_id",
  "introduction",
  "disciplines",
  "languages",
  "pg_course",
  "pg_department",
  "pg_university",
  "other_pg_university",
  "pg_institution",
  "other_pg_institution",
  "pg_year_of_completion",
  "phd_course",
  "phd_department",
  "phd_university",
  "other_phd_university",
  "phd_institution",
  "other_phd_institution",
  "phd_year_of_completion",
  "institution_name",
  "department",
  "designation",
  "address",
  "country",
  "state",
  "industry_experience",
  "professional_experience",
  "area_of_interest",
  "comments",
  "affiliations",
  "current_journal_roles",
  "publication",
  "achievements",
];
// const fieldList = [
//   "ug_course",
//   "ug_department",
//   "ug_university",
//   "other_ug_university",
//   "ug_institution",
//   "other_ug_institution",
//   "ug_year_of_completion",
//   "pg_course",
//   "pg_department",
//   "pg_university",
//   "other_pg_university",
//   "pg_institution",
//   "other_pg_institution",
//   "pg_year_of_completion",
//   "phd_course",
//   "phd_department",
//   "phd_university",
//   "other_phd_university",
//   "phd_institution",
//   "other_phd_institution",
//   "phd_year_of_completion",
//   "institution_name",
//   "department",
//   "designation",
//   "address",
//   "country",
//   "state",
//   "industry_experience",
//   "professional_experience",
//   "area_of_interest",
//   "category",
//   "comments",
// ];

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userDetails, isGlobalProfilePreviewPopup, researchProfile } =
    useSelector((state) => ({
      userDetails: state.student.userDetails,
      isGlobalProfilePreviewPopup: state.global.isGlobalProfilePreviewPopup,
      researchProfile: state.student.researchProfile,
    }));
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({});
  // const [profileCount, setProfileCount] = useState(0);
  const [researchProfileCount, setResearchProfileCount] = useState(0);
  const [isEditEducationDetails, setIsEditEducationDetails] = useState(false);
  const userData = getDataFromLocalStorage();

  let { membership_plan_id, registration_status, tour_status } = userData;
  const fetchDashboardData = async () => {
    const response = await dispatch(getDashboard(""));
    setDashboardData(response?.data || {});
  };

  // useEffect(() => {
  //   const { educational_details = {}, professional_details = {} } = userDetails;
  //   let fillCount = 0;
  //   forEach(fieldList, (fie) => {
  //     if (educational_details[fie] || professional_details[fie]) {
  //       fillCount = fillCount + 1.31;
  //     }
  //   });
  //   setProfileCount(100 - (34 - ceil(fillCount)));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [userDetails]);

  useEffect(() => {
    const {
      // research_id = [],
      about = {},
      educational_details = {},
      professional_details = {},
      // affiliations = [],
      // publication = [],
      // current_journal_roles = [],
      // achievements = [],
    } = researchProfile;
    let resFillCount = 0;
    const isArray = (value) => Array.isArray(value);

    resProfileFieldList?.forEach((f) => {
      if (
        (isArray(researchProfile[f]) && researchProfile[f]?.length > 0) ||
        about[f] ||
        educational_details[f] ||
        professional_details[f]
      ) {
        resFillCount += 1.21;
      }
    });
    setResearchProfileCount(100 - (32 - ceil(resFillCount)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [researchProfile]);

  useEffect(() => {
    fetchDashboardData();
    if (registration_status === "4") {
      const emailRedirectURL = localStorage?.emailRedirectURL || "";
      if (tour_status === 0) {
        dispatch(setIsTour(true));
      } else if (emailRedirectURL) {
        navigate(`/professional/${emailRedirectURL}`);
        localStorage.removeItem("emailRedirectURL");
      } else if (localStorage?.openResearchProfile) {
        dispatch(setRProfileID(localStorage?.openResearchProfile));
        localStorage.removeItem("openResearchProfile");
        localStorage.isViewPublication = 1;
      } else if (localStorage?.openPostPopup) {
        dispatch(setPostID(localStorage?.openPostPopup));
        localStorage.removeItem("openPostPopup");
      } else {
        // Nothing
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDetails = async () => {
    setIsPageLoading(true);
    await dispatch(fetchResearchProfileData(`user_id=${userData?.id}`));
    setIsPageLoading(false);
  };
  const fetchList = async () => {
    await dispatch(fetchUserNetwork(`?user_id=${userData?.id}`));
  };
  useEffect(() => {
    fetchDetails();
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userData?.tour_status === 19 && userDetails?.tour_status === 0) {
      dispatch(setIsGlobalProfilePreviewPopup(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.tour_status, userDetails?.tour_status]);

  const navigateToPost = () => {
    navigate("/professional/network-management/network/posts/discover-posts");
  };
  const {
    activities,
    webinar_counting,
    conference_counting,
    publication_counting,
    members_counting,
    national_conferences_counting,
    international_conferences,
  } = dashboardData;
  const access = {
    isPelopleYouKnow: membership_plan_id === 3,
    isMyGroups: membership_plan_id === 3,
  };

  return (
    <div id="proffetional-dashboard" className="row">
      {isGlobalProfilePreviewPopup && (
        <GlobalProfilePreviewPopup
          isLoading={isPageLoading}
          fetchDetails={fetchDetails}
        />
      )}

      {isEditEducationDetails && (
        <EditEducationDetails
          // hideReqField
          profileData={userData}
          getProfiles={async () => {
            const response = await dispatch(fetchProfile());
            return response;
          }}
          onHide={() => {
            setIsEditEducationDetails(false);
          }}
        />
      )}
      <div>
        <Card className="cpt-18 cpb-18 ps-3 pe-3 col-md-12">
          <div className="row d-flex flex-wrap">
            <Welcome
              // profileCount={profileCount}
              // setIsEditEducationDetails={setIsEditEducationDetails}
              researchProfileCount={researchProfileCount}
            />
          </div>
        </Card>
      </div>
      <div>
        <CreatePost />
      </div>

      <div className="mt-3">
        <Card className="mb-3 cps-24 cpe-24 cpt-24 cpb-40">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div
              className="text-18-500-27 color-title-navy font-poppins"
              id="recent-posts-id"
            >
              Recent Feeds
            </div>
            <div
              className="text-15-400 color-new-car pointer"
              onClick={navigateToPost}
            >
              <u>View All</u>
            </div>
          </div>
          <PostList isDashboard sortType="latest" />
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
      <div className="col-md-4 mt-3">
        <Card className="cps-24 cpe-24 cpt-24 cpb-24 h-100">
          <div className="text-18-500-27 color-title-navy font-poppins">
            Events
          </div>
          <div>
            <Chart
              chartType="PieChart"
              width="100%"
              height="500px"
              data={[
                ["Task", "Hours per Day"],
                ["National Conferences", national_conferences_counting],
                ["International Conferences", international_conferences],
                ["Webinars", webinar_counting],
              ]}
              options={{
                tooltip: { isHtml: true },
                chartArea: { width: "90%", height: "100%" },
                colors: ["#9BDAFF", "#425EBC", "#3BC0E9"],
                legend: { position: "none" },
                pieSliceText: "none",
                pieHole: 0.5,
                is3D: false,
              }}
            />
            <div className="d-flex flex-wrap gap-3 text-13-400 mt-3">
              <div className="d-flex gap-2">
                <span
                  className="rounded-circle center-flex"
                  style={{
                    backgroundColor: "#9BDAFF",
                    height: "20px",
                    width: "20px",
                  }}
                />
                <span className="color-raisin-black">National Conferences</span>
              </div>
              <div className="d-flex gap-2">
                <span
                  className="rounded-circle center-flex"
                  style={{
                    backgroundColor: "#425EBD",
                    height: "20px",
                    width: "20px",
                  }}
                />
                <span className="color-raisin-black">
                  International Conferences
                </span>
              </div>
              <div className="d-flex gap-2">
                <span
                  className="rounded-circle center-flex"
                  style={{
                    backgroundColor: "#3BC0E9",
                    height: "20px",
                    width: "20px",
                  }}
                />
                <span className="color-raisin-black">Webinars</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div
        className="col-md-8 mt-3"
        style={{
          height: window.innerWidth < 768 ? "500px" : "",
        }}
      >
        <Card className="cps-24 cpe-24 cpt-24 cpb-24 h-100">
          <div className="text-18-500-27 color-title-navy font-poppins">
            {"IFERP’s STATS"}
          </div>
          <div className="p-2 fake-chart">
            <div className="block-items">
              <div className="b1-block">
                <div className="top-bb-block">{webinar_counting}+</div>
                <div className="bottom-bb-block">Webinars</div>
              </div>
              <div className="b2-block">
                <div className="top-bb-block">{conference_counting}+</div>
                <div className="bottom-bb-block">Conferences</div>
              </div>
              <div className="b3-block">
                <div className="top-bb-block">{publication_counting}+</div>
                <div className="bottom-bb-block">Publications</div>
              </div>
              <div className="b4-block">
                <div className="top-bb-block">{members_counting}+</div>
                <div className="bottom-bb-block">Members</div>
              </div>
            </div>
            <div className="saprator-bottom" />
          </div>
        </Card>
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
      <div className="col-md-7 mt-3">
        <UpcomingEvents />
      </div>

      <div className="col-md-5 mt-3">
        <MyMembership />
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
