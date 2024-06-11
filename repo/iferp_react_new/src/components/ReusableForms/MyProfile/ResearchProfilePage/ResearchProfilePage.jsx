import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Card from "components/Layout/Card";
import { fetchResearchProfileData } from "store/slices";
import UserDetails from "components/ReusableForms/ViewResearchProfile/UserDetails";
import ResearchStatistics from "components/ReusableForms/ViewResearchProfile/ResearchStatistics";
import ResearchItems from "components/ReusableForms/ViewResearchProfile/ResearchItems";
import Profile from "./Profile";
import { getDataFromLocalStorage } from "utils/helpers";
import ShareButton from "components/Layout/ShareButton";
import Loader from "components/Layout/Loader";
import "./ConnectPopup.scss";

const ResearchProfile = ({ searchId, handleClickEvent }) => {
  const dispatch = useDispatch();
  const { rProfileData, rProfileID } = useSelector((state) => ({
    rProfileData: state.global.rProfileData,
    rProfileID: state.global.rProfileID,
  }));
  const reduxData = useSelector((state) => state.global);
  const { networkListData } = reduxData || {};
  const { send_follow_request, following } = networkListData;
  const pageID = searchId || rProfileID;
  let userID = getDataFromLocalStorage("id");
  const isLoginUser = userID ? true : false;
  // const [requestList, setRequestList] = useState([]);
  // const [list, setList] = useState([]);
  // const [isConnectLoader, setIsConnectLoader] = useState(false);
  const [type, setType] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(false);
  // const handelConnect = async () => {
  //   if (userID) {
  //     setIsConnectLoader(true);
  //     let id = pageID;
  //     const response = await dispatch(
  //       sendRequests(objectToFormData({ receiver_id: id }))
  //     );
  //     if (response?.status === 200) {
  //       let oldList = cloneDeep(requestList);
  //       if (oldList.find((o) => `${o.id}` === `${id}`)) {
  //         oldList = oldList.filter((o) => `${o.id}` !== `${id}`);
  //       } else {
  //         oldList = [...oldList, response?.data];
  //       }
  //       setRequestList(oldList);
  //     }
  //     setIsConnectLoader(false);
  //   } else {
  //     handleClickEvent(true);
  //   }
  // };
  const fetchDetails = async () => {
    setIsPageLoading(true);
    await dispatch(fetchResearchProfileData(`user_id=${pageID}`, true));
    setIsPageLoading(false);
  };
  // const getRequest = async () => {
  //   const response = await dispatch(fetchRequests({ type: "following" }));
  //   setRequestList(response?.data?.result);
  // };
  // const getFollowing = async () => {
  //   const response = await dispatch(
  //     fetchFollowerOrFollowing(objectToFormData({ type: "following" }))
  //   );
  //   setList(response?.data?.result || []);
  // };
  useEffect(() => {
    if (isLoginUser) {
      // getFollowing();
      // getRequest();
    }
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSelfUser = `${pageID}` === `${userID}`;
  const selfId = pageID;
  // old
  // const isExist = requestList.find((o) => `${o.id}` === `${selfId}`)
  //   ? true
  //   : false;

  // const isAlreadyExist = list.find((o) => `${o.id}` === `${selfId}`)
  //   ? true
  //   : false;

  const isExist = send_follow_request?.find((o) => `${o?.id}` === `${selfId}`)
    ? true
    : false;

  const isAlreadyExist = following?.find((o) => `${o?.id}` === `${selfId}`)
    ? true
    : false;

  return (
    <>
      {isPageLoading ? (
        <Card className="mb-3 cps-24 cpe-24 cpt-24 cpb-24">
          <Loader size="md" />
        </Card>
      ) : (
        <>
          <UserDetails
            profile_details={rProfileData?.profile_details}
            isSelfUser={isSelfUser}
            isExist={isExist}
            isAlreadyExist={isAlreadyExist}
            // isConnectLoader={isConnectLoader}
            // handelConnect={handelConnect}
          />
          <Card className="d-flex align-items-center justify-content-between flex-wrap gap-3 unset-br mb-3 cps-16 pe-1 pt-1 pb-1">
            <div>
              <Tabs
                defaultActiveKey={type}
                id="uncontrolled-tab-example"
                className="gap-5"
              >
                <Tab
                  eventKey={0}
                  title="Profile"
                  onEnter={() => {
                    setType(0);
                  }}
                />
                <Tab
                  eventKey={1}
                  title="Research"
                  onEnter={() => {
                    setType(1);
                  }}
                />
                <Tab
                  eventKey={2}
                  title="Statistics"
                  onEnter={() => {
                    setType(2);
                  }}
                />
              </Tabs>
            </div>

            <div className="d-flex align-items-center flex-wrap gap-3">
              <div>
                <ShareButton
                  url={`${window?.location?.origin}/member/global-research-profile/${pageID}`}
                />
              </div>
            </div>
          </Card>
          {type === 0 && (
            <Profile fetchDetails={fetchDetails} userID={pageID} />
          )}
          {type === 1 && <ResearchItems userID={pageID} />}
          {type === 2 && <ResearchStatistics userID={pageID} />}
        </>
      )}
    </>
  );
};
export default ResearchProfile;
