import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/Layout/Card";
import { getDataFromLocalStorage } from "utils/helpers";
import Careers from "./Careers";
import AppliedCareerSupport from "./AppliedCareerSupport";

const CareerSupport = () => {
  const navigate = useNavigate();

  const params = useParams();
  const { memberType, type } = params;

  const redirect = (optionType) => {
    navigate(`/${memberType}/career-support/${optionType}`);
  };
  const userType = getDataFromLocalStorage("user_type");
  const access = {
    isTab: userType !== "0",
  };

  const activeClass = "p-2 bg-new-car color-white text-16-500 me-4";
  const inActiveClass = "p-2 color-black-olive text-16-500 me-4 pointer";
  return (
    <>
      {access.isTab && (
        <Card className="d-flex align-items-center justify-content-between p-1 unset-br mb-5">
          <div className="d-flex align-items-center">
            <div
              id="career-support-menu-id"
              className={type === "careers" ? activeClass : inActiveClass}
              onClick={() => {
                redirect("careers");
              }}
            >
              Career Support
            </div>
            <div
              id="applied-career-support-id"
              className={
                type === "applied-career-support" ? activeClass : inActiveClass
              }
              onClick={() => {
                redirect("applied-career-support");
              }}
            >
              Applied Career Support
            </div>
          </div>
        </Card>
      )}
      {type === "careers" && <Careers />}
      {type === "applied-career-support" && <AppliedCareerSupport />}
    </>
  );
};
export default CareerSupport;
