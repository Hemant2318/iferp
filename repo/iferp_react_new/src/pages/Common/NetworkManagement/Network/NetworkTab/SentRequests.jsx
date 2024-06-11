import { lowerCase, omit } from "lodash";
// import { forEach } from "lodash";
import { cloneDeep } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SeachInput from "components/form/SeachInput";
import Card from "components/Layout/Card";
import LineTextLabel from "components/Layout/LineTextLabel";
import Loader from "components/Layout/Loader";
import Profile from "components/Layout/Profile";
import {
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import {
  fetchNetworkUsers,
  fetchUserNetwork,
  // fetchRequests,
  // sendRequests,
  // setIsPremiumPopup,
  setRProfileID,
} from "store/slices";
import { limit } from "utils/constants";
import RequestHandleLayout from "components/Layout/RequestHandleLayout";

const SentRequests = () => {
  const reduxData = useSelector((state) => state.global);
  const { networkListData } = reduxData || {};
  const { send_follow_request } = networkListData;
  const dispatch = useDispatch();
  const listref = useRef();
  const [timer, setTimer] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  // const [sendRequestLoader, setSendRequestLoader] = useState("");
  // const [requestList, setRequestList] = useState([]);
  const [userDetails, setUserDetails] = useState({
    userList: [],
    offset: 0,
    limit: limit,
    name: "",
    total: 0,
  });
  const handelScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      let oldData = cloneDeep({
        ...userDetails,
        offset: userDetails.offset + limit,
      });
      setUserDetails(oldData);
      getUsers(oldData);
    }
  };
  const handelSearch = (e) => {
    e.preventDefault();
    const val = titleCaseString(e.target.value);
    setSearchText(val);
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      let oldData = cloneDeep({
        ...userDetails,
        offset: 0,
        name: lowerCase(val),
      });
      listref?.current.scrollTo(0, 0);
      setUserDetails(oldData);
      getUsers(oldData, true);
    }, 800);
    setTimer(time);
  };
  // const handelSendRequest = async (id) => {
  //   setSendRequestLoader(id);
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
  //   setSendRequestLoader("");
  // };
  // const getRequest = async () => {
  //   const response = await dispatch(fetchRequests({ type: "following" }));
  //   setRequestList(response?.data?.result || []);
  // };
  const getUsers = async (obj, isReset) => {
    const fromData = objectToFormData(omit(obj, ["userList"]));
    const response = await dispatch(fetchNetworkUsers(fromData));
    if (response?.status === 200) {
      setUserDetails((prev) => {
        let newData = isReset
          ? response?.data?.user_details
          : [...prev.userList, ...response?.data?.user_details];
        return {
          ...prev,
          total: response?.data?.result_count,
          userList: newData,
        };
      });
    }
    setIsPageLoading(false);
  };
  const fetchList = async () => {
    await dispatch(
      fetchUserNetwork(`?user_id=${getDataFromLocalStorage("id")}`)
    );
  };
  useEffect(() => {
    // getRequest();
    getUsers(userDetails, true);
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const planID = getDataFromLocalStorage("membership_plan_id");
  let isShowUpgradePopup = false;
  if (planID === 11) {
    isShowUpgradePopup = true;
  }
  const { userList, total } = userDetails;
  return (
    <>
      {isPageLoading ? (
        <Card className="pt-5 pb-5">
          <Loader size="md" />
        </Card>
      ) : (
        <>
          {/* {requestList.length > 0 && ( */}
          {send_follow_request?.length > 0 && (
            <div className="cmb-30">
              <LineTextLabel
                text={
                  <div className="text-13-400">
                    You have sent
                    <span className="color-new-car">
                      {" "}
                      {send_follow_request?.length} new Requests
                    </span>
                  </div>
                }
              />
            </div>
          )}
          <div className="request-list-container d-flex flex-column gap-3 vcmb-30">
            {/* {requestList.map((elem, index) => { */}
            {send_follow_request?.map((elem, index) => {
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
                  <div className="d-flex justify-content-between align-items-center">
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
                          {titleCaseString(name)}
                        </div>
                        <div className="text-13-400 color-black-olive mt-1">
                          {state && country ? `${state}, ${country}` : ""}
                        </div>
                        <div className="text-13-400 color-new-car mt-1">
                          {`${followers} Connections`}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex">
                      <RequestHandleLayout
                        receiverId={id}
                        isShowUpgradePopup={isShowUpgradePopup}
                      />
                      {/* <Button
                        text="Cancel Request"
                        btnStyle="primary-gray"
                        className="cps-30 cpe-30 cpt-20 cpb-20 h-35 text-nowrap"
                        onClick={() => {
                          if (isShowUpgradePopup) {
                            dispatch(setIsPremiumPopup(true));
                          } else {
                            handelSendRequest(id);
                          }
                        }}
                        btnLoading={id === sendRequestLoader}
                      /> */}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="cmb-20 cmt-20">
            <LineTextLabel
              text={
                <div className="text-13-400 color-new-car">
                  People you may know
                </div>
              }
            />
          </div>
          <SeachInput
            placeholder="Search user"
            onChange={handelSearch}
            value={searchText}
          />

          <div
            className="request-list-container max-430 overflow-auto iferp-scroll mt-3"
            ref={listref}
            onScroll={(e) => {
              if (userList?.length < total) {
                handelScroll(e);
              }
            }}
          >
            {userList?.length === 0 ? (
              <div className="center-flex text-16-400 pt-5 pb-5">
                No Data Found
              </div>
            ) : (
              userList?.map((elem, index) => {
                const {
                  id,
                  name,
                  country,
                  state,
                  followers = 0,
                  profile_photo_path,
                  user_type,
                } = elem;
                const isReasearchProfile = ["2", "5"].includes(user_type);
                const isExist = send_follow_request?.find(
                  (o) => `${o.id}` === `${id}`
                )
                  ? true
                  : false;

                return (
                  <Card
                    className={`request-block cps-20 cpe-20 cpt-20 cpb-20 ${
                      userList.length - 1 === index ? "" : "cmb-16"
                    } ${isExist ? "d-none" : ""}`}
                    key={index}
                  >
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
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
                            className={`text-15-600 text-truncate d-inline-block w-100 ${
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
                          <div className="text-13-400 color-new-car mt-1">
                            {`${followers} Connections`}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex gap-3 flex-wrap flex-grow-1 justify-content-end">
                        <RequestHandleLayout
                          receiverId={id}
                          isShowUpgradePopup={isShowUpgradePopup}
                          newSendRequest
                        />

                        {/* <Button
                          text="Send Request"
                          btnStyle="primary-dark"
                          className="cps-20 cpe-20 cpt-20 cpb-20 h-35"
                          onClick={() => {
                            if (isShowUpgradePopup) {
                              dispatch(setIsPremiumPopup(true));
                            } else {
                              handelSendRequest(id);
                            }
                          }}
                          btnLoading={id === sendRequestLoader}
                        /> */}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </>
      )}
    </>
  );
};
export default SentRequests;
