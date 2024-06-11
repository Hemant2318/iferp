import logo from "assets/icons/logo.svg";
import LeftSlider from "../Login/LeftSlider";
import WhatsAppChat from "components/Layout/WhatsAppChat";
import "./SliderLayout.scss";

const SliderLayout = ({ isAdmin, children, isSelection }) => {
  return (
    <div id="slider-layout-container">
      <img className="img-logo1" src={logo} alt="img" />
      <div className="container">
        <div
          className={`row d-flex align-items-center flex-wrap h-100 main-block ${
            isAdmin ? "justify-content-center" : ""
          }`}
        >
          {!isAdmin && window.innerWidth > 786 && (
            <div className="col-md-6 left-new-block">
              {isSelection && (
                <div className="m-auto text-center">
                  <div className="text-center text-32-600 color-raisin-black cmb-20 font-poppins">
                    IFERP Membership
                  </div>
                  <div className="text-center text-16-400 color-raisin-black">
                    Become an IFERP Member to get connected with engineers and
                    researchers
                  </div>
                </div>
              )}
              <LeftSlider />
            </div>
          )}
          <div
            className={
              isAdmin ? "col-lg-7 col-md-8 col-sm-12" : "col-md-6 box-height "
            }
          >
            {children}
          </div>
        </div>
      </div>
      <WhatsAppChat />
    </div>
  );
};
export default SliderLayout;
