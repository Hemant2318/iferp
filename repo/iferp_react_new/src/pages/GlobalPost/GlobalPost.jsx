import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "components/form/Button";
import PostDetails from "pages/Common/NetworkManagement/Network/Posts/PostDetails";
import { getDataFromLocalStorage } from "utils/helpers";
import { icons } from "utils/constants";
import Modal from "components/Layout/Modal";
import "./GlobalPost.scss";

const GlobalPost = () => {
  const navigate = useNavigate();
  const [connectModal, setConnectModel] = useState(false);

  let userId = getDataFromLocalStorage("id");
  return (
    <div className="container-md">
      {connectModal && (
        <Modal
          hideClose
          width="100%"
          size="sm"
          onHide={() => {
            setConnectModel(false);
          }}
        >
          <div>
            <div className="d-flex justify-content-center">
              <img src={icons.emptyPaperText} alt="emptyPaperText" />
            </div>
            <div className="text-center text-14-400 color-dark-silver my-3">
              For use this, Register with IFERP or Login if already have
              account.
            </div>
            <div className="d-flex justify-content-center gap-3">
              <Button
                isSquare
                btnStyle="primary-outline"
                text="Cancel"
                className="cps-35 cpe-35 h-35 text-14-500"
                onClick={() => {
                  setConnectModel(false);
                }}
              />
              <Button
                isSquare
                btnStyle="primary-dark"
                text="Join For Now"
                className="cps-10 cpe-10 h-35 text-14-500"
                onClick={() => {
                  navigate("/member/login");
                }}
              />
            </div>
          </div>
        </Modal>
      )}
      <nav id="global-navbar-container" className="navbar bg-white">
        <div className="main-con">
          <div className="left-logo">
            <img className="img-logo1" src={icons.logo} alt="img" />
          </div>
          <div className="center-search">
            {/* <div className="col-12 col-md-10 col-lg-8"> */}
            {/* <GlobalSearch placeholder="Search Research, People, Topics & More" /> */}
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
        <PostDetails setConnectModel={setConnectModel} />
      </div>
      <div className="d-flex justify-content-between bg-white pt-3 pb-3 flex-wrap gap-2">
        <div>Copyright, IFERP 2024. All rights reserved.</div>
        <div>Terms and Conditions</div>
      </div>
    </div>
  );
};

export default GlobalPost;
