import { useNavigate } from "react-router-dom";
import { icons, studentRoute } from "utils/constants";
import Card from "components/Layout/Card";
import "./DashboardFlag.scss";

const Career = () => {
  const navigate = useNavigate();
  const careerList = [
    "Get an Internship Opportunity",
    "Opportunity for Industrial visits and workshops",
    "Get Resume Building Guidance from experts",
    "Participate in IFERP Job Fair & get an amazing Job",
  ];

  return (
    <Card className="cps-24 cpe-24 cpt-24 cpb-12 h-100">
      <div className="d-flex justify-content-between cmb-24">
        <div
          className="text-18-500-27 color-title-navy font-poppins"
          id="career-opportunities-id"
        >
          Career Opportunities
        </div>
        <div
          className="text-15-400-16 color-new-car pointer  "
          onClick={() => {
            navigate(studentRoute.careerSupport);
          }}
        >
          <u className=" ">View All</u>
        </div>
      </div>
      <div id="career-list-container">
        {careerList?.map((elem, index) => {
          return (
            <div className="d-flex align-items-center career-block" key={index}>
              <div className="me-3 indicator-block">
                <img src={icons.studentCareer} alt="indi" />
                <span className="text-block text-14-500 color-subtitle-navy">
                  {index + 1 < 9 ? `0${index + 1}` : index + 1}
                </span>
              </div>
              <div className="text-16-500 color-subtitle-navy  ">{elem}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
export default Career;
