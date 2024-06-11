import Card from "components/Layout/Card";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import AllMentors from "./AllMentors";
import MySubmissions from "./MySubmissions";
import "./Mentorship.scss";

const Mentorship = () => {
  const params = useParams();
  const { memberType, type } = params;
  const navigate = useNavigate();

  const redirect = (optionType) => {
    navigate(`/${memberType}/mentorship/mentee/${optionType}`);
  };

  const activeClass = "p-2 bg-new-car color-white text-16-500 me-4";
  const inActiveClass = "p-2 color-black-olive text-16-500 me-4 pointer";

  return (
    <div id="mentorship-user-container">
      <Card className="d-flex align-items-center justify-content-between p-1 unset-br mb-4">
        <div className="d-flex align-items-center">
          <div
            id="all-mentors-id"
            className={type === "all-mentors" ? activeClass : inActiveClass}
            onClick={() => {
              redirect("all-mentors");
            }}
          >
            All Mentors
          </div>
          <div
            id="my-submissions-id"
            className={type === "my-submissions" ? activeClass : inActiveClass}
            onClick={() => {
              redirect("my-submissions");
            }}
          >
            My Meetings
          </div>
        </div>
      </Card>

      {type === "all-mentors" && <AllMentors />}
      {type === "my-submissions" && <MySubmissions />}
    </div>
  );
};

export default Mentorship;
