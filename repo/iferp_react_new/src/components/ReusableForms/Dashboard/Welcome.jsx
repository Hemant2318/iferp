import Button from "components/form/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { icons, membershipType } from "utils/constants";
import {
  getDataFromLocalStorage,
  getUserType,
  objectToFormData,
} from "utils/helpers";
import VerifyModel from "./VerifyModel";
import { useDispatch } from "react-redux";
import {
  handelSpeakerEmailVerify,
  setIsGlobalProfilePreviewPopup,
} from "store/slices";

const Welcome = ({
  info,
  // profileCount,
  // setIsEditEducationDetails,
  researchProfileCount,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState(false);
  const [showEmailModel, setShowEmailModel] = useState(false);
  let {
    first_name,
    last_name,
    user_type,
    name,
    email_id,
    registration_email_otp_status,
  } = getDataFromLocalStorage();
  const findType = membershipType.find((o) => o.id === user_type)?.type;
  const access = {
    isLiveButton: true,
  };
  const handleRedirect = (blockType) => {
    const userType = getUserType();
    const blockRoute = {
      Learn: `/${userType}/digital-library`,
      Present: `/${userType}/conferences-and-events`,
      Publish: `/${userType}/publications`,
      Network: `/${userType}/network-management/network`,
      Mentor: `/${userType}/career-support`,
      Jobs: `/${userType}/career-support`,
    };
    navigate(blockRoute[blockType]);
  };
  const getVerifiyedEmail = async () => {
    const response = await dispatch(
      handelSpeakerEmailVerify(objectToFormData({ email: email_id }))
    );
    // setModalShow(false);
    if (response?.status === 200) {
      // const response = await dispatch(fetchUserDetails());
      setModalShow(false);
    }
  };
  return (
    <>
      <div className="col-md-6 cpe-40">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-4 mb-3">
              <img
                src={icons.dlaern}
                alt="dlaern"
                className="fill fit-image pointer"
                onClick={() => {
                  handleRedirect("Learn");
                }}
              />
            </div>
            <div className="col-md-4 mb-3">
              <img
                src={icons.dpresent}
                alt="dpresent"
                className="fill fit-image pointer"
                onClick={() => {
                  handleRedirect("Present");
                }}
              />
            </div>
            <div className="col-md-4 mb-3">
              <img
                src={icons.dpublish}
                alt="dpublish"
                className="fill fit-image pointer"
                onClick={() => {
                  handleRedirect("Publish");
                }}
              />
            </div>
            <div className="col-md-4 mb-3">
              <img
                src={icons.dnetwork}
                alt="dnetwork"
                className="fill fit-image pointer"
                onClick={() => {
                  handleRedirect("Network");
                }}
              />
            </div>
            <div className="col-md-4 mb-3">
              <img
                src={icons.dmentor}
                alt="dmentor"
                className="fill fit-image pointer"
                onClick={() => {
                  handleRedirect("Mentor");
                }}
              />
            </div>
            <div className="col-md-4 mb-3">
              <img
                src={icons.djobs}
                alt="djobs"
                className="fill fit-image pointer"
                onClick={() => {
                  handleRedirect("Jobs");
                }}
              />
            </div>
          </div>
        </div>
        {/* <img src={icons.userUashboard} alt="user" className="fill fit-image" /> */}
      </div>
      <div className="col-md-6 flex-grow-1 d-flex justify-content-center flex-column">
        <div className="font-poppins text-24-500-36 color-title-navy mb-3">
          Welcome back, {name ? `${name}` : `${first_name} ${last_name}`} !
        </div>
        {/* {profileCount && (
          <div className="d-flex justify-content-between mb-3 gap-3">
            <div className="d-flex justify-content-between flex-column flex-grow-1 pt-1">
              <div
                className={`d-flex justify-content-between ${
                  profileCount < 100 ? "" : "mb-2"
                }`}
              >
                <div className="text-14-500 color-moderate-blue">
                  Profile Status
                </div>
                <div className="text-14-500 color-subtitle-navy">
                  {profileCount >= 100 ? 100 : profileCount}%
                </div>
              </div>
              <div className="progress" style={{ height: "6px" }}>
                <div
                  className="progress-bar bg-lime-green"
                  role="progressbar"
                  style={{ width: `${profileCount}%` }}
                  aria-valuenow={profileCount}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
            {profileCount < 100 && (
              <Button
                isSquare
                text="Complete Profile"
                btnStyle="primary-outline"
                className="cps-20 cpe-20 rounded"
                onClick={() => {
                  setIsEditEducationDetails(true);
                }}
              />
            )}
          </div>
        )} */}
        {["2", "5"]?.includes(user_type) && researchProfileCount && (
          <div className="d-flex justify-content-between mb-3 gap-3">
            <div className="d-flex justify-content-between flex-column flex-grow-1 pt-1">
              <div
                className={`d-flex justify-content-between ${
                  researchProfileCount < 100 ? "" : "mb-2"
                }`}
              >
                <div className="text-14-500 color-moderate-blue">
                  Global Profile Status
                </div>
                <div className="text-14-500 color-subtitle-navy">
                  {researchProfileCount >= 100 ? 100 : researchProfileCount}%
                </div>
              </div>
              <div className="progress" style={{ height: "6px" }}>
                <div
                  className="progress-bar bg-lime-green"
                  role="progressbar"
                  style={{ width: `${researchProfileCount}%` }}
                  aria-valuenow={researchProfileCount}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>

            <Button
              isSquare
              text="Update Global Profile"
              btnStyle="primary-outline"
              className="cps-20 cpe-20 rounded"
              onClick={() => {
                dispatch(setIsGlobalProfilePreviewPopup(true));
              }}
            />
          </div>
        )}
        {registration_email_otp_status === "0" && (
          <div
            className="p-2 rounded-1 fw-bold"
            style={{ backgroundColor: "#FFEB82" }}
          >
            <i className="bi bi-exclamation-triangle-fill text-danger pe-2" />
            Verify your{" "}
            <span
              className="text-decoration-underline bold"
              role="button"
              style={{ color: "#2148C0" }}
              onClick={() => {
                setShowEmailModel(true);
                setModalShow(true);
              }}
            >
              Email ID
            </span>{" "}
            {/* and{" "}
          <span
            className="text-decoration-underline "
            role="button"
            style={{ color: "#2148C0" }}
            onClick={() => {
              setShowEmailModel(false);
              setModalShow(true);
            }}
          >
            Phone Number
          </span> */}
          </div>
        )}
        <div className="text-15-400-25 color-subtitle-navy w-75 mb-3">
          {info ||
            "Where you can access your membership benefits, stay up-to-date on the latest research, and connect with special interest communities and professionals from around the world."}
        </div>
        <div className="d-flex flex-wrap mt-2 gap-3 mb-2">
          <div id="track-status-id">
            <Button
              text="Track Status"
              isRounded
              btnStyle="primary-dark"
              className="cps-40 cpe-40"
              onClick={() => {
                navigate(`/${findType}/my-profile/my-events`);
              }}
            />
          </div>
          {access?.isLiveButton && (
            <Button
              isRounded
              icon={
                <div className="live-event-block me-2">
                  <div className="live-event-dot" />
                </div>
              }
              text="Live Events"
              btnStyle="primary-outline"
              className="cps-30 cpe-30"
              onClick={() => {
                navigate(`/${findType}/dashboard/live-events`);
              }}
            />
          )}
        </div>
      </div>
      <VerifyModel
        showEmailModel={showEmailModel}
        modalShow={modalShow}
        setModalShow={setModalShow}
        // onHide={() => setModalShow(false)}
        VerifyEmail={() => getVerifiyedEmail()}
      />
    </>
  );
};
export default Welcome;
