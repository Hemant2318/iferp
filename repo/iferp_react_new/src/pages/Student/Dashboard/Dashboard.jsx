import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "components/Layout/Card";
import Button from "components/form/Button";
import PostList from "components/Layout/PostList";
import CreatePost from "components/Layout/CreatePost";
import Career from "components/ReusableForms/Dashboard/Career";
import Journals from "components/ReusableForms/Dashboard/Journals";
import MyMembership from "components/ReusableForms/Dashboard/MyMembership";
import UpcomingEvents from "components/ReusableForms/Dashboard/UpcomingEvents";
import PeopleYouMayKnow from "components/ReusableForms/Dashboard/PeopleYouMayKnow";
import MyGroups from "components/ReusableForms/Dashboard/MyGroups";
import MyActivity from "components/ReusableForms/Dashboard/MyActivity";
import Welcome from "components/ReusableForms/Dashboard/Welcome";
import { icons } from "utils/constants";
import { getDataFromLocalStorage } from "utils/helpers";
import {
  fetchProfile,
  fetchResearchProfileData,
  getDashboard,
  setIsGlobalProfilePreviewPopup,
  setIsTour,
  setPostID,
  setRProfileID,
} from "store/slices";
import { ceil } from "lodash";
import EditEducationDetails from "components/ReusableForms/MyProfile/ProfileDetails/EditEducationDetails";
import GlobalProfilePreviewPopup from "components/Layout/GlobalProfilePreviewPopup";
import "./Dashboard.scss";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userDetails, isGlobalProfilePreviewPopup, researchProfile } =
    useSelector((state) => ({
      userDetails: state.student.userDetails,
      isGlobalProfilePreviewPopup: state.global.isGlobalProfilePreviewPopup,
      researchProfile: state.student.researchProfile,
    }));
  const [isPageLoading, setIsPageLoading] = useState(false);
  // const [profileCount, setProfileCount] = useState(0);
  const [researchProfileCount, setResearchProfileCount] = useState(0);
  const [isEditEducationDetails, setIsEditEducationDetails] = useState(false);
  const userData = getDataFromLocalStorage();
  let { membership_plan_id, registration_status, tour_status } =
    getDataFromLocalStorage();
  const [dashboardData, setDashboardData] = useState({});
  // const fieldList = [
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
  //   "area_of_interest",
  //   "category",
  //   "comments",
  // ];
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
    "area_of_interest",
    "comments",
    "affiliations",
    "current_journal_roles",
    "publication",
    "achievements",
  ];
  const fetchDashboardData = async () => {
    const response = await dispatch(getDashboard(""));
    setDashboardData(response?.data || {});
  };
  // useEffect(() => {
  //   const { educational_details = {} } = userDetails;
  //   let fillCount = 0;
  //   forEach(fieldList, (fie) => {
  //     if (educational_details[fie]) {
  //       fillCount = fillCount + 1.31;
  //     }
  //   });
  //   setProfileCount(100 - (17 - ceil(fillCount)));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [userDetails]);

  useEffect(() => {
    const { about = {}, educational_details = {} } = researchProfile;
    let resFillCount = 0;
    const isArray = (value) => Array.isArray(value);

    resProfileFieldList?.forEach((f) => {
      if (
        (isArray(researchProfile[f]) && researchProfile[f]?.length > 0) ||
        about[f] ||
        educational_details[f]
      ) {
        resFillCount += 1.21;
      }
    });
    setResearchProfileCount(100 - (24 - ceil(resFillCount)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [researchProfile]);

  useEffect(() => {
    fetchDashboardData();
    if (registration_status === "4") {
      const emailRedirectURL = localStorage?.emailRedirectURL || "";
      if (tour_status === 0) {
        dispatch(setIsGlobalProfilePreviewPopup(true));
        dispatch(setIsTour(true));
      } else if (emailRedirectURL) {
        navigate(`/student/${emailRedirectURL}`);
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
  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userData?.tour_status === 19 && userDetails?.tour_status === 0) {
      dispatch(setIsGlobalProfilePreviewPopup(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.tour_status, userDetails?.tour_status]);

  const navigateToPost = () => {
    navigate("/student/network-management/network/posts/discover-posts");
  };

  const access = {
    isLiveButton: true,
    isPelopleYouKnow: membership_plan_id === 12,
    isMyGroups: membership_plan_id === 12,
  };
  const {
    conference_counting,
    webinar_counting,
    publication_counting,
    members_counting,
    activities,
  } = dashboardData;
  return (
    <div id="student-dashboard" className="row w-100">
      {isGlobalProfilePreviewPopup && (
        <GlobalProfilePreviewPopup
          isLoading={isPageLoading}
          fetchDetails={fetchDetails}
        />
      )}
      {isEditEducationDetails && (
        <EditEducationDetails
          hideReqField
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
        <Card className="cpt-20 cpb-10 ps-3 col-md-12">
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
      <div>
        <Card className="mt-3 mb-3 cps-24 cpe-24 cpt-24 cpb-40">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="text-18-500-27 color-title-navy font-poppins">
              Recent Feeds
            </div>
            <div
              className="text-15-400 color-new-car pointer"
              onClick={navigateToPost}
            >
              <u className=" ">View All</u>
            </div>
          </div>
          <PostList sortType="latest" isDashboard />
          <div className="d-flex justify-content-center cpt-24">
            <Button
              isRounded
              text="View All Posts"
              btnStyle="primary-dark"
              className="cps-40 cpe-40"
              onClick={() => {
                navigateToPost();
              }}
            />
          </div>
        </Card>
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
      <div className="col-md-12 mt-3">
        <div className="row">
          <div className="col-md-3 mb-3">
            <Card className="d-flex align-items-center counter-block h-100">
              <div className="counter-image-block">
                <img src={icons.iferpConference} alt="img" />
              </div>
              <div>
                <div className="text-20-600 color-raisin-black mb-2">
                  {conference_counting}
                </div>
                <div className="text-14-500 color-black-olive">
                  IFERP Conferences
                </div>
              </div>
            </Card>
          </div>
          <div className="col-md-3 mb-3">
            <Card className="d-flex align-items-center counter-block h-100">
              <div className="counter-image-block">
                <img src={icons.iferpWebinar} alt="img" />
              </div>
              <div>
                <div className="text-20-600 color-raisin-black mb-2">
                  {webinar_counting}
                </div>
                <div className="text-14-500 color-black-olive">
                  IFERP Webinars
                </div>
              </div>
            </Card>
          </div>
          <div className="col-md-3 mb-3">
            <Card className="d-flex align-items-center counter-block h-100">
              <div className="counter-image-block">
                <img src={icons.iferpNewspaper} alt="img" />
              </div>
              <div>
                <div className="text-20-600 color-raisin-black mb-2">
                  {publication_counting}
                </div>
                <div className="text-14-500 color-black-olive">
                  IFERP Publications
                </div>
              </div>
            </Card>
          </div>
          <div className="col-md-3 mb-3">
            <Card className="d-flex align-items-center counter-block h-100">
              <div className="counter-image-block">
                <img src={icons.iferpGroup} alt="img" />
              </div>
              <div>
                <div className="text-20-600 color-raisin-black mb-2">
                  {members_counting}
                </div>
                <div className="text-14-500 color-black-olive">
                  IFERP Members
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
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
      <div className="col-md-6 mt-3">
        <Career />
      </div>
      <div className="col-md-6 mt-3">
        <MyMembership />
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

      <div className="col-md-6 mt-3">
        <Journals />
      </div>
      <div className="col-md-6 mt-3">
        <UpcomingEvents />
      </div>
      <div className="mt-3">
        <MyActivity data={activities} />
      </div>
    </div>
  );
};
export default Dashboard;
