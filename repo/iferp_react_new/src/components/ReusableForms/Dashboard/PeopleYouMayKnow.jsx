import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Card from "components/Layout/Card";
import Profile from "components/Layout/Profile";
import { getDataFromLocalStorage } from "utils/helpers";
import { useNavigate } from "react-router-dom";
import { membershipType } from "utils/constants";
import RequestHandleLayout from "components/Layout/RequestHandleLayout";
import { fetchNetworkUsers, setRProfileID } from "store/slices";

const PeopleYouMayKnow = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const reduxData = useSelector((state) => state.global);
  // const { networkListData } = reduxData || {};
  // const { send_follow_request } = networkListData;
  const [userList, setUserList] = useState([]);
  // const [requestList, setRequestList] = useState([]);
  // const [sendRequestLoader, setSendRequestLoader] = useState("");
  // const requestList = map(send_follow_request || [], "id");

  // const getRequest = async () => {
  //   const response = await dispatch(fetchRequests({ type: "following" }));
  //   setRequestList(map(response?.data?.result, "id") || []);
  // };

  const getUsers = async () => {
    const response = await dispatch(fetchNetworkUsers());
    setUserList(response?.data?.user_details?.splice(0, 3) || []);
  };

  // const handelSendRequest = async (id) => {
  //   setSendRequestLoader(id);
  //   const response = await dispatch(
  //     sendRequests(objectToFormData({ receiver_id: id }))
  //   );
  //   if (response?.status === 200) {
  //     let oldList = cloneDeep(requestList);
  //     if (oldList?.find((o) => o === id)) {
  //       oldList = oldList?.filter((o) => o !== id);
  //     } else {
  //       oldList = [...oldList, id];
  //     }
  //     const newData = {
  //       ...networkListData,
  //       send_follow_request: send_follow_request,
  //     };
  //     dispatch(setNetworkListData(newData));
  //     // setRequestList(oldList);
  //   }
  //   setSendRequestLoader("");
  // };

  useEffect(() => {
    // getRequest();
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="cps-24 cpe-24 cpt-24 cpb-24 mb-3 h-100">
      <div className="d-flex justify-content-between cmb-20">
        <div className="text-16-500-24  color-title-navy font-poppins">
          People you may know
        </div>
        <div
          className="text-15-400-16 color-new-car pointer  "
          onClick={() => {
            const userFlag = membershipType.find(
              (o) => o.id === getDataFromLocalStorage("user_type")
            )?.type;
            navigate(
              `/${userFlag}/network-management/network/network/sent-requests`
            );
          }}
        >
          <u className=" ">View All</u>
        </div>
      </div>
      <div className="people-list">
        {userList.map((elm, index) => {
          /* const isExist = requestList.includes(elm.id); */
          const isReasearchProfile = ["2", "5"].includes(elm?.user_type);
          return (
            <div className="people-list-block mb-3" key={index}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center left-block">
                  <Profile
                    isRounded
                    text={elm?.name}
                    size="s-48"
                    url={elm?.profile_photo_path}
                    isS3UserURL
                  />
                  <div className="user-details-block ms-3">
                    <div
                      className={`text-15-600   ${
                        isReasearchProfile
                          ? "color-title-navy pointer"
                          : "color-raisin-black"
                      }`}
                      onClick={() => {
                        if (isReasearchProfile) {
                          dispatch(setRProfileID(elm?.id));
                        }
                      }}
                    >
                      {elm?.name}
                    </div>
                    <div className="text-14-400   color-raisin-black mt-1 mb-1">
                      {elm?.state ? `${elm?.state}, ` : ""}
                      {elm?.country ? `${elm?.country}` : ""}
                    </div>
                    <div className="text-14-400   color-subtitle-navy">
                      {elm?.followers} Mutual Connections
                    </div>
                  </div>
                </div>
                <div>
                  <RequestHandleLayout
                    receiverId={elm?.id}
                    newSendRequest
                    isDashboard
                  />

                  {/* <Button
                    text={isExist ? "Cancel" : "Send Request"}
                    btnStyle={isExist ? "primary-gray" : "primary-light"}
                    className={`  text-14-400 ${
                      isExist ? "cps-40 cpe-40" : "text-nowrap"
                    }`}
                    btnLoading={sendRequestLoader === elm?.id}
                    onClick={() => {
                      handelSendRequest(elm?.id);
                    }}
                  /> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
export default PeopleYouMayKnow;
