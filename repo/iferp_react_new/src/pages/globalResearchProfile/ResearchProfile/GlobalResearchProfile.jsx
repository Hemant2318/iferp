import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GlobalSearch from "pages/Layout/Navbar/GlobalSearch";
import Button from "components/form/Button";
import ResearchProfilePage from "components/ReusableForms/MyProfile/ResearchProfilePage";
import { getDataFromLocalStorage } from "utils/helpers";
import { icons } from "utils/constants";
import "./GlobalResearchProfile.scss";

const GlobalResearchProfile = () => {
  const navigate = useNavigate();
  const [connectModal, setConnectModel] = useState(false);
  let paramsID = useParams();
  let userId = getDataFromLocalStorage("id");
  return (
    <div className="container-md">
      {/*----------------- navbar ------------------------*/}
      <nav id="global-navbar-container" className="navbar bg-white">
        <div className="main-con">
          <div className="left-logo">
            <img className="img-logo1" src={icons.logo} alt="img" />
          </div>
          <div className="center-search">
            {/* <div className="col-12 col-md-10 col-lg-8"> */}
            <GlobalSearch placeholder="Search Research, People, Topics & More" />
            {/* </div> */}
          </div>
          <div className="right-button">
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
      <div className="position-relative mt-3 mb-3">
        <ResearchProfilePage
          searchId={paramsID.id}
          handleClickEvent={(value) => {
            setConnectModel(value);
          }}
        />
        {/*---------------------- connect popup -------------------------------*/}
        {connectModal && (
          <div className="connect-container box-shadow">
            <div className="d-flex align-items-center justify-content-between  gap-2">
              <div className="text-15-500 color-raisin-black">
                Connect With Experts In Your Fields
              </div>
              <i
                className="bi bi-x modal-close-button pointer"
                onClick={() => setConnectModel(false)}
              />
            </div>
            <div className="text-14-400 my-3">
              Join IFERP Premium Membership and connect with your scientific
              community
            </div>
            <div className="d-flex gap-2">
              <Button
                isSquare
                btnStyle="primary-dark"
                text="Join For Now"
                className="cps-10 cpe-10 h-35"
                onClick={() => {
                  navigate("/member/register");
                }}
              />
              <Button
                isSquare
                btnStyle="primary-outline"
                text="Login"
                className="cps-14 cpe-14 h-35"
                onClick={() => {
                  navigate("/member/login");
                }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="d-flex justify-content-between bg-white pt-3 pb-3 flex-wrap gap-2">
        <div>Copyright, IFERP 2024. All rights reserved.</div>
        <div>Terms and Conditions</div>
      </div>
    </div>
  );
};

export default GlobalResearchProfile;
