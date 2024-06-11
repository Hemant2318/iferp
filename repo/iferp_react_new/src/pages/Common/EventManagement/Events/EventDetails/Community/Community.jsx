import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { forEach } from "lodash";
import SeachInput from "components/form/SeachInput";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Profile from "components/Layout/Profile";
import {
  // fetchFollowerOrFollowing,
  // fetchRequests,
  getCommunity,
  // sendRequests,
} from "store/slices";
import { getDataFromLocalStorage } from "utils/helpers";
import RequestHandleLayout from "components/Layout/RequestHandleLayout";

const Community = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { networkListData } = reduxData || {};
  const { following } = networkListData;
  const [isLoading, setLoading] = useState(true);
  const [communityList, setCommunity] = useState([]);
  // const [requestList, setRequestList] = useState([]);
  // const [followingList, setFollowingList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [searchText, setSearchText] = useState("");
  // const [connectLoader, setConnectLoader] = useState("");
  const fetchSessionDetails = async () => {
    const response = await dispatch(getCommunity(params?.eventId));
    let data = [];
    if (response?.data) {
      data = response.data?.community_details;
    }
    setCommunity(data);
    setFilterList(data);
    setLoading(false);
  };
  const handelChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    let newList = [];
    if (value) {
      forEach(communityList, (elem) => {
        if (
          elem.name.toLowerCase().includes(value) ||
          elem.type.toLowerCase().includes(value)
        ) {
          newList.push(elem);
        }
      });
    } else {
      newList = communityList;
    }
    setFilterList(newList);
  };
  // const getRequest = async () => {
  //   const response = await dispatch(fetchRequests({ type: "following" }));
  //   setRequestList(response?.data?.result || []);
  // };
  // const getFollowing = async () => {
  //   const response = await dispatch(
  //     fetchFollowerOrFollowing(objectToFormData({ type: "following" }))
  //   );
  //   setFollowingList(response?.data?.result || []);
  // };
  // const handelSendRequest = async (id) => {
  //   setConnectLoader(id);
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
  //   setConnectLoader("");
  // };
  useEffect(() => {
    fetchSessionDetails();
    // getRequest();
    // getFollowing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const displayList = filterList;

  return (
    <>
      {isLoading ? (
        <Card className="cpt-80 cpb-80 cmt-20">
          <Loader size="md" />
        </Card>
      ) : (
        <Card className="unset-br cmt-20 cpe-20 cps-20 pt-4 fadeInUp">
          <div className="row cmb-22">
            <div className="col-md-6">
              <SeachInput
                placeholder="Search here"
                onChange={handelChange}
                value={searchText}
              />
            </div>
          </div>
          <div className="row">
            {displayList.length === 0 ? (
              <div className="center-flex cpt-80 cpb-125">No Data Found</div>
            ) : (
              displayList.map((elem, index) => {
                /* const isAlreadySend = requestList.find(
                  (o) => o.id === elem.id
                )?.id;
                const isAlreadyConnect = followingList.find(
                  (o) => o.id === elem.id
                )?.id; */

                const isAlreadyConnect = following?.find(
                  (o) => o?.id === elem?.id
                )?.id;
                return (
                  <div
                    className="col-md-3 d-flex flex-column align-items-center cmb-34"
                    key={index}
                  >
                    <Profile
                      isS3UserURL
                      text={elem.name}
                      url={elem.image}
                      size="s-163"
                    />
                    <div className="text-15-500 color-new-car cmt-16 text-truncate d-inline-block w-75 text-center">
                      {elem.name}
                    </div>
                    <div className="text-14-400 color-raisin-black mt-1 mb-3 text-truncate d-inline-block w-75 text-center">
                      {elem.type}
                    </div>
                    <div
                      className={`${
                        getDataFromLocalStorage("id") === elem.id ||
                        isAlreadyConnect
                          ? "d-none"
                          : ""
                      }`}
                    >
                      <RequestHandleLayout
                        receiverId={elem?.id}
                        newSendRequest
                        isRounded
                        btnText="Connect"
                      />
                      {/* <Button
                        isRounded
                        text={isAlreadySend ? "Cancel" : "Connect"}
                        btnStyle={
                          isAlreadySend ? "light-outline" : "primary-light"
                        }
                        className="h-35 text-14-500 cps-20 cpe-20"
                        btnLoading={connectLoader === elem.id}
                        onClick={() => {
                          handelSendRequest(elem.id);
                        }}
                      /> */}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      )}
    </>
  );
};
export default Community;
