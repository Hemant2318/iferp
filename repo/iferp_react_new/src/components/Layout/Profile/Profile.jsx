import { useEffect, useState } from "react";
import "./Profile.scss";
import { icons, profilePath } from "utils/constants";
import { generatePreSignedUrl } from "utils/helpers";

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
  className,
  isRounded,
  isS3UserURL,
  size = "s-52",
  bgColor = "bg-new-car-light",
  textColor = "color-raisin-black",
  isRoundedBorder,
  minWidth,
}) => {
  let displayText = "";
  const [isImageError, setisImageError] = useState(false);
  const [s3URL, setS3URL] = useState("");
  const fetchProfile = async (profileName) => {
    let retunURL = "";
    const response = await generatePreSignedUrl(profileName, profilePath);
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
  const pClass = `center-flex ${className} ${bgColor} ${size} ${
    minWidth ? "minWidth" : ""
  } ${textColor} ${isRounded ? "rounded-circle" : "rounded"}`;
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
            } ${isRoundedBorder && "round-border"}`}
            onError={() => {
              setisImageError(true);
            }}
          />
        </div>
      ) : (
        <div className={`profile-block-data ${pClass}`}>{displayText}</div>
      )}
    </div>
  );
};
export default Profile;
