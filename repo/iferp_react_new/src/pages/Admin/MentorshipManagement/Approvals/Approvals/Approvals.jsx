import React, { useState } from "react";
import MentorApprovals from "./MentorApprovals";
import SessionApprovals from "./SessionApprovals";
import "./approvals.scss";

const Approvals = () => {
  const [type, setType] = useState("mentor-approvals-overview");
  const activeClass = "p-2 pb-1 color-new-car text-16-500 me-4 bb-new-car";
  const inActiveClass = "p-2 pb-1 color-black-olive text-16-500 me-4 pointer";

  return (
    <div>
      <div id="approvals-continer" className="d-flex align-items-center mb-2">
        <div
          className={
            type === "mentor-approvals-overview" ? activeClass : inActiveClass
          }
          onClick={() => {
            setType("mentor-approvals-overview");
          }}
        >
          Mentor Approvals
        </div>
        <div
          className={
            type === "session-approvals-overview" ? activeClass : inActiveClass
          }
          onClick={() => {
            setType("session-approvals-overview");
          }}
        >
          Session Approvals
        </div>
      </div>
      {type === "mentor-approvals-overview" && <MentorApprovals />}
      {type === "session-approvals-overview" && <SessionApprovals />}
    </div>
  );
};

export default Approvals;
