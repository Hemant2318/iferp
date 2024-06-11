import { useState } from "react";
import "./ProfileBlock.scss";

const ProfileBlock = ({
  text,
  url,
  className,
  isRounded,
  size = "s-52",
  bgColor = "bg-e3e3",
  textColor = "color-0000",
}) => {
  let displayText = "";
  const [isImageError, setisImageError] = useState(false);
  if (text) {
    displayText = text
      .split(/\s/)
      .reduce((response, word) => (response += word.slice(0, 1)), "");
    displayText = displayText.substring(0, 2).toUpperCase();
  }
  const pClass = `f-center b-e3e3 ${className} ${bgColor} ${size} ${textColor} ${
    isRounded ? "rounded-circle" : "rounded"
  }`;
  return (
    <div id="profileblock-container">
      {isImageError ? (
        <div className={`profile-block-data ${pClass}`}>{displayText}</div>
      ) : (
        <div className={`profile-block-data ${pClass} bg-white`}>
          <img
            src={url}
            alt={"user-profile"}
            className={`fill fit-image ${
              isRounded ? "rounded-circle" : "rounded"
            }`}
            onError={() => {
              setisImageError(true);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProfileBlock;
