import { useState } from "react";
import { useParams } from "react-router-dom";
import Card from "components/Layout/Card";
import CareerSupport from "./CareerSupport";
import Collaboration from "./Collaboration";

const CareerManagement = () => {
  const params = useParams();
  const [type, setType] = useState(params?.type);
  const activeClass = "p-2 bg-new-car color-white text-16-500 me-4";
  const inActiveClass = "p-2 color-black-olive text-16-500 me-4 pointer";

  return (
    <div id="career-management-container">
      <Card className="d-flex align-items-center p-1 unset-br mb-3">
        <div
          className={type === "career-support" ? activeClass : inActiveClass}
          onClick={() => {
            setType("career-support");
          }}
        >
          Career Support
        </div>
        <div
          className={type === "collaboration" ? activeClass : inActiveClass}
          onClick={() => {
            setType("collaboration");
          }}
        >
          Collaboration
        </div>
      </Card>
      {type === "career-support" && <CareerSupport />}
      {type === "collaboration" && <Collaboration />}
    </div>
  );
};
export default CareerManagement;
