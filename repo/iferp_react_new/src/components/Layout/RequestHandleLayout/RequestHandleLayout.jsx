import React, { useState } from "react";
import Button from "components/form/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptRequests,
  checkGroup,
  createGroup,
  sendRequests,
  setIsPremiumPopup,
  setMyNetworkDetails,
  setNetworkListData,
} from "store/slices";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import { cloneDeep } from "lodash";
import Loader from "../Loader";
import "./RequestHandleLayout.scss";
import { useParams } from "react-router-dom";

const RequestHandleLayout = ({
  receiverId,
  isShowUpgradePopup,
  newSendRequest,
  redirectToChat,
  isDashboard,
  isRounded,
  btnText,
}) => {
  const dispatch = useDispatch();
  const params = useParams();
  const { cType } = params;
  const reduxData = useSelector((state) => state.global);
  const { networkListData, myNetworkDetails } = reduxData || {};
  const { followers, following, receive_follow_request, send_follow_request } =
    networkListData;
  const [btnLoader, setBtnLoader] = useState("");
  const [sendRequestLoader, setSendRequestLoader] = useState("");
  const [chatLoader, setChatLoader] = useState(null);
  const userData = getDataFromLocalStorage();
  let { id: myID } = userData;

  //send request
  const handelSendRequest = async (id) => {
    setSendRequestLoader(id);
    const response = await dispatch(
      sendRequests(objectToFormData({ receiver_id: id }))
    );
    if (response?.status === 200) {
      let oldList = cloneDeep(send_follow_request);
      if (oldList?.find((o) => `${o?.id}` === `${id}`)) {
        oldList = oldList?.filter((o) => `${o?.id}` !== `${id}`);
      } else {
        oldList = [...oldList, response?.data];
      }
      const newList = { ...networkListData, send_follow_request: oldList };
      dispatch(setNetworkListData(newList));
    }
    setSendRequestLoader("");
  };

  // accept reject
  const handelRequest = async (id, type) => {
    setBtnLoader(`${id}-${type}`);
    const response = await dispatch(
      acceptRequests(objectToFormData({ sender_id: id, status: type }))
    );
    if (response?.status === 200) {
      let oldRequestList = cloneDeep(receive_follow_request);
      let oldFollowerList = cloneDeep(followers);
      if (type === "1") {
        oldFollowerList = [...oldFollowerList, response?.data];
        oldRequestList = oldRequestList?.filter((o) => `${o?.id}` !== `${id}`);
        increseFollowers();
      } else {
        oldRequestList = oldRequestList?.filter((o) => `${o?.id}` !== `${id}`);
      }
      const newList = {
        ...networkListData,
        receive_follow_request: oldRequestList,
        followers: oldFollowerList,
      };
      dispatch(setNetworkListData(newList));
    }
    setBtnLoader("");
  };

  const increseFollowers = () => {
    const newData = {
      ...myNetworkDetails,
      followers: myNetworkDetails.followers + 1,
    };
    dispatch(setMyNetworkDetails(newData));
  };

  //create group for chat
  const handelCreateGroup = async (id) => {
    const response = await dispatch(
      createGroup({
        userID: myID,
        recieverID: id,
      })
    );
    if (response?.status === 200) {
      redirectToChat(response?.data[0]?.groupID);
    }
    setChatLoader(null);
  };

  //chat now
  const handleChatNow = async (id) => {
    setChatLoader(id);
    const response = await dispatch(
      checkGroup({
        userID: myID,
        recieverID: id,
      })
    );
    if (response?.data?.[0]) {
      redirectToChat(response?.data);
      setChatLoader(false);
    } else {
      handelCreateGroup(id);
    }
  };

  const isCancelBtn = send_follow_request?.some((o) => o?.id !== myID);
  const isShowBothBtn = receive_follow_request?.some((o) => o?.id !== myID);
  const isFollowBtn = followers?.some((o) => o?.id !== myID);
  const isFollowingBtn = following?.some((o) => o?.id !== myID);
  const isExist = send_follow_request?.find(
    (o) => `${o?.id}` === `${receiverId}`
  )
    ? true
    : false;
  const isAlreadyFollow = following?.find((o) => `${o?.id}` === `${receiverId}`)
    ? true
    : false;

  const newText = isExist
    ? "Cancel"
    : isDashboard
    ? "Send Request"
    : `${btnText ? btnText : "Follow"}`;

  const newBtnStyle = isExist
    ? isDashboard
      ? "primary-gray"
      : btnText
      ? "light-outline"
      : "primary-light"
    : isDashboard
    ? "primary-light"
    : btnText
    ? "primary-light"
    : "primary-dark";

  return (
    <div className="d-flex gap-3">
      {cType === "sent-requests" && isCancelBtn && !newSendRequest && (
        <Button
          text="Cancel Request"
          btnStyle="primary-gray"
          className="cps-30 cpe-30 cpt-20 cpb-20 h-35 text-nowrap"
          onClick={() => {
            if (isShowUpgradePopup) {
              dispatch(setIsPremiumPopup(true));
            } else {
              handelSendRequest(receiverId);
            }
          }}
          btnLoading={receiverId === sendRequestLoader}
        />
      )}

      {newSendRequest && (
        <Button
          isRounded={isRounded}
          text={newText}
          btnStyle={newBtnStyle}
          className={
            isDashboard
              ? isExist
                ? "cps-40 cpe-40"
                : "text-nowrap"
              : "cps-20 cpe-20 cpt-20 cpb-20 h-35"
          }
          onClick={() => {
            if (isShowUpgradePopup) {
              dispatch(setIsPremiumPopup(true));
            } else {
              handelSendRequest(receiverId);
            }
          }}
          btnLoading={receiverId === sendRequestLoader}
        />
      )}

      {cType === "new-requests" && isShowBothBtn && (
        <>
          <Button
            text="Accept"
            btnStyle="primary-dark"
            className="cps-30 cpe-30 cpt-20 cpb-20 h-35"
            onClick={() => {
              handelRequest(receiverId, "1");
            }}
            btnLoading={`${receiverId}-1` === btnLoader}
          />
          <Button
            text="Decline"
            btnStyle="light-outline"
            className="cps-30 cpe-30 cpt-20 cpb-20 h-35"
            onClick={() => {
              handelRequest(receiverId, "2");
            }}
            btnLoading={`${receiverId}-2` === btnLoader}
          />
        </>
      )}

      {cType === "follower" && isFollowBtn && (
        <>
          <Button
            text={
              isExist ? "Cancel" : isAlreadyFollow ? "Unfollow" : "Follow back"
            }
            btnStyle="primary-outline"
            className="h-35 cps-20 cpe-20 text-14-500"
            btnLoading={sendRequestLoader === receiverId}
            onClick={() => {
              handelSendRequest(receiverId);
            }}
            isSquare
          />

          <div
            className="text-13-400 color-new-car pointer d-flex align-items-center gap-2"
            onClick={() => {
              handleChatNow(receiverId);
            }}
          >
            <span>Send Message</span>
            {receiverId === chatLoader && (
              <span>
                <Loader size="sm" />
              </span>
            )}
          </div>
        </>
      )}

      {cType === "following" && isFollowingBtn && (
        <>
          <Button
            text="Send Message"
            btnStyle="primary-outline"
            className="h-35 cps-20 cpe-20 text-14-500"
            onClick={() => {
              handleChatNow(receiverId);
            }}
            btnLoading={receiverId === chatLoader}
            isSquare
          />

          <div
            className="text-13-400 color-black-olive pointer d-flex align-items-center"
            onClick={() => {
              handelSendRequest(receiverId);
            }}
          >
            {sendRequestLoader === receiverId ? (
              <div className="spinner-border spinner-border-sm" />
            ) : isExist ? (
              "Follow"
            ) : (
              "Unfollow"
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RequestHandleLayout;
