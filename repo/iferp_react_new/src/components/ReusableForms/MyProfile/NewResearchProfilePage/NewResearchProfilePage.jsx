import React, { useEffect, useState } from "react";
import ProfileInfo from "./ProfileInfo/ProfileInfo";
import CareerObjectivesInfo from "./CareerObjectivesInfo";
import UpcomingActivities from "./UpcomingActivities";
import AcademicInfo from "./AcademicInfo";
import RecommendedResearchFeeds from "./RecommendedResearchFeeds";
import Sic from "./Sic";
import CommonSimilarSkills from "./CommonSimilarSkills";
import NewResearchItems from "./NewResearchItems";
import Sessions from "./Sessions";
import RecommendedPresentations from "./RecommendedPresentations";
import RecommendedSessions from "./RecommendedSessions";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllAdvertisement,
  fetchFollowerOrFollowing,
  fetchRequests,
  fetchResearchProfileData,
  sendRequests,
} from "store/slices";
import Loader from "components/Layout/Loader";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import { useParams } from "react-router-dom";
import { cloneDeep } from "lodash";
import { membershipType } from "utils/constants";
import Advertisements from "./Advertisements";
import "./NewResearchProfilePage.scss";

const NewResearchProfilePage = ({ searchId, setConnectModel }) => {
  const { rProfileData, rProfileID, advertisementsList } = useSelector(
    (state) => ({
      rProfileData: state.global.rProfileData,
      rProfileID: state.global.rProfileID,
      advertisementsList: state.global.advertisementsList,
    })
  );
  const dispatch = useDispatch();
  const data = getDataFromLocalStorage();
  const isLoginUser = data?.id ? true : false;
  const params = useParams();
  const pageID = searchId || rProfileID; //paramsID

  const { id: researchProfileId } = params;
  const isSameUSer = +researchProfileId === data?.id;

  const {
    affiliations,
    current_journal_roles,
    achievements,
    publication,
    profile_details,
  } = rProfileData || {};
  const { mentor_status, speaker_id } = profile_details || {};

  const [isPageLoading, setIsPageLoading] = useState(false);
  const [sendRequestLoader, setSendRequestLoader] = useState("");
  const [requestList, setRequestList] = useState([]);
  const [isConnectLoader, setIsConnectLoader] = useState(false);
  const [list, setList] = useState([]);

  const handelConnect = async (uId) => {
    setSendRequestLoader(uId);
    setIsConnectLoader(true);
    let id = uId ? uId : data?.id;
    const response = await dispatch(
      sendRequests(objectToFormData({ receiver_id: id }))
    );

    if (response?.status === 200) {
      let oldList = cloneDeep(requestList);
      if (oldList?.find((o) => `${o?.id}` === `${id}`)) {
        oldList = oldList?.filter((o) => `${o?.id}` !== `${id}`);
      } else {
        oldList = [...oldList, response?.data];
      }
      setRequestList(oldList);
    }
    setIsConnectLoader(false);
    setSendRequestLoader("");
  };

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

  const fetchDetails = async () => {
    setIsPageLoading(true);
    await dispatch(fetchResearchProfileData(`user_id=${pageID}`, true));
    setIsPageLoading(false);
  };

  useEffect(() => {
    if (isLoginUser) {
      getFollowing();
      getRequest();
    }
    fetchDetails();
    dispatch(fetchAllAdvertisement());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let loginUserType = "";
  if (data?.id) {
    loginUserType =
      membershipType?.find((o) => o?.id === data?.user_type)?.type || "";
  }

  const isSelfUser = `${pageID}` === `${data?.id}`;
  const selfId = pageID;

  const isExist = requestList?.find((o) => `${o?.id}` === `${selfId}`)
    ? true
    : false;
  const isAlreadyExist = list?.find((o) => `${o?.id}` === `${selfId}`)
    ? true
    : false;
  return (
    <div id="new-research-profile-page-container" className="row">
      {isPageLoading ? (
        <div className="cpt-300 cpb-300">
          <Loader size="md" />
        </div>
      ) : (
        <>
          <div className="col-md-2 col-sm-12 cmb-20">
            <div className="new-global-research-profile-card cps-20 cpe-20 cpt-20 cpb-20 h-100">
              <ProfileInfo
                profile_details={rProfileData?.profile_details}
                rProfileData={rProfileData}
                isLoginUser={isLoginUser}
                loginUserType={loginUserType}
                setConnectModel={setConnectModel}
              />
            </div>
          </div>
          <div className="col-md-7 col-sm-12 cmb-20">
            <div className="new-global-research-profile-card cps-20 cpe-20 cpt-20 cpb-20 h-100">
              <CareerObjectivesInfo
                userID={pageID}
                setConnectModel={setConnectModel}
                isLoginUser={isLoginUser}
                // loginUserType={loginUserType}
                isSelfUser={isSelfUser}
                isExist={isExist}
                isAlreadyExist={isAlreadyExist}
                isConnectLoader={isConnectLoader}
                handelConnect={handelConnect}
              />
            </div>
          </div>
          <div className="col-md-3 col-sm-12 cmb-20">
            <div className="new-global-research-profile-card">
              <UpcomingActivities
                setConnectModel={setConnectModel}
                isSameUSer={isSameUSer}
                isLoginUser={isLoginUser}
                loginUserType={loginUserType}
              />
            </div>
          </div>

          <div className="col-md-9">
            {(affiliations?.length > 0 ||
              current_journal_roles?.length > 0 ||
              achievements?.length > 0 ||
              publication?.length > 0) && (
              <div className="new-global-research-profile-card cps-20 cpe-20 cpt-20 cpb-20 cmb-20">
                <AcademicInfo
                  isSameUSer={isSameUSer}
                  isLoginUser={isLoginUser}
                  loginUserType={loginUserType}
                />
              </div>
            )}

            <div className="new-global-research-profile-card cps-20 cpe-20 cpt-20 cpb-20 cmb-20">
              <NewResearchItems
                userID={pageID}
                setConnectModel={setConnectModel}
                isSameUSer={isSameUSer}
                isLoginUser={isLoginUser}
                loginUser={data}
                loginUserType={loginUserType}
              />
            </div>
            {(speaker_id || mentor_status === "Accepted") && (
              <div className="new-global-research-profile-card cps-20 cpe-20 cpt-20 cpb-20 cmb-20">
                <Sessions
                  setConnectModel={setConnectModel}
                  isSameUSer={isSameUSer}
                  isLoginUser={isLoginUser}
                  loginUser={data}
                  loginUserType={loginUserType}
                />
              </div>
            )}
          </div>

          <div className="col-md-3">
            <div className="new-global-research-profile-card cps-20 cpe-20 cpt-20 cpb-20 cmb-20">
              <CommonSimilarSkills
                setConnectModel={setConnectModel}
                isLoginUser={isLoginUser}
                loginUser={data}
                profile_details={profile_details}
                handelConnect={handelConnect}
                sendRequestLoader={sendRequestLoader}
                list={list}
                requestList={requestList}
              />
            </div>
            <div className="new-global-research-profile-card cmb-20">
              <RecommendedResearchFeeds
                setConnectModel={setConnectModel}
                isSameUSer={isSameUSer}
                isLoginUser={isLoginUser}
                loginUser={data}
                loginUserType={loginUserType}
              />
            </div>
            {mentor_status === "Accepted" && speaker_id && (
              <div className="new-global-research-profile-card cps-20 cpe-20 cpt-20 cpb-20 cmb-20">
                <CommonSimilarSkills
                  setConnectModel={setConnectModel}
                  title="Mentors with Similar Skills"
                  isMentorSkills
                  isLoginUser={isLoginUser}
                  loginUser={data}
                  profile_details={profile_details}
                  handelConnect={handelConnect}
                  sendRequestLoader={sendRequestLoader}
                  list={list}
                  requestList={requestList}
                />
              </div>
            )}
            <div className="new-global-research-profile-card cmb-20">
              <Sic
                setConnectModel={setConnectModel}
                isSameUSer={isSameUSer}
                isLoginUser={isLoginUser}
                loginUser={data}
                loginUserType={loginUserType}
              />
            </div>
            {advertisementsList?.length > 0 && (
              <div className="new-global-research-profile-card cps-20 cpe-20 cpt-20 cpb-20 cmb-20">
                <Advertisements advertisementsList={advertisementsList} />
              </div>
            )}

            {speaker_id && (
              <div className="new-global-research-profile-card cmb-20">
                <RecommendedPresentations
                  setConnectModel={setConnectModel}
                  isSameUSer={isSameUSer}
                  isLoginUser={isLoginUser}
                  loginUserType={loginUserType}
                />
              </div>
            )}
            {(speaker_id || mentor_status === "Accepted") && (
              <div className="new-global-research-profile-card cmb-20">
                <RecommendedSessions
                  setConnectModel={setConnectModel}
                  isSameUSer={isSameUSer}
                  isLoginUser={isLoginUser}
                  loginUserType={loginUserType}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NewResearchProfilePage;
