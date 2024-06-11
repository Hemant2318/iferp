import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "components/Layout/Card";
import { fetchUserNetwork } from "store/slices";
import { getDataFromLocalStorage } from "utils/helpers";
import TopResearchers from "./TopResearchers";
import About from "components/ReusableForms/ViewResearchProfile/Profile/About";
import Education from "components/ReusableForms/ViewResearchProfile/Profile/Education";
import AcademicExperience from "components/ReusableForms/ViewResearchProfile/Profile/AcademicExperience";
import MyResearchId from "components/ReusableForms/ViewResearchProfile/Profile/MyResearchId";
import Publications from "components/ReusableForms/ViewResearchProfile/Profile/Publications";
import JournalRoles from "components/ReusableForms/ViewResearchProfile/Profile/JournalRoles";
import AwardsAndGrants from "components/ReusableForms/ViewResearchProfile/Profile/AwardsAndGrants";

const Profile = ({ fetchDetails, userID }) => {
  const htmlElRef = useRef(null);
  const dispatch = useDispatch();
  const { rProfileData } = useSelector((state) => ({
    rProfileData: state.global.rProfileData,
  }));
  const [networkData, setNetworkData] = useState({
    followers: [],
    following: [],
    receive_follow_request: [],
    send_follow_request: [],
  });
  const getFollowers = async (loginID) => {
    const response = await dispatch(fetchUserNetwork(`?user_id=${loginID}`));
    setNetworkData(
      response?.data || {
        followers: [],
        following: [],
        receive_follow_request: [],
        send_follow_request: [],
      }
    );
  };

  useEffect(() => {
    let loginID = getDataFromLocalStorage("id");
    if (loginID) {
      getFollowers(loginID);
    }
    if (localStorage.isViewPublication) {
      setTimeout(() => {
        htmlElRef?.current?.scrollIntoView({ behavior: "smooth" });
        localStorage.removeItem("isViewPublication");
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    about,
    affiliations,
    current_journal_roles,
    research_id,
    achievements,
    publication,
    educational_details,
  } = rProfileData || {};

  const isNoDataFound =
    !about &&
    !educational_details?.ug_course_name &&
    affiliations?.length === 0 &&
    current_journal_roles?.length === 0 &&
    achievements?.length === 0 &&
    research_id?.length === 0 &&
    publication?.length === 0;
  return (
    <div className="row">
      {isNoDataFound ? (
        <div>
          <Card className="unset-br mb-3 pt-5 pb-5">
            <div className="text-center text-14-500">No Data Found</div>
          </Card>
        </div>
      ) : (
        <>
          <div className="col-md-8">
            {about?.id && <About userID={userID} about={about} />}
            {educational_details?.ug_course_name && (
              <Education educational_details={educational_details} />
            )}
            {affiliations?.length > 0 && (
              <AcademicExperience affiliations={affiliations} />
            )}
            {research_id?.length > 0 && (
              <MyResearchId research_id={research_id} />
            )}
            <div ref={htmlElRef} />
            {publication?.length > 0 && (
              <Publications
                publication={publication}
                fetchDetails={fetchDetails}
              />
            )}
            {current_journal_roles?.length > 0 && (
              <JournalRoles current_journal_roles={current_journal_roles} />
            )}
            {achievements?.length > 0 && (
              <AwardsAndGrants achievements={achievements} />
            )}
          </div>
          <div className="col-md-4">
            <TopResearchers userID={userID} myNetworkData={networkData} />
          </div>
        </>
      )}
    </div>
  );
};
export default Profile;
