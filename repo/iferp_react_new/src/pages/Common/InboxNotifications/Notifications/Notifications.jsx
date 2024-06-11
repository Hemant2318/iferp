import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader/Loader";
import Profile from "components/Layout/Profile";
import Button from "components/form/Button";
import { cloneDeep, map } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  acceptRequests,
  fetchRequests,
  getNotifications,
  readNotifications,
  setIsBadge,
  setRProfileID,
} from "store/slices";
import { icons, membershipType } from "utils/constants";
import {
  getDataFromLocalStorage,
  messageTime,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";

const Notifications = () => {
  const dispatch = useDispatch();
  const { notificationList } = useSelector((state) => ({
    notificationList: state.student.notificationList,
  }));
  const [notificationLoader, setNotificationLoader] = useState(true);
  const [requestList, setRequestList] = useState([]);
  const [btnLoader, setBtnLoader] = useState("");
  const userData = getDataFromLocalStorage();
  const { user_type: userType } = userData;

  const navigate = useNavigate();
  const markAsRead = async () => {
    let pendingList = notificationList.filter((o) => o.is_read === "0");
    let ids = map(pendingList, "id");
    const response = await dispatch(
      readNotifications(objectToFormData({ ids: ids }))
    );
    if (response?.status === 200) {
      dispatch(setIsBadge(false));
    }
  };
  const getNotificationList = async () => {
    setNotificationLoader(true);
    await dispatch(getNotifications());
    setNotificationLoader(false);
  };

  //get request
  const getRequest = async () => {
    const response = await dispatch(fetchRequests({ type: "follower" }));
    setRequestList(response?.data?.result || []);
  };

  //accept reject request
  const handelRequest = async (id, type) => {
    setBtnLoader(`${id}-${type}`);
    const response = await dispatch(
      acceptRequests(objectToFormData({ sender_id: id, status: type }))
    );
    if (response?.status === 200) {
      let oldRequestList = cloneDeep(requestList);

      if (type === "1") {
        oldRequestList = oldRequestList?.filter((o) => `${o?.id}` !== `${id}`);
      } else {
        oldRequestList = oldRequestList?.filter((o) => `${o?.id}` !== `${id}`);
      }
      setRequestList(oldRequestList);
    }
    setBtnLoader("");
  };

  useEffect(() => {
    if (notificationList.length > 0) {
      const isAnyUnread = notificationList.some((o) => o.is_read === "0");
      if (isAnyUnread) {
        markAsRead();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationList]);

  useEffect(() => {
    getNotificationList();
    getRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const findType = membershipType?.find((o) => o?.id === userType);
  return (
    <div>
      {notificationLoader ? (
        <Card className="cps-20 cpe-20 pt-5 pb-5">
          <Loader size="md" />
        </Card>
      ) : (
        notificationList.map((elem, index) => {
          let {
            created_at,
            title,
            description,
            sender_id,
            sender_name = "Admin",
            sender_profile_photo,
            sender_type,
            post_id,
            post_title,
          } = elem;
          const isReasearchProfile = ["2", "5"].includes(sender_type);

          const friendRequestData = requestList?.find(
            (o) => o?.id === +sender_id
          );

          return (
            <React.Fragment key={index}>
              <Card className="cps-20 cpe-20 cpt-16 cpb-16 mb-2">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <div className="d-flex align-items-center gap-3">
                    <Profile
                      isRounded
                      isS3UserURL
                      text={sender_name}
                      size="s-34"
                      url={sender_profile_photo}
                    />
                    <div
                      className={`text-16-500 title-text ${
                        isReasearchProfile
                          ? "hover-effect text-decoration-underline"
                          : ""
                      }`}
                      onClick={() => {
                        if (isReasearchProfile) {
                          dispatch(setRProfileID(sender_id));
                        }
                      }}
                    >
                      {sender_name}
                    </div>
                  </div>
                  <div className="text-12-400 color-subtitle-navy">
                    <img src={icons.time} alt="time" className="me-2" />
                    {messageTime(
                      moment(created_at).format("DD-MM-YYYY hh:mm A")
                    )}
                  </div>
                </div>
                {sender_type === "0" && title === "New Create Post" && (
                  <div className="mt-1 ms-5">
                    <div
                      className="d-flex text-15-500 color-new-car hover-effect"
                      onClick={() => {
                        navigate(
                          `/${findType?.type}/network-management/network/post/post-details/${post_id}`
                        );
                      }}
                    >
                      {` ${titleCaseString(post_title)}. -> View More`}
                    </div>
                  </div>
                )}
                <div className="text-15-500 ms-5">{title}</div>
                <div className="text-14-400 ms-5">{description}</div>
                {friendRequestData?.id && title === "Friend Request" && (
                  <div className="d-flex gap-3 ms-5 mt-2">
                    <Button
                      text="Accept"
                      btnStyle="primary-dark"
                      className="cps-20 cpe-20 cpt-20 cpb-20 h-30"
                      onClick={() => {
                        handelRequest(sender_id, "1");
                      }}
                      btnLoading={`${sender_id}-1` === btnLoader}
                    />
                    <Button
                      text="Decline"
                      btnStyle="light-outline"
                      className="cps-20 cpe-20 cpt-20 cpb-20 h-30"
                      onClick={() => {
                        handelRequest(sender_id, "2");
                      }}
                      btnLoading={`${sender_id}-2` === btnLoader}
                    />
                  </div>
                )}
              </Card>
            </React.Fragment>
          );
        })
      )}
    </div>
  );
};
export default Notifications;
