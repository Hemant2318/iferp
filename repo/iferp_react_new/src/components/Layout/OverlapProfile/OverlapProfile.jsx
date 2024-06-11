import { useEffect, useState } from "react";
import { combineArrayS3 } from "utils/helpers";
import { profilePath } from "utils/constants";
import { map } from "lodash";
import "./OverlapProfile.scss";

const OverlapProfile = ({ userList, NoText }) => {
  const [dList, setDList] = useState([]);
  const handleUserList = async (data) => {
    const userDetails = map(data, "user_details");
    let response = await combineArrayS3(userDetails, "profile", profilePath);
    setDList(response);
  };
  useEffect(() => {
    handleUserList(userList);
  }, [userList]);
  let displayProfileCount = dList.length - 5 > 0 ? dList.length - 5 : 0;
  return (
    <div id="overlap-profile-container">
      <div className="avatars">
        {dList.map((elm, index) => {
          return (
            <span className={`avatar ${index > 4 ? "d-none" : ""}`} key={index}>
              <img
                src={elm.s3File}
                className="fit-image fill"
                alt="u-profile"
                onError={(e) => {
                  e.target.src =
                    "https://media.istockphoto.com/id/1131164548/vector/avatar-5.jpg?s=612x612&w=0&k=20&c=CK49ShLJwDxE4kiroCR42kimTuuhvuo2FH5y_6aSgEo=";
                }}
              />
            </span>
          );
        })}
      </div>
      {!NoText && (
        <>
          {displayProfileCount === 0 && userList.length === 0 && (
            <div className="text-16-600 color-navy-title">0 member</div>
          )}
          {displayProfileCount > 0 && (
            <div className="text-16-600 color-navy-title">
              +{displayProfileCount} members
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OverlapProfile;
