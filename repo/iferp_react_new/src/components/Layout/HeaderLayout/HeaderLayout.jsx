import logo from "assets/icons/logo.svg";
import "./HeaderLayout.scss";

const HeaderLayout = ({ children }) => {
  return (
    <div id="header-layout-container">
      <div className="layout-header-block">
        <img className="img-logo1" src={logo} alt="img" />
      </div>
      <div className="layout-body-container iferp-scroll">{children}</div>
    </div>
  );
};
export default HeaderLayout;
