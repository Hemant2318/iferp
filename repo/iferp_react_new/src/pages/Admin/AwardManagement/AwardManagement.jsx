import { useNavigate, useParams } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import AwardWinner from "./AwardWinner";
import NominationDetails from "./NominationDetails";
import { getUserType } from "utils/helpers";

const AwardManagement = () => {
  const params = useParams();
  const navigate = useNavigate();

  const handleRedirect = (type) => {
    const userType = getUserType();
    navigate(`/${userType}/award-management/${type}`);
  };
  return (
    <div>
      <Tabs
        defaultActiveKey={params?.type}
        id="uncontrolled-tab-example"
        className="mb-3 gap-4"
      >
        <Tab
          eventKey="award-winners"
          title="Award Winners"
          onEnter={() => {
            handleRedirect("award-winners");
          }}
        >
          {params?.type === "award-winners" && <AwardWinner />}
        </Tab>
        <Tab
          eventKey="nomination-details"
          title="Nomination Details"
          onEnter={() => {
            handleRedirect("nomination-details");
          }}
        >
          {params?.type === "nomination-details" && <NominationDetails />}
        </Tab>
      </Tabs>
    </div>
  );
};
export default AwardManagement;
