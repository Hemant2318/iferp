import { useDispatch, useSelector } from "react-redux";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Profile from "components/Layout/Profile";
import {
  getDataFromLocalStorage,
  // getDataFromLocalStorage,
  // objectToFormData,
  titleCaseString,
} from "utils/helpers";
import {
  fetchUserNetwork,
  // checkGroup,
  // createGroup,
  // fetchFollowerOrFollowing,
  // fetchRequests,
  // sendRequests,
  setRProfileID,
} from "store/slices";
import RequestHandleLayout from "components/Layout/RequestHandleLayout";
import { useEffect } from "react";

const Followers = ({ redirectToChat }) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { networkListData } = reduxData || {};
  const { followers, isPageLoading } = networkListData;
  // const [isPageLoading, setIsPageLoading] = useState(true);
  // const [isLoader, setIsLoader] = useState("");
  // const [list, setList] = useState([]);
  // const [followingList, setFollowingList] = useState([]);
  // const [requestList, setRequestList] = useState([]);
  // const [chatLoader, setChatLoader] = useState(null);
  // const userData = getDataFromLocalStorage();
  // let { id: myID } = userData;

  // const handelCreateGroup = async (id) => {
  //   const response = await dispatch(
  //     createGroup({
  //       userID: myID,
  //       recieverID: id,
  //     })
  //   );
  //   if (response?.status === 200) {
  //     redirectToChat(response?.data[0]?.groupID);
  //   }
  //   setChatLoader(null);
  // };
  // const handleChatNow = async (id) => {
  //   setChatLoader(id);
  //   const response = await dispatch(
  //     checkGroup({
  //       userID: myID,
  //       recieverID: id,
  //     })
  //   );
  //   if (response?.data?.[0]) {
  //     redirectToChat(response?.data);
  //     setChatLoader(false);
  //   } else {
  //     handelCreateGroup(id);
  //   }
  // };
  // const getRequest = async () => {
  //   const response = await dispatch(fetchRequests({ type: "following" }));
  //   setRequestList(response?.data?.result);
  // };
  // const handelSendRequest = async (id) => {
  //   setIsLoader(id);
  //   const response = await dispatch(
  //     sendRequests(objectToFormData({ receiver_id: id }))
  //   );
  //   if (response?.status === 200) {
  //     let oldList = cloneDeep(requestList);
  //     if (oldList.find((o) => `${o.id}` === `${id}`)) {
  //       oldList = oldList.filter((o) => `${o.id}` !== `${id}`);
  //     } else {
  //       oldList = [...oldList, response?.data];
  //     }
  //     setRequestList(oldList);
  //   }
  //   setIsLoader("");
  // };
  // const getFollowers = async () => {
  //   const response = await dispatch(
  //     fetchFollowerOrFollowing(objectToFormData({ type: "follower" }))
  //   );
  //   setList(response?.data?.result || []);
  //   // setIsPageLoading(false);
  // };
  // const getFollowing = async () => {
  //   const response = await dispatch(
  //     fetchFollowerOrFollowing(objectToFormData({ type: "following" }))
  //   );
  //   setFollowingList(response?.data?.result || []);
  // };
  // useEffect(() => {
  //   getFollowers();
  //   getFollowing();
  //   getRequest();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const fetchList = async () => {
    await dispatch(
      fetchUserNetwork(`?user_id=${getDataFromLocalStorage("id")}`)
    );
  };
  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="cps-20 cpe-20 cpt-20 cpb-20 unset-br">
      {isPageLoading ? (
        <div className="pt-5 pb-5">
          <Loader size="md" />
        </div>
      ) : /* ) : list.length === 0 ? ( */
      followers?.length === 0 ? (
        <div className="center-flex text-16-400 pt-5 pb-5">No Data Found</div>
      ) : (
        <div className="row">
          {followers?.map((elem, index) => {
            const { id, name, country, state, profile_photo_path, user_type } =
              elem;
            const isReasearchProfile = ["2", "5"].includes(user_type);
            /* old */
            /* const isExist = requestList.find((o) => `${o.id}` === `${id}`) */
            /* const isAlreadyFollow = followingList.find(
              (o) => `${o.id}` === `${id}`
            )
              ? true
              : false; */

            /* new */
            /* const isExist = send_follow_request?.find(
              (o) => `${o?.id}` === `${id}`
            )
              ? true
              : false; */
            /* const isAlreadyFollow = following?.find(
              (o) => `${o?.id}` === `${id}`
            )
              ? true
              : false; */

            return (
              <div className="col-md-6 cmb-20" key={index}>
                <div className="col-md-12 border cps-12 cpe-12 cpt-12 cpb-12">
                  <div className="d-flex align-items-center">
                    <Profile
                      isS3UserURL
                      isRounded
                      text={name}
                      size="s-68"
                      url={profile_photo_path}
                    />
                    <div className="ms-3">
                      <div
                        className={`text-15-500 ${
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
                        {titleCaseString(name)}
                      </div>
                      <div className="text-13-400 color-black-olive mt-1">
                        {state && country ? `${state}, ${country}` : ""}
                      </div>
                      {/* <div className="text-13-400 color-black-olive mt-1">
                      {`${elem.research_items} Research Items`}
                    </div> */}
                    </div>
                  </div>
                  <div className="d-flex align-items-center cmt-20 gap-4">
                    <RequestHandleLayout
                      receiverId={id}
                      isFollowers
                      redirectToChat={redirectToChat}
                    />

                    {/* <Button
                      text={
                        isExist
                          ? "Cancel"
                          : isAlreadyFollow
                          ? "Unfollow"
                          : "Follow"
                      }
                      btnStyle="primary-outline"
                      className="h-35 cps-20 cpe-20 text-14-500"
                      btnLoading={isLoader === id}
                      onClick={() => {
                        handelSendRequest(id);
                      }}
                      isSquare
                    />

                    <div
                      className="text-13-400 color-new-car pointer d-flex align-items-center gap-2"
                      onClick={() => {
                        handleChatNow(id);
                      }}
                    >
                      <span>Send Message</span>
                      {id === chatLoader && (
                        <span>
                          <Loader size="sm" />
                        </span>
                      )}
                    </div> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
export default Followers;
