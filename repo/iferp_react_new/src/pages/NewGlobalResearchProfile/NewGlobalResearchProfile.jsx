import Button from "components/form/Button";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { icons } from "utils/constants";
import Modal from "components/Layout/Modal";
import GlobalProfileFooter from "pages/Layout/GlobalProfileFooter";
import NewResearchProfilePage from "components/ReusableForms/MyProfile/NewResearchProfilePage/NewResearchProfilePage";
import GlobalProfileHeader from "pages/Layout/GlobalProfileHeader/GlobalProfileHeader";
import "./NewGlobalResearchProfile.scss";

const NewGlobalResearchProfile = () => {
  const navigate = useNavigate();
  const [connectModal, setConnectModel] = useState(false);
  let paramsID = useParams();

  return (
    <div className="" id="new-global-research-navbar-container">
      {/*----------------- navbar ------------------------*/}
      <GlobalProfileHeader placeholder="Search Conferences & Events" />

      {/* body */}
      <div
        className="position-relative mt-3 cps-50 cpe-50 cpb-20"
        id="new-global-research-body"
      >
        <NewResearchProfilePage
          searchId={paramsID.id}
          setConnectModel={setConnectModel}
        />
        {connectModal && (
          <Modal size="sm" hideClose onHide={setConnectModel} width="100%">
            {/* <div> */}
            <div className="d-flex justify-content-center">
              <img src={icons.emptyPaperText} alt="emptyPaperText" />
            </div>
            <div className="text-center text-14-400 color-dark-silver my-3">
              For use this, Register with IFERP or Login if already have
              account.
            </div>
            <div className="d-flex gap-3 justify-content-center">
              <Button
                text="Cancel"
                btnStyle="primary-outline"
                className="w-100 d-flex align-items-center justify-content-center btn-square cps-35 cpe-35 h-35 text-14-500"
                onClick={() => {
                  setConnectModel(false);
                }}
              />
              <Button
                text="Join For Now"
                btnStyle="primary-dark"
                className="w-100 d-flex align-items-center justify-content-center btn-square cps-10 cpe-10 h-35 text-14-500"
                onClick={() => {
                  navigate("/member/register");
                }}
              />
            </div>
            {/* </div> */}
          </Modal>
        )}
      </div>
      {/* footer */}
      <GlobalProfileFooter />
    </div>
  );
};

export default NewGlobalResearchProfile;
