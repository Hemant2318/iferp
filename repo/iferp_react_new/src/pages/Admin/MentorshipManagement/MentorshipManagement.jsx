import Card from "components/Layout/Card";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AllMentors from "./AllMentors";
import AllMentees from "./AllMentees";
import Payment from "./Payment";
import "./MentorshipManagement.scss";
import Approvals from "./Approvals/Approvals";
import Button from "components/form/Button";
import PlatformFeeDetailsPopup from "./Approvals/Approvals/PlatformFeeDetailsPopup";

const MentorshipManagement = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [isFeeDetailsPopup, setIsFeeDetailsPopup] = useState(false);
  const { type } = params;
  const activeClass = "p-2 bg-new-car color-white text-15-400";
  const inActiveClass = "p-2 color-dark-blue text-15-400 pointer";
  return (
    <div id="mentorship-management-component">
      <Card className="d-flex align-items-center justify-content-between p-1 unset-br mb-3 flex-wrap">
        <div className="d-flex align-items-center flex-wrap gap-2">
          <div
            className={type === "all-mentors" ? activeClass : inActiveClass}
            onClick={() => {
              navigate(`/admin/mentorship-management/all-mentors`);
            }}
          >
            All Mentors
          </div>
          <div
            className={type === "all-mentees" ? activeClass : inActiveClass}
            onClick={() => {
              navigate(`/admin/mentorship-management/all-mentees`);
            }}
          >
            All Mentees
          </div>
          <div
            className={type === "payment" ? activeClass : inActiveClass}
            onClick={() => {
              navigate(`/admin/mentorship-management/payment`);
            }}
          >
            Payment
          </div>
          <div
            className={type === "approval" ? activeClass : inActiveClass}
            onClick={() => {
              navigate(`/admin/mentorship-management/approval`);
            }}
          >
            Approvals
          </div>
        </div>
        <Button
          btnStyle=" mw-115 h-45 color-dark-navy-blue light-blue-outline text-nowrap"
          text="Update Platform Fee"
          onClick={() => {
            setIsFeeDetailsPopup(true);
          }}
        />
      </Card>
      {type === "all-mentors" && <AllMentors />}
      {type === "all-mentees" && <AllMentees />}
      {type === "payment" && <Payment />}
      {type === "approval" && <Approvals />}
      {isFeeDetailsPopup && (
        <PlatformFeeDetailsPopup setIsFeeDetailsPopup={setIsFeeDetailsPopup} />
      )}
    </div>
  );
};

export default MentorshipManagement;
