import { icons } from "utils/constants";
import { Button } from "components";
import "./InvalidToken.scss";

const InvalidToken = () => {
  return (
    <div id="invalidtoken-container" className="f-center h-100">
      <div className="d-flex flex-column align-items-center">
        <div className="h-300 w-300 f-center">
          <img src={icons.invalidTok} className="fit-image" />
        </div>
        <div className="text-20-500 text-center">
          Something wrong with your token.
        </div>
        <div className="text-16-400 text-center cmt-16">
          Your token is invalid for some reason, <br />
          please login and try again.
        </div>
        <div className="mt-5">
          <Button
            btnStyle="SD"
            btnText="Login"
            className="cps-40 cpe-40"
            onClick={() => {
              window.location.href =
                "https://stage-dashboard.iferp.in/member/login";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default InvalidToken;
