import Card from "components/Layout/Card";
import React from "react";
import { useNavigate } from "react-router-dom";
import { icons } from "utils/constants";
import SpeakerApplications from "./SpeakerApplications";
import InvitationsReceived from "./InvitationsReceived";
import { useState } from "react";

const KeynoteSpeakerView = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("speaker-applications");

  const activeClass = "p-2 bg-new-car color-white text-16-500 me-4";
  const inActiveClass = "p-2 color-black-olive text-16-500 me-4 pointer";
  //   const handleRedirect = (data) => {
  //     navigate(
  //       `/${memberType}/career-support/applied-career-support/keynote-speaker/${data}`
  //     );
  //   };
  return (
    <div id="keynote-speaker-container">
      <Card className="d-flex align-items-center p-1 unset-br mb-3">
        <span
          className="d-flex"
          onClick={() => {
            navigate(-1);
          }}
        >
          <img src={icons.leftArrow} alt="back" className="h-21 me-3 pointer" />
        </span>
        <div
          className={
            type === "speaker-applications" ? activeClass : inActiveClass
          }
          onClick={() => {
            setType("speaker-applications");
          }}
        >
          My Speaker Applications
        </div>
        <div
          className={
            type === "invitation-received" ? activeClass : inActiveClass
          }
          onClick={() => {
            setType("invitation-received");
          }}
        >
          Invitations Received
        </div>
      </Card>
      {type === "speaker-applications" && <SpeakerApplications />}
      {type === "invitation-received" && <InvitationsReceived />}
    </div>
  );
};

export default KeynoteSpeakerView;
