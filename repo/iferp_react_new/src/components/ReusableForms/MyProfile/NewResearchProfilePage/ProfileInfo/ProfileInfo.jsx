import React, { useState } from "react";
import { icons } from "utils/constants";
import Profile from "components/Layout/Profile";
import ShareButton from "components/Layout/ShareButton";
import { useParams } from "react-router-dom";
import { isArray } from "lodash";
import EditButton from "components/Layout/EditButton";
import PreviewProfileInfoPopup from "components/Layout/PreviewProfileInfoPopup";
import { getDataFromLocalStorage } from "utils/helpers";
import "./ProfileInfo.scss";

const ProfileInfo = ({
  profile_details,
  isLoginUser,
  setConnectModel,
  rProfileData,
  isEdit,
  fetchDetails,
}) => {
  const params = useParams();
  const [editInfo, setEditInfo] = useState(false);
  const [isResearchAdd, setIsResearchAdd] = useState(false);
  const {
    first_name,
    last_name,
    state_name,
    country_name,
    university,
    profile_photo,
    user_type,
    membership_plan_id,
  } = profile_details || {};
  const { research_id } = rProfileData || {};
  let socialProfiles = [
    {
      id: 1,
      name: "Scopus Profile",
      name_id: "Scopus Author ID",
      img: icons.scProfileIcon,
      redirect: "",
    },
    {
      id: 2,
      name: "ORCID Profile",
      name_id: "Orcid - ID",
      img: icons.idProfileIcon,
      redirect: "",
    },
    {
      id: 3,
      name: "Google Scholar",
      name_id: "Google Scholar",
      img: icons.googleprofileIcon,
      redirect: "",
    },
    {
      id: 4,
      name: "Publons Profile",
      name_id: "Publons ID",
      img: icons.publonProfileIcon,
      redirect: "",
    },
    {
      id: 5,
      name: "Linked In Profile",
      name_id: "Linked-in-Profile",
      img: icons.linkdinProfileIcon,
      redirect: "",
    },
    {
      id: 6,
      name: "Vidwan Profile",
      img: icons.vidwanIcon,
      name_id: "Vidwan-ID",
      redirect: "",
    },
    {
      id: 7,
      name: "Researcher Profile",
      name_id: "Researcher ID",
      img: icons.researcherIcon,
      redirect: "",
    },
  ];
  let newSocialProfiles = [];
  if (isArray(research_id) && research_id?.length > 0) {
    socialProfiles?.forEach((elem) => {
      const matchingResearch = research_id?.find(
        (item) => item?.name === elem?.name_id
      );
      if (matchingResearch && matchingResearch?.number) {
        elem.redirect = matchingResearch?.number;
      }
    });
    newSocialProfiles = socialProfiles?.filter((o) => o?.redirect !== "");
  }
  return (
    <div className="profile-info-container w-100">
      {editInfo && (
        <PreviewProfileInfoPopup
          onHide={() => {
            setEditInfo(false);
          }}
          fetchDetails={fetchDetails}
          isFieldEmpty={isResearchAdd}
          setIsFieldEmpty={setIsResearchAdd}
        />
      )}
      <div className="cmb-25 profile-image">
        <div className="share-icon">
          <ShareButton
            url={`${window?.location?.origin}/member/global-research-profile/${
              isEdit ? getDataFromLocalStorage("id") : params?.id
            }`}
            noTitle={true}
          />
        </div>
        <div className="d-flex cmt-30">
          <Profile
            isRounded
            isRoundedBorder
            url={profile_photo}
            text={first_name}
            size="s-168"
            isS3UserURL
          />
        </div>
      </div>
      {isEdit && (
        <div className="d-flex justify-content-center cmb-10">
          <EditButton
            onClick={() => {
              setEditInfo(true);
              if (research_id?.length === 0) {
                setIsResearchAdd(true);
              }
            }}
          />
        </div>
      )}
      <div className="d-flex flex-column align-items-center justify-content-center">
        {first_name && (
          <div className="text-18-600 color-dark-blue cmb-5">
            {`${first_name} ${last_name}`}
          </div>
        )}
        <div className="text-15-400 color-4453 cmb-10 text-center">
          {`${user_type === "2" ? (university ? `${university}` : "") : ""}${
            state_name || country_name ? " - " : ""
          } ${state_name ? `${state_name}, ` : ""}${country_name || ""}`}
        </div>
      </div>
      {membership_plan_id === 3 && (
        <div className="d-flex justify-content-center cmb-20 color-68d3 text-14-500">
          <span className="premium-crown-outline br-4 d-flex gap-2 align-items-center justify-content-center p-2">
            <img alt="crown" src={icons.premiumCrown} />
            Premium Member
          </span>
        </div>
      )}
      <div className="border-bottom cmb-20"></div>
      <div className="cps-15">
        {newSocialProfiles?.length > 0 ? (
          newSocialProfiles?.map((elem, index) => {
            const { name, img, redirect } = elem;
            const isLink = redirect?.includes("https");

            return (
              <div
                className={`pointer ${
                  newSocialProfiles?.length - 1 !== index && "cmb-20"
                } row align-items-center`}
                key={index}
                onClick={() => {
                  if (!isLoginUser) {
                    setConnectModel(true);
                    return;
                  }
                  isLink && window.open(redirect, "_blank");
                }}
              >
                <div className="col-md-3 col-sm-2">
                  <div style={{ width: "30px", height: "30px" }}>
                    <img src={img} alt="logo" />
                  </div>
                </div>
                <div
                  className={`${
                    isLink ? "hover-effect" : ""
                  } text-15-400 color-4b4b col-md-9 col-sm-5`}
                >
                  {name}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-15-500 color-4b4b d-flex flex-column align-items-center justify-content-center">
            Research profile has not added by the user!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
