import Card from "components/Layout/Card";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { icons } from "utils/constants";
import AllApplications from "./AllApplications";
import SendInvitations from "./SendInvitations";
import { getUserType } from "utils/helpers";

const BecomeKeynoteSpeaker = () => {
  const navigate = useNavigate();
  const params = useParams();
  const type = params?.type;
  const activeClass = "p-2 bg-new-car color-white text-16-500 me-4";
  const inActiveClass = "p-2 color-black-olive text-16-500 me-4 pointer";
  const handleRedirect = (data) => {
    const userType = getUserType();
    navigate(
      `/${userType}/career-management/${params.uId}/keynote-speaker/${data}`
    );
  };

  return (
    <div id="become-keynote-speaker-container">
      <Card className="d-flex align-items-center p-1 unset-br mb-3">
        <span
          className="d-flex"
          onClick={() => {
            if (localStorage.prevRoute) {
              navigate(localStorage.prevRoute);
            } else {
              navigate(-1);
            }
          }}
        >
          <img src={icons.leftArrow} alt="back" className="h-21 me-3 pointer" />
        </span>
        <div
          className={type === "all-applications" ? activeClass : inActiveClass}
          onClick={() => {
            handleRedirect("all-applications");
          }}
        >
          All Applications
        </div>
        <div
          className={type === "sent-invitation" ? activeClass : inActiveClass}
          onClick={() => {
            handleRedirect("sent-invitation");
          }}
        >
          Sent Invitations
        </div>
      </Card>
      {type === "all-applications" && <AllApplications />}
      {type === "sent-invitation" && <SendInvitations />}
    </div>
  );
};

export default BecomeKeynoteSpeaker;
