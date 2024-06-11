import { useState } from "react";
import { useRef } from "react";
import { useCallback } from "react";
import TwitterLogin from "react-twitter-login";
import { LoginSocialTwitter } from "reactjs-social-login";
import { icons } from "utils/constants";

const TwitterSocialLogin = () => {
  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState();
  const twitterRef = useRef();
  const REDIRECT_URI = "http://127.0.0.1:3000/login/";

  const APIKey = "YWN7yNS6Mbx140Xi1gW2FDfnB";
  const APISecret = "atnYZYivIXa6KEntAIxTa4dnTsDNTknP6CZUScTCAUOOOOOenZ";
  const bearerToken =
    "AAAAAAAAAAAAAAAAAAAAAI8ZpAEAAAAAFwWqaZBq3di82PYDRXNYMaTuox8%3DPMcv4k72KXEb9RXxUQ6HC27Sei1db0FpqBU3F02nk7xvpqJnCn";
  const accessToken = "1547910100551352320-CUXbUjsBY82AJV6JS56ZewYVsuoMTT";
  const accessTokenSecret = "kMciLDcsgE9E92a1WZ0EveNSCPl94ZxaRJV3cR4GUBNcW";

  const clientID = "eXdJOXN0TXNZU3psQmg2RDBSWlI6MTpjaQ";
  const clientSecret = "YWaeHqCMcqKekC6_kFdjiyf1PgL_Ll-ISUOKO3hNNB_qyy6eaz";

  const onLoginStart = useCallback(() => {
    console.log("login start");
  }, []);

  const onLogoutSuccess = useCallback(() => {
    console.log("logout success");
  }, []);

  const handelSave = async ({ data }) => {
    console.log("data", data);
  };
  return (
    <LoginSocialTwitter
      // ref={twitterRef}
      client_id={clientID}
      client_secret={clientSecret}
      redirect_uri={REDIRECT_URI}
      onResolve={handelSave}
      onReject={(err) => {
        console.log("err", err);
      }}
      onLoginStart={onLoginStart}
      onLogoutSuccess={onLogoutSuccess}
    >
      <div className="pointer">
        <span>
          <img
            className="img-icon me-2"
            src={icons.twitterIcon}
            alt="twitImage"
          />
        </span>
        {/* <span className="ms-3">{isLoad && <Loader size="sm" />}</span>  */}
      </div>
    </LoginSocialTwitter>
  );
};

export default TwitterSocialLogin;
