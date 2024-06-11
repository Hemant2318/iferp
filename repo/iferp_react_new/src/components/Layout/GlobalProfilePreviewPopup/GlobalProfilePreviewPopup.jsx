import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import ProfileInfo from "components/ReusableForms/MyProfile/NewResearchProfilePage/ProfileInfo";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFollowerOrFollowing,
  fetchRequests,
  setIsGlobalProfilePreviewPopup,
} from "store/slices";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import Loader from "../Loader";
import { membershipType } from "utils/constants";
import CareerObjectivesInfo from "components/ReusableForms/MyProfile/NewResearchProfilePage/CareerObjectivesInfo";
import AcademicInfo from "components/ReusableForms/MyProfile/NewResearchProfilePage/AcademicInfo";
import "./GlobalProfilePreviewPopup.scss";

const GlobalProfilePreviewPopup = ({ fetchDetails, isLoading }) => {
  const dispatch = useDispatch();
  const {
    userDetails,

    isGlobalProfilePreviewPopup,
    researchProfile,
  } = useSelector((state) => ({
    userDetails: state.student.userDetails,
    rProfileData: state.global.rProfileData,
    isGlobalProfilePreviewPopup: state.global.isGlobalProfilePreviewPopup,
    researchProfile: state.student.researchProfile,
  }));

  const userData = getDataFromLocalStorage();
  const isLoginUser = userData?.id ? true : false;
  const [requestList, setRequestList] = useState([]);
  const [list, setList] = useState([]);
  const [isEditData, setIsEditData] = useState(false);

  const getRequest = async () => {
    const response = await dispatch(fetchRequests({ type: "following" }));
    setRequestList(response?.data?.result);
  };

  const getFollowing = async () => {
    const response = await dispatch(
      fetchFollowerOrFollowing(objectToFormData({ type: "following" }))
    );
    setList(response?.data?.result || []);
  };

  useEffect(() => {
    getFollowing();
    getRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let loginUserType = "";
  if (userData?.id) {
    loginUserType =
      membershipType?.find((o) => o?.id === userData?.user_type)?.type || "";
  }

  const isSelfUser = `${userData?.id}` === `${userDetails?.id}`;
  const isExist = requestList?.find((o) => `${o?.id}` === `${userData?.id}`)
    ? true
    : false;
  const isAlreadyExist = list?.find((o) => `${o?.id}` === `${userData?.id}`)
    ? true
    : false;

  return (
    isGlobalProfilePreviewPopup && (
      <Modal
        onHide={() => {
          dispatch(setIsGlobalProfilePreviewPopup(false));
        }}
        size="xl"
      >
        <div id="global-profile-preview-popup-container" className="row">
          {isLoading ? (
            <div className="cpt-200 cpb-200">
              <Loader size="md" />
            </div>
          ) : (
            <>
              <div className="col-md-3 col-sm-12 cmb-20">
                <div className="new-global-research-profile-card cps-20 cpe-20 cpt-20 cpb-20 h-100">
                  <ProfileInfo
                    profile_details={researchProfile?.profile_details}
                    rProfileData={researchProfile}
                    isLoginUser={isLoginUser}
                    loginUserType={loginUserType}
                    isEdit
                    fetchDetails={fetchDetails}
                    isPreviewOnDashboard
                  />
                </div>
              </div>

              <div className="col-md-9 col-sm-12 cmb-20">
                <div className="new-global-research-profile-card cps-20 cpe-20 cpt-20 cpb-20 h-100">
                  <CareerObjectivesInfo
                    userID={userData?.id}
                    isLoginUser={isLoginUser}
                    isSelfUser={isSelfUser}
                    isExist={isExist}
                    isAlreadyExist={isAlreadyExist}
                    isEdit
                    fetchDetails={fetchDetails}
                    isPreviewOnDashboard
                  />
                </div>
              </div>

              <div className="col-md-12">
                <div className="new-global-research-profile-card cps-20 cpe-20 cpt-20 cpb-20 cmb-20">
                  <AcademicInfo
                    isSameUSer={isSelfUser}
                    isLoginUser={isLoginUser}
                    loginUserType={loginUserType}
                    isEdit
                    fetchDetails={fetchDetails}
                    isPreviewOnDashboard
                    isEditData={isEditData}
                    setIsEditData={setIsEditData}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    )
  );
};

export default GlobalProfilePreviewPopup;
