import React from "react";
import { useNavigate } from "react-router-dom";
import { icons } from "utils/constants";
import { getDataFromLocalStorage } from "utils/helpers";
import GlobalSearch from "../Navbar/GlobalSearch";
import Button from "components/form/Button";
import "./GlobalProfileHeader.scss";

const GlobalProfileHeader = ({ placeholder }) => {
  const navigate = useNavigate();
  let userId = getDataFromLocalStorage("id");
  return (
    <nav id="new-global-navbar-container" className=" bg-white">
      <div className="row">
        <div className="left-logo col-md-4 ">
          <img className="img-logo1" src={icons.logo} alt="img" />
        </div>
        <div className="center-search col-md-4 mb-sm-2 mb-2">
          {/* <div className="col-12 col-md-10 col-lg-8"> */}
          <GlobalSearch
            placeholder={
              placeholder
                ? placeholder
                : "Search Research, People, Topics & More"
            }
          />
          {/* </div> */}
        </div>
        <div className="right-button col-md-4">
          <div className="d-flex justify-content-end gap-2">
            {userId ? (
              <Button
                isSquare
                btnStyle="primary-dark"
                text="Go To Your Dashboard"
                className="cps-18 cpe-18 text-nowrap"
                onClick={() => {
                  navigate("/");
                }}
              />
            ) : (
              <>
                <Button
                  isSquare
                  btnStyle="primary-outline"
                  text="Login"
                  className="cps-32 cpe-32"
                  onClick={() => {
                    navigate("/member/login");
                  }}
                />
                <Button
                  isSquare
                  btnStyle="primary-dark"
                  text="Join Now"
                  className="cps-18 cpe-18 text-nowrap"
                  onClick={() => {
                    navigate("/member/register");
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GlobalProfileHeader;
