import Card from "components/Layout/Card";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { icons } from "utils/constants";
import MDetails from "./MDetails";
import MMentees from "./MMentees";
import "./MySessionDetails.scss";

const MySessionDetails = () => {
  const navigate = useNavigate();
  const [tabType, setTabType] = useState("session-details");
  const activeClass = "p-3 bg-new-car color-white text-16-500 me-3";
  const inActiveClass = "p-3 color-black-olive text-16-500 me-3 pointer";

  return (
    <div className="my-session-details-container">
      <Card className="d-flex align-items-center unset-br cps-15  cmb-20">
        <span
          className="d-flex"
          onClick={() => {
            navigate(-1);
          }}
        >
          <img
            src={icons.leftArrow}
            alt="back"
            className="h-21 me-3 pointer color-dark-blue"
          />
        </span>

        <div
          className={
            tabType === "session-details" ? activeClass : inActiveClass
          }
          onClick={() => {
            setTabType("session-details");
          }}
        >
          Session Details
        </div>
        <div
          className={tabType === "mentees" ? activeClass : inActiveClass}
          onClick={() => {
            setTabType("mentees");
          }}
        >
          Mentees
        </div>
      </Card>

      {tabType === "session-details" && <MDetails />}
      {tabType === "mentees" && <MMentees />}
    </div>
  );
};

export default MySessionDetails;
