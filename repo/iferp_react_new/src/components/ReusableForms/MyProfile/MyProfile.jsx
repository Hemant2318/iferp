import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { fetchProfile } from "store/slices";
import { getDataFromLocalStorage } from "utils/helpers";
import Loader from "components/Layout/Loader";
import Card from "components/Layout/Card";
// import ProfileDetails from "./ProfileDetails";
import MyMembership from "./MyMembership";
import MyEvents from "./MyEvents";
import PerformanceReport from "./PerformanceReport";
import ResearchProfile from "./ResearchProfile";
import "./MyProfile.scss";
import MyCalendar from "./MyCalendar";
import MyProjects from "./MyProjects";
import OurEmployees from "./OurEmployees";

const MyProfile = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [loadData, setLoadData] = useState(false);
  const [profileData, setProfileData] = useState({});
  const handleRedirect = (type) => {
    navigate(`/${params.memberType}/my-profile/${type}`);
  };
  const dispatch = useDispatch();
  const getProfiles = async () => {
    setLoadData(true);
    const response = await dispatch(fetchProfile());
    let data = {};
    if (response?.data) {
      data = response.data;
    }
    setProfileData(data);
    setLoadData(false);
    return response;
  };
  useEffect(() => {
    getProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { user_type: userType, membership_plan_id: membershipID ,id} =
    getDataFromLocalStorage();
  const access = {
    isResearchProfile: ["2", "3", "4", "11", "12"].includes(`${membershipID}`),
    isOurPerformanceReport: userType === "3",
    isMyCalender: false,
    isMyProjects: ["2", "5"].includes(userType),
    isOurEmployees: userType === "4",
  };
  return (
    <div>
      <Tabs
        defaultActiveKey={params?.type}
        // activeKey={params?.type}
        id="uncontrolled-tab-example"
        className="mb-3 gap-4"
      >
        {access.isResearchProfile && (
          <Tab
            eventKey="research-profile"
            // title={<span id="research-profile-id">Research Profile</span>}
            title={
              <span id="research-profile-id">
                Research Curriculum Vitae (Research CV)
              </span>
            }
            onEnter={() => {
              handleRedirect("research-profile");
            }}
          />
        )}
        {/* <Tab
          eventKey="profile-details"
          title="Profile Details"
          onEnter={() => {
            handleRedirect("profile-details");
          }}
        /> */}
        <Tab
          eventKey="my-membership"
          title={<span id="my-membership-id">My Membership</span>}
          onEnter={() => {
            handleRedirect("my-membership");
          }}
        />
        <Tab
          eventKey="my-events"
          title={["3", "4"].includes(userType) ? "Our Events" : "My Events"}
          onEnter={() => {
            handleRedirect("my-events");
          }}
        />
        {access.isMyProjects && (
          <Tab
            eventKey="my-projects"
            title="My Projects/Tasks"
            onEnter={() => {
              handleRedirect("my-projects");
            }}
          />
        )}
        {access.isMyCalender && (
          <Tab
            eventKey="my-calendar"
            title="My Calendar"
            onEnter={() => {
              handleRedirect("my-calendar");
            }}
          />
        )}

        {access.isOurPerformanceReport && (
          <Tab
            eventKey="our-performance-report"
            title="Our Performance Report"
            onEnter={() => {
              handleRedirect("our-performance-report");
            }}
          />
        )}
        {access.isOurEmployees && (
          <Tab
            eventKey="our-employees"
            title="Our Employees"
            onEnter={() => {
              handleRedirect("our-employees");
            }}
          />
        )}
      </Tabs>
      {loadData && (
        <Card className="d-flex align-items-center justify-content-center cpt-125 cpb-125">
          <Loader size="md" />
        </Card>
      )}
      {/* {params?.type === "profile-details" && !loadData && (
        <ProfileDetails profileData={profileData} getProfiles={getProfiles} />
      )} */}
      {params?.type === "my-membership" && (
        <MyMembership profileData={profileData} />
      )}
      {params?.type === "my-events" && <MyEvents userType={userType} />}
      {params?.type === "my-projects" && <MyProjects />}
      {params?.type === "my-calendar" && <MyCalendar userType={userType} />}
      {params?.type === "research-profile" && <ResearchProfile  searchId={id}/>}
      {params?.type === "our-performance-report" && <PerformanceReport />}
      {params?.type === "our-employees" && <OurEmployees />}
    </div>
  );
};
export default MyProfile;
