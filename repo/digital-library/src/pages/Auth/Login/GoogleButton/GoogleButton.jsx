// import {Loader} from "components";
import { LoginSocialGoogle } from "reactjs-social-login";
import { icons } from "utils/constants";

const GoogleButton = () => {
  const clientID =
    "801680351847-ugkhiol0dkh8u4eqc9cn3aruu3smbpem.apps.googleusercontent.com";
  // "584855079255-k9rsqe0l04v2h3js9inc3bui9h34t6gh.apps.googleusercontent.com";

  return (
    <LoginSocialGoogle
      client_id={clientID}
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
            src={icons.googleplusIcon}
            alt="googleimage"
          />
        </span>
        {/* <span className="ms-3">{isLoad && <Loader size="sm" />}</span> */}
      </div>
    </LoginSocialGoogle>
  );
};

export default GoogleButton;
