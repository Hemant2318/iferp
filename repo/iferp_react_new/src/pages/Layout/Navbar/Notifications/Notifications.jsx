import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "react-bootstrap/Image";
import Loader from "components/Layout/Loader";
import { icons, membershipType } from "utils/constants";
import {
  getDataFromLocalStorage,
  messageTime,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import { getNotifications, readNotifications, setIsBadge } from "store/slices";
import moment from "moment";
import Profile from "components/Layout/Profile";
import { map } from "lodash";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const myRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notificationList, isBadge } = useSelector((state) => ({
    notificationList: state.student.notificationList,
    isBadge: state.student.isBadge,
  }));
  const [isPopup, setIsPopup] = useState(false);
  const [readLoader, setReadLoader] = useState(false);
  const [displayList, setDisplayList] = useState([]);
  const [notificationLoader, setNotificationLoader] = useState(true);
  const handleClickOutside = (e) => {
    if (myRef.current && !myRef.current.contains(e.target)) {
      setIsPopup(false);
    }
  };
  const markAsRead = async () => {
    setReadLoader(true);
    let pendingList = notificationList.filter((o) => o.is_read === "0");
    let ids = map(pendingList, "id");
    const response = await dispatch(
      readNotifications(objectToFormData({ ids: ids }))
    );
    if (response?.status === 200) {
      setDisplayList([]);
      dispatch(setIsBadge(false));
    }
    setReadLoader(false);
  };
  const getNotificationList = async () => {
    setNotificationLoader(true);
    await dispatch(getNotifications());
    setNotificationLoader(false);
  };
  useEffect(() => {
    if (notificationList.length > 0) {
      let pendingList = notificationList.filter((o) => o.is_read === "0");
      setDisplayList(pendingList);
    }
  }, [notificationList]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
  useEffect(() => {
    if (isPopup) {
      getNotificationList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPopup]);

  return (
    <div className="notification-icon" ref={myRef}>
      <div
        className="position-relative pointer"
        onClick={() => {
          setIsPopup(!isPopup);
        }}
      >
        <Image src={icons.notification} height={24} width={24} />
        {isBadge && <span className="notify-pointer" />}
      </div>
      {isPopup && (
        <div className="notification-popup-container box-shadow">
          <div className="cmt-20 cps-12 cpe-12">
            <div className="d-flex align-items-center justify-content-between">
              <div className="text-15-500 title-text">Notifications</div>
              {!notificationLoader && displayList.length > 0 && (
                <div
                  className="text-12-400 color-new-car pointer d-flex gap-2"
                  onClick={markAsRead}
                >
                  <img src={icons.seen} alt="seen" />
                  Mark as read
                  {readLoader && <Loader size="sm" />}
                </div>
              )}
            </div>
            <div
              className="cmt-20 iferp-scroll pe-2"
              id="notification-popup-list"
            >
              {notificationLoader ? (
                <div className="pt-5 pb-5">
                  <Loader size="sm" />
                </div>
              ) : displayList.length === 0 ? (
                <div className="center-flex text-13-500 pt-5 pb-5">
                  No Data Found
                </div>
              ) : (
                displayList.map((elem, index) => {
                  const {
                    sender_name = "Admin",
                    created_at,
                    title,
                    sender_profile_photo,
                  } = elem;
                  return (
                    <React.Fragment key={index}>
                      <div className="cmt-12">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="d-flex align-items-center gap-2">
                            <Profile
                              isRounded
                              text={sender_name}
                              size="s-34"
                              url={sender_profile_photo}
                              isS3UserURL
                            />
                            <div className="text-12-400 color-black-olive">
                              {titleCaseString(sender_name)}
                            </div>
                          </div>
                          <div className="text-12-400 color-dark-silver">
                            <img src={icons.time} alt="time" className="me-2" />
                            {messageTime(
                              moment(created_at).format("DD-MM-YYYY hh:mm A")
                            )}
                          </div>
                        </div>
                        <div className="text-13-500 cmb-12">{title}</div>
                      </div>
                      {displayList.length - 1 !== index && (
                        <hr className="gray-border unset-p unset-m" />
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </div>
          <div
            className="text-13-400 color-new-car d-flex align-items-center justify-content-center mb-2 pointer mt-2 pb-2"
            onClick={() => {
              setIsPopup(false);
              const userFlag = membershipType.find(
                (o) => o.id === getDataFromLocalStorage("user_type")
              )?.type;
              navigate(`/${userFlag}/inbox-notifications/notifications`);
            }}
          >
            {displayList.length > 0 && !notificationLoader && (
              <u> View All Notifications</u>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Notifications;
