import { useNavigate, useParams } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { institutionalRoute } from "utils/constants";
import IFERPActivityPlan from "../../Common/EventManagement/IFERPActivityPlan/IFERPActivityPlan";
import ActivityReports from "./ActivityReports";

const ActivityPlan = () => {
  const params = useParams();
  const navigate = useNavigate();

  const handleRedirect = (type) => {
    navigate(`${institutionalRoute.activityPlan}/${type}`);
  };
  return (
    <div>
      <Tabs
        defaultActiveKey={params?.type}
        id="uncontrolled-tab-example"
        className="mb-3 gap-4"
      >
        <Tab
          eventKey="iferp-plan"
          title="IFERP Plan"
          onEnter={() => {
            handleRedirect("iferp-plan");
          }}
        >
          {params?.type === "iferp-plan" && (
            <IFERPActivityPlan planType="IFERP" />
          )}
        </Tab>
        <Tab
          eventKey="institutional-plan"
          title="Institutional Plan"
          onEnter={() => {
            handleRedirect("institutional-plan");
          }}
        >
          {params?.type === "institutional-plan" && (
            <IFERPActivityPlan planType="MY" />
          )}
        </Tab>
        <Tab
          eventKey="activity-reports"
          title="Activity Reports"
          onEnter={() => {
            handleRedirect("activity-reports");
          }}
        >
          {params?.type === "activity-reports" && <ActivityReports />}
        </Tab>
      </Tabs>
    </div>
  );
};
export default ActivityPlan;
