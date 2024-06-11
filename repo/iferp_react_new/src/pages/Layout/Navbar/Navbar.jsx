import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Image from "react-bootstrap/Image";
import Button from "components/form/Button";
import Profile from "components/Layout/Profile";
import UpgradeButton from "components/Layout/UpgradeButton";
import { icons, membershipType } from "utils/constants";
import { getDataFromLocalStorage, userTypeByStatus } from "utils/helpers";
import { setIsCalendar, setIsLogout } from "store/slices";
import Notifications from "./Notifications";
import GlobalSearch from "./GlobalSearch";
import "./Navbar.scss";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const myRef = useRef();
  const { userDetails } = useSelector((state) => ({
    userDetails: state.student.userDetails,
  }));
  const { first_name, profile_photo_path } = userDetails;
  const userData = getDataFromLocalStorage();
  const { member_id, user_type, membership_details = {}, name } = userData;
  const { id: membershipID, expire_date, plan_name } = membership_details;
  const findType = membershipType.find((o) => o.id === user_type)?.type || "";
  const [isProfile, setIsProfile] = useState(false);
  const handleRedirect = (e) => {
    setIsProfile(false);
    navigate(`/${userTypeByStatus()}/change-password`);
  };
  const handleClickOutside = (e) => {
    if (myRef.current && !myRef.current.contains(e.target)) {
      setIsProfile(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const access = {
    isUpgradeButton:
      !window.location.pathname.includes("upgrade") &&
      ((user_type === "2" && membershipID === 2) ||
        (user_type === "5" && membershipID === 11)),
    isPremiumIcon:
      (membershipID === 3 || membershipID === 12) &&
      !window.location.pathname.includes("renew"),
    isRenew:
      moment().diff(expire_date, "days") > 0 &&
      !window.location.pathname.includes("renew"),
    isMyProfile: !["0", "6"].includes(user_type),
  };
  return (
    <nav id="Navbar-container" className="navbar">
      <div className="row w-100 header-parent d-flex align-items-center position-relative">
        <div className="col-xl-5 col-md-4 col-sm-12 cmb-10 center-flex">
          <GlobalSearch placeholder="Search event here" />
        </div>
        <div className="col-xl-7 col-md-8 col-sm-12 cmb-10">
          <div className="row header-child">
            <div className="col-xl-5 col-md-4 col-6  center-flex gap-md-4 gap-2 notification-calender-block">
              <div className="box-shadow icon-content">
                <Image
                  src={icons.calendar}
                  height={24}
                  width={24}
                  className="pointer"
                  onClick={() => {
                    // navigate(`/${findType}/calendar`);
                    dispatch(setIsCalendar(true));
                  }}
                />
              </div>
              <div className="box-shadow icon-content">
                <Notifications />
              </div>
            </div>
            <div className="col-xl-7 col-md-8 col-6  d-flex justify-content-end align-items-center">
              <div className="me-3">
                <div className="color-cetacean-blue text-16-500">
                  {name ? name?.split(" ")[0] : first_name}
                </div>
                <div className="text-10-400">
                  <span className="color-dark-charcole">ID: {member_id} </span>
                </div>
                {plan_name && (
                  <div className="text-10-400">
                    <span className="color-dark-charcole">
                      Plan: {plan_name}
                    </span>
                  </div>
                )}
              </div>
              <div className="me-3 position-relative">
                <Profile
                  isRounded
                  isS3UserURL={profile_photo_path}
                  url={profile_photo_path}
                  text={first_name}
                  size="s-60"
                />

                {access.isPremiumIcon && !access.isRenew && (
                  <div className="profile-indicator">
                    <Image src={icons.primaryCrown} />
                  </div>
                )}
              </div>
              <div className="position-relative">
                <i
                  className="bi bi-chevron-down pointer"
                  onClick={() => {
                    setIsProfile(true);
                  }}
                />
                {isProfile && (
                  <div
                    className="my-profile-block cps-16 cpe-16 cpt-16 cpb-16"
                    ref={myRef}
                  >
                    {access.isMyProfile && (
                      <>
                        <div
                          className="text-15-400 color-black-olive pointer"
                          onClick={() => {
                            setIsProfile(false);
                            navigate(`/${findType}/my-details`);
                          }}
                        >
                          <img
                            src={icons.profile}
                            alt="olgout"
                            className="me-2 h-21"
                          />
                          My profile
                        </div>
                        <hr className="gray-border unset-p unset-m cmt-16 cmb-16" />
                      </>
                    )}
                    <div
                      className="text-15-400 color-black-olive pointer"
                      onClick={handleRedirect}
                    >
                      <img
                        src={icons.lock}
                        alt="olgout"
                        className="me-2 h-21"
                      />
                      Change Password
                    </div>
                    <hr className="gray-border unset-p unset-m cmt-16 cmb-16" />
                    <div
                      className="text-15-400 color-black-olive pointer"
                      onClick={() => {
                        dispatch(setIsLogout(true));
                      }}
                    >
                      <img
                        src={icons.logout}
                        alt="olgout"
                        className="me-2 h-21"
                      />
                      Log Out
                    </div>
                  </div>
                )}
              </div>

              <div className="d-sm-block d-none">
                {access.isRenew ? (
                  <Button
                    isRounded
                    text="Renew"
                    btnStyle="primary-outline"
                    className="ms-sm-3 ms-0 mt-sm-0 mt-3 "
                    onClick={() => {
                      navigate(`/${findType}/renew`);
                    }}
                  />
                ) : (
                  access.isUpgradeButton && (
                    <div className="ms-sm-3 ms-0 mt-sm-0 mt-3">
                      <UpgradeButton />
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="d-sm-none d-block">
              {access.isRenew ? (
                <Button
                  isRounded
                  text="Renew"
                  btnStyle="primary-outline"
                  className="ms-sm-3 ms-0 mt-sm-0 mt-3 "
                  onClick={() => {
                    navigate(`/${findType}/renew`);
                  }}
                />
              ) : (
                access.isUpgradeButton && (
                  <div className="ms-sm-3 ms-0 mt-sm-0 mt-3">
                    <UpgradeButton />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
