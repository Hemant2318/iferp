import React from "react";
import { LoginSocialFacebook } from "reactjs-social-login";
import { icons } from "utils/constants";

const FacebookButton = () => {
  const facebookId = "243054538647300";
  return (
    <LoginSocialFacebook
      appId={facebookId}
      onResolve={(provider) => {
        console.log("hello", provider);
      }}
      onReject={(err) => {
        console.log(err);
      }}
    >
      <div className="pointer">
        <span>
          <img
            className="img-icon me-2"
            src={icons.facebookIcon}
            alt="facebookimage"
          />
        </span>
        {/* <span className="ms-3">{isLoad && <Loader size="sm" />}</span> */}
      </div>
    </LoginSocialFacebook>
  );
};

export default FacebookButton;
