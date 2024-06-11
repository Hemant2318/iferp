import Modal from "components/Layout/Modal";
import ResearchProfileDetails from "./ResearchProfile";
import About from "./About";
import Affiliations from "./Affiliations";
import CurrentJournalRoles from "./CurrentJournalRoles";
// import Education from "./Education";
import Achievements from "./Achievements";
import MyResearch from "./MyResearch";
import Publications from "./Publications";
import { useDispatch } from "react-redux";
import { fetchProfile, fetchResearchProfileData } from "store/slices";
import EducationDetails from "pages/Register/MemberDetails/EducationDetails";
import { useEffect, useState } from "react";

const EditDetails = ({ formType, isEdit, onHide, userID }) => {
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState({});
  const getProfiles = async () => {
    // setLoadData(true);
    const response = await dispatch(fetchProfile());
    setProfileData(response?.data || {});
    // setLoadData(false);
    return response;
  };
  const getProfileData = () => {
    dispatch(fetchResearchProfileData(`user_id=${userID}`));
  };
  useEffect(() => {
    if (formType === 5) {
      getProfiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formType]);

  const title = {
    1: "Research Profile",
    2: "About/Bio",
    3: "Academic Experience",
    4: "Current Journal Roles",
    5: (
      <div className="text-center">
        <div className="text-24-400 color-raisin-black">Education</div>
        <div className="text-16-400 color-black-olive mt-2">
          Enter highest qualification Details
        </div>
      </div>
    ),
    6: "Awards & Grants",
    7: "My Research ID’s",
    8: "Publications",
  };
  const formComponent = {
    1: (
      <ResearchProfileDetails
        isEdit={isEdit}
        onHide={onHide}
        getProfileData={getProfileData}
      />
    ),
    2: (
      <About isEdit={isEdit} onHide={onHide} getProfileData={getProfileData} />
    ),
    3: (
      <Affiliations
        isEdit={isEdit}
        onHide={onHide}
        getProfileData={getProfileData}
      />
    ),
    4: (
      <CurrentJournalRoles
        isEdit={isEdit}
        onHide={onHide}
        getProfileData={getProfileData}
      />
    ),
    5: (
      <EducationDetails
        isEdit
        isReasearchProfile
        userDetails={profileData}
        fetchUserData={getProfiles}
        handelSuccess={() => {
          onHide();
        }}
      />
    ),
    6: (
      <Achievements
        isEdit={isEdit}
        onHide={onHide}
        getProfileData={getProfileData}
      />
    ),
    7: (
      <MyResearch
        isEdit={isEdit}
        onHide={onHide}
        getProfileData={getProfileData}
      />
    ),
    8: (
      <Publications
        isEdit={isEdit}
        onHide={onHide}
        getProfileData={getProfileData}
      />
    ),
  };
  return (
    <Modal
      isEdit={isEdit}
      onHide={onHide}
      title={title[formType]}
      size={[5, 8].includes(formType) ? "lg" : "md"}
    >
      <div className="cps-20 cpe-20 cmt-30 cpb-20">
        {formComponent[formType]}
      </div>
    </Modal>
  );
};
export default EditDetails;
