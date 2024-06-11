import SliderLayout from "../SliderLayout/SliderLayout";
import { icons } from "utils/constants";
import { useNavigate } from "react-router-dom";
import { Card, LineTextLabel, Profile } from "components";
import "./Signup.scss";

const Signup = () => {
  const navigate = useNavigate();
  return (
    <div id="signup-container" className="bg-skyBlue">
      <SliderLayout>
        <Card className="m-auto bg-ffff singup-card">
          <div className="text-28-500 color-2d2d text-center mb-1">
            Create Account
          </div>
          <div
            className="text-16-400 color-3d3d mb-4 text-center"
            style={{ fontFamily: "Inter" }}
          >
            Join a community of like-minded people & Gain Publicity
          </div>
          <div className="organization-block cmb-74">
            <div>
              <img src={icons.corporateIcon} alt="corporate" />
            </div>
            <div>
              <div className="text-18-500 mb-2 color-2121">Organization</div>
              <div className="text-15-400 color-2d2d">
                Institutions / Corporate / Industries
              </div>
            </div>
            <div
              className="pointer"
              onClick={() => {
                navigate("/organization/signup");
              }}
            >
              <img src={icons.roundedArrow} alt="corporate" />
            </div>
          </div>
          <LineTextLabel text="Or Sign up with" />
          <div className="cmt-44 d-flex justify-content-center gap-4 cmb-36">
            <div>
              <Profile
                url={icons.googleplusIcon}
                isRounded
                className="pointer"
              />
            </div>
            <div>
              <Profile url={icons.twitterIcon} isRounded className="pointer" />
            </div>
            <div>
              <Profile url={icons.facebookIcon} isRounded className="pointer" />
            </div>
          </div>
          <div className="text-center">
            <span className="text-14-400">Already a member?</span>
            <span
              className="text-14-500 color-b176 underline ps-2 pointer"
              onClick={() => {
                navigate("/login");
              }}
            >
              <u>Sign In Now</u>
            </span>
          </div>
        </Card>
      </SliderLayout>
    </div>
  );
};

export default Signup;
