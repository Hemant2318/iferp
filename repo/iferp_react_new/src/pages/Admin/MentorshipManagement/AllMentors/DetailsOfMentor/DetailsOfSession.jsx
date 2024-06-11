import React, { useState } from "react";
import MentorSessionDetails from "./MentorSessionDetails";
import Mentees from "./Mentees";
import { useNavigate, useParams } from "react-router-dom";
import { icons } from "utils/constants";
import Card from "components/Layout/Card";

const DetailsOfSession = () => {
  const [tabId, setTabId] = useState("session-details");
  const params = useParams();
  const { sType } = params;
  const navigate = useNavigate();
  const activeClass = "p-2 color-new-car text-15-500 me-4 primary-underline";
  const inActiveClass = "p-2 color-5068 text-15-500 me-4 pointer";
  const newActiveClass = "p-2 bg-new-car color-white text-15-400";

  return (
    <div id="details-of-session-container">
      <Card
        className={`d-flex cmb-20 cps-15 ${
          sType &&
          `align-items-center detail-card-membership cpt-15 cpe-15 cpb-15 gap-2`
        }`}
      >
        {sType && (
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
        )}
        <div
          className={
            tabId === "session-details"
              ? sType
                ? newActiveClass
                : activeClass
              : inActiveClass
          }
          onClick={() => {
            setTabId("session-details");
          }}
        >
          Session Details
        </div>
        <div
          className={
            tabId === "mentees"
              ? sType
                ? newActiveClass
                : activeClass
              : inActiveClass
          }
          onClick={() => {
            setTabId("mentees");
          }}
        >
          Mentees
        </div>
      </Card>

      {tabId === "session-details" && <MentorSessionDetails />}
      {tabId === "mentees" && <Mentees />}
    </div>
  );
};

export default DetailsOfSession;
