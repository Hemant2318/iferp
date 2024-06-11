import React, { useState } from "react";
import MySessions from "./MySessions";
import DetailsOfSession from "./DetailsOfSession";

const MemberSession = () => {
  const [formType, setFormType] = useState("allSession");

  return (
    <div id="member-session-container">
      {formType === "allSession" && <MySessions setFormType={setFormType} />}
      {formType === "sessionDetail" && <DetailsOfSession />}
    </div>
  );
};

export default MemberSession;
