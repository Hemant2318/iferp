import Card from "components/Layout/Card";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { icons } from "utils/constants";
import MemberSession from "./MemberSession";
import MemberPayment from "./MemberPayment/MemberPayment";
import "./DetailsOfMentor.scss";
import { useSelector } from "react-redux";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  titleCaseString,
} from "utils/helpers";

const DetailsOfMentor = () => {
  const navigate = useNavigate();
  const { singleMentorProfileData } = useSelector((state) => ({
    singleMentorProfileData: state.mentorshipManagement.singleMentorProfileData,
  }));
  const mentorId = singleMentorProfileData?.mentor_id;
  const [type, setType] = useState("member");
  const activeClass = "p-2 bg-new-car color-white text-16-500 me-4";
  const inActiveClass = "p-2 color-black-olive text-16-500 me-4 pointer";
  const { name } = getFromLocalStorage("setViewName");
  return (
    <div id="details-mentor-container">
      <Card className="d-flex align-items-center p-1 unset-br mb-3">
        <span
          className="d-flex"
          onClick={() => {
            removeFromLocalStorage("setViewName");
            navigate(-1);
          }}
        >
          <img src={icons.leftArrow} alt="back" className="h-21 me-3 pointer" />
        </span>
        <div
          className={type === "member" ? activeClass : inActiveClass}
          onClick={() => {
            setType("member");
          }}
        >
          {titleCaseString(singleMentorProfileData?.name || name)}
        </div>
        <div
          className={type === "payment" ? activeClass : inActiveClass}
          onClick={() => {
            setType("payment");
          }}
        >
          Payment
        </div>
      </Card>

      {type === "member" && <MemberSession />}
      {type === "payment" && <MemberPayment mentorId={mentorId} />}
    </div>
  );
};

export default DetailsOfMentor;
