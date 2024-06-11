import { useState } from "react";
import { useSelector } from "react-redux";
import Card from "../Card";
import Profile from "../Profile";
import { icons } from "utils/constants";
import EditProfile from "./EditProfile";
import "./ChatProfile.scss";

const ChatProfile = () => {
  const [isEditProfile, setIsEditProfile] = useState(false);
  const { myNetworkDetails, userDetails } = useSelector((state) => ({
    myNetworkDetails: state.global.myNetworkDetails,
    userDetails: state.student.userDetails,
  }));
  const {
    first_name,
    last_name,
    profile_photo_path,
    personal_details = {},
    user_type,
  } = userDetails;
  const { city_name } = personal_details;
  const { followers, followings, total_posts } = myNetworkDetails;
  const userProfilePhoto = profile_photo_path || icons.roundLogo;
  const isEdit = !["0", "6"].includes(user_type);
  return (
    <div id="chat-profile-container">
      {isEditProfile && (
        <EditProfile
          onHide={() => {
            setIsEditProfile(false);
          }}
        />
      )}
      <Card className="chat-user-profile-block cpb-30">
        <div className="top-block">
          {isEdit && (
            <div
              className="edit-prof"
              onClick={() => {
                setIsEditProfile(true);
              }}
            >
              <i className="bi bi-pencil color-new-car text-12-400" />
            </div>
          )}
        </div>
        <div className="center-block">
          <Profile
            isRounded
            isS3UserURL
            size="s-100"
            url={userProfilePhoto}
            text={`${first_name} ${last_name}`}
          />
        </div>
        <div className="bottom-block">
          <div className="text-16-600 color-raisin-black text-center d-flex flex-wrap justify-content-center">
            <span className="me-1">Welcome,</span>
            <span className="text-nowrap">{`${first_name} ${last_name}`}!</span>
          </div>
          <div className="text-14-500 color-black-olive cpt-12">
            {city_name || ""}
          </div>
        </div>
      </Card>
      <Card className="mt-3 cpt-24 cpb-24 d-flex d-flex justify-content-center flex-wrap">
        <div className="cps-20 cpe-20 border-end text-center mb-2">
          <div className="text-16-500 color-raisin-black">{followers}</div>
          <div className="text-12-400 color-black-olive mt-2">Followers</div>
        </div>
        <div className="cps-20 cpe-20 border-end text-center mb-2">
          <div className="text-16-500 color-raisin-black">{followings}</div>
          <div className="text-12-400 color-black-olive mt-2">Following</div>
        </div>
        <div className="cps-20 cpe-20 text-center mb-2">
          <div className="text-16-500 color-raisin-black">{total_posts}</div>
          <div className="text-12-400 color-black-olive mt-2">Posts</div>
        </div>
      </Card>
    </div>
  );
};
export default ChatProfile;
