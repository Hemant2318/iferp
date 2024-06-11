import { useDispatch, useSelector } from "react-redux";
import Card from "components/Layout/Card";
import LineTextLabel from "components/Layout/LineTextLabel";
import Loader from "components/Layout/Loader";
import Profile from "components/Layout/Profile";
import {
  fetchUserNetwork,
  // acceptRequests,
  // fetchFollowerOrFollowing,
  // setMyNetworkDetails,
  // fetchRequests,
  setRProfileID,
} from "store/slices";
import RequestHandleLayout from "components/Layout/RequestHandleLayout";
import { useEffect } from "react";
import { getDataFromLocalStorage } from "utils/helpers";

const NewRequests = () => {
  const dispatch = useDispatch();
  // const { myNetworkDetails } = useSelector((state) => ({
  //   myNetworkDetails: state.global.myNetworkDetails,
  // }));
  const reduxData = useSelector((state) => state.global);
  const { networkListData } = reduxData || {};
  const { followers, receive_follow_request, isPageLoading } = networkListData;
  const data = getDataFromLocalStorage();
  // const [isPageLoading, setIsPageLoading] = useState(true);
  // const [requestList, setRequestList] = useState([]);
  // const [followerList, setFollowerList] = useState([]);
  // const [btnLoader, setBtnLoader] = useState("");
  // // const handelRequest = async (id, type) => {
  // //   setBtnLoader(`${id}-${type}`);
  // //   const response = await dispatch(
  // //     acceptRequests(objectToFormData({ sender_id: id, status: type }))
  // //   );
  // //   if (response?.status === 200) {
  // //     let oldRequestList = cloneDeep(requestList);
  // //     let oldFollowerList = cloneDeep(followerList);
  // //     if (type === "1") {
  // //       oldFollowerList = [...oldFollowerList, response?.data];
  // //       oldRequestList = oldRequestList.filter((o) => `${o.id}` !== `${id}`);
  // //       increseFollowers();
  // //     } else {
  // //       oldRequestList = oldRequestList.filter((o) => `${o.id}` !== `${id}`);
  // //     }
  // //     setRequestList(oldRequestList);
  // //     setFollowerList(oldFollowerList);
  // //   }
  // //   setBtnLoader("");
  // // };
  // const increseFollowers = () => {
  //   const newData = {
  //     ...myNetworkDetails,
  //     followers: myNetworkDetails.followers + 1,
  //   };
  //   dispatch(setMyNetworkDetails(newData));
  // };
  // const getFollowerOrFollowing = async () => {
  //   const response = await dispatch(
  //     fetchFollowerOrFollowing(objectToFormData({ type: "follower" }))
  //   );
  //   setFollowerList(response?.data?.result || []);
  //   // setIsPageLoading(false);
  // };
  // const getRequest = async () => {
  //   const response = await dispatch(fetchRequests({ type: "follower" }));
  //   setRequestList(response?.data?.result || []);
  // };
  // useEffect(() => {
  //   getRequest();
  //   getFollowerOrFollowing();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const fetchList = async () => {
    await dispatch(fetchUserNetwork(`?user_id=${data?.id}`));
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {isPageLoading ? (
        <Card className="pt-5 pb-5">
          <Loader size="md" />
        </Card>
      ) : (
        <>
          {receive_follow_request?.length > 0 && (
            <div className="cmb-30">
              <LineTextLabel
                text={
                  <div className="text-13-400">
                    You have{" "}
                    <span className="color-new-car">
                      {receive_follow_request?.length} new connections
                    </span>
                  </div>
                }
              />
            </div>
          )}
          <div
            className={
              receive_follow_request?.length === 0
                ? "d-none"
                : "request-list-container d-flex flex-column gap-3 cmb-34 "
            }
          >
            {/* {requestList.map((elem, index) => { */}
            {receive_follow_request?.map((elem, index) => {
              const {
                id,
                name,
                country,
                state,
                followers,
                profile_photo_path,
                user_type,
              } = elem;
              const isReasearchProfile = ["2", "5"].includes(user_type);
              return (
                <Card
                  className="request-block cps-20 cpe-20 cpt-20 cpb-20"
                  key={index}
                >
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div className="d-flex align-items-center left-block">
                      <Profile
                        isS3UserURL
                        isRounded
                        text={name}
                        size="s-68"
                        url={profile_photo_path}
                      />
                      <div className="user-details-block ms-3">
                        <div
                          className={`text-15-600 ${
                            isReasearchProfile
                              ? "color-new-car pointer"
                              : "color-raisin-black"
                          }`}
                          onClick={() => {
                            if (isReasearchProfile) {
                              dispatch(setRProfileID(id));
                            }
                          }}
                        >
                          {name}
                        </div>

                        <div className="text-13-400 color-black-olive mt-1">
                          {state && country ? `${state}, ${country}` : ""}
                        </div>
                        <div className="text-13-400 color-new-car mt-1">
                          {`${followers} Connections`}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex gap-3">
                      <RequestHandleLayout receiverId={id} />

                      {/* <Button
                        text="Accept"
                        btnStyle="primary-dark"
                        className="cps-30 cpe-30 cpt-20 cpb-20 h-35"
                        onClick={() => {
                          handelRequest(id, "1");
                        }}
                        btnLoading={`${id}-1` === btnLoader}
                      />
                      <Button
                        text="Decline"
                        btnStyle="light-outline"
                        className="cps-30 cpe-30 cpt-20 cpb-20 h-35"
                        onClick={() => {
                          handelRequest(id, "2");
                        }}
                        btnLoading={`${id}-2` === btnLoader}
                      /> */}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          {/* {followerList.length > 0 && ( */}
          {followers?.length > 0 && (
            <div className="cmb-34">
              <LineTextLabel
                text={
                  <div className="text-13-400 color-new-car">
                    Recent Connections
                  </div>
                }
              />
            </div>
          )}
          <div className="request-list-container row">
            {followers?.length === 0 ? (
              <Card className="center-flex text-16-400 pt-5 pb-5">
                No Data Found
              </Card>
            ) : (
              followers?.map((elem, index) => {
                const {
                  id,
                  name,
                  country,
                  state,
                  profile_photo_path,
                  user_type,
                } = elem;
                const isReasearchProfile = ["2", "5"].includes(user_type);
                return (
                  <div key={index} className="col-md-6">
                    <Card className="request-block cps-20 cpe-20 cpt-20 cpb-30 cmb-16">
                      {/* <div className="text-12-400 text-end">3h ago</div> */}
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center left-block">
                          <Profile
                            isS3UserURL
                            isRounded
                            text={name}
                            size="s-52"
                            url={profile_photo_path}
                          />
                          <div className="user-details-block ms-3">
                            <div
                              className={`text-15-600 ${
                                isReasearchProfile
                                  ? "color-new-car pointer"
                                  : "color-raisin-black"
                              }`}
                              onClick={() => {
                                if (isReasearchProfile) {
                                  dispatch(setRProfileID(id));
                                }
                              }}
                            >
                              {name}
                            </div>
                            <div className="text-13-400 color-black-olive mt-2">
                              {state && country ? `${state}, ${country}` : ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </>
  );
};
export default NewRequests;
