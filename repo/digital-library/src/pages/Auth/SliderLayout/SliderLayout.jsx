import { icons } from "utils/constants";
import "./SliderLayout.scss";
import LeftSlider from "../Login/LeftSlider/LeftSlider";
import { useParams } from "react-router-dom";

const SliderLayout = ({ children }) => {
  const params = useParams();
  const userType = params?.type === "organization" || params?.type === "detail";

  return (
    <div id="slider-layout-container">
      <img className="img-logo1" src={icons.newIferpLogo} alt="img" />
      <div className="block">
        <div
          className={
            userType
              ? `d-flex align-items-center justify-content-center`
              : `row d-flex align-items-center flex-wrap`
          }
        >
          {!userType && (
            <div className="col-md-6">
              <LeftSlider />
            </div>
          )}
          <div className={userType ? "col-md-8 cpb-50" : "col-md-6 box-height"}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SliderLayout;
