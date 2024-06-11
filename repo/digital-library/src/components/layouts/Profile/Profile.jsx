import { useEffect, useState } from "react";
import { generatePreSignedUrl } from "../../../utils/helpers/common";
import { ProfilePath, icons } from "../../../utils/constants";
import "./Profile.scss";
const adminList = [
  "admin",
  "Admin",
  "iferp",
  "IFERP",
  "iferp admin",
  "IFERP Admin",
];

const Profile = ({
  text,
  url,
  isRounded,
  className,
  isS3UserURL,
  size,
  bgColor = "bg-b494",
  textColor = "color-ffff",
}) => {
  // let displayText = "";
  // const [isImageError, setisImageError] = useState(false);
  // const [s3URL, setS3URL] = useState("");
  // if (text) {
  //   displayText = text
  //     .split(/\s/)
  //     .reduce((response, word) => (response += word.slice(0, 1)), "");
  //   displayText = displayText.substring(0, 1).toUpperCase();
  // }
  // const pClass = `f-center ${url ? "bg-ffff" : "bg-f3ff"} ${
  //   className ? className : ""
  // } ${size} ${isRounded ? "rounded-circle" : "rounded"}`;

  // const fetchProfile = async (profileName) => {
  //   let retunURL = "";
  //   const response = await generatePreSignedUrl(profileName, ProfilePath);
  //   retunURL = response;
  //   setS3URL(retunURL);
  // };

  // useEffect(() => {
  //   if (url && isS3UserURL) {
  //     fetchProfile(url);
  //   } else {
  //     setS3URL(url);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [url]);
  let displayText = "";
  const [isImageError, setisImageError] = useState(false);
  const [s3URL, setS3URL] = useState("");
  const fetchProfile = async (profileName) => {
    let retunURL = "";
    const response = await generatePreSignedUrl(profileName, ProfilePath);
    retunURL = response;
    setS3URL(retunURL);
  };
  useEffect(() => {
    if (url && isS3UserURL) {
      fetchProfile(url);
    } else {
      setS3URL(url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  if (text) {
    displayText = text
      .split(/\s/)
      .reduce((response, word) => (response += word.slice(0, 1)), "");
    displayText = displayText.substring(0, 1).toUpperCase();
  }
  const pClass = `center-flex ${className} ${bgColor} ${size} ${textColor} ${
    isRounded ? "rounded-circle" : "rounded"
  }`;
  const isAdmin = adminList.includes(text);

  return (
    <div id="profile-container">
      {(s3URL && !isImageError) || isAdmin ? (
        <div className={`profile-block-data ${pClass} bg-white`}>
          <img
            src={isAdmin ? icons.roundLogo : s3URL}
            alt={"user-profile"}
            className={`fill fit-image ${
              isRounded ? "rounded-circle" : "rounded"
            }`}
            onError={() => {
              setisImageError(true);
            }}
          />
        </div>
      ) : (
        <div className={`profile-block-data ${pClass}`}>{displayText}</div>
      )}
    </div>
    /* <div id="profile-container">
      {(s3URL && !isImageError) || isAdmin ? (
        <div className={`profile-block-data ${pClass} bg-white`}>
          <img
            src={isAdmin ? icons.roundLogo : s3URL}
            alt={"user-profile"}
            className={`fill fit-image ${
              isRounded ? "rounded-circle" : "rounded"
            } ${isRoundedBorder && "round-border"}`}
            onError={() => {
              setisImageError(true);
            }}
          />
        </div>
      ) : (
        <div className={`profile-block-data ${pClass}`}>{displayText}</div>
      )}
    </div> */
  );
};

export default Profile;
